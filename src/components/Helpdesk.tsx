import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Smile, 
  AlertTriangle, 
  HelpCircle, 
  HeartHandshake, 
  ShieldCheck, 
  Calendar,
  Loader2
} from "lucide-react";
import { ChatMessage } from "../types";

interface HelpdeskProps {
  chatHistory: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
}

export default function Helpdesk({ chatHistory, onAddMessage }: HelpdeskProps) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  const quickQuestions = [
    {
      label: "Bracket Lepas (Bracket Off)",
      text: "Saya tidak sengaja melepaskan satu bracket besi saya saat mengunyah keripik. Apa pertolongan pertamanya?"
    },
    {
      label: "Kawat Menusuk Pipi",
      text: "Kawat ortodontik belakang menusuk pipi dalam saya hingga sariawan. Bagaimana mengatasinya?"
    },
    {
      label: "Gigi Ngilu setelah Kontrol",
      text: "Gigi saya terasa sangat ngilu dan kencang setelah kontrol ganti karet kemarin. Boleh minum obat apa?"
    },
    {
      label: "Aturan Aligner Alami",
      text: "Berapa jam minimal saya harus memakai clear aligner gigi saya dalam sehari?"
    }
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // 1. Add user message to state
    const userMsg: ChatMessage = {
      id: `M-${Date.now()}-user`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    onAddMessage(userMsg);
    setInputText("");
    setIsLoading(true);

    // 2. Prepare payload of recent messages
    const recentMessages = [...chatHistory, userMsg].slice(-8); // send last 8 messages for context

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: recentMessages })
      });

      if (!response.ok) {
        throw new Error("Respon server bermasalah");
      }

      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        id: `M-${Date.now()}-ai`,
        sender: "ai",
        text: data.text || "Mohon maaf, saya sedang mengalami kendala jaringan.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      onAddMessage(aiMsg);
    } catch (err) {
      console.error("Gagal berkonsultasi dengan asisten AI:", err);
      
      // Fallback response if network or API key fails
      const fallbackReplies: { [key: string]: string } = {
        "bracket": "Jangan panik jika bracket lepas. Keringkan daerah tersebut dengan cotton bud, pasangkan lilin dental (orthodontic wax) di atas bracket agar tidak melukai pipi Anda, lalu simpan bracket-nya dan segera hubungi asisten klinik kami untuk jadwal pengeleman ulang.",
        "kawat": "Ujung kawat yang menusuk (poking wire) bisa diatasi sementara dengan menempelkan dental wax medis seukuran biji jagung. Tekan kuat di kawat yang tajam. Berkumurlah dengan air garam hangat untuk meredakan radang.",
        "ngilu": "Rasa nyeri setelah kontrol behel wajar terjadi selama 3-5 hari pertama karena pergerakan tulang alveolar. Anda disarankan makan bubur, sup hangat, atau minum obat pereda nyeri parasetamol 500mg sesuai dosis apabila terasa sangat mengganggu.",
        "aligner": "Clear aligner gigi wajib digunakan minimal 20 hingga 22 jam setiap hari. Aligner hanya boleh dilepas saat Anda makan, minum cairan panas atau manis, dan saat menyikat gigi. Bersihkan aligner dengan air mengalir dingin/suhu ruang."
      };

      let fallbackText = "Terima kasih atas pesan Anda. Kami sarankan Anda berkumur air garam hangat dan menghubungi asisten administrasi klinik kami di jam kerja untuk mendapatkan penanganan langsung oleh drg. Shinta, Sp.Ort.";
      
      // Match query word
      const textLower = textToSend.toLowerCase();
      for (const [key, val] of Object.entries(fallbackReplies)) {
        if (textLower.includes(key)) {
          fallbackText = val;
          break;
        }
      }

      fallbackText += "\n\n(Catatan: Asisten AI sedang berjalan dalam mode darurat luring. Edukasi ini bersifat pertolongan pertama sementara.)";

      const aiMsg: ChatMessage = {
        id: `M-${Date.now()}-ai`,
        sender: "ai",
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      onAddMessage(aiMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[550px]" id="helpdesk-root">
      
      {/* Sidebar: Emergency FAQs & Quick Ask */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle size={18} />
            <h2 className="text-base font-bold text-gray-900">Pertolongan Pertama</h2>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Klik salah satu tombol darurat di bawah untuk langsung menanyakan panduan medis Kemenkes terkait keluhan ortodontik Anda:
          </p>

          <div className="space-y-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.text)}
                disabled={isLoading}
                className="w-full text-left p-3 bg-gray-50 hover:bg-pink-50 hover:text-pink-900 text-gray-700 rounded-xl border border-gray-150 text-[11px] transition-all flex items-start gap-2 font-semibold disabled:opacity-50"
              >
                <HelpCircle className="text-pink-600 shrink-0 mt-0.5" size={14} />
                <span>{q.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quality trust badge */}
        <div className="pt-4 border-t border-gray-100 space-y-2 text-[11px] text-gray-500">
          <div className="flex items-center gap-2 text-pink-700 font-bold">
            <ShieldCheck size={16} />
            <span>Kemenkes RME Compliance</span>
          </div>
          <p className="leading-normal">
            Asisten AI kami merujuk pada Pedoman Nasional Pelayanan Kedokteran Gigi Ortodonsia Indonesia.
          </p>
        </div>
      </div>

      {/* Main Panel: Conversation Window */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between overflow-hidden">
        
        {/* Chat header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-4 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold">
              AI
            </div>
            <div>
              <h3 className="text-xs font-black tracking-wide uppercase">Asisten AI Ortho-Care</h3>
              <p className="text-[10px] text-pink-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                Konsultasi luring & daring aktif
              </p>
            </div>
          </div>
          <HeartHandshake size={20} className="text-pink-200" />
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-50/50">
          {chatHistory.map((msg) => {
            const isAI = msg.sender === "ai";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isAI ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                {isAI && (
                  <div className="w-8 h-8 rounded-full bg-pink-50 border border-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                    AI
                  </div>
                )}
                <div className="space-y-1">
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-sm border ${
                      isAI
                        ? "bg-white text-gray-800 border-gray-100 rounded-tl-none"
                        : "bg-pink-500 text-white border-pink-500 rounded-tr-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className={`text-[9px] text-gray-400 block ${isAI ? "text-left pl-1" : "text-right pr-1"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-pink-50 border border-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold shrink-0">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <div className="p-3 bg-white text-gray-500 border border-gray-100 rounded-2xl rounded-tl-none text-xs flex items-center gap-2">
                <span>AI sedang menganalisis keluhan...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Tulis pertanyaan Anda tentang behel/aligner..."
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500 focus:bg-white transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white transition-all shadow-sm flex items-center justify-center shrink-0 disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
