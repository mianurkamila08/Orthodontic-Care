import { SOAPExam } from "../types";

export interface PcrCalculationResult {
  isValid: boolean;
  validationError?: string;
  pcrTeethCount: number;
  pcrPlaqueSurfacesCount: number;
  totalSurfaces: number;
  pcrScore: number;
  pcrInterpretation: "Baik" | "Buruk";
}

/**
 * Memvalidasi dan menghitung skor Plaque Control Record (Indeks Plak O'Leary)
 * secara ketat berdasarkan data jumlah gigi diperiksa & permukaan berplak yang terinput.
 * Formula valid: (Jumlah Permukaan Berplak / (Jumlah Gigi x 4)) * 100%
 * Syarat valid:
 * - Jumlah gigi bilangan bulat 1..32
 * - Jumlah permukaan berplak bilangan bulat 0..(Jumlah Gigi * 4)
 * Interpretasi: < 10% = "Baik", >= 10% = "Buruk".
 */
export function calculatePcrMetrics(
  teethCount: number | string,
  plaqueSurfacesCount: number | string
): PcrCalculationResult {
  const teethEmpty = teethCount === "" || teethCount === null || teethCount === undefined;
  const plaqueEmpty =
    plaqueSurfacesCount === "" || plaqueSurfacesCount === null || plaqueSurfacesCount === undefined;

  const rawTeeth = Number(teethCount);
  const rawPlaque = Number(plaqueSurfacesCount);

  if (teethEmpty || Number.isNaN(rawTeeth) || !Number.isInteger(rawTeeth) || rawTeeth < 1 || rawTeeth > 32) {
    return {
      isValid: false,
      validationError: "Jumlah gigi diperiksa harus bilangan bulat antara 1 sampai 32 gigi.",
      pcrTeethCount: Number.isNaN(rawTeeth) ? 0 : Math.max(0, Math.round(rawTeeth)),
      pcrPlaqueSurfacesCount: Number.isNaN(rawPlaque) ? 0 : Math.max(0, Math.round(rawPlaque)),
      totalSurfaces: !Number.isNaN(rawTeeth) && rawTeeth > 0 ? Math.round(rawTeeth) * 4 : 0,
      pcrScore: 0,
      pcrInterpretation: "Baik",
    };
  }

  const totalSurfaces = rawTeeth * 4;

  if (plaqueEmpty || Number.isNaN(rawPlaque) || !Number.isInteger(rawPlaque) || rawPlaque < 0) {
    return {
      isValid: false,
      validationError: "Jumlah permukaan berplak harus berupa bilangan bulat minimal 0.",
      pcrTeethCount: rawTeeth,
      pcrPlaqueSurfacesCount: 0,
      totalSurfaces,
      pcrScore: 0,
      pcrInterpretation: "Baik",
    };
  }

  if (rawPlaque > totalSurfaces) {
    return {
      isValid: false,
      validationError: `Jumlah permukaan berplak (${rawPlaque}) melebihi total permukaan diperiksa (${totalSurfaces} permukaan dari ${rawTeeth} gigi).`,
      pcrTeethCount: rawTeeth,
      pcrPlaqueSurfacesCount: rawPlaque,
      totalSurfaces,
      pcrScore: 0,
      pcrInterpretation: "Buruk",
    };
  }

  const rawScore = (rawPlaque / totalSurfaces) * 100;
  const pcrScore = Number(rawScore.toFixed(1));
  const pcrInterpretation: "Baik" | "Buruk" = pcrScore < 10 ? "Baik" : "Buruk";

  return {
    isValid: true,
    pcrTeethCount: rawTeeth,
    pcrPlaqueSurfacesCount: rawPlaque,
    totalSurfaces,
    pcrScore,
    pcrInterpretation,
  };
}

/**
 * Mengambil & memvalidasi ulang skor PCR dari dokumen SOAPExam yang tersimpan
 * agar hasil indeks selalu konsisten dengan data pcrTeethCount & pcrPlaqueSurfacesCount.
 */
export function resolveValidExamPcr(exam: SOAPExam): {
  pcrScore: number;
  pcrInterpretation: "Baik" | "Buruk";
  pcrTeethCount: number;
  pcrPlaqueSurfacesCount: number;
  totalSurfaces: number;
} {
  const teeth = exam.objective.pcrTeethCount;
  const plaque = exam.objective.pcrPlaqueSurfacesCount;

  if (typeof teeth === "number" && typeof plaque === "number") {
    const calculated = calculatePcrMetrics(teeth, plaque);
    if (calculated.isValid) {
      return {
        pcrScore: calculated.pcrScore,
        pcrInterpretation: calculated.pcrInterpretation,
        pcrTeethCount: calculated.pcrTeethCount,
        pcrPlaqueSurfacesCount: calculated.pcrPlaqueSurfacesCount,
        totalSurfaces: calculated.totalSurfaces,
      };
    }
  }

  const fallbackScore = Number(
    Math.max(0, Math.min(100, Number(exam.objective.pcrScore ?? 0))).toFixed(1)
  );
  const safeTeeth = typeof teeth === "number" && teeth > 0 ? teeth : 28;
  const safePlaque = typeof plaque === "number" && plaque >= 0 ? plaque : 0;

  return {
    pcrScore: fallbackScore,
    pcrInterpretation: fallbackScore < 10 ? "Baik" : "Buruk",
    pcrTeethCount: safeTeeth,
    pcrPlaqueSurfacesCount: safePlaque,
    totalSurfaces: safeTeeth * 4,
  };
}

