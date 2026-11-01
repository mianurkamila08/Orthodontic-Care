import { Patient, SOAPExam, EduArticle, PatientAccessLog } from "../types";
import { articleSubTopicsMap, articleCoverImages } from "./eduSubTopicsData";

export const initialPatients: Patient[] = [
  {
    id: "P-101",
    name: "Aditya Pratama",
    nik: "3174011204980003",
    dob: "1998-04-12",
    gender: "Laki-laki",
    phone: "081234567890",
    address: "Jl. Margonda Raya No. 45, Beji, Depok",
    bloodType: "O",
    allergies: "Alergi obat penisilin",
    createdAt: "2026-01-10T08:30:00Z",
    lastAccessAt: "2026-07-12T08:45:00Z",
    lastAccessAction: "Mengisi Buku Harian Gigi",
    accessCount: 14
  },
  {
    id: "P-102",
    name: "Siti Rahmawati",
    nik: "3275034509010002",
    dob: "2001-09-15",
    gender: "Perempuan",
    phone: "085698765432",
    address: "Perumahan Indah Permai Blok C3 No. 12, Bekasi",
    bloodType: "A",
    allergies: "Tidak ada",
    createdAt: "2026-02-14T09:15:00Z",
    lastAccessAt: "2026-07-11T14:15:00Z",
    lastAccessAction: "Membaca Panduan Edukasi Orto",
    accessCount: 8
  },
  {
    id: "P-103",
    name: "Rizky Ramadhan",
    nik: "3171022212030005",
    dob: "2003-12-22",
    gender: "Laki-laki",
    phone: "087711223344",
    address: "Jl. Tebet Barat Dalam VII No. 8, Jakarta Selatan",
    bloodType: "B",
    allergies: "Alergi debu",
    createdAt: "2026-03-20T10:00:00Z",
    lastAccessAt: undefined,
    lastAccessAction: "Belum pernah mengakses aplikasi",
    accessCount: 0
  },
  {
    id: "RM-2604-1066",
    name: "Mia Nurkamila",
    nik: "3273012604020001",
    dob: "2002-04-26",
    gender: "Perempuan",
    phone: "089678123456",
    address: "Jl. Caringin No. 102, Bandung",
    bloodType: "AB",
    allergies: "Tidak ada",
    createdAt: "2026-04-15T11:00:00Z",
    lastAccessAt: "2026-07-10T19:20:00Z",
    lastAccessAction: "Konsultasi Asisten AI Gigi",
    accessCount: 6
  }
];

export const initialAccessLogs: PatientAccessLog[] = [
  {
    id: "ACC-101",
    patientId: "P-101",
    patientName: "Aditya Pratama",
    timestamp: "2026-07-12T08:45:00Z",
    action: "fill_monitoring",
    actionLabel: "Mengisi Buku Harian Gigi",
    module: "Buku Harian Gigi",
    deviceInfo: "Chrome Mobile (Android 14)",
    details: "Mencatat skor nyeri 2/10 dan sikat gigi 4 kali"
  },
  {
    id: "ACC-102",
    patientId: "P-101",
    patientName: "Aditya Pratama",
    timestamp: "2026-07-12T08:40:00Z",
    action: "login",
    actionLabel: "Masuk ke Aplikasi",
    module: "Autentikasi",
    deviceInfo: "Chrome Mobile (Android 14)",
    details: "Login berhasil sebagai Pasien"
  },
  {
    id: "ACC-103",
    patientId: "P-102",
    patientName: "Siti Rahmawati",
    timestamp: "2026-07-11T14:15:00Z",
    action: "read_education",
    actionLabel: "Membaca Panduan Edukasi Orto",
    module: "Panduan Edukasi",
    deviceInfo: "Mobile Safari (iOS 17)",
    details: "Membaca artikel: Panduan Makanan Sehat Ramah Kawat Gigi"
  },
  {
    id: "ACC-104",
    patientId: "P-102",
    patientName: "Siti Rahmawati",
    timestamp: "2026-07-11T14:02:00Z",
    action: "login",
    actionLabel: "Masuk ke Aplikasi",
    module: "Autentikasi",
    deviceInfo: "Mobile Safari (iOS 17)",
    details: "Login akun pasien"
  },
  {
    id: "ACC-105",
    patientId: "RM-2604-1066",
    patientName: "Mia Nurkamila",
    timestamp: "2026-07-10T19:20:00Z",
    action: "ask_ai",
    actionLabel: "Konsultasi Asisten AI Gigi",
    module: "Chat Asisten AI",
    deviceInfo: "Chrome Desktop (Windows 11)",
    details: "Menanyakan penanganan pertama kawat behel menusuk pipi"
  },
  {
    id: "ACC-106",
    patientId: "P-101",
    patientName: "Aditya Pratama",
    timestamp: "2026-07-10T09:12:00Z",
    action: "view_rekam_medis",
    actionLabel: "Melihat Rekam Medis (RME)",
    module: "Rekam Medis Saya",
    deviceInfo: "Chrome Mobile (Android 14)",
    details: "Mengecek riwayat pemeriksaan dan jadwal kontrol rutin"
  },
  {
    id: "ACC-107",
    patientId: "RM-2604-1066",
    patientName: "Mia Nurkamila",
    timestamp: "2026-07-09T16:05:00Z",
    action: "view_dashboard",
    actionLabel: "Membuka Dashboard Pasien",
    module: "Dashboard",
    deviceInfo: "Chrome Desktop (Windows 11)",
    details: "Mengecek status kepatuhan perawatan ortodonti"
  }
];

