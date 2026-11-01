import React, { useState, useEffect, useCallback } from "react";
import { 
  Users, 
  FileText, 
  Activity, 
  BookOpen, 
  HelpCircle, 
  Smile, 
  HeartPulse, 
  Stethoscope,
  ChevronDown,
  Lock,
  Compass,
  LogOut,
  Key,
  ShieldCheck,
  UserCheck,
  Chrome,
  Settings
} from "lucide-react";

import { Patient, SOAPExam, MonitoringLog, ChatMessage, AppUser, PatientAccessLog } from "./types";
import { initialPatients, initialExams, initialAccessLogs } from "./data/initialData";

// Import Modular Components
import Dashboard from "./components/Dashboard";
import RekamMedis from "./components/RekamMedis";
import Pemeriksaan from "./components/Pemeriksaan";
import Edukasi from "./components/Edukasi";
import Monitoring from "./components/Monitoring";
import Helpdesk from "./components/Helpdesk";
import PengaturanAkun from "./components/PengaturanAkun";

export default function App() {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("ortho_is_logged_in") === "true";
  });
  
  // Roles: dentist (Sp.Ort) vs patient (Aditya Pratama)
  const [role, setRole] = useState<"dentist" | "patient">((() => {
    const savedRole = localStorage.getItem("ortho_role");
    return (savedRole as "dentist" | "patient") || "dentist";
  })());

  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Login form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Core Persistent States using localStorage
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem("ortho_patients");
    return saved ? JSON.parse(saved) : initialPatients;
  });

  const [exams, setExams] = useState<SOAPExam[]>(() => {
    const saved = localStorage.getItem("ortho_exams");
    return saved ? JSON.parse(saved) : initialExams;
  });

  const [selectedPatientId, setSelectedPatientId] = useState<string>(() => {
    const saved = localStorage.getItem("ortho_selected_patient_id");
    return saved || initialPatients[0].id;
  });

  // Daily Tracker state
  const [logs, setLogs] = useState<MonitoringLog[]>(() => {
    const saved = localStorage.getItem("ortho_logs");
    if (saved) return JSON.parse(saved);
    
    // Seed initial realistic compliance logs for Aditya Pratama (P-101) & Siti Rahma (P-102)
    const seedLogs: MonitoringLog[] = [
      {
        id: "L-1",
        patientId: "P-101",
        date: "2026-07-09",
        alignerWearHours: 22,
        painLevel: 5,
        brushedCount: 3,
        waxUsed: true,
        notes: "Gigi ngilu setelah pemasangan kawat baru"
      },
      {
        id: "L-2",
        patientId: "P-101",
        date: "2026-07-10",
        alignerWearHours: 23,
        painLevel: 3,
        brushedCount: 3,
        waxUsed: false,
        notes: "Sariawan mereda, ngilu berkurang"
      },
      {
        id: "L-3",
        patientId: "P-101",
        date: "2026-07-11",
        alignerWearHours: 21,
        painLevel: 2,
        brushedCount: 4,
        waxUsed: false,
        notes: "Sikat gigi sela terasa sangat membantu"
      },
      {
        id: "L-4",
        patientId: "P-102",
        date: "2026-07-11",
        alignerWearHours: 22,
        painLevel: 1,
        brushedCount: 3,
        waxUsed: false,
        notes: "Karet elastis terpasang dengan baik"
      }
    ];
    return seedLogs;
  });

  // Chat/Consultation state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("ortho_chat");
    if (saved) return JSON.parse(saved);

    const initialWelcome: ChatMessage[] = [
      {
        id: "welcome-ai",
        sender: "ai",
        text: "Halo! Saya Asisten AI Ortho-Care. Saya siap membantu memberikan edukasi dan pertolongan pertama yang aman untuk behel atau clear aligner Anda sesuai dengan pedoman standar Kemenkes RI.\n\nAda keluhan atau hal yang ingin Anda tanyakan hari ini? (Misal: kawat menusuk, bracket lepas, atau aturan menyikat gigi)",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    return initialWelcome;
  });

  // Dynamic system users / accounts list state
  const [users, setUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem("ortho_users");
    if (saved) return JSON.parse(saved);
    
    const seedUsers: AppUser[] = [
      {
        username: "drg.shinta",
        password: "shinta123",
        role: "dentist",
        fullName: "drg. Shinta Amalia, Sp.Ort",
        createdAt: new Date().toISOString()
      },
      {
        username: "aditya",
        password: "aditya123",
        role: "patient",
        patientId: "P-101",
        fullName: "Aditya Pratama",
        createdAt: new Date().toISOString()
      },
      {
        username: "mia",
        password: "mia123",
        role: "patient",
        patientId: "RM-2604-1066",
        fullName: "Mia Nurkamila",
        createdAt: new Date().toISOString()
      }
    ];
    return seedUsers;
  });

  // Keep track of the specific logged-in username
  const [loggedInUsername, setLoggedInUsername] = useState<string>(() => {
    return localStorage.getItem("ortho_logged_in_username") || "drg.shinta";
  });

  // Patient Access & Activity Logs State
  const [accessLogs, setAccessLogs] = useState<PatientAccessLog[]>(() => {
    const saved = localStorage.getItem("ortho_access_logs");
    return saved ? JSON.parse(saved) : initialAccessLogs;
  });

  // Synced state persistence
  useEffect(() => {
    localStorage.setItem("ortho_patients", JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem("ortho_exams", JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem("ortho_selected_patient_id", selectedPatientId);
  }, [selectedPatientId]);

  useEffect(() => {
    localStorage.setItem("ortho_logs", JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem("ortho_chat", JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem("ortho_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("ortho_logged_in_username", loggedInUsername);
  }, [loggedInUsername]);

  useEffect(() => {
    localStorage.setItem("ortho_access_logs", JSON.stringify(accessLogs));
  }, [accessLogs]);

  // Core Access Tracking Engine: records whenever a patient accesses/interacts with the app
  const handleRecordPatientAccess = useCallback((
    targetPatientId: string,
    action: PatientAccessLog['action'],
    actionLabel: string,
    module: string,
    details?: string
  ) => {
    if (!targetPatientId) return;

    const matchedPat = patients.find(p => p.id === targetPatientId);
    const patName = matchedPat?.name || "Pasien";
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
      deviceInfo
    };

    setAccessLogs(prev => [newLog, ...prev.slice(0, 199)]);

    // Automatically update lastAccessAt and counter in the patients directory
    setPatients(prev => prev.map(p => {
      if (p.id === targetPatientId) {
        return {
          ...p,
          lastAccessAt: nowIso,
          lastAccessAction: actionLabel,
          accessCount: (p.accessCount || 0) + 1
        };
      }
      return p;
    }));
  }, [patients]);

  // Handlers for Accounts & Users
  const handleAddUser = (newUser: AppUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const handleChangePassword = (username: string, newPassword: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.username.toLowerCase() === username.toLowerCase() ? { ...u, password: newPassword } : u))
    );
  };

  const handleDeleteUser = (username: string) => {
    setUsers((prev) => prev.filter((u) => u.username.toLowerCase() !== username.toLowerCase()));
  };

  // Handlers
  const handleAddPatient = (newPatient: Patient) => {
    setPatients((prev) => [...prev, newPatient]);
  };

  const handleEditPatient = (updatedPatient: Patient) => {
    setPatients((prev) => prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)));
  };

  const handleDeletePatient = (patientId: string) => {
    setPatients((prev) => {
      const filtered = prev.filter((p) => p.id !== patientId);
      if (selectedPatientId === patientId && filtered.length > 0) {
        setSelectedPatientId(filtered[0].id);
      }
      return filtered;
    });
    setAccessLogs((prev) => prev.filter((l) => l.patientId !== patientId));
  };

  const handleAddExam = (newExam: SOAPExam) => {
    setExams((prev) => [...prev, newExam]);
  };

  const handleEditExam = (updatedExam: SOAPExam) => {
    setExams((prev) => prev.map((e) => (e.id === updatedExam.id ? updatedExam : e)));
  };

  const handleDeleteExam = (examId: string) => {
    setExams((prev) => prev.filter((e) => e.id !== examId));
  };

  const handleAddLog = (newLog: MonitoringLog) => {
    setLogs((prev) => [...prev, newLog]);
    // Record patient activity
    handleRecordPatientAccess(
      newLog.patientId,
      "fill_monitoring",
      "Mengisi Buku Harian Gigi",
      "Buku Harian Gigi",
      `Mencatat sikat gigi ${newLog.brushedCount}x, nyeri ${newLog.painLevel}/10${newLog.notes ? ` ("${newLog.notes}")` : ""}`
    );
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

  // Google OAuth Popup message listener
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      const origin = event.origin;
      // Accept standard dev environments and production urls
      if (!origin.endsWith(".run.app") && !origin.includes("localhost") && !origin.includes("127.0.0.1")) {
        return;
      }

      if (event.data?.type === "OAUTH_AUTH_SUCCESS") {
        const { user } = event.data;
        if (user) {
          if (user.roleId === "dentist") {
            setRole("dentist");
            localStorage.setItem("ortho_role", "dentist");
          } else {
            setRole("patient");
            localStorage.setItem("ortho_role", "patient");
            
            // Match with existing patient or create a new one
            const targetId = user.roleId === "patient" ? "" : user.roleId;
            const existing = patients.find(p => p.id === targetId || p.name.toLowerCase() === user.name.toLowerCase());
            let targetPatientId: string;
            if (existing) {
              targetPatientId = existing.id;
              setSelectedPatientId(existing.id);
            } else {
              // Create dynamic patient if they don't exist yet
              const newId = targetId || `P-${Math.floor(100 + Math.random() * 900)}`;
              targetPatientId = newId;
              const newPatient: Patient = {
                id: newId,
                name: user.name,
                nik: "327" + Math.floor(1000000000000 + Math.random() * 9000000000000),
                dob: "1999-04-26",
                gender: "Perempuan",
                phone: "0812" + Math.floor(10000000 + Math.random() * 90000000),
                address: "Alamat Masuk via Google Sign-In",
                bloodType: "B",
                allergies: "Tidak ada",
                createdAt: new Date().toISOString()
              };
              setPatients(prev => [...prev, newPatient]);
              setSelectedPatientId(newId);
            }
            handleRecordPatientAccess(
              targetPatientId,
              "login",
              "Masuk via Google Sign-In",
              "Autentikasi",
              `Pasien login melalui akun Google (${user.name})`
            );
          }
          localStorage.setItem("ortho_is_logged_in", "true");
          setIsLoggedIn(true);
        }
      }
    };

    window.addEventListener("message", handleOAuthMessage);
    return () => {
      window.removeEventListener("message", handleOAuthMessage);
    };
  }, [patients]);

  const handleGoogleLogin = async () => {
    setLoginError("");
    try {
      const res = await fetch("/api/auth/google/url");
      if (!res.ok) {
        throw new Error("Gagal memanggil layanan autentikasi Google.");
      }
      const data = await res.json();
      
      const popupWidth = 500;
      const popupHeight = 650;
      const left = window.screen.width / 2 - popupWidth / 2;
      const top = window.screen.height / 2 - popupHeight / 2;

      const authWindow = window.open(
        data.url,
        "google_oauth_popup",
        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},scrollbars=yes,status=no`
      );

      if (!authWindow) {
        setLoginError("Popup diblokir! Silakan aktifkan izin popup di peramban (browser) Anda untuk masuk dengan Google.");
      }
    } catch (err: any) {
      console.error("Google Auth error:", err);
      setLoginError(err.message || "Gagal masuk menggunakan Google.");
    }
  };

  // Auth Submit Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const normUser = username.trim().toLowerCase();
    const normPass = password.trim();

    // Look up user in the registered users list
    const matchedUser = users.find(u => u.username.toLowerCase() === normUser);

    if (matchedUser) {
      if (matchedUser.password === normPass) {
        // Successful login!
        setRole(matchedUser.role);
        localStorage.setItem("ortho_role", matchedUser.role);
        
        // If it's a patient, link to their patientId
        if (matchedUser.role === "patient" && matchedUser.patientId) {
          setSelectedPatientId(matchedUser.patientId);
          handleRecordPatientAccess(
            matchedUser.patientId,
            "login",
            "Masuk ke Aplikasi",
            "Autentikasi",
            `Login berhasil sebagai pasien (${matchedUser.fullName})`
          );
        }

        setLoggedInUsername(matchedUser.username);
        localStorage.setItem("ortho_logged_in_username", matchedUser.username);
        localStorage.setItem("ortho_is_logged_in", "true");
        setIsLoggedIn(true);
      } else {
        setLoginError("Kata sandi yang Anda masukkan salah.");
      }
    } else {
      // Fallback fallback checks
      if (role === "dentist" && normUser === "drg.shinta" && normPass === "shinta123") {
        setRole("dentist");
        localStorage.setItem("ortho_role", "dentist");
        setLoggedInUsername("drg.shinta");
        localStorage.setItem("ortho_logged_in_username", "drg.shinta");
        localStorage.setItem("ortho_is_logged_in", "true");
        setIsLoggedIn(true);
      } else if (role === "patient" && normUser === "aditya" && normPass === "aditya123") {
        setRole("patient");
        localStorage.setItem("ortho_role", "patient");
        setSelectedPatientId("P-101");
        setLoggedInUsername("aditya");
        localStorage.setItem("ortho_logged_in_username", "aditya");
        localStorage.setItem("ortho_is_logged_in", "true");
        setIsLoggedIn(true);
        handleRecordPatientAccess(
          "P-101",
          "login",
          "Masuk ke Aplikasi",
          "Autentikasi",
          "Login berhasil sebagai pasien (Aditya Pratama)"
        );
      } else if (role === "patient" && normUser === "mia" && normPass === "mia123") {
        setRole("patient");
        localStorage.setItem("ortho_role", "patient");
        setSelectedPatientId("RM-2604-1066");
        setLoggedInUsername("mia");
        localStorage.setItem("ortho_logged_in_username", "mia");
        localStorage.setItem("ortho_is_logged_in", "true");
        setIsLoggedIn(true);
        handleRecordPatientAccess(
          "RM-2604-1066",
          "login",
          "Masuk ke Aplikasi",
          "Autentikasi",
          "Login berhasil sebagai pasien (Mia Nurkamila)"
        );
      } else {
        setLoginError("Username atau Kata Sandi tidak ditemukan. Jika Anda membuat akun baru, pastikan username diketik dengan benar.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ortho_is_logged_in");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setLoginError("");
  };

  // Quick helper to fill credentials
  const fillCredentials = (targetRole: "dentist" | "patient") => {
    setRole(targetRole);
    setLoginError("");
    if (targetRole === "dentist") {
      setUsername("drg.shinta");
      setPassword("shinta123");
    } else {
      setUsername("aditya");
      setPassword("aditya123");
    }
  };

  // Track initial access on session load if patient is already logged in
  useEffect(() => {
    if (isLoggedIn && role === "patient" && selectedPatientId) {
      const todayDateStr = new Date().toISOString().slice(0, 13); // once per hour session
      const sessionKey = `ortho_patient_session_${selectedPatientId}_${todayDateStr}`;
      if (!sessionStorage.getItem(sessionKey)) {
        sessionStorage.setItem(sessionKey, "true");
        handleRecordPatientAccess(
          selectedPatientId,
          "open_app",
          "Membuka Aplikasi",
          "Dashboard Pasien",
          "Pasien mengakses aplikasi via peramban web"
        );
      }
    }
  }, [isLoggedIn, role, selectedPatientId, handleRecordPatientAccess]);

  const handleNavigateTab = (tabId: string) => {
    setActiveTab(tabId);
    if (role === "patient" && selectedPatientId) {
      let action: PatientAccessLog['action'] = "open_app";
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
        details = "Memeriksa profil dan riwayat sesi keamanan";
      }

      handleRecordPatientAccess(selectedPatientId, action, actionLabel, moduleName, details);
    }
  };

  const activePatientName = patients.find(p => p.id === selectedPatientId)?.name || "Aditya Pratama";
  const loggedInUserObj = users.find(u => u.username.toLowerCase() === loggedInUsername.toLowerCase());
  const activeUserFullName = loggedInUserObj?.fullName || (role === "dentist" ? "drg. Shinta Amalia, Sp.Ort" : activePatientName);

  // Navigation Items (Pink theme styling will reflect here)
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

  // Render Login view if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50/30 to-pink-100/40 flex items-center justify-center p-4 font-sans antialiased text-gray-800" id="login-container">
        <div className="w-full max-w-md bg-white rounded-3xl border border-pink-100 shadow-xl overflow-hidden p-6 space-y-6">
          
          {/* Logo Brand */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 rounded-3xl bg-pink-50/80 flex items-center justify-center shadow-md mx-auto p-2 border border-pink-100/50 hover:scale-105 transition-all">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Stylized healthy tooth */}
                <path d="M 50,15 
                         C 68,15 78,22 78,38 
                         C 78,52 70,58 70,74 
                         C 70,81 66,85 61,85 
                         C 56,85 53,80 50,73 
                         C 47,80 44,85 39,85 
                         C 34,85 30,81 30,74 
                         C 30,58 22,52 22,38 
                         C 22,22 32,15 50,15 Z" 
                      fill="#FFFFFF" 
                      stroke="#EC4899" 
                      strokeWidth="5.5" 
                      strokeLinejoin="round" 
                />
                {/* Metallic archwire */}
                <path d="M 10,48 Q 50,56 90,48" 
                      fill="none" 
                      stroke="#94A3B8" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                />
                {/* Orthodontic bracket assembly */}
                <g transform="translate(37, 36)">
                  {/* Bracket metal base */}
                  <rect x="0" y="0" width="26" height="24" rx="4" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.5" />
                  {/* Pink elastic ring (O-ring rubber) */}
                  <rect x="-2" y="-2" width="30" height="28" rx="6" fill="none" stroke="#EC4899" strokeWidth="3" />
                  {/* Horizontal bracket slot for wire */}
                  <rect x="-4" y="10" width="34" height="4" fill="#475569" />
                  {/* Vertical bracket details */}
                  <rect x="11" y="-3" width="4" height="30" fill="#475569" />
                  {/* Tiny wings */}
                  <circle cx="5" cy="5" r="2.5" fill="#94A3B8" />
                  <circle cx="21" cy="5" r="2.5" fill="#94A3B8" />
                  <circle cx="5" cy="19" r="2.5" fill="#94A3B8" />
                  <circle cx="21" cy="19" r="2.5" fill="#94A3B8" />
                </g>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight text-pink-700">Orthodontic-Care</h1>
              <p className="text-xs text-pink-500 font-semibold">Rekam Medis Elektronik & Pemantauan Orto</p>
            </div>
          </div>

          {/* Role switcher inside login card */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-pink-700 tracking-wider block text-center">Masuk Sebagai</label>
            <div className="flex bg-pink-50/50 p-1 rounded-xl border border-pink-100">
              <button
                type="button"
                onClick={() => {
                  setRole("dentist");
                  setUsername("");
                  setPassword("");
                  setLoginError("");
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  role === "dentist"
                    ? "bg-pink-500 text-white shadow-sm"
                    : "text-pink-600 hover:text-pink-800"
                }`}
              >
                <Stethoscope size={14} />
                <span>Dokter Gigi Sp.Ort</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("patient");
                  setUsername("");
                  setPassword("");
                  setLoginError("");
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  role === "patient"
                    ? "bg-pink-500 text-white shadow-sm"
                    : "text-pink-600 hover:text-pink-800"
                }`}
              >
                <Smile size={14} />
                <span>Pasien RME</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {loginError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
                <Lock size={14} className="text-rose-500 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={role === "dentist" ? "drg.shinta" : "aditya"}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500 bg-gray-50 focus:bg-white transition-all"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500 bg-gray-50 focus:bg-white transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck size={14} />
              <span>Masuk Aplikasi</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">atau</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-slate-50 text-gray-750 border border-gray-200 font-bold text-xs py-3 rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Chrome size={14} className="text-pink-500 animate-pulse" />
              <span>Login dengan Google</span>
            </button>
          </form>

          {/* Quick Pre-fills demo helper */}
          <div className="bg-pink-50/30 p-4 rounded-2xl border border-pink-100 space-y-2">
            <span className="text-[10px] font-black uppercase text-pink-700 tracking-wider block text-center">Fast Demo Access</span>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => fillCredentials("dentist")}
                className="py-1.5 px-1 bg-white hover:bg-pink-50 text-[9px] font-bold text-pink-700 border border-pink-200 rounded-lg transition-all text-center"
              >
                🔑 drg. Shinta
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("patient");
                  setLoginError("");
                  setUsername("aditya");
                  setPassword("aditya123");
                }}
                className="py-1.5 px-1 bg-white hover:bg-pink-50 text-[9px] font-bold text-pink-700 border border-pink-200 rounded-lg transition-all text-center"
              >
                🔑 Pt. Aditya
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("patient");
                  setLoginError("");
                  setUsername("mia");
                  setPassword("mia123");
                }}
                className="py-1.5 px-1 bg-white hover:bg-pink-50 text-[9px] font-bold text-pink-700 border border-pink-200 rounded-lg transition-all text-center"
              >
                🔑 Pt. Mia
              </button>
            </div>
            <p className="text-[9px] text-center text-pink-400 mt-1">
              Pasien terhubung: <strong>Aditya Pratama</strong> (P-101) & <strong>Mia Nurkamila</strong> (RM-2604-1066)
            </p>
          </div>

          {/* SatuSehat Badge */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-pink-400 bg-pink-50/50 py-1.5 rounded-lg border border-pink-100">
            <ShieldCheck size={12} />
            <span>Kemenkes SATUSEHAT Sandbox Sandboxed</span>
          </div>

        </div>
      </div>
    );
  }

  // Logged-in application layout
  return (
    <div className="min-h-screen bg-pink-50/10 flex flex-col font-sans antialiased text-gray-800 animate-fade-in" id="applet-viewport">
      
      {/* Top Banner: Role Selection */}
      <header className="bg-white border-b border-pink-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-pink-500 text-white flex items-center justify-center font-bold shadow-md">
              <HeartPulse size={20} />
            </div>
            <div>
              <span className="text-sm font-display font-black tracking-tight text-gray-900 block">Orthodontic-Care</span>
            </div>
          </div>

          {/* Middle Logged in status (No role switcher here because we log in formally now!) */}
          <div className="flex items-center gap-3 bg-pink-50/50 px-3 py-1.5 rounded-xl border border-pink-100">
            <div className="w-6 h-6 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 text-xs font-black">
              {role === "dentist" ? "Dr" : "Pt"}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-[10px] text-pink-600 font-bold block">Aktif Login:</span>
              <span className="text-xs font-bold text-gray-800 block -mt-1">
                {activeUserFullName}
              </span>
            </div>
          </div>

          {/* Logout Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-250 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Keluar dari Aplikasi"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col md:flex-row gap-6">
        
        {/* Navigation Rail / Sidebar */}
        <nav className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none border-b md:border-b-0 md:border-r border-pink-50 pr-0 md:pr-4">
          <div className="hidden md:block mb-4">
            <span className="text-[10px] font-black uppercase text-pink-400 tracking-wider px-3">
              Menu Utama
            </span>
          </div>

          {currentNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigateTab(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 whitespace-nowrap ${
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
            />
          )}

          {activeTab === "helpdesk" && (
            <Helpdesk
              chatHistory={chatHistory}
              onAddMessage={handleAddChatMessage}
            />
          )}

          {activeTab === "pengaturan-akun" && (
            <PengaturanAkun
              currentUser={{
                username: loggedInUsername,
                fullName: activeUserFullName,
                role: role,
                patientId: role === "patient" ? selectedPatientId : undefined
              }}
              patients={patients}
              users={users}
              onAddUser={handleAddUser}
              onChangePassword={handleChangePassword}
              onDeleteUser={handleDeleteUser}
            />
          )}

        </main>
      </div>

      {/* Humble Footer */}
      <footer className="bg-white border-t border-pink-100 py-4 mt-auto text-center text-[10px] text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 Orthodontic-Care & RME. Selaras dengan PMK No. 24 Tahun 2022 tentang Rekam Medis Elektronik.</p>
          <p className="font-semibold text-pink-600">Terdaftar di Kemenkes RI SATUSEHAT Ecosystem | Pink Theme</p>
        </div>
      </footer>

    </div>
  );
}

