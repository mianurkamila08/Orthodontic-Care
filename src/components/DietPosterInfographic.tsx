import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  Check, 
  AlertTriangle, 
  Heart, 
  Sparkles, 
  Utensils, 
  Droplets, 
  Sun, 
  Sunset, 
  Moon, 
  Maximize2, 
  Minimize2,
  Download, 
  Share2, 
  Printer, 
  Smile, 
  CheckCircle2, 
  Upload,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  HelpCircle,
  Eye
} from "lucide-react";

interface DietPosterInfographicProps {
  isModal?: boolean;
  onClose?: () => void;
}

const STORAGE_KEY = "diet_poster_custom_image_url";

export default function DietPosterInfographic({ isModal = false, onClose }: DietPosterInfographicProps) {
  const [posterImage, setPosterImage] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY) || null;
  });
  const [activeView, setActiveView] = useState<"image" | "interactive">("image");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if any default public poster image is available if nothing in localStorage
  useEffect(() => {
    if (!posterImage) {
      const probePaths = [
        "/poster-diet.png",
        "/diet-poster.png",
        "/ChatGPT%20Image%20Sep%203,%202026,%2005_56_20%20PM.png"
      ];

      const testImage = (index: number) => {
        if (index >= probePaths.length) return;
        const img = new Image();
        img.src = probePaths[index];
        img.onload = () => {
          setPosterImage(probePaths[index]);
        };
        img.onerror = () => {
          testImage(index + 1);
        };
      };

      testImage(0);
    }
  }, [posterImage]);

  const notify = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => setShowNotification(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      notify("Harap pilih file gambar (PNG, JPG, WEBP)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setPosterImage(dataUrl);
        try {
          localStorage.setItem(STORAGE_KEY, dataUrl);
          notify("✓ Gambar poster berhasil dipasang & tersimpan!");
        } catch {
          // If storage limit reached, keep in memory state
          notify("✓ Gambar poster berhasil ditampilkan!");
        }
        setActiveView("image");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Poster Panduan Diet Ramah Ortodontik",
        text: "Makan Sehat, Behel Aman, Senyum Maksimal - Panduan Diet Pasien Kawat Gigi",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      notify("✓ Tautan poster berhasil disalin ke clipboard!");
    }
  };

  const handleDownload = () => {
    if (posterImage) {
      const a = document.createElement("a");
      a.href = posterImage;
      a.download = "Panduan-Diet-Ramah-Ortodontik.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      notify("✓ Memulai unduhan gambar poster...");
    } else {
      notify("Belum ada file gambar yang diunggah untuk diunduh.");
    }
  };

  const handleResetImage = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPosterImage(null);
    notify("Gambar poster di-reset.");
  };

  return (
    <div className={`relative ${isModal ? "max-w-4xl mx-auto" : "w-full"} select-text`}>
      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed top-5 right-5 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xl border border-gray-700 animate-in fade-in slide-in-from-top-3 flex items-center gap-2">
          <Sparkles size={14} className="text-rose-400 shrink-0" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="diet-poster-file-upload"
      />

      {/* TOP ACTION & VIEW BAR */}
      <div className="p-3 bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 border-b border-rose-100 rounded-t-2xl flex flex-wrap items-center justify-between gap-2.5">
        {/* Left Title & Status */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <div>
            <h4 className="text-xs font-black text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
              <span>Poster Panduan Diet Ramah Ortodontik</span>
              {posterImage && (
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-300">
                  Gambar Terpasang
                </span>
              )}
            </h4>
            <p className="text-[10px] text-rose-700 font-medium">
              Makan Sehat, Behel Aman, Senyum Maksimal!
            </p>
          </div>
        </div>

        {/* Center/Right Controls */}
        <div className="flex items-center flex-wrap gap-1.5 ml-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 bg-white rounded-xl border border-rose-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveView("image")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeView === "image"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-gray-600 hover:text-rose-700 hover:bg-rose-50"
              }`}
            >
              <ImageIcon size={13} />
              <span>Gambar Poster</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView("interactive")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeView === "interactive"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-gray-600 hover:text-rose-700 hover:bg-rose-50"
              }`}
            >
              <FileText size={13} />
              <span>Rincian Teks</span>
            </button>
          </div>

          {/* Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 bg-white hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
            title="Pilih file gambar poster dari komputer/HP"
          >
            <Upload size={13} />
            <span className="hidden sm:inline">
              {posterImage ? "Ganti Gambar" : "Pasang Gambar"}
            </span>
          </button>

          {/* Download if image exists */}
          {posterImage && (
            <button
              type="button"
              onClick={handleDownload}
              className="p-1.5 bg-white hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold border border-rose-200 transition-all flex items-center gap-1 cursor-pointer"
              title="Unduh Gambar Poster"
            >
              <Download size={13} />
            </button>
          )}

          {/* Share & Print */}
          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 bg-white hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold border border-rose-200 transition-all flex items-center gap-1 cursor-pointer"
            title="Bagikan Poster"
          >
            <Share2 size={13} />
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="p-1.5 bg-white hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold border border-rose-200 transition-all flex items-center gap-1 cursor-pointer"
            title="Cetak Poster"
          >
            <Printer size={13} />
          </button>

          {/* Close if Modal */}
          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all cursor-pointer ml-1"
              title="Tutup Modal"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* CONTENT AREA: TOGGLED BETWEEN ORIGINAL IMAGE AND INTERACTIVE LAYOUT */}
      {activeView === "image" ? (
        <div className="bg-slate-900 rounded-b-2xl p-4 sm:p-6 border border-rose-100 shadow-inner flex flex-col items-center justify-center space-y-4">
          
          {posterImage ? (
            /* IMAGE DISPLAY WHEN LOADED */
            <div className="w-full space-y-3">
              {/* Zoom Controls Bar */}
              <div className="flex items-center justify-between gap-2 bg-slate-800/90 text-gray-200 px-3 py-1.5 rounded-xl border border-slate-700 text-xs backdrop-blur-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-300 font-medium">
                    Resolusi Gambar: Asli
                  </span>
                  <span className="text-[11px] bg-slate-700 text-rose-300 font-bold px-1.5 py-0.5 rounded">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.max(0.75, prev - 0.25))}
                    disabled={zoomLevel <= 0.75}
                    className="p-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 rounded text-gray-200 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(1)}
                    className="p-1 bg-slate-700 hover:bg-slate-600 rounded text-gray-200 cursor-pointer text-[10px] font-bold px-1.5"
                    title="Reset Zoom 100%"
                  >
                    100%
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.25))}
                    disabled={zoomLevel >= 2.5}
                    className="p-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 rounded text-gray-200 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetImage}
                    className="p-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded text-[10px] font-semibold px-2 ml-2 cursor-pointer"
                    title="Hapus gambar kustom"
                  >
                    Ganti / Hapus
                  </button>
                </div>
              </div>

              {/* Poster Image Container */}
              <div 
                className="w-full flex items-center justify-center overflow-auto max-h-[75vh] p-2 bg-slate-950/70 rounded-2xl border border-slate-800 shadow-2xl"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <img
                  src={posterImage}
                  alt="Poster Panduan Diet Ramah Ortodontik"
                  referrerPolicy="no-referrer"
                  style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}
                  className="rounded-xl shadow-2xl max-w-full h-auto object-contain transition-transform duration-200 ease-out"
                />
              </div>

              {/* Bottom Quick Caption Bar */}
              <div className="flex items-center justify-between gap-2 text-[11px] text-gray-400 px-1">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  <span>Poster resmi panduan diet ramah ortodontik siap digunakan pasien.</span>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveView("interactive")}
                  className="text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer"
                >
                  Buka ringkasan teks &amp; menu ➔
                </button>
              </div>
            </div>
          ) : (
            /* DROPZONE / FILE SELECTOR WHEN NO IMAGE HAS BEEN LOADED YET */
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full max-w-2xl mx-auto my-4 p-8 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center text-center space-y-4 ${
                isDragging 
                  ? "border-rose-400 bg-rose-950/40 scale-[1.01]" 
                  : "border-slate-700 bg-slate-800/50 hover:border-rose-500/70 hover:bg-slate-800/80"
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-rose-950/50">
                <ImageIcon size={32} />
              </div>

              <div className="space-y-1.5 max-w-md">
                <h3 className="text-base font-extrabold text-white">
                  Tampilkan Gambar Asli Poster
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Pilih file gambar poster <strong className="text-rose-400">"ChatGPT Image Sep 3, 2026, 05_56_20 PM.png"</strong> dari perangkat Anda, atau tarik &amp; lepas file ke kotak ini.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-black rounded-xl shadow-lg shadow-rose-950/50 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Upload size={15} />
                  <span>Pilih File Gambar dari Perangkat</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView("interactive")}
                  className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-gray-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText size={14} />
                  <span>Lihat Versi Rincian Teks Dulu</span>
                </button>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80 text-[11px] text-gray-400 max-w-md text-left space-y-1">
                <p className="font-bold text-gray-300 flex items-center gap-1">
                  <Sparkles size={12} className="text-rose-400" />
                  <span>Penyimpanan Otomatis</span>
                </p>
                <p>
                  Setelah Anda memilih file gambar sekali, gambar akan otomatis disimpan di browser Anda sehingga selalu muncul setiap kali kartu diet dibuka.
                </p>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* INTERACTIVE FORMATTED POSTER VIEW (TEXT & STRUCTURED CARDS) */
        <div className="bg-gradient-to-b from-amber-50/40 via-white to-pink-50/30 p-4 sm:p-7 md:p-8 rounded-b-2xl border border-rose-100 shadow-sm space-y-6 select-text">
          
          {/* POSTER HEADER */}
          <div className="text-center space-y-3 relative pb-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-rose-500 text-white shadow-md mx-auto transform -rotate-3 hover:rotate-0 transition-transform">
              <Heart size={22} fill="currentColor" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-rose-600 uppercase font-sans drop-shadow-xs">
                PANDUAN DIET
              </h2>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-800 uppercase">
                RAMAH ORTODONTIK
              </h3>
            </div>

            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 sm:px-6 py-1.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wide shadow-xs">
              <Sparkles size={14} className="text-amber-200" />
              <span>Makan Sehat, Behel Aman, Senyum Maksimal!</span>
              <Sparkles size={14} className="text-amber-200" />
            </div>

            <div className="max-w-2xl mx-auto pt-2">
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                Braket behel ditempelkan ke gigi menggunakan semen resin khusus. Meskipun kuat, braket memiliki batas kekuatan. 
                <strong className="text-rose-700 font-bold"> Makanan yang tepat akan menjaga behel tetap aman dan mempercepat waktu perawatan Anda!</strong>
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-1 flex-wrap">
              <div className="bg-white px-3 py-1 rounded-xl border border-rose-200 shadow-2xs flex items-center gap-2">
                <span className="text-lg">🦷</span>
                <span className="text-[11px] font-extrabold text-rose-800">
                  Jaga Makanan, Jaga Behel, Jaga Senyum!
                </span>
              </div>
            </div>
          </div>

          {/* 2 MAIN COLUMNS: MAKANAN DIHINDARI (RED) VS DIANJURKAN (GREEN) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            
            {/* LEFT COLUMN: MAKANAN YANG WAJIB DIHINDARI */}
            <div className="bg-white rounded-2xl border-2 border-rose-200 shadow-xs overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-rose-600 to-red-600 text-white p-3.5 sm:p-4 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white text-rose-600 flex items-center justify-center font-black shrink-0 shadow-2xs">
                  <X size={20} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wide">
                    MAKANAN YANG WAJIB DIHINDARI
                  </h4>
                  <p className="text-[10px] text-rose-100">Bisa mematahkan bracket dan merusak kawat behel</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-4 flex-1 divide-y divide-rose-50">
                <div className="pt-2 first:pt-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🥜</span>
                    <h5 className="text-xs font-black text-rose-950 uppercase tracking-wide">
                      MAKANAN KERAS
                    </h5>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed pl-7">
                    Keripik singkong tebal, kerupuk keras, es batu (jangan dikunyah!), kacang tanah/almond utuh, wortel mentah utuh, apel utuh 
                    <span className="text-rose-700 font-semibold"> (potong kecil terlebih dahulu).</span>
                  </p>
                </div>

                <div className="pt-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🍬</span>
                    <h5 className="text-xs font-black text-rose-950 uppercase tracking-wide">
                      MAKANAN LENGKET
                    </h5>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed pl-7">
                    Permen karet (gum), dodol, karamel, marshmallow, jeli kenyal. Makanan ini bisa melilit kawat, melepas braket, atau menggeser band logam pada geraham.
                  </p>
                </div>

                <div className="pt-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🍩</span>
                    <h5 className="text-xs font-black text-rose-950 uppercase tracking-wide">
                      MAKANAN TINGGI GULA
                    </h5>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed pl-7">
                    Batasi konsumsi soda, boba manis, permen, dan donat. Gula sangat mudah terjebak di sekitar braket dan mempercepat pembusukan gigi (<span className="italic font-semibold text-rose-700">white spot lesions</span>).
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: MAKANAN YANG DIANJURKAN */}
            <div className="bg-white rounded-2xl border-2 border-emerald-200 shadow-xs overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3.5 sm:p-4 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white text-emerald-600 flex items-center justify-center font-black shrink-0 shadow-2xs">
                  <Check size={20} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wide">
                    MAKANAN YANG DIANJURKAN
                  </h4>
                  <p className="text-[10px] text-emerald-100">Aman dikunyah, bernutrisi tinggi, dan meredakan nyeri</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-4 flex-1 divide-y divide-emerald-50">
                <div className="pt-2 first:pt-0 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🍧</span>
                    <h5 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                      SUHU DINGIN UNTUK MEREDAKAN NYERI
                    </h5>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed pl-7">
                    Es krim, yoghurt dingin, jus buah dingin, smoothie, atau puding dingin. Dingin dapat mengurangi peradangan gusi karena efek vasokonstriksi minor.
                  </p>
                </div>

                <div className="pt-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🍲</span>
                    <h5 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                      MAKANAN LUNAK &amp; TINGGI NUTRISI
                    </h5>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed pl-7">
                    Bubur ayam, sup krim ayam, kentang tumbuk (<span className="italic">mashed potato</span>), telur orak-arik (<span className="italic">scrambled eggs</span>), pasta/makaroni keju lunak, tahu dan tempe kukus, ikan panggang/tim tanpa duri.
                  </p>
                </div>

                <div className="pt-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">💧</span>
                    <h5 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                      JANGAN LUPA MINUM AIR PUTIH!
                    </h5>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed pl-7">
                    Air putih membantu menjaga kebersihan mulut dan melancarkan pencernaan. Hindari minuman manis dan bersoda!
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* PURPLE MIDDLE HIGHLIGHT CONTAINER */}
          <div className="bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center relative z-10">
              <div className="md:col-span-6 space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-400 text-gray-950 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle size={17} strokeWidth={2.5} />
                  </div>
                  <p className="text-xs font-bold text-amber-200 leading-snug">
                    Makanan keras, lengket, dan tinggi gula dapat merusak braket dan menghambat proses perawatan!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-gray-200">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Menjaga braket tetap menempel</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Mencegah kerusakan alat ortodontik</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Meminimalisir plak dan karies</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Mempercepat waktu perawatan</span>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex md:col-span-1 justify-center">
                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xl shadow-inner">
                  🦷
                </div>
              </div>

              <div className="md:col-span-5 space-y-2.5 bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-xs">
                <h4 className="text-xs font-black tracking-wider text-purple-200 uppercase flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-300" />
                  <span>TIPS PRAKTIS SETIAP HARI</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-100">
                  <li className="flex items-start gap-2">
                    <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Potong makanan menjadi potongan kecil</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Kunyah perlahan dengan gigi belakang</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Hindari menggigit langsung dengan gigi depan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>Sikat gigi setelah makan &amp; gunakan benang ortodontik</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: CONTOH MENU HARIAN & NOTE DOKTER */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* CONTOH MENU HARIAN */}
            <div className="md:col-span-7 bg-sky-50/70 border border-sky-200 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0">
                  <Utensils size={15} />
                </div>
                <h4 className="text-xs sm:text-sm font-black text-sky-950 uppercase tracking-wide">
                  CONTOH MENU HARIAN RAMAH ORTODONTIK
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-sky-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-600 font-bold text-[11px]">
                    <Sun size={13} />
                    <span>PAGI</span>
                  </div>
                  <p className="text-gray-700 text-[11px] leading-snug">
                    Bubur ayam + telur orak-arik + jus buah tanpa gula
                  </p>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-sky-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-700 font-bold text-[11px]">
                    <Sun size={13} />
                    <span>SIANG</span>
                  </div>
                  <p className="text-gray-700 text-[11px] leading-snug">
                    Sup krim ayam + kentang tumbuk + tahu kukus
                  </p>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-sky-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-orange-600 font-bold text-[11px]">
                    <Sunset size={13} />
                    <span>SORE (CAMILAN)</span>
                  </div>
                  <p className="text-gray-700 text-[11px] leading-snug">
                    Yogurt + buah lembut (pisang / pepaya)
                  </p>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-sky-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-[11px]">
                    <Moon size={13} />
                    <span>MALAM</span>
                  </div>
                  <p className="text-gray-700 text-[11px] leading-snug">
                    Ikan tim + nasi lembut + sayur tumis matang + puding
                  </p>
                </div>
              </div>
            </div>

            {/* DOKTER NOTE & MOTIVASI */}
            <div className="md:col-span-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 shadow-2xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">💡</span>
                  <h4 className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wide">
                    INGAT!
                  </h4>
                </div>
                <p className="text-xs text-gray-800 leading-relaxed font-medium">
                  Perawatan ortodontik adalah investasi untuk senyum indah Anda. Disiplin menjaga makanan, sama pentingnya dengan rutin kontrol ke dokter gigi!
                </p>
              </div>

              <div className="pt-2 border-t border-amber-200/80">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-2.5 rounded-xl text-center shadow-xs">
                  <p className="text-xs font-black uppercase tracking-wide flex items-center justify-center gap-1.5">
                    <Smile size={15} />
                    <span>Senyum Sehat, Percaya Diri Meningkat!</span>
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* FOOTER BAR */}
          <div className="bg-slate-900 text-white rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <Heart size={14} className="text-rose-400 shrink-0 fill-current" />
              <p className="text-[11px] text-gray-300">
                Konsultasi rutin dan kepatuhan terhadap diet akan membantu Anda mendapatkan hasil perawatan yang optimal dan tepat waktu.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-300 uppercase tracking-wider shrink-0 bg-white/10 px-3 py-1 rounded-lg">
              <span>🦷</span>
              <span>JAGA MAKANAN, JAGA BEHEL, JAGA SENYUM!</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
