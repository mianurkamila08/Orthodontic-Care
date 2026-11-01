// Data Interaktif untuk Portal Edukasi Orthodontic Care
// Disusun berdasarkan standar klinis Kemenkes & IKORTI (Ikatan Ortodontis Indonesia)

export interface FoodGuideItem {
  id: string;
  name: string;
  category: "hard" | "sticky" | "tough" | "sugary" | "safe" | "trick";
  status: "forbidden" | "caution" | "safe";
  riskLevel: "Tinggi" | "Sedang" | "Aman";
  titleBadge: string;
  description: string;
  riskNote: string;
  safeAlternative: string;
  iconType: string;
}

export const foodGuideData: FoodGuideItem[] = [
  {
    id: "f-1",
    name: "Es Batu (Mengunyah Es)",
    category: "hard",
    status: "forbidden",
    riskLevel: "Tinggi",
    titleBadge: "DILARANG KERAS",
    description: "Mengunyah es batu secara langsung memberikan beban oklusal tiba-tiba dengan suhu ekstrem.",
    riskNote: "Penyebab #1 lem bracket pecah (bracket off) dan retakan mikro enamel gigi (micro-cracks).",
    safeAlternative: "Biarkan es batu mencair di dalam mulut, atau nikmati minuman dingin tanpa mengunyah esnya.",
    iconType: "ice"
  },
  {
    id: "f-2",
    name: "Kacang-Kacangan Utuh (Almond, Tanah)",
    category: "hard",
    status: "forbidden",
    riskLevel: "Tinggi",
    titleBadge: "DILARANG KERAS",
    description: "Kacang keras yang digigit dengan gigi depan atau geraham memberikan tekanan titik yang sangat tinggi.",
    riskNote: "Dapat meremukkan bracket keramik/metal dan membengkokkan kawat NiTi.",
    safeAlternative: "Konsumsi selai kacang halus (smooth peanut butter) atau kacang rebus yang sudah sangat empuk.",
    iconType: "nut"
  },
  {
    id: "f-3",
    name: "Permen Karet & Karamel Liat",
    category: "sticky",
    status: "forbidden",
    riskLevel: "Tinggi",
    titleBadge: "DILARANG KERAS",
    description: "Permen liat dan kenyal menempel sangat kuat di sela kawat dan bracket.",
    riskNote: "Dapat melilit kawat, mencabut bracket saat ditarik, dan mengendurkan cincin molar band.",
    safeAlternative: "Pilih permen hisap bebas gula (sugar-free lozenge) tanpa dikunyah.",
    iconType: "candy"
  },
  {
    id: "f-4",
    name: "Dodol, Mochi Kenyal, & Lemper Ketan",
    category: "sticky",
    status: "forbidden",
    riskLevel: "Tinggi",
    titleBadge: "DILARANG KERAS",
    description: "Tekstur ketan yang sangat liat dan lengket menempel di sekeliling karet behel (power chain).",
    riskNote: "Sangat sulit dibersihkan bahkan dengan sikat gigi, memicu pembusukan plak masif di sela behel.",
    safeAlternative: "Puding sutra dingin, kue bolu lembut, atau custard yang mudah lumer di mulut.",
    iconType: "cake"
  },
  {
    id: "f-5",
    name: "Apel & Wortel Utuh",
    category: "trick",
    status: "caution",
    riskLevel: "Sedang",
    titleBadge: "PERLU TRIK AMAN",
    description: "Menggigit apel atau wortel mentah langsung dengan gigi seri depan akan langsung mencongkel bracket depan.",
    riskNote: "Bracket gigi seri depan paling rentan lepas karena permukaannya yang tipis.",
    safeAlternative: "💡 TRIK: Iris apel menjadi lembaran sangat tipis atau serut halus; rebus wortel hingga empuk.",
    iconType: "apple"
  },
  {
    id: "f-6",
    name: "Jagung Bertongkol",
    category: "trick",
    status: "caution",
    riskLevel: "Sedang",
    titleBadge: "PERLU TRIK AMAN",
    description: "Menggigit jagung langsung dari tongkolnya memberikan tekanan ungkit frontal ke bracket.",
    riskNote: "Membuat kawat melengkung keluar dari alur bracket (dislodged archwire).",
    safeAlternative: "💡 TRIK: Pipil atau serut jagung dengan pisau ke dalam mangkuk sebelum dinikmati.",
    iconType: "corn"
  },
  {
    id: "f-7",
    name: "Keripik Singkong Tebal & Kerupuk Keras",
    category: "hard",
    status: "forbidden",
    riskLevel: "Tinggi",
    titleBadge: "DILARANG KERAS",
    description: "Patahan keripik yang tajam dan keras bisa menusuk gusi serta mematahkan sayap bracket.",
    riskNote: "Sisa remahan keras tersangkut di bawah kawat dan melukai jaringan mukosa mulut.",
    safeAlternative: "Roti tawar lembut tanpa kulit tepi, biskuit yang dicelup ke dalam susu hangat hingga empuk.",
    iconType: "chips"
  },
  {
    id: "f-8",
    name: "Daging Steak Alot & Iga Tulang",
    category: "tough",
    status: "caution",
    riskLevel: "Sedang",
    titleBadge: "PERLU TRIK AMAN",
    description: "Serat daging yang liat tersangkut di antara kawat dan menarik bracket saat dikunyah paksa.",
    riskNote: "Menyebabkan radang gusi interdental dan nyeri hebat di gigi yang baru diaktivasi.",
    safeAlternative: "💡 TRIK: Daging cincang empuk (kornet/patty lembut), suwiran daging empuk, bakso lunak, atau olahan tim ikan.",
    iconType: "meat"
  },
  {
    id: "f-9",
    name: "Bubur Ayam, Sup Telur, & Kentang Tumbuk",
    category: "safe",
    status: "safe",
    riskLevel: "Aman",
    titleBadge: "SANGAT DIANJURKAN",
    description: "Makanan lembut bergizi tinggi yang tidak memberikan tekanan berlebih pada gigi dan jaringan penyangga.",
    riskNote: "Ideal dikonsumsi terutama pada 1–4 hari pasca aktivasi/ganti kawat saat gigi terasa ngilu.",
    safeAlternative: "Variasikan dengan kaldu ayam, tahu sutra kukus, dan sup makaroni sayur lembut.",
    iconType: "soup"
  },
  {
    id: "f-10",
    name: "Yoghurt, Es Krim, & Puding Dingin",
    category: "safe",
    status: "safe",
    riskLevel: "Aman",
    titleBadge: "SANGAT DIANJURKAN",
    description: "Suhu dingin memiliki efek anestesi lokal minor yang meredakan inflamasi ligamen periodontal.",
    riskNote: "Sangat membantu menenangkan rasa ngilu dan kencang setelah dokter mengganti kawat behel.",
    safeAlternative: "Pastikan segera kumur air putih setelahnya agar gula tidak menempel di sekitar behel.",
    iconType: "icecream"
  },
  {
    id: "f-11",
    name: "Ikan Panggang / Tim & Tahu Tempe Kukus",
    category: "safe",
    status: "safe",
    riskLevel: "Aman",
    titleBadge: "SANGAT DIANJURKAN",
    description: "Sumber protein esensial dan kalsium tinggi yang mudah dikunyah tanpa risiko merusak behel.",
    riskNote: "Membantu proses regenerasi jaringan tulang alveolar yang sedang mengalami remodeling.",
    safeAlternative: "Ikan salmon tim, gurame fillet sup, tahu telur lembut, atau tempe bacem empuk.",
    iconType: "fish"
  },
  {
    id: "f-12",
    name: "Minuman Soda & Minuman Manis Kemasan",
    category: "sugary",
    status: "forbidden",
    riskLevel: "Tinggi",
    titleBadge: "BATASI / HINDARI",
    description: "Kombinasi asam fosfat dan kadar gula tinggi yang membasahi seluruh permukaan gigi dan bracket.",
    riskNote: "Melarutkan semen perekat bracket serta menyebabkan bercak putih permanen (white spots).",
    safeAlternative: "Air mineral dingin, infused water lemon tipis, atau susu plain berkalsium.",
    iconType: "soda"
  }
];

