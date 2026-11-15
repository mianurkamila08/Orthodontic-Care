import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Users,
  FileText,
  Activity,
  BookOpen,
  HelpCircle,
  Smile,
  HeartPulse,
  Stethoscope,
  Compass,
  LogOut,
  ShieldCheck,
  Chrome,
  Settings,
  AlertCircle,
  Loader2,
  Cloud,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import {
  syncAuthenticatedGoogleUser,
  loginWithUsernameOrPassword,
  registerPatientWithUsername,
  createClinicAccountAsDentist,
  updateUserPasswordSynced,
  seedClinicDataIfEmpty,
  subscribeClinicCollections,
  createPatientDoc,
  updatePatientDoc,
  deletePatientCascade,
  createExamDoc,
  updateExamDoc,
  deleteExamDoc,
  createMonitoringLogDoc,
  upsertBrushingChecklistDoc,
  recordAccessLogDoc,
  ResolvedFirebaseSession,
} from "./utils/firestoreSync";

import {
  Patient,
  SOAPExam,
  MonitoringLog,
  ChatMessage,
  AppUser,
  PatientAccessLog,
  BrushingChecklistData,
} from "./types";

// Import Modular Components
import Dashboard from "./components/Dashboard";
import RekamMedis from "./components/RekamMedis";
import Pemeriksaan from "./components/Pemeriksaan";
import Edukasi from "./components/Edukasi";
import Monitoring from "./components/Monitoring";
import Helpdesk from "./components/Helpdesk";
import PengaturanAkun from "./components/PengaturanAkun";

const REQUESTED_ROLE_KEY = "ortho_requested_role";

