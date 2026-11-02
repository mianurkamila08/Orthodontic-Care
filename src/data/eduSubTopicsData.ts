import { EduSubTopic } from "../types";

export const articleSubTopicsMap: Record<string, EduSubTopic[]> = {
  "edu-1": [
    {
      id: "sub-1-1",
      title: "Sikat Gigi Ortodontik Khusus (V-Trim Bristles)",
      subtitle: "Bulu sikat berkontur huruf V khusus untuk membersihkan bracket dan gusi secara bersamaan.",
      imageUrl: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Desain V-Trim: Bulu tengah lebih pendek memberi ruang bagi kawat dan bracket.",
      videoUrl: "https://www.youtube.com/embed/nNPJxgNVBAg",
      videoTitle: "Tutorial Cara Menyikat Gigi yang Benar bagi Pengguna Behel",
      videoOriginalUrl: "https://youtu.be/nNPJxgNVBAg?si=6wOI1hQDqgo_uzZz",
      keyPoints: [
        "Bulu sikat baris tengah berpotongan lebih rendah (lekukan V).",
        "Bulu bagian luar yang lebih panjang menjangkau permukaan gusi dan mahkota gigi.",
        "Mencegah bulu sikat cepat mekar atau rusak akibat terbentur logam bracket."
      ],
      theoryContent: `Sikat gigi ortodontik V-Trim dirancang berdasarkan biomekanika permukaan gigi yang terpasang bracket. Pada sikat gigi konvensional datar, bulu sikat akan tertekan oleh tonjolan bracket metal/keramik setinggi 1.5–2.0 mm, sehingga bulu sikat bagian luar terangkat dan gagal menyentuh batas gusi (cervical margin).

Dengan kontur huruf V, baris tengah yang lebih pendek mampu menyapu permukaan bracket tanpa membelokkan bulu pinggir. Hasil uji klinis menunjukkan sikat V-Trim menurunkan indeks plak (Plak Index) hingga 42% lebih efektif dibanding sikat biasa pada pasien behel aktif.`,
      practicalSteps: [
        "Pilih sikat dengan bulu halus (soft atau ultra-soft) agar tidak mengikis enamel dan melukai gusi.",
        "Posisikan lekukan V tepat berada di atas garis deretan bracket behel Anda.",
        "Lakukan gerakan memutar kecil (circular vibratory) 10-15 kali untuk setiap 2 gigi.",
        "Ganti sikat gigi setiap 2 hingga 3 bulan sekali, atau segera jika bulu sikat sudah mulai mekar."
      ],
      clinicalNote: "Anjuran Dokter Sp.Ort: Jangan pernah menggunakan sikat berbulu keras (hard) karena dapat menyebabkan abrasi sementum leher gigi dan melonggarkan perlekatan lem bracket.",
      dosAndDonts: {
        dos: [
          "Gunakan sikat V-Trim berbulu halus berujung membulat (end-rounded).",
          "Keringkan sikat di tempat berventilasi baik setelah selesai digunakan.",
          "Gunakan pasta gigi berfluoride (1000–1450 ppm F) untuk remineralisasi enamel."
        ],
        donts: [
          "Jangan menyikat dengan gerakan horizontal menyentak kasar seperti menggergaji.",
          "Jangan menekan sikat terlalu kuat hingga gagangnya melengkung.",
          "Hindari berbagi sikat gigi dengan orang lain untuk mencegah transmisi bakteri karies."
        ]
      }
    },
    {
      id: "sub-1-2",
      title: "Cara Menyikat Gigi yang Benar bagi Pengguna Behel (Teknik Sudut 45° Modified Bass)",
      subtitle: "Sudut emas pembersihan plak margin gusi dan koloni kawat behel atas & bawah.",
      imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Kemiringan 45° membersihkan sela atas dan bawah bracket secara menyeluruh.",
      videoUrl: "https://www.youtube.com/embed/nNPJxgNVBAg",
      videoTitle: "Cara Menyikat Gigi yang Benar bagi Pengguna Behel",
      videoOriginalUrl: "https://youtu.be/nNPJxgNVBAg?si=6wOI1hQDqgo_uzZz",
      keyPoints: [
        "Sudut 45° ke arah gusi untuk membersihkan bagian atas bracket.",
        "Sudut 45° ke arah mahkota untuk membersihkan sela bawah bracket dan kawat.",
        "Teknik resmi yang direkomendasikan Kementerian Kesehatan RI & IKORTI."
      ],
      theoryContent: `Teknik Bass Modifikasi adalah standar baku emas dalam kedokteran gigi untuk pengendalian biofilm subgingiva. Pada pasien kawat gigi, teknik ini diaplikasikan dalam dua sudut komplementer:

1. Sudut 45° Menghadap Gusi (Apikal): Bulu sikat masuk ke dalam sulkus gingiva sedalam 0.5–1 mm untuk mengikis koloni bakteri anaerob periodontopatogen (P. gingivalis).
2. Sudut 45° Menghadap Oklusal (Koronal): Bulu sikat masuk ke bagian kolong kawat lengkung (archwire) untuk mengangkat sisa makanan berserat yang terjebak di slot bracket.

Gerakan getaran mikro (vibrasi) tanpa melepaskan ujung bulu sikat dari gigi akan memecah rantai polisakarida plak tanpa menyebabkan resesi gusi.`,
      practicalSteps: [
        "Langkah 1 (Sisi Atas): Letakkan bulu sikat pada batas gusi atas membentuk sudut 45° menghadap ke bawah. Beri getaran ringan memutar.",
        "Langkah 2 (Sisi Bawah): Balikkan arah sikat membentuk sudut 45° menghadap ke atas menuju bawah kawat behel.",
        "Langkah 3 (Permukaan Dalam): Tegakkan sikat secara vertikal untuk gigi depan bagian dalam, lalu sapu ke arah ujung gigitan.",
        "Lakukan secara berurutan: rahang atas luar -> rahang atas dalam -> rahang bawah luar -> rahang bawah dalam -> permukaan kunyah."
      ],
      clinicalNote: "Gusi yang sering berdarah saat menyikat sudut 45° menandakan adanya radang gusi (gingivitis). Tetap sikat dengan lembut; perdarahan akan berhenti dalam 3–5 hari seiring bersihnya plak.",
      dosAndDonts: {
        dos: [
          "Gunakan tekanan konstan yang lembut (seperti meraba kelopak mata).",
          "Luangkan waktu minimal 30 detik untuk setiap kuadran gigi.",
          "Gunakan cermin saat menyikat gigi agar arah sudut 45° tepat mengenai sasaran."
        ],
        donts: [
          "Jangan menyikat secara acak dan terburu-buru kurang dari 2 menit.",
          "Jangan mengabaikan permukaan dalam gigi geraham yang menghadap ke lidah."
        ]
      }
    },
    {
      id: "sub-1-3",
      title: "Pembersihan dengan Sikat Sela (Interdental Brush)",
      subtitle: "Menembus area tersembunyi di bawah kawat lengkung yang tidak tersentuh sikat biasa.",
      imageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Sikat interdental menjangkau kolong kawat dan sayap samping bracket.",
      videoUrl: "https://www.youtube.com/embed/LIIxncCthOs",
      videoTitle: "Tutorial Praktik Penggunaan Interdental Brush pada Kawat Gigi",
      videoOriginalUrl: "https://youtu.be/LIIxncCthOs?si=XSolBihAYEWpLj5k",
      keyPoints: [
        "Mampu masuk ke bawah kawat ortodontik tanpa menimbulkan distorsi kawat.",
        "Membersihkan sayap bracket (tie wings) dan karet elastis (O-ring/power chain).",
        "Wajib digunakan setiap kali selesai makan besar."
      ],
      theoryContent: `Kawat lengkung (archwire) bertindak sebagai jembatan fisik yang menghalangi bulu sikat konvensional menjangkau permukaan email di bawahnya. Area ini disebut 'Undercut Zone'—tempat akumulasi kalsium dan fosfat dari air liur yang mempercepat pembentukan karang gigi (calculus).

Sikat interdental menggunakan kawat pilin fleksibel berdiameter mikro (0.4–0.8 mm) yang dilapisi plastik isolator aman medis. Bulu-bulu nilon halusnya menyapu 360 derajat di sekeliling dinding bracket, mengikis plak yang menjadi biang bercak putih (decalcification).`,
      practicalSteps: [
        "Basahi bulu sikat sela dengan air bersih (tidak perlu pasta gigi).",
        "Masukkan sikat secara perlahan dari arah atas kawat mengarah ke bawah di samping sayap bracket.",
        "Lakukan gerakan maju-mundur pendek sebanyak 3-4 kali.",
        "Ulangi dari arah bawah kawat mengarah ke atas untuk membersihkan sisi sebaliknya.",
        "Bilas sikat sela dengan air mengalir sebelum berpindah ke bracket gigi berikutnya."
      ],
      clinicalNote: "Pastikan sikat interdental masuk dengan mudah tanpa dipaksa. Jika terasa sempit dan kawatnya melengkung, gunakan ukuran diameter sikat yang lebih kecil (misal: 0.4 mm).",
      dosAndDonts: {
        dos: [
          "Selalu bawa sikat interdental di tempat pensil atau tas Anda untuk dipakai setelah makan siang.",
          "Cuci bersih dan keringkan sikat interdental setelah selesai dipakai.",
          "Ganti sikat sela jika kawatnya sudah bengkok atau bulu nilonnya rontok."
        ],
        donts: [
          "Jangan memaksa memasukkan sikat ke sela gigi yang sangat rapat tanpa ruang.",
          "Jangan menggunakan tusuk gigi kayu runcing karena berisiko menusuk gusi dan mematahkan bracket."
        ]
      }
    },
    {
      id: "sub-1-4",
      title: "Flossing Khusus Behel (Superfloss & Floss Threader)",
      subtitle: "Benang gigi khusus berujung kaku untuk membersihkan plak kontak antar gigi di malam hari.",
      imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Superfloss memiliki ujung kaku terintegrasi untuk menembus sela kawat gigi.",
      videoUrl: "https://www.youtube.com/embed/3_vHsOGiIo4",
      videoTitle: "Tutorial Flossing Pasien Orthodonti dengan Benang Gigi Khusus Behel",
      videoOriginalUrl: "https://youtu.be/3_vHsOGiIo4?si=RDIfeRNIYVJbyQ3p",
      keyPoints: [
        "Membersihkan zona kontak interproksimal tempat 80% gigi berlubang bersembunyi.",
        "Ujung kaku (stiffened end) memudahkan benang dimasukkan di bawah kawat.",
        "Bagian spons berserat lembut mengikis plak tanpa melukai papila gusi."
      ],
      theoryContent: `Kontak proksimal antar gigi yang sedang digeser oleh behel mengalami tekanan dinamis. Di zona ini, sisa makanan yang terperangkap mengalami fermentasi asam oleh bakteri Streptococcus mutans. Karena saliva tidak dapat mengalir bebas ke sela sempit ini, pH lokal dapat turun drastis hingga < 4.5, memicu karies interdental yang sering kali baru terdeteksi setelah behel dilepas.

Superfloss memiliki 3 segmen terintegrasi: ujung kaku pemandu (stiffened end), benang spons pembersih sela (spongy floss), dan benang nilon biasa (regular floss). Kombinasi ini memberikan efikasi pembersihan interdental tertinggi bagi pemakai piranti ortodontik cekat.`,
      practicalSteps: [
        "Ambil seutas Superfloss, pegang pada bagian ujung kaku (stiffened end).",
        "Selipkan ujung kaku ke celah antara kawat behel dan gigi dari arah gusi.",
        "Tarik benang hingga bagian spons berada tepat di sela-sela gigi yang ingin dibersihkan.",
        "Bentuk benang melengkung menyerupai huruf 'C' membungkus sisi samping gigi.",
        "Geser benang naik-turun secara perlahan dari garis gusi ke ujung gigitan 3-5 kali.",
        "Lakukan pada sisi gigi sebelahnya, lalu tarik benang keluar perlahan."
      ],
      clinicalNote: "Flossing wajib dilakukan minimal 1 kali sehari, terutama di malam hari sebelum tidur karena aliran air liur menurun drastis saat Anda tertidur.",
      dosAndDonts: {
        dos: [
          "Gunakan benang gigi berlapisan lilin (waxed dental floss) agar tidak mudah tersangkut di bracket.",
          "Lakukan dengan sabar di depan cermin yang terang.",
          "Kumur dengan air hangat setelah flossing selesai."
        ],
        donts: [
          "Jangan menghentakkan benang langsung ke gusi secara keras (dapat melukai gusi interdental).",
          "Jangan menggunakan kembali seutas benang gigi yang sudah kotor."
        ]
      }
    }
  ],

  "edu-2": [
    {
      id: "sub-2-1",
      title: "Pantangan Makanan Keras & Beban Oklusal Kritis",
      subtitle: "Dampak beban kunyah mendadak terhadap kekuatan rekat semen resin bracket.",
      imageUrl: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Kacang keras dan es batu memberikan tekanan titik yang mematahkan lem bracket.",
      keyPoints: [
        "Kekuatan rekat semen ortodonti dibatasi pada 6–10 MPa agar tidak merusak email saat dilepas.",
        "Mengunyah es batu menghasilkan beban geser melampaui 20 MPa.",
        "Bracket yang lepas memperpanjang masa perawatan rata-rata 1–2 bulan per kejadian."
      ],
      theoryContent: `Bracket behel direkatkan ke enamel gigi menggunakan teknik 'Acid-Etch Composite Resin Bonding'. Kekuatan rekat (shear bond strength) ini didesain khusus agar cukup kuat menahan gaya biologis pergerakan gigi (50–150 gram gaya), namun tetap dapat dilepaskan dengan aman oleh dokter spesialis ortodonsia tanpa meretakkan email gigi saat perawatan selesai.

Ketika pasien mengunyah makanan keras (seperti es batu, keripik tebal, atau kacang almond utuh), tekanan oklusal terpusat pada satu titik kecil bracket. Tekanan titik ini menghasilkan momen gaya lentur yang seketika meretakkan interface semen komposit, menyebabkan bracket terlepas (bracket debonding).`,
      practicalSteps: [
        "Hindari mengunyah es batu dari minuman dingin; biarkan mencair di mulut.",
        "Ganti kacang-kacangan utuh dengan selai kacang halus (smooth peanut butter).",
        "Potong tipis buah apel, pir, dan wortel sebelum dimakan; jangan menggigitnya langsung dengan gigi depan.",
        "Pilih kerupuk basah yang sudah dicelup kuah sup atau roti tawar yang lembut."
      ],
      clinicalNote: "Jika ada bracket yang lepas, segera amankan bracket dan hubungi klinik. Jangan menunda hingga jadwal kontrol bulan depan karena gigi tersebut akan berhenti bergerak atau bergeser ke posisi salah.",
      dosAndDonts: {
        dos: [
          "Potong semua makanan keras menjadi ukuran dadu kecil (bite-sized).",
          "Kunyah makanan secara perlahan menggunakan gigi geraham belakang.",
          "Pilih makanan berkonsistensi empuk terutama pada minggu pertama pasca pemasangan."
        ],
        donts: [
          "Dilarang keras mengunyah es batu, tulang ayam/iga, dan kepiting cangkang keras.",
          "Jangan membuka bungkus plastik atau kemasan makanan menggunakan gigi berbehel."
        ]
      }
    },
    {
      id: "sub-2-2",
      title: "Bahaya Makanan Lengket & Karamel (Power Chain Damage)",
      subtitle: "Makanan kenyal liat yang menarik kawat dan mengendurkan cincin molar geraham.",
      imageUrl: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Permen karet dan mochi kenyal dapat menarik kawat dan merusak karet elastis.",
      keyPoints: [
        "Sifat viskoelastis makanan lengket menjebak kawat dan sayap bracket.",
        "Dapat mencabut cincin penahan geraham (molar band) yang disemen kuat.",
        "Sisa gula liat sangat sulit dibersihkan bahkan dengan sikat gigi."
      ],
      theoryContent: `Makanan lengket (seperti dodol, mochi ketan, permen karet, dan toffee karamel) memiliki kohesi internal yang sangat liat. Saat rahang membuka saat proses mastikasi, zat lengket ini menghasilkan gaya tarik tensil (tensile pulling force) searah sumbu aksial gigi.

Gaya ini tidak diserap oleh struktur gigi melainkan langsung ditransmisikan ke sayap bracket dan kawat lengkung. Akibatnya, kawat dapat terlepas dari alur slot (dislodged archwire), karet elastis (power chain) putus, atau cincin geraham (molar band) terungkit lepas dari semen ionomer kaca.`,
      practicalSteps: [
        "Ganti camilan lengket dengan puding sutra dingin, cake lembut, atau custard lumer.",
        "Jika ingin makanan manis, pilih cokelat batangan murni yang mudah meleleh di mulut tanpa isi karamel liat.",
        "Segera berkumur dengan air hangat jika Anda tidak sengaja memakan makanan lengket untuk melarutkan sisa gula."
      ],
      clinicalNote: "Cincin geraham yang longgar akibat makanan lengket sangat berbahaya karena air liur dan bakteri masuk ke celah bawah cincin, menyebabkan karies geraham yang tidak terlihat dari luar.",
      dosAndDonts: {
        dos: [
          "Pilih camilan yang mudah larut oleh air liur.",
          "Periksa posisi kawat behel di depan cermin setelah mengonsumsi makanan berserat."
        ],
        donts: [
          "Hindari permen karet (chewing gum), dodol, gulali liat, dan marshmallow kenyal.",
          "Jangan mengonsumsi makanan ketan yang dipanaskan kembali hingga sangat liat."
        ]
      }
    },
    {
      id: "sub-2-3",
      title: "Nutrisi Lembut & Makanan Dingin Pereda Nyeri",
      subtitle: "Makanan bersuhu dingin dan bernutrisi tinggi untuk meredakan ngilu pasca aktivasi.",
      imageUrl: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Yoghurt dingin dan sup lembut meredakan inflamasi ligamen periodontal.",
      keyPoints: [
        "Suhu dingin memicu vasokonstriksi lokal yang meredakan pembengkakan ligamen.",
        "Tekstur lembut tidak memberi beban tekan pada gigi yang sedang sensitif.",
        "Kaya protein dan kalsium untuk mendukung remodeling tulang alveolar."
      ],
      theoryContent: `Pasca kontrol behel dan penggantian kawat baru, gigi mengalami proses biologis berupa inflamasi aseptik steril pada ligamen periodontal (PDL). Mediator inflamasi seperti prostaglandin E2 (PGE2) dan bradikinin memuncak pada 24–48 jam pertama, menimbulkan rasa kencang dan ngilu saat gigi bersentuhan.

Konsumsi makanan dingin (seperti yoghurt dingin, es krim rendah gula, jus buah dingin) merangsang reseptor dingin TRPM8 dan memicu vasokonstriksi arteriol lokal, sehingga menekan pembengkakan jaringan PDL. Sementara itu, asupan kalsium, vitamin D, dan protein tinggi mempercepat aktivitas osteoblas dalam meregenerasi matriks tulang baru.`,
      practicalSteps: [
        "Hari 1-3 Pasca Kontrol: Konsumsi bubur ayam hangat lembut, sup krim jamur, puree kentang, dan yoghurt dingin.",
        "Tambahkan protein lunak: telur orak-arik (scrambled egg), tahu sutra tim, fillet ikan kukus, atau sup makaroni sayur cincang.",
        "Hindari makanan pedas menyengat dan asam pekat yang dapat mengiritasi dinding bibir yang tergores bracket.",
        "Kumur air mineral dingin di sela jam makan untuk menyegarkan mulut."
      ],
      clinicalNote: "Rasa ngilu pasca aktivasi adalah indikasi positif bahwa sistem biologis pergeseran gigi sedang bekerja. Jangan panik, rasa ngilu akan mereda dengan sendirinya dalam 3 hingga 5 hari.",
      dosAndDonts: {
        dos: [
          "Konsumsi smoothie buah dan yoghurt dingin saat gigi terasa sangat ngilu.",
          "Cukupi kebutuhan air putih minimal 2 liter per hari.",
          "Pastikan asupan gizi tetap lengkap meski sedang mengonsumsi makanan lunak."
        ],
        donts: [
          "Jangan memaksakan mengunyah daging liat untuk mengetes kekuatan gigi saat masih ngilu.",
          "Jangan mengonsumsi minuman berkafein tinggi atau alkohol yang memperlambat hidrasi jaringan mulut."
        ]
      }
    },
    {
      id: "sub-2-4",
      title: "Poster Infografis: Panduan Diet Ramah Ortodontik",
      subtitle: "Rangkuman visual lengkap: makanan dilarang, dianjurkan, tips harian, dan menu harian.",
      imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Poster Panduan Diet Ramah Ortodontik: Makan Sehat, Behel Aman, Senyum Maksimal!",
      keyPoints: [
        "Makanan Wajib Dihindari: Makanan Keras (keripik, es batu, kacang, apel utuh), Makanan Lengket (gum, dodol, karamel), Makanan Tinggi Gula.",
        "Makanan Dianjurkan: Suhu Dingin (es krim, yogurt, smoothie), Makanan Lunak (bubur, sup, mashed potato, telur), Air Putih.",
        "Tips Praktis: Potong kecil, kunyah perlahan gigi belakang, hindari gigit depan, sikat gigi & flossing.",
        "Contoh Menu: Pagi (bubur ayam+telur), Siang (sup krim+kentang tumbuk), Sore (yogurt+buah lembut), Malam (ikan tim+nasi lembut)."
      ],
      theoryContent: `Braket behel ditempelkan ke gigi menggunakan semen resin khusus. Meskipun kuat, braket memiliki batas kekuatan tertentu. Makanan yang tepat akan menjaga behel tetap aman dan mempercepat waktu perawatan Anda!

Kepatuhan terhadap diet ramah ortodontik memberikan 4 manfaat penting:
1. Menjaga braket tetap menempel dengan baik (mencegah bracket debonding).
2. Mencegah kerusakan dan kebengkokan kawat ortodontik (archwire).
3. Meminimalisir penumpukan plak bakteri dan karies gigi (white spot lesions).
4. Mempercepat total waktu perawatan ortodontik hingga Anda mendapatkan senyum maksimal.

Ingat bahwa perawatan ortodontik adalah investasi untuk senyum indah Anda seumur hidup. Disiplin menjaga makanan sama pentingnya dengan kepatuhan kontrol rutin ke dokter gigi!`,
      practicalSteps: [
        "Potong semua makanan keras menjadi ukuran potongan kecil (bite-sized) sebelum masuk ke mulut.",
        "Kunyah makanan secara perlahan menggunakan gigi geraham belakang, hindari menggigit langsung dengan gigi depan.",
        "Hindari mengunyah es batu dari minuman dingin dan jauhi permen karet atau gulali yang kenyal liat.",
        "Selalu sikat gigi setelah makan dan gunakan benang gigi ortodontik (superfloss/interdental brush)."
      ],
      clinicalNote: "Jaga Makanan, Jaga Behel, Jaga Senyum! Kepatuhan Anda terhadap panduan diet ini secara langsung mencegah kunjungan darurat dan memastikan gigi bergerak sesuai rencana perawatan.",
      dosAndDonts: {
        dos: [
          "Buka dan pelajari Poster Panduan Diet Ramah Ortodontik untuk referensi harian.",
          "Terapkan contoh menu harian: bubur ayam pagi, sup krim siang, yogurt sore, ikan tim malam.",
          "Perbanyak minum air putih untuk membilas sisa makanan di sela kawat."
        ],
        donts: [
          "Jangan mengonsumsi makanan keras atau lengket tanpa dipotong kecil terlebih dahulu.",
          "Jangan melewatkan sikat gigi setelah mengonsumsi camilan manis."
        ]
      }
    }
  ],

  "edu-3": [
    {
      id: "sub-3-1",
      title: "Kawat Menusuk Pipi (Poking Wire) & Aplikasi Lilin Wax",
      subtitle: "Solusi cepat mandiri saat ujung kawat geraham melorot dan melukai mukosa pipi dalam.",
      imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Bulatkan lilin ortodontik untuk membungkus ujung kawat yang tajam.",
      keyPoints: [
        "Terjadi karena celah gigi mulai merapat sehingga kawat berlebih terdorong ke belakang.",
        "Orthodontic wax berbahan parafin medis aman jika tertelan.",
        "Bisa gunakan ujung penghapus pensil bersih untuk menekuk kawat darurat."
      ],
      theoryContent: `Ketika gigi-gigi mulai bergeser dan merapat ke posisi lengkung ideal, panjang lengkung kawat kawat gigi (archwire) yang tersisa akan terdorong keluar melalui buccal tube gigi geraham paling belakang. Ujung kawat yang tajam ini sering kali menusuk mukosa pipi dalam (buccal mucosa) setiap kali pasien berbicara atau mengunyah.

Orthodontic relief wax terbuat dari campuran lilin lebah medis (beeswax) dan parafin food-grade yang melunak pada suhu tubuh. Lilin ini membentuk barier mekanik hidrofobik yang memisahkan ujung logam tajam dari jaringan lunak mulut, memberikan waktu bagi epitel pipi untuk pulih dari luka traumatik.`,
      practicalSteps: [
        "Cuci tangan dengan sabun hingga bersih.",
        "Keringkan area kawat yang menusuk menggunakan cotton bud atau tisu bersih (wax tidak akan menempel pada kawat yang basah air liur).",
        "Ambil lilin wax seukuran biji kacang hijau atau jagung kecil.",
        "Gulung wax dengan jari hingga lunak dan berbentuk bola kecil.",
        "Tekan wax secara mantap ke ujung kawat yang menusuk hingga membungkus seluruh permukaannya.",
        "Lepaskan wax sebelum makan dan pasang kembali bola wax baru setelah menyikat gigi."
      ],
      clinicalNote: "Jika wax habis, Anda bisa menggunakan ujung penghapus pensil yang bersih untuk mendorong kawat perlahan ke arah dalam gigi agar menjauhi pipi. Jangan pernah memotong kawat sendiri dengan gunting kuku rumah!",
      dosAndDonts: {
        dos: [
          "Selalu bawa kotak lilin wax ke mana pun Anda bepergian.",
          "Oleskan gel sariawan pada luka pipi setelah kawat dibungkus wax.",
          "Hubungi klinik untuk penjadwalan pemotongan ujung kawat berlebih oleh dokter."
        ],
        donts: [
          "Jangan gunakan permen karet sebagai pengganti wax karena dapat melilit kawat.",
          "Jangan memotong kawat dengan tang perkakas karena serpihan kawat bisa tertelan."
        ]
      }
    },
    {
      id: "sub-3-2",
      title: "Bracket Lepas dari Permukaan Gigi (Bracket Off)",
      subtitle: "Langkah aman mengamankan bracket yang goyang tanpa merusak kawat behel.",
      imageUrl: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Simpan bracket yang lepas dalam wadah steril dan bawa saat kunjungan klinik.",
      keyPoints: [
        "Bracket goyang tapi masih terikat kawat: beri wax agar tidak melukai bibir.",
        "Bracket lepas sepenuhnya: simpan di wadah kecil bersih untuk dievaluasi dokter.",
        "DILARANG KERAS menggunakan lem super (Alteco/lem cair) sendiri!"
      ],
      theoryContent: `Bracket lepas (loose bracket) terjadi akibat kegagalan adhesive interface antara semen resin komposit dan kristal email gigi. Jika bracket masih tertahan oleh cincin karet (O-ring) pada kawat, bracket akan meluncur bebas dan dapat berputar tajam melukai bibir dalam.

Penggunaan perekat non-medis (seperti lem sianoakrilat / lem super instan) sangat dilarang karena bersifat sitotoksik hebat terhadap sel-sel pulpa gigi dan mukosa mulut, menimbulkan nekrosis pulpa permanen dan luka bakar kimiawi. Di klinik, dokter ortodontis akan membersihkan sisa semen lama dengan bur komposit mikro dan melakukan etsa asam ulang (re-bonding).`,
      practicalSteps: [
        "Jika bracket berputar di kawat: Geser perlahan ke posisi tengah menggunakan jari bersih, lalu tempelkan orthodontic wax tebal untuk menstabilkannya.",
        "Jika bracket lepas seluruhnya: Ambil bracket dengan hati-hati, cuci bersih dengan air hangat, dan simpan dalam wadah kecil berpenutup.",
        "Periksa apakah kawat yang ditinggalkan bracket menusuk jaringan sekitar; beri wax bila perlu.",
        "Kirim pesan ke nomor WhatsApp klinik untuk membuat janji penempelan ulang bracket (re-bonding)."
      ],
      clinicalNote: "Membawa bracket yang lepas ke klinik dapat menghemat biaya Anda, karena jika bracket tersebut masih dalam kondisi baik dan tidak cacat, dokter dapat membersihkannya untuk disterilkan dan ditempel ulang.",
      dosAndDonts: {
        dos: [
          "Simpan bracket yang lepas di tempat yang aman dan higienis.",
          "Hindari mengunyah makanan keras di sisi gigi yang bracket-nya lepas.",
          "Segera beri tahu dokter ortodontis Anda."
        ],
        donts: [
          "Dilarang mengelem sendiri bracket dengan lem jenis apa pun.",
          "Jangan menarik paksa kawat behel jika ada komponen yang terlepas."
        ]
      }
    },
    {
      id: "sub-3-3",
      title: "Penanganan Rasa Ngilu Hebat & Iritasi Gusi",
      subtitle: "Kompresi air garam hangat dan manajemen nyeri biologis pasca aktivasi behel.",
      imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Kumur air garam hangat meredakan iritasi jaringan gusi dan meredakan perih.",
      keyPoints: [
        "Respon biologis pergeseran gigi wajar berlangsung 2 hingga 4 hari.",
        "Larutan salin hangat menarik cairan edema pada gusi meradang.",
        "Parasetamol 500mg aman digunakan sesuai anjuran dosis dokter."
      ],
      theoryContent: `Rasa ngilu pasca aktivasi behel disebabkan oleh pelepasan prostaglandin, substansi P, dan sitokin inflamasi saat ligamen periodontal tertekan (compression side). Kondisi ini menyebabkan vasodilatasi mikrosirkulasi dan edema lokal jaringan penyangga gigi.

Berkumur dengan larutan salin hipertonik hangat (air garam) memanfaatkan gradien osmosis untuk menarik kelebihan cairan edema dari ruang interstitial gusi ke luar, sehingga menurunkan tekanan intra-periodontal dan meredakan nyeri secara alami. Parasetamol merupakan analgesik pilihan karena bekerja sentral tanpa menghambat proses pergerakan gigi secara berlebihan.`,
      practicalSteps: [
        "Larutkan 1/2 sendok teh garam dapur bersih ke dalam 1 gelas (200 ml) air hangat kuku.",
        "Kumur-kumur lembut di rongga mulut selama 30-45 detik, pusatkan pada area gigi yang paling ngilu.",
        "Buang air kumur dan ulangi 2-3 kali sehari, terutama setelah makan dan sebelum tidur.",
        "Jika nyeri sangat mengganggu aktivitas, Anda dapat meminum Parasetamol 500mg setiap 6-8 jam setelah makan."
      ],
      clinicalNote: "Hindari penggunaan obat antiinflamasi non-steroid (OAINS) dosis tinggi seperti Ibuprofen atau Asam Mefenamat dalam jangka panjang, karena obat golongan ini menghambat diferensiasi osteoklas yang justru memperlambat laju pergerakan gigi.",
      dosAndDonts: {
        dos: [
          "Gunakan air garam hangat untuk menenangkan jaringan mulut.",
          "Makan makanan bersuhu dingin seperti es krim atau yoghurt lunak.",
          "Istirahat yang cukup untuk mempercepat proses adaptasi jaringan mulut."
        ],
        donts: [
          "Jangan menekan-nekan gigi dengan jari atau mengetuk gigi untuk menguji rasa sakit.",
          "Jangan mengonsumsi obat penghilang nyeri tanpa rekomendasi atau resep dokter."
        ]
      }
    }
  ],

  "edu-4": [
    {
      id: "sub-4-1",
      title: "Dekalsifikasi Enamel & Bercak Putih Permanen (White Spot Lesions)",
      subtitle: "Hilangnya mineral pelindung gigi akibat fermentasi asam bakteri di sekeliling bracket.",
      imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Bercak putih kusam terbentuk di sekeliling bracket jika plak dibiarkan menumpuk.",
      keyPoints: [
        "Bercak putih (white spot) adalah tanda awal gigi berlubang (karies awal).",
        "Terbentuk jika pH plak turun di bawah 5.5 secara berulang-ulang.",
        "Bisa bersifat permanen dan merusak estetika saat behel dilepas."
      ],
      theoryContent: `White Spot Lesions (WSL) adalah bentuk awal demineralisasi enamel sub-permukaan yang disebabkan oleh asam organik (laktat, asetat) hasil metabolisme bakteri plak Streptococcus mutans dan Lactobacillus spp. Di bawah bracket dan karet behel, akumulasi plak terlindungi dari aliran pembersihan alami saliva.

Ketika ion kalsium dan fosfat larut keluar dari prisma enamel, indeks bias cahaya pada email gigi berubah, tampak sebagai bercak putih kusam menyerupai kapur tulis. Jika tidak diremineralisasi menggunakan fluorida terkonsentrasi, lesi ini akan runtuh menjadi lubang gigi permanen (kavitasi).`,
      practicalSteps: [
        "Gunakan pasta gigi berfluorida tinggi setiap kali menyikat gigi.",
        "Gunakan sikat interdental untuk membersihkan tepian bracket agar tidak ada garis putih yang tertinggal.",
        "Minta dokter gigi mengaplikasikan varnish fluoride profesional setiap kali jadwal kontrol rutin.",
        "Batasi konsumsi minuman manis dan asam yang mempercepat penurunan pH mulut."
      ],
      clinicalNote: "Skor PCR (Plaque Control Record) Anda harus selalu di bawah 10% untuk menjamin permukaan enamel bebas dari risiko dekalsifikasi bercak putih.",
      dosAndDonts: {
        dos: [
          "Kumur air putih segera setelah mengonsumsi makanan atau minuman manis.",
          "Gunakan obat kumur berfluoride bebas alkohol sebelum tidur malam."
        ],
        donts: [
          "Jangan tidur tanpa menyikat gigi bersih terlebih dahulu.",
          "Jangan biarkan sisa makanan menempel di sekeliling sayap bracket sepanjang hari."
        ]
      }
    },
    {
      id: "sub-4-2",
      title: "Gingivitis & Pembengkakan Gusi (Gingival Overgrowth)",
      subtitle: "Respon radang kronis yang membuat gusi membesar menutupi bracket behel.",
      imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Radang gusi kronis memicu pembengkakan jaringan yang menutupi bracket.",
      keyPoints: [
        "Gusi tampak merah menyala, membesar, dan berdarah saat tersentuh sikat.",
        "Pembengkakan gusi dapat menutupi slot bracket dan menyulitkan aktivasi kawat.",
        "Dapat disembuhkan sepenuhnya jika plak dibersihkan secara konsisten."
      ],
      theoryContent: `Gingival enlargement (hiperplasia gingiva) pada pasien ortodonti dipicu oleh respon inflamasi kronis terhadap antigen lipopolisakarida (LPS) dinding sel bakteri plak yang menumpuk di sulkus gingiva. Keberadaan bracket dan komponen elastis behel memperbesar retensi mekanik biofilm.

Sitokin pro-inflamasi (IL-1β, TNF-α) merangsang proliferasi fibroblas dan akumulasi matriks ekstraseluler pada jaringan ikat gusi. Akibatnya, papila gusi membesar hingga membentuk 'pseudo-pocket', yang semakin menyulitkan pembersihan mandiri dan menciptakan lingkaran setan infeksi.`,
      practicalSteps: [
        "Sikat gusi dengan teknik Bass bersudut 45 derajat menggunakan bulu sikat ultra-soft.",
        "Gunakan obat kumur antiseptik Chlorhexidine Gluconate 0.12% selama 7–14 hari sesuai resep dokter jika gusi sangat bengkak.",
        "Lakukan pembersihan karang gigi (scaling) secara teratur di klinik gigi.",
        "Pijat lembut gusi saat menyikat gigi untuk memperlancar sirkulasi darah kapiler gingiva."
      ],
      clinicalNote: "Gusi yang bengkak parah dapat mengharuskan dokter melakukan tindakan gingivektomi (pemotongan jaringan gusi berlebih) sebelum perawatan ortodontik dapat dilanjutkan.",
      dosAndDonts: {
        dos: [
          "Tetap sikat gusi secara perlahan meskipun keluar sedikit darah.",
          "Gunakan sikat interdental di batas gusi antar gigi secara teliti."
        ],
        donts: [
          "Jangan takut menyikat gigi hanya karena melihat gusi sedikit berdarah.",
          "Hindari merokok atau vaping yang memperparah peradangan mikrovaskular gusi."
        ]
      }
    },
    {
      id: "sub-4-3",
      title: "Periodontitis & Resorpsi Tulang Penyangga Gigi",
      subtitle: "Kehilangan perlekatan tulang alveolar yang membahayakan stabilitas gigi berbehel.",
      imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Infeksi jaringan periodonsium merusak tumpuan tulang penyangga gigi.",
      keyPoints: [
        "Plak yang mengeras menjadi karang gigi masuk ke bawah garis gusi.",
        "Merusak serat ligamen periodontal dan mengikis tulang alveolar pendukung.",
        "Dokter WAJIB menghentikan tarikan kawat gigi bila terjadi periodontitis aktif."
      ],
      theoryContent: `Periodontitis merupakan infeksi destruktif lanjut yang melibatkan perlekatan jaringan penyangga gigi (tulang alveolar, sementum akar, dan ligamen periodontal). Ketika plak termineralisasi menjadi subgingival calculus, koloni bakteri anaerob merangsang pelepasan enzim matriks metalloproteinase (MMP) dan aktivasi RANKL (Receptor Activator of Nuclear Factor-κB Ligand).

Proses ini memicu destruksi osteoklastik puncak tulang alveolar (alveolar bone loss). Gigi yang sedang digerakkan dengan gaya ortodontik di atas tulang yang mengalami periodontitis aktif akan kehilangan anchorage, mengalami kegoyangan derajat tinggi, bahkan berisiko tanggal sebelum perawatan selesai.`,
      practicalSteps: [
        "Lakukan pemeriksaan radiografi panoramik berkala untuk memantau level puncak tulang alveolar.",
        "Lakukan kontrol rutin tepat waktu setiap 3-4 minggu sekali.",
        "Pastikan skor kebersihan mulut (OHIS) selalu berada dalam kategori Baik (< 1.2).",
        "Segera konsultasikan jika ada gigi yang terasa sangat goyang melebihi batas wajar."
      ],
      clinicalNote: "Perawatan behel tidak akan pernah bisa dilanjutkan sebelum kondisi radang periodontitis disembuhkan total. Kebersihan mulut Anda adalah kunci utama keselamatan gigi Anda.",
      dosAndDonts: {
        dos: [
          "Ikuti semua instruksi kebersihan mulut dari dokter gigi Anda.",
          "Jadwalkan pembersihan karang gigi profesional secara berkala."
        ],
        donts: [
          "Jangan mengabaikan rasa nyeri berdenyut atau bau mulut tidak sedap yang menetap.",
          "Jangan menunda kontrol saat gusi terasa nyeri dan goyang."
        ]
      }
    }
  ],

  "edu-5": [
    {
      id: "sub-5-1",
      title: "Pantangan Keras: Es Batu, Keripik & Kacang Utuh",
      subtitle: "Risiko fraktur bracket dan retakan mikro enamel gigi akibat tekanan mastikasi mendadak.",
      imageUrl: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Es batu dan keripik tebal adalah penyebab nomor satu lepasnya bracket behel.",
      keyPoints: [
        "Kekerasan es batu dan kacang melampaui batas elastisitas kawat dan lem behel.",
        "Patahan keripik keras yang tajam dapat menusuk jaringan gusi dan bibir.",
        "Biaya dan waktu pemasangan ulang bracket akan menunda jadwal lepas behel Anda."
      ],
      theoryContent: `Mengunyah es batu (-5°C) memberikan syok termal mendadak pada polimer resin komposit perekat bracket. Perbedaan koefisien ekspansi termal antara metal bracket, semen komposit, dan enamel gigi memicu keretakan mikro (micro-cracking) pada batas perlekatan.

Ditambah dengan beban oklusal vertikal yang tidak terduga dari gigitan kacang atau keripik keras, energi mekanik ini langsung menghancurkan ikatan semen, menyebabkan 'bond failure'. Pecahan bahan keras juga sering membengkokkan kawat lengkung NiTi yang fleksibel, memicu penyimpangan arah gerak gigi.`,
      practicalSteps: [
        "Tolak es batu saat memesan minuman dingin di luar rumah.",
        "Ganti kacang utuh dengan olahan selai lembut, tahu, atau tempe bacem empuk.",
        "Rendam biskuit atau kue kering ke dalam susu hangat sebelum dikunyah.",
        "Pilih kerupuk yang sudah lunak di dalam sup daripada kerupuk kaleng yang keras."
      ],
      clinicalNote: "Pasien yang mematuhi larangan makanan keras menyelesaikan perawatan behel rata-rata 4 hingga 6 bulan lebih cepat dibanding pasien yang sering mengalami bracket lepas.",
      dosAndDonts: {
        dos: [
          "Pilih makanan bertekstur empuk dan mudah dikunyah.",
          "Kunyah perlahan dengan gigi geraham belakang secara bilateral (kiri dan kanan bergantian)."
        ],
        donts: [
          "Dilarang keras mengunyah es batu, permen keras, atau cangkang kepiting.",
          "Jangan menggigit biji buah yang keras seperti biji jambu atau biji mangga."
        ]
      }
    },
    {
      id: "sub-5-2",
      title: "Pantangan Lengket: Dodol, Mochi & Permen Karet",
      subtitle: "Menempel kuat di sela kawat dan memicu pembusukan plak masif yang sulit dibersihkan.",
      imageUrl: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Makanan lengket dan kenyal dapat melilit kawat dan melepaskan karet behel.",
      keyPoints: [
        "Dapat menarik kawat keluar dari slot bracket saat mulut terbuka.",
        "Kandungan gula ketan menempel erat di sekeliling karet behel (power chain).",
        "Menjadi media fermentasi asam bakteri yang sangat agresif."
      ],
      theoryContent: `Zat makanan lengket berbasis amilopektin ketan dan gelatin memiliki sifat adesif tinggi terhadap permukaan logam dan keramik. Saat berkontak dengan air liur, zat ini membentuk jembatan polimer lengket yang menyatu dengan karet elastis (elastomeric ligatures).

Kekuatan tarikan mekanik saat mengunyah dapat melonggarkan ikatan kawat ligature, melepaskan power chain, dan bahkan menggeser letak cincin molar geraham. Sisa makanan ini tidak dapat dibilas hanya dengan berkumur air biasa dan memerlukan pembersihan mekanik intensif.`,
      practicalSteps: [
        "Ganti jajanan pasar kenyal dengan puding susu, kue bolu lembut, atau buah pisang empuk.",
        "Hindari semua jenis permen karet, baik yang berlabel bebas gula maupun biasa.",
        "Jika terlanjur makan makanan lengket, segera sikat gigi dan gunakan sikat interdental di bawah air mengalir."
      ],
      clinicalNote: "Karet behel yang terkontaminasi zat makanan lengket akan kehilangan elastisitasnya (force degradation) dalam hitungan jam, menghentikan penutupan celah gigi Anda.",
      dosAndDonts: {
        dos: [
          "Konsumsi dessert lembut seperti es krim plain, puding vanila, atau yogurt mangkok.",
          "Segera periksa apakah ada karet behel yang putus atau terlepas."
        ],
        donts: [
          "Hindari dodol, jenang, mochi kenyal, permen karamel liat, dan marshmallow kenyal.",
          "Jangan menarik sisa makanan lengket di kawat menggunakan benda tajam seperti peniti."
        ]
      }
    },
    {
      id: "sub-5-3",
      title: "Trik Aman Makanan Alot: Daging Steak & Jagung",
      subtitle: "Modifikasi cara konsumsi (dipotong dadu / dipipil) untuk menghindari gaya ungkit frontal.",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Potong daging menjadi ukuran dadu kecil atau serut jagung dari tongkolnya.",
      keyPoints: [
        "Menggigit jagung langsung dari tongkol memberi gaya ungkit yang mencabut bracket depan.",
        "Serat daging liat tersangkut di antara kawat dan memicu nyeri interdental hebat.",
        "Solusi cerdas: Potong dadu kecil sekali suap (bite-sized) atau cincang halus."
      ],
      theoryContent: `Tindakan menggigit langsung makanan bertongkol (seperti jagung bakar) atau buah utuh menggunakan gigi seri anterior menciptakan mekanisme tuas kelas satu (first-class lever system). Titik tumpu berada pada linggir gigi seri, dan beban diarahkan ke luar bibir.

Gaya ungkit ini bekerja berlawanan arah dengan gaya adhesi semen resin bracket, sehingga hampir pasti menyebabkan kegagalan ikatan pada bracket gigi seri yang luas permukaannya sempit. Dengan memotong makanan menjadi potongan kecil sekali suap, beban dialihkan langsung ke permukaan oklusal gigi geraham yang memiliki luas penampang lebih besar.`,
      practicalSteps: [
        "Jagung: Serut atau pipil jagung dari tongkolnya menggunakan pisau ke dalam mangkuk sebelum dimakan.",
        "Daging sapi/kambing: Potong dadu sangat kecil, suwir empuk, atau pilih olahan daging giling (seperti bakso lunak, kornet, atau patty burger lembut).",
        "Apel & Wortel: Iris menjadi lembaran sangat tipis (seperti keripik buah basah) atau parut halus.",
        "Ayam: Lepaskan daging ayam dari tulangnya sebelum disuap ke dalam mulut."
      ],
      clinicalNote: "Mengonsumsi protein tetap sangat dianjurkan untuk mendukung proses remodeling jaringan tulang alveolar. Cukup modifikasi cara penyajiannya agar ramah bagi behel Anda.",
      dosAndDonts: {
        dos: [
          "Selalu gunakan pisau dan garpu untuk memotong makanan liat di atas piring.",
          "Pilih olahan daging yang dimasak presto empuk atau tim ikan tanpa duri."
        ],
        donts: [
          "Dilarang menggigit jagung langsung dari tongkolnya!",
          "Jangan menggigit daging langsung dari tulang iga atau paha ayam utuh."
        ]
      }
    },
    {
      id: "sub-5-4",
      title: "Minuman Bersoda & Asam yang Mengikis Perekat Behel",
      subtitle: "Asam fosfat dan sitrat yang mempercepat pelarutan semen dan memicu karies sela kawat.",
      imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Minuman bersoda melarutkan semen perekat dan menciptakan bercak putih karies.",
      keyPoints: [
        "Minuman bersoda memiliki tingkat keasaman tinggi (pH 2.5–3.2).",
        "Melarutkan semen resin komposit ortodonti dan prisma hidroksiapatit enamel.",
        "Memicu kebocoran mikro (microleakage) di bawah dasar bracket."
      ],
      theoryContent: `Minuman berkarbonasi (soda), minuman berenergi, dan sari buah sitrus kemasan memiliki keasaman tinggi dengan kandungan asam fosfat dan asam sitrat. Ketika terpapar cairan asam ini, ion kalsium pada email gigi akan larut ke lingkungan mulut (demineralisasi) dalam hitungan detik.

Selain merusak email, asam sitrat mengikis matriks polimer BIS-GMA semen komposit perekat bracket. Fenomena ini menyebabkan 'microleakage'—terbentuknya celah kapiler mikro antara dasar bracket dan email gigi yang tidak terjangkau sikat gigi, menjadi sarang karies tersembunyi yang merusak gigi dari dalam.`,
      practicalSteps: [
        "Jadikan air mineral dingin sebagai minuman utama Anda sehari-hari.",
        "Jika meminum jus buah segar, gunakan sedotan ramah lingkungan yang diletakkan di bagian belakang mulut dekat tenggorokan agar tidak membasahi gigi depan.",
        "Jangan langsung menyikat gigi setelah meminum minuman asam; kumur dengan air putih dan tunggu 30 menit agar enamel tidak terkikis saat melunak.",
        "Konsumsi susu murni berkalsium tinggi untuk membantu remineralisasi alami enamel."
      ],
      clinicalNote: "Hindari kebiasaan menahan minuman soda di dalam rongga mulut sebelum menelannya. Hal ini memperpanjang durasi paparan asam pada semen perekat behel Anda.",
      dosAndDonts: {
        dos: [
          "Minum air putih minimal 8 gelas sehari.",
          "Bilas mulut dengan air bersih segera setelah meminum minuman berasa manis atau asam."
        ],
        donts: [
          "Hindari minuman soda kemasan dan minuman energi berkafein asam tinggi.",
          "Jangan menyikat gigi segera setelah meminum jus lemon pekat (tunggu 30 menit)."
        ]
      }
    }
  ],

  "edu-6": [
    {
      id: "sub-6-1",
      title: "Siklus Aktivasi Kawat & Daya Lenting Karet Elastis",
      subtitle: "Mengapa kekuatan tarikan melemah setelah 3-4 minggu dan gigi berhenti bergeser.",
      imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Kawat NiTi dan karet behel membutuhkan aktivasi berkala agar gigi terus bergerak.",
      keyPoints: [
        "Kawat behel bekerja menghasilkan tekanan ringan konstan yang menggeser gigi.",
        "Setelah 3-4 minggu, gigi mencapai posisi ekuilibrium baru dan gaya tarikan melemah.",
        "Menunda kontrol membuat pergerakan gigi terhenti total (stagnan)."
      ],
      theoryContent: `Pergerakan gigi ortodontik (Orthodontic Tooth Movement / OTM) bergantung pada pemberian gaya biologis optimal (optimal orthodontic force) yang merangsang respon vaskular ligamen periodontal. Kawat lengkung NiTi (Nikel-Titanium) melepaskan gaya pemulihan bentuk (pseudoelastic recovery force) secara perlahan.

Seiring bergesernya gigi ke posisi lengkung baru, defleksi kawat berkurang dan gaya mekanik mendekati nol (force decay). Begitu pula dengan rantai karet (power chain) yang mengalami degradasi elastisitas hingga 50–70% dalam 21 hari pertama di rongga mulut akibat suhu dan enzim saliva. Kunjungan kontrol rutin setiap 3–4 minggu diperlukan untuk mengganti kawat ke ukuran/material lebih kaku dan memperbarui karet elastis agar stimulasi pergeseran gigi tetap aktif berlanjut.`,
      practicalSteps: [
        "Catat tanggal kontrol rutin berikutnya di kalender smartphone Anda segera setelah selesai kontrol.",
        "Patuhi interval kontrol 3 hingga 4 minggu sesuai arahan dokter spesialis ortodonsia Anda.",
        "Beri tahu dokter jika merasa tarikan karet sudah sangat longgar atau kawat tidak terasa aktif lagi.",
        "Jangan mengubah sendiri posisi karet atau kawat tanpa bimbingan dokter."
      ],
      clinicalNote: "Pergerakan gigi yang sehat terjadi bertahap sekitar 0.8 hingga 1.2 mm per bulan. Mempercepat kontrol kurang dari 2 minggu justru berbahaya karena dapat menyebabkan kematian pulpa gigi dan nekrosis jaringan tulang.",
      dosAndDonts: {
        dos: [
          "Datang tepat waktu sesuai jadwal kontrol yang disepakati.",
          "Bawa catatan keluhan kecil selama sebulan terakhir untuk disampaikan ke dokter."
        ],
        donts: [
          "Jangan menunda kontrol hanya karena merasa gigi terlihat sudah cukup rapi.",
          "Jangan mencoba mengencangkan sendiri kawat menggunakan tang perkakas."
        ]
      }
    },
    {
      id: "sub-6-2",
      title: "Evaluasi Vektor Pergeseran & Koreksi Dini Penyimpangan",
      subtitle: "Memastikan gigi bergerak pada bidang oklusal yang tepat tanpa merusak lengkung rahang.",
      imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Dokter mengevaluasi keselarasan gigitan dan mencegah efek samping yang tidak diinginkan.",
      keyPoints: [
        "Setiap pergerakan gigi memiliki efek aksi dan reaksi pada gigi penahan (anchorage).",
        "Kontrol rutin mendeteksi jika gigi bergeser ke arah yang salah sebelum menjadi parah.",
        "Penyesuaian kurva kawat (wire bending) dilakukan dokter sesuai progres terkini."
      ],
      theoryContent: `Hukum Newton Ketiga berlaku dalam biomekanika ortodonsia: setiap gaya tarikan untuk menggeser gigi malposisi akan menimbulkan gaya reaksi balik pada gigi penjangkar (anchorage teeth). Tanpa evaluasi klinis berkala, gigi penjangkar dapat mengalami kehilangan anchorage (loss of anchorage), misalnya gigi geraham tertarik maju ke depan padahal ruang pencabutan dibutuhkan untuk memundurkan gigi seri.

Saat kontrol berkala, dokter spesialis ortodonti melakukan pengukuran overjet, overbite, relasi interdigitasi kaninus/molar, dan centerline lengkung rahang. Jika ditemukan penyimpangan tipping atau rotasi yang tidak diinginkan, dokter dapat segera mengompensasinya dengan teknik penekukan kawat mikro (artistic wire bending) atau pemasangan elastics intermaksiler tambahan.`,
      practicalSteps: [
        "Konsultasikan setiap perubahan bentuk gigitan yang Anda rasakan selama sebulan terakhir.",
        "Laporkan jika ada gigi yang terasa mengganjal saat mengatupkan rahang atas dan bawah.",
        "Dengarkan penjelasan dokter mengenai tahapan perawatan yang sedang berlangsung (apakah tahap leveling, penutupan ruang, atau detailing)."
      ],
      clinicalNote: "Gigi yang bergerak menyimpang akibat kontrol yang tertunda berbulan-bulan membutuhkan waktu 3-6 bulan tambahan hanya untuk mengembalikan posisi gigi ke jalur semula!",
      dosAndDonts: {
        dos: [
          "Diskusikan ekspektasi senyum dan kenyamanan gigitan Anda dengan dokter.",
          "Foto senyum Anda setiap bulan untuk mendokumentasikan progres pergeseran gigi."
        ],
        donts: [
          "Jangan mengabaikan rasa gigitan yang tidak seimbang pasca kontrol."
        ]
      }
    },
    {
      id: "sub-6-3",
      title: "Scaling & Pembersihan Karang Gigi Profesional",
      subtitle: "Pembersihan plak keras di sekeliling bracket yang hanya dapat dikerjakan alat ultrasonik klinik.",
      imageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Pembersihan ultrasonik klinik mengangkat karang gigi yang menghalangi pergeseran behel.",
      keyPoints: [
        "Karang gigi (calculus) tidak bisa hilang hanya dengan sikat gigi rumahan.",
        "Karang gigi yang membatu di kawat bertindak sebagai ganjalan mekanik.",
        "Pembersihan rutin menjaga gusi tetap sehat dan tidak mudah berdarah."
      ],
      theoryContent: `Biofilm plak yang tidak tersikat dalam 48–72 jam akan mengikat ion kalsium dan fosfat dari air liur, mengalami mineralisasi menjadi karang gigi (calculus) yang melekat erat pada email dan logam bracket. Karang gigi memiliki struktur berpori yang menjadi tempat berkembangbiak jutaan bakteri patogen.

Secara mekanik, karang gigi yang menumpuk di antara sayap bracket dan kawat lengkung meningkatkan koefisien gesekan (friction resistance) antara kawat dan slot bracket. Hal ini menghambat mekanisme geser kawat (sliding mechanics) yang diperlukan untuk menutup celah gigi. Di klinik, dokter menggunakan scaler ultrasonik bergetaran 25–30 kHz yang melepaskan karang gigi tanpa merusak permukaan email gigi.`,
      practicalSteps: [
        "Biarkan dokter membersihkan karang gigi di sela bracket saat kawat dilepas.",
        "Lakukan kumur antiseptik yang disediakan asisten gigi sebelum tindakan dimulai.",
        "Perhatikan area mana saja yang menurut dokter paling banyak menumpuk karang gigi, agar Anda bisa memberi perhatian ekstra saat menyikat gigi di rumah."
      ],
      clinicalNote: "Gusi yang bersih dari karang gigi menghasilkan pergerakan gigi yang lebih mulus dan mengurangi rasa ngilu pasca penggantian kawat baru.",
      dosAndDonts: {
        dos: [
          "Minta dokter melakukan evaluasi skor PCR (Plaque Control Record) Anda setiap kunjungan.",
          "Gunakan pasta gigi pelindung enamel setelah tindakan scaling."
        ],
        donts: [
          "Jangan mencongkel sendiri karang gigi menggunakan peniti atau jarum di rumah!"
        ]
      }
    },
    {
      id: "sub-6-4",
      title: "Risiko Fatal Menunda Kontrol: Waktu Molor & Resorpsi Akar",
      subtitle: "Bahaya gaya mekanik statis terlalu lama yang merusak ujung akar gigi (apical resorption).",
      imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Menunda kontrol berisiko memperpendek panjang akar gigi dan memundurkan tanggal lepas behel.",
      keyPoints: [
        "Menunda kontrol 1 kali memundurkan pelepasan behel hingga 2–3 bulan.",
        "Kawat yang ditinggalkan terlalu lama dapat memberikan tekanan tidak seimbang pada akar.",
        "Risiko pemendekan akar gigi (eksternal apical root resorption) yang permanen."
      ],
      theoryContent: `Salah satu komplikasi terberat akibat penelantaran kawat gigi adalah Resorpsi Akar Apikal Eksternal (External Apical Root Resorption / EARR). Ketika gaya ortodontik berlangsung terlalu lama pada satu titik tanpa evaluasi dan pelepasan tegangan berkala, area hialinisasi (hyalinization zone) pada ligamen periodontal tidak dapat pulih.

Makrofag dan odontoklas akan menyerang sementum pelindung ujung akar gigi, melarutkan dentin akar dan menyebabkan pemendekan panjang akar gigi secara permanen. Akar gigi yang memendek drastis akan mengurangi stabilitas gigi di dalam tulang alveolar seumur hidup pasien.`,
      practicalSteps: [
        "Jika terpaksa berhalangan hadir pada tanggal yang ditentukan, segera hubungi klinik untuk memundurkan janji maksimal 3–5 hari.",
        "Jangan menghilang berbulan-bulan tanpa kabar ke dokter ortodontis Anda.",
        "Jika Anda harus keluar kota dalam waktu lama, konsultasikan dengan dokter agar kawat dapat disesuaikan ke posisi pasif yang aman."
      ],
      clinicalNote: "Komitmen pasien terhadap jadwal kontrol adalah 50% kunci keberhasilan perawatan ortodonsia. Dokter gigi dan pasien adalah mitra tim untuk mewujudkan senyum sehat impian Anda.",
      dosAndDonts: {
        dos: [
          "Simpan nomor WhatsApp darurat klinik di daftar kontak utama Anda.",
          "Segera konfirmasi kehadiran kontrol minimal H-1 sebelum jadwal."
        ],
        donts: [
          "Jangan menunda kontrol hingga 2 bulan berturut-turut.",
          "Jangan berasumsi bahwa behel yang didiamkan akan tetap merapikan gigi dengan sendirinya."
        ]
      }
    }
  ],

  "edu-7": [
    {
      id: "sub-7-1",
      title: "Alat Bantu Flossing: Superfloss vs Floss Threader",
      subtitle: "Memilih pemandu benang yang tepat untuk melewati rintangan kawat lengkung behel.",
      imageUrl: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Alat bantu memudahkan benang menembus sela kawat tanpa menusuk gusi.",
      videoUrl: "https://www.youtube.com/embed/3_vHsOGiIo4",
      videoTitle: "Tutorial Flossing Pasien Orthodonti (Alat Bantu Superfloss & Floss Threader)",
      videoOriginalUrl: "https://youtu.be/3_vHsOGiIo4?si=RDIfeRNIYVJbyQ3p",
      keyPoints: [
        "Kawat ortodonti menghalangi benang gigi biasa masuk langsung dari atas.",
        "Floss Threader berbentuk jarum lentur plastik untuk mengarahkan benang konvensional.",
        "Superfloss memiliki bagian ujung kaku dan bagian spons pengembang terintegrasi."
      ],
      theoryContent: `Struktur anatomi piranti ortodontik cekat menciptakan penghalang fisik kontinu (continuous barrier) di sepanjang bidang bukal gigi. Pasien tidak dapat menggunakan benang gigi biasa dengan cara menyentakkannya dari sisi oklusal karena akan langsung tertahan oleh kawat lengkung (archwire).

Untuk mengatasi hambatan ini, diciptakan dua inovasi instrumen:
1. Floss Threader: Jarum nilon fleksibel dengan loop besar yang bertindak sebagai pemandu kawat (guide-wire) untuk memasukkan benang gigi biasa ke bawah kawat ortodontik.
2. Superfloss: Benang gigi pra-potong tiga segmen (ujung kaku kopolimer, spons nilon bertekstur, dan benang biasa) yang dirancang all-in-one untuk efisiensi waktu pembersihan pasien behel aktif.`,
      practicalSteps: [
        "Opsi 1 (Floss Threader): Masukkan sekitar 30 cm benang gigi biasa ke dalam lingkaran Floss Threader. Selipkan ujung runcing jarum plastik ke bawah kawat behel, lalu tarik keluar hingga benang terbawa ke sela gigi.",
        "Opsi 2 (Superfloss): Ambil seutas Superfloss. Gunakan ujung yang kaku (stiff end) untuk menusuk perlahan celah di bawah kawat behel dari arah luar ke dalam.",
        "Pilih alat yang paling nyaman dan mudah Anda kendalikan di depan cermin."
      ],
      clinicalNote: "Gunakan benang gigi berlapisan lilin (waxed) untuk mencegah benang robek atau berserabut saat bergesekan dengan sudut logam bracket yang tajam.",
      dosAndDonts: {
        dos: [
          "Sediakan benang gigi cadangan di saku atau tas kerja Anda.",
          "Gunakan cermin rias yang memiliki pembesaran (magnifying mirror) agar mudah melihat celah kawat."
        ],
        donts: [
          "Jangan gunakan benang jahit pakaian biasa karena tidak steril dan dapat melukai gusi!",
          "Jangan menarik benang secara terburu-buru hingga benang kusut di kawat."
        ]
      }
    },
    {
      id: "sub-7-2",
      title: "Teknik Gerakan Huruf 'C' Mengikis Plak Interdental",
      subtitle: "Menghindari gerakan menyentak tajam ke bawah yang dapat merusak papila interdental gusi.",
      imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Lengkungkan benang membentuk huruf C untuk membungkus sisi samping gigi.",
      videoUrl: "https://www.youtube.com/embed/3_vHsOGiIo4",
      videoTitle: "Tutorial Flossing Pasien Orthodonti (Teknik Gerakan Huruf C)",
      videoOriginalUrl: "https://youtu.be/3_vHsOGiIo4?si=RDIfeRNIYVJbyQ3p",
      keyPoints: [
        "Lengkungkan benang memeluk dinding samping gigi seperti huruf C.",
        "Gerakkan perlahan naik-turun dari batas bawah gusi ke arah ujung gigitan.",
        "Membersihkan dua dinding proksimal gigi yang berbeda dalam satu sela."
      ],
      theoryContent: `Dinding aproksimal gigi memiliki kontur cembung alami (contact area) dan cekungan servikal (cervical concavity) tempat berdiamnya biofilm anaerob. Gerakan flossing yang salah (hanya menekan benang lurus ke bawah) hanya membersihkan titik kontak titik dan berisiko merobek papila interdental (interdental papilla laceration).

Dengan melengkungkan benang membentuk kurva huruf 'C' (C-shaped flossing technique), tegangan benang mendistribusikan tekanan secara merata pada kelengkungan email gigi. Gerakan mengikis ke arah koronal mengangkat biofilm plak subgingiva setinggi 1–2 mm di bawah margin gingival bebas tanpa menyebabkan trauma mekanik.`,
      practicalSteps: [
        "Setelah benang berada di antara dua gigi, tekan benang melengkung memeluk salah satu dinding gigi (membentuk huruf C).",
        "Geser benang secara perlahan masuk sedikit ke bawah garis gusi hingga terasa tahanan lembut.",
        "Kikis dinding gigi dengan gerakan naik-turun 3 hingga 5 kali.",
        "Lalu, lengkungkan benang memeluk dinding gigi di sebelahnya dalam sela yang sama, dan ulangi gerakan mengikis.",
        "Tarik benang keluar secara perlahan, lalu pindah ke sela gigi berikutnya."
      ],
      clinicalNote: "Perdarahan ringan saat pertama kali belajar flossing adalah hal biasa akibat peradangan gusi lokal. Tetap lakukan secara rutin setiap malam; gusi akan sehat dan berhenti berdarah dalam 1 minggu.",
      dosAndDonts: {
        dos: [
          "Gunakan bagian benang yang bersih untuk setiap sela gigi yang berbeda.",
          "Lakukan dengan sabar dan rileks tanpa tergesa-gesa."
        ],
        donts: [
          "Jangan menyentakkan benang dengan keras ke dalam gusi (dapat menyebabkan luka dan resesi gusi).",
          "Jangan hanya menggesek benang maju-mundur seperti menggergaji kayu."
        ]
      }
    },
    {
      id: "sub-7-3",
      title: "Flossing di Malam Hari & Perlindungan Karies Interproksimal",
      subtitle: "Mengapa malam hari sebelum tidur adalah waktu paling vital bagi perlindungan enamel gigi.",
      imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Flossing malam hari mencegah fermentasi asam bakteri saat produksi saliva berkurang.",
      keyPoints: [
        "Produksi air liur (saliva) menurun hingga 80% saat Anda tertidur lelap.",
        "Air liur berfungsi menetralisir asam dan membersihkan sisa makanan secara alami.",
        "Sisa makanan di sela gigi yang tidak diflossing akan langsung difermentasi bakteri semalaman."
      ],
      theoryContent: `Laju sekresi saliva yang tidak distimulasi (unstimulated salivary flow rate) mengikuti ritme sirkadian tubuh, mencapai titik terendah selama fase tidur malam. Saliva mengandung komponen protektif krusial: ion bikarbonat (buffer pH asam), lisozim, laktoferin, dan imunoglobulin sekretori (sIgA) yang menekan aktivitas mikroba mulut.

Ketika pasien tidur dengan sisa makanan menempel di sela gigi, tidak ada pertahanan saliva yang menetralisir pH rongga mulut. Bakteri karies akan memproduksi asam laktat secara terus menerus selama 6–8 jam tidur, menyebabkan demineralisasi interproksimal masif yang memicu lubang gigi samping yang parah.`,
      practicalSteps: [
        "Jadikan flossing sebagai ritual tetap sebelum Anda menyikat gigi malam hari.",
        "Urutan terbaik: Flossing sela gigi terlebih dahulu -> Gunakan sikat interdental -> Sikat gigi dengan sikat ortodontik -> Kumur bersih.",
        "Tidur dengan rongga mulut yang bersih 100% dari plak dan sisa makanan berserat.",
        "Rasakan sensasi sela gigi yang lega dan napas segar di pagi hari."
      ],
      clinicalNote: "Pasien yang rutin flossing setiap malam hari memiliki tingkat keberhasilan perawatan ortodontik tertinggi dan bebas dari komplikasi gigi berlubang pasca pelepasan behel.",
      dosAndDonts: {
        dos: [
          "Luangkan waktu 3 hingga 5 menit setiap malam untuk flossing menyeluruh.",
          "Gunakan lampu penerangan kamar mandi yang cukup terang saat flossing."
        ],
        donts: [
          "Jangan langsung tidur setelah makan camilan malam tanpa flossing dan menyikat gigi.",
          "Jangan mengganti flossing dengan obat kumur saja (obat kumur tidak bisa mengangkat biofilm plak secara mekanis)."
        ]
      }
    }
  ],

  "edu-8": [
    {
      id: "sub-8-1",
      title: "Pemilihan Ukuran Sikat Sela Sesuai Celah Gigi",
      subtitle: "Panduan memilih diameter ISO (0.4 mm - 1.2 mm) agar pas tanpa melukai jaringan gusi.",
      imageUrl: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Pilih ukuran sikat interdental yang pas: cukup longgar tapi menyentuh dinding gigi.",
      keyPoints: [
        "Standar ISO membagi ukuran sikat sela dari Size 0 (0.4 mm) hingga Size 5 (1.2 mm+).",
        "Ukuran terlalu besar melukai gusi; ukuran terlalu kecil tidak efektif membersihkan.",
        "Biasanya pasien membutuhkan 2 ukuran: kecil untuk gigi depan, agak besar untuk geraham."
      ],
      theoryContent: `Ruang interdental memiliki dimensi bervariasi sesuai anatomi embrasur gingiva (Gingival Embrasure Types I, II, dan III). Standar Internasional ISO 16409 mengklasifikasikan sikat interdental berdasarkan diameter kawat inti (wire core) dan lebar lintasan celah (passage hole diameter / PHD).

Jika kawat sikat terlalu besar, gaya friksi berlebih akan menyebabkan abrasi sementum leher gigi dan trauma pada papila interdental (gingival clefts). Sebaliknya, jika diameter bulu sikat terlalu kecil dibanding celah interdental, bulu nilon gagal menghasilkan gesekan hidro-mekanik pada dinding aproksimal gigi, meninggalkan sisa biofilm plak utuh di permukaan email.`,
      practicalSteps: [
        "Gigi Seri Depan: Gunakan ukuran sangat halus (Size 0 atau Size 1, warna pink/oranye, diameter 0.4–0.6 mm) karena sela gigi depan umumnya lebih rapat.",
        "Gigi Geraham Belakang & Sela Pencabutan: Gunakan ukuran sedang (Size 2 atau Size 3, warna hijau/biru, diameter 0.7–0.9 mm) untuk celah yang lebih longgar.",
        "Uji coba: Masukkan sikat dengan tekanan sangat ringan. Sikat harus bisa meluncur masuk tanpa menekuk kawat intinya.",
        "Konsultasikan ke dokter spesialis ortodonsia Anda untuk mendapatkan rekomendasi ukuran spesifik yang sesuai dengan celah gigi Anda."
      ],
      clinicalNote: "Jangan pernah memaksakan sikat sela masuk jika terasa sangat sempit. Jika tidak ada celah, gunakan dental floss (benang gigi) untuk sela gigi tersebut.",
      dosAndDonts: {
        dos: [
          "Beli kemasan starter-pack yang berisi berbagai varian ukuran untuk mencoba ukuran yang paling pas.",
          "Ganti ukuran sikat seiring bertambah lebarnya celah gigi selama proses pergeseran ortodontik."
        ],
        donts: [
          "Jangan memaksakan sikat berukuran besar masuk ke sela gigi depan yang sempit.",
          "Jangan gunakan sikat yang kawat pelindungnya sudah terkelupas karena kawat tajam dapat menggores bracket."
        ]
      }
    },
    {
      id: "sub-8-2",
      title: "Teknik Manuver di Bawah Kawat & Sayap Bracket",
      subtitle: "Sudut masuk vertikal dan horizontal untuk mengangkat sisa makanan yang terperangkap membandel.",
      imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Manuver di bawah kawat lengkung mengangkat plak stagnan di sudut undercut bracket.",
      keyPoints: [
        "Sudut vertikal dari atas kawat ke bawah membersihkan alur atas bracket.",
        "Sudut horizontal dari samping membersihkan sela antara dua bracket bertetangga.",
        "Gerakan in-and-out lembut beberapa kali tanpa memutar sikat secara paksa."
      ],
      theoryContent: `Sayap bracket (bracket tie wings), kait elastis (hooks), dan kawat lengkung membentuk sistem retensi mekanik tiga dimensi dengan banyak sudut mati (dead zones) yang tidak terpengaruh oleh aliran saliva. Area ini menjadi tempat ideal bagi kolonisasi bakteri plak anaerob gram negatif.

Dengan memasukkan sikat interdental secara ortogonal (tegak lurus) terhadap sumbu panjang kawat, bulu-bulu nilon sikat akan mengembang di bawah kawat archwire, menghasilkan efek sapuan 'piston action'. Tindakan ini menciptakan gaya geser hidrodinamik yang melarutkan matriks biofilm ekstraseluler plak yang melekat kuat pada semen komposit behel.`,
      practicalSteps: [
        "Manuver 1 (Kolong Kawat Atas): Masukkan sikat dari atas kawat mengarah ke bawah di samping bracket. Gerakkan maju-mundur perlahan 3-4 kali.",
        "Manuver 2 (Kolong Kawat Bawah): Masukkan sikat dari bawah kawat mengarah ke atas di sisi berlawanan untuk membersihkan sayap bawah bracket.",
        "Manuver 3 (Celah Antar Gigi): Arahkan sikat tegak lurus menembus celah segitiga di dekat gusi di antara dua gigi, dorong lembut ke arah dalam lalu tarik keluar.",
        "Bilas sikat dengan air bersih setelah membersihkan setiap satu pasang bracket sebelum melanjutkan."
      ],
      clinicalNote: "Gunakan sikat interdental dengan kepala sikat yang bisa ditekuk perlahan (flexible neck) untuk memudahkan manuver di area gigi geraham belakang yang sulit dijangkau.",
      dosAndDonts: {
        dos: [
          "Gunakan cermin dan pencahayaan yang cukup saat melakukan manuver sikat sela.",
          "Bilas mulut dengan air bersih setelah selesai membersihkan seluruh bracket."
        ],
        donts: [
          "Jangan memutar (twisting) sikat interdental saat berada di sela gigi karena kawatnya bisa patah.",
          "Jangan menekan sikat ke arah jaringan gusi secara tegak lurus."
        ]
      }
    },
    {
      id: "sub-8-3",
      title: "Sanitasi, Higienitas, & Jadwal Penggantian Sikat",
      subtitle: "Cara mencuci sikat sela dan kapan harus mengganti sikat baru (setiap 1-2 minggu).",
      imageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80",
      imageCaption: "Cuci bersih dan keringkan sikat di udara terbuka untuk mencegah kolonisasi bakteri.",
      keyPoints: [
        "Sikat sela yang kotor dan lembap menjadi sarang bakteri baru.",
        "Cuci dengan air mengalir dan keringkan secara vertikal di tempat terbuka.",
        "Ganti sikat baru setiap 1 hingga 2 minggu sekali, atau bila kawat sudah bengkok."
      ],
      theoryContent: `Penelitian mikrobiologi menunjukkan bahwa sikat interdental yang telah digunakan berulang kali mengandung koloni bakteri rongga mulut (Streptococcus, Fusobacterium, Prevotella) dalam jumlah tinggi. Jika sikat disimpan dalam wadah tertutup yang lembap, bakteri akan berkembang biak dan berisiko menyebabkan re-inokulasi bakteri patogen kembali ke dalam sulkus gingiva pasien.

Selain itu, kawat logam inti sikat sela mengalami kelelahan logam (metal fatigue) akibat tekukan berulang saat manuver di bawah kawat behel. Ketika kawat inti patah di dalam sela gigi, ujung tajamnya dapat melukai ligamen periodontal dan menimbulkan infeksi abses gingiva akut.`,
      practicalSteps: [
        "Setelah digunakan, cuci bersih bulu sikat di bawah air mengalir sambil diusap lembut dengan jari bersih.",
        "Kibaskan sisa air hingga tidak ada tetesan air berlebih.",
        "Simpan sikat dengan posisi kepala sikat menghadap ke atas di tempat berventilasi baik agar cepat mengering.",
        "Tutup dengan helm pelindung sikat (vented protective cap) hanya jika hendak dibawa bepergian di dalam tas.",
        "Ganti sikat baru jika: (1) Bulu sikat sudah rontok atau mekar, (2) Kawat inti sudah melengkung lemas, atau (3) Sikat sudah dipakai lebih dari 10-14 hari."
      ],
      clinicalNote: "Jangan pernah menggunakan sikat interdental yang kawatnya sudah patah atau bengkok berkali-kali. Kawat yang rapuh dapat patah dan tertinggal di sela gigi Anda.",
      dosAndDonts: {
        dos: [
          "Beli sikat interdental dalam kemasan multipack (isi 5-8 pcs) agar selalu siap sikat baru cadangan.",
          "Rendam berkala dalam larutan obat kumur klorheksidin selama 1 menit untuk disinfeksi ekstra."
        ],
        donts: [
          "Jangan menyimpan sikat basah di dalam dompet atau saku celana tanpa penutup berventilasi.",
          "Jangan menggunakan kembali sikat interdental yang sudah berumur lebih dari 1 bulan."
        ]
      }
    }
  ]
};

// Cover images for the 8 articles
export const articleCoverImages: Record<string, string> = {
  "edu-1": "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&auto=format&fit=crop&q=80",
  "edu-2": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
  "edu-3": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80",
  "edu-4": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80",
  "edu-5": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
  "edu-6": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80",
  "edu-7": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80",
  "edu-8": "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80"
};
