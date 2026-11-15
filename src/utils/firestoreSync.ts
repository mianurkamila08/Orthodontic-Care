import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  Unsubscribe,
} from "firebase/firestore";
import {
  auth,
  secondaryAuth,
  db,
  BOOTSTRAPPED_ADMIN_EMAIL,
  OperationType,
  handleFirestoreError,
} from "../firebase";
import {
  Patient,
  SOAPExam,
  MonitoringLog,
  PatientAccessLog,
  AppUser,
  BrushingChecklistData,
  BrushingMonthData,
} from "../types";
import { initialPatients, initialExams, initialAccessLogs } from "../data/initialData";
import { seedDefaultBrushingChecklist } from "./brushingUtils";

export const SYNTHETIC_EMAIL_DOMAIN = "orthocare.clinic";

export function normalizeUsername(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9._-]/g, "");
}

export function usernameToAuthEmail(usernameOrEmail: string): string {
  const trimmed = usernameOrEmail.trim().toLowerCase();
  if (trimmed.includes("@")) {
    return trimmed;
  }
  const clean = normalizeUsername(trimmed);
  return `${clean || "pasien"}@${SYNTHETIC_EMAIL_DOMAIN}`;
}

export function extractUsernameFromEmail(email?: string | null): string {
  const clean = (email || "").trim().toLowerCase();
  if (!clean) return "";
  return clean.split("@")[0] || clean;
}

interface PendingRegistrationMeta {
  fullName: string;
  username: string;
  clinicPassword: string;
}

let pendingRegistrationMeta: PendingRegistrationMeta | null = null;

function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefined(item)) as unknown as T;
  }
  if (value !== null && typeof value === "object" && value.constructor === Object) {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== undefined) {
        result[k] = stripUndefined(v);
      }
    }
    return result as T;
  }
  return value;
}

export function isBootstrappedAdminEmail(email?: string | null, emailVerified?: boolean): boolean {
  return (
    Boolean(emailVerified) &&
    (email || "").trim().toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()
  );
}

export async function checkIsAuthorizedDentist(firebaseUser: FirebaseUser): Promise<boolean> {
  if (isBootstrappedAdminEmail(firebaseUser.email, firebaseUser.emailVerified)) {
    return true;
  }
  const adminRef = doc(db, "admins", firebaseUser.uid);
  try {
    const snap = await getDoc(adminRef);
    return snap.exists();
  } catch {
    return false;
  }
}

export interface ResolvedFirebaseSession {
  role: "dentist" | "patient";
  isDentistAuthorized: boolean;
  fullName: string;
  username: string;
  email: string;
  uid: string;
  patientId: string;
  authProvider: "google" | "password";
  roleNotice?: string;
}

export async function loginWithUsernameOrPassword(
  usernameOrEmail: string,
  password: string
): Promise<void> {
  const authEmail = usernameToAuthEmail(usernameOrEmail);
  await signInWithEmailAndPassword(auth, authEmail, password);
}

export async function registerPatientWithUsername(params: {
  fullName: string;
  username: string;
  password: string;
}): Promise<void> {
  const cleanUsername = normalizeUsername(params.username);
  if (!cleanUsername || cleanUsername.length < 3) {
    throw new Error("Username minimal 3 karakter (huruf/angka/titik/garis bawah).");
  }
  const authEmail = usernameToAuthEmail(cleanUsername);
  pendingRegistrationMeta = {
    fullName: params.fullName.trim(),
    username: cleanUsername,
    clinicPassword: params.password,
  };
  try {
    const cred = await createUserWithEmailAndPassword(auth, authEmail, params.password);
    await updateProfile(cred.user, { displayName: params.fullName.trim() });
  } catch (err) {
    pendingRegistrationMeta = null;
    throw err;
  }
}