export interface BracesPart {
  id: string;
  name: string;
  medicalTerm: string;
  iconEmoji: string;
  colorTheme: string;
  functionDesc: string;
  maintenanceTip: string;
  commonTrouble: string;
  firstAid: string;
}

export const bracesPartsData: BracesPart[] = [
  {
    id: "part-bracket",
    name: "Bracket (Braket)",
    medicalTerm: "Orthodontic Bracket",
    iconEmoji: "🦷",
    colorTheme: "pink",
    functionDesc: "Kotak kecil metal/keramik yang ditempelkan di permukaan tengah gigi menggunakan semen gigi khusus untuk mentransmisikan gaya dari kawat.",
    maintenanceTip: "Sikat memutar perlahan di sekeliling 4 sudut sayap bracket menggunakan sikat ortodontik bersudut 45 derajat.",
    commonTrouble: "Bracket lepas (bracket off) atau berputar pada kawat akibat menggigit makanan keras/alot.",
    firstAid: "Tempelkan lilin ortodontik (wax) agar tidak melukai bibir, simpan bila lepas sepenuhnya, dan segera hubungi klinik untuk dilem ulang."
  },
  {
    id: "part-archwire",
    name: "Kawat Lengkung (Archwire)",
    medicalTerm: "NiTi / Stainless Steel Archwire",
    iconEmoji: "⚡",
    colorTheme: "blue",
    functionDesc: "Kawat memanjang yang dipasang melalui slot semua bracket. Kawat inilah yang menuntun pergerakan gigi ke lengkung lengkungan ideal.",
    maintenanceTip: "Gunakan sikat interdental untuk membersihkan kotoran yang terselip tepat di bawah kawat lengkung.",
    commonTrouble: "Ujung kawat melorot ke belakang dan menusuk pipi (poking wire) saat gigi mulai merapat.",
    firstAid: "Keringkan kawat dengan tisu bersih, lalu balut ujung kawat yang tajam dengan gumpalan orthodontic wax."
  },
  {
    id: "part-ligature",
    name: "Karet Behel (O-Ring / Power Chain)",
    medicalTerm: "Elastomeric Ligature / Chain",
    iconEmoji: "🎨",
    colorTheme: "purple",
    functionDesc: "Karet elastis kecil warna-warni yang mengikat kawat ke dalam slot bracket, atau rantai karet bersambung untuk merapatkan celah gigi.",
    maintenanceTip: "Hindari makanan berwarna kuning pekat seperti kunyit atau kopi berlebih agar karet tidak kusam sebelum jadwal kontrol.",
    commonTrouble: "Karet putus atau terlepas dari salah satu sayap bracket setelah menyikat gigi terlalu kasar.",
    firstAid: "Jangan mencoba memasang karet dengan pinset biasa tanpa bantuan dokter; infokan ke dokter saat jadwal kontrol berikutnya."
  },
  {
    id: "part-molar-band",
    name: "Cincin Geraham (Molar Band)",
    medicalTerm: "Molar Band & Buccal Tube",
    iconEmoji: "⚓",
    colorTheme: "emerald",
    functionDesc: "Cincin logam presisi yang melingkari gigi geraham belakang sebagai jangkar penahan utama dari seluruh rangkaian kawat behel.",
    maintenanceTip: "Pastikan menyikat bagian paling belakang gigi geraham hingga bersih agar sisa makanan tidak membusuk di celah gusi.",
    commonTrouble: "Cincin terasa goyang atau lepas dari semen perekat saat mengunyah permen kenyal/dodol.",
    firstAid: "Jangan ditarik paksa keluar bila masih terikat kawat. Hubungi klinik gigi untuk pemasangan semen baru."
  },
  {
    id: "part-wax",
    name: "Lilin Ortodontik (Dental Wax)",
    medicalTerm: "Orthodontic Relief Wax",
    iconEmoji: "🕯️",
    colorTheme: "amber",
    functionDesc: "Lilin silikon aman medis untuk melapisi tonjolan bracket atau kawat yang menggesek pipi atau bibir bagian dalam.",
    maintenanceTip: "Keringkan area bracket terlebih dahulu sebelum menempelkan wax agar wax menempel kuat dan tidak mudah lepas.",
    commonTrouble: "Wax sering lepas saat makan atau minum air hangat (karena wax melunak terkena panas).",
    firstAid: "Wax berbahan food-grade sehingga aman jika tertelan secara tidak sengaja. Lepas wax sebelum makan dan pasang kembali setelah sikat gigi."
  },
  {
    id: "part-elastics",
    name: "Karet Tarik Antar-Rahang (Elastics)",
    medicalTerm: "Intermaxillary Elastics",
    iconEmoji: "🔗",
    colorTheme: "rose",
    functionDesc: "Karet elastis kecil yang dikaitkan antara kait rahang atas dan bawah untuk memperbaiki relasi gigitan (overjet, overbite, atau crossbite).",
    maintenanceTip: "Ganti karet baru minimal 3–4 kali sehari (setelah makan dan sikat gigi) karena elastisitas karet akan melemah setelah beberapa jam.",
    commonTrouble: "Lupa memakai karet secara konsisten membuat pergerakan gigitan mundur kembali ke posisi semula.",
    firstAid: "Selalu bawa cadangan kemasan karet elastis di saku atau tas Anda ke mana pun Anda bepergian."
  }
];

