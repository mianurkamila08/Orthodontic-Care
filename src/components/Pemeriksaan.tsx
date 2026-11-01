import React, { useState } from "react";
import { 
  FileText, 
  Smile, 
  Activity, 
  PlusCircle, 
  BrainCircuit, 
  Calendar,
  AlertCircle,
  Stethoscope
} from "lucide-react";
import { Patient, SOAPExam } from "../types";

interface PemeriksaanProps {
  patients: Patient[];
  selectedPatientId: string;
  onAddExam: (exam: SOAPExam) => void;
  onNavigateToRME: () => void;
  activeDentistName?: string;
}

export default function Pemeriksaan({
  patients,
  selectedPatientId,
  onAddExam,
  onNavigateToRME,
  activeDentistName = "drg. Shinta Amalia, Sp.Ort",
}: PemeriksaanProps) {
  const currentPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
  
  // Form States
  const [dentistName, setDentistName] = useState(activeDentistName);

  React.useEffect(() => {
    setDentistName(activeDentistName);
  }, [activeDentistName]);
  const [examDate, setExamDate] = useState(new Date().toISOString().split("T")[0]);
  
  // S State
  const [subjective, setSubjective] = useState("");
  
  // O States
  const [generalStatus, setGeneralStatus] = useState("TD: 120/80 mmHg, Nadi: 80x/mnt. Keadaan umum baik.");
  const [extraOral, setExtraOral] = useState("Wajah simetris, profil lurus (straight profile), TMJ normal.");
  const [intraOral, setIntraOral] = useState("Oral hygiene baik, gingiva sehat.");
  const [malocclusionClass, setMalocclusionClass] = useState<SOAPExam["objective"]["malocclusionClass"]>("Angle Class I");
  const [overjet, setOverjet] = useState(2);
  const [overbite, setOverbite] = useState(2);
  const [crowdingUpper, setCrowdingUpper] = useState(false);
  const [crowdingLower, setCrowdingLower] = useState(false);
  const [spacingUpper, setSpacingUpper] = useState(false);
  const [spacingLower, setSpacingLower] = useState(false);
  const [odontogramNotes, setOdontogramNotes] = useState("");

  // PCR (Plaque Control Record) States - Diisi Manual (Ketik Angka)
  const [pcrTeethCount, setPcrTeethCount] = useState<number | "">(28);
  const [pcrPlaqueSurfacesCount, setPcrPlaqueSurfacesCount] = useState<number | "">(8);

  const numTeeth = pcrTeethCount === "" ? 0 : pcrTeethCount;
  const numPlaque = pcrPlaqueSurfacesCount === "" ? 0 : pcrPlaqueSurfacesCount;

  const computedPcrScore = numTeeth > 0 ? Math.min(100, Number(((numPlaque / (numTeeth * 4)) * 100).toFixed(1))) : 0;
  const computedPcrInterpretation: 'Baik' | 'Buruk' = computedPcrScore < 10 ? "Baik" : "Buruk";

  // A State
  const [assessment, setAssessment] = useState("");

  // P States
  const [treatmentStage, setTreatmentStage] = useState<SOAPExam["plan"]["treatmentStage"]>("Leveling & Alignment");
  const [procedure, setProcedure] = useState("");
  const [prescription, setPrescription] = useState("");
  const [nextVisitDate, setNextVisitDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 28); // 4 weeks from now
    return d.toISOString().split("T")[0];
  });

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Smart Diagnosis Suggestion Generator (Orthodontics expert rule-based)
  const generateDiagnosis = () => {
    let diagnosis = `Maloklusi `;
    if (malocclusionClass === "Angle Class I") {
      diagnosis += "Kelas I Angle";
    } else if (malocclusionClass === "Angle Class II Div 1") {
      diagnosis += "Kelas II Angle Divisi 1 (Disto-oklusi)";
    } else if (malocclusionClass === "Angle Class II Div 2") {
      diagnosis += "Kelas II Angle Divisi 2";
    } else if (malocclusionClass === "Angle Class III") {
      diagnosis += "Kelas III Angle (Mesio-oklusi / Prognatisme)";
    } else {
      diagnosis += "Normal Oklusi";
    }

    const anomalinya: string[] = [];
    if (overjet > 4) anomalinya.push(`overjet berlebih (${overjet}mm)`);
    if (overjet < 1 && overjet >= 0) anomalinya.push("edge-to-edge");
    if (overjet < 0) anomalinya.push(`crossbite anterior / underjet (${overjet}mm)`);
    if (overbite > 4) anomalinya.push(`deep overbite (${overbite}mm)`);
    if (overbite < 0) anomalinya.push("open bite anterior");

    if (crowdingUpper) anomalinya.push("berjejal (crowding) rahang atas");
    if (crowdingLower) anomalinya.push("berjejal (crowding) rahang bawah");
    if (spacingUpper) anomalinya.push("diastema / spacing rahang atas");
    if (spacingLower) anomalinya.push("diastema / spacing rahang bawah");

    if (anomalinya.length > 0) {
      diagnosis += " disertai dengan " + anomalinya.join(", ");
    } else {
      diagnosis += " tanpa anomali dolfat skeletal.";
    }

    setAssessment(diagnosis);
  };

  const handleSubmitExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPatient) {
      setFormError("Silakan pilih pasien terlebih dahulu di rekam medis");
      return;
    }
    if (!subjective.trim()) {
      setFormError("Keluhan subjektif (S) wajib diisi");
      return;
    }
    if (!assessment.trim()) {
      setFormError("Asesmen diagnosa (A) wajib diisi. Anda dapat menekan tombol bantu diagnosa.");
      return;
    }
    if (!procedure.trim()) {
      setFormError("Prosedur tatalaksana (P) wajib diisi");
      return;
    }

    const newExam: SOAPExam = {
      id: `E-${Date.now().toString().slice(-4)}`,
      patientId: currentPatient.id,
      date: examDate,
      dentistName,
      subjective,
      objective: {
        generalStatus,
        extraOral,
        intraOral,
        malocclusionClass,
        overjet: Number(overjet),
        overbite: Number(overbite),
        crowdingUpper,
        crowdingLower,
        spacingUpper,
        spacingLower,
        odontogramNotes,
        pcrScore: computedPcrScore,
        pcrTeethCount: Number(pcrTeethCount) || 0,
        pcrPlaqueSurfacesCount: Number(pcrPlaqueSurfacesCount) || 0,
        pcrInterpretation: computedPcrInterpretation,
      },
      assessment,
      plan: {
        treatmentStage,
        procedure,
        prescription,
        nextVisitDate,
      },
    };

    onAddExam(newExam);
    setSuccessMessage("Rekam Medis SOAP Elektronik berhasil disimpan dan disinkronisasikan ke SatuSehat!");
    setFormError("");
    
    // Clear major inputs
    setSubjective("");
    setOdontogramNotes("");
    setProcedure("");
    setPrescription("");
    setAssessment("");
    setPcrTeethCount(28);
    setPcrPlaqueSurfacesCount(8);

    // Jump to profile
    setTimeout(() => {
      setSuccessMessage("");
      onNavigateToRME();
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6" id="pemeriksaan-root">
      <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Stethoscope className="text-pink-600" size={20} />
            Input Pemeriksaan Orto (RME SOAP)
          </h2>
          <p className="text-xs text-gray-500">
            Pemeriksaan klinis untuk pasien: <strong className="text-gray-800">{currentPatient?.name || "Belum dipilih"}</strong> (ID: {currentPatient?.id || "-"})
          </p>
        </div>
        <div className="text-xs text-gray-400 font-mono">Standar PMK 24/2022</div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
          {successMessage}
        </div>
      )}

      {formError && (
        <div className="p-4 bg-rose-50 border border-rose-150 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} className="text-rose-500" />
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmitExam} className="space-y-6">
        {/* Row metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Dokter Gigi Spesialis</label>
            <input
              type="text"
              value={dentistName}
              onChange={(e) => setDentistName(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-200 bg-white rounded-xl text-xs focus:outline-none focus:border-pink-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">Tanggal Pemeriksaan</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-200 bg-white rounded-xl text-xs focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700">NIK Pasien RME</label>
            <div className="px-3 py-1.5 border border-gray-200 bg-gray-100 rounded-xl text-xs font-mono font-bold text-gray-500">
              {currentPatient?.nik || "PILIH PASIEN DULU"}
            </div>
          </div>
        </div>

        {/* 1. Subjective */}
        <div className="space-y-2">
          <h3 className="text-xs font-black text-pink-800 tracking-wider uppercase border-l-2 border-pink-500 pl-2">
            S - Pemeriksaan Subjektif
          </h3>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-600 block">Keluhan Utama & Riwayat Pasien (Anamnesis)</label>
            <textarea
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
              placeholder="Contoh: Pasien mengeluhkan gigi depan atas berjejal, ingin memakai behel untuk estetika dan merapikan giginya..."
            />
          </div>
        </div>

        {/* 2. Objective */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-pink-800 tracking-wider uppercase border-l-2 border-pink-500 pl-2">
            O - Pemeriksaan Objektif
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 block">Kondisi Umum (Vital Signs)</label>
              <input
                type="text"
                value={generalStatus}
                onChange={(e) => setGeneralStatus(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 block">Ekstra-Oral (Profil & TMJ)</label>
              <input
                type="text"
                value={extraOral}
                onChange={(e) => setExtraOral(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 block">Intra-Oral (Hygiene & Gusi)</label>
              <input
                type="text"
                value={intraOral}
                onChange={(e) => setIntraOral(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Orthodontic metrics */}
          <div className="bg-pink-50/50 p-4 rounded-xl border border-pink-100 space-y-4">
            <h4 className="text-xs font-bold text-pink-900">Indikator Ortodonsia Spesifik</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Malocclusion Classification */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-pink-800 uppercase block">Klasifikasi Maloklusi Angle</label>
                <select
                  value={malocclusionClass}
                  onChange={(e) => setMalocclusionClass(e.target.value as any)}
                  className="w-full px-2 py-1.5 border border-gray-200 bg-white rounded-lg text-xs"
                >
                  <option value="Angle Class I">Angle Class I (Netroklusi)</option>
                  <option value="Angle Class II Div 1">Angle Class II Div 1 (Disto-oklusi)</option>
                  <option value="Angle Class II Div 2">Angle Class II Div 2</option>
                  <option value="Angle Class III">Angle Class III (Mesio-oklusi)</option>
                  <option value="Normal">Normal Oklusi</option>
                </select>
              </div>

              {/* Overjet */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-pink-800 uppercase block">Overjet (mm)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={overjet}
                    onChange={(e) => setOverjet(Number(e.target.value))}
                    className="w-20 px-2 py-1 border border-gray-200 bg-white rounded-lg text-xs"
                  />
                  <span className="text-xs text-gray-500">mm (Normal: 2-4mm)</span>
                </div>
              </div>

              {/* Overbite */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-pink-800 uppercase block">Overbite (mm)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={overbite}
                    onChange={(e) => setOverbite(Number(e.target.value))}
                    className="w-20 px-2 py-1 border border-gray-200 bg-white rounded-lg text-xs"
                  />
                  <span className="text-xs text-gray-500">mm (Normal: 2-4mm)</span>
                </div>
              </div>
            </div>

            {/* Checkboxes crowding spacing */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={crowdingUpper}
                  onChange={(e) => setCrowdingUpper(e.target.checked)}
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <span>Crowding RA (Berjejal Atas)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={crowdingLower}
                  onChange={(e) => setCrowdingLower(e.target.checked)}
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <span>Crowding RB (Berjejal Bawah)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={spacingUpper}
                  onChange={(e) => setSpacingUpper(e.target.checked)}
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <span>Spacing RA (Diastema Atas)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={spacingLower}
                  onChange={(e) => setSpacingLower(e.target.checked)}
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <span>Spacing RB (Diastema Bawah)</span>
              </label>
            </div>

            {/* Odontogram description */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-pink-800 uppercase block">Catatan Odontogram & Cephalometry</label>
              <input
                type="text"
                value={odontogramNotes}
                onChange={(e) => setOdontogramNotes(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-xs"
                placeholder="Misal: Gigi 14 dan 24 dicabut untuk ruang penutupan. Relasi molar Klas II..."
              />
            </div>
          </div>

          {/* Plaque Control Record (PCR) Card */}
          <div className="bg-pink-50/30 p-5 rounded-xl border border-pink-100/80 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-pink-100/50 pb-2">
              <div>
                <h4 className="text-xs font-black text-pink-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={15} className="text-pink-600" />
                  Pemeriksaan Plaque Control Record (PCR)
                </h4>
                <p className="text-[10px] text-gray-500 font-medium">
                  Mengukur persentase permukaan gigi yang tertutup plak bakteri (Indeks O'Leary).
                </p>
              </div>
              <span className="text-[9px] font-bold bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Indeks Higiene Mulut
              </span>
            </div>

            {/* Formula Visualizer */}
            <div className="flex flex-col md:flex-row justify-between gap-4 bg-white/80 p-3 rounded-xl border border-pink-100/30">
              <div className="space-y-1.5 flex-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Formula Indeks PCR</span>
                <div className="flex items-center gap-2 text-[11px] font-mono select-none text-gray-700">
                  <div className="font-bold text-pink-700">SKOR = </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="border-b border-gray-300 pb-0.5 px-2">Jumlah permukaan yang ada plaknya</span>
                    <span className="pt-0.5 px-2">Jumlah permukaan yang diperiksa</span>
                  </div>
                  <div className="font-bold text-pink-700">x 100%</div>
                </div>
              </div>

              {/* Reference Table */}
              <div className="w-full md:w-56 space-y-1 border-t md:border-t-0 md:border-l border-pink-100/50 pt-2 md:pt-0 md:pl-4 text-[10px]">
                <span className="font-bold text-pink-800 block mb-1">Interpretasi Skor PCR</span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 bg-pink-50/50 p-2 rounded-lg border border-pink-100/30">
                  <span className="font-semibold text-gray-500">Persentase PCR</span>
                  <span className="font-semibold text-gray-500">Interpretasi</span>
                  <span className="text-emerald-700 font-bold">&lt; 10%</span>
                  <span className="text-emerald-800 font-bold bg-emerald-50 px-1 py-0.2 rounded text-center">Baik</span>
                  <span className="text-rose-700 font-bold">&ge; 10%</span>
                  <span className="text-rose-800 font-bold bg-rose-50 px-1 py-0.2 rounded text-center">Buruk</span>
                </div>
              </div>
            </div>

            {/* Live Interactive Inputs & Calculator */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {/* Teeth checked count */}
              <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-pink-100/40">
                <label className="text-[10px] font-black text-pink-900 uppercase block">Jumlah Gigi Diperiksa (Isi Manual)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={32}
                    value={pcrTeethCount}
                    placeholder="28"
                    onChange={(e) => {
                      const val = e.target.value === "" ? "" : Number(e.target.value);
                      setPcrTeethCount(val);
                    }}
                    className="w-full px-3 py-1.5 border border-pink-100 bg-pink-50/10 focus:bg-white rounded-xl text-xs font-bold text-pink-950 focus:outline-none focus:ring-1 focus:ring-pink-400"
                  />
                  <span className="text-[10px] text-gray-400 font-medium shrink-0">gigi</span>
                </div>
                <p className="text-[9px] text-gray-400">Silakan ketik angka manual (Standar: 28 gigi)</p>
              </div>

              {/* Plaque surfaces count */}
              <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-pink-100/40">
                <label className="text-[10px] font-black text-pink-900 uppercase block">Permukaan Ada Plak (Isi Manual)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={pcrPlaqueSurfacesCount}
                    placeholder="8"
                    onChange={(e) => {
                      const val = e.target.value === "" ? "" : Number(e.target.value);
                      setPcrPlaqueSurfacesCount(val);
                    }}
                    className="w-full px-3 py-1.5 border border-pink-100 bg-pink-50/10 focus:bg-white rounded-xl text-xs font-bold text-pink-950 focus:outline-none focus:ring-1 focus:ring-pink-400"
                  />
                  <span className="text-[10px] text-gray-400 font-medium shrink-0">permukaan</span>
                </div>
                <div className="flex justify-between text-[9px] text-gray-400">
                  <span>Ketik manual angka permukaan berplak</span>
                </div>
              </div>

              {/* Live Calculator Result Card */}
              <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-3.5 rounded-xl text-white shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-black uppercase tracking-wider text-pink-100">Hasil Indeks PCR (Otomatis)</span>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    computedPcrInterpretation === 'Baik' 
                      ? 'bg-emerald-500 text-white shadow-sm' 
                      : 'bg-yellow-400 text-gray-900 shadow-sm animate-pulse'
                  }`}>
                    {computedPcrInterpretation === 'Baik' ? 'Higiene Baik' : 'Higiene Buruk'}
                  </span>
                </div>

                <div className="my-1.5">
                  <p className="text-xs text-pink-100 font-semibold">Skor PCR Pasien (Dihitung Otomatis):</p>
                  <p className="text-2xl font-black tracking-tight">{computedPcrScore}%</p>
                  <span className="text-[9px] text-pink-100 font-medium italic block mt-0.5">✓ Hasil kalkulasi otomatis sistem</span>
                </div>

                <p className="text-[9px] text-pink-50/80 leading-tight">
                  {pcrPlaqueSurfacesCount} dari {pcrTeethCount * 4} permukaan gigi terdeteksi plak bakteri.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Assessment with smart helper */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-pink-800 tracking-wider uppercase border-l-2 border-pink-500 pl-2">
              A - Asesmen / Diagnosa Ortodonti
            </h3>
            <button
              type="button"
              onClick={generateDiagnosis}
              className="px-2.5 py-1 bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all"
            >
              <BrainCircuit size={14} />
              <span>Draf Diagnosa Otomatis</span>
            </button>
          </div>
          <div className="space-y-1">
            <textarea
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500 font-medium"
              placeholder="Gunakan draf otomatis di atas atau ketik manual diagnosa ortodonti medis..."
            />
          </div>
        </div>

        {/* 4. Plan */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-pink-800 tracking-wider uppercase border-l-2 border-pink-500 pl-2">
            P - Penatalaksanaan & Tindakan (Plan)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 block">Tahap Perawatan Ortodonti Saat Ini</label>
              <select
                value={treatmentStage}
                onChange={(e) => setTreatmentStage(e.target.value as any)}
                className="w-full px-3 py-1.5 border border-gray-200 bg-white rounded-xl text-xs"
              >
                <option value="Inisiasi">Tahap 1: Inisiasi (Pemasangan behel awal)</option>
                <option value="Leveling & Alignment">Tahap 2: Leveling & Alignment (Perataan gigi)</option>
                <option value="Retraksi & Penutupan Ruang">Tahap 3: Retraksi & Penutupan Ruang (Ditarik mundur)</option>
                <option value="Finishing & Oklusi">Tahap 4: Finishing & Oklusi (Finishing detail)</option>
                <option value="Retensi (Retention)">Tahap 5: Retensi (Retention - Pemeliharaan dengan retainer)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 block">Tanggal Kunjungan / Kontrol Rutin Berikutnya</label>
              <input
                type="date"
                value={nextVisitDate}
                onChange={(e) => setNextVisitDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 block">Prosedur / Tindakan yang Dilakukan Hari Ini</label>
              <textarea
                value={procedure}
                onChange={(e) => setProcedure(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                placeholder="Misal: Ganti wire stainless steel 0.016, aktivasi power chain upper dari gigi 13 ke 23, pasang elastics Class II..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 block">Resep / Alat Ortodontik yang Diberikan ke Pasien</label>
              <textarea
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500"
                placeholder="Misal: Orthodontic wax (1 strip), Parasetamol 500mg (jika ngilu), obat kumur antiseptik..."
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="border-t border-gray-100 pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onNavigateToRME}
            className="px-6 py-2 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
          >
            Kembali ke Rekam Medis
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white rounded-xl shadow-sm transition-all"
          >
            Simpan & Sinkronisasi RME (SatuSehat)
          </button>
        </div>
      </form>
    </div>
  );
}
