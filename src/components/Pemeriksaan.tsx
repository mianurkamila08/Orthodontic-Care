import React, { useState } from "react";
import { 
  FileText, 
  Smile, 
  Activity, 
  PlusCircle, 
  BrainCircuit, 
  Calendar,
  AlertCircle,
  Stethoscope,
  Sliders,
  Check,
  Trash2,
  Send,
  History,
  Edit,
  X
} from "lucide-react";
import { Patient, SOAPExam } from "../types";
import {
  ARCHWIRE_MATERIALS,
  ARCHWIRE_SIZES,
  ARCHWIRE_QUICK_PRESETS,
  ArchwireChangeState,
  formatArchwireSummary,
} from "../utils/orthoWireConstants";
import {
  buildPcrVisitExam,
  calculatePcrMetrics,
  formatIndoShortDate,
  generateUniqueExamId,
  resolveValidExamPcr,
} from "../utils/pcrUtils";

interface PcrVisitDraft {
  tempId: string;
  date: string;
  teethCount: number | "";
  plaqueSurfacesCount: number | "";
  notes: string;
}

interface EditingPcrVisitState {
  visitId: string;
  date: string;
  teethCount: number | "";
  plaqueSurfacesCount: number | "";
  notes: string;
}

interface PemeriksaanProps {
  patients: Patient[];
  exams?: SOAPExam[];
  selectedPatientId: string;
  onSelectPatient?: (id: string) => void;
  onAddExam: (exam: SOAPExam) => void;
  onEditExam?: (exam: SOAPExam) => void;
  onDeleteExam?: (examId: string) => void;
  onNavigateToRME: () => void;
  activeDentistName?: string;
}