export async function createClinicAccountAsDentist(params: {
  role: "dentist" | "patient";
  username: string;
  password: string;
  fullName: string;
  patientId?: string;
  adminUid: string;
}): Promise<{ uid: string; username: string; authEmail: string; patientId?: string }> {
  const cleanUsername = normalizeUsername(params.username);
  if (!cleanUsername || cleanUsername.length < 3) {
    throw new Error("Username minimal 3 karakter (huruf, angka, titik, atau underscore).");
  }
  if (!params.password || params.password.length < 6) {
    throw new Error("Kata sandi minimal 6 karakter.");
  }

  const authEmail = usernameToAuthEmail(params.username.includes("@") ? params.username : cleanUsername);
  const fullName = params.fullName.trim() || cleanUsername;

  const cred = await createUserWithEmailAndPassword(secondaryAuth, authEmail, params.password);
  const newUid = cred.user.uid;
  try {
    await updateProfile(cred.user, { displayName: fullName });
  } catch {
    // non-fatal
  } finally {
    await signOut(secondaryAuth);
  }

  let resolvedPatientId = params.patientId || "";
  const nowIso = new Date().toISOString();

  if (params.role === "dentist") {
    try {
      await setDoc(doc(db, "admins", newUid), {
        uid: newUid,
        fullName,
        email: authEmail,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `admins/${newUid}`);
    }
  } else {
    if (resolvedPatientId) {
      // Link existing RME + transfer ownerUid to new patient UID so they can access historical exams/logs
      try {
        await updateDoc(doc(db, "patients", resolvedPatientId), {
          ownerUid: newUid,
          patientUsername: cleanUsername,
          updatedAt: serverTimestamp(),
        });

        const [examSnap, logSnap, checkSnap] = await Promise.all([
          getDocs(query(collection(db, "exams"), where("patientId", "==", resolvedPatientId))),
          getDocs(query(collection(db, "logs"), where("patientId", "==", resolvedPatientId))),
          getDoc(doc(db, "brushingChecklists", resolvedPatientId)),
        ]);

        const batch = writeBatch(db);
        examSnap.docs.forEach((d) => batch.update(d.ref, { ownerUid: newUid, updatedAt: serverTimestamp() }));
        logSnap.docs.forEach((d) => batch.update(d.ref, { ownerUid: newUid, updatedAt: serverTimestamp() }));
        if (checkSnap.exists()) {
          batch.update(checkSnap.ref, { ownerUid: newUid, updatedAt: serverTimestamp() });
        }
        await batch.commit();
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `patients/${resolvedPatientId}`);
      }
    } else {
      resolvedPatientId = `RM-${Date.now().toString().slice(-6)}`;
      try {
        await setDoc(doc(db, "patients", resolvedPatientId), {
          id: resolvedPatientId,
          ownerUid: newUid,
          dentistUid: params.adminUid,
          patientEmail: authEmail.endsWith(`@${SYNTHETIC_EMAIL_DOMAIN}`) ? "" : authEmail,
          patientUsername: cleanUsername,
          name: fullName,
          nik: "",
          dob: "2000-01-01",
          gender: "Perempuan",
          phone: "",
          address: "Dibuatkan oleh Dokter Klinik",
          bloodType: "O",
          allergies: "Tidak ada",
          accessCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `patients/${resolvedPatientId}`);
      }
    }
  }

  try {
    await setDoc(
      doc(db, "users", newUid),
      stripUndefined({
        uid: newUid,
        role: params.role,
        fullName,
        username: cleanUsername,
        patientId: resolvedPatientId || undefined,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    );

    await setDoc(doc(db, "users", newUid, "private", "info"), {
      uid: newUid,
      email: authEmail,
      username: cleanUsername,
      clinicPassword: params.password,
      passwordUpdatedAt: nowIso,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${newUid}`);
  }

  return {
    uid: newUid,
    username: cleanUsername,
    authEmail,
    patientId: resolvedPatientId || undefined,
  };
}

export async function updateUserPasswordSynced(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error("Sesi pengguna tidak ditemukan.");
  }
  const hasPasswordProvider = user.providerData.some((p) => p.providerId === "password");
  if (!hasPasswordProvider) {
    throw new Error("Akun ini masuk menggunakan Google. Ubah kata sandi langsung melalui Akun Google Anda.");
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);

  const nowIso = new Date().toISOString();
  const privateRef = doc(db, "users", user.uid, "private", "info");
  try {
    const snap = await getDoc(privateRef);
    if (snap.exists()) {
      await updateDoc(privateRef, {
        clinicPassword: newPassword,
        passwordUpdatedAt: nowIso,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(privateRef, {
        uid: user.uid,
        email: user.email,
        username: extractUsernameFromEmail(user.email),
        clinicPassword: newPassword,
        passwordUpdatedAt: nowIso,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/private/info`);
  }
}

export async function syncAuthenticatedGoogleUser(
  firebaseUser: FirebaseUser,
  requestedRole: "dentist" | "patient"
): Promise<ResolvedFirebaseSession> {
  const pendingMeta = pendingRegistrationMeta;
  pendingRegistrationMeta = null;

  const uid = firebaseUser.uid;
  const email = (firebaseUser.email || "").trim().toLowerCase();
  const authProvider: "google" | "password" = firebaseUser.providerData.some(
    (p) => p.providerId === "password"
  )
    ? "password"
    : "google";

  const isDentistAuthorized = await checkIsAuthorizedDentist(firebaseUser);
  let resolvedRole: "dentist" | "patient" = "patient";
  let roleNotice: string | undefined;

  if (requestedRole === "dentist") {
    if (isDentistAuthorized) {
      resolvedRole = "dentist";
    } else {
      resolvedRole = "patient";
      roleNotice =
        "Akun ini belum terdaftar sebagai Dokter Klinik, sehingga Anda masuk sebagai Pasien RME.";
    }
  } else {
    resolvedRole = "patient";
  }

  if (isBootstrappedAdminEmail(email, firebaseUser.emailVerified)) {
    try {
      await setDoc(doc(db, "admins", uid), {
        uid,
        fullName: "Mia Nurkamila, A.Md.Kes",
        email,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `admins/${uid}`);
    }
  }

  const userRef = doc(db, "users", uid);
  let existingUserSnap;
  try {
    existingUserSnap = await getDoc(userRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
  }

  const existingUserData = existingUserSnap.exists() ? existingUserSnap.data() : null;
  const resolvedUsername =
    pendingMeta?.username ||
    (existingUserData?.username as string | undefined) ||
    extractUsernameFromEmail(email);

  const resolvedDisplayName = (
    pendingMeta?.fullName ||
    (existingUserData?.fullName as string | undefined) ||
    firebaseUser.displayName ||
    resolvedUsername ||
    "Pengguna Ortho-Care"
  ).trim();

  let linkedPatientId = (existingUserData?.patientId as string | undefined) || "";

  if (resolvedRole === "patient" || !linkedPatientId) {
    let matchedPatientId = linkedPatientId;

    // Only auto-match by patientEmail when Firebase Auth verifies email ownership (Google Sign-In)
    if (!matchedPatientId && email && firebaseUser.emailVerified) {
      try {
        const byEmailQ = query(collection(db, "patients"), where("patientEmail", "==", email));
        const byEmailSnap = await getDocs(byEmailQ);
        if (!byEmailSnap.empty) {
          const docSnap = byEmailSnap.docs[0];
          matchedPatientId = docSnap.id;
          const pData = docSnap.data();
          if (pData.ownerUid !== uid) {
            await updateDoc(doc(db, "patients", matchedPatientId), {
              ownerUid: uid,
              updatedAt: serverTimestamp(),
            });
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, "patients");
      }
    }

    if (!matchedPatientId) {
      try {
        const byUidQ = query(collection(db, "patients"), where("ownerUid", "==", uid));
        const byUidSnap = await getDocs(byUidQ);
        if (!byUidSnap.empty) {
          matchedPatientId = byUidSnap.docs[0].id;
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, "patients");
      }
    }

    if (!matchedPatientId && resolvedRole === "patient") {
      matchedPatientId = `RM-${Date.now().toString().slice(-6)}`;
      try {
        await setDoc(doc(db, "patients", matchedPatientId), {
          id: matchedPatientId,
          ownerUid: uid,
          patientEmail: authProvider === "google" ? email : "",
          patientUsername: resolvedUsername,
          name: resolvedDisplayName,
          nik: "",
          dob: "2000-01-01",
          gender: "Perempuan",
          phone: "",
          address:
            authProvider === "google"
              ? "Terdaftar via Google Sign-In"
              : "Terdaftar via Username & Password",
          bloodType: "O",
          allergies: "Tidak ada",
          accessCount: 1,
          lastAccessAt: new Date().toISOString(),
          lastAccessAction:
            authProvider === "google" ? "Masuk via Google Sign-In" : "Masuk via Username & Password",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `patients/${matchedPatientId}`);
      }
    }

    if (matchedPatientId) {
      linkedPatientId = matchedPatientId;
    }
  }

  const finalFullName =
    resolvedRole === "dentist" && isBootstrappedAdminEmail(email, firebaseUser.emailVerified)
      ? "Mia Nurkamila, A.Md.Kes"
      : resolvedDisplayName;

  const profilePayload = stripUndefined({
    uid,
    role: resolvedRole,
    fullName: finalFullName,
    username: resolvedUsername,
    patientId: linkedPatientId || undefined,
    updatedAt: serverTimestamp(),
  });

  try {
    if (existingUserSnap.exists()) {
      await updateDoc(userRef, profilePayload);
    } else {
      await setDoc(userRef, {
        ...profilePayload,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
  }

  const privateRef = doc(db, "users", uid, "private", "info");
  try {
    const privateSnap = await getDoc(privateRef);
    const nowIso = new Date().toISOString();
    if (privateSnap.exists()) {
      await updateDoc(
        privateRef,
        stripUndefined({
          uid,
          email,
          username: resolvedUsername,
          clinicPassword: pendingMeta?.clinicPassword,
          passwordUpdatedAt: pendingMeta ? nowIso : undefined,
          updatedAt: serverTimestamp(),
        })
      );
    } else {
      await setDoc(
        privateRef,
        stripUndefined({
          uid,
          email,
          username: resolvedUsername,
          clinicPassword: pendingMeta?.clinicPassword,
          passwordUpdatedAt: pendingMeta ? nowIso : undefined,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid}/private/info`);
  }

  return {
    role: resolvedRole,
    isDentistAuthorized,
    fullName: finalFullName,
    username: resolvedUsername,
    email,
    uid,
    patientId: linkedPatientId,
    authProvider,
    roleNotice,
  };
}

export async function seedClinicDataIfEmpty(adminUid: string): Promise<void> {
  try {
    const patientsSnap = await getDocs(collection(db, "patients"));
    if (!patientsSnap.empty) return;

    const batch = writeBatch(db);

    const seedLogs: MonitoringLog[] = [
      {
        id: "L-1",
        patientId: "P-101",
        date: "2026-07-09",
        alignerWearHours: 22,
        painLevel: 5,
        brushedCount: 3,
        waxUsed: true,
        notes: "Gigi ngilu setelah pemasangan kawat baru",
      },
      {
        id: "L-2",
        patientId: "P-101",
        date: "2026-07-10",
        alignerWearHours: 23,
        painLevel: 3,
        brushedCount: 3,
        waxUsed: false,
        notes: "Sariawan mereda, ngilu berkurang",
      },
      {
        id: "L-3",
        patientId: "P-101",
        date: "2026-07-11",
        alignerWearHours: 21,
        painLevel: 2,
        brushedCount: 4,
        waxUsed: false,
        notes: "Sikat gigi sela terasa sangat membantu",
      },
      {
        id: "L-4",
        patientId: "P-102",
        date: "2026-07-11",
        alignerWearHours: 22,
        painLevel: 1,
        brushedCount: 3,
        waxUsed: false,
        notes: "Karet elastis terpasang dengan baik",
      },
    ];

    const patientEmailMap: Record<string, string> = {
      "P-101": "aditya.pratama@gmail.com",
      "P-102": "siti.rahmawati@gmail.com",
      "P-103": "rizky.ramadhan@gmail.com",
      "RM-2604-1066": BOOTSTRAPPED_ADMIN_EMAIL,
    };

    for (const p of initialPatients) {
      const pRef = doc(db, "patients", p.id);
      batch.set(
        pRef,
        stripUndefined({
          ...p,
          ownerUid: adminUid,
          dentistUid: adminUid,
          patientEmail: patientEmailMap[p.id] || "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    }

    for (const ex of initialExams) {
      const eRef = doc(db, "exams", ex.id);
      batch.set(
        eRef,
        stripUndefined({
          ...ex,
          ownerUid: adminUid,
          dentistUid: adminUid,
          patientEmail: patientEmailMap[ex.patientId] || "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    }

    for (const l of seedLogs) {
      const lRef = doc(db, "logs", l.id);
      batch.set(
        lRef,
        stripUndefined({
          ...l,
          ownerUid: adminUid,
          dentistUid: adminUid,
          patientEmail: patientEmailMap[l.patientId] || "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    }

    for (const acc of initialAccessLogs) {
      const aRef = doc(db, "accessLogs", acc.id);
      batch.set(
        aRef,
        stripUndefined({
          ...acc,
          ownerUid: adminUid,
          dentistUid: adminUid,
          patientEmail: patientEmailMap[acc.patientId] || "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    }

    const seededChecklist = seedDefaultBrushingChecklist({});
    for (const [patId, months] of Object.entries(seededChecklist)) {
      const cRef = doc(db, "brushingChecklists", patId);
      batch.set(cRef, {
        patientId: patId,
        ownerUid: adminUid,
        dentistUid: adminUid,
        patientEmail: patientEmailMap[patId] || "",
        months,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "patients");
  }
}

export function subscribeClinicCollections(
  firebaseUser: FirebaseUser,
  role: "dentist" | "patient",
  callbacks: {
    onPatients: (items: Patient[]) => void;
    onExams: (items: SOAPExam[]) => void;
    onLogs: (items: MonitoringLog[]) => void;
    onAccessLogs: (items: PatientAccessLog[]) => void;
    onChecklists: (data: BrushingChecklistData) => void;
    onUsers?: (users: AppUser[]) => void;
  }
): () => void {
  const unsubscribers: Unsubscribe[] = [];
  const uid = firebaseUser.uid;
  const email = (firebaseUser.email || "").trim().toLowerCase();
  const isBootstrapped = isBootstrappedAdminEmail(email, firebaseUser.emailVerified);

  const normalizeDoc = <T extends { id?: string }>(docSnap: any): T => {
    const raw = docSnap.data() || {};
    return {
      ...raw,
      id: raw.id || docSnap.id,
      createdAt:
        typeof raw.createdAt === "string"
          ? raw.createdAt
          : raw.createdAt?.toDate
          ? raw.createdAt.toDate().toISOString()
          : new Date().toISOString(),
    } as T;
  };

  if (role === "dentist") {
    const patientsQ = isBootstrapped
      ? collection(db, "patients")
      : query(collection(db, "patients"), where("dentistUid", "==", uid));
    unsubscribers.push(
      onSnapshot(
        patientsQ,
        (snap) => callbacks.onPatients(snap.docs.map((d) => normalizeDoc<Patient>(d))),
        (err) => handleFirestoreError(err, OperationType.LIST, "patients")
      )
    );

    const examsQ = isBootstrapped
      ? collection(db, "exams")
      : query(collection(db, "exams"), where("dentistUid", "==", uid));
    unsubscribers.push(
      onSnapshot(
        examsQ,
        (snap) => callbacks.onExams(snap.docs.map((d) => normalizeDoc<SOAPExam>(d))),
        (err) => handleFirestoreError(err, OperationType.LIST, "exams")
      )
    );

    const logsQ = isBootstrapped
      ? collection(db, "logs")
      : query(collection(db, "logs"), where("dentistUid", "==", uid));
    unsubscribers.push(
      onSnapshot(
        logsQ,
        (snap) => callbacks.onLogs(snap.docs.map((d) => normalizeDoc<MonitoringLog>(d))),
        (err) => handleFirestoreError(err, OperationType.LIST, "logs")
      )
    );

    const accessQ = isBootstrapped
      ? collection(db, "accessLogs")
      : query(collection(db, "accessLogs"), where("dentistUid", "==", uid));
    unsubscribers.push(
      onSnapshot(
        accessQ,
        (snap) => {
          const items = snap.docs.map((d) => normalizeDoc<PatientAccessLog>(d));
          items.sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""));
          callbacks.onAccessLogs(items);
        },
        (err) => handleFirestoreError(err, OperationType.LIST, "accessLogs")
      )
    );

    const checkQ = isBootstrapped
      ? collection(db, "brushingChecklists")
      : query(collection(db, "brushingChecklists"), where("dentistUid", "==", uid));
    unsubscribers.push(
      onSnapshot(
        checkQ,
        (snap) => {
          const map: BrushingChecklistData = {};
          for (const d of snap.docs) {
            const raw = d.data();
            map[raw.patientId || d.id] = (raw.months || {}) as Record<string, BrushingMonthData>;
          }
          callbacks.onChecklists(map);
        },
        (err) => handleFirestoreError(err, OperationType.LIST, "brushingChecklists")
      )
    );

    if (isBootstrapped && callbacks.onUsers) {
      unsubscribers.push(
        onSnapshot(
          collection(db, "users"),
          async (snap) => {
            const items: AppUser[] = await Promise.all(
              snap.docs.map(async (d) => {
                const raw = d.data();
                const userUid = (raw.uid || d.id) as string;
                let privData: Record<string, unknown> = {};
                try {
                  const privSnap = await getDoc(doc(db, "users", userUid, "private", "info"));
                  if (privSnap.exists()) {
                    privData = privSnap.data() || {};
                  }
                } catch {
                  // ignore individual private fetch errors
                }

                const privEmail = (privData.email as string | undefined) || "";
                const fallbackUname = (raw.username || privData.username || raw.fullName || userUid)
                  .toString()
                  .toLowerCase()
                  .replace(/[^a-z0-9._-]/g, "_")
                  .slice(0, 32);

                const isSynthetic = privEmail.endsWith(`@${SYNTHETIC_EMAIL_DOMAIN}`);
                const hasClinicPass = typeof privData.clinicPassword === "string" && privData.clinicPassword.length > 0;

                return {
                  uid: userUid,
                  email: isSynthetic ? "" : privEmail,
                  username: (raw.username as string | undefined) || fallbackUname,
                  password: (privData.clinicPassword as string | undefined) || undefined,
                  passwordUpdatedAt: (privData.passwordUpdatedAt as string | undefined) || undefined,
                  authProvider: hasClinicPass || isSynthetic ? "password" : "google",
                  role: raw.role === "dentist" ? "dentist" : "patient",
                  patientId: raw.patientId,
                  fullName: raw.fullName || "Pengguna Ortho-Care",
                  createdAt:
                    typeof raw.createdAt === "string"
                      ? raw.createdAt
                      : raw.createdAt?.toDate
                      ? raw.createdAt.toDate().toISOString()
                      : new Date().toISOString(),
                };
              })
            );
            callbacks.onUsers?.(items);
          },
          (err) => handleFirestoreError(err, OperationType.LIST, "users")
        )
      );
    }
  } else {
    // Patient queries merged from ownerUid and patientEmail so both pre-linked & self-registered data load seamlessly
    const mergeById = <T extends { id: string }>(a: T[], b: T[]): T[] => {
      const map = new Map<string, T>();
      for (const item of a) map.set(item.id, item);
      for (const item of b) map.set(item.id, item);
      return Array.from(map.values());
    };

    let patByUid: Patient[] = [];
    let patByEmail: Patient[] = [];
    unsubscribers.push(
      onSnapshot(
        query(collection(db, "patients"), where("ownerUid", "==", uid)),
        (snap) => {
          patByUid = snap.docs.map((d) => normalizeDoc<Patient>(d));
          callbacks.onPatients(mergeById(patByUid, patByEmail));
        },
        (err) => handleFirestoreError(err, OperationType.LIST, "patients")
      )
    );
    if (email) {
      unsubscribers.push(
        onSnapshot(
          query(collection(db, "patients"), where("patientEmail", "==", email)),
          (snap) => {
            patByEmail = snap.docs.map((d) => normalizeDoc<Patient>(d));
            callbacks.onPatients(mergeById(patByUid, patByEmail));
          },
          (err) => handleFirestoreError(err, OperationType.LIST, "patients")
        )
      );
    }

    let exByUid: SOAPExam[] = [];
    let exByEmail: SOAPExam[] = [];
    unsubscribers.push(
      onSnapshot(
        query(collection(db, "exams"), where("ownerUid", "==", uid)),
        (snap) => {
          exByUid = snap.docs.map((d) => normalizeDoc<SOAPExam>(d));
          callbacks.onExams(mergeById(exByUid, exByEmail));
        },
        (err) => handleFirestoreError(err, OperationType.LIST, "exams")
      )
    );
    if (email) {
      unsubscribers.push(
        onSnapshot(
          query(collection(db, "exams"), where("patientEmail", "==", email)),
          (snap) => {
            exByEmail = snap.docs.map((d) => normalizeDoc<SOAPExam>(d));
            callbacks.onExams(mergeById(exByUid, exByEmail));
          },
          (err) => handleFirestoreError(err, OperationType.LIST, "exams")
        )
      );
    }

    let logByUid: MonitoringLog[] = [];
    let logByEmail: MonitoringLog[] = [];
    unsubscribers.push(
      onSnapshot(
        query(collection(db, "logs"), where("ownerUid", "==", uid)),
        (snap) => {
          logByUid = snap.docs.map((d) => normalizeDoc<MonitoringLog>(d));
          callbacks.onLogs(mergeById(logByUid, logByEmail));
        },
        (err) => handleFirestoreError(err, OperationType.LIST, "logs")
      )
    );
    if (email) {
      unsubscribers.push(
        onSnapshot(
          query(collection(db, "logs"), where("patientEmail", "==", email)),
          (snap) => {
            logByEmail = snap.docs.map((d) => normalizeDoc<MonitoringLog>(d));
            callbacks.onLogs(mergeById(logByUid, logByEmail));
          },
          (err) => handleFirestoreError(err, OperationType.LIST, "logs")
        )
      );
    }

    let accByUid: PatientAccessLog[] = [];
    let accByEmail: PatientAccessLog[] = [];
    unsubscribers.push(
      onSnapshot(
        query(collection(db, "accessLogs"), where("ownerUid", "==", uid)),
        (snap) => {
          accByUid = snap.docs.map((d) => normalizeDoc<PatientAccessLog>(d));
          const merged = mergeById(accByUid, accByEmail);
          merged.sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""));
          callbacks.onAccessLogs(merged);
        },
        (err) => handleFirestoreError(err, OperationType.LIST, "accessLogs")
      )
    );
    if (email) {
      unsubscribers.push(
        onSnapshot(
          query(collection(db, "accessLogs"), where("patientEmail", "==", email)),
          (snap) => {
            accByEmail = snap.docs.map((d) => normalizeDoc<PatientAccessLog>(d));
            const merged = mergeById(accByUid, accByEmail);
            merged.sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""));
            callbacks.onAccessLogs(merged);
          },
          (err) => handleFirestoreError(err, OperationType.LIST, "accessLogs")
        )
      );
    }

    let chkByUid: BrushingChecklistData = {};
    let chkByEmail: BrushingChecklistData = {};
    unsubscribers.push(
      onSnapshot(
        query(collection(db, "brushingChecklists"), where("ownerUid", "==", uid)),
        (snap) => {
          chkByUid = {};
          for (const d of snap.docs) {
            const raw = d.data();
            chkByUid[raw.patientId || d.id] = (raw.months || {}) as Record<string, BrushingMonthData>;
          }
          callbacks.onChecklists({ ...chkByEmail, ...chkByUid });
        },
        (err) => handleFirestoreError(err, OperationType.LIST, "brushingChecklists")
      )
    );
    if (email) {
      unsubscribers.push(
        onSnapshot(
          query(collection(db, "brushingChecklists"), where("patientEmail", "==", email)),
          (snap) => {
            chkByEmail = {};
            for (const d of snap.docs) {
              const raw = d.data();
              chkByEmail[raw.patientId || d.id] = (raw.months || {}) as Record<string, BrushingMonthData>;
            }
            callbacks.onChecklists({ ...chkByEmail, ...chkByUid });
          },
          (err) => handleFirestoreError(err, OperationType.LIST, "brushingChecklists")
        )
      );
    }
  }

  return () => {
    unsubscribers.forEach((unsub) => unsub());
  };
}

export async function createPatientDoc(patient: Patient, actorUid: string): Promise<void> {
  const ref = doc(db, "patients", patient.id);
  try {
    await setDoc(
      ref,
      stripUndefined({
        ...patient,
        ownerUid: patient.ownerUid || actorUid,
        dentistUid: patient.dentistUid || actorUid,
        patientEmail: patient.patientEmail ? patient.patientEmail.trim().toLowerCase() : "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `patients/${patient.id}`);
  }
}

export async function updatePatientDoc(patient: Patient): Promise<void> {
  const ref = doc(db, "patients", patient.id);
  const { createdAt: _ignored, ...rest } = patient;
  try {
    await updateDoc(
      ref,
      stripUndefined({
        ...rest,
        patientEmail: patient.patientEmail ? patient.patientEmail.trim().toLowerCase() : "",
        updatedAt: serverTimestamp(),
      })
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `patients/${patient.id}`);
  }
}

export async function deletePatientCascade(patientId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "patients", patientId));
    const examSnap = await getDocs(query(collection(db, "exams"), where("patientId", "==", patientId)));
    const logSnap = await getDocs(query(collection(db, "logs"), where("patientId", "==", patientId)));
    const accSnap = await getDocs(query(collection(db, "accessLogs"), where("patientId", "==", patientId)));

    const batch = writeBatch(db);
    examSnap.docs.forEach((d) => batch.delete(d.ref));
    logSnap.docs.forEach((d) => batch.delete(d.ref));
    accSnap.docs.forEach((d) => batch.delete(d.ref));
    batch.delete(doc(db, "brushingChecklists", patientId));
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `patients/${patientId}`);
  }
}

export async function createExamDoc(
  exam: SOAPExam,
  actorUid: string,
  patientMeta?: Patient
): Promise<void> {
  const ref = doc(db, "exams", exam.id);
  try {
    await setDoc(
      ref,
      stripUndefined({
        ...exam,
        ownerUid: exam.ownerUid || patientMeta?.ownerUid || actorUid,
        patientEmail: exam.patientEmail || patientMeta?.patientEmail || "",
        dentistUid: exam.dentistUid || actorUid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `exams/${exam.id}`);
  }
}

export async function updateExamDoc(exam: SOAPExam): Promise<void> {
  const ref = doc(db, "exams", exam.id);
  const { createdAt: _ignored, ...rest } = exam as SOAPExam & { createdAt?: unknown };
  try {
    await updateDoc(
      ref,
      stripUndefined({
        ...rest,
        updatedAt: serverTimestamp(),
      })
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `exams/${exam.id}`);
  }
}

export async function deleteExamDoc(examId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "exams", examId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `exams/${examId}`);
  }
}

export async function createMonitoringLogDoc(
  log: MonitoringLog,
  actorUid: string,
  patientMeta?: Patient
): Promise<void> {
  const ref = doc(db, "logs", log.id);
  try {
    await setDoc(
      ref,
      stripUndefined({
        ...log,
        ownerUid: log.ownerUid || actorUid,
        patientEmail: log.patientEmail || patientMeta?.patientEmail || "",
        dentistUid: log.dentistUid || patientMeta?.dentistUid || actorUid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `logs/${log.id}`);
  }
}

export async function upsertBrushingChecklistDoc(
  patientId: string,
  months: Record<string, BrushingMonthData>,
  actorUid: string,
  patientMeta?: Patient
): Promise<void> {
  const ref = doc(db, "brushingChecklists", patientId);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(
        ref,
        stripUndefined({
          ownerUid: actorUid,
          months,
          updatedAt: serverTimestamp(),
        })
      );
    } else {
      await setDoc(
        ref,
        stripUndefined({
          patientId,
          ownerUid: actorUid,
          patientEmail: patientMeta?.patientEmail || "",
          dentistUid: patientMeta?.dentistUid || actorUid,
          months,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `brushingChecklists/${patientId}`);
  }
}

export async function recordAccessLogDoc(
  accessLog: PatientAccessLog,
  actorUid: string,
  patientMeta?: Patient
): Promise<void> {
  const ref = doc(db, "accessLogs", accessLog.id);
  try {
    await setDoc(
      ref,
      stripUndefined({
        ...accessLog,
        ownerUid: accessLog.ownerUid || patientMeta?.ownerUid || actorUid,
        patientEmail: accessLog.patientEmail || patientMeta?.patientEmail || "",
        dentistUid: accessLog.dentistUid || patientMeta?.dentistUid || actorUid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    );

    if (patientMeta) {
      await updateDoc(doc(db, "patients", patientMeta.id), {
        ownerUid: actorUid,
        lastAccessAt: accessLog.timestamp,
        lastAccessAction: accessLog.actionLabel,
        accessCount: (patientMeta.accessCount || 0) + 1,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `accessLogs/${accessLog.id}`);
  }
}