export default function App() {
  // Firebase Authentication states
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [session, setSession] = useState<ResolvedFirebaseSession | null>(null);

  // Requested login role before / during Google Sign-In
  const [requestedRole, setRequestedRole] = useState<"dentist" | "patient">(() => {
    const saved = localStorage.getItem(REQUESTED_ROLE_KEY);
    return saved === "dentist" ? "dentist" : "patient";
  });
  const requestedRoleRef = useRef<"dentist" | "patient">(requestedRole);

  useEffect(() => {
    requestedRoleRef.current = requestedRole;
    localStorage.setItem(REQUESTED_ROLE_KEY, requestedRole);
  }, [requestedRole]);

  const [loginError, setLoginError] = useState("");
  const [roleNotice, setRoleNotice] = useState("");
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Username/Password login & registration states
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingCredentials, setIsSubmittingCredentials] = useState(false);

  // Firestore synced clinic states
  const [patients, setPatients] = useState<Patient[]>([]);
  const [exams, setExams] = useState<SOAPExam[]>([]);
  const [logs, setLogs] = useState<MonitoringLog[]>([]);
  const [accessLogs, setAccessLogs] = useState<PatientAccessLog[]>([]);
  const [brushingChecklist, setBrushingChecklist] = useState<BrushingChecklistData>({});
  const [users, setUsers] = useState<AppUser[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  // Per-account AI Chat history stored locally by UID
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => [
    {
      id: "welcome-ai",
      sender: "ai",
      text: "Halo! Saya Asisten AI Ortho-Care. Saya siap membantu memberikan edukasi dan pertolongan pertama yang aman untuk behel atau clear aligner Anda sesuai dengan pedoman standar Kemenkes RI.\n\nAda keluhan atau hal yang ingin Anda tanyakan hari ini? (Misal: kawat menusuk, bracket lepas, atau aturan menyikat gigi)",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  // Listen to Firebase Auth state
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;
      if (!user) {
        setFirebaseUser(null);
        setSession(null);
        setPatients([]);
        setExams([]);
        setLogs([]);
        setAccessLogs([]);
        setBrushingChecklist({});
        setUsers([]);
        setSelectedPatientId("");
        setIsAuthChecking(false);
        return;
      }

      setFirebaseUser(user);
      setIsAuthChecking(true);
      try {
        const resolved = await syncAuthenticatedGoogleUser(user, requestedRoleRef.current);
        if (!isMounted) return;
        setSession(resolved);
        if (resolved.roleNotice) {
          setRoleNotice(resolved.roleNotice);
        }
        if (resolved.role === "dentist") {
          await seedClinicDataIfEmpty(user.uid);
        }
        if (resolved.patientId) {
          setSelectedPatientId(resolved.patientId);
        }

        // Load user-specific chat history
        try {
          const savedChat = localStorage.getItem(`ortho_chat_${user.uid}`);
          if (savedChat) {
            setChatHistory(JSON.parse(savedChat));
          }
        } catch {
          // ignore localStorage errors
        }
      } catch (err) {
        console.error("Failed to sync Firebase user session:", err);
        if (isMounted) {
          setLoginError("Gagal menyinkronkan profil akun dengan Cloud Firestore. Silakan coba lagi.");
        }
      } finally {
        if (isMounted) {
          setIsAuthChecking(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Real-time Firestore collection listeners once user & session are ready
  useEffect(() => {
    if (!firebaseUser || !session) return;

    const unsubscribeCollections = subscribeClinicCollections(firebaseUser, session.role, {
      onPatients: (items) => {
        setPatients(items);
        setSelectedPatientId((prev) => {
          if (session.role === "patient" && session.patientId) {
            const existsLinked = items.some((p) => p.id === session.patientId);
            if (existsLinked) return session.patientId;
          }
          if (prev && items.some((p) => p.id === prev)) return prev;
          return items[0]?.id || session.patientId || "";
        });
      },
      onExams: setExams,
      onLogs: setLogs,
      onAccessLogs: setAccessLogs,
      onChecklists: setBrushingChecklist,
      onUsers: session.role === "dentist" ? setUsers : undefined,
    });

    return () => {
      unsubscribeCollections();
    };
  }, [firebaseUser, session]);

  // Persist AI chat per Firebase UID
  useEffect(() => {
    if (!firebaseUser) return;
    try {
      localStorage.setItem(`ortho_chat_${firebaseUser.uid}`, JSON.stringify(chatHistory));
    } catch {
      // ignore storage errors
    }
  }, [chatHistory, firebaseUser]);

  const role: "dentist" | "patient" = session?.role || "patient";
  const isLoggedIn = Boolean(firebaseUser && session);

  // Access Tracking Engine synced to Firestore
  const handleRecordPatientAccess = useCallback(
    (
      targetPatientId: string,
      action: PatientAccessLog["action"],
      actionLabel: string,
      module: string,
      details?: string
    ) => {
      if (!targetPatientId || !firebaseUser) return;

      const matchedPat = patients.find((p) => p.id === targetPatientId);
      const patName = matchedPat?.name || session?.fullName || "Pasien";
      const nowIso = new Date().toISOString();

      const isMobile = typeof navigator !== "undefined" && /Mobi|Android|iPhone/i.test(navigator.userAgent);
      const deviceInfo = isMobile ? "Smartphone (Mobile Web)" : "Komputer / Laptop (Web Browser)";

      const newLog: PatientAccessLog = {
        id: `ACC-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        patientId: targetPatientId,
        patientName: patName,
        timestamp: nowIso,
        action,
        actionLabel,
        module,
        details,
        deviceInfo,
        patientEmail: matchedPat?.patientEmail || session?.email || "",
        ownerUid: firebaseUser.uid,
      };

      void recordAccessLogDoc(newLog, firebaseUser.uid, matchedPat);
    },
    [patients, firebaseUser, session]
  );

  // Track initial access once per session hour when patient opens app
  useEffect(() => {
    if (isLoggedIn && role === "patient" && selectedPatientId && patients.some((p) => p.id === selectedPatientId)) {
      const todayDateStr = new Date().toISOString().slice(0, 13);
      const sessionKey = `ortho_patient_session_${selectedPatientId}_${todayDateStr}`;
      if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, "true");
        handleRecordPatientAccess(
          selectedPatientId,
          "open_app",
          "Masuk & Membuka Aplikasi",
          "Dashboard Pasien",
          "Pasien mengakses aplikasi dengan Akun Google"
        );
      }
    }
  }, [isLoggedIn, role, selectedPatientId, patients, handleRecordPatientAccess]);

  // Username/Email + Password Login & Patient Registration handler
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setRoleNotice("");

    if (authMode === "login") {
      if (!loginUsername.trim() || !loginPassword) {
        setLoginError("Masukkan username/email dan kata sandi terlebih dahulu.");
        return;
      }
      setIsSubmittingCredentials(true);
      try {
        await loginWithUsernameOrPassword(loginUsername.trim(), loginPassword);
        setActiveTab("dashboard");
        setLoginPassword("");
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code || "";
        if (
          code === "auth/invalid-credential" ||
          code === "auth/user-not-found" ||
          code === "auth/wrong-password"
        ) {
          setLoginError(
            "Username atau kata sandi salah. Pastikan akun sudah didaftarkan di Firebase atau dibuatkan oleh Dokter."
          );
        } else if (code === "auth/operation-not-allowed") {
          setLoginError(
            "Login Username & Password belum diaktifkan di Firebase Console. Aktifkan provider Email/Password di Firebase Console → Authentication → Sign-in method."
          );
        } else if (code === "auth/too-many-requests") {
          setLoginError("Terlalu banyak percobaan login gagal. Silakan tunggu beberapa saat lalu coba lagi.");
        } else if (code === "auth/invalid-email") {
          setLoginError("Format username atau email tidak valid.");
        } else {
          setLoginError(err instanceof Error ? err.message : "Gagal masuk. Periksa koneksi internet dan coba lagi.");
        }
      } finally {
        setIsSubmittingCredentials(false);
      }
    } else {
      if (!registerFullName.trim()) {
        setLoginError("Nama lengkap wajib diisi.");
        return;
      }
      if (registerUsername.trim().length < 3) {
        setLoginError("Username minimal 3 karakter.");
        return;
      }
      if (registerPassword.length < 6) {
        setLoginError("Kata sandi minimal 6 karakter.");
        return;
      }

      // Self-registration always creates a Patient account
      setRequestedRole("patient");
      requestedRoleRef.current = "patient";
      setIsSubmittingCredentials(true);
      try {
        await registerPatientWithUsername({
          fullName: registerFullName.trim(),
          username: registerUsername.trim(),
          password: registerPassword,
        });
        setActiveTab("dashboard");
        setRegisterPassword("");
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code || "";
        if (code === "auth/email-already-in-use") {
          setLoginError("Username ini sudah digunakan. Silakan pilih username lain atau langsung Masuk.");
        } else if (code === "auth/operation-not-allowed") {
          setLoginError(
            "Pendaftaran Username & Password belum aktif di Firebase Console. Aktifkan Email/Password di Authentication → Sign-in method."
          );
        } else if (code === "auth/weak-password") {
          setLoginError("Kata sandi terlalu lemah (minimal 6 karakter).");
        } else {
          setLoginError(err instanceof Error ? err.message : "Gagal mendaftarkan akun baru.");
        }
      } finally {
        setIsSubmittingCredentials(false);
      }
    }
  };

  // Google Sign-In handler
  const handleGoogleLogin = async () => {
    setLoginError("");
    setRoleNotice("");
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setActiveTab("dashboard");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "";
      if (code === "auth/popup-closed-by-user") {
        setLoginError("Jendela login Google ditutup sebelum selesai. Silakan coba lagi.");
      } else if (code === "auth/popup-blocked") {
        setLoginError("Pop-up login diblokir oleh browser. Izinkan pop-up untuk situs ini lalu coba lagi.");
      } else if (code === "auth/unauthorized-domain") {
        setLoginError(
          "Domain situs ini belum terdaftar di Firebase Console (Authentication → Settings → Authorized domains). Tambahkan domain Netlify Anda di Firebase Console agar login Google diizinkan."
        );
      } else {
        setLoginError("Gagal masuk dengan Google. Pastikan koneksi internet aktif lalu coba kembali.");
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    setLoginError("");
    setRoleNotice("");
    try {
      await signOut(auth);
      setActiveTab("dashboard");
    } catch {
      setLoginError("Gagal keluar dari sesi.");
    }
  };

  // Firestore-backed CRUD Handlers
  const handleAddPatient = (newPatient: Patient) => {
    if (!firebaseUser) return;
    void createPatientDoc(newPatient, firebaseUser.uid);
  };

  const handleEditPatient = (updatedPatient: Patient) => {
    void updatePatientDoc(updatedPatient);
  };

  const handleDeletePatient = (patientId: string) => {
    void deletePatientCascade(patientId);
    if (selectedPatientId === patientId) {
      const remaining = patients.filter((p) => p.id !== patientId);
      setSelectedPatientId(remaining[0]?.id || "");
    }
  };

  const handleAddExam = (newExam: SOAPExam) => {
    if (!firebaseUser) return;
    const patMeta = patients.find((p) => p.id === newExam.patientId);
    void createExamDoc(newExam, firebaseUser.uid, patMeta);
  };

  const handleEditExam = (updatedExam: SOAPExam) => {
    void updateExamDoc(updatedExam);
  };

  const handleDeleteExam = (examId: string) => {
    void deleteExamDoc(examId);
  };

  const handleAddLog = (newLog: MonitoringLog) => {
    if (!firebaseUser) return;
    const patMeta = patients.find((p) => p.id === newLog.patientId);
    void createMonitoringLogDoc(newLog, firebaseUser.uid, patMeta);
    handleRecordPatientAccess(
      newLog.patientId,
      "fill_monitoring",
      "Mengisi Buku Harian Gigi",
      "Buku Harian Gigi",
      `Mencatat sikat gigi ${newLog.brushedCount}x, nyeri ${newLog.painLevel}/10${
        newLog.notes ? ` ("${newLog.notes}")` : ""
      }`
    );
  };

  const handleUpdateChecklist = (updater: React.SetStateAction<BrushingChecklistData>) => {
    if (!firebaseUser) return;
    setBrushingChecklist((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      const targetId = selectedPatientId || Object.keys(next)[0];
      if (targetId && next[targetId]) {
        const patMeta = patients.find((p) => p.id === targetId);
        void upsertBrushingChecklistDoc(targetId, next[targetId], firebaseUser.uid, patMeta);
      }
      return next;
    });
  };

  const handleLinkPatientEmail = async (patientId: string, email: string) => {
    const target = patients.find((p) => p.id === patientId);
    if (!target) return;
    await updatePatientDoc({
      ...target,
      patientEmail: email.trim().toLowerCase(),
    });
  };

  const handleCreateClinicAccount = async (payload: {
    role: "dentist" | "patient";
    username: string;
    password: string;
    fullName: string;
    patientId?: string;
  }) => {
    if (!firebaseUser) {
      throw new Error("Sesi dokter tidak ditemukan.");
    }
    const res = await createClinicAccountAsDentist({
      ...payload,
      adminUid: firebaseUser.uid,
    });
    return { username: res.username, authEmail: res.authEmail };
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    await updateUserPasswordSynced(currentPassword, newPassword);
  };

  const handleAddChatMessage = (newMsg: ChatMessage) => {
    setChatHistory((prev) => [...prev, newMsg]);
    if (newMsg.sender === "user" && role === "patient" && selectedPatientId) {
      handleRecordPatientAccess(
        selectedPatientId,
        "ask_ai",
        "Konsultasi Asisten AI Gigi",
        "Chat Asisten AI",
        `Pertanyaan: "${newMsg.text.slice(0, 50)}${newMsg.text.length > 50 ? "..." : ""}"`
      );
    }
  };

  const handleNavigateTab = (tabId: string) => {
    setActiveTab(tabId);
    if (role === "patient" && selectedPatientId) {
      let action: PatientAccessLog["action"] = "open_app";
      let actionLabel = "Membuka Aplikasi";
      let moduleName = "Dashboard";
      let details = `Membuka menu ${tabId}`;

      if (tabId === "dashboard") {
        action = "view_dashboard";
        actionLabel = "Membuka Dashboard Pasien";
        moduleName = "Dashboard Pasien";
        details = "Mengecek perkembangan orto & pengingat jadwal kontrol";
      } else if (tabId === "rekam-medis") {
        action = "view_rekam_medis";
        actionLabel = "Melihat Rekam Medis (RME)";
        moduleName = "Rekam Medis Saya";
        details = "Melihat riwayat diagnosa dan catatan resep/instruksi behel";
      } else if (tabId === "monitoring") {
        action = "open_app";
        actionLabel = "Membuka Buku Harian Gigi";
        moduleName = "Buku Harian Gigi";
        details = "Mengecek pelacak harian sikat gigi, obat kumur & rasa nyeri";
      } else if (tabId === "edukasi") {
        action = "read_education";
        actionLabel = "Membuka Portal Edukasi";
        moduleName = "Panduan Edukasi";
        details = "Membaca panduan perawatan behel dan pantangan makanan";
      } else if (tabId === "helpdesk") {
        action = "ask_ai";
        actionLabel = "Membuka Chat Asisten AI";
        moduleName = "Chat Asisten AI";
        details = "Membuka konsultasi otomatis untuk keluhan kawat gigi";
      } else if (tabId === "pengaturan-akun") {
        action = "open_app";
        actionLabel = "Membuka Pengaturan Akun";
        moduleName = "Pengaturan Akun";
        details = "Memeriksa profil dan status sinkronisasi Firebase";
      }

      handleRecordPatientAccess(selectedPatientId, action, actionLabel, moduleName, details);
    }
  };

  const activePatientName = patients.find((p) => p.id === selectedPatientId)?.name || session?.fullName || "Pasien";
  const activeUserFullName =
    session?.fullName || (role === "dentist" ? "Mia Nurkamila, A.Md.Kes" : activePatientName);

  const dentistNav = [
    { id: "dashboard", label: "Dashboard Klinik", icon: Compass },
    { id: "rekam-medis", label: "Rekam Medis (RME)", icon: Users },
    { id: "pemeriksaan", label: "Pemeriksaan SOAP", icon: Stethoscope },
    { id: "edukasi", label: "Portal Edukasi", icon: BookOpen },
    { id: "pengaturan-akun", label: "Pengaturan Akun", icon: Settings },
  ];

  const patientNav = [
    { id: "dashboard", label: "Dashboard Pasien", icon: Smile },
    { id: "rekam-medis", label: "Rekam Medis Saya", icon: FileText },
    { id: "monitoring", label: "Buku Harian Gigi", icon: Activity },
    { id: "edukasi", label: "Panduan Edukasi", icon: BookOpen },
    { id: "helpdesk", label: "Chat Asisten AI", icon: HelpCircle },
    { id: "pengaturan-akun", label: "Pengaturan Akun", icon: Settings },
  ];

  const currentNav = role === "dentist" ? dentistNav : patientNav;

  // Loading Screen while checking Firebase Auth session
  if (isAuthChecking && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50/30 to-pink-100/40 flex items-center justify-center p-4 font-sans antialiased text-gray-800">
        <div className="bg-white rounded-3xl border border-pink-100 shadow-xl p-8 flex flex-col items-center gap-3 max-w-sm w-full text-center">
          <Loader2 size={28} className="text-pink-500 animate-spin" />
          <p className="text-sm font-bold text-gray-900">Menghubungkan ke Firebase...</p>
          <p className="text-xs text-gray-500">Memeriksa sesi Google dan menyinkronkan Rekam Medis Anda.</p>
        </div>
      </div>
    );
  }

  // Login & Registration Screen (Username/Password + Google Sign-In)
  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50/30 to-pink-100/40 flex items-center justify-center p-4 font-sans antialiased text-gray-800"
        id="login-container"
      >
        <div className="w-full max-w-md bg-white rounded-3xl border border-pink-100 shadow-xl overflow-hidden p-6 sm:p-7 space-y-5">
          {/* Logo Brand */}
          <div className="text-center space-y-2.5">
            <div className="w-20 h-20 rounded-3xl bg-pink-50/80 flex items-center justify-center shadow-md mx-auto p-2 border border-pink-100/50 hover:scale-105 transition-all">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 50,15 C 68,15 78,22 78,38 C 78,52 70,58 70,74 C 70,81 66,85 61,85 C 56,85 53,80 50,73 C 47,80 44,85 39,85 C 34,85 30,81 30,74 C 30,58 22,52 22,38 C 22,22 32,15 50,15 Z"
                  fill="#FFFFFF"
                  stroke="#EC4899"
                  strokeWidth="5.5"
                  strokeLinejoin="round"
                />
                <path d="M 10,48 Q 50,56 90,48" fill="none" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
                <g transform="translate(37, 36)">
                  <rect x="0" y="0" width="26" height="24" rx="4" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.5" />
                  <rect x="-2" y="-2" width="30" height="28" rx="6" fill="none" stroke="#EC4899" strokeWidth="3" />
                  <rect x="-4" y="10" width="34" height="4" fill="#475569" />
                  <rect x="11" y="-3" width="4" height="30" fill="#475569" />
                  <circle cx="5" cy="5" r="2.5" fill="#94A3B8" />
                  <circle cx="21" cy="5" r="2.5" fill="#94A3B8" />
                  <circle cx="5" cy="19" r="2.5" fill="#94A3B8" />
                  <circle cx="21" cy="19" r="2.5" fill="#94A3B8" />
                </g>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight text-pink-700">Orthodontic-Care</h1>
              <p className="text-xs text-pink-500 font-semibold">Rekam Medis Elektronik &amp; Pemantauan Orto</p>
            </div>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-start gap-2">
              <AlertCircle size={15} className="text-rose-500 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Role Switcher (2 roles only: Pasien RME vs Dokter Gigi Sp.Ort) */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-pink-700 tracking-wider block text-center">
              Pilih Mode Akses Masuk
            </label>
            <div className="flex bg-pink-50/70 p-1 rounded-2xl border border-pink-100">
              <button
                type="button"
                onClick={() => {
                  setRequestedRole("patient");
                  setLoginError("");
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  requestedRole === "patient"
                    ? "bg-pink-500 text-white shadow-xs"
                    : "text-pink-700 hover:text-pink-900"
                }`}
              >
                <Smile size={14} />
                <span>Pasien RME</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRequestedRole("dentist");
                  setAuthMode("login");
                  setLoginError("");
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  requestedRole === "dentist"
                    ? "bg-pink-500 text-white shadow-xs"
                    : "text-pink-700 hover:text-pink-900"
                }`}
              >
                <Stethoscope size={14} />
                <span>Dokter Gigi Sp.Ort</span>
              </button>
            </div>
          </div>

          {/* Login / Register Form using Username & Password */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-3">
            {authMode === "register" ? (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Nama Lengkap</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={registerFullName}
                      onChange={(e) => setRegisterFullName(e.target.value)}
                      placeholder="Contoh: Siti Rahmawati"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                      required
                    />
                    <UserIcon size={14} className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Username</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      placeholder="Contoh: siti.rahma"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:border-pink-500"
                      required
                    />
                    <UserPlus size={14} className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Kata Sandi</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                      required
                    />
                    <Lock size={14} className="absolute left-3 top-3 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingCredentials || isSigningIn}
                  className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-60 text-white font-bold text-sm py-3 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmittingCredentials ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                  <span>{isSubmittingCredentials ? "Mendaftarkan Akun..." : "Daftar & Masuk Pasien"}</span>
                </button>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Username atau Email</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="Masukkan username atau email"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                      required
                    />
                    <UserIcon size={14} className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Kata Sandi</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                      required
                    />
                    <Lock size={14} className="absolute left-3 top-3 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingCredentials || isSigningIn}
                  className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-60 text-white font-bold text-sm py-3 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmittingCredentials ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                  <span>{isSubmittingCredentials ? "Memverifikasi..." : "Masuk dengan Username"}</span>
                </button>
              </>
            )}

            {requestedRole === "patient" && (
              <div className="text-center pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === "login" ? "register" : "login");
                    setLoginError("");
                  }}
                  className="text-xs font-bold text-pink-600 hover:text-pink-700 hover:underline cursor-pointer"
                >
                  {authMode === "login"
                    ? "Belum punya akun? Daftar Akun Pasien Baru"
                    : "Sudah punya akun? Masuk dengan Username"}
                </button>
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="relative flex items-center py-0.5">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="shrink mx-3 text-[10px] font-bold uppercase text-gray-400">atau</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Google Sign-In Option */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSigningIn || isSubmittingCredentials}
              className="w-full bg-white hover:bg-pink-50/70 disabled:opacity-60 text-gray-800 border border-pink-200 font-bold text-xs py-3 rounded-2xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSigningIn ? <Loader2 size={16} className="animate-spin text-pink-500" /> : <Chrome size={16} className="text-pink-600" />}
              <span>{isSigningIn ? "Menghubungkan ke Google..." : "Masuk dengan Google"}</span>
            </button>

            <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200/80 flex items-start gap-2 text-[10.5px] text-emerald-900">
              <Cloud size={14} className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Sinkronisasi Firebase Aktif:</strong> Login Username/Password &amp; Google tersimpan aman di
                Cloud Firestore untuk akses lintas HP, laptop, dan web Netlify.
              </p>
            </div>
          </div>

          {/* SatuSehat Badge */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-pink-400 bg-pink-50/50 py-1.5 rounded-lg border border-pink-100">
            <ShieldCheck size={12} />
            <span>Kemenkes SATUSEHAT &amp; Firebase Cloud Sync</span>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in application layout
  return (
    <div
      className="min-h-screen bg-pink-50/10 flex flex-col font-sans antialiased text-gray-800 animate-fade-in"
      id="applet-viewport"
    >
      {/* Top Banner */}
      <header className="bg-white border-b border-pink-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-pink-500 text-white flex items-center justify-center font-bold shadow-md">
              <HeartPulse size={20} />
            </div>
            <div>
              <span className="text-sm font-display font-black tracking-tight text-gray-900 block">
                Orthodontic-Care
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-pink-50/50 px-3 py-1.5 rounded-xl border border-pink-100">
            <div className="w-6 h-6 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 text-xs font-black">
              {role === "dentist" ? "Dr" : "Pt"}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-[10px] text-pink-600 font-bold block">
                Aktif Login ({session?.authProvider === "password" ? "Username" : "Google"}):
              </span>
              <span className="text-xs font-bold text-gray-800 block -mt-1">{activeUserFullName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-250 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Keluar dari Aplikasi"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {roleNotice && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between gap-2">
            <span>{roleNotice}</span>
            <button
              type="button"
              onClick={() => setRoleNotice("")}
              className="text-amber-700 font-bold hover:underline shrink-0 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Main Container Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col md:flex-row gap-6 w-full">
        {/* Navigation Rail / Sidebar */}
        <nav className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none border-b md:border-b-0 md:border-r border-pink-50 pr-0 md:pr-4">
          <div className="hidden md:block mb-4">
            <span className="text-[10px] font-black uppercase text-pink-400 tracking-wider px-3">Menu Utama</span>
          </div>

          {currentNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigateTab(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 whitespace-nowrap cursor-pointer ${
                  activeTab === item.id
                    ? "bg-pink-500 text-white border border-pink-500 shadow-sm"
                    : "text-gray-500 hover:bg-pink-50/50 hover:text-pink-700"
                }`}
              >
                <Icon size={16} className={activeTab === item.id ? "text-white" : "text-gray-400"} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actionable Content Stage Area */}
        <main className="flex-1 min-w-0 bg-transparent rounded-2xl">
          {activeTab === "dashboard" && (
            <Dashboard
              role={role}
              patients={patients}
              exams={exams}
              logs={logs}
              selectedPatientId={selectedPatientId}
              onNavigate={(tab) => handleNavigateTab(tab)}
              onSelectPatient={(id) => setSelectedPatientId(id)}
              accessLogs={accessLogs}
              brushingChecklist={brushingChecklist}
            />
          )}

          {activeTab === "rekam-medis" && (
            <RekamMedis
              role={role}
              patients={patients}
              exams={exams}
              selectedPatientId={selectedPatientId}
              onSelectPatient={(id) => setSelectedPatientId(id)}
              onAddPatient={handleAddPatient}
              onEditPatient={handleEditPatient}
              onDeletePatient={handleDeletePatient}
              onEditExam={handleEditExam}
              onDeleteExam={handleDeleteExam}
              onNavigateToExam={() => handleNavigateTab("pemeriksaan")}
              accessLogs={accessLogs}
              users={role === "dentist" ? users : undefined}
            />
          )}

          {activeTab === "pemeriksaan" && (
            <Pemeriksaan
              patients={patients}
              selectedPatientId={selectedPatientId}
              onAddExam={handleAddExam}
              onNavigateToRME={() => handleNavigateTab("rekam-medis")}
              activeDentistName={activeUserFullName}
            />
          )}

          {activeTab === "edukasi" && (
            <Edukasi
              onReadArticle={(article) => {
                if (role === "patient" && selectedPatientId) {
                  handleRecordPatientAccess(
                    selectedPatientId,
                    "read_education",
                    `Membaca Materi Edukasi`,
                    "Panduan Edukasi",
                    `Membaca: "${article.title}" (${article.category})`
                  );
                }
              }}
            />
          )}

          {activeTab === "monitoring" && (
            <Monitoring
              logs={logs}
              patients={patients}
              selectedPatientId={selectedPatientId}
              onAddLog={handleAddLog}
              checklist={brushingChecklist}
              onUpdateChecklist={handleUpdateChecklist}
            />
          )}

          {activeTab === "helpdesk" && (
            <Helpdesk chatHistory={chatHistory} onAddMessage={handleAddChatMessage} />
          )}

          {activeTab === "pengaturan-akun" && (
            <PengaturanAkun
              currentUser={{
                uid: session?.uid,
                email: session?.email,
                username: session?.username || session?.email || "user",
                fullName: activeUserFullName,
                role: role,
                patientId: role === "patient" ? selectedPatientId : undefined,
                authProvider: session?.authProvider,
              }}
              patients={role === "dentist" ? patients : patients.filter((p) => p.id === selectedPatientId)}
              users={role === "dentist" ? users : []}
              onLinkPatientEmail={role === "dentist" ? handleLinkPatientEmail : undefined}
              onCreateAccount={role === "dentist" ? handleCreateClinicAccount : undefined}
              onChangePassword={handleChangePassword}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-pink-100 py-4 mt-auto text-center text-[10px] text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 Orthodontic-Care &amp; RME. Selaras dengan PMK No. 24 Tahun 2022 tentang Rekam Medis Elektronik.</p>
          <p className="font-semibold text-pink-600">Terdaftar di Kemenkes RI SATUSEHAT Ecosystem | Firebase Cloud Sync</p>
        </div>
      </footer>
    </div>
  );
}
