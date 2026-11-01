import React, { useState } from "react";
import { 
  Key, 
  UserPlus, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Lock, 
  ShieldCheck, 
  UserCheck,
  User,
  Check,
  ArrowRight
} from "lucide-react";
import { Patient, AppUser } from "../types";

interface PengaturanAkunProps {
  currentUser: {
    username: string;
    fullName: string;
    role: "dentist" | "patient";
    patientId?: string;
  };
  patients: Patient[];
  users: AppUser[];
  onAddUser: (newUser: AppUser) => void;
  onChangePassword: (username: string, newPassword: string) => void;
  onDeleteUser: (username: string) => void;
}

export default function PengaturanAkun({
  currentUser,
  patients,
  users,
  onAddUser,
  onChangePassword,
  onDeleteUser,
}: PengaturanAkunProps) {
  // Tabs within Account Settings: "profil", "buat-akun", "daftar-akun"
  const [activeSubTab, setActiveSubTab] = useState<"profil" | "buat-akun" | "daftar-akun">("profil");

  // State for Change Password Form
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  // State for Create New Account Form
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regRole, setRegRole] = useState<"dentist" | "patient">("patient");
  const [regPatientId, setRegPatientId] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  const [userToDelete, setUserToDelete] = useState<AppUser | null>(null);

  // Password Update handler
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");

    if (!newPassword.trim() || !confirmNewPassword.trim()) {
      setPwdError("Password baru wajib diisi");
      return;
    }

    if (newPassword.length < 4) {
      setPwdError("Password baru minimal terdiri dari 4 karakter");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPwdError("Konfirmasi password baru tidak cocok");
      return;
    }

    // Call callback to persist password change
    onChangePassword(currentUser.username, newPassword);
    setPwdSuccess("Password berhasil diperbarui!");
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  // Register New Account handler
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");

    const normUser = regUsername.trim().toLowerCase();
    if (!normUser) {
      setRegError("Username wajib diisi");
      return;
    }

    if (!/^[a-zA-Z0-9_.]+$/.test(normUser)) {
      setRegError("Username hanya boleh terdiri dari huruf, angka, titik(.) atau underscore(_)");
      return;
    }

    // Check uniqueness
    const userExists = users.some((u) => u.username.toLowerCase() === normUser);
    if (userExists) {
      setRegError(`Username "${normUser}" sudah terdaftar di sistem`);
      return;
    }

    if (regPassword.length < 4) {
      setRegError("Password minimal terdiri dari 4 karakter");
      return;
    }

    let finalFullName = regFullName.trim();
    let finalPatientId = undefined;

    if (regRole === "patient") {
      if (!regPatientId) {
        setRegError("Silakan hubungkan akun dengan salah satu Rekam Medis (RME) Pasien");
        return;
      }
      const linkedPatient = patients.find((p) => p.id === regPatientId);
      if (!linkedPatient) {
        setRegError("Rekam Medis Pasien tidak ditemukan");
        return;
      }
      finalFullName = linkedPatient.name;
      finalPatientId = regPatientId;
    } else {
      if (!finalFullName) {
        setRegError("Nama Lengkap Dokter wajib diisi");
        return;
      }
    }

    const newUser: AppUser = {
      username: normUser,
      password: regPassword,
      role: regRole,
      patientId: finalPatientId,
      fullName: finalFullName,
      createdAt: new Date().toISOString(),
    };

    onAddUser(newUser);
    setRegSuccess(`Akun "${normUser}" (${regRole === "dentist" ? "Dokter" : "Pasien"}) berhasil dibuat!`);
    
    // Clear form
    setRegUsername("");
    setRegPassword("");
    setRegFullName("");
    setRegPatientId("");
  };

  return (
    <div className="space-y-6" id="pengaturan-akun-view">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-display font-black text-gray-900 tracking-tight">Pengaturan Akun</h2>
          <p className="text-xs text-gray-500">Kelola kredensial akun Anda, buat pengguna baru, dan pantau rekam akses sistem.</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-pink-600 bg-pink-50 px-3 py-1.5 rounded-xl border border-pink-100">
          <ShieldCheck size={14} />
          <span>Role Aktif: {currentUser.role === "dentist" ? "Spesialis Ortodonti" : "Pasien Terdaftar"}</span>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex border-b border-gray-100 gap-2">
        <button
          onClick={() => {
            setActiveSubTab("profil");
            setPwdError("");
            setPwdSuccess("");
          }}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 -mb-px flex items-center gap-1.5 ${
            activeSubTab === "profil"
              ? "border-pink-500 text-pink-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Lock size={13} />
          <span>Profil & Keamanan</span>
        </button>
        <button
          onClick={() => {
            setActiveSubTab("buat-akun");
            setRegError("");
            setRegSuccess("");
          }}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 -mb-px flex items-center gap-1.5 ${
            activeSubTab === "buat-akun"
              ? "border-pink-500 text-pink-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <UserPlus size={13} />
          <span>Buat Akun Baru</span>
        </button>
        <button
          onClick={() => {
            setActiveSubTab("daftar-akun");
          }}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 -mb-px flex items-center gap-1.5 ${
            activeSubTab === "daftar-akun"
              ? "border-pink-500 text-pink-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Users size={13} />
          <span>Daftar Seluruh Akun ({users.length})</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 gap-6">

        {/* SUBTAB 1: Profile & Current Password Change */}
        {activeSubTab === "profil" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Session Card Info */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-md flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-pink-100 block">Informasi Sesi Login</span>
                  <h3 className="text-xl font-bold tracking-tight">{currentUser.fullName}</h3>
                  <p className="text-xs text-pink-50 font-mono mt-0.5">@{currentUser.username}</p>
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
                  <span className="opacity-80">Enkripsi Kunci:</span>
                  <span className="font-mono">AES-256 RME-Safe</span>
                </div>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Key size={16} className="text-pink-500" />
                  <span>Ubah Kata Sandi (Password)</span>
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">Ganti kata sandi akun aktif Anda secara berkala untuk menjaga kerahasiaan Rekam Medis.</p>
              </div>

              {pwdSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>{pwdSuccess}</span>
                </div>
              )}

              {pwdError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle size={14} className="text-rose-600 shrink-0" />
                  <span>{pwdError}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">Username Aktif</label>
                  <input
                    type="text"
                    value={currentUser.username}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50 text-gray-400 font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">Password Baru</label>
                  <input
                    type="password"
                    placeholder="Masukkan password baru"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                    required
                  />
                  <p className="text-[9px] text-gray-400">Minimal 4 karakter (kombinasi huruf & angka disarankan)</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 block">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    placeholder="Ketik ulang password baru"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Check size={14} />
                  <span>Perbarui Password</span>
                </button>
              </form>
            </div>

          </div>
        )}

        {/* SUBTAB 2: Create New Account Form */}
        {activeSubTab === "buat-akun" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-2xl space-y-6">
            
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <UserPlus size={18} className="text-pink-500" />
                <span>Formulir Pembuatan Akun Baru</span>
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">Sistem Orthodontic-Care mendukung pembuatan akun untuk dokter gigi baru maupun portal mandiri bagi pasien agar dapat mengisi Buku Harian Gigi.</p>
            </div>

            {regSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>{regSuccess}</span>
              </div>
            )}

            {regError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle size={15} className="text-rose-600 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <form onSubmit={handleCreateAccount} className="space-y-4">
              
              {/* Select Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Pilih Hak Akses / Role Akun</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRegRole("patient");
                      setRegFullName("");
                      setRegError("");
                    }}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                      regRole === "patient"
                        ? "bg-pink-50/70 border-pink-500 text-pink-700 shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50/50"
                    }`}
                  >
                    <User size={18} className={regRole === "patient" ? "text-pink-600" : "text-gray-400"} />
                    <span className="text-xs font-extrabold block">Akses Pasien</span>
                    <span className="text-[10px] opacity-80 font-medium">Buku harian, rekam medis mandiri & Chat AI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRegRole("dentist");
                      setRegPatientId("");
                      setRegError("");
                    }}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                      regRole === "dentist"
                        ? "bg-pink-50/70 border-pink-500 text-pink-700 shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50/50"
                    }`}
                  >
                    <Users size={18} className={regRole === "dentist" ? "text-pink-600" : "text-gray-400"} />
                    <span className="text-xs font-extrabold block">Akses Dokter Gigi (Sp.Ort)</span>
                    <span className="text-[10px] opacity-80 font-medium">Mengisi RME, analisis SOAP, & resep obat</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Username Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Username Login</label>
                  <input
                    type="text"
                    placeholder="Contoh: adit_rme"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500 font-mono"
                    required
                  />
                  <p className="text-[9px] text-gray-400">Gunakan huruf kecil, angka, titik, atau underscore</p>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Kata Sandi (Password)</label>
                  <input
                    type="password"
                    placeholder="Minimal 4 karakter"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                    required
                  />
                </div>
              </div>

              {/* Conditional linking based on chosen role */}
              {regRole === "patient" ? (
                <div className="space-y-1.5 p-4 bg-pink-50/30 border border-pink-100 rounded-2xl">
                  <label className="text-xs font-extrabold text-pink-900 block flex items-center gap-1.5">
                    <UserCheck size={14} className="text-pink-600" />
                    <span>Hubungkan dengan Rekam Medis (RME) Pasien</span>
                  </label>
                  <p className="text-[10px] text-pink-700/80 mb-2">Akun pasien ini akan otomatis tersinkronisasi dan menampilkan data rekam medis pasien terpilih di bawah ini:</p>
                  
                  <select
                    value={regPatientId}
                    onChange={(e) => setRegPatientId(e.target.value)}
                    className="w-full px-3 py-2 border border-pink-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-pink-500 font-bold text-pink-950"
                    required
                  >
                    <option value="">-- Pilih Profil Pasien yang Sudah Terdaftar --</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (NIK: {p.nik} - ID: {p.id})
                      </option>
                    ))}
                  </select>
                  <p className="text-[9px] text-pink-600 mt-1">
                    * Jika pasien belum ada di daftar, buat profil baru terlebih dahulu di menu <strong>Rekam Medis (RME)</strong>.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Nama Lengkap Dokter Gigi (beserta gelar)</label>
                  <input
                    type="text"
                    placeholder="Contoh: drg. Ahmad Faisal, Sp.Ort"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                    required={regRole === "dentist"}
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs py-3 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus size={14} />
                <span>Simpan dan Aktifkan Akun Baru</span>
              </button>

            </form>
          </div>
        )}

        {/* SUBTAB 3: Registered Accounts Directory */}
        {activeSubTab === "daftar-akun" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Daftar Akun Pengguna Terdaftar</h3>
                <p className="text-[11px] text-gray-500">Berikut adalah daftar seluruh akun yang dapat masuk dan mengakses aplikasi Orthodontic-Care.</p>
              </div>
              <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-1 rounded-lg">
                Total: {users.length} Akun
              </span>
            </div>

            {/* Account List Table/View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                    <th className="py-2.5 px-3">Nama Pengguna (Username)</th>
                    <th className="py-2.5 px-3">Nama Lengkap & Profil</th>
                    <th className="py-2.5 px-3">Hak Akses / Role</th>
                    <th className="py-2.5 px-3">Kunci Sandi (Untuk Demo)</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {users.map((u) => {
                    const isSystemAdmin = u.username === "drg.shinta" || u.username === "aditya" || u.username === "mia";
                    const isActiveUser = currentUser.username === u.username;

                    return (
                      <tr key={u.username} className={`hover:bg-gray-50/50 transition-all ${isActiveUser ? 'bg-pink-50/30' : ''}`}>
                        <td className="py-3 px-3 font-mono font-bold text-gray-700">
                          @{u.username}
                          {isActiveUser && (
                            <span className="ml-1.5 text-[9px] bg-pink-500 text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                              Aktif
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-gray-900">{u.fullName}</p>
                          {u.patientId ? (
                            <p className="text-[10px] text-gray-400 font-mono">RM Terhubung: {u.patientId}</p>
                          ) : (
                            <p className="text-[10px] text-pink-600">Dokter Gigi Ortodontis</p>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            u.role === "dentist" 
                              ? "bg-purple-100 text-purple-700" 
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {u.role === "dentist" ? "Dokter" : "Pasien"}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-gray-500 select-all" title="Klik ganda untuk menyalin">
                          {u.password || "••••••••"}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {isSystemAdmin ? (
                            <span className="text-[10px] text-gray-400 italic">Default</span>
                          ) : isActiveUser ? (
                            <span className="text-[10px] text-pink-600 font-bold">Sedang Digunakan</span>
                          ) : (
                            <button
                              onClick={() => {
                                setUserToDelete(u);
                              }}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 text-rose-500 rounded-lg transition-all"
                              title="Hapus Akun"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-pink-50/40 rounded-xl border border-pink-100/30 flex items-start gap-2 text-[10px] text-gray-500 max-w-3xl">
              <ShieldCheck size={14} className="text-pink-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-pink-900">Catatan Privasi Sandbox:</span> Akun yang Anda buat di atas disimpan di dalam memori penyimpanan lokal browser (localStorage) Anda sendiri. Akun default tidak dapat dihapus demi menjamin integritas demo evaluasi klinis.
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Custom User Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-left">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-gray-900">Hapus Akun Pengguna?</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Apakah Anda yakin ingin menghapus akun <strong className="text-gray-800 font-bold">@{userToDelete.username}</strong> ({userToDelete.fullName})? 
                  Pengguna ini tidak akan lagi dapat masuk ke sistem Orthodontic-Care.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteUser(userToDelete.username);
                  setUserToDelete(null);
                }}
                className="flex-1 py-2 text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Ya, Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
