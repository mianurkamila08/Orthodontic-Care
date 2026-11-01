import express from "express";
import type { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google Gemini SDK server-side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined. AI Helpdesk will use a fallback simulated helper.");
}

// System instructions for the Kemenkes-aligned Orthodontic Specialist AI Assistant
const systemPrompt = `Anda adalah "Asisten AI Ortho-Care", asisten cerdas khusus perawatan behel (brackets) dan aligner gigi transparan, yang dibuat selaras dengan standar Kementerian Kesehatan Republik Indonesia (Kemenkes RI) dan Persatuan Dokter Gigi Indonesia (PDGI).

Tugas Anda:
1. Memberikan penjelasan edukatif tentang perawatan ortodontik (behel metal/keramik/self-ligating, serta clear aligner).
2. Menjelaskan cara menjaga kesehatan gigi dan mulut (oral hygiene) selama perawatan behel sesuai anjuran medis: sikat gigi minimal 3 kali sehari setelah makan, menggunakan sikat khusus orthodontic, sikat interdental (interdental brush), superfloss, dan obat kumur non-alkohol jika diresepkan.
3. Memberikan solusi darurat aman untuk keluhan umum:
   - Kawat menusuk pipi/sariawan: aplikasikan lilin ortodontik (orthodontic wax) pada bagian kawat yang tajam, kumur air garam hangat.
   - Bracket lepas (bracket off): jangan ditelan, simpan bracketnya, segera hubungi dokter gigi untuk dijadwalkan pengeleman ulang (bonding).
   - Nyeri setelah kontrol: biasanya berlangsung 3-5 hari. Berikan kompres dingin di pipi luar, makan makanan lunak, atau minum obat pereda nyeri (misal parasetamol) sesuai dosis dan resep dokter gigi.
4. Menjelaskan panduan diet sehat: hindari makanan keras (keripik tebal, es batu, kacang keras), makanan lengket (permen karet, dodol, karamel), dan batasi gula untuk mencegah karies sekunder di sekitar bracket.
5. Menjelaskan cara merawat clear aligner: gunakan 20-22 jam per hari, bersihkan dengan air mengalir suhu ruang/dingin dan sabun lembut, jangan gunakan air panas atau merendam di obat kumur berwarna karena dapat mengubah bentuk dan warna aligner.

Gaya Komunikasi:
- Ramah, empatik, profesional, dan menggunakan Bahasa Indonesia yang mudah dipahami oleh pasien umum.
- Sampaikan informasi dengan runtut menggunakan poin-poin yang scannable jika instruksinya panjang.
- Berikan disclaimer wajib di setiap akhir respon penting: "Disclaimer: Edukasi AI ini bertujuan sebagai pertolongan pertama & panduan umum, serta tidak menggantikan pemeriksaan langsung oleh Dokter Gigi Spesialis Ortodonsia (Sp.Ort) Anda."`;

// API endpoint for Helpdesk AI Assistant Chat
app.post("/api/gemini/chat", async (req: Request, res: Response) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "Format request tidak valid. Diperlukan array messages." });
    return;
  }

  // Fallback if Gemini API Key is missing
  if (!ai) {
    const lastUserMessage = messages[messages.length - 1]?.text || "Halo";
    const lowercaseMsg = lastUserMessage.toLowerCase();
    let reply = "Terima kasih atas pertanyaan Anda. Layanan AI asisten sedang berjalan dalam mode lokal karena kunci API belum dikonfigurasi. ";

    if (lowercaseMsg.includes("behel") || lowercaseMsg.includes("sikat")) {
      reply += "Untuk pengguna behel, sikatlah gigi minimal 3 kali sehari (pagi setelah sarapan, siang setelah makan siang, dan malam sebelum tidur) menggunakan sikat gigi ortodontik dan sikat sela (interdental brush) untuk membersihkan sisa makanan di bawah kawat.";
    } else if (lowercaseMsg.includes("sakit") || lowercaseMsg.includes("nyeri")) {
      reply += "Rasa ngilu setelah kontrol behel adalah wajar selama 3-5 hari. Anda dianjurkan makan makanan lunak (bubur, sup, jus) dan mengompres pipi bagian luar dengan kain dingin.";
    } else if (lowercaseMsg.includes("kawat") || lowercaseMsg.includes("sariawan")) {
      reply += "Jika kawat menusuk atau menyebabkan sariawan, gunakan lilin ortodontik (dental wax) dengan cara membulatkannya kecil-kecil lalu ditempelkan pada bagian kawat atau bracket yang tajam tersebut.";
    } else {
      reply += "Kami menyarankan Anda menjaga kebersihan gigi dengan rajin menyikat gigi secara vertikal dan memutar, serta menghindari makanan keras dan lengket.";
    }
    reply += "\n\nDisclaimer: Edukasi ini bertujuan sebagai panduan umum, serta tidak menggantikan pemeriksaan langsung oleh Dokter Gigi Spesialis Ortodonsia (Sp.Ort) Anda.";

    res.json({ text: reply });
    return;
  }

  try {
    // Format messages into Content array for Gemini SDK
    // Convert to Gemini format
    const geminiContents = messages.map((m: any) => {
      return {
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      };
    });

    // Make the content generation call
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: geminiContents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "Mohon maaf, saya tidak dapat memahami keluhan tersebut. Silakan hubungi klinik gigi secara langsung.";
    res.json({ text: replyText });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Gagal memproses konsultasi dengan asisten AI.",
      details: error.message
    });
  }
});