export default function Pemeriksaan({
  patients,
  exams = [],
  selectedPatientId,
  onSelectPatient,
  onAddExam,
  onEditExam,
  onDeleteExam,
  onNavigateToRME,
  activeDentistName = "Mia Nurkamila, A.Md.Kes",
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

  const livePcrMetrics = calculatePcrMetrics(pcrTeethCount, pcrPlaqueSurfacesCount);
  const computedPcrScore = livePcrMetrics.pcrScore;
  const computedPcrInterpretation = livePcrMetrics.pcrInterpretation;

  // Tambah, Edit, & Hapus Kunjungan PCR (Draft Kunjungan Tambahan & Riwayat Terpublish)
  const [pcrVisitDrafts, setPcrVisitDrafts] = useState<PcrVisitDraft[]>([]);
  const [editingPcrVisit, setEditingPcrVisit] = useState<EditingPcrVisitState | null>(null);
  const [confirmDeleteVisitId, setConfirmDeleteVisitId] = useState<string | null>(null);
  const [pcrPublishFeedback, setPcrPublishFeedback] = useState("");
  const [pcrVisitError, setPcrVisitError] = useState("");

  const patientPcrVisits = React.useMemo(() => {
    if (!currentPatient) return [];
    return exams
      .filter(
        (e) =>
          e.patientId === currentPatient.id &&
          typeof e.objective.pcrScore === "number" &&
          !Number.isNaN(e.objective.pcrScore)
      )
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [exams, currentPatient]);

  const latestPatientExam = React.useMemo(() => {
    if (!currentPatient) return undefined;
    const patExams = exams
      .filter((e) => e.patientId === currentPatient.id)
      .sort((a, b) => b.date.localeCompare(a.date));
    return patExams[0];
  }, [exams, currentPatient]);

  const handleAddPcrVisitDraft = () => {
    setPcrVisitError("");
    setPcrPublishFeedback("");
    setEditingPcrVisit(null);
    setConfirmDeleteVisitId(null);
    setPcrVisitDrafts((prev) => [
      ...prev,
      {
        tempId: `draft-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        date: examDate || new Date().toISOString().split("T")[0],
        teethCount: pcrTeethCount === "" ? 28 : pcrTeethCount,
        plaqueSurfacesCount: 0,
        notes: "",
      },
    ]);
  };

  const handleUpdatePcrVisitDraft = (
    tempId: string,
    patch: Partial<Omit<PcrVisitDraft, "tempId">>
  ) => {
    setPcrVisitDrafts((prev) =>
      prev.map((item) => (item.tempId === tempId ? { ...item, ...patch } : item))
    );
  };

  const handleRemovePcrVisitDraft = (tempId: string) => {
    setPcrVisitDrafts((prev) => prev.filter((item) => item.tempId !== tempId));
  };

  const handlePublishPcrVisits = () => {
    setPcrVisitError("");
    setPcrPublishFeedback("");

    if (!currentPatient) {
      setPcrVisitError("Silakan pilih pasien terlebih dahulu.");
      return;
    }
    if (pcrVisitDrafts.length === 0) {
      setPcrVisitError("Tambahkan minimal 1 kunjungan PCR sebelum mempublish.");
      return;
    }

    for (let i = 0; i < pcrVisitDrafts.length; i++) {
      const d = pcrVisitDrafts[i];
      if (!d.date) {
        setPcrVisitError(`Tanggal kunjungan baru ke-${i + 1} wajib diisi.`);
        return;
      }
      const validation = calculatePcrMetrics(d.teethCount, d.plaqueSurfacesCount);
      if (!validation.isValid) {
        setPcrVisitError(
          `Kunjungan baru ke-${i + 1}: ${validation.validationError || "Data PCR tidak valid."}`
        );
        return;
      }
    }

    const baseVisitNumber = patientPcrVisits.length;
    const publishedSummaries: string[] = [];

    pcrVisitDrafts.forEach((draft, idx) => {
      const visitNumber = baseVisitNumber + idx + 1;
      const newExam = buildPcrVisitExam({
        patientId: currentPatient.id,
        date: draft.date,
        dentistName,
        teethCount: draft.teethCount,
        plaqueSurfacesCount: draft.plaqueSurfacesCount,
        visitNumber,
        notes: draft.notes,
        latestPatientExam,
      });
      onAddExam(newExam);
      publishedSummaries.push(
        `Kunjungan ke-${visitNumber} (${formatIndoShortDate(draft.date)}): Skor ${newExam.objective.pcrScore}% (${newExam.objective.pcrInterpretation})`
      );
    });

    const latestDraft = pcrVisitDrafts[pcrVisitDrafts.length - 1];
    const latestMetrics = calculatePcrMetrics(
      latestDraft.teethCount,
      latestDraft.plaqueSurfacesCount
    );
    setPcrTeethCount(latestMetrics.pcrTeethCount);
    setPcrPlaqueSurfacesCount(latestMetrics.pcrPlaqueSurfacesCount);

    setPcrVisitDrafts([]);
    setPcrPublishFeedback(
      `${publishedSummaries.length} kunjungan PCR berhasil dipublish untuk ${currentPatient.name}. Skor otomatis terhitung: ${publishedSummaries.join(" | ")}`
    );
  };

  const handleStartEditPcrVisit = (visit: SOAPExam) => {
    setPcrVisitError("");
    setPcrPublishFeedback("");
    setConfirmDeleteVisitId(null);
    const resolved = resolveValidExamPcr(visit);
    setEditingPcrVisit({
      visitId: visit.id,
      date: visit.date,
      teethCount: resolved.pcrTeethCount,
      plaqueSurfacesCount: resolved.pcrPlaqueSurfacesCount,
      notes: visit.objective.odontogramNotes || "",
    });
  };

  const handleSaveEditPcrVisit = (originalVisit: SOAPExam, visitNumber: number) => {
    if (!editingPcrVisit || !onEditExam) return;
    setPcrVisitError("");
    setPcrPublishFeedback("");

    if (!editingPcrVisit.date) {
      setPcrVisitError("Tanggal kunjungan pada form edit wajib diisi.");
      return;
    }

    const metrics = calculatePcrMetrics(
      editingPcrVisit.teethCount,
      editingPcrVisit.plaqueSurfacesCount
    );
    if (!metrics.isValid) {
      setPcrVisitError(metrics.validationError || "Data kunjungan kontrol plak tidak valid.");
      return;
    }

    const cleanNotes = editingPcrVisit.notes.trim();
    const isStandalonePcrAssessment = originalVisit.assessment.startsWith(
      "Evaluasi Plaque Control Record (PCR):"
    );

    const updatedExam: SOAPExam = {
      ...originalVisit,
      date: editingPcrVisit.date,
      objective: {
        ...originalVisit.objective,
        odontogramNotes: cleanNotes || originalVisit.objective.odontogramNotes,
        intraOral:
          metrics.pcrInterpretation === "Baik"
            ? `Oral hygiene baik (Skor PCR ${metrics.pcrScore}% — ${metrics.pcrPlaqueSurfacesCount}/${metrics.totalSurfaces} permukaan berplak).`
            : `Oral hygiene perlu ditingkatkan (Skor PCR ${metrics.pcrScore}% — ${metrics.pcrPlaqueSurfacesCount}/${metrics.totalSurfaces} permukaan berplak).`,
        pcrScore: metrics.pcrScore,
        pcrTeethCount: metrics.pcrTeethCount,
        pcrPlaqueSurfacesCount: metrics.pcrPlaqueSurfacesCount,
        pcrInterpretation: metrics.pcrInterpretation,
      },
      assessment: isStandalonePcrAssessment
        ? `Evaluasi Plaque Control Record (PCR): Skor ${metrics.pcrScore}% (Higiene ${metrics.pcrInterpretation}).`
        : originalVisit.assessment,
      subjective:
        cleanNotes && originalVisit.subjective.includes("Plaque Control Record (PCR)")
          ? `Kunjungan ke-${visitNumber} Plaque Control Record (PCR): ${cleanNotes}`
          : originalVisit.subjective,
    };

    onEditExam(updatedExam);
    setEditingPcrVisit(null);
    setPcrPublishFeedback(
      `Data Kunjungan ke-${visitNumber} (${formatIndoShortDate(updatedExam.date)}) berhasil diperbarui. Skor PCR terhitung valid: ${metrics.pcrScore}% (${metrics.pcrInterpretation}).`
    );
  };

  const handleConfirmDeletePcrVisit = (visit: SOAPExam, visitNumber: number) => {
    if (!onDeleteExam) return;
    onDeleteExam(visit.id);
    if (editingPcrVisit?.visitId === visit.id) {
      setEditingPcrVisit(null);
    }
    setConfirmDeleteVisitId(null);
    setPcrVisitError("");
    setPcrPublishFeedback(
      `Data Kunjungan ke-${visitNumber} (${formatIndoShortDate(visit.date)}) berhasil dihapus dari Rekam Medis & Dashboard.`
    );
  };

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

  // Archwire Change Quick Parameter States
  const [archwireChange, setArchwireChange] = useState<ArchwireChangeState>({
    enabled: false,
    upperArch: true,
    lowerArch: true,
    material: ARCHWIRE_MATERIALS[0],
    upperSize: '0.014"',
    lowerSize: '0.014"',
  });

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleApplyArchwireToProcedure = () => {
    const activeWire: ArchwireChangeState = { ...archwireChange, enabled: true };
    if (!archwireChange.enabled) {
      setArchwireChange(activeWire);
    }
    const summary = formatArchwireSummary(activeWire);
    if (!summary) return;
    setProcedure((prev) => {
      const cleaned = prev.trim();
      if (!cleaned) return summary;
      if (cleaned.includes(summary)) return cleaned;
      return `${summary}. ${cleaned}`;
    });
  };

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

    const wireSummary = archwireChange.enabled ? formatArchwireSummary(archwireChange) : "";
    const finalProcedure = procedure.trim()
      ? procedure.trim()
      : wireSummary;

    if (!finalProcedure) {
      setFormError("Prosedur tatalaksana (P) wajib diisi atau aktifkan parameter Archwire Change");
      return;
    }

    // Validasi & hitung ulang skor PCR pasien secara ketat tepat saat dipublish
    const publishedPcrMetrics = calculatePcrMetrics(pcrTeethCount, pcrPlaqueSurfacesCount);
    if (!publishedPcrMetrics.isValid) {
      setFormError(`Data Plaque Control Record (PCR) tidak valid: ${publishedPcrMetrics.validationError}`);
      return;
    }

    const newExam: SOAPExam = {
      id: generateUniqueExamId(),
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
        pcrScore: publishedPcrMetrics.pcrScore,
        pcrTeethCount: publishedPcrMetrics.pcrTeethCount,
        pcrPlaqueSurfacesCount: publishedPcrMetrics.pcrPlaqueSurfacesCount,
        pcrInterpretation: publishedPcrMetrics.pcrInterpretation,
      },
      assessment,
      plan: {
        treatmentStage,
        procedure: finalProcedure,
        prescription,
        nextVisitDate,
        ...(archwireChange.enabled
          ? {
              archwireChange: {
                enabled: true,
                upperArch: archwireChange.upperArch,
                lowerArch: archwireChange.lowerArch,
                material: archwireChange.material,
                upperSize: archwireChange.upperArch ? archwireChange.upperSize : undefined,
                lowerSize: archwireChange.lowerArch ? archwireChange.lowerSize : undefined,
              },
            }
          : {}),
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
    setArchwireChange({
      enabled: false,
      upperArch: true,
      lowerArch: true,
      material: ARCHWIRE_MATERIALS[0],
      upperSize: '0.014"',
      lowerSize: '0.014"',
    });

    // Jump to profile
    setTimeout(() => {
      setSuccessMessage("");
      onNavigateToRME();
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6" id="pemeriksaan-root">
      <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Stethoscope className="text-pink-600" size={20} />
            Input Pemeriksaan Orto (RME SOAP)
          </h2>
          <p className="text-xs text-gray-500">
            Pemeriksaan klinis untuk pasien: <strong className="text-gray-800">{currentPatient?.name || "Belum dipilih"}</strong> (ID: {currentPatient?.id || "-"})
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onSelectPatient && patients.length > 0 && (
            <select
              value={currentPatient?.id || ""}
              onChange={(e) => onSelectPatient(e.target.value)}
              className="text-xs font-bold border border-pink-200 bg-pink-50/50 text-pink-950 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-400 cursor-pointer"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          )}
          <div className="text-xs text-gray-400 font-mono">Standar PMK 24/2022</div>
        </div>
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
                    max={livePcrMetrics.totalSurfaces > 0 ? livePcrMetrics.totalSurfaces : 128}
                    value={pcrPlaqueSurfacesCount}
                    placeholder="8"
                    onChange={(e) => {
                      const val = e.target.value === "" ? "" : Number(e.target.value);
                      setPcrPlaqueSurfacesCount(val);
                    }}
                    className={`w-full px-3 py-1.5 border rounded-xl text-xs font-bold focus:outline-none focus:ring-1 ${
                      !livePcrMetrics.isValid
                        ? "border-rose-300 bg-rose-50/40 text-rose-900 focus:ring-rose-400"
                        : "border-pink-100 bg-pink-50/10 focus:bg-white text-pink-950 focus:ring-pink-400"
                    }`}
                  />
                  <span className="text-[10px] text-gray-400 font-medium shrink-0">permukaan</span>
                </div>
                <div className="flex justify-between text-[9px] text-gray-400">
                  <span>
                    Maksimal {livePcrMetrics.totalSurfaces > 0 ? `${livePcrMetrics.totalSurfaces} permukaan (${livePcrMetrics.pcrTeethCount} gigi × 4)` : "sesuai jumlah gigi × 4"}
                  </span>
                </div>
              </div>

              {/* Live Calculator Result Card */}
              <div className={`p-3.5 rounded-xl text-white shadow-sm flex flex-col justify-between ${
                !livePcrMetrics.isValid
                  ? "bg-gradient-to-br from-rose-600 to-rose-700"
                  : "bg-gradient-to-br from-pink-500 to-rose-500"
              }`}>
                <div className="flex justify-between items-start gap-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-pink-100">Hasil Indeks PCR (Otomatis)</span>
                  {livePcrMetrics.isValid ? (
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      computedPcrInterpretation === 'Baik' 
                        ? 'bg-emerald-500 text-white shadow-sm' 
                        : 'bg-yellow-400 text-gray-900 shadow-sm animate-pulse'
                    }`}>
                      {computedPcrInterpretation === 'Baik' ? 'Higiene Baik' : 'Higiene Buruk'}
                    </span>
                  ) : (
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-white text-rose-700 shadow-sm">
                      Tidak Valid
                    </span>
                  )}
                </div>

                {livePcrMetrics.isValid ? (
                  <>
                    <div className="my-1.5">
                      <p className="text-xs text-pink-100 font-semibold">Skor PCR Pasien (Dihitung Otomatis):</p>
                      <p className="text-2xl font-black tracking-tight">{computedPcrScore}%</p>
                      <span className="text-[9px] text-pink-100 font-mono block mt-0.5">
                        ({livePcrMetrics.pcrPlaqueSurfacesCount} ÷ ({livePcrMetrics.pcrTeethCount} × 4 = {livePcrMetrics.totalSurfaces})) × 100% = {computedPcrScore}%
                      </span>
                    </div>

                    <p className="text-[9px] text-pink-50/90 leading-tight">
                      {livePcrMetrics.pcrPlaqueSurfacesCount} dari {livePcrMetrics.totalSurfaces} permukaan gigi terdeteksi plak bakteri.
                    </p>
                  </>
                ) : (
                  <div className="my-1.5 space-y-1">
                    <p className="text-sm font-black tracking-tight">Perhitungan Tidak Valid</p>
                    <p className="text-[10px] text-rose-100 leading-snug">
                      {livePcrMetrics.validationError}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {!livePcrMetrics.isValid && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-800 font-semibold flex items-center gap-2">
                <AlertCircle size={14} className="text-rose-500 shrink-0" />
                <span>{livePcrMetrics.validationError}</span>
              </div>
            )}

            {/* Kunjungan Plaque Control Record (PCR): Tambah Kunjungan & Auto-Skor Saat Terpublish */}
            <div className="bg-white p-4 rounded-xl border border-pink-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-50 pb-2.5">
                <div>
                  <h5 className="text-[11px] font-black text-pink-900 uppercase tracking-wider flex items-center gap-1.5">
                    <History size={14} className="text-pink-600" />
                    Kunjungan Plaque Control ({patientPcrVisits.length} Tercatat)
                  </h5>
                  <p className="text-[10px] text-gray-500">
                    Tambahkan kunjungan kontrol plak berkala. Skor PCR pasien otomatis dihitung dan dipublikasikan ke Dashboard &amp; RME saat terpublish.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddPcrVisitDraft}
                  className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-[11px] font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <PlusCircle size={13} />
                  <span>Tambah Kunjungan</span>
                </button>
              </div>

              {pcrPublishFeedback && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 font-semibold flex items-start gap-2">
                  <Check size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{pcrPublishFeedback}</span>
                </div>
              )}

              {pcrVisitError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-800 font-semibold flex items-center gap-2">
                  <AlertCircle size={14} className="text-rose-500 shrink-0" />
                  <span>{pcrVisitError}</span>
                </div>
              )}

              {/* Daftar Draft Kunjungan Baru yang Akan Dipublish */}
              {pcrVisitDrafts.length > 0 && (
                <div className="space-y-2.5 bg-pink-50/40 p-3 rounded-xl border border-pink-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-pink-800 uppercase tracking-wider">
                      Daftar Tambah Kunjungan Baru ({pcrVisitDrafts.length})
                    </span>
                    <span className="text-[10px] text-pink-600 font-medium">
                      Skor otomatis dihitung saat tombol Publish ditekan
                    </span>
                  </div>

                  {pcrVisitDrafts.map((draft, idx) => {
                    const previewMetrics = calculatePcrMetrics(
                      draft.teethCount,
                      draft.plaqueSurfacesCount
                    );
                    const visitNumber = patientPcrVisits.length + idx + 1;
                    return (
                      <div
                        key={draft.tempId}
                        className="bg-white p-3 rounded-xl border border-pink-100 shadow-2xs space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-pink-900 bg-pink-50 px-2.5 py-0.5 rounded-lg border border-pink-100">
                            Kunjungan ke-{visitNumber}
                          </span>
                          <div className="flex items-center gap-2">
                            {previewMetrics.isValid ? (
                              <span
                                className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                                  previewMetrics.pcrInterpretation === "Baik"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-rose-50 text-rose-700 border-rose-200"
                                }`}
                              >
                                Hitung Valid: {previewMetrics.pcrPlaqueSurfacesCount}/{previewMetrics.totalSurfaces} = {previewMetrics.pcrScore}% ({previewMetrics.pcrInterpretation})
                              </span>
                            ) : (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full border bg-rose-50 text-rose-700 border-rose-200">
                                Input Tidak Valid
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemovePcrVisitDraft(draft.tempId)}
                              className="p-1 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                              title="Hapus baris kunjungan"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-gray-600 block">
                              Tanggal Kunjungan
                            </label>
                            <input
                              type="date"
                              value={draft.date}
                              onChange={(e) =>
                                handleUpdatePcrVisitDraft(draft.tempId, { date: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-pink-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-gray-600 block">
                              Gigi Diperiksa (1–32)
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={32}
                              value={draft.teethCount}
                              onChange={(e) =>
                                handleUpdatePcrVisitDraft(draft.tempId, {
                                  teethCount: e.target.value === "" ? "" : Number(e.target.value),
                                })
                              }
                              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:border-pink-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-gray-600 block">
                              Permukaan Berplak (Maks {previewMetrics.totalSurfaces || 128})
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={previewMetrics.totalSurfaces > 0 ? previewMetrics.totalSurfaces : 128}
                              value={draft.plaqueSurfacesCount}
                              onChange={(e) =>
                                handleUpdatePcrVisitDraft(draft.tempId, {
                                  plaqueSurfacesCount:
                                    e.target.value === "" ? "" : Number(e.target.value),
                                })
                              }
                              className={`w-full px-2.5 py-1.5 border rounded-lg text-xs font-bold focus:outline-none ${
                                !previewMetrics.isValid
                                  ? "border-rose-300 bg-rose-50/40 focus:border-rose-500"
                                  : "border-gray-200 focus:border-pink-500"
                              }`}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-gray-600 block">
                              Catatan Plak (Opsional)
                            </label>
                            <input
                              type="text"
                              value={draft.notes}
                              onChange={(e) =>
                                handleUpdatePcrVisitDraft(draft.tempId, { notes: e.target.value })
                              }
                              placeholder="Misal: Plak di regio bukal RA"
                              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-pink-500"
                            />
                          </div>
                        </div>

                        {!previewMetrics.isValid && (
                          <p className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                            {previewMetrics.validationError}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  <div className="flex flex-wrap justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setPcrVisitDrafts([])}
                      className="px-3 py-1.5 text-[11px] font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handlePublishPcrVisits}
                      className="px-4 py-1.5 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send size={13} />
                      <span>Publish Kunjungan &amp; Hitung Skor Otomatis</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Riwayat Kunjungan PCR Terpublish untuk Pasien Saat Ini (dengan Fitur Edit & Hapus) */}
              {patientPcrVisits.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {patientPcrVisits.map((visit, idx) => {
                    const visitNumber = idx + 1;
                    const resolved = resolveValidExamPcr(visit);
                    const isEditing = editingPcrVisit?.visitId === visit.id;
                    const isConfirmingDelete = confirmDeleteVisitId === visit.id;

                    if (isEditing && editingPcrVisit) {
                      const editPreview = calculatePcrMetrics(
                        editingPcrVisit.teethCount,
                        editingPcrVisit.plaqueSurfacesCount
                      );
                      return (
                        <div
                          key={visit.id}
                          className="md:col-span-2 p-3.5 rounded-xl border-2 border-pink-300 bg-pink-50/40 space-y-2.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[11px] font-black text-pink-950 uppercase">
                              Edit Kunjungan Kontrol Plak ke-{visitNumber}
                            </span>
                            {editPreview.isValid ? (
                              <span
                                className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                                  editPreview.pcrInterpretation === "Baik"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-rose-50 text-rose-700 border-rose-200"
                                }`}
                              >
                                Skor Valid: {editPreview.pcrPlaqueSurfacesCount}/{editPreview.totalSurfaces} = {editPreview.pcrScore}% ({editPreview.pcrInterpretation})
                              </span>
                            ) : (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full border bg-rose-50 text-rose-700 border-rose-200">
                                Input Tidak Valid
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-gray-600 block">
                                Tanggal Kunjungan
                              </label>
                              <input
                                type="date"
                                value={editingPcrVisit.date}
                                onChange={(e) =>
                                  setEditingPcrVisit({ ...editingPcrVisit, date: e.target.value })
                                }
                                className="w-full px-2.5 py-1.5 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:border-pink-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-gray-600 block">
                                Gigi Diperiksa (1–32)
                              </label>
                              <input
                                type="number"
                                min={1}
                                max={32}
                                value={editingPcrVisit.teethCount}
                                onChange={(e) =>
                                  setEditingPcrVisit({
                                    ...editingPcrVisit,
                                    teethCount: e.target.value === "" ? "" : Number(e.target.value),
                                  })
                                }
                                className="w-full px-2.5 py-1.5 border border-gray-200 bg-white rounded-lg text-xs font-bold focus:outline-none focus:border-pink-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-gray-600 block">
                                Permukaan Berplak (Maks {editPreview.totalSurfaces || 128})
                              </label>
                              <input
                                type="number"
                                min={0}
                                max={editPreview.totalSurfaces > 0 ? editPreview.totalSurfaces : 128}
                                value={editingPcrVisit.plaqueSurfacesCount}
                                onChange={(e) =>
                                  setEditingPcrVisit({
                                    ...editingPcrVisit,
                                    plaqueSurfacesCount:
                                      e.target.value === "" ? "" : Number(e.target.value),
                                  })
                                }
                                className="w-full px-2.5 py-1.5 border border-gray-200 bg-white rounded-lg text-xs font-bold focus:outline-none focus:border-pink-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-gray-600 block">
                                Catatan Plak
                              </label>
                              <input
                                type="text"
                                value={editingPcrVisit.notes}
                                onChange={(e) =>
                                  setEditingPcrVisit({ ...editingPcrVisit, notes: e.target.value })
                                }
                                placeholder="Catatan kondisi plak..."
                                className="w-full px-2.5 py-1.5 border border-gray-200 bg-white rounded-lg text-xs focus:outline-none focus:border-pink-500"
                              />
                            </div>
                          </div>

                          {!editPreview.isValid && (
                            <p className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                              {editPreview.validationError}
                            </p>
                          )}

                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingPcrVisit(null)}
                              className="px-3 py-1 text-[11px] font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer flex items-center gap-1"
                            >
                              <X size={12} />
                              <span>Batal</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEditPcrVisit(visit, visitNumber)}
                              className="px-3.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer flex items-center gap-1"
                            >
                              <Check size={12} />
                              <span>Simpan Perubahan</span>
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={visit.id}
                        className="p-3 rounded-xl border border-pink-100 bg-pink-50/20 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[11px] font-black text-pink-900">
                                Kunjungan ke-{visitNumber}
                              </span>
                              <span className="text-[10px] text-gray-500 font-mono">
                                {formatIndoShortDate(visit.date)}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-600 mt-0.5">
                              {resolved.pcrPlaqueSurfacesCount}/{resolved.totalSurfaces} permukaan berplak ({resolved.pcrTeethCount} gigi)
                            </p>
                            {visit.objective.odontogramNotes && (
                              <p className="text-[9px] text-gray-400 truncate mt-0.5">
                                {visit.objective.odontogramNotes}
                              </p>
                            )}
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-sm font-black text-gray-900 block">
                              {resolved.pcrScore}%
                            </span>
                            <span
                              className={`text-[9px] font-black px-1.5 py-0.2 rounded-full border ${
                                resolved.pcrInterpretation === "Baik"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                              }`}
                            >
                              {resolved.pcrInterpretation}
                            </span>
                          </div>
                        </div>

                        {(onEditExam || onDeleteExam) && (
                          <div className="pt-1.5 border-t border-pink-100/70 flex items-center justify-end gap-1.5">
                            {isConfirmingDelete ? (
                              <div className="w-full flex items-center justify-between gap-2 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                                <span className="text-[10px] font-bold text-rose-800">
                                  Hapus kunjungan ini?
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteVisitId(null)}
                                    className="px-2 py-0.5 text-[10px] font-bold bg-white border border-gray-200 text-gray-600 rounded cursor-pointer"
                                  >
                                    Batal
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleConfirmDeletePcrVisit(visit, visitNumber)}
                                    className="px-2 py-0.5 text-[10px] font-bold bg-rose-600 hover:bg-rose-700 text-white rounded cursor-pointer"
                                  >
                                    Ya, Hapus
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                {onEditExam && (
                                  <button
                                    type="button"
                                    onClick={() => handleStartEditPcrVisit(visit)}
                                    className="px-2.5 py-1 text-[10px] font-bold bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                                  >
                                    <Edit size={11} />
                                    <span>Edit</span>
                                  </button>
                                )}
                                {onDeleteExam && (
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteVisitId(visit.id)}
                                    className="px-2.5 py-1 text-[10px] font-bold bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                                  >
                                    <Trash2 size={11} />
                                    <span>Hapus</span>
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[11px] text-gray-400 italic">
                  Belum ada kunjungan PCR terpublish untuk {currentPatient?.name || "pasien ini"}. Klik &ldquo;Tambah Kunjungan&rdquo; untuk mencatat kunjungan baru.
                </p>
              )}
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

          {/* Parameter Orto Cepat: Archwire Change */}
          <div className="bg-pink-50/40 p-4 rounded-xl border border-pink-100 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={archwireChange.enabled}
                  onChange={(e) =>
                    setArchwireChange((prev) => ({ ...prev, enabled: e.target.checked }))
                  }
                  className="w-4 h-4 rounded border-pink-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-pink-950 flex items-center gap-1.5">
                  <Sliders size={14} className="text-pink-600" />
                  <span>Archwire Change (Penggantian Ukuran / Material Kawat)</span>
                </span>
              </label>

              {archwireChange.enabled && (
                <button
                  type="button"
                  onClick={handleApplyArchwireToProcedure}
                  className="px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white text-[11px] font-bold rounded-lg transition-all shadow-2xs flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <Check size={12} />
                  <span>Sisipkan ke Kolom Prosedur</span>
                </button>
              )}
            </div>

            {archwireChange.enabled && (
              <div className="space-y-3 pt-2 border-t border-pink-100/80">
                {/* Quick Preset Checkboxes / Chips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-pink-800 uppercase tracking-wider block">
                    Pilihan Cepat (Quick Preset Kawat)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ARCHWIRE_QUICK_PRESETS.map((preset) => {
                      const isActive =
                        archwireChange.material === preset.material &&
                        (!archwireChange.upperArch || archwireChange.upperSize === preset.size) &&
                        (!archwireChange.lowerArch || archwireChange.lowerSize === preset.size);
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() =>
                            setArchwireChange((prev) => ({
                              ...prev,
                              enabled: true,
                              material: preset.material,
                              upperSize: preset.size,
                              lowerSize: preset.size,
                            }))
                          }
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                            isActive
                              ? "bg-pink-500 text-white border-pink-500 shadow-2xs"
                              : "bg-white text-pink-800 border-pink-200 hover:bg-pink-50"
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Arch Checkboxes + Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Material Dropdown */}
                  <div className="space-y-1 bg-white p-3 rounded-xl border border-pink-100">
                    <label className="text-[10px] font-bold text-pink-800 uppercase block">
                      Material Kawat
                    </label>
                    <select
                      value={archwireChange.material}
                      onChange={(e) =>
                        setArchwireChange((prev) => ({ ...prev, material: e.target.value }))
                      }
                      className="w-full px-2.5 py-1.5 border border-gray-200 bg-gray-50 focus:bg-white rounded-lg text-xs font-medium focus:outline-none focus:border-pink-500"
                    >
                      {ARCHWIRE_MATERIALS.map((mat) => (
                        <option key={mat} value={mat}>
                          {mat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Upper Arch (RA) Checkbox + Size Dropdown */}
                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-pink-100">
                    <label className="flex items-center gap-2 text-[11px] font-bold text-gray-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={archwireChange.upperArch}
                        onChange={(e) =>
                          setArchwireChange((prev) => ({ ...prev, upperArch: e.target.checked }))
                        }
                        className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      />
                      <span>Rahang Atas (RA)</span>
                    </label>
                    <select
                      value={archwireChange.upperSize}
                      disabled={!archwireChange.upperArch}
                      onChange={(e) =>
                        setArchwireChange((prev) => ({ ...prev, upperSize: e.target.value }))
                      }
                      className="w-full px-2.5 py-1.5 border border-gray-200 bg-gray-50 focus:bg-white rounded-lg text-xs font-mono disabled:opacity-50 focus:outline-none focus:border-pink-500"
                    >
                      {ARCHWIRE_SIZES.map((grp) => (
                        <optgroup key={grp.group} label={grp.group}>
                          {grp.options.map((sz) => (
                            <option key={sz} value={sz}>
                              {sz}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {/* Lower Arch (RB) Checkbox + Size Dropdown */}
                  <div className="space-y-1.5 bg-white p-3 rounded-xl border border-pink-100">
                    <label className="flex items-center gap-2 text-[11px] font-bold text-gray-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={archwireChange.lowerArch}
                        onChange={(e) =>
                          setArchwireChange((prev) => ({ ...prev, lowerArch: e.target.checked }))
                        }
                        className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      />
                      <span>Rahang Bawah (RB)</span>
                    </label>
                    <select
                      value={archwireChange.lowerSize}
                      disabled={!archwireChange.lowerArch}
                      onChange={(e) =>
                        setArchwireChange((prev) => ({ ...prev, lowerSize: e.target.value }))
                      }
                      className="w-full px-2.5 py-1.5 border border-gray-200 bg-gray-50 focus:bg-white rounded-lg text-xs font-mono disabled:opacity-50 focus:outline-none focus:border-pink-500"
                    >
                      {ARCHWIRE_SIZES.map((grp) => (
                        <optgroup key={grp.group} label={grp.group}>
                          {grp.options.map((sz) => (
                            <option key={sz} value={sz}>
                              {sz}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Live Summary Preview */}
                <div className="bg-white/80 px-3 py-2 rounded-lg border border-pink-100 text-[11px] text-pink-900 flex flex-wrap items-center justify-between gap-2">
                  <span>
                    <strong>Ringkasan Kawat:</strong>{" "}
                    <span className="font-mono">{formatArchwireSummary(archwireChange)}</span>
                  </span>
                  <span className="text-[10px] text-pink-600">
                    Tersimpan otomatis ke RME &amp; kolom prosedur
                  </span>
                </div>
              </div>
            )}
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