/**
 * Menghasilkan ID unik rekam pemeriksaan yang kompatibel dengan aturan Firestore (<= 64 karakter).
 */
export function generateUniqueExamId(): string {
  const rand = Math.floor(100 + Math.random() * 900);
  return `E-${Date.now()}-${rand}`;
}

export interface BuildPcrVisitPayload {
  patientId: string;
  date: string;
  dentistName: string;
  teethCount: number | string;
  plaqueSurfacesCount: number | string;
  visitNumber?: number;
  notes?: string;
  latestPatientExam?: SOAPExam;
}

/**
 * Membentuk objek SOAPExam untuk kunjungan Plaque Control Record (PCR)
 * dengan skor & interpretasi pasien terhitung otomatis dan valid saat terpublish.
 */
export function buildPcrVisitExam({
  patientId,
  date,
  dentistName,
  teethCount,
  plaqueSurfacesCount,
  visitNumber,
  notes,
  latestPatientExam,
}: BuildPcrVisitPayload): SOAPExam {
  const metrics = calculatePcrMetrics(teethCount, plaqueSurfacesCount);
  if (!metrics.isValid) {
    throw new Error(metrics.validationError || "Data pemeriksaan PCR tidak valid.");
  }

  const cleanNotes = (notes || "").trim();
  const visitLabel = visitNumber && visitNumber > 0 ? `Kunjungan ke-${visitNumber}` : "Kunjungan Kontrol Plak";
  const nextControl = (() => {
    const base = date ? new Date(`${date}T00:00:00`) : new Date();
    if (Number.isNaN(base.getTime())) return new Date().toISOString().split("T")[0];
    base.setDate(base.getDate() + 28);
    return base.toISOString().split("T")[0];
  })();

  const prevObj = latestPatientExam?.objective;
  const prevStage = latestPatientExam?.plan?.treatmentStage || "Leveling & Alignment";

  return {
    id: generateUniqueExamId(),
    patientId,
    date,
    dentistName: dentistName.trim() || "Mia Nurkamila, A.Md.Kes",
    subjective: cleanNotes
      ? `${visitLabel} Plaque Control Record (PCR): ${cleanNotes}`
      : `${visitLabel} — Evaluasi kebersihan gigi dan kontrol plak (Plaque Control Record).`,
    objective: {
      generalStatus: prevObj?.generalStatus || "Keadaan umum baik.",
      extraOral: prevObj?.extraOral || "Wajah simetris, TMJ normal.",
      intraOral:
        metrics.pcrInterpretation === "Baik"
          ? `Oral hygiene baik (Skor PCR ${metrics.pcrScore}% — ${metrics.pcrPlaqueSurfacesCount}/${metrics.totalSurfaces} permukaan berplak).`
          : `Oral hygiene perlu ditingkatkan (Skor PCR ${metrics.pcrScore}% — ${metrics.pcrPlaqueSurfacesCount}/${metrics.totalSurfaces} permukaan berplak).`,
      malocclusionClass: prevObj?.malocclusionClass || "Angle Class I",
      overjet: typeof prevObj?.overjet === "number" ? prevObj.overjet : 2,
      overbite: typeof prevObj?.overbite === "number" ? prevObj.overbite : 2,
      crowdingUpper: Boolean(prevObj?.crowdingUpper),
      crowdingLower: Boolean(prevObj?.crowdingLower),
      spacingUpper: Boolean(prevObj?.spacingUpper),
      spacingLower: Boolean(prevObj?.spacingLower),
      odontogramNotes: cleanNotes || `Pemeriksaan PCR ${visitLabel}`,
      pcrScore: metrics.pcrScore,
      pcrTeethCount: metrics.pcrTeethCount,
      pcrPlaqueSurfacesCount: metrics.pcrPlaqueSurfacesCount,
      pcrInterpretation: metrics.pcrInterpretation,
    },
    assessment: `Evaluasi Plaque Control Record (PCR): Skor ${metrics.pcrScore}% (Higiene ${metrics.pcrInterpretation}).`,
    plan: {
      treatmentStage: prevStage,
      procedure:
        metrics.pcrInterpretation === "Baik"
          ? `Kontrol plak & evaluasi O'Leary PCR (${metrics.pcrScore}% - Baik). Edukasi pemeliharaan sikat gigi ortodontik.`
          : `Kontrol plak & evaluasi O'Leary PCR (${metrics.pcrScore}% - Buruk). Instruksi penyikatan interdental & disclosing agent.`,
      prescription:
        metrics.pcrInterpretation === "Buruk"
          ? "Sikat interdental, pasta gigi berfluoride, dan obat kumur antiseptik non-alkohol."
          : "Pertahankan menyikat gigi 2–3x sehari setelah makan.",
      nextVisitDate: nextControl,
    },
  };
}

const INDO_SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];

export function formatIndoShortDate(isoDate: string): string {
  if (!isoDate) return "-";
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const monthName = INDO_SHORT_MONTHS[monthIdx] || parts[1];
  return `${day} ${monthName} ${year}`;
}