export const initialExams: SOAPExam[] = [
  {
    id: "E-100-A1",
    patientId: "P-101",
    date: "2026-04-10",
    dentistName: "drg. Shinta Amalia, Sp.Ort",
    subjective: "Pemasangan kawat gigi pertama kali. Pasien merasa sangat ngilu dan sulit mengunyah.",
    objective: {
      generalStatus: "TD: 120/80 mmHg, Nadi: 80x/mnt, RR: 18x/mnt. Keadaan umum baik.",
      extraOral: "Wajah simetris, profil lurus, tidak ada kelainan TMJ.",
      intraOral: "Oral hygiene sedang, gingiva sehat.",
      malocclusionClass: "Angle Class I",
      overjet: 3,
      overbite: 2,
      crowdingUpper: true,
      crowdingLower: true,
      spacingUpper: false,
      spacingLower: false,
      odontogramNotes: "Lengkung rahang atas dan bawah crowding ringan.",
      pcrScore: 28.6,
      pcrTeethCount: 28,
      pcrPlaqueSurfacesCount: 32,
      pcrInterpretation: "Buruk"
    },
    assessment: "Maloklusi Kelas I Angle dengan crowding ringan atas bawah.",
    plan: {
      treatmentStage: "Leveling & Alignment",
      procedure: "Pemasangan bracket metal sda, penempatan NiTi wire 0.012.",
      prescription: "Orthodontic wax, Paracetamol 500mg prn.",
      nextVisitDate: "2026-05-12"
    }
  },
  {
    id: "E-100-A2",
    patientId: "P-101",
    date: "2026-05-12",
    dentistName: "drg. Shinta Amalia, Sp.Ort",
    subjective: "Kontrol ke-2. Ngilu awal sudah hilang, mengeluhkan sariawan karena bracket.",
    objective: {
      generalStatus: "TD: 118/78 mmHg, Nadi: 78x/mnt, RR: 16x/mnt.",
      extraOral: "Wajah simetris, TMJ normal.",
      intraOral: "OH baik, gingiva sehat, sariawan kecil di mukosa pipi kiri.",
      malocclusionClass: "Angle Class I",
      overjet: 3,
      overbite: 2,
      crowdingUpper: true,
      crowdingLower: true,
      spacingUpper: false,
      spacingLower: false,
      odontogramNotes: "Crowding mulai sedikit berkurang.",
      pcrScore: 15.2,
      pcrTeethCount: 28,
      pcrPlaqueSurfacesCount: 17,
      pcrInterpretation: "Buruk"
    },
    assessment: "Maloklusi Kelas I Angle dalam tahap leveling.",
    plan: {
      treatmentStage: "Leveling & Alignment",
      procedure: "Ganti kawat NiTi 0.014 atas bawah, edukasi sikat gigi sela.",
      prescription: "Aloclair gel sariawan.",
      nextVisitDate: "2026-06-15"
    }
  },
  {
    id: "E-101",
    patientId: "P-101",
    date: "2026-06-15",
    dentistName: "drg. Shinta Amalia, Sp.Ort",
    subjective: "Pasien mengeluhkan kawat ortodontik belakang terasa sedikit menusuk pada pipi kanan dalam sejak 2 hari yang lalu setelah kontrol rutin.",
    objective: {
      generalStatus: "TD: 120/80 mmHg, Nadi: 80x/mnt, RR: 18x/mnt. Keadaan umum baik.",
      extraOral: "Wajah simetris, profil lurus (straight profile), tidak ada kelainan TMJ.",
      intraOral: "Oral hygiene sedang (OHIS: 1.2), gingiva sehat, tidak ada kalkulus masif.",
      malocclusionClass: "Angle Class I",
      overjet: 3, // 3mm
      overbite: 2, // 2mm
      crowdingUpper: true,
      crowdingLower: true,
      spacingUpper: false,
      spacingLower: false,
      odontogramNotes: "Gigi 18, 28, 38, 48 impaksi (sudah diekstraksi). Lengkung rahang atas dan bawah mengalami crowding ringan.",
      pcrScore: 7.1,
      pcrTeethCount: 28,
      pcrPlaqueSurfacesCount: 8,
      pcrInterpretation: "Baik"
    },
    assessment: "Maloklusi Kelas I Angle disertai berjejal ringan rahang atas dan rahang bawah (Angle Class I Malocclusion with mild bimaxillary crowding).",
    plan: {
      treatmentStage: "Leveling & Alignment",
      procedure: "Pemasangan kawat NiTi 0.016 atas dan bawah, pemotongan kawat distal end kanan bawah agar tidak menusuk pipi pasien, edukasi pemasangan dental wax.",
      prescription: "Orthodontic wax (1 strip), Ibuprofen 400mg (prn nyeri maksimal 3x sehari).",
      nextVisitDate: "2026-07-15"
    }
  },
  {
    id: "E-100-S1",
    patientId: "P-102",
    date: "2026-04-18",
    dentistName: "drg. Shinta Amalia, Sp.Ort",
    subjective: "Pemasangan behel pertama rahang atas dan bawah. Pasien merasa gigi ditarik kuat.",
    objective: {
      generalStatus: "TD: 110/70 mmHg, Nadi: 76x/mnt, RR: 16x/mnt.",
      extraOral: "Wajah simetris, profil cembung.",
      intraOral: "OH sedang, banyak sisa makanan menempel di gigi belakang.",
      malocclusionClass: "Angle Class II Div 1",
      overjet: 5,
      overbite: 4,
      crowdingUpper: false,
      crowdingLower: true,
      spacingUpper: false,
      spacingLower: false,
      odontogramNotes: "Gigi 14, 24 dicabut.",
      pcrScore: 42.0,
      pcrTeethCount: 28,
      pcrPlaqueSurfacesCount: 47,
      pcrInterpretation: "Buruk"
    },
    assessment: "Maloklusi Kelas II Divisi 1 Angle.",
    plan: {
      treatmentStage: "Leveling & Alignment",
      procedure: "Pemasangan bracket metal, penempatan NiTi wire 0.012.",
      prescription: "Paracetamol 500mg, Orthodontic wax.",
      nextVisitDate: "2026-05-18"
    }
  },
  {
    id: "E-100-S2",
    patientId: "P-102",
    date: "2026-05-18",
    dentistName: "drg. Shinta Amalia, Sp.Ort",
    subjective: "Kontrol ke-2, mengeluhkan sikat gigi terasa menyakitkan karena gusi gampang berdarah.",
    objective: {
      generalStatus: "TD: 112/72 mmHg, Nadi: 78x/mnt, RR: 18x/mnt.",
      extraOral: "Wajah simetris, TMJ sehat.",
      intraOral: "Gingiva marginal anterior bawah hiperemis, OH kurang baik karena takut sikat gusi.",
      malocclusionClass: "Angle Class II Div 1",
      overjet: 5,
      overbite: 4,
      crowdingUpper: false,
      crowdingLower: true,
      spacingUpper: false,
      spacingLower: false,
      odontogramNotes: "Gigi anterior bawah mulai sejajar.",
      pcrScore: 22.3,
      pcrTeethCount: 28,
      pcrPlaqueSurfacesCount: 25,
      pcrInterpretation: "Buruk"
    },
    assessment: "Maloklusi Kelas II Divisi 1 Angle disertai gingivitis marginalis ringan.",
    plan: {
      treatmentStage: "Leveling & Alignment",
      procedure: "Pembersihan karang gigi ringan, ganti NiTi wire 0.014, edukasi menyikat gusi perlahan.",
      prescription: "Chlorhexidine mouthwash.",
      nextVisitDate: "2026-06-20"
    }
  },
  {
    id: "E-102",
    patientId: "P-102",
    date: "2026-06-20",
    dentistName: "drg. Shinta Amalia, Sp.Ort",
    subjective: "Kontrol bulanan rutin, merasa kencang setelah ganti wire. Pasien sangat patuh memakai karet elastis (elastics).",
    objective: {
      generalStatus: "TD: 115/75 mmHg, Nadi: 76x/mnt, RR: 16x/mnt. Keadaan umum baik.",
      extraOral: "Wajah simetris, profil sedikit cembung (slightly convex), TMJ normal.",
      intraOral: "Oral hygiene baik (OHIS: 0.8), gingiva kemerahan marginal di regio anterior bawah.",
      malocclusionClass: "Angle Class II Div 1",
      overjet: 5,
      overbite: 4,
      crowdingUpper: false,
      crowdingLower: true,
      spacingUpper: false,
      spacingLower: false,
      odontogramNotes: "Gigi 14 dan 24 dicabut untuk koreksi overjet besar.",
      pcrScore: 11.6,
      pcrTeethCount: 28,
      pcrPlaqueSurfacesCount: 13,
      pcrInterpretation: "Buruk"
    },
    assessment: "Maloklusi Kelas II Divisi 1 Angle dengan overjet berlebih (Overjet: 5mm) dalam tahap penutupan ruang.",
    plan: {
      treatmentStage: "Retraksi & Penutupan Ruang",
      procedure: "Aktivasi power chain rahang atas untuk retraksi anterior, penyesuaian karet elastis Class II bilateral (ukuran 1/4 - 4.5 oz), kontrol oral hygiene.",
      prescription: "Chlorhexidine Gluconate 0.2% mouthwash (obat kumur pagi & malam).",
      nextVisitDate: "2026-07-20"
    }
  },
  {
    id: "E-100-M1",
    patientId: "RM-2604-1066",
    date: "2026-04-15",
    dentistName: "drg. Shinta Amalia, Sp.Ort",
    subjective: "Pemasangan behel atas dan bawah. Mengeluh bibir dalam tergores dan nyeri saat menggigit nasi.",
    objective: {
      generalStatus: "TD: 110/70 mmHg, Nadi: 80x/mnt, RR: 18x/mnt.",
      extraOral: "Wajah simetris, profil lurus.",
      intraOral: "Oral hygiene sedang, terdapat sedikit kalkulus pada anterior bawah.",
      malocclusionClass: "Angle Class I",
      overjet: 3,
      overbite: 3,
      crowdingUpper: true,
      crowdingLower: true,
      spacingUpper: false,
      spacingLower: false,
      odontogramNotes: "Crowding anterior atas dan bawah.",
      pcrScore: 35.5,
      pcrTeethCount: 28,
      pcrPlaqueSurfacesCount: 40,
      pcrInterpretation: "Buruk"
    },
    assessment: "Maloklusi Kelas I Angle dengan crowding bilerat anterior.",
    plan: {
      treatmentStage: "Leveling & Alignment",
      procedure: "Pembersihan karang gigi, penempelan bracket metal, NiTi wire 0.012.",
      prescription: "Paracetamol 500mg, Orthodontic wax.",
      nextVisitDate: "2026-05-20"
    }
  },
  {
    id: "E-100-M2",
    patientId: "RM-2604-1066",
    date: "2026-05-20",
    dentistName: "drg. Shinta Amalia, Sp.Ort",
    subjective: "Kontrol ke-2. Nyeri sudah hilang, sikat gigi masih kadang berdarah di gusi belakang.",
    objective: {
      generalStatus: "TD: 108/68 mmHg, Nadi: 82x/mnt, RR: 16x/mnt.",
      extraOral: "Wajah simetris, TMJ normal.",
      intraOral: "OH membaik, gingiva sehat except marginal gusi 16 dan 26 agak udematus.",
      malocclusionClass: "Angle Class I",
      overjet: 2.8,
      overbite: 2.5,
      crowdingUpper: false,
      crowdingLower: true,
      spacingUpper: false,
      spacingLower: false,
      odontogramNotes: "Gigi anterior atas mulai rata.",
      pcrScore: 18.8,
      pcrTeethCount: 28,
      pcrPlaqueSurfacesCount: 21,
      pcrInterpretation: "Buruk"
    },
    assessment: "Maloklusi Kelas I Angle dalam tahap alignment.",
    plan: {
      treatmentStage: "Leveling & Alignment",
      procedure: "Aktivasi NiTi wire 0.014 atas bawah, instruksi oral hygiene optimal.",
      prescription: "Chlorhexidine mouthwash.",
      nextVisitDate: "2026-06-25"
    }
  },
  {
    id: "E-103",
    patientId: "RM-2604-1066",
    date: "2026-06-25",
    dentistName: "drg. Shinta Amalia, Sp.Ort",
    subjective: "Kontrol ke-4 perawatan kawat gigi rahang atas dan bawah. Pasien mengeluhkan ada sariawan kecil di bibir kiri bawah karena tergesek bracket gigi taring.",
    objective: {
      generalStatus: "TD: 110/70 mmHg, Nadi: 82x/mnt, RR: 18x/mnt. Kondisi umum sehat.",
      extraOral: "Wajah simetris, profil lurus (straight), TMJ normal tidak terdengar clicking.",
      intraOral: "Oral hygiene baik, gingiva sehat di seluruh regio kecuali hiperemi ringan dekat bracket 33.",
      malocclusionClass: "Angle Class I",
      overjet: 2.5,
      overbite: 2.0,
      crowdingUpper: false,
      crowdingLower: true,
      spacingUpper: false,
      spacingLower: false,
      odontogramNotes: "Crowding rahang atas sudah terkoreksi seluruhnya. Masih ada rotasi ringan pada gigi 32 dan 42.",
      pcrScore: 8.9,
      pcrTeethCount: 28,
      pcrPlaqueSurfacesCount: 10,
      pcrInterpretation: "Baik"
    },
    assessment: "Maloklusi Kelas I Angle dengan crowding anterior bawah sedang dalam tahap akhir leveling.",
    plan: {
      treatmentStage: "Leveling & Alignment",
      procedure: "Aktivasi wire rahang bawah NiTi 0.016 dengan pengikatan ligature wire pada gigi 32 dan 42 untuk koreksi rotasi. Aplikasi antiseptic gel pada sariawan regio bibir kiri bawah.",
      prescription: "Kenalog in Orabase salep sariawan, sikat gigi interdental tambahan.",
      nextVisitDate: "2026-07-25"
    }
  }
];

