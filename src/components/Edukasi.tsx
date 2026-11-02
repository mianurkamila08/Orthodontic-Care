import React, { useState, useMemo } from "react";
import { 
  BookOpen, 
  Search, 
  HelpCircle, 
  Clock, 
  Award, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Check, 
  X,
  Sparkles, 
  Flame, 
  ThumbsUp,
  Utensils,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Play,
  ShieldAlert,
  Info,
  Smile,
  MessageCircle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Sparkle,
  Image as ImageIcon,
  Layers,
  Eye,
  BookCheck,
  Video,
  Maximize2
} from "lucide-react";
import { EduArticle, EduSubTopic } from "../types";
import { initialEduArticles } from "../data/initialData";
import { articleSubTopicsMap, articleCoverImages } from "../data/eduSubTopicsData";
import DietPosterInfographic from "./DietPosterInfographic";
import { 
  bracesPartsData, 
  BracesPart 
} from "../data/edukasiInteractiveData";

interface EdukasiProps {
  articles?: EduArticle[];
  onReadArticle?: (article: EduArticle) => void;
}

type EduTabMode = "articles" | "anatomy" | "quiz";

export default function Edukasi({ articles = initialEduArticles, onReadArticle }: EdukasiProps) {
  // Navigation Mode
  const [activeTab, setActiveTab] = useState<EduTabMode>("articles");

  // Articles States
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<EduArticle | null>(null);
  const [showDietPosterModal, setShowDietPosterModal] = useState(false);

  // Sub-topics theory states
  const [expandedSubTopicIds, setExpandedSubTopicIds] = useState<Record<string, boolean>>({});
  const [activeSubTopicModal, setActiveSubTopicModal] = useState<EduSubTopic | null>(null);
  const [activeSubTopicList, setActiveSubTopicList] = useState<EduSubTopic[]>([]);
  const [understoodSubTopics, setUnderstoodSubTopics] = useState<Record<string, boolean>>({});

  // Anatomy Explorer States
  const [selectedPartId, setSelectedPartId] = useState<string>("part-bracket");

  // Quiz States
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const categories = ["All", "Braces Care", "Diet", "Emergency"];

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesCategory = selectedCategory === "All" || art.category === selectedCategory;
      const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            art.summary.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchTerm]);

  // Selected Braces Part
  const activePart = useMemo(() => {
    return bracesPartsData.find(p => p.id === selectedPartId) || bracesPartsData[0];
  }, [selectedPartId]);

  // Toggle subtopic theory in-place
  const toggleExpandSubTopic = (subId: string) => {
    setExpandedSubTopicIds(prev => ({
      ...prev,
      [subId]: !prev[subId]
    }));
  };

  // Toggle understood marker for subtopic
  const toggleUnderstood = (subId: string) => {
    setUnderstoodSubTopics(prev => ({
      ...prev,
      [subId]: !prev[subId]
    }));
  };

  // Quiz Questions Data (Kemenkes aligned orthodontics)
  const quizQuestions = [
    {
      question: "Berapa kali minimal pengguna kawat gigi harus menyikat gigi dalam sehari?",
      options: [
        "1 kali sehari saat mandi pagi",
        "2 kali sehari (pagi dan malam sebelum tidur)",
        "3 kali sehari (pagi setelah sarapan, siang setelah makan, dan malam sebelum tidur)",
        "Cukup kumur-kumur saja setelah makan"
      ],
      correctIndex: 2,
      explanation: "Kemenkes menganjurkan minimal 3 kali sehari bagi pemakai behel untuk mencegah sisa makanan tersangkut di kawat gigi yang memicu karang gigi & demineralisasi enamel."
    },
    {
      question: "Makanan manakah di bawah ini yang paling berisiko merusak bracket atau kawat gigi?",
      options: [
        "Bubur ayam hangat dan sup telur kuah",
        "Keripik singkong tebal, permen karet lengket, dan mengunyah es batu",
        "Ikan tim tanpa duri dan telur dadar empuk",
        "Jus alpukat dan yoghurt dingin"
      ],
      correctIndex: 1,
      explanation: "Makanan keras dan lengket dapat melonggarkan lem perekat bracket (bracket off) sehingga memperlama durasi perawatan ortodontik Anda."
    },
    {
      question: "Apa pertolongan pertama yang aman saat ujung kawat behel menusuk pipi bagian dalam?",
      options: [
        "Memotong kawat sendiri dengan gunting dapur biasa",
        "Menarik kawat paksa keluar menggunakan tang rumah tangga",
        "Menempelkan bulatan kecil lilin ortodontik (orthodontic wax) pada ujung kawat yang tajam",
        "Membiarkannya saja sampai berdarah sendiri"
      ],
      correctIndex: 2,
      explanation: "Orthodontic wax adalah bahan aman medis yang melapisi ujung tajam agar tidak bergesekan dengan pipi, mencegah sariawan parah sebelum sempat kontrol ke dokter."
    },
    {
      question: "Kapan waktu terbaik untuk melakukan flossing (benang gigi) dan penggunaan sikat interdental pada pasien behel?",
      options: [
        "Cukup seminggu sekali saat hari libur",
        "Setiap malam sebelum tidur atau setelah makan besar untuk membersihkan sela gigi yang rapat",
        "Hanya saat kawat behel terasa longgar",
        "Tidak perlu digunakan jika sudah berkumur dengan air putih biasa"
      ],
      correctIndex: 1,
      explanation: "Flossing dan sikat interdental sangat dianjurkan terutama sebelum tidur malam karena aliran air ludah berkurang saat tidur, mempercepat pembentukan plak bakteri di sela-sela gigi."
    }
  ];

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === quizQuestions[currentQuestion].correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
    setQuizStarted(true);
  };

  // Helper to open WhatsApp for dental emergency
  const handleOpenClinicWhatsApp = (topic: string) => {
    const text = `Halo Klinik Orthodontic Care, saya memerlukan konsultasi darurat kawat gigi mengenai: ${topic}. Mohon petunjuk langkah penanganannya. Terima kasih.`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Render Visual Formatted Article (Sub-headings with engaging images and accessible theory)
  const renderVisualArticleContent = (art: EduArticle) => {
    const subTopics: EduSubTopic[] = art.subTopics?.length 
      ? art.subTopics 
      : (articleSubTopicsMap[art.id] || []);
    const coverImg = art.imageUrl || articleCoverImages[art.id] || "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&auto=format&fit=crop&q=80";

    const understoodCount = subTopics.filter(s => understoodSubTopics[s.id]).length;
    const allExpanded = subTopics.length > 0 && subTopics.every(s => expandedSubTopicIds[s.id]);

    const handleToggleAll = () => {
      const targetState = !allExpanded;
      const nextMap: Record<string, boolean> = {};
      subTopics.forEach(s => {
        nextMap[s.id] = targetState;
      });
      setExpandedSubTopicIds(nextMap);
    };

    return (
      <div className="space-y-6">
        {/* Visual Hero Banner with High Quality Image */}
        <div className="relative rounded-2xl overflow-hidden border border-pink-100 shadow-xs group">
          <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-gray-900">
            <img 
              src={coverImg}
              alt={art.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-900/40 to-transparent" />
            
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="bg-pink-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-xs">
                {art.category}
              </span>
              <span className="bg-black/50 backdrop-blur-xs text-white text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
                <Clock size={11} /> {art.estimatedReadTime}
              </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-pink-300 flex items-center gap-1">
                <Sparkles size={12} /> Panduan Bergambar &amp; Teori Interaktif
              </span>
              <h3 className="text-base sm:text-lg font-extrabold leading-tight text-white drop-shadow-xs">
                {art.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Inti Pesan Medis (Key Takeaway) Banner */}
        <div className="p-4 bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 border border-pink-100 rounded-2xl flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Lightbulb size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-pink-900 uppercase tracking-wider">Inti Pesan Medis (Clinical Takeaway)</h4>
            <p className="text-xs text-pink-800 leading-relaxed font-medium">
              {art.summary}
            </p>
          </div>
        </div>

        {/* POSTER INFOGRAFIS RESMI: RAMAH ORTODONTIK (JIKA ARTIKEL DIET edu-2) */}
        {art.id === "edu-2" && (
          <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border-2 border-rose-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-xs">
                  <Utensils size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      Poster Panduan Diet Ramah Ortodontik
                    </h3>
                    <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                      Infografis Pasien
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Makan Sehat, Behel Aman, Senyum Maksimal!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDietPosterModal(true)}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Maximize2 size={13} />
                <span>Buka Poster Layar Penuh</span>
              </button>
            </div>

            {/* Inline Poster Rendering */}
            <DietPosterInfographic isModal={false} />
          </div>
        )}

        {/* VIDEO TUTORIAL UTAMA: CARA MENYIKAT GIGI YANG BENAR BAGI PENGGUNA BEHEL (JIKA ARTIKEL edu-1) */}
        {art.id === "edu-1" && (
          <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border-2 border-rose-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-pink-600 to-rose-700 text-white flex items-center justify-center shadow-xs">
                  <Video size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      Video Tutorial: Cara Menyikat Gigi yang Benar bagi Pengguna Behel
                    </h3>
                    <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Play size={10} fill="currentColor" /> Siap Diputar Langsung
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Demonstrasi langsung teknik menyikat gigi kawat ortodontik, batas gusi, dan sela bracket
                  </p>
                </div>
              </div>
              <a
                href="https://youtu.be/nNPJxgNVBAg?si=6wOI1hQDqgo_uzZz"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-rose-600 hover:text-rose-800 underline font-semibold flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Buka di YouTube</span>
                <ArrowRight size={12} />
              </a>
            </div>

            {/* Directly Playable 16:9 YouTube Player */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md bg-black border border-rose-200">
              <iframe
                className="w-full h-full border-0"
                src="https://www.youtube.com/embed/nNPJxgNVBAg"
                title="Cara Menyikat Gigi yang Benar bagi Pengguna Behel"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="p-3 bg-rose-50/80 rounded-xl border border-rose-100 flex flex-wrap items-center justify-between gap-2 text-xs text-rose-900">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-rose-600 shrink-0" />
                <span className="font-medium text-[11px]">
                  Video dapat langsung ditonton di sini. Terapkan teknik sikat gigi ortodontik minimal 3 kali sehari.
                </span>
              </div>
              <span className="text-[10px] bg-white text-rose-700 font-bold px-2 py-0.5 rounded-md border border-rose-200">
                HD 1080p
              </span>
            </div>
          </div>
        )}

        {/* SUB-JUDUL & MODUL TEORI BERGAMBAR SECTION */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-gray-50/90 p-4 rounded-2xl border border-gray-200/80">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Layers size={16} className="text-pink-600" />
                  <span>Sub-Judul &amp; Modul Teori Bergambar</span>
                </h3>
                <span className="text-[10px] bg-pink-100 text-pink-800 font-extrabold px-2 py-0.5 rounded-full">
                  {subTopics.length} Sub-Judul
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Setiap sub-judul dilengkapi ilustrasi gambar menarik. Klik sub-judul untuk membuka teori &amp; panduan medis lengkap.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {subTopics.length > 0 && (
                <button
                  type="button"
                  onClick={handleToggleAll}
                  className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  {allExpanded ? (
                    <>
                      <ChevronUp size={14} />
                      <span>Tutup Semua Teori</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} />
                      <span>Buka Semua Teori</span>
                    </>
                  )}
                </button>
              )}

              <span className="text-[11px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                <BookCheck size={13} className="text-emerald-600" />
                <span>{understoodCount}/{subTopics.length} Dipahami</span>
              </span>
            </div>
          </div>

          {/* Sub-Topics Visual Cards Grid */}
          <div className="space-y-4">
            {subTopics.map((sub, idx) => {
              const isExpanded = !!expandedSubTopicIds[sub.id];
              const isUnderstood = !!understoodSubTopics[sub.id];

              return (
                <div 
                  key={sub.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white ${
                    isExpanded 
                      ? "border-pink-300 shadow-md ring-1 ring-pink-200" 
                      : "border-gray-200 hover:border-pink-200 hover:shadow-xs"
                  }`}
                >
                  {/* Sub-Heading Visual Card Header */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 sm:p-5">
                    {/* Visual Image Thumbnail for Sub-Heading */}
                    <div 
                      className="md:col-span-4 relative rounded-xl overflow-hidden bg-gray-100 group/img cursor-pointer aspect-video md:aspect-4/3"
                      onClick={() => {
                        setActiveSubTopicModal(sub);
                        setActiveSubTopicList(subTopics);
                      }}
                      title="Klik untuk membuka layar penuh teori"
                    >
                      <img 
                        src={sub.imageUrl} 
                        alt={sub.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-85 group-hover/img:opacity-95 transition-opacity" />
                      
                      {/* Sub-Heading Badge */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                        <span className="bg-pink-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-2xs backdrop-blur-xs">
                          Sub-Judul 0{idx + 1}
                        </span>
                        {sub.videoUrl && (
                          <span className="bg-rose-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-2xs flex items-center gap-1 animate-pulse">
                            <Play size={9} fill="currentColor" /> Ada Video
                          </span>
                        )}
                      </div>

                      {/* Understood Tag */}
                      {isUnderstood && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-2xs flex items-center gap-0.5">
                            <Check size={11} strokeWidth={3} /> Dipahami
                          </span>
                        </div>
                      )}

                      {/* Overlay Caption preview */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white/95">
                        <span className="line-clamp-1 font-medium text-[10px]">
                          {sub.imageCaption || "Klik perbesar visual"}
                        </span>
                        <Eye size={13} className="shrink-0 text-pink-300" />
                      </div>
                    </div>

                    {/* Sub-Heading Info & Control */}
                    <div className="md:col-span-8 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">
                            Bagian {idx + 1}
                          </span>
                          {sub.videoUrl && (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 flex items-center gap-1">
                              <Video size={11} /> Video Tutorial Tersedia
                            </span>
                          )}
                          <span className="text-gray-300">•</span>
                          <span className="text-[11px] text-gray-500 font-medium line-clamp-1">
                            {sub.subtitle}
                          </span>
                        </div>

                        <h4 
                          onClick={() => toggleExpandSubTopic(sub.id)}
                          className="text-sm sm:text-base font-bold text-gray-900 leading-snug cursor-pointer hover:text-pink-600 transition-colors"
                        >
                          {sub.title}
                        </h4>

                        {/* 2 Key Takeaway Points */}
                        <div className="space-y-1 pt-1">
                          {sub.keyPoints.slice(0, 2).map((pt, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-1.5 text-xs text-gray-600">
                              <CheckCircle2 size={13} className="text-pink-500 shrink-0 mt-0.5" />
                              <span className="text-[11px] leading-relaxed">{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Controls within Sub-Heading */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Accordion Expand Button */}
                          <button
                            type="button"
                            onClick={() => toggleExpandSubTopic(sub.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                              isExpanded 
                                ? "bg-pink-100 text-pink-800 hover:bg-pink-200" 
                                : "bg-pink-600 hover:bg-pink-700 text-white shadow-xs"
                            }`}
                          >
                            <BookOpen size={13} />
                            <span>{isExpanded ? "Tutup Teori" : "Buka Teori di Sini"}</span>
                            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </button>

                          {/* Direct Video Button if available */}
                          {sub.videoUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setExpandedSubTopicIds(prev => ({ ...prev, [sub.id]: true }));
                              }}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                              title="Tonton video tutorial langsung"
                            >
                              <Play size={12} fill="currentColor" />
                              <span>Putar Video</span>
                            </button>
                          )}

                          {/* Full Modal Reader Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setActiveSubTopicModal(sub);
                              setActiveSubTopicList(subTopics);
                            }}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Eye size={13} />
                            <span>Layar Penuh</span>
                          </button>
                        </div>

                        {/* Understood Checkbox Button */}
                        <button
                          type="button"
                          onClick={() => toggleUnderstood(sub.id)}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                            isUnderstood 
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                              : "bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200"
                          }`}
                        >
                          <Check size={13} className={isUnderstood ? "text-emerald-600" : "text-gray-400"} />
                          <span>{isUnderstood ? "Sudah Dipahami ✓" : "Tandai Paham"}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ACCESSIBLE THEORY INSIDE THE SUB-HEADING (EXPANDED CONTENT) */}
                  {isExpanded && (
                    <div className="p-5 bg-gradient-to-b from-pink-50/20 via-white to-gray-50/40 border-t border-pink-100 space-y-5 animate-in fade-in duration-200">
                      {/* EMBEDDED VIDEO TUTORIAL IF AVAILABLE */}
                      {sub.videoUrl && (
                        <div className="rounded-2xl overflow-hidden border-2 border-rose-200 bg-gray-950 shadow-md space-y-0">
                          <div className="p-3 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                                <Video size={16} className="text-white" />
                              </div>
                              <div>
                                <h5 className="text-xs font-bold leading-tight">
                                  {sub.videoTitle || "Video Tutorial Praktik"}
                                </h5>
                                <p className="text-[10px] text-rose-100">
                                  {sub.subtitle || "Dapat langsung diputar di bawah ini"}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] bg-white text-rose-700 font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                              <Play size={10} fill="currentColor" /> Siap Diputar Langsung
                            </span>
                          </div>

                          {/* Direct Playable 16:9 YouTube Embed */}
                          <div className="relative w-full aspect-video bg-black">
                            <iframe
                              src={sub.videoUrl}
                              title={sub.videoTitle || "Video Tutorial"}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          </div>

                          <div className="p-2.5 bg-gray-900 text-gray-300 text-[11px] flex flex-wrap items-center justify-between gap-2 border-t border-gray-800">
                            <span className="flex items-center gap-1.5 text-[11px] text-gray-300">
                              <Sparkles size={13} className="text-rose-400 shrink-0" />
                              <span>Tekan tombol play untuk langsung menonton video tutorial ini.</span>
                            </span>
                            <a
                              href={sub.videoOriginalUrl || (sub.videoUrl?.replace("embed/", "watch?v=") || "https://youtu.be/3_vHsOGiIo4")}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-rose-300 hover:text-white underline font-semibold flex items-center gap-1"
                            >
                              <span>Buka di YouTube</span>
                              <ArrowRight size={11} />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Teori & Landasan Medis Ortodonti */}
                      <div className="p-4 bg-white rounded-xl border border-pink-100 shadow-2xs space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-xs">
                            📖
                          </div>
                          <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                            Landasan Teori Medis Ortodonti ({sub.title})
                          </h5>
                        </div>
                        <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line pl-8">
                          {sub.theoryContent}
                        </div>
                      </div>

                      {/* Practical Steps */}
                      {sub.practicalSteps && sub.practicalSteps.length > 0 && (
                        <div className="space-y-2.5">
                          <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles size={14} className="text-pink-600" />
                            <span>Tahapan &amp; Panduan Praktis Mandiri:</span>
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {sub.practicalSteps.map((step, sIdx) => (
                              <div 
                                key={sIdx}
                                className="p-3 bg-white rounded-xl border border-gray-200/80 shadow-2xs flex items-start gap-2.5"
                              >
                                <span className="w-5 h-5 rounded-full bg-pink-500 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                  {sIdx + 1}
                                </span>
                                <p className="text-[11px] text-gray-700 leading-relaxed font-medium">
                                  {step}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* DOs & DON'Ts Columns */}
                      {sub.dosAndDonts && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* DOs */}
                          <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                              <CheckCircle2 size={15} className="text-emerald-600" />
                              <span>Hal yang Sangat Dianjurkan (DOs)</span>
                            </div>
                            <ul className="space-y-1.5 text-[11px] text-emerald-800 font-medium">
                              {sub.dosAndDonts.dos.map((d, dIdx) => (
                                <li key={dIdx} className="flex items-start gap-1.5">
                                  <span className="text-emerald-600 font-bold">•</span>
                                  <span>{d}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* DON'Ts */}
                          <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-xl space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                              <XCircle size={15} className="text-rose-600" />
                              <span>Hal yang Dilarang Keras (DON'Ts)</span>
                            </div>
                            <ul className="space-y-1.5 text-[11px] text-rose-800 font-medium">
                              {sub.dosAndDonts.donts.map((d, dIdx) => (
                                <li key={dIdx} className="flex items-start gap-1.5">
                                  <span className="text-rose-600 font-bold">•</span>
                                  <span>{d}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Catatan Dokter Spesialis Ortodonsia */}
                      {sub.clinicalNote && (
                        <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                          <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="block font-bold text-amber-950 mb-0.5">Catatan Dokter Sp.Ort:</strong>
                            <p className="text-[11px] text-amber-900 leading-relaxed">
                              {sub.clinicalNote}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Bottom Sub-Topic Action Bar */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                        <button
                          type="button"
                          onClick={() => toggleUnderstood(sub.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isUnderstood 
                              ? "bg-emerald-600 text-white" 
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          <Check size={14} />
                          <span>{isUnderstood ? "Teori Sudah Dipahami ✓" : "Tandai Sudah Paham"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleExpandSubTopic(sub.id)}
                          className="text-xs text-gray-500 hover:text-gray-800 font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <span>Tutup Teori</span>
                          <ChevronUp size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Kemenkes Compliance Badge */}
        <div className="bg-pink-50/70 p-4 rounded-xl border border-pink-100 text-xs text-pink-900 leading-relaxed flex items-start gap-3">
          <ShieldAlert size={18} className="text-pink-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold mb-0.5">Standar Kesehatan Gigi Kemenkes RI &amp; IKORTI:</strong>
            Pemahaman teori dan kepatuhan perawatan mandiri kawat gigi berkontribusi hingga 70% terhadap kecepatan dan keberhasilan pergeseran gigi Anda. Konsultasikan selalu perkembangan gigi dengan dokter spesialis ortodonsia Anda.
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6" id="edukasi-root">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <span>Portal Edukasi &amp; Interaktif Orthodontic</span>
            <span className="text-xs bg-pink-100 text-pink-700 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Visual &amp; Praktis
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Panduan visual bergambar, simulator interaktif anatomi behel, dan kuis kepatuhan perawatan ortodontik.
          </p>
        </div>

        {/* Quick Quiz Callout Button */}
        <button
          onClick={() => {
            setActiveTab("quiz");
            setSelectedArticle(null);
            setQuizStarted(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Award size={16} />
          <span>Uji Kuis Gigi ({quizQuestions.length} Soal)</span>
        </button>
      </div>

      {/* Interactive Sub-Navigation Bar (Engaging visual tabs instead of text-only) */}
      <div className="bg-white p-1.5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => {
            setActiveTab("articles");
            setSelectedArticle(null);
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === "articles" 
              ? "bg-pink-500 text-white shadow-xs" 
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <BookOpen size={15} />
          <span>Materi &amp; Panduan ({articles.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("anatomy");
            setSelectedArticle(null);
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === "anatomy" 
              ? "bg-pink-500 text-white shadow-xs" 
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Sparkle size={15} />
          <span>Anatomi Behel</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("quiz");
            setSelectedArticle(null);
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === "quiz" 
              ? "bg-pink-500 text-white shadow-xs" 
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Award size={15} />
          <span>Kuis Kepatuhan</span>
        </button>
      </div>

      {/* TAB 1: ARTICLES VIEW */}
      {activeTab === "articles" && (
        <div className="space-y-4">
            {selectedArticle ? (
              /* Single Article View - Rich Visual Presentation */
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="text-xs text-pink-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    &larr; Kembali ke Daftar Edukasi
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="bg-pink-50 text-pink-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-pink-100">
                      {selectedArticle.category}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} /> {selectedArticle.estimatedReadTime} baca
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                  {selectedArticle.title}
                </h2>

                {/* Render Rich Visual Formatted Content */}
                {renderVisualArticleContent(selectedArticle)}

                {/* Article Footer Controls */}
                <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Tutup Artikel
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenClinicWhatsApp(selectedArticle.title)}
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle size={14} className="text-emerald-600" />
                      <span>Tanya Dokter di WA</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Directory List View */
              <div className="space-y-4">
                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full sm:w-60">
                    <input
                      type="text"
                      placeholder="Cari materi gigi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500 focus:bg-white transition-all"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
                  </div>

                  <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none justify-start sm:justify-end">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-pink-500 text-white shadow-xs"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {cat === "All" ? "Semua Kategori" : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Articles Grid with Visual Card Polish */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredArticles.map((art) => {
                    const subList = art.subTopics?.length ? art.subTopics : (articleSubTopicsMap[art.id] || []);
                    const cover = art.imageUrl || articleCoverImages[art.id] || "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&auto=format&fit=crop&q=80";

                    return (
                      <div 
                        key={art.id}
                        onClick={() => {
                          setSelectedArticle(art);
                          onReadArticle?.(art);
                        }}
                        className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:border-pink-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden group"
                      >
                        {/* Card Image Banner */}
                        <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                          <img 
                            src={cover}
                            alt={art.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                          
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                            <span className="text-[9px] bg-pink-600 text-white font-extrabold uppercase px-2 py-0.5 rounded-md shadow-2xs">
                              {art.category}
                            </span>
                            <span className="text-[10px] bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Clock size={10} /> {art.estimatedReadTime}
                            </span>
                          </div>

                          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-[10px]">
                            <span className="bg-white/90 backdrop-blur-xs text-pink-700 font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                              <Layers size={11} /> {subList.length} Sub-Judul Bergambar &amp; Teori
                            </span>
                          </div>
                        </div>

                        {/* Card Text Content */}
                        <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-pink-600 transition-colors line-clamp-2">
                              {art.title}
                            </h3>
                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                              {art.summary}
                            </p>
                          </div>

                          {art.id === "edu-2" && (
                            <div className="p-2.5 bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-2">
                              <span className="text-[11px] text-rose-800 font-bold flex items-center gap-1.5">
                                <Sparkles size={12} className="text-rose-500 shrink-0" />
                                <span>Poster Infografis Tersedia</span>
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedArticle(art);
                                  setShowDietPosterModal(true);
                                }}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-extrabold rounded-lg shadow-2xs transition-colors cursor-pointer"
                              >
                                Lihat Poster
                              </button>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 text-[11px]">
                            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 size={12} className="text-emerald-500" />
                              Kemenkes &amp; IKORTI
                            </span>
                            <span className="text-pink-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                              <span>Buka Modul</span>
                              <ArrowRight size={13} />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredArticles.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-100">
                      <p className="text-xs text-gray-400">Artikel tidak ditemukan untuk kata kunci ini.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      )}

      {/* TAB 2: ANATOMY EXPLORER */}
      {activeTab === "anatomy" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-purple-200 text-xs font-extrabold uppercase tracking-wider">
              <Sparkle size={16} />
              <span>Eksplorasi Komponen Ortodonsia</span>
            </div>
            <h2 className="text-xl font-extrabold leading-tight">
              Anatomi &amp; Bagian Kawat Gigi (Braces Explorer)
            </h2>
            <p className="text-xs text-purple-100 max-w-2xl leading-relaxed">
              Klik setiap komponen kawat gigi di bawah ini untuk memahami fungsi mekanisnya, cara menyikatnya, dan apa yang harus dilakukan jika terjadi kendala.
            </p>
          </div>

          {/* Interactive Layout: Left Selector & Right Detail Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Parts Selector List */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Pilih Bagian Behel:</h3>
              {bracesPartsData.map((part) => {
                const isSelected = part.id === selectedPartId;
                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => setSelectedPartId(part.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected 
                        ? "bg-pink-500 text-white border-pink-500 shadow-sm" 
                        : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{part.iconEmoji}</span>
                      <div>
                        <h4 className="text-xs font-bold leading-tight">{part.name}</h4>
                        <p className={`text-[10px] ${isSelected ? "text-pink-100" : "text-gray-400"}`}>
                          {part.medicalTerm}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className={isSelected ? "text-white" : "text-gray-400"} />
                  </button>
                );
              })}
            </div>

            {/* Detail Interactive Card */}
            <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
              <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center text-2xl shadow-2xs">
                    {activePart.iconEmoji}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md font-semibold">
                      {activePart.medicalTerm}
                    </span>
                    <h2 className="text-lg font-bold text-gray-900 mt-0.5">{activePart.name}</h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenClinicWhatsApp(activePart.name)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <MessageCircle size={13} className="text-emerald-600" />
                  <span>Konsultasi Komponen</span>
                </button>
              </div>

              {/* Function */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Info size={14} className="text-blue-500" />
                  Fungsi &amp; Cara Kerjanya:
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  {activePart.functionDesc}
                </p>
              </div>

              {/* Maintenance Tip */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  Cara Membersihkan &amp; Merawat Mandiri:
                </h4>
                <p className="text-xs text-emerald-900 leading-relaxed bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100">
                  {activePart.maintenanceTip}
                </p>

                {activePart.id === "part-bracket" && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-3 flex-wrap mt-2">
                    <div className="flex items-center gap-2">
                      <Video size={16} className="text-rose-600 shrink-0" />
                      <span className="text-xs font-semibold text-rose-950">
                        Tutorial praktis: Cara menyikat gigi yang benar bagi pengguna behel
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const targetArt = articles.find(a => a.id === "edu-1") || articles[0];
                        setSelectedArticle(targetArt);
                        const subList = targetArt.subTopics || articleSubTopicsMap[targetArt.id] || [];
                        const sub = subList.find(s => s.id === "sub-1-2") || subList[0];
                        if (sub) {
                          setActiveSubTopicModal(sub);
                          setActiveSubTopicList(subList);
                        }
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                    >
                      <Play size={11} fill="currentColor" />
                      <span>Putar Video Tutorial</span>
                    </button>
                  </div>
                )}

                {activePart.id === "part-archwire" && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-3 flex-wrap mt-2">
                    <div className="flex items-center gap-2">
                      <Video size={16} className="text-rose-600 shrink-0" />
                      <span className="text-xs font-semibold text-rose-950">
                        Tutorial praktis cara membersihkan kolong kawat dengan Interdental Brush
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const targetArt = articles.find(a => a.id === "edu-1") || articles[0];
                        setSelectedArticle(targetArt);
                        const subList = targetArt.subTopics || articleSubTopicsMap[targetArt.id] || [];
                        const sub = subList.find(s => s.id === "sub-1-3");
                        if (sub) {
                          setActiveSubTopicModal(sub);
                          setActiveSubTopicList(subList);
                        }
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                    >
                      <Play size={11} fill="currentColor" />
                      <span>Putar Video Tutorial</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Trouble & First Aid Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-rose-50/60 border border-rose-100 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-rose-800 uppercase flex items-center gap-1">
                    <AlertTriangle size={12} /> Kendala yang Sering Terjadi:
                  </span>
                  <p className="text-xs text-rose-950 leading-relaxed">
                    {activePart.commonTrouble}
                  </p>
                </div>

                <div className="p-3.5 bg-amber-50/60 border border-amber-100 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase flex items-center gap-1">
                    <ShieldAlert size={12} /> Pertolongan Pertama:
                  </span>
                  <p className="text-xs text-amber-950 leading-relaxed">
                    {activePart.firstAid}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUIZ VIEW */}
      {activeTab === "quiz" && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 shadow-2xs">
              <HelpCircle size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Kuis Kepatuhan Gigi Kemenkes</h2>
              <p className="text-xs text-gray-500">Uji pengetahuan Anda untuk percepatan keberhasilan kawat gigi</p>
            </div>
          </div>

          {!quizStarted && !quizFinished ? (
            /* Intro */
            <div className="space-y-4 py-3">
              <p className="text-xs text-gray-600 leading-relaxed">
                Kuis ini dirancang berdasarkan standar kurikulum kesehatan gigi dan mulut Kemenkes RI serta panduan Ikatan Ortodontis Indonesia (IKORTI). Buktikan pemahaman Anda dan raih lencana penghargaan!
              </p>
              <div className="bg-amber-50/70 border border-amber-100 p-4 rounded-xl flex items-center gap-3">
                <Award className="text-amber-600 shrink-0" size={24} />
                <span className="text-xs text-amber-900">
                  Dapatkan lencana <strong>Sobat Gigi Sehat Pratama</strong> jika berhasil menjawab seluruh soal dengan benar!
                </span>
              </div>
              <button
                onClick={() => setQuizStarted(true)}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Mulai Kuis Sekarang
              </button>
            </div>
          ) : quizFinished ? (
            /* Finished */
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mx-auto text-xl font-black shadow-xs">
                {score === quizQuestions.length ? <Sparkles size={32} className="text-amber-500" /> : <ThumbsUp size={28} />}
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Kuis Selesai!</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Skor Anda: <strong className="text-pink-600 text-sm font-mono">{score}</strong> dari {quizQuestions.length} pertanyaan benar
                </p>
              </div>

              {score === quizQuestions.length ? (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900 leading-relaxed">
                  🏆 <strong>Luar Biasa! Sobat Gigi Sehat Sempurna!</strong> Anda telah memahami 100% regulasi medis kebersihan gigi ortodonsia. Pertahankan kepatuhan ini hingga senyum impian Anda tercapai!
                </div>
              ) : (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-900 leading-relaxed">
                  💡 <strong>Bagus Sekali!</strong> Tingkatkan terus pemahaman Anda dengan membaca modul panduan visual makanan dan sikat gigi di tab lain.
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={resetQuiz}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  Ulangi Kuis
                </button>
                <button
                  onClick={() => setActiveTab("articles")}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Kembali ke Materi
                </button>
              </div>
            </div>
          ) : (
            /* Active Question */
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase">
                <span>Pertanyaan {currentQuestion + 1} dari {quizQuestions.length}</span>
                <span className="flex items-center gap-1 text-amber-500"><Flame size={13} /> {score} Jawaban Benar</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-pink-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                ></div>
              </div>

              <h3 className="text-sm font-bold text-gray-900 leading-snug">
                {quizQuestions[currentQuestion].question}
              </h3>

              <div className="space-y-2 pt-1">
                {quizQuestions[currentQuestion].options.map((opt, idx) => {
                  let btnStyle = "border-gray-200 bg-white text-gray-800 hover:bg-gray-50";
                  
                  if (selectedAnswer !== null) {
                    if (idx === quizQuestions[currentQuestion].correctIndex) {
                      btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                    } else if (idx === selectedAnswer) {
                      btnStyle = "border-rose-500 bg-rose-50 text-rose-900";
                    } else {
                      btnStyle = "border-gray-100 bg-gray-50 text-gray-300 pointer-events-none";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(idx)}
                      disabled={selectedAnswer !== null}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start gap-2.5 cursor-pointer ${btnStyle}`}
                    >
                      <span className="font-bold shrink-0">{String.fromCharCode(65 + idx)}.</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <div className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100 transition-all animate-in fade-in duration-150">
                  <div className="flex items-center gap-1.5 text-xs">
                    {selectedAnswer === quizQuestions[currentQuestion].correctIndex ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 size={16} /> Jawaban Benar!
                      </span>
                    ) : (
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        <XCircle size={16} /> Jawaban Kurang Tepat
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {quizQuestions[currentQuestion].explanation}
                  </p>
                  
                  <button
                    onClick={handleNextQuestion}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold py-2 rounded-xl mt-2 flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span>Lanjut ke Pertanyaan Berikutnya</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODAL FULL READER FOR SUB-TOPIC THEORY */}
      {activeSubTopicModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActiveSubTopicModal(null)}
        >
          <div 
            className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/90">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs">
                  <BookOpen size={16} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase bg-pink-50 text-pink-700 px-2 py-0.5 rounded-md border border-pink-100">
                      Modul Teori Sub-Judul
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium line-clamp-1">
                      {activeSubTopicModal.subtitle}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-1">
                    {activeSubTopicModal.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubTopicModal(null)}
                className="w-8 h-8 rounded-xl bg-gray-200/80 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
              {/* VIDEO EMBED PLAYER IF AVAILABLE */}
              {activeSubTopicModal.videoUrl && (
                <div className="rounded-2xl overflow-hidden border-2 border-rose-300 bg-gray-950 shadow-lg">
                  <div className="p-3.5 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                        <Video size={16} className="text-white" />
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold leading-tight">
                          {activeSubTopicModal.videoTitle || "Video Tutorial Praktik"}
                        </h5>
                        <p className="text-[10px] text-rose-100">
                          {activeSubTopicModal.subtitle || "Dapat langsung diputar di bawah ini"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-white text-rose-700 font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                      <Play size={10} fill="currentColor" /> Dapat Diputar Langsung
                    </span>
                  </div>

                  <div className="relative w-full aspect-video bg-black">
                    <iframe
                      src={activeSubTopicModal.videoUrl}
                      title={activeSubTopicModal.videoTitle || "Tutorial Praktik"}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>

                  <div className="p-2.5 bg-gray-900 text-gray-300 text-[11px] flex flex-wrap items-center justify-between gap-2 border-t border-gray-800">
                    <span className="text-[11px] text-gray-300 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-rose-400 shrink-0" />
                      <span>Gunakan kontrol video untuk memutar, menjeda, atau mengubah volume &amp; resolusi.</span>
                    </span>
                    <a
                      href={activeSubTopicModal.videoOriginalUrl || (activeSubTopicModal.videoUrl?.replace("embed/", "watch?v=") || "https://youtu.be/3_vHsOGiIo4")}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-rose-300 hover:text-white underline font-semibold flex items-center gap-1"
                    >
                      <span>Tonton di YouTube</span>
                      <ArrowRight size={11} />
                    </a>
                  </div>
                </div>
              )}

              {/* Large High-Res Image Banner */}
              <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-2xs">
                <img 
                  src={activeSubTopicModal.imageUrl}
                  alt={activeSubTopicModal.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-52 sm:h-64 object-cover object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80";
                  }}
                />
                {activeSubTopicModal.imageCaption && (
                  <div className="p-2.5 bg-gray-900/90 text-white text-[11px] font-medium flex items-center gap-1.5">
                    <ImageIcon size={13} className="text-pink-300 shrink-0" />
                    <span>{activeSubTopicModal.imageCaption}</span>
                  </div>
                )}
              </div>

              {/* If subtopic is the poster subtopic, render poster inside modal! */}
              {activeSubTopicModal.id === "sub-2-4" && (
                <div className="my-3 rounded-2xl overflow-hidden border border-rose-200 shadow-sm">
                  <DietPosterInfographic isModal={false} />
                </div>
              )}

              {/* Inti Teori Medis */}
              <div className="p-4 bg-pink-50/40 rounded-xl border border-pink-100 space-y-2">
                <h4 className="text-xs font-bold text-pink-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-pink-600" />
                  <span>Landasan Teori &amp; Penjelasan Klinis Medis</span>
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line font-medium">
                  {activeSubTopicModal.theoryContent}
                </p>
              </div>

              {/* Practical Steps */}
              {activeSubTopicModal.practicalSteps && activeSubTopicModal.practicalSteps.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Langkah Implementasi Praktis:
                  </h4>
                  <div className="space-y-2">
                    {activeSubTopicModal.practicalSteps.map((step, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2.5 text-xs text-gray-700">
                        <span className="w-5 h-5 rounded-full bg-pink-500 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed font-medium">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DOs and DON'Ts */}
              {activeSubTopicModal.dosAndDonts && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <span>Hal yang Dianjurkan (DOs)</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-emerald-800 font-medium">
                      {activeSubTopicModal.dosAndDonts.dos.map((d, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                      <XCircle size={16} className="text-rose-600" />
                      <span>Hal yang Dilarang (DON'Ts)</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-rose-800 font-medium">
                      {activeSubTopicModal.dosAndDonts.donts.map((d, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-rose-600 font-bold">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Dentist Note */}
              {activeSubTopicModal.clinicalNote && (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                  <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold text-amber-950 mb-0.5">Catatan Dokter Spesialis Ortodonsia:</strong>
                    <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                      {activeSubTopicModal.clinicalNote}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer with Sequential Navigation */}
            <div className="p-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 bg-gray-50/80">
              <div className="flex items-center gap-2">
                {(() => {
                  const curIdx = activeSubTopicList.findIndex(s => s.id === activeSubTopicModal.id);
                  const prevSub = curIdx > 0 ? activeSubTopicList[curIdx - 1] : null;
                  const nextSub = curIdx >= 0 && curIdx < activeSubTopicList.length - 1 ? activeSubTopicList[curIdx + 1] : null;

                  return (
                    <>
                      {prevSub && (
                        <button
                          type="button"
                          onClick={() => setActiveSubTopicModal(prevSub)}
                          className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <ArrowLeft size={13} />
                          <span>Sebelumnya</span>
                        </button>
                      )}
                      {nextSub && (
                        <button
                          type="button"
                          onClick={() => setActiveSubTopicModal(nextSub)}
                          className="px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>Berikutnya</span>
                          <ArrowRight size={13} />
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toggleUnderstood(activeSubTopicModal.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    understoodSubTopics[activeSubTopicModal.id]
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  <Check size={14} />
                  <span>{understoodSubTopics[activeSubTopicModal.id] ? "Sudah Dipahami ✓" : "Tandai Paham"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSubTopicModal(null)}
                  className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIET POSTER MODAL (FULLSCREEN / HIGH-RESOLUTION) */}
      {showDietPosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-y-auto my-auto border border-rose-200">
            <DietPosterInfographic 
              isModal={true} 
              onClose={() => setShowDietPosterModal(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
