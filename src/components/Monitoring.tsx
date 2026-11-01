import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Check, 
  ChevronDown, 
  Award, 
  Sparkles, 
  Activity,
  Smile,
  CheckSquare
} from "lucide-react";
import { MonitoringLog, Patient } from "../types";

interface MonitoringProps {
  logs: MonitoringLog[];
  patients: Patient[];
  selectedPatientId: string;
  onAddLog: (log: MonitoringLog) => void;
}

interface BrushingDayState {
  pagi: boolean;
  malam: boolean;
}

interface BrushingMonthData {
  [day: number]: BrushingDayState;
}

interface BrushingChecklistData {
  [patientId: string]: {
    [month: string]: BrushingMonthData;
  };
}

export default function Monitoring({
  logs,
  patients,
  selectedPatientId,
  onAddLog,
}: MonitoringProps) {
  // Available Months for selection
  const months = [
    "January 2026",
    "February 2026",
    "March 2026",
    "April 2026",
    "May 2026",
    "June 2026",
    "July 2026",
    "August 2026",
    "September 2026",
    "October 2026",
    "November 2026",
    "December 2026",
  ];

  // Default to June 2026 as shown in screenshot
  const [selectedMonth, setSelectedMonth] = useState<string>("June 2026");
  
  // Local state for active patient in this view
  const [activePatientId, setActivePatientId] = useState<string>(selectedPatientId);

  // Sync state with prop if selectedPatientId changes from outer nav
  useEffect(() => {
    if (selectedPatientId) {
      setActivePatientId(selectedPatientId);
    }
  }, [selectedPatientId]);

  // Master checklist state
  const [checklist, setChecklist] = useState<BrushingChecklistData>(() => {
    const saved = localStorage.getItem("ortho_brushing_checklist");
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("ortho_brushing_checklist", JSON.stringify(checklist));
  }, [checklist]);

  // Get days in selected month
  const getDaysInMonth = (monthStr: string): number => {
    if (monthStr.startsWith("February")) {
      return 28; // 2026 is not a leap year
    }
    const thirtyDays = ["April", "June", "September", "November"];
    const match = thirtyDays.some(m => monthStr.startsWith(m));
    return match ? 30 : 31;
  };

  const numDays = getDaysInMonth(selectedMonth);

  // Seed default data for Mia Nurkamila in June 2026 (exactly 52 / 60 Sessions checked as shown in the screenshot)
  useEffect(() => {
    const defaultPatientId = "RM-2604-1066";
    const defaultMonth = "June 2026";
    
    // If we don't have records for Mia in June 2026, let's seed exactly 52 checked sessions
    if (!checklist[defaultPatientId] || !checklist[defaultPatientId][defaultMonth]) {
      const seededMonthData: BrushingMonthData = {};
      
      // Unchecked sessions to make exactly 52 / 60 checked
      // Total 60 sessions. 8 sessions should be unchecked.
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
        const pagiUnchecked = uncheckedSessions.some(u => u.day === d && u.session === "pagi");
        const malamUnchecked = uncheckedSessions.some(u => u.day === d && u.session === "malam");
        
        seededMonthData[d] = {
          pagi: !pagiUnchecked,
          malam: !malamUnchecked,
        };
      }

      setChecklist(prev => ({
        ...prev,
        [defaultPatientId]: {
          ...(prev[defaultPatientId] || {}),
          [defaultMonth]: seededMonthData
        }
      }));
    }

    // Seed default data for Aditya Pratama P-101 in June 2026 as well (e.g. 48 / 60 sessions)
    const adityaId = "P-101";
    if (!checklist[adityaId] || !checklist[adityaId][defaultMonth]) {
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
        const pagiUnchecked = uncheckedAditya.some(u => u.day === d && u.session === "pagi");
        const malamUnchecked = uncheckedAditya.some(u => u.day === d && u.session === "malam");
        
        seededMonthData[d] = {
          pagi: !pagiUnchecked,
          malam: !malamUnchecked,
        };
      }

      setChecklist(prev => ({
        ...prev,
        [adityaId]: {
          ...(prev[adityaId] || {}),
          [defaultMonth]: seededMonthData
        }
      }));
    }
  }, [checklist]);

  // Ensure active patient and month has an entry in local state
  const getMonthData = (): BrushingMonthData => {
    if (checklist[activePatientId] && checklist[activePatientId][selectedMonth]) {
      return checklist[activePatientId][selectedMonth];
    }
    
    // Return empty month data if not initialized yet
    const emptyData: BrushingMonthData = {};
    for (let d = 1; d <= numDays; d++) {
      emptyData[d] = { pagi: false, malam: false };
    }
    return emptyData;
  };

  const monthData = getMonthData();

  // Toggle checklist session (Pagi or Malam) for a specific day
  const toggleSession = (day: number, session: "pagi" | "malam") => {
    const currentMonthData = { ...monthData };
    
    // If day record doesn't exist, initialize it
    if (!currentMonthData[day]) {
      currentMonthData[day] = { pagi: false, malam: false };
    }

    currentMonthData[day] = {
      ...currentMonthData[day],
      [session]: !currentMonthData[day][session]
    };

    setChecklist(prev => ({
      ...prev,
      [activePatientId]: {
        ...(prev[activePatientId] || {}),
        [selectedMonth]: currentMonthData
      }
    }));

    // Trigger log creation in backend/App.tsx logs if needed to track real history logs
    const completedSessions = Object.values(currentMonthData).reduce((acc, curr) => {
      let count = 0;
      if (curr.pagi) count++;
      if (curr.malam) count++;
      return acc + count;
    }, 0);

    const yearMonth = selectedMonth.split(" ");
    const monthIndex = months.indexOf(selectedMonth) + 1;
    const formattedMonth = monthIndex < 10 ? `0${monthIndex}` : `${monthIndex}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedDate = `${yearMonth[1] || "2026"}-${formattedMonth}-${formattedDay}`;

    // Create a new log or trigger standard onAddLog
    onAddLog({
      id: `L-S-${activePatientId}-${day}`,
      patientId: activePatientId,
      date: formattedDate,
      painLevel: 1,
      brushedCount: currentMonthData[day].pagi && currentMonthData[day].malam ? 2 : (currentMonthData[day].pagi || currentMonthData[day].malam ? 1 : 0),
      waxUsed: false,
      notes: `Sikat gigi sela harian: ${currentMonthData[day].pagi ? "Pagi (v) " : ""}${currentMonthData[day].malam ? "Malam (v)" : ""}`
    });
  };

  // Calculate statistics
  const totalSessions = numDays * 2;
  const completedSessions = Object.values(monthData).reduce((acc, curr) => {
    let count = 0;
    if (curr.pagi) count++;
    if (curr.malam) count++;
    return acc + count;
  }, 0);

  const compliancePercentage = totalSessions > 0
    ? Math.round((completedSessions / totalSessions) * 100)
    : 0;

  // Selected patient details
  const selectedPatient = patients.find(p => p.id === activePatientId) || patients[0];

  return (
    <div className="space-y-6" id="monitoring-root">
      {/* Header Container exactly matching the screenshot */}
      <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-pink-600 flex items-center gap-2">
            <CheckSquare className="text-pink-600" size={24} />
            Monitoring Sikat Gigi
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Ceklis rutinitas menyikat gigi 2x sehari (Pagi setelah sarapan & Malam sebelum tidur).
          </p>
        </div>

        {/* Month Selector exactly matching the top right section */}
        <div className="flex items-center gap-2 bg-pink-50/50 px-3 py-1.5 rounded-xl border border-pink-100 shrink-0 self-stretch md:self-auto">
          <span className="text-xs font-bold text-pink-700">Pilih Bulan:</span>
          <div className="relative flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden px-2 py-1 gap-1">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-bold text-gray-800 bg-transparent pr-6 focus:outline-none cursor-pointer appearance-none"
            >
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <Calendar size={14} className="text-pink-600 absolute right-2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Patient Selector Area */}
      <div className="bg-pink-50/20 p-5 rounded-2xl border border-pink-100/50 flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="text-sm font-black text-pink-700 tracking-wide uppercase shrink-0">
          Pilih Pasien :
        </label>
        <div className="relative flex-1">
          <select
            value={activePatientId}
            onChange={(e) => setActivePatientId(e.target.value)}
            className="w-full sm:max-w-md px-4 py-2 border border-pink-200 focus:border-pink-500 rounded-xl text-xs font-bold text-gray-800 bg-white focus:outline-none appearance-none cursor-pointer pr-10 shadow-sm"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} - {p.name}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="text-pink-600 absolute right-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Kepatuhan Progress Bar Container */}
      <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-3">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-pink-700 flex items-center gap-1.5">
            <Activity size={16} className="text-pink-500 animate-pulse" />
            Kepatuhan Bulan Ini: {compliancePercentage}%
          </span>
          <span className="text-pink-700 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100">
            {completedSessions} / {totalSessions} Sesi
          </span>
        </div>

        {/* Outer bar */}
        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
          {/* Active bar with solid pink/red matching screenshot */}
          <div 
            className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500 ease-out relative"
            style={{ width: `${compliancePercentage}%` }}
          >
            {/* Subtle stripe effect */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Grid of Days (H-1 to H-30/31) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {Array.from({ length: numDays }).map((_, index) => {
          const dayNum = index + 1;
          const isPagiChecked = monthData[dayNum]?.pagi || false;
          const isMalamChecked = monthData[dayNum]?.malam || false;

          return (
            <div 
              key={dayNum}
              className="bg-white rounded-xl border border-pink-100 shadow-sm hover:border-pink-300 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Day Header Block */}
              <div className="bg-pink-50/50 py-1.5 text-center border-b border-pink-50">
                <span className="text-xs font-extrabold text-pink-700">H-{dayNum}</span>
              </div>

              {/* Checkbox Rows (Pagi & Malam) */}
              <div className="p-3 grid grid-cols-2 gap-2 text-center">
                
                {/* Pagi */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Pagi</span>
                  <button
                    onClick={() => toggleSession(dayNum, "pagi")}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-all ${
                      isPagiChecked 
                        ? "bg-pink-500 border-pink-500 text-white shadow-sm" 
                        : "bg-white border-gray-200 hover:border-pink-300 text-transparent"
                    }`}
                    title={`Pagi Hari ke-${dayNum}`}
                  >
                    <Check size={16} strokeWidth={3} className={isPagiChecked ? "scale-100" : "scale-0"} />
                  </button>
                </div>

                {/* Malam */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Malam</span>
                  <button
                    onClick={() => toggleSession(dayNum, "malam")}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-all ${
                      isMalamChecked 
                        ? "bg-pink-500 border-pink-500 text-white shadow-sm" 
                        : "bg-white border-gray-200 hover:border-pink-300 text-transparent"
                    }`}
                    title={`Malam Hari ke-${dayNum}`}
                  >
                    <Check size={16} strokeWidth={3} className={isMalamChecked ? "scale-100" : "scale-0"} />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Aesthetic Motivation Badge */}
      <div className="bg-pink-50/30 p-4 rounded-xl border border-pink-100 flex items-center gap-3 text-xs text-pink-800 leading-relaxed">
        <Award className="text-pink-600 shrink-0" size={24} />
        <div>
          <strong>Tips Kepatuhan Ortodonti:</strong> Menjaga kepatuhan menyikat gigi minimal 2 kali sehari secara konsisten sangat vital bagi pengguna kawat gigi untuk mencegah penumpukan plak dan peradangan gingiva di sekitar bracket.
        </div>
      </div>
    </div>
  );
}
