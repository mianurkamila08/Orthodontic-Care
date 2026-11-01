import React from "react";
import { 
  Users, 
  FileText, 
  Activity, 
  HelpCircle, 
  AlertCircle, 
  Calendar, 
  Smile, 
  Clock, 
  ChevronRight, 
  CheckCircle,
  TrendingUp,
  Award,
  Eye,
  Smartphone,
  Monitor,
  Search,
  MessageCircle,
  History,
  Radio,
  X,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Filter
} from "lucide-react";
import { Patient, SOAPExam, MonitoringLog, PatientAccessLog } from "../types";
import { getPatientAccessStatus, formatRelativeTime, formatFullIndoDateTime } from "../utils/accessUtils";

interface DashboardProps {
  role: "dentist" | "patient";
  patients: Patient[];
  exams: SOAPExam[];
  logs: MonitoringLog[];
  selectedPatientId: string;
  onNavigate: (tab: string) => void;
  onSelectPatient: (id: string) => void;
  accessLogs?: PatientAccessLog[];
}

export default function Dashboard({
  role,
  patients,
  exams,
  logs,
  selectedPatientId,
  onNavigate,
  onSelectPatient,
  accessLogs = [],
}: DashboardProps) {
  // Common Calculations
  const activePatientCount = patients.length;
  const totalExamsCount = exams.length;
  
  // Calculate average compliance score based on logs (0 to 100)
  // Brushing > 2 times is 35 points, pain tracking completed is 15 points, wear hours > 20 is 50 points
  const calculateLogScore = (log: MonitoringLog) => {
    let score = 0;
    if (log.brushedCount >= 3) score += 35;
    else if (log.brushedCount === 2) score += 20;
    else if (log.brushedCount === 1) score += 10;
    
    score += 15; // standard check-in points
    
    if (log.alignerWearHours !== undefined) {
      if (log.alignerWearHours >= 22) score += 50;
      else if (log.alignerWearHours >= 20) score += 40;
      else if (log.alignerWearHours >= 15) score += 25;
      else if (log.alignerWearHours >= 10) score += 10;
    } else {
      // For braces, elastic compliance or just taking care (wear hours is undefined, assume full score if wax or notes logged)
      score += 50;
    }
    return Math.min(score, 100);
  };

  const getComplianceStatus = (score: number) => {
    if (score >= 80) return { label: "Sangat Patuh", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    if (score >= 50) return { label: "Cukup Patuh", color: "bg-amber-100 text-amber-800 border-amber-200" };
    return { label: "Kurang Patuh", color: "bg-rose-100 text-rose-800 border-rose-200" };
  };

  const patientLogs = logs.filter(l => l.patientId === selectedPatientId);
  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const averageCompliance = React.useMemo(() => {
    if (logs.length === 0) return 85;
    const scores = logs.map(calculateLogScore);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [logs]);

  // Urgent complaints count
  const urgentTicketsCount = logs.filter(l => l.painLevel >= 8).length;

  // Patient Access Tracking States & Metrics
  const [accessFilter, setAccessFilter] = React.useState<"all" | "today" | "inactive">("all");
  const [accessSearchQuery, setAccessSearchQuery] = React.useState<string>("");
  const [auditModalPatientId, setAuditModalPatientId] = React.useState<string | null>(null);

  const activeTodayCount = React.useMemo(() => {
    return patients.filter(p => getPatientAccessStatus(p.lastAccessAt).isRecent).length;
  }, [patients]);

  const activeWeekCount = React.useMemo(() => {
    return patients.filter(p => getPatientAccessStatus(p.lastAccessAt).status === "recent").length;
  }, [patients]);

  const inactiveCount = React.useMemo(() => {
    return patients.filter(p => {
      const s = getPatientAccessStatus(p.lastAccessAt).status;
      return s === "inactive" || s === "never";
    }).length;
  }, [patients]);

  const engagementRatio = React.useMemo(() => {
    if (patients.length === 0) return 0;
    return Math.round(((patients.length - inactiveCount) / patients.length) * 100);
  }, [patients, inactiveCount]);

  // Filtered patients for access tracking table
  const filteredAccessPatients = React.useMemo(() => {
    return patients.filter(p => {
      const accessStatus = getPatientAccessStatus(p.lastAccessAt);
      if (accessFilter === "today" && !accessStatus.isRecent) return false;
      if (accessFilter === "inactive" && accessStatus.status !== "inactive" && accessStatus.status !== "never") return false;
      if (accessSearchQuery.trim()) {
        const query = accessSearchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchNik = p.nik.toLowerCase().includes(query);
        const matchId = p.id.toLowerCase().includes(query);
        return matchName || matchNik || matchId;
      }
      return true;
    });
  }, [patients, accessFilter, accessSearchQuery]);

  // PCR Chart States & Calculations
  const [selectedChartPatientId, setSelectedChartPatientId] = React.useState<string>("all");
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  const getPcrChartData = (targetPatientId: string) => {
    let filteredExams = [];
    if (targetPatientId === "all") {
      filteredExams = exams.filter(e => e.objective.pcrScore !== undefined);
    } else {
      filteredExams = exams.filter(e => e.patientId === targetPatientId && e.objective.pcrScore !== undefined);
    }

    // Sort by date ascending
    const sorted = [...filteredExams].sort((a, b) => a.date.localeCompare(b.date));

    if (targetPatientId === "all") {
      const grouped: { [key: string]: { sum: number, count: number, details: any[] } } = {};
      sorted.forEach(e => {
        const monthKey = e.date.substring(0, 7); // "2026-04"
        if (!grouped[monthKey]) {
          grouped[monthKey] = { sum: 0, count: 0, details: [] };
        }
        if (e.objective.pcrScore !== undefined) {
          grouped[monthKey].sum += e.objective.pcrScore;
          grouped[monthKey].count += 1;
          grouped[monthKey].details.push(e);
        }
      });

      return Object.keys(grouped).sort().map(monthKey => {
        const avg = Number((grouped[monthKey].sum / grouped[monthKey].count).toFixed(1));
        const year = monthKey.split("-")[0];
        const monthNum = parseInt(monthKey.split("-")[1], 10);
        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
        return {
          month: `${months[monthNum - 1]} ${year}`,
          score: avg,
          count: grouped[monthKey].count,
          interpretation: avg < 10 ? "Baik" : "Buruk",
          label: `${avg}% (Rata-rata dari ${grouped[monthKey].count} pemeriksaan)`
        };
      });
    } else {
      return sorted.map(e => {
        const year = e.date.split("-")[0];
        const monthNum = parseInt(e.date.split("-")[1], 10);
        const day = e.date.split("-")[2];
        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
        const score = e.objective.pcrScore || 0;
        return {
          month: `${months[monthNum - 1]} ${year}`,
          date: `${day} ${months[monthNum - 1]}`,
          score: score,
          interpretation: e.objective.pcrInterpretation || (score < 10 ? "Baik" : "Buruk"),
          label: `${score}% (${e.objective.pcrPlaqueSurfacesCount || 0}/${(e.objective.pcrTeethCount || 28) * 4} permukaan berplak)`
        };
      });
    }
  };

  const getPcrSummaryStats = (targetPatientId: string) => {
    const data = getPcrChartData(targetPatientId);
    if (data.length === 0) return null;
    
    const latest = data[data.length - 1];
    const earliest = data[0];
    const diff = earliest.score - latest.score;
    const isImproved = diff > 0;
    
    const highest = Math.max(...data.map(d => d.score));
    const lowest = Math.min(...data.map(d => d.score));

    return {
      latestScore: latest.score,
      latestInterpretation: latest.interpretation,
      diff: Math.abs(Number(diff.toFixed(1))),
      isImproved,
      highest,
      lowest,
      recordsCount: data.length
    };
  };

  const renderPcrChartComponent = (targetPatientId: string) => {
    const chartData = getPcrChartData(targetPatientId);
    
    if (chartData.length === 0) {
      return (
        <div className="h-44 bg-pink-50/10 border border-dashed border-pink-150 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
          <Activity size={28} className="text-pink-300 mb-2 animate-pulse" />
          <p className="text-xs font-bold text-pink-900 uppercase">Belum Ada Data Plaque Control Record</p>
          <p className="text-[11px] text-gray-500 mt-1 max-w-xs">
            Lakukan pemeriksaan baru pada tab SOAP dengan mengisi skor PCR pasien untuk melihat analisis visual di sini.
          </p>
        </div>
      );
    }

    const height = 180;
    const width = 500;
    const paddingLeft = 40;
    const paddingRight = 30;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const maxVal = Math.max(...chartData.map(d => d.score), 20);
    const yLimit = Math.ceil(maxVal / 10) * 10;

    const getCoords = (i: number, score: number) => {
      const x = chartData.length > 1 
        ? paddingLeft + (i * chartWidth) / (chartData.length - 1) 
        : paddingLeft + chartWidth / 2;
      const y = paddingTop + chartHeight - (score / yLimit) * chartHeight;
      return { x, y };
    };

    let linePath = "";
    let areaPath = "";
    if (chartData.length > 1) {
      linePath = chartData.map((d, i) => {
        const { x, y } = getCoords(i, d.score);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      }).join(' ');

      const firstX = getCoords(0, 0).x;
      const lastX = getCoords(chartData.length - 1, 0).x;
      areaPath = `${linePath} L ${lastX} ${paddingTop + chartHeight} L ${firstX} ${paddingTop + chartHeight} Z`;
    }

    const targetY = paddingTop + chartHeight - (10 / yLimit) * chartHeight;

    return (
      <div className="relative">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-auto overflow-visible select-none font-sans"
        >
          <defs>
            <linearGradient id="pcr-area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EC4899" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const scoreVal = Math.round(ratio * yLimit);
            const y = paddingTop + chartHeight - ratio * chartHeight;
            return (
              <g key={idx} className="opacity-40">
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width - paddingRight} 
                  y2={y} 
                  stroke="#E5E7EB" 
                  strokeWidth="1" 
                  strokeDasharray="3 3"
                />
                <text 
                  x={paddingLeft - 8} 
                  y={y + 3.5} 
                  textAnchor="end" 
                  className="text-[9px] fill-gray-400 font-mono font-semibold"
                >
                  {scoreVal}%
                </text>
              </g>
            );
          })}

          {/* Target Line at 10% */}
          {targetY >= paddingTop && targetY <= paddingTop + chartHeight && (
            <g>
              <line 
                x1={paddingLeft} 
                y1={targetY} 
                x2={width - paddingRight} 
                y2={targetY} 
                stroke="#10B981" 
                strokeWidth="1.5" 
                strokeDasharray="4 2"
                className="opacity-70"
              />
              <text 
                x={width - paddingRight - 4} 
                y={targetY - 4} 
                textAnchor="end" 
                className="text-[8px] fill-emerald-600 font-bold tracking-wider"
              >
                Target Higiene Baik (&lt; 10%)
              </text>
            </g>
          )}

          {/* Area */}
          {chartData.length > 1 && areaPath && (
            <path 
              d={areaPath} 
              fill="url(#pcr-area-grad)" 
            />
          )}

          {/* Main line */}
          {chartData.length > 1 && linePath && (
            <path 
              d={linePath} 
              fill="none" 
              stroke="#EC4899" 
              strokeWidth="3" 
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            />
          )}

          {/* Hover tracker line */}
          {hoveredIdx !== null && chartData[hoveredIdx] !== undefined && (
            <line 
              x1={getCoords(hoveredIdx, chartData[hoveredIdx].score).x}
              y1={paddingTop}
              x2={getCoords(hoveredIdx, chartData[hoveredIdx].score).x}
              y2={paddingTop + chartHeight}
              stroke="#EC4899"
              strokeWidth="1"
              strokeDasharray="3 3"
              className="opacity-60"
            />
          )}

          {/* Nodes */}
          {chartData.map((d, i) => {
            const { x, y } = getCoords(i, d.score);
            const isHovered = hoveredIdx === i;
            const isGood = d.score < 10;
            return (
              <g key={i} className="cursor-pointer">
                <circle 
                  cx={x} 
                  cy={y} 
                  r="12" 
                  fill="transparent" 
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
                <circle 
                  cx={x} 
                  cy={y} 
                  r={isHovered ? "6" : "4"} 
                  fill={isGood ? "#10B981" : "#EC4899"} 
                  stroke="#FFFFFF" 
                  strokeWidth="2"
                  className="transition-all duration-150 ease-out shadow-sm"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
                <text 
                  x={x} 
                  y={y - (isHovered ? 12 : 8)} 
                  textAnchor="middle" 
                  className={`text-[9px] font-black ${isGood ? 'fill-emerald-700' : 'fill-pink-700'} transition-all`}
                >
                  {d.score}%
                </text>
              </g>
            );
          })}

          {/* X Labels */}
          {chartData.map((d, i) => {
            const { x } = getCoords(i, 0);
            return (
              <text 
                key={i} 
                x={x} 
                y={paddingTop + chartHeight + 16} 
                textAnchor="middle" 
                className="text-[9px] fill-gray-500 font-bold"
              >
                {d.month}
              </text>
            );
          })}
        </svg>

        {hoveredIdx !== null && chartData[hoveredIdx] !== undefined && (
          <div 
            className="absolute z-10 bg-gray-900/95 text-white p-3 rounded-xl shadow-xl border border-gray-800 text-[10px] space-y-1 backdrop-blur-sm pointer-events-none transition-all"
            style={{
              left: `${Math.max(10, Math.min(90, (getCoords(hoveredIdx, chartData[hoveredIdx].score).x / width) * 100))}%`,
              top: `${Math.max(0, (getCoords(hoveredIdx, chartData[hoveredIdx].score).y / height) * 100 - 35)}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="flex justify-between items-center gap-4 border-b border-gray-700 pb-1">
              <span className="font-bold text-gray-300">{chartData[hoveredIdx].month}</span>
              <span className={`px-1.5 py-0.2 rounded-full font-black text-[8px] uppercase tracking-wider ${
                chartData[hoveredIdx].interpretation === "Baik" 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                  : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
              }`}>
                Higiene {chartData[hoveredIdx].interpretation}
              </span>
            </div>
            <div className="space-y-0.5">
              <p className="font-bold text-gray-100">
                Skor PCR: <span className="text-pink-400 text-xs">{chartData[hoveredIdx].score}%</span>
              </p>
              <p className="text-gray-400 leading-tight">
                {chartData[hoveredIdx].label}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleSendWaReminder = (patient: Patient) => {
    const cleanPhone = (patient.phone || "").replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;
    const msg = `Halo ${patient.name}, kami dari klinik ortodonsia ingin mengingatkan Anda untuk mengecek perkembangan behel dan mengisi buku harian perawatan gigi Anda di aplikasi Orthodontic Care. Kepatuhan Anda sangat menentukan keberhasilan dan kecepatan perawatan kawat gigi Anda. Terima kasih!`;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const renderAuditTrailModal = () => {
    if (!auditModalPatientId) return null;
    
    const targetPatient = auditModalPatientId === "all" ? null : patients.find(p => p.id === auditModalPatientId);
    const logsToShow = auditModalPatientId === "all" 
      ? accessLogs 
      : accessLogs.filter(l => l.patientId === auditModalPatientId);

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
          {/* Modal Header */}
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                <History size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {targetPatient ? `Audit Trail Akses: ${targetPatient.name}` : "Audit Trail Semua Akses & Aktivitas Pasien"}
                </h3>
                <p className="text-xs text-gray-500">
                  {targetPatient 
                    ? `ID: ${targetPatient.id} • Total Kunjungan: ${targetPatient.accessCount || logsToShow.length} kali`
                    : `Menampilkan seluruh riwayat akses (${logsToShow.length} log interaksi)`
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => setAuditModalPatientId(null)}
              className="w-8 h-8 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Filter Bar in modal */}
          <div className="p-4 border-b border-gray-100 flex flex-wrap gap-2 items-center justify-between bg-white text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">Pilih Pasien:</span>
              <select
                value={auditModalPatientId}
                onChange={(e) => setAuditModalPatientId(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:outline-none focus:border-pink-500"
              >
                <option value="all">Semua Pasien ({accessLogs.length} Log)</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>
            <span className="text-[11px] text-gray-400 font-medium">
              Menampilkan {logsToShow.length} rekaman audit trail
            </span>
          </div>

          {/* Modal Log List */}
          <div className="p-4 overflow-y-auto space-y-2 flex-1 max-h-[55vh]">
            {logsToShow.length === 0 ? (
              <div className="py-12 text-center text-gray-400 space-y-2">
                <ShieldCheck size={36} className="mx-auto text-gray-300" />
                <p className="text-sm font-medium">Belum ada catatan aktivitas untuk filter ini</p>
                <p className="text-xs text-gray-400">Aktivitas pasien akan otomatis dicatat saat membuka aplikasi atau memperbarui modul.</p>
              </div>
            ) : (
              logsToShow.map((log) => {
                const pat = patients.find(p => p.id === log.patientId);
                const relTime = formatRelativeTime(log.timestamp);
                const fullTime = formatFullIndoDateTime(log.timestamp);
                return (
                  <div key={log.id} className="p-3 bg-gray-50 hover:bg-pink-50/40 rounded-xl border border-gray-100 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 sm:mt-0">
                        {pat ? pat.name.charAt(0) : "P"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900">{log.patientName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600 font-mono">
                            {log.patientId}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-pink-50 border border-pink-200 text-pink-700 font-semibold">
                            {log.module}
                          </span>
                        </div>
                        <p className="text-gray-600 text-[11px] mt-0.5">
                          Aksi: <span className="font-medium text-gray-800">{log.action}</span>
                          {log.details ? ` • ${log.details}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 sm:pl-4 border-t sm:border-t-0 pt-1 sm:pt-0 border-gray-100 flex sm:flex-col justify-between items-end">
                      <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                        {log.device === "mobile" ? <Smartphone size={12} className="text-pink-500" /> : <Monitor size={12} className="text-blue-500" />}
                        <span className="font-medium text-gray-700">{relTime}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono" title={fullTime}>
                        {fullTime}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
            <button
              onClick={() => setAuditModalPatientId(null)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (role === "dentist") {
    return (
      <div className="space-y-6" id="dentist-dashboard-root">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Klinis Ortodonsia</h1>
            <p className="text-sm text-gray-500">Sistem Pemantauan Rekam Medis Elektronik (RME) Terintegrasi</p>
          </div>
          <div className="bg-pink-50 border border-pink-200 rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-pink-800">Koneksi SATUSEHAT Kemenkes RME Aktif</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-500 font-medium">Total Pasien Aktif</span>
              <p className="text-2xl font-bold text-gray-900">{activePatientCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
              <Users size={24} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-500 font-medium">Total Riwayat Pemeriksaan</span>
              <p className="text-2xl font-bold text-gray-900">{totalExamsCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <FileText size={24} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-500 font-medium">Rata-rata Kepatuhan</span>
              <p className="text-2xl font-bold text-gray-900">{averageCompliance}%</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Activity size={24} />
            </div>
          </div>
        </div>

        {/* PCR Monthly Distribution Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4" id="pcr-distribution-section-dentist">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Activity className="text-pink-600 animate-pulse" size={18} />
                Distribusi Plaque Control Record (PCR) Setiap Bulannya
              </h2>
              <p className="text-xs text-gray-500">
                Laporan perkembangan indeks kebersihan mulut (O&apos;Leary Plaque Index) secara berkala dan perbaikan klinis bulanan
              </p>
            </div>
            {/* Control Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider shrink-0">Pilih Pasien:</span>
              <select
                value={selectedChartPatientId}
                onChange={(e) => setSelectedChartPatientId(e.target.value)}
                className="text-xs font-bold border border-pink-100 bg-pink-50/50 hover:bg-pink-50 focus:bg-white text-pink-900 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-400 cursor-pointer transition-all"
              >
                <option value="all">Rata-rata Semua Pasien</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SVG Graph Container */}
            <div className="lg:col-span-2 bg-gradient-to-b from-gray-50/50 to-white p-4 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-pink-950 uppercase tracking-wider bg-pink-100/60 px-2.5 py-1 rounded-full">
                  Visualisasi Tren Plak Gigi
                </span>
                <span className="text-[10px] text-gray-400 font-medium font-mono">
                  Sumbu Y: % Permukaan Berplak | Sumbu X: Kunjungan Bulanan
                </span>
              </div>
              {renderPcrChartComponent(selectedChartPatientId)}
            </div>

            {/* Analysis Sidebar */}
            <div className="space-y-4 flex flex-col justify-between">
              {(() => {
                const stats = getPcrSummaryStats(selectedChartPatientId);
                if (!stats) {
                  return (
                    <div className="bg-gray-50 p-4 rounded-2xl h-full flex items-center justify-center text-center text-xs text-gray-400 font-medium italic">
                      Tidak ada data ringkasan untuk pilihan ini.
                    </div>
                  );
                }

                return (
                  <div className="bg-gradient-to-br from-pink-50/20 to-rose-50/10 p-5 rounded-2xl border border-pink-100/30 h-full flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <span className="text-[9px] font-black text-pink-800 uppercase tracking-wider block">Ringkasan Analisis Klinis</span>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                          <span className="text-[9px] text-gray-400 font-bold block">Skor Terakhir</span>
                          <p className="text-xl font-black text-gray-800">{stats.latestScore}%</p>
                          <span className={`inline-block text-[8px] font-black px-1.5 py-0.2 rounded-full mt-1 border ${
                            stats.latestInterpretation === "Baik" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                              : "bg-rose-50 text-rose-700 border-rose-100"
                          }`}>
                            Higiene {stats.latestInterpretation}
                          </span>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] text-gray-400 font-bold block">Perubahan Plak</span>
                            <p className={`text-xl font-black ${stats.isImproved ? "text-emerald-600" : "text-amber-600"}`}>
                              {stats.isImproved ? "↓" : "↑"} {stats.diff}%
                            </p>
                          </div>
                          <span className="text-[8px] text-gray-400 font-semibold block mt-1 leading-tight">
                            {stats.isImproved ? "Peningkatan Kebersihan" : "Fluktuasi Plak"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[10px] text-gray-600">
                          <span className="font-medium">Skor Tertinggi:</span>
                          <span className="font-bold text-gray-800 font-mono">{stats.highest}%</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-600">
                          <span className="font-medium">Skor Terendah:</span>
                          <span className="font-bold text-gray-800 font-mono">{stats.lowest}%</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-600">
                          <span className="font-medium">Total Kunjungan Tercatat:</span>
                          <span className="font-bold text-gray-800 font-mono">{stats.recordsCount} kali</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-pink-100/50 pt-3 space-y-2">
                      <div className="flex items-start gap-1.5">
                        <Award size={15} className="text-pink-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-[10px] font-bold text-pink-900 uppercase">Rekomendasi Kontrol Orto</h4>
                          <p className="text-[10px] text-gray-500 leading-normal mt-0.5">
                            {stats.latestScore >= 10 
                              ? "Berikan konseling teknik sikat gigi ortodontik sela, obat kumur antiseptik, dan pantau melalui log harian pasien di tab monitoring."
                              : "Higiene sangat baik! Pertahankan pola menyikat gigi 3x sehari dan lanjutkan tahap perawatan selanjutnya."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Section: Pelacak Akses & Keaktifan Pasien (Real-Time Tracker) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5" id="patient-access-tracker-section">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Radio className="text-emerald-500 animate-pulse" size={18} />
                Pelacak Akses &amp; Keaktifan Pasien (Real-Time Tracker)
              </h2>
              <p className="text-xs text-gray-500">
                Pantau langsung kepatuhan pasien membuka aplikasi, mengisi buku harian orto, dan membaca materi edukasi behel.
              </p>
            </div>

            <button
              onClick={() => setAuditModalPatientId("all")}
              className="px-3.5 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
            >
              <History size={14} />
              <span>Audit Trail Lengkap ({accessLogs.length} Log)</span>
            </button>
          </div>

          {/* 4 Summary Indicator Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Aktif Hari Ini</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <p className="text-xl font-extrabold text-emerald-950">{activeTodayCount} <span className="text-xs font-medium text-emerald-700">/ {patients.length} Pasien</span></p>
              <p className="text-[10px] text-emerald-700 leading-tight">Mengakses aplikasi dalam 24 jam</p>
            </div>

            <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Aktif Minggu Ini</span>
                <Clock size={12} className="text-blue-500" />
              </div>
              <p className="text-xl font-extrabold text-blue-950">{activeWeekCount} <span className="text-xs font-medium text-blue-700">Pasien</span></p>
              <p className="text-[10px] text-blue-700 leading-tight">Terakhir online 2–7 hari lalu</p>
            </div>

            <div className="p-3.5 bg-rose-50/60 border border-rose-100 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider">Perlu Diingatkan</span>
                <AlertCircle size={12} className="text-rose-500" />
              </div>
              <p className="text-xl font-extrabold text-rose-950">{inactiveCount} <span className="text-xs font-medium text-rose-700">Pasien</span></p>
              <p className="text-[10px] text-rose-700 leading-tight">Pasif &gt;7 hari atau belum pernah buka</p>
            </div>

            <div className="p-3.5 bg-purple-50/60 border border-purple-100 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">Keterlibatan Pasien</span>
                <TrendingUp size={12} className="text-purple-500" />
              </div>
              <p className="text-xl font-extrabold text-purple-950">{engagementRatio}%</p>
              <p className="text-[10px] text-purple-700 leading-tight">Rasio pasien aktif memantau behel</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl self-stretch sm:self-auto text-xs">
              <button
                type="button"
                onClick={() => setAccessFilter("all")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  accessFilter === "all" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Semua ({patients.length})
              </button>
              <button
                type="button"
                onClick={() => setAccessFilter("today")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  accessFilter === "today" ? "bg-white text-emerald-700 shadow-xs" : "text-gray-600 hover:text-emerald-700"
                }`}
              >
                Aktif Hari Ini ({activeTodayCount})
              </button>
              <button
                type="button"
                onClick={() => setAccessFilter("inactive")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  accessFilter === "inactive" ? "bg-white text-rose-700 shadow-xs" : "text-gray-600 hover:text-rose-700"
                }`}
              >
                Perlu Diingatkan ({inactiveCount})
              </button>
            </div>

            <div className="relative self-stretch sm:w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
              <input
                type="text"
                value={accessSearchQuery}
                onChange={(e) => setAccessSearchQuery(e.target.value)}
                placeholder="Cari pasien / NIK / ID..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-all"
              />
            </div>
          </div>

          {/* Patient Access Table / Cards */}
          <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
            {filteredAccessPatients.length === 0 ? (
              <div className="py-8 text-center text-gray-400 space-y-1">
                <p className="text-xs font-semibold">Tidak ada pasien yang sesuai filter</p>
              </div>
            ) : (
              filteredAccessPatients.map((pat) => {
                const statusInfo = getPatientAccessStatus(pat.lastAccessAt);
                const relTime = formatRelativeTime(pat.lastAccessAt);
                const fullTime = formatFullIndoDateTime(pat.lastAccessAt);
                const totalSessions = pat.accessCount || 0;

                return (
                  <div key={pat.id} className="p-3.5 hover:bg-gray-50/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    {/* Patient identity */}
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {pat.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{pat.name}</span>
                          <span className="text-[10px] text-gray-400 font-mono">({pat.id})</span>
                        </div>
                        <p className="text-[11px] text-gray-500">NIK: {pat.nik} • WA: {pat.phone}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${statusInfo.badgeClass}`}>
                        <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`}></span>
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Access time & action */}
                    <div className="space-y-0.5 min-w-[180px]">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Clock size={12} className="text-gray-400" />
                        <span className="font-semibold">{relTime}</span>
                        <span className="text-[10px] text-gray-400">({fullTime.split(", ")[1] || fullTime})</span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate max-w-xs">
                        Aksi: <span className="font-medium text-pink-600">{pat.lastAccessAction || "Belum ada aktivitas tercatat"}</span>
                      </p>
                    </div>

                    {/* Total Visits */}
                    <div className="text-left md:text-center min-w-[90px]">
                      <span className="text-[10px] text-gray-400 block font-semibold">Total Sesi</span>
                      <span className="font-mono font-bold text-gray-800 text-xs">{totalSessions} kali</span>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setAuditModalPatientId(pat.id)}
                        className="px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-pink-300 hover:bg-pink-50/50 text-gray-700 hover:text-pink-700 font-medium text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                        title="Lihat riwayat lengkap interaksi pasien ini"
                      >
                        <Eye size={12} />
                        <span>Riwayat</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSendWaReminder(pat)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-semibold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                        title="Kirim pesan pengingat WA ramah untuk mengecek behel"
                      >
                        <MessageCircle size={12} className="text-emerald-600" />
                        <span>Kirim WA</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Middle Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Patients List */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Pemantauan Pasien Terkini</h2>
                <p className="text-xs text-gray-500">Pilih pasien untuk melihat detail rekam medis orto</p>
              </div>
              <button 
                onClick={() => onNavigate("rekam-medis")} 
                className="text-xs text-pink-600 font-semibold hover:underline flex items-center gap-1"
              >
                Lihat Semua <ChevronRight size={14} />
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {patients.map((pat) => {
                const latestExam = exams.filter(e => e.patientId === pat.id).sort((a, b) => b.date.localeCompare(a.date))[0];
                const latestLog = logs.filter(l => l.patientId === pat.id).sort((a, b) => b.date.localeCompare(a.date))[0];
                const score = latestLog ? calculateLogScore(latestLog) : 85;
                const comp = getComplianceStatus(score);
                const accessStatus = getPatientAccessStatus(pat.lastAccessAt);

                return (
                  <div 
                    key={pat.id} 
                    onClick={() => { onSelectPatient(pat.id); onNavigate("rekam-medis"); }}
                    className="py-3 flex items-center justify-between hover:bg-gray-50 rounded-lg p-2 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                        {pat.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{pat.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500">NIK: {pat.nik}</span>
                          <span className="text-gray-300">•</span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-gray-500">
                            <span className={`w-1.5 h-1.5 rounded-full ${accessStatus.dotClass}`}></span>
                            {accessStatus.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-medium text-gray-700">Tahap Kontrol</p>
                        <p className="text-xs text-pink-600 font-semibold">
                          {latestExam ? latestExam.plan.treatmentStage : "Inisiasi"}
                        </p>
                      </div>

                      <span className={`text-xs px-2.5 py-1 rounded-full border ${comp.color}`}>
                        {comp.label} ({score}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clinical Notifications & Reminders */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Pemberitahuan Klinis</h2>
            
            <div className="space-y-3">
              {urgentTicketsCount > 0 ? (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex gap-3">
                  <AlertCircle className="text-rose-500 shrink-0" size={18} />
                  <div>
                    <h4 className="text-xs font-bold text-rose-800">Keluhan Nyeri Ekstrem</h4>
                    <p className="text-xs text-rose-700 mt-1">Siti Rahmawati mendeteksi skor nyeri {logs.find(l => l.painLevel >= 8)?.painLevel}/10 hari ini. Perlu evaluasi wire.</p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3">
                  <CheckCircle className="text-emerald-500 shrink-0" size={18} />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-800">Kondisi Aman</h4>
                    <p className="text-xs text-emerald-700 mt-1">Tidak ada laporan nyeri ekstrem atau kedaruratan dari pasien dalam 24 jam terakhir.</p>
                  </div>
                </div>
              )}

              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                <Clock className="text-amber-500 shrink-0" size={18} />
                <div>
                  <h4 className="text-xs font-bold text-amber-800">Jadwal Pengiriman Data RME</h4>
                  <p className="text-xs text-amber-700 mt-1">Sinkronisasi batch RME ortodonsia berikutnya ke SatuSehat dijadwalkan pukul 23:59 WIB.</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                <Calendar className="text-blue-500 shrink-0" size={18} />
                <div>
                  <h4 className="text-xs font-bold text-blue-800">Kontrol Mingguan</h4>
                  <p className="text-xs text-blue-700 mt-1">Ada 2 jadwal konsultasi orto rutin untuk besok hari Senin, 13 Juli 2026.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="border-t border-gray-100 pt-3">
                <span className="text-xs font-bold text-gray-700 block mb-1">Pedoman RME Kemenkes</span>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Sesuai Peraturan Menteri Kesehatan (PMK) No. 24 Tahun 2022, setiap data pemeriksaan klinis gigi wajib dicatat secara elektronik menggunakan modul SOAP &amp; terdokumentasi rapi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Trail Modal */}
        {renderAuditTrailModal()}
      </div>
    );
  }

  // Patient Dashboard View
  const lastPatientExam = exams.filter(e => e.patientId === selectedPatientId).sort((a, b) => b.date.localeCompare(a.date))[0];
  const lastPatientLog = patientLogs.sort((a, b) => b.date.localeCompare(a.date))[0];
  const todayScore = lastPatientLog ? calculateLogScore(lastPatientLog) : 75;
  const currentComp = getComplianceStatus(todayScore);

  // Generate Control Reminder info based on next visit date inputted by dentist
  const controlReminder = React.useMemo(() => {
    if (!lastPatientExam || !lastPatientExam.plan.nextVisitDate) {
      return {
        status: "none",
        message: "Belum Ada Jadwal Kontrol Rutin",
        subtext: "Jadwal kontrol berikutnya belum diinput oleh Dokter Gigi Anda. Dokter Gigi biasanya memasukkan jadwal kontrol baru setelah mengisi evaluasi RME/SOAP.",
        colorClass: "bg-gray-50 border-gray-200 text-gray-700",
        badgeColor: "bg-gray-200 text-gray-850 border-transparent",
        badgeText: "Belum Dijadwalkan"
      };
    }

    const nextDateStr = lastPatientExam.plan.nextVisitDate; // YYYY-MM-DD
    const today = new Date("2026-07-12T00:00:00"); // Dynamic standard local date from environment
    const nextDate = new Date(nextDateStr + "T00:00:00");

    if (isNaN(nextDate.getTime())) {
      return {
        status: "info",
        message: `Jadwal Kontrol Selanjutnya: ${nextDateStr}`,
        subtext: `Anda memiliki instruksi kontrol dari drg. ${lastPatientExam.dentistName || "Spesialis Ortodonti"}. Silakan hubungi klinik untuk informasi lebih lanjut.`,
        colorClass: "bg-blue-50 border-blue-150 text-blue-900",
        badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
        badgeText: "Info Kontrol"
      };
    }

    // Reset hours to compare dates cleanly
    today.setHours(0,0,0,0);
    nextDate.setHours(0,0,0,0);

    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return {
        status: "today",
        message: "HARI INI ADALAH JADWAL KONTROL BEHEL ANDA! 📅",
        subtext: `Sesuai rencana perawatan drg. ${lastPatientExam.dentistName || "Spesialis Ortodonti"} (Tahap: ${lastPatientExam.plan.treatmentStage}), Anda dijadwalkan kontrol hari ini, 12 Juli 2026. Jangan lewatkan untuk menjaga pergerakan gigi tetap optimal!`,
        colorClass: "bg-gradient-to-r from-rose-50 to-pink-50 border-pink-200 text-pink-950 shadow-sm",
        badgeColor: "bg-pink-600 text-white border-pink-600 font-bold animate-pulse",
        badgeText: "KONTROL HARI INI"
      };
    } else if (diffDays === 1) {
      return {
        status: "tomorrow",
        message: "PENGINGAT: Besok Jadwal Kontrol Rutin Anda! ⏰",
        subtext: `Kunjungan kontrol gigi Anda dijadwalkan besok pada tanggal ${nextDateStr}. Mohon mempersiapkan diri dan melakukan konfirmasi kedatangan ke klinik.`,
        colorClass: "bg-amber-50 border-amber-200 text-amber-900 shadow-xs",
        badgeColor: "bg-amber-500 text-white border-amber-500 font-bold",
        badgeText: "BESOK"
      };
    } else if (diffDays > 1) {
      return {
        status: "upcoming",
        message: `Jadwal Kontrol Rutin: ${diffDays} Hari Lagi`,
        subtext: `drg. ${lastPatientExam.dentistName || "Spesialis Ortodonti"} menginstruksikan kontrol berikutnya pada tanggal ${nextDateStr} (Tahap: ${lastPatientExam.plan.treatmentStage}). Pastikan menjaga kebersihan gigi & memantau PCR Anda!`,
        colorClass: "bg-pink-50/60 border-pink-100 text-pink-950",
        badgeColor: "bg-pink-100 text-pink-700 border-pink-200",
        badgeText: `${diffDays} Hari Lagi`
      };
    } else {
      const absDays = Math.abs(diffDays);
      return {
        status: "overdue",
        message: `PERHATIAN: Jadwal Kontrol Terlewat ${absDays} Hari! ⚠️`,
        subtext: `Rencana kontrol gigi Anda sebelumnya dijadwalkan pada tanggal ${nextDateStr}. Keterlambatan kontrol dapat memperlambat proses perawatan atau merusak bracket. Harap segera hubungi klinik untuk reschedule!`,
        colorClass: "bg-rose-50 border-rose-200 text-rose-950 shadow-xs",
        badgeColor: "bg-rose-600 text-white border-rose-600 font-bold",
        badgeText: `Terlewat ${absDays} Hari`
      };
    }
  }, [lastPatientExam]);

  return (
    <div className="space-y-6" id="patient-dashboard-root">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-400 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm">
            Mode Pasien: {currentPatient?.name || "Pasien"}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Perjalanan Senyum Indahmu</h1>
          <p className="text-sm text-pink-50/90 max-w-xl">
            {lastPatientExam 
              ? `Saat ini Anda dalam tahap "${lastPatientExam.plan.treatmentStage}". Ikuti petunjuk sikat gigi dan pantau kepatuhan Anda setiap hari.` 
              : "Selamat datang di Orthodontic-Care! Silakan isi pemantauan kepatuhan harian Anda agar perawatan berjalan optimal."}
          </p>
        </div>
        <div className="absolute right-4 -bottom-4 opacity-10 pointer-events-none">
          <Smile size={180} />
        </div>
      </div>

      {/* Control Reminder Card */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center transition-all ${controlReminder.colorClass}`}>
        <div className="flex gap-3.5 items-start">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            controlReminder.status === 'today' || controlReminder.status === 'overdue' 
              ? 'bg-rose-100 text-rose-600' 
              : controlReminder.status === 'tomorrow' 
              ? 'bg-amber-100 text-amber-600' 
              : 'bg-pink-100 text-pink-600'
          }`}>
            <Clock size={20} className={controlReminder.status === 'today' ? 'animate-bounce' : ''} />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-black tracking-tight">{controlReminder.message}</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${controlReminder.badgeColor}`}>
                {controlReminder.badgeText}
              </span>
            </div>
            <p className="text-xs opacity-90 leading-relaxed max-w-3xl">{controlReminder.subtext}</p>
          </div>
        </div>
        {controlReminder.status !== "none" && (
          <button 
            onClick={() => onNavigate("helpdesk")}
            className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 rounded-xl shadow-xs transition-all shrink-0 cursor-pointer self-stretch sm:self-auto text-center"
          >
            Hubungi Admin / Reschedule
          </button>
        )}
      </div>

      {/* PCR Trend Section for Patient */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4" id="pcr-distribution-section-patient">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Activity className="text-pink-600 animate-pulse" size={18} />
            Indeks Plak Gigi (Plaque Control Record) Anda setiap Bulan
          </h2>
          <p className="text-xs text-gray-500">
            Lihat perkembangan kebersihan gigi Anda. Semakin kecil persentase plak, gusi semakin sehat dan pergerakan behel semakin lancar!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gradient-to-b from-pink-50/5 to-white p-4 rounded-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-pink-900 uppercase tracking-wider bg-pink-100/50 px-2.5 py-1 rounded-full">
                Grafik Kebersihan Gigi Anda
              </span>
              <span className="text-[10px] text-gray-400 font-medium">
                Makin Rendah Makin Baik (Target: &lt; 10%)
              </span>
            </div>
            {renderPcrChartComponent(selectedPatientId)}
          </div>

          <div className="bg-pink-50/30 p-5 rounded-2xl border border-pink-100/50 flex flex-col justify-between space-y-4">
            {(() => {
              const stats = getPcrSummaryStats(selectedPatientId);
              if (!stats) {
                return (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <Award size={24} className="text-gray-300 mb-1" />
                    <p className="text-xs text-gray-400 italic">Belum ada riwayat Plaque Control Record.</p>
                  </div>
                );
              }

              return (
                <div className="h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="text-[9px] font-black text-pink-800 uppercase tracking-wider block">Status Plak Terbaru</span>
                    
                    <div className="bg-white p-4 rounded-xl border border-pink-100/50 shadow-sm text-center">
                      <p className="text-xs text-gray-400 font-bold">Skor Plak Terakhir Anda</p>
                      <p className="text-3xl font-black text-gray-800 my-1">{stats.latestScore}%</p>
                      <span className={`inline-block text-[9px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                        stats.latestInterpretation === "Baik" 
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
                          : "bg-rose-100 text-rose-800 border-rose-200"
                      }`}>
                        Kebersihan {stats.latestInterpretation}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-500 leading-relaxed text-center">
                      {stats.isImproved 
                        ? `Selamat! Plak gigi Anda berkurang sebesar ${stats.diff}% sejak kunjungan awal. Gigi Anda jadi lebih bersih!`
                        : `Ayo tingkatkan kebersihan gigimu! Ada perubahan plak sekitar ${stats.diff}%.`}
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-pink-100/20 text-xs text-gray-600 space-y-1.5">
                    <span className="font-bold text-pink-900 block mb-1">Tips Mengurangi Plak Behel:</span>
                    <div className="flex gap-1.5 text-[10px]">
                      <span className="text-emerald-500 font-bold">✔</span>
                      <span>Sikat gigi 3x sehari setelah makan & sebelum tidur.</span>
                    </div>
                    <div className="flex gap-1.5 text-[10px]">
                      <span className="text-emerald-500 font-bold">✔</span>
                      <span>Gunakan sikat gigi sela (interdental) untuk sela bracket.</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Compliance Circle */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Skor Kepatuhan Hari Ini</h3>
            <p className="text-xs text-gray-400 mt-0.5">Berdasarkan pemantauan harian Anda</p>
          </div>
          
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#F3F4F6"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#EC4899"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * todayScore) / 100}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-gray-800">{todayScore}</span>
              <span className="text-[10px] text-gray-500 font-bold">dari 100</span>
            </div>
          </div>

          <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${currentComp.color}`}>
            {currentComp.label}
          </span>
        </div>

        {/* Next Control Info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600">
                  <Calendar size={18} />
                </div>
                <h3 className="text-sm font-bold text-gray-700">Kontrol Berikutnya</h3>
              </div>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${controlReminder.badgeColor}`}>
                {controlReminder.badgeText}
              </span>
            </div>
            
            <div className="p-3 bg-pink-50/50 rounded-xl space-y-2">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tanggal Perjanjian</p>
                <p className="text-lg font-extrabold text-pink-950">
                  {lastPatientExam ? lastPatientExam.plan.nextVisitDate : "Belum Dijadwalkan"}
                </p>
              </div>
              <div className="border-t border-pink-100/40 pt-1.5 flex justify-between text-[11px]">
                <span className="text-gray-500">Dokter Gigi:</span>
                <span className="font-bold text-pink-900">{lastPatientExam ? lastPatientExam.dentistName : "-"}</span>
              </div>
              {lastPatientExam && (
                <div className="text-[10px] text-gray-500 italic bg-white/70 p-1.5 rounded border border-pink-100/20">
                  <span className="font-bold text-pink-800 block not-italic">Rencana Prosedur:</span>
                  {lastPatientExam.plan.procedure || "Pemeriksaan rutin behel"}
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => onNavigate("helpdesk")} 
            className="w-full bg-pink-500 hover:bg-pink-600 text-white text-xs py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            Hubungi Klinik / reschedule
          </button>
        </div>

        {/* Interactive Tips */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Award size={18} />
              </div>
              <h3 className="text-sm font-bold text-gray-700">Misi Kebersihan Gigi</h3>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-4 h-4 rounded bg-emerald-100 flex items-center justify-center text-emerald-700 text-[10px] font-bold">v</div>
                <span>Sikat gigi setelah sarapan</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-4 h-4 rounded bg-emerald-100 flex items-center justify-center text-emerald-700 text-[10px] font-bold">v</div>
                <span>Bersihkan behel setelah makan siang</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-4 h-4 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-[10px]"></div>
                <span>Gunakan dental wax jika terasa tajam</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-500" />
            <span className="text-[11px] text-gray-500">Kepatuhan Anda meningkat 8% dibanding minggu lalu!</span>
          </div>
        </div>
      </div>

      {/* Shortcuts & Educations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Tasks Check-in */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-800">Aktivitas Pemantauan Harian</h3>
            <button 
              onClick={() => onNavigate("monitoring")}
              className="text-xs text-pink-600 font-semibold hover:underline"
            >
              Log Aktivitas
            </button>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Catat pemakaian behel/aligner, frekuensi sikat gigi, obat kumur, dan rasa nyeri Anda setiap hari agar dokter gigi dapat memantau perkembangan perawatan Anda secara remote.
          </p>
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="p-3 bg-gray-50 rounded-xl text-center">
              <span className="text-lg font-bold text-gray-700">
                {lastPatientLog ? `${lastPatientLog.brushedCount}x` : "0x"}
              </span>
              <p className="text-[10px] text-gray-400 font-semibold mt-1">Sikat Gigi</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl text-center">
              <span className="text-lg font-bold text-gray-700">
                {lastPatientLog ? `${lastPatientLog.painLevel}/10` : "-"}
              </span>
              <p className="text-[10px] text-gray-400 font-semibold mt-1">Skor Nyeri</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl text-center">
              <span className="text-lg font-bold text-gray-700">
                {lastPatientLog?.waxUsed ? "Ya" : "Tidak"}
              </span>
              <p className="text-[10px] text-gray-400 font-semibold mt-1">Lilin Dental</p>
            </div>
          </div>
        </div>

        {/* AI Assistant Quick Entry */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-pink-600">
              <Smile size={18} />
              <h3 className="text-sm font-bold text-gray-800">Konsultasi Darurat AI Kemenkes</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Kawat behel menusuk pipi? Bracket lepas? Gigi terasa sangat ngilu? Tanyakan pertolongan pertama yang aman kepada Asisten AI kami yang terlatih sesuai pedoman Kemenkes RI.
            </p>
          </div>
          <button 
            onClick={() => onNavigate("helpdesk")}
            className="w-full bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs py-2.5 rounded-xl font-bold transition-all border border-pink-200 flex items-center justify-center gap-1.5"
          >
            Mulai Chat AI Ortho <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Patient Access Transparency Card */}
      <div className="bg-gradient-to-r from-pink-50/70 via-white to-pink-50/40 p-5 rounded-2xl border border-pink-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs font-bold text-gray-900">Pemantauan Akses &amp; Kepatuhan Pasien</h4>
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Sesi Aktif Terverifikasi
              </span>
            </div>
            <p className="text-xs text-gray-500 max-w-2xl leading-relaxed">
              Dokter Gigi Anda ({lastPatientExam?.dentistName || "drg. Shinta Amalia, Sp.Ort"}) memantau kedisiplinan pengisian buku harian behel dan kepatuhan kontrol Anda. Total interaksi akun Anda: <strong className="text-gray-700">{currentPatient?.accessCount || 1} kali</strong>.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAuditModalPatientId(selectedPatientId)}
          className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <History size={13} className="text-pink-600" />
          <span>Lihat Log Sesi Saya</span>
        </button>
      </div>

      {/* Audit Trail Modal for Patient */}
      {renderAuditTrailModal()}
    </div>
  );
}
