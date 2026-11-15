import React, { useState } from "react";
import {
  Users,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  User,
  Mail,
  Cloud,
  Link2,
  Key,
  Eye,
  EyeOff,
  UserPlus,
  Lock,
} from "lucide-react";
import { Patient, AppUser } from "../types";

interface PengaturanAkunProps {
  currentUser: {
    uid?: string;
    email?: string;
    username: string;
    fullName: string;
    role: "dentist" | "patient";
    patientId?: string;
    authProvider?: "google" | "password";
  };
  patients: Patient[];
  users: AppUser[];
  onLinkPatientEmail?: (patientId: string, email: string) => Promise<void> | void;
  onCreateAccount?: (payload: {
    role: "dentist" | "patient";
    username: string;
    password: string;
    fullName: string;
    patientId?: string;
  }) => Promise<{ username: string; authEmail: string }>;
  onChangePassword?: (currentPassword: string, newPassword: string) => Promise<void>;
}

export default function PengaturanAkun({
  currentUser,
  patients,
  users,
  onLinkPatientEmail,
  onCreateAccount,
  onChangePassword,
}: PengaturanAkunProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    "profil" | "buat-akun" | "tautkan-pasien" | "daftar-akun"
  >("profil");
  const isDentist = currentUser.role === "dentist";
  const effectiveSubTab = isDentist ? activeSubTab : "profil";

  // Change Password State (for Username/Password users)
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassForm, setShowPassForm] = useState(false);
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  // Create Username/Password Account State (Dentist Only)
  const [newAccRole, setNewAccRole] = useState<"patient" | "dentist">("patient");
  const [newAccPatientId, setNewAccPatientId] = useState("");
  const [newAccFullName, setNewAccFullName] = useState("");
  const [newAccUsername, setNewAccUsername] = useState("");
  const [newAccPassword, setNewAccPassword] = useState("");
  const [showNewAccPassword, setShowNewAccPassword] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [isCreatingAcc, setIsCreatingAcc] = useState(false);

  // Link Google Email to existing RME Patient Form (Dentist Only)
  const [selectedRmeId, setSelectedRmeId] = useState("");
  const [googleEmailInput, setGoogleEmailInput] = useState("");
  const [linkError, setLinkError] = useState("");
  const [linkSuccess, setLinkSuccess] = useState("");
  const [isSavingLink, setIsSavingLink] = useState(false);

  // Toggle visibility of stored recovery passwords in Doctor's user directory
  const [visiblePasswordUids, setVisiblePasswordUids] = useState<Record<string, boolean>>({});

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");

    if (!currentPass) {
      setPassError("Masukkan kata sandi saat ini.");
      return;
    }
    if (newPass.length < 6) {
      setPassError("Kata sandi baru minimal 6 karakter.");
      return;
    }
    if (newPass !== confirmPass) {
      setPassError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    setIsUpdatingPass(true);
    try {
      await onChangePassword?.(currentPass, newPass);
      setPassSuccess(
        "Kata sandi berhasil diubah di Firebase Authentication dan otomatis tersinkron ke fitur Dokter."
      );
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "";
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setPassError("Kata sandi saat ini salah. Periksa kembali lalu coba lagi.");
      } else if (code === "auth/requires-recent-login") {
        setPassError("Sesi terlalu lama. Silakan keluar lalu masuk kembali sebelum mengubah kata sandi.");
      } else {
        setPassError(err instanceof Error ? err.message : "Gagal memperbarui kata sandi.");
      }
    } finally {
      setIsUpdatingPass(false);
    }
  };

  const handleCreateAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");

    if (!newAccFullName.trim()) {
      setCreateError("Nama lengkap wajib diisi.");
      return;
    }
    if (newAccUsername.trim().length < 3) {
      setCreateError("Username minimal 3 karakter.");
      return;
    }
    if (newAccPassword.length < 6) {
      setCreateError("Kata sandi minimal 6 karakter (ketentuan keamanan Firebase).");
      return;
    }

    setIsCreatingAcc(true);
    try {
      const created = await onCreateAccount?.({
        role: newAccRole,
        username: newAccUsername.trim(),
        password: newAccPassword,
        fullName: newAccFullName.trim(),
        patientId: newAccRole === "patient" && newAccPatientId ? newAccPatientId : undefined,
      });
      setCreateSuccess(
        `Akun ${newAccRole === "dentist" ? "Dokter" : "Pasien"} berhasil dibuat di Firebase! Username: "${
          created?.username || newAccUsername.trim()
        }" — sekarang dapat digunakan login dari perangkat mana saja.`
      );
      setNewAccFullName("");
      setNewAccUsername("");
      setNewAccPassword("");
      setNewAccPatientId("");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "";
      if (code === "auth/email-already-in-use") {
        setCreateError("Username/Email ini sudah terdaftar di Firebase. Gunakan username lain.");
      } else if (code === "auth/operation-not-allowed") {
        setCreateError(
          "Provider Email/Password belum aktif di Firebase Console. Aktifkan di Firebase Console → Authentication → Sign-in method → Email/Password."
        );
      } else if (code === "auth/weak-password") {
        setCreateError("Kata sandi terlalu lemah (minimal 6 karakter).");
      } else {
        setCreateError(err instanceof Error ? err.message : "Gagal membuat akun di Firebase.");
      }
    } finally {
      setIsCreatingAcc(false);
    }
  };

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkError("");
    setLinkSuccess("");

    const normEmail = googleEmailInput.trim().toLowerCase();
    if (!selectedRmeId) {
      setLinkError("Silakan pilih profil Rekam Medis (RME) Pasien terlebih dahulu.");
      return;
    }
    if (!normEmail || !normEmail.includes("@")) {
      setLinkError("Masukkan alamat Email Google yang valid (contoh: nama@gmail.com).");
      return;
    }

    setIsSavingLink(true);
    try {
      await onLinkPatientEmail?.(selectedRmeId, normEmail);
      const targetPat = patients.find((p) => p.id === selectedRmeId);
      setLinkSuccess(
        `Email "${normEmail}" berhasil ditautkan ke RME "${targetPat?.name || selectedRmeId}". Saat pasien login dengan Google di perangkat mana pun, data RME akan otomatis sinkron.`
      );
      setGoogleEmailInput("");
      setSelectedRmeId("");
    } catch {
      setLinkError("Gagal menyimpan tautan email pasien. Silakan coba lagi.");
    } finally {
      setIsSavingLink(false);
    }
  };

  return (
    <div className="space-y-6" id="pengaturan-akun-view">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-display font-black text-gray-900 tracking-tight">Pengaturan Akun</h2>
          <p className="text-xs text-gray-500">
            {isDentist
              ? "Kelola akun login pasien (Username/Password & Google), pantau perubahan sandi pasien, dan cek status Cloud Firestore."
              : "Kelola profil akun, ubah kata sandi, dan pantau status sinkronisasi Cloud Firestore Anda."}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-pink-600 bg-pink-50 px-3 py-1.5 rounded-xl border border-pink-100">
          <ShieldCheck size={14} />
          <span>Role Aktif: {isDentist ? "Spesialis Ortodonti" : "Pasien Terdaftar"}</span>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex border-b border-gray-100 gap-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveSubTab("profil")}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 -mb-px flex items-center gap-1.5 shrink-0 cursor-pointer ${
            effectiveSubTab === "profil"
              ? "border-pink-500 text-pink-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <UserCheck size={13} />
          <span>Profil &amp; Keamanan</span>
        </button>

        {isDentist && (
          <>
            <button
              type="button"
              onClick={() => {
                setActiveSubTab("buat-akun");
                setCreateError("");
                setCreateSuccess("");
              }}
              className={`px-4 py-2 text-xs font-bold transition-all border-b-2 -mb-px flex items-center gap-1.5 shrink-0 cursor-pointer ${
                effectiveSubTab === "buat-akun"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <UserPlus size={13} />
              <span>Buat Akun Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSubTab("tautkan-pasien");
                setLinkError("");
                setLinkSuccess("");
              }}
              className={`px-4 py-2 text-xs font-bold transition-all border-b-2 -mb-px flex items-center gap-1.5 shrink-0 cursor-pointer ${
                effectiveSubTab === "tautkan-pasien"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <Link2 size={13} />
              <span>Tautkan Email Google</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab("daftar-akun")}
              className={`px-4 py-2 text-xs font-bold transition-all border-b-2 -mb-px flex items-center gap-1.5 shrink-0 cursor-pointer ${
                effectiveSubTab === "daftar-akun"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <Users size={13} />
              <span>Daftar Seluruh Akun ({users.length})</span>
            </button>
          </>
        )}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 gap-6">
        {/* SUBTAB 1: Profile, Password Change & Firebase Sync Status */}
        {effectiveSubTab === "profil" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Session Card Info */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-md flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-pink-100 block">
                    Informasi Sesi Aktif
                  </span>
                  <h3 className="text-xl font-bold tracking-tight">{currentUser.fullName}</h3>
                  <p className="text-xs text-pink-50 font-mono mt-0.5 break-all">
                    @{currentUser.username}
                  </p>
                  {currentUser.email && !currentUser.email.endsWith("@orthocare.clinic") && (
                    <p className="text-[11px] text-pink-100 font-mono mt-0.5 break-all">{currentUser.email}</p>
                  )}
                </div>
              </div>

              <div className="border-t border-white/20 pt-4 space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="opacity-80">Jenis Akun:</span>
                  <span className="font-bold bg-white/20 px-2 py-0.5 rounded-md text-pink-50">
                    {currentUser.role === "dentist" ? "Dokter Gigi Sp.Ort" : "Pasien"}
                  </span>
                </div>
                {currentUser.patientId && (
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="opacity-80">No. Rekam Medis (ID):</span>
                    <span className="font-mono font-bold bg-pink-600/50 px-2 py-0.5 rounded-md text-pink-50">
                      {currentUser.patientId}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-[11px]">
                  <span className="opacity-80">Metode Masuk:</span>
                  <span className="font-mono">
                    {currentUser.authProvider === "password" ? "Username & Sandi" : "Google Auth"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Password Change (if password auth) + Cloud Sync Info */}
            <div className="lg:col-span-2 space-y-6">
              {currentUser.authProvider === "password" ? (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <Key size={16} className="text-pink-500" />
                        <span>Ubah Kata Sandi Akun</span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Perubahan kata sandi otomatis tersimpan di Firebase dan terupdate di sistem Dokter.
                      </p>
                    </div>
                  </div>

                  {passSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{passSuccess}</span>
                    </div>
                  )}

                  {passError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                      <AlertCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                      <span>{passError}</span>
                    </div>
                  )}

                  <form onSubmit={handlePasswordSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-700 block">Kata Sandi Saat Ini</label>
                        <input
                          type={showPassForm ? "text" : "password"}
                          value={currentPass}
                          onChange={(e) => setCurrentPass(e.target.value)}
                          placeholder="••••••"
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-700 block">Kata Sandi Baru</label>
                        <input
                          type={showPassForm ? "text" : "password"}
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          placeholder="Minimal 6 karakter"
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-700 block">Konfirmasi Sandi Baru</label>
                        <input
                          type={showPassForm ? "text" : "password"}
                          value={confirmPass}
                          onChange={(e) => setConfirmPass(e.target.value)}
                          placeholder="Ulangi sandi baru"
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowPassForm(!showPassForm)}
                        className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 cursor-pointer"
                      >
                        {showPassForm ? <EyeOff size={14} /> : <Eye size={14} />}
                        <span>{showPassForm ? "Sembunyikan sandi" : "Tampilkan sandi"}</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isUpdatingPass}
                        className="px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Lock size={13} />
                        <span>{isUpdatingPass ? "Memperbarui..." : "Simpan Kata Sandi Baru"}</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <Cloud size={17} className="text-emerald-600" />
                      <span>Sinkronisasi Cloud Firebase Aktif</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Akun Anda tersambung ke <strong>Firebase Authentication</strong> dan{" "}
                      <strong>Cloud Firestore</strong>. Seluruh data rekam medis, buku harian gigi, dan riwayat kontrol
                      otomatis tersinkron di semua perangkat serta web Netlify.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-extrabold shrink-0">
                    Real-Time Sync
                  </span>
                </div>

                {currentUser.authProvider !== "password" && (
                  <div className="p-3.5 bg-pink-50/50 border border-pink-100 rounded-xl flex items-start gap-2.5 text-xs text-pink-900">
                    <ShieldCheck size={16} className="text-pink-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed text-[11px]">
                      Anda saat ini masuk menggunakan <strong>Google Sign-In</strong>, sehingga kata sandi dikelola
                      langsung oleh keamanan Akun Google Anda.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: Create Username/Password Login Account (Dentist Only) */}
        {isDentist && effectiveSubTab === "buat-akun" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-2xl space-y-5">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <UserPlus size={18} className="text-pink-500" />
                <span>Buatkan Akun Login (Username &amp; Password)</span>
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Akun langsung didaftarkan ke Firebase Authentication &amp; ditautkan ke RME pasien agar bisa dipakai
                login dari perangkat mana saja tanpa keluar dari sesi dokter Anda.
              </p>
            </div>

            {createSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>{createSuccess}</span>
              </div>
            )}

            {createError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateAccountSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Jenis Akun</label>
                  <select
                    value={newAccRole}
                    onChange={(e) => setNewAccRole(e.target.value as "patient" | "dentist")}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-pink-500 font-semibold text-gray-800"
                  >
                    <option value="patient">Pasien RME</option>
                    <option value="dentist">Dokter Klinik (Admin)</option>
                  </select>
                </div>

                {newAccRole === "patient" && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 block">Tautkan ke Data RME Pasien</label>
                    <select
                      value={newAccPatientId}
                      onChange={(e) => {
                        const pid = e.target.value;
                        setNewAccPatientId(pid);
                        const found = patients.find((p) => p.id === pid);
                        if (found) {
                          setNewAccFullName(found.name);
                          if (!newAccUsername) {
                            setNewAccUsername(
                              found.patientUsername ||
                                found.name
                                  .toLowerCase()
                                  .split(" ")[0]
                                  .replace(/[^a-z0-9]/g, "")
                            );
                          }
                        }
                      }}
                      className="w-full px-3 py-2 border border-pink-200 rounded-xl text-xs bg-white focus:outline-none focus:border-pink-500 font-semibold text-gray-800"
                    >
                      <option value="">-- Buat Profil RME Baru Otomatis --</option>
                      {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (ID: {p.id})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Nama Lengkap</label>
                <input
                  type="text"
                  value={newAccFullName}
                  onChange={(e) => setNewAccFullName(e.target.value)}
                  placeholder="Contoh: Aditya Pratama"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Username (atau Email)</label>
                  <input
                    type="text"
                    value={newAccUsername}
                    onChange={(e) => setNewAccUsername(e.target.value)}
                    placeholder="Contoh: aditya"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:border-pink-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Kata Sandi Awal</label>
                  <div className="relative">
                    <input
                      type={showNewAccPassword ? "text" : "password"}
                      value={newAccPassword}
                      onChange={(e) => setNewAccPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full pl-3 pr-9 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewAccPassword(!showNewAccPassword)}
                      className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-700 cursor-pointer"
                    >
                      {showNewAccPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreatingAcc}
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-60 text-white font-bold text-xs py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus size={14} />
                <span>{isCreatingAcc ? "Mendaftarkan ke Firebase..." : "Buat & Sinkronkan Akun ke Firebase"}</span>
              </button>
            </form>
          </div>
        )}

        {/* SUBTAB 3: Link Patient Google Email to RME (Dentist Only) */}
        {isDentist && effectiveSubTab === "tautkan-pasien" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-2xl space-y-5">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <Link2 size={18} className="text-pink-500" />
                <span>Tautkan Email Google Pasien ke Rekam Medis (RME)</span>
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Jika pasien memilih masuk dengan tombol <strong>Masuk dengan Google</strong>, masukkan Gmail-nya di
                sini agar langsung terhubung ke RME miliknya.
              </p>
            </div>

            {linkSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>{linkSuccess}</span>
              </div>
            )}

            {linkError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                <span>{linkError}</span>
              </div>
            )}

            <form onSubmit={handleLinkSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Pilih Profil Pasien (RME)</label>
                <select
                  value={selectedRmeId}
                  onChange={(e) => {
                    const pid = e.target.value;
                    setSelectedRmeId(pid);
                    const found = patients.find((p) => p.id === pid);
                    setGoogleEmailInput(found?.patientEmail || "");
                  }}
                  className="w-full px-3 py-2 border border-pink-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-pink-500 font-semibold text-gray-800"
                  required
                >
                  <option value="">-- Pilih Rekam Medis Pasien --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (ID: {p.id}){p.patientEmail ? ` — ${p.patientEmail}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Alamat Email Google Pasien</label>
                <div className="relative">
                  <input
                    type="email"
                    value={googleEmailInput}
                    onChange={(e) => setGoogleEmailInput(e.target.value)}
                    placeholder="Contoh: pasien@gmail.com"
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                    required
                  />
                  <Mail size={14} className="absolute left-3 top-2.5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingLink}
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-60 text-white font-bold text-xs py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Link2 size={14} />
                <span>{isSavingLink ? "Menyimpan..." : "Simpan Tautan Email Google"}</span>
              </button>
            </form>
          </div>
        )}

        {/* SUBTAB 4: Registered Accounts Directory (Dentist Only) */}
        {isDentist && effectiveSubTab === "daftar-akun" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Daftar Seluruh Akun Tersinkronisasi</h3>
                <p className="text-[11px] text-gray-500">
                  Hanya dapat dilihat oleh Dokter. Perubahan kata sandi yang dilakukan pasien otomatis terupdate di
                  daftar ini.
                </p>
              </div>
              <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-1 rounded-lg">
                Total: {users.length} Akun
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                    <th className="py-2.5 px-3">Nama &amp; RME</th>
                    <th className="py-2.5 px-3">Username / Email</th>
                    <th className="py-2.5 px-3">Hak Akses</th>
                    <th className="py-2.5 px-3">Kata Sandi Tercatat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {users.map((u) => {
                    const rowKey = u.uid || u.username;
                    const isActiveUser = currentUser.uid && u.uid === currentUser.uid;
                    const linkedPatient = patients.find((p) => p.id === u.patientId);
                    const isPassVisible = !!visiblePasswordUids[rowKey];

                    return (
                      <tr
                        key={rowKey}
                        className={`hover:bg-gray-50/50 transition-all ${isActiveUser ? "bg-pink-50/30" : ""}`}
                      >
                        <td className="py-3 px-3">
                          <p className="font-bold text-gray-900">
                            {u.fullName}
                            {isActiveUser && (
                              <span className="ml-1.5 text-[9px] bg-pink-500 text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                Aktif
                              </span>
                            )}
                          </p>
                          {u.patientId ? (
                            <span className="font-mono text-[10px] text-gray-500">RME: {u.patientId}</span>
                          ) : (
                            <span className="text-[10px] text-pink-600 font-semibold">Akun Klinik Dokter</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-mono font-bold text-gray-800">@{u.username}</p>
                          {(linkedPatient?.patientEmail || u.email) && (
                            <p className="text-[10px] text-gray-500 font-mono">
                              {linkedPatient?.patientEmail || u.email}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              u.role === "dentist" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {u.role === "dentist" ? "Dokter" : "Pasien"}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {u.password ? (
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-gray-800">
                                  {isPassVisible ? u.password : "••••••••"}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setVisiblePasswordUids((prev) => ({
                                      ...prev,
                                      [rowKey]: !prev[rowKey],
                                    }))
                                  }
                                  className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                                  title={isPassVisible ? "Sembunyikan sandi" : "Tampilkan sandi"}
                                >
                                  {isPassVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                                </button>
                              </div>
                              {u.passwordUpdatedAt && (
                                <span className="text-[9px] text-gray-400">
                                  Update: {new Date(u.passwordUpdatedAt).toLocaleDateString("id-ID")}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              Login Google
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-xs text-gray-400">
                        Belum ada akun pengguna yang tercatat di Firestore.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
