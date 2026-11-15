import { BrushingChecklistData, BrushingMonthData, Patient } from "../types";

export const ENGLISH_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const INDONESIAN_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

export const getCurrentMonthKey = (date: Date = new Date()): string => {
  return `${ENGLISH_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

export const formatMonthLabelIndo = (monthKey: string): string => {
  const parts = monthKey.trim().split(" ");
  const monthName = parts[0] || "";
  const year = parts[1] || String(new Date().getFullYear());
  const enIdx = ENGLISH_MONTHS.findIndex(
    (m) => m.toLowerCase() === monthName.toLowerCase()
  );
  if (enIdx !== -1) {
    return `${INDONESIAN_MONTHS[enIdx]} ${year}`;
  }
  const idIdx = INDONESIAN_MONTHS.findIndex(
    (m) => m.toLowerCase() === monthName.toLowerCase()
  );
  if (idIdx !== -1) {
    return `${INDONESIAN_MONTHS[idIdx]} ${year}`;
  }
  return monthKey;
};

export const getDaysInMonth = (monthStr: string): number => {
  const trimmed = monthStr.trim();
  if (trimmed.startsWith("February") || trimmed.startsWith("Februari")) {
    const parts = trimmed.split(" ");
    const year = parts[1] ? parseInt(parts[1], 10) : new Date().getFullYear();
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    return isLeap ? 29 : 28;
  }
  const thirtyDays = ["April", "June", "Juni", "September", "November"];
  const match = thirtyDays.some((m) => trimmed.startsWith(m));
  return match ? 30 : 31;
};

export const seedDefaultBrushingChecklist = (
  existing: BrushingChecklistData = {}
): BrushingChecklistData => {
  const next: BrushingChecklistData = { ...existing };
  const defaultMonth = "June 2026";

  // Seed default data for Mia Nurkamila (RM-2604-1066) in June 2026 (52 / 60 sessions)
  const miaId = "RM-2604-1066";
  if (!next[miaId] || !next[miaId][defaultMonth]) {
    const seededMonthData: BrushingMonthData = {};
    const uncheckedSessions = [
      { day: 3, session: "malam" },
      { day: 8, session: "pagi" },
      { day: 12, session: "malam" },
      { day: 15, session: "pagi" },
      { day: 20, session: "pagi" },
      { day: 21, session: "malam" },
      { day: 24, session: "malam" },
      { day: 28, session: "pagi" },
    ];

    for (let d = 1; d <= 30; d++) {
      const pagiUnchecked = uncheckedSessions.some(
        (u) => u.day === d && u.session === "pagi"
      );
      const malamUnchecked = uncheckedSessions.some(
        (u) => u.day === d && u.session === "malam"
      );

      seededMonthData[d] = {
        pagi: !pagiUnchecked,
        malam: !malamUnchecked,
      };
    }

    next[miaId] = {
      ...(next[miaId] || {}),
      [defaultMonth]: seededMonthData,
    };
  }

  // Seed default data for Aditya Pratama (P-101) in June 2026 (50 / 60 sessions)
  const adityaId = "P-101";
  if (!next[adityaId] || !next[adityaId][defaultMonth]) {
    const seededMonthData: BrushingMonthData = {};
    const uncheckedAditya = [
      { day: 2, session: "malam" },
      { day: 5, session: "malam" },
      { day: 10, session: "pagi" },
      { day: 14, session: "malam" },
      { day: 18, session: "pagi" },
      { day: 22, session: "malam" },
      { day: 25, session: "malam" },
      { day: 26, session: "pagi" },
      { day: 29, session: "pagi" },
      { day: 30, session: "malam" },
    ];

    for (let d = 1; d <= 30; d++) {
      const pagiUnchecked = uncheckedAditya.some(
        (u) => u.day === d && u.session === "pagi"
      );
      const malamUnchecked = uncheckedAditya.some(
        (u) => u.day === d && u.session === "malam"
      );

      seededMonthData[d] = {
        pagi: !pagiUnchecked,
        malam: !malamUnchecked,
      };
    }

    next[adityaId] = {
      ...(next[adityaId] || {}),
      [defaultMonth]: seededMonthData,
    };
  }

  return next;
};

export const getPatientBrushingSummary = (
  checklist: BrushingChecklistData,
  patientId: string
): {
  completedSessions: number;
  totalSessions: number;
  percentage: number | null;
  monthsCount: number;
} => {
  const patientMonths = checklist[patientId];
  if (!patientMonths) {
    return {
      completedSessions: 0,
      totalSessions: 0,
      percentage: null,
      monthsCount: 0,
    };
  }

  const monthKeys = Object.keys(patientMonths);
  if (monthKeys.length === 0) {
    return {
      completedSessions: 0,
      totalSessions: 0,
      percentage: null,
      monthsCount: 0,
    };
  }

  let completedSessions = 0;
  let totalSessions = 0;

  monthKeys.forEach((month) => {
    const monthData = patientMonths[month] || {};
    const days = getDaysInMonth(month);
    totalSessions += days * 2;

    Object.values(monthData).forEach((dayState) => {
      if (dayState?.pagi) completedSessions += 1;
      if (dayState?.malam) completedSessions += 1;
    });
  });

  const percentage =
    totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : null;

  return {
    completedSessions,
    totalSessions,
    percentage,
    monthsCount: monthKeys.length,
  };
};

export const getOverallBrushingSummary = (
  checklist: BrushingChecklistData,
  patients: Patient[]
): {
  totalCompletedSessions: number;
  totalTargetSessions: number;
  averagePercentage: number;
  patientsWithChecklistCount: number;
  totalPatientsCount: number;
} => {
  if (patients.length === 0) {
    return {
      totalCompletedSessions: 0,
      totalTargetSessions: 0,
      averagePercentage: 0,
      patientsWithChecklistCount: 0,
      totalPatientsCount: 0,
    };
  }

  let totalCompletedSessions = 0;
  let totalTargetSessions = 0;
  let patientsWithChecklistCount = 0;
  let sumPatientPercentages = 0;

  patients.forEach((patient) => {
    const summary = getPatientBrushingSummary(checklist, patient.id);
    if (summary.totalSessions > 0) {
      patientsWithChecklistCount += 1;
      totalCompletedSessions += summary.completedSessions;
      totalTargetSessions += summary.totalSessions;
      sumPatientPercentages +=
        (summary.completedSessions / summary.totalSessions) * 100;
    } else {
      // Pasien yang belum mengisi ceklis sikat gigi dihitung 0% (target 1 bulan = 60 sesi)
      totalTargetSessions += 60;
      sumPatientPercentages += 0;
    }
  });

  const averagePercentage = Math.round(sumPatientPercentages / patients.length);

  return {
    totalCompletedSessions,
    totalTargetSessions,
    averagePercentage,
    patientsWithChecklistCount,
    totalPatientsCount: patients.length,
  };
};