const rawEduArticles: EduArticle[] = [
  {
    id: "edu-1",
    title: "Cara Menyikat Gigi yang Benar bagi Pengguna Behel",
    category: "Braces Care",
    summary: "Panduan praktis menjaga kebersihan gigi (oral hygiene) agar bracket tidak lepas dan mencegah karang gigi.",
    content: `Kesehatan gigi dan mulut selama perawatan ortodontik aktif adalah hal yang sangat vital. Sesuai anjuran Kementerian Kesehatan RI (Kemenkes), pengguna behel wajib melakukan teknik sikat gigi khusus untuk menghindari penumpukan plak (karies sekunder) dan radang gusi (gingivitis).

Langkah sikat gigi behel yang benar:
1. **Gunakan Sikat Gigi Ortodontik (V-Trim):** Bulu sikat bagian tengah lebih pendek membentuk huruf V, didesain untuk membersihkan sela-sela bracket sekaligus gusi.
2. **Sudut Kemiringan 45 Derajat:** Miringkan bulu sikat ke arah gusi di atas bracket, sikat dengan gerakan memutar perlahan. Lakukan hal yang sama untuk bagian bawah bracket dengan mengarah ke atas.
3. **Sikat Gigi Sela (Interdental Brush):** Masukkan sikat kecil ini di bawah kawat (archwire) dan di antara bracket untuk mendorong sisa makanan keluar. Ini sangat penting karena sikat biasa tidak bisa menjangkau sela-sela kawat tersebut.
4. **Gunakan Dental Floss Khusus:** Gunakan superfloss atau pemandu benang (floss threader) setidaknya sekali sehari sebelum tidur untuk membersihkan sela gigi yang rapat.
5. **Waktu Sikat Gigi:** Minimal 3 kali sehari yaitu pagi setelah sarapan, siang setelah makan, dan malam sebelum tidur. Bilas mulut dengan air bersih setelah makan camilan kecil.`,
    estimatedReadTime: "4 menit",
    iconName: "Sparkles"
  },
  {
    id: "edu-2",
    title: "Panduan Diet Selama Memakai Kawat Gigi",
    category: "Diet",
    summary: "Makanan apa saja yang wajib dihindari dan dianjurkan demi kelancaran perawatan gigi Anda.",
    content: `Braket behel ditempelkan ke gigi menggunakan semen resin gigi khusus. Meskipun kuat untuk mengunyah makanan biasa, kekuatan rekatnya memiliki batas tertentu. Bracket yang sering lepas (bracket off) akan membuat waktu perawatan Anda bertambah panjang berbulan-bulan!

Berikut adalah panduan diet ramah ortodontik:

❌ **Makanan yang Wajib Dihindari:**
- **Makanan Keras:** Keripik singkong tebal, kerupuk keras, es batu (jangan dikunyah!), kacang tanah/almond utuh, wortel mentah utuh (potong kecil-kecil terlebih dahulu), apel utuh (potong tipis sebelum dimakan).
- **Makanan Lengket:** Permen karet (gum), dodol, karamel, marshmallow, jeli kenyal. Makanan ini bisa melilit kawat, melepaskan bracket, atau menggeser band logam di gigi geraham.
- **Makanan Tinggi Gula:** Batasi konsumsi soda, boba manis, permen, dan donat. Gula sangat mudah terjebak di sekitar bracket dan mempercepat pembusukan gigi (white spot lesions).

v **Makanan yang Dianjurkan (Terutama Setelah Kontrol):**
- **Suhu Dingin untuk Meredakan Ngilu:** Es krim, yoghurt dingin, jus buah dingin, smoothie, atau puding dingin. Dingin dapat mengurangi peradangan gusi karena efek vasokonstriksi minor.
- **Makanan Lunak & Tinggi Nutrisi:** Bubur ayam, sup krim ayam, kentang tumbuk (mashed potato), telur orak-arik (scrambled eggs), pasta/makaroni keju lunak, tahu dan tempe kukus, ikan panggang/tim tanpa duri.`,
    estimatedReadTime: "3 menit",
    iconName: "Apple"
  },
  {
    id: "edu-3",
    title: "Pertolongan Pertama Darurat (Orthodontic Emergency)",
    category: "Emergency",
    summary: "Langkah-langkah aman saat kawat menusuk gusi atau bracket lepas sebelum Anda bisa ke klinik.",
    content: `Jangan panik jika terjadi masalah darurat pada kawat gigi Anda di malam hari atau saat berada di luar kota. Sebagian besar masalah kecil ini bisa diatasi sementara secara mandiri di rumah dengan aman:

1. **Kawat Melorot dan Menusuk Pipi (Poking Wire):**
   - **Solusi:** Bersihkan tangan Anda, keringkan kawat yang menusuk menggunakan cotton bud. Ambil sedikit lilin ortodontik (orthodontic wax) seukuran biji jagung, bulatkan dengan jari, lalu tekan kuat-kuat hingga membungkus ujung kawat yang tajam tersebut.
   - Jika darurat dan wax habis, Anda bisa mendorong kawat secara perlahan ke arah dalam menggunakan ujung penghapus pensil yang bersih agar kawat melengkung menjauhi pipi. Jangan memotong kawat sendiri dengan pemotong kuku kecuali diarahkan oleh dokter gigi Anda.

2. **Bracket Lepas dari Gigi (Loose/Broken Bracket):**
   - **Solusi:** Jika bracket terlepas tapi masih menempel di kawat, oleskan sedikit dental wax agar bracket tidak berputar-putar dan mengiritasi bibir Anda. Segera jadwalkan kunjungan dengan dokter gigi untuk ditempel kembali.
   - Jika bracket terlepas sepenuhnya dari kawat, simpan bracket tersebut dalam wadah bersih dan bawa saat kunjungan berikutnya agar dokter gigi bisa mengevaluasi apakah bisa disterilisasi dan ditempel ulang atau perlu bracket baru.

3. **Nyeri dan Ngilu Hebat:**
   - **Solusi:** Berkumur dengan air garam hangat (1/2 sendok teh garam dilarutkan dalam segelas air hangat) selama 30 detik untuk meredakan iritasi gusi. Minum Parasetamol atau Ibuprofen sesuai petunjuk dosis untuk meredakan nyeri sistemik.`,
    estimatedReadTime: "5 menit",
    iconName: "AlertTriangle"
  },
  {
    id: "edu-4",
    title: "Dampak Penumpukan Plak terhadap Perawatan Orthodonti",
    category: "Braces Care",
    summary: "Memahami bahaya plak gigi bagi pemakai kawat gigi, dari bercak putih (decalcification) hingga gusi bengkak kronis.",
    content: `Plak gigi adalah lapisan tipis, lengket, dan tak berwarna yang terus-menerus terbentuk di permukaan gigi Anda dari campuran bakteri, sisa makanan, dan air liur. Pada pengguna kawat gigi (orthodonti), risiko penumpukan plak meningkat hingga 3 kali lipat karena banyaknya sela-sela bracket, kawat (archwire), dan karet elastis yang menjadi tempat persembunyian ideal bagi bakteri.

Jika plak dibiarkan menumpuk selama perawatan behel, dampak klinis berikut dapat terjadi:

1. **Dekalsifikasi Enamel (Bercak Putih / White Spot Lesions):**
   Plak yang mengandung bakteri *Streptococcus mutans* akan memfermentasi sisa gula makanan menjadi asam. Asam ini melarutkan mineral pelindung gigi (enamel) dalam proses dekalsifikasi. Saat kawat gigi dilepas, akan terbentuk bercak-bercak putih kusam permanen di sekeliling area bekas bracket yang merusak estetika senyum Anda.

2. **Gingivitis & Pembengkakan Gusi (Overgrowth Gusi):**
   Akumulasi plak di batas gusi memicu reaksi peradangan. Gusi akan tampak merah menyala, bengkak, terasa gatal, dan sangat mudah berdarah saat Anda menyikat gigi. Jika gusi membengkak (gingival hyperplasia), jaringan gusi bisa menutupi permukaan bracket, yang menyebabkan rasa sakit luar biasa saat kontrol behel dan mempersulit dokter melakukan aktivasi kawat gigi.

3. **Gigi Goyang dan Kerusakan Tulang Pendukung (Periodontitis):**
   Jika plak terus mengeras menjadi karang gigi (calculus), infeksi bakteri akan menjalar ke jaringan pendukung gigi yang lebih dalam (tulang alveolar dan ligamen periodontal). Hal ini dapat menyebabkan gigi menjadi goyang karena kehilangan tumpuan tulang, yang sangat berbahaya bagi gigi yang sedang digerakkan secara aktif oleh kekuatan kawat gigi.

4. **Waktu Perawatan Menjadi Jauh Lebih Lama:**
   Dokter gigi spesialis ortodonti tidak dapat menggerakkan gigi yang memiliki gusi meradang hebat atau tulang pendukung yang rusak karena risiko kehilangan gigi. Akibatnya, kontrol perawatan behel akan tertunda atau dihentikan sementara demi mengobati penyakit gusinya terlebih dahulu. Hal ini membuat total waktu perawatan behel Anda bertambah panjang secara signifikan.

**Tips Pencegahan Terbaik:**
- Selalu ukur indeks PCR (Plaque Control Record) Anda secara teratur saat kunjungan rutin. Targetkan skor PCR Anda di bawah 10% (Indeks Higiene Baik).
- Kurangi konsumsi makanan manis yang lengket yang memicu pembentukan asam bakteri plak.
- Gunakan sikat gigi interdental dan dental floss khusus behel setelah makan.`,
    estimatedReadTime: "5 menit",
    iconName: "Flame"
  },
  {
    id: "edu-5",
    title: "Pantangan Makanan bagi Pasien Orthodonti",
    category: "Diet",
    summary: "Ketahui jenis makanan yang dilarang keras selama memakai behel untuk mencegah kawat melengkung atau bracket lepas.",
    content: `Memakai behel berarti Anda harus berkompromi dengan beberapa jenis makanan demi kelancaran perawatan. Tekanan berlebih dari makanan yang keras, rekat, atau liat dapat dengan mudah mematahkan lem perekat bracket (bracket off) atau bahkan membengkokkan kawat ortodonti (archwire).

Berikut adalah daftar pantangan makanan yang wajib dipatuhi:

1. **Makanan Keras (Hard Foods):**
   - **Kacang-kacangan keras:** Kacang tanah, almond, atau kuaci yang digigit langsung dengan gigi depan.
   - **Es Batu:** Mengunyah es batu adalah penyebab nomor satu bracket lepas dan retaknya enamel gigi.
   - **Buah dan Sayuran Utuh yang Keras:** Apel, pir, jambu biji, atau wortel mentah yang digigit langsung. Potonglah terlebih dahulu menjadi ukuran sekali suap (bite-sized).
   - **Camilan Keras:** Keripik singkong tebal, kerupuk kulit, sereal kering yang sangat keras, atau kulit pizza yang alot.

2. **Makanan Lengket & Rekat (Sticky Foods):**
   - **Permen Karet (Gum):** Dapat melilit kawat gigi dan menarik bracket hingga lepas.
   - **Karangan Tradisional Lengket:** Dodol, jeli kenyal, mochi kenyal, lemper, atau tape ketan.
   - **Cokelat atau Karamel Liat:** Permen karamel (seperti Alpenliebe kenyal), permen toffee, atau cokelat isi kacang/karamel yang liat.

3. **Makanan yang Membutuhkan Gigitan Kuat (Tough Foods):**
   - **Daging Alot:** Daging steak yang berserat tebal atau iga bakar. Sebaiknya potong kecil-kecil atau giling halus daging sebelum dimakan.
   - **Jagung Utuh:** Menggigit jagung langsung dari tongkolnya sangat dilarang keras. Serutlah jagung terlebih dahulu sebelum dikonsumsi.

4. **Makanan Tinggi Asam & Gula (Acidic & Sugary Foods):**
   - **Soda dan Minuman Kemasan:** Mengandung asam tinggi yang dapat melarutkan perekat bracket dan memicu karies di sekitar kawat.
   - **Makanan Manis Berlebih:** Boba manis, sirup, atau kue-kue manis yang mudah meninggalkan sisa gula di sela-sela behel.`,
    estimatedReadTime: "4 menit",
    iconName: "X"
  },
  {
    id: "edu-6",
    title: "Pentingnya Kontrol Sesuai Anjuran Dokter Gigi",
    category: "Braces Care",
    summary: "Mengapa mematuhi jadwal kontrol rutin sangat krusial bagi keberhasilan dan kecepatan pergerakan gigi Anda.",
    content: `Keberhasilan perawatan kawat gigi (orthodonti) sangat bergantung pada konsistensi kontrol rutin Anda ke dokter gigi spesialis ortodonti. Jadwal kunjungan yang biasanya dianjurkan adalah setiap 3 hingga 4 minggu sekali. 

Berikut adalah alasan medis mengapa kontrol rutin sesuai anjuran sangat penting:

1. **Aktivasi Kawat dan Penggantian Karet:**
   Gigi bergerak karena adanya tekanan konstan yang lembut dari kawat gigi (archwire) dan karet elastis (power chain/O-ring). Setelah beberapa minggu, tekanan tersebut akan mengendur karena gigi telah bergeser ke posisi baru. Jika Anda melewatkan kontrol, tekanan aktif akan hilang, dan proses pergerakan gigi akan terhenti (stagnan).

2. **Evaluasi Pergerakan Gigi & Pencegahan Efek Samping:**
   Dokter gigi perlu memantau apakah gigi bergerak sesuai rencana perawatan (treatment plan). Jika ada arah pergerakan yang menyimpang, dokter dapat langsung melakukan koreksi. Menunda kontrol dapat menyebabkan pergerakan gigi yang tidak diinginkan, yang justru memperpanjang masa perawatan Anda.

3. **Pembersihan Plak & Karang Gigi Secara Profesional:**
   Saat kontrol, dokter gigi akan membersihkan sela-sela bracket yang sulit dijangkau oleh sikat gigi biasa. Karang gigi yang menumpuk di sekitar kawat dapat menghalangi pergeseran gigi dan memicu gusi berdarah.

4. **Deteksi Bracket atau Kawat yang Longgar:**
   Kadang-kadang, bracket bisa lepas tanpa Anda sadari sepenuhnya atau kawat melorot ke belakang. Deteksi dini saat kontrol rutin akan memastikan semua komponen behel berfungsi optimal 100%.

**Dampak Sering Menunda Kontrol:**
- **Waktu Perawatan Molor Berbulan-bulan:** Penundaan satu kali kontrol dapat memundurkan estimasi pelepasan behel hingga 2-3 bulan!
- **Kerusakan Jaringan Pendukung Gigi:** Gigi yang tidak dikontrol secara berkala dapat menerima tekanan yang tidak seimbang dalam jangka waktu terlalu lama, yang berisiko merusak akar gigi (resorpsi akar) atau merusak tulang penyangga gigi.`,
    estimatedReadTime: "4 menit",
    iconName: "Clock"
  },
  {
    id: "edu-7",
    title: "Flossing Pasien Orthodonti",
    category: "Braces Care",
    summary: "Panduan langkah demi langkah membersihkan sela-sela gigi menggunakan benang gigi (dental floss) khusus selama memakai behel.",
    content: `Banyak pasien ortodonti mengabaikan penggunaan benang gigi (dental floss) karena menganggapnya sulit dan merepotkan akibat terhalang kawat gigi. Padahal, bulu sikat gigi biasa—bahkan sikat ortodontik sekalipun—tidak mampu membersihkan sela-sela kontak antar gigi (interproksimal). Di sinilah sisa makanan sering terjebak dan memicu karies/gigi berlubang dari samping.

Berikut adalah panduan flossing yang benar dan mudah bagi pengguna kawat gigi:

1. **Gunakan Alat Bantu (Floss Threader / Superfloss):**
   - **Floss Threader:** Ini adalah jarum plastik lentur dengan lubang besar untuk memasukkan benang gigi biasa. Alat ini berfungsi sebagai pemandu untuk mengarahkan benang melewati bagian bawah kawat behel (archwire).
   - **Superfloss:** Benang gigi khusus yang memiliki ujung kaku di satu sisi (sebagai pemandu), bagian tengah yang tebal dan berserat (untuk membersihkan bracket/sela lebar), dan benang biasa di ujung lainnya.

2. **Langkah-langkah Flossing Harian:**
   - **Langkah 1:** Masukkan ujung kaku Superfloss atau ujung Floss Threader di bawah kawat gigi dari arah atas gusi (untuk rahang atas) atau bawah gusi (untuk rahang bawah).
   - **Langkah 2:** Tarik benang hingga masuk sepenuhnya ke bawah kawat gigi, tetapi pastikan benang berada di antara dua gigi yang ingin dibersihkan.
   - **Langkah 3:** Pegang kedua ujung benang dengan jari telunjuk/ibu jari Anda secara erat.
   - **Langkah 4:** Masukkan benang secara perlahan ke sela kontak gigi dengan gerakan menggergaji maju-mundur lembut agar tidak melukai gusi (papila interdental).
   - **Langkah 5:** Tekuk benang membentuk huruf "C" membungkus salah satu sisi gigi. Geser benang naik dan turun dari arah gusi ke ujung mahkota gigi beberapa kali untuk mengikis plak.
   - **Langkah 6:** Lakukan hal yang sama pada sisi gigi yang satunya dalam sela yang sama.
   - **Langkah 7:** Tarik benang keluar secara perlahan, lalu ulangi langkah ini untuk seluruh sela gigi lainnya.

3. **Waktu Terbaik untuk Flossing:**
   Lakukan flossing minimal **satu kali sehari sebelum tidur malam**. Di malam hari, aliran air ludah berkurang sehingga bakteri di dalam plak akan berkembang biak lebih cepat jika sela gigi tidak dibersihkan dengan benang gigi.`,
    estimatedReadTime: "5 menit",
    iconName: "Check"
  },
  {
    id: "edu-8",
    title: "Penggunaan Interdental Brush",
    category: "Braces Care",
    summary: "Cara tepat menggunakan sikat sela (interdental brush) untuk mengangkat sisa makanan yang menyangkut di bawah kawat behel.",
    content: `Sikat gigi interdental (interdental brush) adalah sikat kecil berbentuk silinder atau kerucut dengan bulu sikat halus di sekelilingnya. Alat ini dirancang khusus untuk menjangkau area "buta" di bawah kawat gigi, di sekitar sayap bracket, dan di antara gigi yang renggang—area yang tidak terjangkau oleh sikat gigi biasa.

Mengapa sikat interdental wajib digunakan?
Kawat gigi (archwire) melintang di depan gigi dan bertindak sebagai jembatan yang menghalangi bulu sikat biasa menyentuh permukaan enamel di bawah kawat tersebut. Tanpa sikat sela, area di sekeliling bracket akan menjadi sarang plak yang memicu noda putih dekalsifikasi gusi.

Berikut cara menggunakan interdental brush yang aman dan efektif:

1. **Pilih Ukuran yang Tepat:**
   Sikat interdental tersedia dalam berbagai ukuran diameter (misalnya 0.4mm hingga 1.5mm). Pilihlah sikat dengan ukuran yang pas: cukup longgar untuk dimasukkan tanpa dipaksa, tetapi bulu sikatnya tetap menyentuh permukaan gigi dan bracket. Anda mungkin memerlukan 2 ukuran berbeda (kecil untuk gigi depan, agak besar untuk gigi geraham).

2. **Langkah Penggunaan:**
   - **Langkah 1:** Basahi sikat sela dengan air (tidak perlu pasta gigi, atau gunakan sedikit jika dianjurkan dokter).
   - **Langkah 2:** Masukkan sikat secara perlahan dari arah atas kawat (menghadap ke bawah) atau dari bawah kawat (menghadap ke atas).
   - **Langkah 3:** Gerakkan sikat maju-mundur lembut beberapa kali di sela-sela bracket untuk membersihkan kawat dan sisi samping bracket.
   - **Langkah 4:** Masukkan sikat ke celah segitiga di dekat gusi di antara dua gigi, lalu dorong lembut keluar-masuk. Jangan menekan terlalu keras ke arah gusi agar gusi tidak terluka.
   - **Langkah 5:** Bilas sikat interdental dengan air bersih setelah membersihkan setiap sela gigi sebelum berpindah ke sela berikutnya.

3. **Perawatan & Penggantian Sikat:**
   - Setelah selesai digunakan, cuci bersih sikat sela dan biarkan mengering di udara terbuka.
   - Gantilah sikat interdental Anda setiap **1 hingga 2 minggu sekali**, atau jika bulu sikatnya sudah mulai rontok, kawat intinya bengkok, atau sikat tampak kotor/aus.`,
    estimatedReadTime: "4 menit",
    iconName: "Sparkles"
  }
];

export const initialEduArticles: EduArticle[] = rawEduArticles.map(art => ({
  ...art,
  imageUrl: articleCoverImages[art.id] || art.imageUrl,
  subTopics: articleSubTopicsMap[art.id] || []
}));