export interface EmergencyHelpItem {
  id: string;
  title: string;
  urgency: "Tinggi (Segera ke Klinik)" | "Sedang (Dapat Ditangani Mandiri)" | "Ringan (Normal)";
  urgencyColor: string;
  symptoms: string;
  firstAidSteps: string[];
  donts: string[];
  whenToCall: string;
}

export const emergencyHelpData: EmergencyHelpItem[] = [
  {
    id: "emg-1",
    title: "Kawat Menusuk Pipi / Poking Wire",
    urgency: "Sedang (Dapat Ditangani Mandiri)",
    urgencyColor: "amber",
    symptoms: "Ujung kawat di geraham belakang menusuk pipi dalam, menimbulkan rasa perih tajam saat mengunyah atau berbicara.",
    firstAidSteps: [
      "Keringkan ujung kawat yang tajam menggunakan cotton bud atau tisu bersih.",
      "Ambil lilin ortodontik (wax) seukuran biji jagung, bulatkan dengan jari bersih hingga empuk.",
      "Tekan wax secara mantap hingga membungkus rapat seluruh ujung kawat yang menusuk.",
      "Alternatif darurat: Dorong perlahan kawat ke arah dalam menjauhi pipi menggunakan ujung penghapus pensil yang bersih."
    ],
    donts: [
      "Jangan memotong kawat dengan gunting kuku biasa karena bisa tertelan dan melukai gusi.",
      "Jangan menarik kawat keluar dengan tang rumah tangga."
    ],
    whenToCall: "Jika wax tidak menolong dan luka pipi terus berdarah atau sariawan membesar."
  },
  {
    id: "emg-2",
    title: "Bracket Lepas dari Gigi (Bracket Off)",
    urgency: "Sedang (Dapat Ditangani Mandiri)",
    urgencyColor: "amber",
    symptoms: "Bracket terasa goyang, bergeser dari permukaan gigi, atau berputar-putar di kawat behel.",
    firstAidSteps: [
      "Jika bracket masih terikat di kawat, geser perlahan ke posisi netral dan balut dengan orthodontic wax agar tidak melukai bibir.",
      "Jika bracket lepas sepenuhnya dari kawat, ambil dengan hati-hati dan simpan di wadah kecil bersih.",
      "Bawa bracket tersebut saat kontrol agar dokter spesialis ortodonsia dapat mengevaluasi dan menempelkannya kembali."
    ],
    donts: [
      "Jangan mencoba mengelem sendiri bracket menggunakan lem super (Alteco/lem instan) karena sangat beracun bagi jaringan mulut!",
      "Jangan menekan gigi yang bracket-nya lepas dengan kencang."
    ],
    whenToCall: "Segera kirim pesan WhatsApp ke klinik untuk menjadwalkan penempelan ulang bracket (re-bonding)."
  },
  {
    id: "emg-3",
    title: "Karet Behel (O-Ring) Putus atau Lepas",
    urgency: "Ringan (Normal)",
    urgencyColor: "blue",
    symptoms: "Karet kecil penahan kawat terlepas dari sayap bracket, biasanya saat menyikat gigi atau mengunyah makanan.",
    firstAidSteps: [
      "Periksa apakah kawat masih berada di dalam alur bracket.",
      "Bila kawat tidak menusuk dan masih aman, Anda dapat menunggu hingga jadwal kontrol terdekat.",
      "Gunakan wax jika kawat terasa sedikit menonjol tanpa penahan karet."
    ],
    donts: [
      "Jangan menggunakan karet gelang biasa atau karet rambut sebagai pengganti.",
      "Jangan memaksakan mencongkel sayap bracket dengan jarum atau peniti."
    ],
    whenToCall: "Bila kawat terlepas dari beberapa bracket sekaligus dan terasa sangat longgar."
  },
  {
    id: "emg-4",
    title: "Rasa Ngilu & Kencang Pasca Kontrol",
    urgency: "Ringan (Normal)",
    urgencyColor: "blue",
    symptoms: "Gigi terasa ngilu, sensitif saat mengatupkan rahang, dan terasa kencang setelah dokter mengganti kawat baru.",
    firstAidSteps: [
      "Ini adalah reaksi normal respon ligamen periodontal yang menandakan gigi mulai bergeser secara sehat (biasanya berlangsung 2–4 hari).",
      "Konsumsi makanan lembut bersuhu dingin (puding dingin, yoghurt, es krim, atau sup hangat lembut).",
      "Kumur dengan air garam hangat (1/2 sdt garam dalam 1 gelas air hangat) 2–3 kali sehari untuk menenangkan gusi.",
      "Bila sangat mengganggu, Anda dapat meminum obat pereda nyeri (Parasetamol 500mg) sesuai anjuran dokter."
    ],
    donts: [
      "Jangan memaksakan mengunyah makanan keras demi mengetes kekuatan gigi.",
      "Jangan menekan-nekan gigi dengan kuku atau lidah secara kasar."
    ],
    whenToCall: "Jika nyeri hebat tidak mereda setelah lebih dari 7 hari atau disertai pembengkakan gusi berdenyut hebat."
  },
  {
    id: "emg-5",
    title: "Sariawan Akibat Gesekan Behel",
    urgency: "Ringan (Normal)",
    urgencyColor: "blue",
    symptoms: "Bercak putih perih di dinding dalam pipi atau bibir akibat gesekan mekanik dengan bracket atau hook kawat.",
    firstAidSteps: [
      "Keringkan bagian bracket yang menggesek sariawan, lalu balut dengan orthodontic wax tebal.",
      "Oleskan gel sariawan khusus mulut (seperti Aloclair atau Kenalog in Orabase) sebelum tidur.",
      "Kumur dengan larutan antiseptik povidone-iodine kumur atau air garam hangat untuk mempercepat penyembuhan epitel."
    ],
    donts: [
      "Jangan menempelkan obat bubuk asam atau mengelupas lapisan sariawan secara paksa.",
      "Hindari makanan pedas, asam menyengat, dan keripik tajam yang memperparah perih."
    ],
    whenToCall: "Jika sariawan tidak sembuh dalam 2 minggu berturut-turut."
  }
];

