import React, { useState } from "react";
import { 
  Search, 
  UserPlus, 
  User, 
  Calendar, 
  Phone, 
  MapPin, 
  PlusCircle, 
  Activity, 
  Check, 
  AlertCircle,
  FileText,
  Edit,
  Trash2,
  Clock,
  Radio,
  Smartphone,
  Monitor,
  MessageCircle,
  History
} from "lucide-react";
import { Patient, SOAPExam, PatientAccessLog } from "../types";
import { 
  getPatientAccessStatus, 
  formatRelativeTime, 
  formatFullIndoDateTime 
} from "../utils/accessUtils";

interface RekamMedisProps {
  role?: "dentist" | "patient";
  patients: Patient[];
  exams: SOAPExam[];
  selectedPatientId: string;
  onSelectPatient: (id: string) => void;
  onAddPatient: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (id: string) => void;
  onEditExam?: (exam: SOAPExam) => void;
  onDeleteExam?: (id: string) => void;
  onNavigateToExam: () => void;
  accessLogs?: PatientAccessLog[];
}

export default function RekamMedis({
  role = "dentist",
  patients,
  exams,
  selectedPatientId,
  onSelectPatient,
  onAddPatient,
  onEditPatient,
  onDeletePatient,
  onEditExam,
  onDeleteExam,
  onNavigateToExam,
  accessLogs = [],
}: RekamMedisProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [showAccessHistory, setShowAccessHistory] = useState(false);

  const handleSendWaReminder = (patient: Patient) => {
    const cleanPhone = (patient.phone || "").replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;
    const msg = `Halo ${patient.name}, kami dari klinik ortodonsia ingin mengingatkan Anda untuk mengecek perkembangan kawat gigi Anda dan mengisi catatan harian di aplikasi Orthodontic Care. Terima kasih!`;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };
  
  // SOAP Exam Edit and Delete States
  const [examToDelete, setExamToDelete] = useState<SOAPExam | null>(null);
  const [examToEdit, setExamToEdit] = useState<SOAPExam | null>(null);
  const [editExamForm, setEditExamForm] = useState({
    date: "",
    subjective: "",
    generalStatus: "",
    extraOral: "",
    intraOral: "",
    malocclusionClass: "Normal" as SOAPExam["objective"]["malocclusionClass"],
    overjet: 0,
    overbite: 0,
    crowdingUpper: false,
    crowdingLower: false,
    spacingUpper: false,
    spacingLower: false,
    odontogramNotes: "",
    pcrScore: 0,
    pcrTeethCount: 28,
    pcrPlaqueSurfacesCount: 0,
    pcrInterpretation: "Baik" as "Baik" | "Buruk",
    assessment: "",
    treatmentStage: "Inisiasi" as SOAPExam["plan"]["treatmentStage"],
    procedure: "",
    prescription: "",
    nextVisitDate: "",
  });

  const handleStartEditExam = (exam: SOAPExam) => {
    setEditExamForm({
      date: exam.date,
      subjective: exam.subjective,
      generalStatus: exam.objective.generalStatus || "",
      extraOral: exam.objective.extraOral || "",
      intraOral: exam.objective.intraOral || "",
      malocclusionClass: exam.objective.malocclusionClass || "Normal",
      overjet: exam.objective.overjet || 0,
      overbite: exam.objective.overbite || 0,
      crowdingUpper: !!exam.objective.crowdingUpper,
      crowdingLower: !!exam.objective.crowdingLower,
      spacingUpper: !!exam.objective.spacingUpper,
      spacingLower: !!exam.objective.spacingLower,
      odontogramNotes: exam.objective.odontogramNotes || "",
      pcrScore: exam.objective.pcrScore || 0,
      pcrTeethCount: exam.objective.pcrTeethCount || 28,
      pcrPlaqueSurfacesCount: exam.objective.pcrPlaqueSurfacesCount || 0,
      pcrInterpretation: exam.objective.pcrInterpretation || "Baik",
      assessment: exam.assessment || "",
      treatmentStage: exam.plan.treatmentStage || "Inisiasi",
      procedure: exam.plan.procedure || "",
      prescription: exam.plan.prescription || "",
      nextVisitDate: exam.plan.nextVisitDate || "",
    });
    setExamToEdit(exam);
  };
  
  // Registration Form State
  const [formData, setFormData] = useState({
    name: "",
    nik: "",
    dob: "",
    gender: "Perempuan" as "Laki-laki" | "Perempuan",
    phone: "",
    address: "",
    bloodType: "O",
    allergies: "",
  });

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    name: "",
    nik: "",
    dob: "",
    gender: "Perempuan" as "Laki-laki" | "Perempuan",
    phone: "",
    address: "",
    bloodType: "O",
    allergies: "",
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Filter patients based on Search term (Name or NIK)
  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nik.includes(searchTerm)
  );

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  const patientExams = exams.filter((e) => e.patientId === selectedPatient?.id);

  if (role === "patient") {
    const activePatient = selectedPatient;
    return (
      <div className="max-w-4xl mx-auto space-y-6" id="rekam-medis-patient-view">
        {/* Header specifically styled for patients */}
        <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm space-y-1">
          <h1 className="text-xl font-bold text-pink-600 flex items-center gap-2">
            <FileText className="text-pink-600" size={24} />
            Rekam Medis Elektronik Saya (RME)
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Histori lengkap rekam medis klinis dan rencana pemeriksaan ortodonsia Anda yang resmi tercatat di SatuSehat Kemenkes RI.
          </p>
        </div>

        {/* Demographics Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center font-black text-xl">
                {activePatient?.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{activePatient?.name}</h2>
                <p className="text-xs text-gray-400">ID Pasien: <span className="font-mono text-gray-700 font-bold">{activePatient?.id}</span></p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">SATUSEHAT Verified</span>
            </div>
          </div>

          {/* Grid Demographics Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2.5 text-gray-600">
              <Activity size={16} className="text-pink-500 shrink-0" />
              <span>NIK KTP: <strong className="font-mono text-gray-800">{activePatient?.nik}</strong></span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-600">
              <Calendar size={16} className="text-pink-500 shrink-0" />
              <span>Lahir: <strong className="text-gray-800">{activePatient?.dob}</strong></span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-600">
              <User size={16} className="text-pink-500 shrink-0" />
              <span>Gender: <strong className="text-gray-800">{activePatient?.gender}</strong></span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-600">
              <Phone size={16} className="text-pink-500 shrink-0" />
              <span>WhatsApp: <strong className="text-gray-800">{activePatient?.phone}</strong></span>
            </div>
            <div className="flex items-start gap-2.5 text-gray-600 sm:col-span-2">
              <MapPin size={16} className="text-pink-500 shrink-0 mt-0.5" />
              <span>Alamat: <strong className="text-gray-800">{activePatient?.address}</strong></span>
            </div>
          </div>

          {/* Medical Risk Alerts */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-pink-50/50 rounded-xl border border-pink-100">
              <span className="text-[10px] text-pink-600 uppercase font-black">Golongan Darah</span>
              <p className="text-sm font-black text-pink-950 mt-0.5">{activePatient?.bloodType || "O"}</p>
            </div>
            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
              <span className="text-[10px] text-amber-600 uppercase font-black">Riwayat Alergi</span>
              <p className="text-sm font-black text-amber-950 mt-0.5 truncate" title={activePatient?.allergies}>
                {activePatient?.allergies || "Tidak ada"}
              </p>
            </div>
          </div>
        </div>

        {/* SOAP History Timeline */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <FileText size={18} className="text-pink-600" />
            <span>Riwayat Pemeriksaan Ortodonsia Anda (SOAP)</span>
          </h3>

          {patientExams.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl">
              <AlertCircle className="mx-auto text-gray-300 mb-2" size={28} />
              <p className="text-xs text-gray-500">Belum ada riwayat pemeriksaan klinis orto.</p>
              <p className="text-[11px] text-gray-400 mt-1">
                Data rekam medis akan otomatis muncul di sini setelah Anda melakukan kontrol rutin di klinik.
              </p>
            </div>
          ) : (
            <div className="relative border-l border-pink-100 pl-4 space-y-6">
              {patientExams
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((exam) => (
                  <div key={exam.id} className="relative space-y-2">
                    {/* Dot marker */}
                    <span className="absolute -left-[21px] top-1.5 w-3.5 h-3.5 rounded-full bg-pink-600 border-2 border-white shadow-sm flex items-center justify-center">
                      <Check size={8} className="text-white" />
                    </span>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span className="text-xs font-black text-gray-800">{exam.date}</span>
                      <span className="text-[10px] font-mono text-gray-400">ID: {exam.id} | Dokter: {exam.dentistName}</span>
                    </div>

                    {/* RME SOAP Details Panel */}
                    <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 space-y-3 text-xs leading-relaxed">
                      {/* Subjective */}
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 tracking-wider block">S (SUBJEKTIF / KELUHAN)</span>
                        <p className="text-gray-700 font-medium">{exam.subjective}</p>
                      </div>

                      {/* Objective */}
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 tracking-wider block">O (OBJEKTIF / PEMERIKSAAN FISIK GIGI)</span>
                        <div className="grid grid-cols-2 gap-2 mt-1 bg-white p-2.5 rounded-lg border border-gray-100 text-[11px]">
                          <div><span className="text-gray-400">Kelas Maloklusi Angle:</span> <strong className="text-gray-700">{exam.objective.malocclusionClass}</strong></div>
                          <div><span className="text-gray-400">Overjet / Overbite:</span> <strong className="text-gray-700">{exam.objective.overjet}mm / {exam.objective.overbite}mm</strong></div>
                          <div className="col-span-2">
                            <span className="text-gray-400">Anomali Lengkung Gigi:</span>{" "}
                            <strong className="text-gray-700">
                              {[
                                exam.objective.crowdingUpper ? "Crowding Rahang Atas (Berjejal Atas)" : "",
                                exam.objective.crowdingLower ? "Crowding Rahang Bawah (Berjejal Bawah)" : "",
                                exam.objective.spacingUpper ? "Spacing Rahang Atas (Diastema Atas)" : "",
                                exam.objective.spacingLower ? "Spacing Rahang Bawah (Diastema Bawah)" : "",
                              ].filter(Boolean).join(", ") || "Tidak ada anomali"}
                            </strong>
                          </div>
                          <div className="col-span-2 border-t border-gray-50 pt-1 mt-1">
                            <span className="text-gray-400">Catatan Odontogram & Cephalometry:</span>{" "}
                            <p className="text-[11px] text-gray-600 italic mt-0.5">{exam.objective.odontogramNotes}</p>
                          </div>
                          {exam.objective.pcrScore !== undefined && (
                            <div className="col-span-2 border-t border-gray-100 pt-1.5 mt-1">
                              <span className="text-gray-400 font-bold">Indeks Plak (PCR):</span>{" "}
                              <span className="inline-flex items-center gap-1.5">
                                <strong className="text-gray-800 text-[12px]">{exam.objective.pcrScore}%</strong>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                                  exam.objective.pcrInterpretation === 'Baik' 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                }`}>
                                  {exam.objective.pcrInterpretation || (exam.objective.pcrScore < 10 ? 'Baik' : 'Buruk')}
                                </span>
                                <span className="text-gray-400 text-[10px] font-medium">
                                  ({exam.objective.pcrPlaqueSurfacesCount || 0} / {(exam.objective.pcrTeethCount || 28) * 4} permukaan berplak)
                                </span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Assessment */}
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 tracking-wider block">A (ASESMEN / DIAGNOSA DOKTER)</span>
                        <p className="text-pink-900 font-bold">{exam.assessment}</p>
                      </div>

                      {/* Plan */}
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 tracking-wider block">P (PLAN / RENCANA TATA LAKSANA)</span>
                        <div className="space-y-1 mt-0.5">
                          <p className="text-gray-700"><strong>Tahap Perawatan:</strong> <span className="text-pink-700 font-bold">{exam.plan.treatmentStage}</span></p>
                          <p className="text-gray-700"><strong>Prosedur Aktivasi:</strong> {exam.plan.procedure}</p>
                          {exam.plan.prescription && <p className="text-gray-600 bg-pink-50 border border-pink-100 px-2 py-1 rounded inline-block text-[11px]"><strong>Resep/Instruksi Alat:</strong> {exam.plan.prescription}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Form Validation
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = "Nama wajib diisi";
    
    // NIK must be exactly 16 digits
    if (!formData.nik.trim()) {
      errors.nik = "NIK wajib diisi";
    } else if (!/^\d{16}$/.test(formData.nik)) {
      errors.nik = "NIK harus terdiri dari 16 digit angka sesuai KTP";
    }

    if (!formData.dob) errors.dob = "Tanggal lahir wajib diisi";
    if (!formData.phone.trim()) {
      errors.phone = "Nomor telepon wajib diisi";
    } else if (!/^\d{10,14}$/.test(formData.phone.replace(/\D/g, ""))) {
      errors.phone = "Nomor telepon tidak valid (10-14 digit)";
    }
    
    if (!formData.address.trim()) errors.address = "Alamat wajib diisi";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newPatient: Patient = {
      id: `P-${101 + patients.length}`,
      name: formData.name,
      nik: formData.nik,
      dob: formData.dob,
      gender: formData.gender,
      phone: formData.phone,
      address: formData.address,
      bloodType: formData.bloodType,
      allergies: formData.allergies || "Tidak ada",
      createdAt: new Date().toISOString(),
    };

    onAddPatient(newPatient);
    onSelectPatient(newPatient.id);
    setIsAdding(false);
    
    // Reset Form
    setFormData({
      name: "",
      nik: "",
      dob: "",
      gender: "Perempuan",
      phone: "",
      address: "",
      bloodType: "O",
      allergies: "",
    });
    setFormErrors({});
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};
    if (!editFormData.name.trim()) errors.name = "Nama wajib diisi";
    
    if (!editFormData.nik.trim()) {
      errors.nik = "NIK wajib diisi";
    } else if (!/^\d{16}$/.test(editFormData.nik)) {
      errors.nik = "NIK harus terdiri dari 16 digit angka sesuai KTP";
    }

    if (!editFormData.dob) errors.dob = "Tanggal lahir wajib diisi";
    if (!editFormData.phone.trim()) {
      errors.phone = "Nomor telepon wajib diisi";
    } else if (!/^\d{10,14}$/.test(editFormData.phone.replace(/\D/g, ""))) {
      errors.phone = "Nomor telepon tidak valid (10-14 digit)";
    }
    
    if (!editFormData.address.trim()) errors.address = "Alamat wajib diisi";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (selectedPatient) {
      const updatedPatient: Patient = {
        ...selectedPatient,
        name: editFormData.name,
        nik: editFormData.nik,
        dob: editFormData.dob,
        gender: editFormData.gender,
        phone: editFormData.phone,
        address: editFormData.address,
        bloodType: editFormData.bloodType,
        allergies: editFormData.allergies || "Tidak ada",
      };
      onEditPatient(updatedPatient);
      setIsEditing(false);
      setFormErrors({});
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="rekam-medis-container">
      {/* Sidebar: Patients Directory */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Daftar Pasien</h2>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="p-1.5 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 transition-all flex items-center gap-1 text-xs font-bold"
          >
            <UserPlus size={16} />
            <span>Baru</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari Nama atau NIK..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500 focus:bg-white transition-all"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
        </div>

        {/* Patients List */}
        <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1">
          {filteredPatients.map((pat) => (
            <div
              key={pat.id}
              className={`w-full p-3 rounded-xl flex items-center justify-between transition-all border ${
                selectedPatient?.id === pat.id && !isAdding
                  ? "bg-pink-500 text-white border-pink-500 shadow-sm"
                  : "bg-white hover:bg-gray-50 text-gray-700 border-gray-100"
              }`}
            >
              <div 
                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                onClick={() => {
                  onSelectPatient(pat.id);
                  setIsAdding(false);
                  setIsEditing(false);
                }}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    selectedPatient?.id === pat.id && !isAdding
                      ? "bg-pink-600 text-pink-50"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {pat.name.charAt(0)}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold truncate">{pat.name}</p>
                  <p
                    className={`text-[10px] ${
                      selectedPatient?.id === pat.id && !isAdding
                        ? "text-pink-100"
                        : "text-gray-400"
                    }`}
                  >
                    NIK: {pat.nik}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPatient(pat.id);
                    setIsAdding(false);
                    setEditFormData({
                      name: pat.name,
                      nik: pat.nik,
                      dob: pat.dob,
                      gender: pat.gender,
                      phone: pat.phone,
                      address: pat.address,
                      bloodType: pat.bloodType || "O",
                      allergies: pat.allergies || "",
                    });
                    setIsEditing(true);
                  }}
                  title="Edit Pasien"
                  className={`p-1 rounded-lg transition-all cursor-pointer ${
                    selectedPatient?.id === pat.id && !isAdding
                      ? "text-pink-100 hover:bg-pink-600 hover:text-white"
                      : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                  }`}
                >
                  <Edit size={13} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPatientToDelete(pat);
                  }}
                  title="Hapus Pasien"
                  className={`p-1 rounded-lg transition-all cursor-pointer ${
                    selectedPatient?.id === pat.id && !isAdding
                      ? "text-rose-200 hover:bg-rose-600 hover:text-white"
                      : "text-rose-400 hover:bg-rose-50 hover:text-rose-600"
                  }`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}

          {filteredPatients.length === 0 && (
            <div className="text-center py-8">
              <p className="text-xs text-gray-400">Tidak ada pasien ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Panel: RME Detail or Add Patient Form */}
      <div className="lg:col-span-2 space-y-6">
        {isAdding ? (
          /* Add Patient Form */
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-900">Registrasi Pasien Baru (RME)</h2>
              <p className="text-xs text-gray-500">
                Lengkapi identitas pasien. Nomor Induk Kependudukan (NIK) terintegrasi secara elektronik ke SatuSehat Kemenkes.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Nama Lengkap Sesuai KTP</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                    placeholder="Contoh: Aditya Pratama"
                  />
                  {formErrors.name && (
                    <p className="text-[10px] text-rose-500 font-semibold">{formErrors.name}</p>
                  )}
                </div>

                {/* NIK */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">NIK (Nomor Induk Kependudukan)</label>
                  <input
                    type="text"
                    maxLength={16}
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, "") })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500 font-mono"
                    placeholder="16 Digit NIK KTP"
                  />
                  {formErrors.nik && (
                    <p className="text-[10px] text-rose-500 font-semibold">{formErrors.nik}</p>
                  )}
                </div>

                {/* DOB */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                  />
                  {formErrors.dob && (
                    <p className="text-[10px] text-rose-500 font-semibold">{formErrors.dob}</p>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Jenis Kelamin</label>
                  <div className="flex gap-2">
                    {["Laki-laki", "Perempuan"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: g as any })}
                        className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                          formData.gender === g
                            ? "bg-pink-50 border-pink-500 text-pink-700 shadow-sm"
                            : "bg-white border-gray-200 text-gray-600"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">No. Telepon / WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                    placeholder="Contoh: 0812XXXXXXXX"
                  />
                  {formErrors.phone && (
                    <p className="text-[10px] text-rose-500 font-semibold">{formErrors.phone}</p>
                  )}
                </div>

                {/* Blood Type */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Golongan Darah (Opsional)</label>
                  <select
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-pink-500"
                  >
                    {["O", "A", "B", "AB", "Tidak Tahu"].map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Alamat Tempat Tinggal</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                  placeholder="Nama jalan, kecamatan, kabupaten, kode pos..."
                />
                {formErrors.address && (
                  <p className="text-[10px] text-rose-500 font-semibold">{formErrors.address}</p>
                )}
              </div>

              {/* Allergies */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Riwayat Alergi (Opsional)</label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                  placeholder="Misal: Alergi Penisilin, Lateks, atau Makanan Laut"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white rounded-xl shadow-sm transition-all"
                >
                  Simpan Rekam Medis
                </button>
              </div>
            </form>
          </div>
        ) : isEditing && selectedPatient ? (
          /* Edit Patient Form */
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-900">Ubah Identitas Pasien (RME)</h2>
              <p className="text-xs text-gray-500">
                Ubah identitas pasien &quot;{selectedPatient.name}&quot;. Perubahan ini akan terintegrasi ke SatuSehat Kemenkes Sandbox.
              </p>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Nama Lengkap Sesuai KTP</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                    placeholder="Contoh: Aditya Pratama"
                  />
                  {formErrors.name && (
                    <p className="text-[10px] text-rose-500 font-semibold">{formErrors.name}</p>
                  )}
                </div>

                {/* NIK */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">NIK (Nomor Induk Kependudukan)</label>
                  <input
                    type="text"
                    maxLength={16}
                    value={editFormData.nik}
                    onChange={(e) => setEditFormData({ ...editFormData, nik: e.target.value.replace(/\D/g, "") })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500 font-mono"
                    placeholder="16 Digit NIK KTP"
                  />
                  {formErrors.nik && (
                    <p className="text-[10px] text-rose-500 font-semibold">{formErrors.nik}</p>
                  )}
                </div>

                {/* DOB */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={editFormData.dob}
                    onChange={(e) => setEditFormData({ ...editFormData, dob: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                  />
                  {formErrors.dob && (
                    <p className="text-[10px] text-rose-500 font-semibold">{formErrors.dob}</p>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Jenis Kelamin</label>
                  <div className="flex gap-2">
                    {["Laki-laki", "Perempuan"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setEditFormData({ ...editFormData, gender: g as any })}
                        className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                          editFormData.gender === g
                            ? "bg-pink-50 border-pink-500 text-pink-700 shadow-sm"
                            : "bg-white border-gray-200 text-gray-600"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">No. Telepon / WhatsApp</label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                    placeholder="Contoh: 0812XXXXXXXX"
                  />
                  {formErrors.phone && (
                    <p className="text-[10px] text-rose-500 font-semibold">{formErrors.phone}</p>
                  )}
                </div>

                {/* Blood Type */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Golongan Darah (Opsional)</label>
                  <select
                    value={editFormData.bloodType}
                    onChange={(e) => setEditFormData({ ...editFormData, bloodType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-pink-500"
                  >
                    {["O", "A", "B", "AB", "Tidak Tahu"].map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Alamat Tempat Tinggal</label>
                <textarea
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                  placeholder="Nama jalan, kecamatan, kabupaten, kode pos..."
                />
                {formErrors.address && (
                  <p className="text-[10px] text-rose-500 font-semibold">{formErrors.address}</p>
                )}
              </div>

              {/* Allergies */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Riwayat Alergi (Opsional)</label>
                <input
                  type="text"
                  value={editFormData.allergies}
                  onChange={(e) => setEditFormData({ ...editFormData, allergies: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                  placeholder="Misal: Alergi Penisilin, Lateks, atau Makanan Laut"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white rounded-xl shadow-sm transition-all"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        ) : selectedPatient ? (
          /* Profile & Examination Timeline View */
          <div className="space-y-6">
            {/* Demographics Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center font-black text-xl">
                    {selectedPatient.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{selectedPatient.name}</h2>
                    <p className="text-xs text-gray-400">ID Pasien: <span className="font-mono text-gray-700">{selectedPatient.id}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {role === "dentist" && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditFormData({
                            name: selectedPatient.name,
                            nik: selectedPatient.nik,
                            dob: selectedPatient.dob,
                            gender: selectedPatient.gender,
                            phone: selectedPatient.phone,
                            address: selectedPatient.address,
                            bloodType: selectedPatient.bloodType || "O",
                            allergies: selectedPatient.allergies || "",
                          });
                          setIsEditing(true);
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Ubah identitas dan biodata pasien"
                      >
                        <Edit size={14} className="text-gray-500" />
                        <span>Ubah Data</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPatientToDelete(selectedPatient)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Hapus data pasien dari rekam medis"
                      >
                        <Trash2 size={14} className="text-rose-500" />
                        <span>Hapus</span>
                      </button>
                    </>
                  )}

                  {role === "dentist" && (
                    <button
                      onClick={onNavigateToExam}
                      className="bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <PlusCircle size={16} />
                      <span>Pemeriksaan Baru</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Grid Demographics Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Activity size={16} className="text-pink-500 shrink-0" />
                  <span>NIK KTP: <strong className="font-mono text-gray-800">{selectedPatient.nik}</strong></span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Calendar size={16} className="text-pink-500 shrink-0" />
                  <span>Lahir: <strong className="text-gray-800">{selectedPatient.dob}</strong></span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-600">
                  <User size={16} className="text-pink-500 shrink-0" />
                  <span>Gender: <strong className="text-gray-800">{selectedPatient.gender}</strong></span>
                </div>
                <div className="flex items-center gap-2.5 text-gray-600">
                  <Phone size={16} className="text-pink-500 shrink-0" />
                  <span>WhatsApp: <strong className="text-gray-800">{selectedPatient.phone}</strong></span>
                </div>
                <div className="flex items-start gap-2.5 text-gray-600 sm:col-span-2">
                  <MapPin size={16} className="text-pink-500 shrink-0 mt-0.5" />
                  <span>Alamat: <strong className="text-gray-800">{selectedPatient.address}</strong></span>
                </div>
              </div>

              {/* Medical Risk Alerts */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-pink-50/50 rounded-xl border border-pink-100">
                  <span className="text-[10px] text-pink-600 uppercase font-black">Golongan Darah</span>
                  <p className="text-sm font-black text-pink-950 mt-0.5">{selectedPatient.bloodType || "O"}</p>
                </div>
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                  <span className="text-[10px] text-amber-600 uppercase font-black">Riwayat Alergi</span>
                  <p className="text-sm font-black text-amber-950 mt-0.5 truncate" title={selectedPatient.allergies}>
                    {selectedPatient.allergies || "Tidak ada"}
                  </p>
                </div>
              </div>
            </div>

            {/* Real-Time Patient App Engagement & Access Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                    <Radio size={18} className="text-emerald-500 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-gray-900">Status Keaktifan Akses Aplikasi Pasien</h3>
                      {(() => {
                        const status = getPatientAccessStatus(selectedPatient.lastAccessAt);
                        return (
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${status.badgeClass}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`}></span>
                            {status.label}
                          </span>
                        );
                      })()}
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Terakhir kali membuka aplikasi: <strong>{formatRelativeTime(selectedPatient.lastAccessAt)}</strong> ({formatFullIndoDateTime(selectedPatient.lastAccessAt)})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowAccessHistory(!showAccessHistory)}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <History size={13} className="text-pink-600" />
                    <span>{showAccessHistory ? "Tutup Log" : "Riwayat Sesi"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendWaReminder(selectedPatient)}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle size={13} className="text-emerald-600" />
                    <span>Ingatkan via WA</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Access History */}
              {showAccessHistory && (
                <div className="pt-3 border-t border-gray-100 space-y-2 animate-in fade-in duration-200">
                  <p className="text-[11px] font-bold text-gray-700">Daftar Aktivitas Terkini Pasien ({selectedPatient.name}):</p>
                  {(() => {
                    const patLogs = accessLogs.filter(l => l.patientId === selectedPatient.id);
                    if (patLogs.length === 0) {
                      return (
                        <p className="text-xs text-gray-400 italic py-2">Belum ada rekaman sesi untuk pasien ini.</p>
                      );
                    }
                    return (
                      <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                        {patLogs.map((log) => (
                          <div key={log.id} className="p-2.5 bg-gray-50 rounded-lg text-xs flex items-center justify-between gap-2 border border-gray-100">
                            <div className="flex items-center gap-2">
                              {log.device === "mobile" ? <Smartphone size={13} className="text-pink-500" /> : <Monitor size={13} className="text-blue-500" />}
                              <div>
                                <span className="font-semibold text-gray-800">{log.action}</span>
                                <span className="text-[10px] text-gray-400 ml-2">({log.module})</span>
                                {log.details && <p className="text-[10px] text-gray-500">{log.details}</p>}
                              </div>
                            </div>
                            <span className="text-[10px] text-gray-400 shrink-0 font-mono">
                              {formatRelativeTime(log.timestamp)}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* SOAP History Timeline */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <FileText size={18} className="text-pink-600" />
                <span>Riwayat Pemeriksaan Ortodonsia (SOAP)</span>
              </h3>

              {patientExams.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl">
                  <AlertCircle className="mx-auto text-gray-300 mb-2" size={28} />
                  <p className="text-xs text-gray-500">Belum ada riwayat pemeriksaan klinis orto.</p>
                  <button
                    onClick={onNavigateToExam}
                    className="text-xs text-pink-600 font-bold hover:underline mt-1"
                  >
                    Buat pemeriksaan SOAP pertama sekarang
                  </button>
                </div>
              ) : (
                <div className="relative border-l border-pink-100 pl-4 space-y-6">
                  {patientExams
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((exam) => (
                      <div key={exam.id} className="relative space-y-2">
                        {/* Dot marker */}
                        <span className="absolute -left-[21px] top-1.5 w-3.5 h-3.5 rounded-full bg-pink-600 border-2 border-white shadow-sm flex items-center justify-center">
                          <Check size={8} className="text-white" />
                        </span>

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                          <span className="text-xs font-black text-gray-800">{exam.date}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-gray-400">ID: {exam.id} | {exam.dentistName}</span>
                            {role === "dentist" && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleStartEditExam(exam)}
                                  className="p-1 rounded text-gray-400 hover:text-pink-600 hover:bg-pink-50 transition-all cursor-pointer"
                                  title="Ubah Pemeriksaan"
                                >
                                  <Edit size={12} />
                                </button>
                                <button
                                  onClick={() => setExamToDelete(exam)}
                                  className="p-1 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                                  title="Hapus Pemeriksaan"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* RME SOAP Details Panel */}
                        <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 space-y-3 text-xs leading-relaxed">
                          {/* Subjective */}
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 tracking-wider block">S (SUBJEKTIF)</span>
                            <p className="text-gray-700 font-medium">{exam.subjective}</p>
                          </div>

                          {/* Objective */}
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 tracking-wider block">O (OBJEKTIF)</span>
                            <div className="grid grid-cols-2 gap-2 mt-1 bg-white p-2.5 rounded-lg border border-gray-100 text-[11px]">
                              <div><span className="text-gray-400">Kelas Maloklusi:</span> <strong className="text-gray-700">{exam.objective.malocclusionClass}</strong></div>
                              <div><span className="text-gray-400">Overjet / Overbite:</span> <strong className="text-gray-700">{exam.objective.overjet}mm / {exam.objective.overbite}mm</strong></div>
                              <div className="col-span-2">
                                <span className="text-gray-400">Anomali Lengkung:</span>{" "}
                                <strong className="text-gray-700">
                                  {[
                                    exam.objective.crowdingUpper ? "Crowding Rahang Atas" : "",
                                    exam.objective.crowdingLower ? "Crowding Rahang Bawah" : "",
                                    exam.objective.spacingUpper ? "Spacing Rahang Atas" : "",
                                    exam.objective.spacingLower ? "Spacing Rahang Bawah" : "",
                                  ].filter(Boolean).join(", ") || "Tidak ada anomali"}
                                </strong>
                              </div>
                              <div className="col-span-2 border-t border-gray-50 pt-1 mt-1">
                                <span className="text-gray-400">Catatan Odontogram:</span>{" "}
                                <p className="text-[11px] text-gray-600 italic mt-0.5">{exam.objective.odontogramNotes}</p>
                              </div>
                              {exam.objective.pcrScore !== undefined && (
                                <div className="col-span-2 border-t border-gray-100 pt-1.5 mt-1">
                                  <span className="text-gray-400 font-bold">Indeks Plak (PCR):</span>{" "}
                                  <span className="inline-flex items-center gap-1.5">
                                    <strong className="text-gray-800 text-[12px]">{exam.objective.pcrScore}%</strong>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                                      exam.objective.pcrInterpretation === 'Baik' 
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                        : 'bg-rose-50 text-rose-700 border-rose-200'
                                    }`}>
                                      {exam.objective.pcrInterpretation || (exam.objective.pcrScore < 10 ? 'Baik' : 'Buruk')}
                                    </span>
                                    <span className="text-gray-400 text-[10px] font-medium">
                                      ({exam.objective.pcrPlaqueSurfacesCount || 0} / {(exam.objective.pcrTeethCount || 28) * 4} permukaan berplak)
                                    </span>
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                           {/* Assessment */}
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 tracking-wider block">A (ASESMEN)</span>
                            <p className="text-pink-900 font-bold">{exam.assessment}</p>
                          </div>

                          {/* Plan */}
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 tracking-wider block">P (PLAN / TATA LAKSANA)</span>
                            <div className="space-y-1 mt-0.5">
                              <p className="text-gray-700"><strong>Tahap:</strong> <span className="text-pink-700 font-bold">{exam.plan.treatmentStage}</span></p>
                              <p className="text-gray-700"><strong>Prosedur:</strong> {exam.plan.procedure}</p>
                              {exam.plan.prescription && <p className="text-gray-600 bg-pink-50 border border-pink-100 px-2 py-1 rounded inline-block text-[11px]"><strong>Resep/Alat:</strong> {exam.plan.prescription}</p>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <User className="mx-auto text-gray-300 mb-2" size={32} />
            <p className="text-sm text-gray-500">Pilih pasien dari daftar kiri untuk melihat Rekam Medis Elektronik</p>
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {patientToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-gray-900">Hapus Rekam Medis Pasien?</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Apakah Anda yakin ingin menghapus pasien <strong className="text-gray-800 font-bold">{patientToDelete.name}</strong>? 
                  Semua data rekam medis (RME), pemeriksaan SOAP, dan riwayat klinis pasien ini akan terhapus secara permanen dari sistem.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPatientToDelete(null)}
                className="flex-1 py-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeletePatient(patientToDelete.id);
                  setPatientToDelete(null);
                }}
                className="flex-1 py-2 text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete SOAP Confirmation Modal */}
      {examToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 size={18} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-gray-900">Hapus Data Pemeriksaan SOAP?</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Apakah Anda yakin ingin menghapus data pemeriksaan SOAP tanggal <strong className="text-gray-800 font-bold">{examToDelete.date}</strong>? 
                  Tindakan ini akan menghapus riwayat rekam medis klinis ini secara permanen dari sistem.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setExamToDelete(null)}
                className="flex-1 py-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteExam) onDeleteExam(examToDelete.id);
                  setExamToDelete(null);
                }}
                className="flex-1 py-2 text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Edit SOAP Modal */}
      {examToEdit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-2xl w-full p-6 my-8 space-y-6 animate-in fade-in zoom-in-95 duration-150 text-left">
            <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-gray-900">Ubah Pemeriksaan SOAP</h3>
                <p className="text-[11px] text-gray-500">Sesuaikan data rekam medis untuk pemeriksaan ID: {examToEdit.id}</p>
              </div>
              <span className="text-[10px] font-mono bg-pink-50 text-pink-700 px-2.5 py-1 rounded-xl font-bold">RME / SatuSehat</span>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 text-xs">
              
              {/* Row 1: Date & Dentist */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Tanggal Pemeriksaan</label>
                  <input
                    type="date"
                    value={editExamForm.date}
                    onChange={(e) => setEditExamForm({ ...editExamForm, date: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Dokter Pemeriksa</label>
                  <div className="px-3 py-1.5 border border-gray-100 bg-gray-50 text-gray-500 rounded-xl font-medium">
                    {examToEdit.dentistName}
                  </div>
                </div>
              </div>

              {/* S (Subjective) */}
              <div className="space-y-1.5">
                <h4 className="font-black text-pink-800 uppercase border-l-2 border-pink-500 pl-2">S - Pemeriksaan Subjektif</h4>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-600">Keluhan Utama & Riwayat (Anamnesis)</label>
                  <textarea
                    value={editExamForm.subjective}
                    onChange={(e) => setEditExamForm({ ...editExamForm, subjective: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {/* O (Objective) */}
              <div className="space-y-3">
                <h4 className="font-black text-pink-800 uppercase border-l-2 border-pink-500 pl-2">O - Pemeriksaan Objektif</h4>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-600">Kondisi Umum</label>
                    <input
                      type="text"
                      value={editExamForm.generalStatus}
                      onChange={(e) => setEditExamForm({ ...editExamForm, generalStatus: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-600">Ekstra-Oral (Profil)</label>
                    <input
                      type="text"
                      value={editExamForm.extraOral}
                      onChange={(e) => setEditExamForm({ ...editExamForm, extraOral: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-600">Intra-Oral (Hygiene)</label>
                    <input
                      type="text"
                      value={editExamForm.intraOral}
                      onChange={(e) => setEditExamForm({ ...editExamForm, intraOral: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-pink-800 uppercase">Maloklusi Angle</label>
                      <select
                        value={editExamForm.malocclusionClass}
                        onChange={(e) => setEditExamForm({ ...editExamForm, malocclusionClass: e.target.value as any })}
                        className="w-full px-2 py-1.5 border border-gray-200 bg-white rounded-lg text-xs"
                      >
                        <option value="Angle Class I">Angle Class I</option>
                        <option value="Angle Class II Div 1">Angle Class II Div 1</option>
                        <option value="Angle Class II Div 2">Angle Class II Div 2</option>
                        <option value="Angle Class III">Angle Class III</option>
                        <option value="Normal">Normal</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-pink-800 uppercase">Overjet (mm)</label>
                      <input
                        type="number"
                        value={editExamForm.overjet}
                        onChange={(e) => setEditExamForm({ ...editExamForm, overjet: Number(e.target.value) })}
                        className="w-full px-2 py-1 border border-gray-200 bg-white rounded-lg animate-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-pink-800 uppercase">Overbite (mm)</label>
                      <input
                        type="number"
                        value={editExamForm.overbite}
                        onChange={(e) => setEditExamForm({ ...editExamForm, overbite: Number(e.target.value) })}
                        className="w-full px-2 py-1 border border-gray-200 bg-white rounded-lg animate-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editExamForm.crowdingUpper}
                        onChange={(e) => setEditExamForm({ ...editExamForm, crowdingUpper: e.target.checked })}
                        className="rounded text-pink-600 focus:ring-pink-500"
                      />
                      <span className="text-[11px] text-gray-700">Crowding RA (Berjejal Atas)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editExamForm.crowdingLower}
                        onChange={(e) => setEditExamForm({ ...editExamForm, crowdingLower: e.target.checked })}
                        className="rounded text-pink-600 focus:ring-pink-500"
                      />
                      <span className="text-[11px] text-gray-700">Crowding RB (Berjejal Bawah)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editExamForm.spacingUpper}
                        onChange={(e) => setEditExamForm({ ...editExamForm, spacingUpper: e.target.checked })}
                        className="rounded text-pink-600 focus:ring-pink-500"
                      />
                      <span className="text-[11px] text-gray-700">Spacing RA (Diastema Atas)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editExamForm.spacingLower}
                        onChange={(e) => setEditExamForm({ ...editExamForm, spacingLower: e.target.checked })}
                        className="rounded text-pink-600 focus:ring-pink-500"
                      />
                      <span className="text-[11px] text-gray-700">Spacing RB (Diastema Bawah)</span>
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-pink-800 uppercase">Catatan Odontogram & Cephalometry</label>
                    <input
                      type="text"
                      value={editExamForm.odontogramNotes}
                      onChange={(e) => setEditExamForm({ ...editExamForm, odontogramNotes: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* PCR Section in Edit */}
                <div className="bg-pink-50/20 p-4 rounded-xl border border-pink-100/70 space-y-3">
                  <h5 className="font-bold text-pink-900 text-[11px]">Higiene Mulut - Plaque Control Record (PCR)</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-gray-600 font-semibold block">Jumlah Gigi Diperiksa</label>
                      <input
                        type="number"
                        value={editExamForm.pcrTeethCount}
                        onChange={(e) => {
                          const t = Number(e.target.value);
                          const p = editExamForm.pcrPlaqueSurfacesCount;
                          const score = t > 0 ? Number(((p / (t * 4)) * 100).toFixed(1)) : 0;
                          setEditExamForm({
                            ...editExamForm,
                            pcrTeethCount: t,
                            pcrScore: score,
                            pcrInterpretation: score < 10 ? "Baik" : "Buruk"
                          });
                        }}
                        className="w-full px-2 py-1 border border-gray-200 bg-white rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-600 font-semibold block">Jumlah Permukaan Berplak</label>
                      <input
                        type="number"
                        value={editExamForm.pcrPlaqueSurfacesCount}
                        onChange={(e) => {
                          const p = Number(e.target.value);
                          const t = editExamForm.pcrTeethCount;
                          const score = t > 0 ? Number(((p / (t * 4)) * 100).toFixed(1)) : 0;
                          setEditExamForm({
                            ...editExamForm,
                            pcrPlaqueSurfacesCount: p,
                            pcrScore: score,
                            pcrInterpretation: score < 10 ? "Baik" : "Buruk"
                          });
                        }}
                        className="w-full px-2 py-1 border border-gray-200 bg-white rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-pink-100">
                    <span className="text-gray-500 font-medium">Skor PCR Otomatis:</span>
                    <strong className="text-pink-700">{editExamForm.pcrScore}%</strong>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                      editExamForm.pcrInterpretation === 'Baik' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {editExamForm.pcrInterpretation}
                    </span>
                  </div>
                </div>
              </div>

              {/* A (Assessment) */}
              <div className="space-y-1.5">
                <h4 className="font-black text-pink-800 uppercase border-l-2 border-pink-500 pl-2">A - Asesmen / Diagnosa</h4>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-600 block">Diagnosa Klinis Ortodonsia</label>
                  <input
                    type="text"
                    value={editExamForm.assessment}
                    onChange={(e) => setEditExamForm({ ...editExamForm, assessment: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              {/* P (Plan) */}
              <div className="space-y-3">
                <h4 className="font-black text-pink-800 uppercase border-l-2 border-pink-500 pl-2">P - Rencana Tata Laksana</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-600 block">Tahap Perawatan</label>
                    <select
                      value={editExamForm.treatmentStage}
                      onChange={(e) => setEditExamForm({ ...editExamForm, treatmentStage: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 border border-gray-200 bg-white rounded-xl text-xs"
                    >
                      <option value="Inisiasi">Inisiasi</option>
                      <option value="Leveling & Alignment">Leveling & Alignment</option>
                      <option value="Retraksi & Penutupan Ruang">Retraksi & Penutupan Ruang</option>
                      <option value="Finishing & Oklusi">Finishing & Oklusi</option>
                      <option value="Retensi (Retention)">Retensi (Retention)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-600 block">Tanggal Kontrol Berikutnya</label>
                    <input
                      type="date"
                      value={editExamForm.nextVisitDate}
                      onChange={(e) => setEditExamForm({ ...editExamForm, nextVisitDate: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-600 block">Prosedur Aktivasi / Tindakan</label>
                  <textarea
                    value={editExamForm.procedure}
                    onChange={(e) => setEditExamForm({ ...editExamForm, procedure: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-600 block">Resep / Instruksi Alat Ortodonti</label>
                  <input
                    type="text"
                    value={editExamForm.prescription}
                    onChange={(e) => setEditExamForm({ ...editExamForm, prescription: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setExamToEdit(null)}
                className="flex-1 py-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all cursor-pointer text-center"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onEditExam && examToEdit) {
                    onEditExam({
                      id: examToEdit.id,
                      patientId: examToEdit.patientId,
                      dentistName: examToEdit.dentistName,
                      date: editExamForm.date,
                      subjective: editExamForm.subjective,
                      objective: {
                        generalStatus: editExamForm.generalStatus,
                        extraOral: editExamForm.extraOral,
                        intraOral: editExamForm.intraOral,
                        malocclusionClass: editExamForm.malocclusionClass,
                        overjet: editExamForm.overjet,
                        overbite: editExamForm.overbite,
                        crowdingUpper: editExamForm.crowdingUpper,
                        crowdingLower: editExamForm.crowdingLower,
                        spacingUpper: editExamForm.spacingUpper,
                        spacingLower: editExamForm.spacingLower,
                        odontogramNotes: editExamForm.odontogramNotes,
                        pcrScore: editExamForm.pcrScore,
                        pcrTeethCount: editExamForm.pcrTeethCount,
                        pcrPlaqueSurfacesCount: editExamForm.pcrPlaqueSurfacesCount,
                        pcrInterpretation: editExamForm.pcrInterpretation,
                      },
                      assessment: editExamForm.assessment,
                      plan: {
                        treatmentStage: editExamForm.treatmentStage,
                        procedure: editExamForm.procedure,
                        prescription: editExamForm.prescription,
                        nextVisitDate: editExamForm.nextVisitDate,
                      }
                    });
                  }
                  setExamToEdit(null);
                }}
                className="flex-1 py-2 text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white rounded-xl shadow-sm transition-all cursor-pointer text-center"
              >
                Simpan Perubahan SOAP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