// === GOOGLE OAUTH ENDPOINTS ===

// 1. Get Google OAuth Authorization URL
app.get("/api/auth/google/url", (req: Request, res: Response) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  // Base URL for app (prioritize process.env.APP_URL)
  let baseUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
  // Remove trailing slash if present
  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }

  const redirectUri = `${baseUrl}/auth/callback`;

  if (!clientId || !clientSecret) {
    // If not configured, route to our beautiful mock Google Sign-In consent page
    const mockUrl = `${baseUrl}/auth/google/mock`;
    res.json({ url: mockUrl, isMock: true });
    return;
  }

  // Real Google OAuth URL
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state: "google",
    prompt: "select_account"
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.json({ url: authUrl, isMock: false });
});

// 2. Mock Google Account Selection Page (when GOOGLE_CLIENT_ID/SECRET are not set)
app.get("/auth/google/mock", (req: Request, res: Response) => {
  let baseUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }
  const redirectUri = `${baseUrl}/auth/callback`;

  res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sign in with Google - Sandbox</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-50 min-h-screen flex items-center justify-center p-4 font-sans">
      <div class="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-6 space-y-6">
        <!-- Header -->
        <div class="text-center space-y-2">
          <svg class="w-10 h-10 mx-auto" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.04-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <h1 class="text-xl font-black text-gray-900 tracking-tight">Login dengan Google</h1>
          <p class="text-xs text-pink-600 font-bold bg-pink-50 p-3 rounded-2xl border border-pink-100/50 leading-relaxed">
            <strong>Sandbox Mode Terdeteksi</strong><br/>
            Kunci API Google Client ID belum dikonfigurasi di file Rahasia. Di bawah ini adalah simulasi akun yang dapat Anda pilih untuk menguji alur autentikasi.
          </p>
        </div>

        <!-- List of Accounts -->
        <div class="space-y-3">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Silakan Pilih Akun Google:</p>
          
          <button onclick="selectAccount('Mia Nurkamila', 'mianurkamila08@gmail.com', 'RM-2604-1066')" class="w-full flex items-center gap-3 p-3.5 border border-gray-150 hover:border-pink-300 rounded-2xl transition-all hover:bg-pink-50/10 text-left cursor-pointer group">
            <div class="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-black group-hover:scale-105 transition-all">M</div>
            <div class="flex-1">
              <p class="text-xs font-bold text-gray-900">Mia Nurkamila</p>
              <p class="text-[10px] text-gray-500 font-medium">mianurkamila08@gmail.com</p>
              <span class="inline-block text-[8px] font-black text-pink-700 bg-pink-50 border border-pink-100 px-1.5 py-0.2 rounded mt-1">Pasien (ID: RM-2604-1066)</span>
            </div>
          </button>

          <button onclick="selectAccount('Aditya Pratama', 'aditya.pratama@gmail.com', 'P-101')" class="w-full flex items-center gap-3 p-3.5 border border-gray-150 hover:border-pink-300 rounded-2xl transition-all hover:bg-pink-50/10 text-left cursor-pointer group">
            <div class="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-black group-hover:scale-105 transition-all">A</div>
            <div class="flex-1">
              <p class="text-xs font-bold text-gray-900">Aditya Pratama</p>
              <p class="text-[10px] text-gray-500 font-medium">aditya.pratama@gmail.com</p>
              <span class="inline-block text-[8px] font-black text-sky-700 bg-sky-50 border border-sky-100 px-1.5 py-0.2 rounded mt-1">Pasien (ID: P-101)</span>
            </div>
          </button>

          <button onclick="selectAccount('drg. Shinta Amalia, Sp.Ort', 'shinta.ortho@gmail.com', 'dentist')" class="w-full flex items-center gap-3 p-3.5 border border-gray-150 hover:border-pink-300 rounded-2xl transition-all hover:bg-pink-50/10 text-left cursor-pointer group">
            <div class="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-black group-hover:scale-105 transition-all">S</div>
            <div class="flex-1">
              <p class="text-xs font-bold text-gray-900">drg. Shinta Amalia, Sp.Ort</p>
              <p class="text-[10px] text-gray-500 font-medium">shinta.ortho@gmail.com</p>
              <span class="inline-block text-[8px] font-black text-purple-700 bg-purple-50 border border-purple-100 px-1.5 py-0.2 rounded mt-1">Dokter Gigi Spesialis</span>
            </div>
          </button>

          <div class="border-t border-gray-100 pt-4 space-y-2">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Atau Akun Google Baru:</p>
            <div class="space-y-2.5">
              <input type="text" id="custom-name" placeholder="Nama Lengkap" class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500 bg-slate-50 focus:bg-white transition-all">
              <input type="email" id="custom-email" placeholder="nama@gmail.com" class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-pink-500 bg-slate-50 focus:bg-white transition-all">
              <button onclick="useCustom()" class="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">Gunakan Akun Kustom</button>
            </div>
          </div>
        </div>

        <script>
          const redirectUri = "${redirectUri}";
          
          function selectAccount(name, email, roleId) {
            const url = redirectUri + "?code=mock_" + btoa(JSON.stringify({ name, email, roleId })) + "&state=google";
            window.location.href = url;
          }

          function useCustom() {
            const name = document.getElementById("custom-name").value.trim();
            const email = document.getElementById("custom-email").value.trim();
            if (!name || !email) {
              alert("Mohon isi Nama Lengkap dan Email!");
              return;
            }
            selectAccount(name, email, "patient");
          }
        </script>
      </div>
    </body>
    </html>
  `);
});

// 3. Google OAuth Callback (Exchanges Code for User Info, executes postMessage to let client login)
app.get(["/auth/callback", "/auth/callback/"], async (req: Request, res: Response) => {
  const { code, state } = req.query;

  let name = "Google User";
  let email = "user@gmail.com";
  let picture = "";
  let roleId = "patient";
  let isMock = false;

  if (typeof code === "string" && code.startsWith("mock_")) {
    isMock = true;
    try {
      const dataStr = Buffer.from(code.replace("mock_", ""), "base64").toString();
      const parsed = JSON.parse(dataStr);
      name = parsed.name || name;
      email = parsed.email || email;
      roleId = parsed.roleId || roleId;
    } catch (e) {
      console.error("Failed to parse mock Google code:", e);
    }
  } else {
    // Real Google OAuth callback exchange code for token
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    let baseUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
    if (baseUrl.endsWith("/")) {
      baseUrl = baseUrl.slice(0, -1);
    }
    const redirectUri = `${baseUrl}/auth/callback`;

    try {
      // Exchange code for token
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          code: String(code),
          client_id: String(clientId),
          client_secret: String(clientSecret),
          redirect_uri: redirectUri,
          grant_type: "authorization_code"
        }).toString()
      });

      if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        throw new Error(`Token exchange failed: ${errText}`);
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      // Fetch user profile info
      const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!profileRes.ok) {
        throw new Error(`Profile fetch failed: ${await profileRes.text()}`);
      }

      const profileData = await profileRes.json();
      name = profileData.name || name;
      email = profileData.email || email;
      picture = profileData.picture || picture;
      
      // Smart matching based on email
      if (email === "mianurkamila08@gmail.com") {
        roleId = "RM-2604-1066";
      } else if (email.includes("shinta") || email.includes("ortho") || name.toLowerCase().includes("shinta")) {
        roleId = "dentist";
      } else {
        roleId = "patient";
      }
    } catch (error: any) {
      console.error("Google OAuth callback error:", error);
      res.send(`
        <html>
          <body class="bg-rose-50 text-rose-900 font-sans p-6 text-center flex flex-col items-center justify-center min-h-screen">
            <div class="max-w-sm bg-white p-6 rounded-3xl border border-rose-150 shadow-md space-y-4">
              <h1 class="text-base font-bold">Gagal Masuk dengan Google</h1>
              <p class="text-xs text-rose-600 leading-normal">${error.message}</p>
              <button onclick="window.close()" class="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">Tutup Jendela</button>
            </div>
          </body>
        </html>
      `);
      return;
    }
  }

  // Render postMessage response to close window and log user in on main application
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Autentikasi Selesai</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-pink-50/10 min-h-screen flex items-center justify-center p-4 font-sans">
      <div class="text-center space-y-3">
        <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto font-black text-xl animate-bounce">✓</div>
        <h2 class="text-sm font-bold text-gray-800">Autentikasi Google Berhasil</h2>
        <p class="text-xs text-gray-500">Mempersiapkan masuk, jendela ini akan menutup secara otomatis...</p>
      </div>
      <script>
        if (window.opener) {
          window.opener.postMessage({
            type: 'OAUTH_AUTH_SUCCESS',
            user: {
              name: ${JSON.stringify(name)},
              email: ${JSON.stringify(email)},
              picture: ${JSON.stringify(picture)},
              roleId: ${JSON.stringify(roleId)},
              isMock: ${isMock}
            }
          }, '*');
          setTimeout(() => {
            window.close();
          }, 600);
        } else {
          window.location.href = '/';
        }
      </script>
    </body>
    </html>
  `);
});

// Mounting Vite middleware or static files
async function setupVite() {
  const isDev = process.env.NODE_ENV === "development" || (!process.env.NODE_ENV && !fs.existsSync(path.join(process.cwd(), 'dist', 'index.html')));

  if (isDev) {
    // In development mode, use Vite dev server middleware
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted successfully.");
  } else {
    // In production mode, serve pre-compiled static files from /dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static production assets from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Failed to boot full-stack server:", err);
});