export interface BrushingPhase {
  phaseNumber: number;
  quadrantName: string;
  durationSeconds: number;
  guideTitle: string;
  instructions: string[];
  angleTip: string;
  focusArea: string;
}

export const brushingCoachPhases: BrushingPhase[] = [
  {
    phaseNumber: 1,
    quadrantName: "Rahang Atas - Sisi Depan & Luar",
    durationSeconds: 30,
    guideTitle: "Bersihkan Sisi Atas & Bawah Bracket Gigi Atas",
    instructions: [
      "Miringkan bulu sikat 45° menghadap ke bawah dari arah gusi untuk membersihkan bagian atas bracket.",
      "Lalu miringkan 45° menghadap ke atas untuk membersihkan bagian bawah bracket dan kawat.",
      "Gunakan gerakan memutar kecil dan getaran lembut, bersihkan 2 gigi dalam satu waktu."
    ],
    angleTip: "📐 Sudut 45 derajat adalah sudut emas pembersihan plak margin gusi Kemenkes.",
    focusArea: "Regio Anterior & Bukal Rahang Atas"
  },
  {
    phaseNumber: 2,
    quadrantName: "Rahang Bawah - Sisi Depan & Luar",
    durationSeconds: 30,
    guideTitle: "Bersihkan Sisi Bracket Gigi Rahang Bawah",
    instructions: [
      "Miringkan sikat 45° menghadap ke atas dari batas gusi bawah ke arah bracket.",
      "Balikkan sikat 45° menghadap ke bawah untuk menyapu sela kawat dan slot bracket.",
      "Beri perhatian ekstra pada sela-sela gigi seri bawah yang paling mudah menumpuk karang gigi."
    ],
    angleTip: "📐 Gigi seri bawah memiliki kelenjar ludah sublingual yang mempercepat pengerasan karang gigi.",
    focusArea: "Regio Anterior & Bukal Rahang Bawah"
  },
  {
    phaseNumber: 3,
    quadrantName: "Sisi Dalam Gigi (Lingual & Palatal)",
    durationSeconds: 30,
    guideTitle: "Bersihkan Permukaan Dalam Gigi Atas & Bawah",
    instructions: [
      "Arahkan kepala sikat secara vertikal untuk menyikat bagian belakang gigi seri atas dan bawah.",
      "Sapu dari batas gusi ke arah ujung gigitan (gerakan menjauhi gusi).",
      "Bersihkan permukaan dalam gigi geraham dengan gerakan menyapu maju-mundur perlahan."
    ],
    angleTip: "📐 Permukaan dalam sering terabaikan karena tidak terlihat kawat behel.",
    focusArea: "Sisi Dalam Menghadap Lidah & Langit-langit"
  },
  {
    phaseNumber: 4,
    quadrantName: "Permukaan Kunyah (Oklusal) & Lidah",
    durationSeconds: 30,
    guideTitle: "Permukaan Kunyah Geraham & Pembersihan Lidah",
    instructions: [
      "Letakkan bulu sikat datar di atas ceruk gigi geraham belakang (permukaan kunyah).",
      "Gerakkan sikat maju-mundur pendek dengan tekanan sedang untuk mengangkat sisa makanan di pit & fissure.",
      "Terakhir, sikat punggung lidah Anda secara lembut dari belakang ke depan untuk mengusir bakteri penyebab bau mulut."
    ],
    angleTip: "✨ Akhiri dengan berkumur menggunakan air bersih dan lakukan flossing sela gigi.",
    focusArea: "Permukaan Kunyah Geraham & Lidah"
  }
];
