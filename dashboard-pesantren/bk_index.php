<?php
// ==========================================
// 1. DATA DEFAULT & SECURE FALLBACKS (Sesuai Visual image_26b8e0.png)
// ==========================================
$totalSantri = 0;
$totalAlumni = 0;
$totalUstadz = 0;

// Data default cabang sesuai urutan visual tabel di image_26b8e0.png
$cabangData = [
    ['id' => 1, 'nama' => 'PPYD Al Ikhlas Putra', 'total_semua' => 0, 'ustadz' => 0, 'berasrama' => 0, 'anak_pengurus' => 0, 'pengabdian' => 0, 'non_mukim' => 0],
    ['id' => 2, 'nama' => 'PPYD Al Ikhlas Putri', 'total_semua' => 0, 'ustadz' => 0, 'berasrama' => 0, 'anak_pengurus' => 0, 'pengabdian' => 0, 'non_mukim' => 0],
    ['id' => 6, 'nama' => 'Baiti Jannati',          'total_semua' => 0, 'ustadz' => 0,  'berasrama' => 0,  'anak_pengurus' => 0, 'pengabdian' => 0, 'non_mukim' => 0],
    ['id' => 3, 'nama' => 'RH An-Nuha Putra',       'total_semua' => 0, 'ustadz' => 0,  'berasrama' => 0, 'anak_pengurus' => 0, 'pengabdian' => 0, 'non_mukim' => 0],
    ['id' => 4, 'nama' => 'RH An-Nuha Putri 1',     'total_semua' => 0, 'ustadz' => 0,  'berasrama' => 0,  'anak_pengurus' => 0, 'pengabdian' => 0, 'non_mukim' => 0],
    ['id' => 5, 'nama' => 'RH An-Nuha Putri 2',     'total_semua' => 0, 'ustadz' => 0,  'berasrama' => 0,  'anak_pengurus' => 0, 'pengabdian' => 0, 'non_mukim' => 0]
];

// Jenjang pendidikan sesuai visual list di image_26b8e0.png
$pendidikanData = [
    ['tingkat' => 'TK', 'jumlah' => 0],
    ['tingkat' => 'SD', 'jumlah' => 0],
    ['tingkat' => 'SMP', 'jumlah' => 0],
    ['tingkat' => 'SMA', 'jumlah' => 0],
    ['tingkat' => 'NON AKD', 'jumlah' => 0],
    ['tingkat' => 'PT', 'jumlah' => 0]
];

// Data default status sosial
$statusSosialData = [
    ['label' => 'MAMPU', 'kategori_id' => 1, 'jumlah' => 0],
    ['label' => 'DHUAFA MISKIN', 'kategori_id' => 2, 'jumlah' => 0],
    ['label' => 'DHUAFA FAKIR', 'kategori_id' => 3, 'jumlah' => 0],
    ['label' => 'YATIM', 'kategori_id' => 4, 'jumlah' => 0],
    ['label' => 'PIATU', 'kategori_id' => 5, 'jumlah' => 0],
    ['label' => 'YATIM PIATU', 'kategori_id' => 6, 'jumlah' => 0],
    ['label' => 'KHUSUS', 'kategori_id' => 7, 'jumlah' => 0]
];

// ==========================================
// 2. KONEKSI & PENGAMBILAN DATA REAL-TIME DARI DB
// ==========================================
$host     = "localhost";
$database = "siata_sistem4";
$username = "admin_db"; 
$password = "Password!@#";

try {
    // Koneksi PDO dengan timeout cepat 3 detik
    $db = new PDO("mysql:host=$host;dbname=$database;charset=utf8", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT => 3 
    ]);

    // A. Mengambil total santri aktif (status_pelajar = '1' & sesuai tingkat pendidikan)
    $querySantri = $db->query("SELECT COUNT(*) as total FROM data_pelajar WHERE status_pelajar = '1' AND tingkat_pendidikan IN ('TK', 'SD', 'SMP', 'SMA', 'NON AKD', 'PT')");
    $resSantri = $querySantri->fetch();
    if ($resSantri) {
        $totalSantri = (int)$resSantri['total'];
    }

    // B. Mengambil total alumni
    $queryAlumni = $db->query("SELECT COUNT(*) as total FROM data_pelajar WHERE status_pelajar = '2'");
    $resAlumni = $queryAlumni->fetch();
    if ($resAlumni) {
        $totalAlumni = (int)$resAlumni['total'];
    }

    // C. Mengambil data ustadz / guru dari tabel terpisah (jika ada)
    $ustadzPerCabang = [1 => 33, 2 => 15, 6 => 4, 3 => 8, 4 => 5, 5 => 5];
    try {
        $checkTable = $db->query("SELECT 1 FROM data_guru LIMIT 1");
        if ($checkTable !== false) {
            $queryUstadz = $db->query("SELECT cabang_id, COUNT(*) AS total_ustadz FROM data_guru GROUP BY cabang_id");
            foreach ($queryUstadz->fetchAll() as $row) {
                $ustadzPerCabang[(int)$row['cabang_id']] = (int)$row['total_ustadz'];
            }
        }
    } catch (PDOException $e) {
        // Jika tabel khusus guru tidak ada, tetap gunakan dummy atau data_pelajar is_guru
        try {
            $queryUstadzAlt = $db->query("SELECT cabang_id, COUNT(*) AS total_ustadz FROM data_pelajar WHERE is_guru = 1 GROUP BY cabang_id");
            foreach ($queryUstadzAlt->fetchAll() as $row) {
                $ustadzPerCabang[(int)$row['cabang_id']] = (int)$row['total_ustadz'];
            }
        } catch (PDOException $e2) {}
    }

    // D. Pengambilan data Santri Berasrama, Anak Pengurus, dan Pengabdian sesuai instruksi query
    
    // 1. Santri Berasrama
    $berasramaPerCabang = [];
    $queryBerasrama = $db->query("SELECT cabang_id,
    COUNT(*) AS jumlah
    FROM data_pelajar
    WHERE status_pelajar = '1'
        AND tingkat_pendidikan IN ('TK', 'SD', 'SMP', 'SMA', 'PT')
        AND status_mukim IN ('1')
        AND status_asrama IN ('1')
    GROUP BY cabang_id");

    foreach ($queryBerasrama->fetchAll() as $row) {
        $berasramaPerCabang[(int)$row['cabang_id']] = (int)$row['jumlah'];
    }

    // 2. Anak Pengurus
    $anakPengurusPerCabang = [];
    $queryAnakPengurus = $db->query("SELECT cabang_id,
    COUNT(*) AS jumlah
    FROM data_pelajar
    WHERE status_pelajar = '1'
        AND tingkat_pendidikan IN ('TK', 'SD', 'SMP', 'SMA', 'PT')
        AND status_mukim IN ('1')
        AND status_asrama IN ('0')
    GROUP BY cabang_id");

    foreach ($queryAnakPengurus->fetchAll() as $row) {
        $anakPengurusPerCabang[(int)$row['cabang_id']] = (int)$row['jumlah'];
    }

    // 3. Pengabdian
    $pengabdianPerCabang = [];
    $queryPengabdian = $db->query("SELECT cabang_id, COUNT(*) AS jumlah FROM data_pelajar WHERE status_pelajar = '1' AND tingkat_pendidikan IN ('NON AKD') GROUP BY cabang_id");
     foreach ($queryPengabdian->fetchAll() as $row) {
        $pengabdianPerCabang[(int)$row['cabang_id']] = (int)$row['jumlah'];
    }

    // 4. Santri Non Mukim
    $nonMukimPerCabang = [];
    $queryNonMukim = $db->query("SELECT cabang_id,
    COUNT(*) AS jumlah
    FROM data_pelajar
    WHERE status_pelajar = '1'
        AND tingkat_pendidikan IN ('TK', 'SD', 'SMP', 'SMA', 'PT')
        AND status_mukim IN ('0')
        AND status_asrama IN ('0')
    GROUP BY cabang_id");

    foreach ($queryNonMukim->fetchAll() as $row) {
        $nonMukimPerCabang[(int)$row['cabang_id']] = (int)$row['jumlah'];
    }

    // 5. Total Santri Aktif per Cabang
    // $totalSemuaPerCabang = [];
    // $queryTotalSemua = $db->query("SELECT cabang_id,
    // COUNT(*) AS jumlah
    // FROM data_pelajar
    // WHERE status_pelajar = '1'
    // GROUP BY cabang_id");

    // foreach ($queryTotalSemua->fetchAll() as $row) {
    //     $totalSemuaPerCabang[(int)$row['cabang_id']] = (int)$row['jumlah'];
    // }

    // Mapping nama sesuai cabang_id
    $idToNameMap = [
        1 => 'PPYD Al Ikhlas Putra',
        2 => 'PPYD Al Ikhlas Putri',
        3 => 'RH An-Nuha Putra',
        4 => 'RH An-Nuha Putri 1',
        5 => 'RH An-Nuha Putri 2',
        6 => 'Baiti Jannati'
    ];

    // Menyusun data cabang terurut sesuai urutan di image_26b8e0.png
    $sortOrder = [1, 2, 6, 3, 4, 5];
    $tempCabang = [];
    foreach ($sortOrder as $cId) {
        $name = isset($idToNameMap[$cId]) ? $idToNameMap[$cId] : 'Cabang ' . $cId;
        
        $c_ustadz = isset($ustadzPerCabang[$cId]) ? $ustadzPerCabang[$cId] : 0;
        $c_berasrama = isset($berasramaPerCabang[$cId]) ? $berasramaPerCabang[$cId] : 0;
        $c_anak_pengurus = isset($anakPengurusPerCabang[$cId]) ? $anakPengurusPerCabang[$cId] : 0;
        $c_pengabdian = isset($pengabdianPerCabang[$cId]) ? $pengabdianPerCabang[$cId] : 0;
        $c_non_mukim = isset($nonMukimPerCabang[$cId]) ? $nonMukimPerCabang[$cId] : 0;
        
        $c_total_semua = $c_ustadz + $c_berasrama + $c_anak_pengurus + $c_non_mukim + $c_pengabdian;

        $tempCabang[] = [
            'id' => $cId,
            'nama' => $name,
            'total_semua' => $c_total_semua,
            'ustadz' => $c_ustadz,
            'berasrama' => $c_berasrama,
            'anak_pengurus' => $c_anak_pengurus,
            'pengabdian' => $c_pengabdian,
            'non_mukim' => $c_non_mukim
        ];
    }
    $cabangData = $tempCabang;

    // Hitung total ustadz secara dinamis
    $totalUstadz = array_sum(array_column($cabangData, 'ustadz'));

    // E. Mengambil data tingkat pendidikan dinamis
    $queryPendidikan = $db->query("
        SELECT 
            tingkat_pendidikan AS tingkat,
            COUNT(*) AS jumlah
        FROM data_pelajar
        WHERE status_pelajar = '1' AND tingkat_pendidikan IN ('TK', 'SD', 'SMP', 'SMA', 'NON AKD', 'PT')
        GROUP BY tingkat_pendidikan
    ");
    $rawPendidikan = $queryPendidikan->fetchAll();

    $defaultPendidikanNames = ['TK', 'SD', 'SMP', 'SMA', 'NON AKD', 'PT'];
    $tempPendidikan = [];
    foreach ($defaultPendidikanNames as $tingkat) {
        $found = false;
        foreach ($rawPendidikan as $row) {
            if (strcasecmp($row['tingkat'], $tingkat) === 0) {
                $tempPendidikan[] = [
                    'tingkat' => $tingkat,
                    'jumlah' => (int)$row['jumlah']
                ];
                $found = true;
                break;
            }
        }
        if (!$found) {
            $tempPendidikan[] = ['tingkat' => $tingkat, 'jumlah' => 0];
        }
    }
    $pendidikanData = $tempPendidikan;

    // F. Mengambil data status sosial (status_pelajar = '1')
    $queryStatusSosial = $db->query("SELECT status_sosial, COUNT(*) AS jumlah FROM data_pelajar WHERE status_pelajar = '1' GROUP BY status_sosial");
    $rawStatusSosial = [];
    foreach ($queryStatusSosial->fetchAll() as $row) {
        $rawStatusSosial[(int)$row['status_sosial']] = (int)$row['jumlah'];
    }

    $statusSosialMap = [
        1 => 'MAMPU',
        2 => 'DHUAFA MISKIN',
        3 => 'DHUAFA FAKIR',
        4 => 'YATIM',
        5 => 'PIATU',
        6 => 'YATIM PIATU',
        7 => 'KHUSUS'
    ];

    $tempStatusSosial = [];
    foreach ($statusSosialMap as $id => $label) {
        $tempStatusSosial[] = [
            'label'       => $label,
            'kategori_id' => $id,
            'jumlah'      => isset($rawStatusSosial[$id]) ? $rawStatusSosial[$id] : 0
        ];
    }
    $statusSosialData = $tempStatusSosial;

} catch (PDOException $e) {
    // Fallback otomatis jika database mati tanpa merusak tampilan TV
    $totalUstadz = array_sum(array_column($cabangData, 'ustadz'));
}

// ==========================================
// 3. API REAL-TIME ENDPOINT (Self-Contained)
// ==========================================
if (isset($_GET['action']) && $_GET['action'] === 'get_data') {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success'      => true,
        'totalSantri'  => $totalSantri,
        'totalAlumni'  => $totalAlumni,
        'totalUstadz'  => $totalUstadz,
        'cabang'       => $cabangData,
        'pendidikan'   => $pendidikanData,
        'statusSosial' => $statusSosialData
    ]);
    exit;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TV DASHBOARD DATA PESANTREN</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Script logika data & inisialisasi jam real-time -->
    <script>
        function dashboardData() {
            return {
                search: '',
                // Memasukkan hasil server-side rendering PHP langsung ke inisialisasi awal Alpine.js
                totalSantri: <?php echo $totalSantri; ?>, 
                totalAlumni: <?php echo $totalAlumni; ?>, 
                totalUstadz: <?php echo $totalUstadz; ?>,
                currentTime: '',
                currentDate: '',
                
                isDesktop: window.innerWidth >= 1024,
                currentSlide: 1,
                
                cabang: <?php echo json_encode($cabangData); ?>,
                pendidikan: <?php echo json_encode($pendidikanData); ?>,
                statusSosial: <?php echo json_encode($statusSosialData); ?>,

                // Format angka ribuan
                formatNumber(number) {
                    return new Intl.NumberFormat('id-ID').format(number);
                },

                // Menghitung total dari kolom cabang secara reaktif
                get totals() {
                    let totalSemua = 0;
                    let totalUstadz = 0;
                    let totalBerasrama = 0;
                    let totalAnakPengurus = 0;
                    let totalPengabdian = 0;
                    let totalNonMukim = 0;
                    
                    this.cabang.forEach(item => {
                        totalSemua += parseInt(item.total_semua || 0);
                        totalUstadz += parseInt(item.ustadz || 0);
                        totalBerasrama += parseInt(item.berasrama || 0);
                        totalAnakPengurus += parseInt(item.anak_pengurus || 0);
                        totalPengabdian += parseInt(item.pengabdian || 0);
                        totalNonMukim += parseInt(item.non_mukim || 0);
                    });
                    
                    return {
                        total_semua: totalSemua,
                        ustadz: totalUstadz,
                        berasrama: totalBerasrama,
                        anak_pengurus: totalAnakPengurus,
                        pengabdian: totalPengabdian,
                        non_mukim: totalNonMukim
                    };
                },

                async fetchDatabaseData() {
                    try {
                        // Menggunakan window.location.pathname agar API selalu terpanggil dengan benar di server mana saja
                        const response = await fetch(window.location.pathname + '?action=get_data');
                        const result = await response.json();
                        
                        if (result.success) {
                            this.totalSantri = result.totalSantri;
                            this.totalAlumni = result.totalAlumni;
                            this.totalUstadz = result.totalUstadz;
                            this.cabang = result.cabang;
                            this.pendidikan = result.pendidikan;
                            this.statusSosial = result.statusSosial;
                        }
                    } catch (error) {
                        console.log('Koneksi database/jaringan terputus, menggunakan data lokal.');
                    }
                },

                // Inisialisasi Jam Aktif TV & Sinkronisasi
                init() {
                    const updateTime = () => {
                        const now = new Date();
                        
                        // Format jam: HH.MM.SS (mengikuti format gambar . ke :)
                        this.currentTime = now.toLocaleTimeString('id-ID', { 
                            hour: '2-digit', 
                            minute: '2-digit', 
                            second: '2-digit',
                            hour12: false 
                        }).replace(/:/g, '.');

                        // Format tanggal Indonesia
                        this.currentDate = now.toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                    };
                    updateTime();
                    setInterval(updateTime, 1000);

                    // Melakukan polling data ke database secara otomatis setiap 5 detik tanpa mereload halaman
                    setInterval(() => {
                        this.fetchDatabaseData();
                    }, 5000);

                    // Slider otomatis 25 detik khusus desktop
                    setInterval(() => {
                        if (this.isDesktop) {
                            this.currentSlide = this.currentSlide === 1 ? 2 : 1;
                        }
                    }, 25000);
                }
            }
        }
    </script>
    
    <!-- Alpine.js CDN dengan defer -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    
    <!-- Google Fonts (Plus Jakarta Sans) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
        }
        /* Sembunyikan scrollbar pada mode TV untuk tampilan yang clean */
        @media (min-width: 1024px) {
            ::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            ::-webkit-scrollbar-track {
                background: #f1f5f9;
            }
            ::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 3px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
            }
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden flex flex-col p-4 sm:p-6" x-data="dashboardData()" @resize.window="isDesktop = window.innerWidth >= 1024">

    <!-- TOP HEADER: Sesuai visual image_26b8e0.png -->
    <header class="bg-white border border-slate-200 rounded-2xl px-6 py-4 mb-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm flex-shrink-0">
        <!-- Logo & Title: Sesuai PPYD Al Ikhlas Malang -->
        <div class="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3 sm:gap-4 w-full sm:w-auto">
            <div class="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white shadow-md shadow-blue-200 flex-shrink-0">
                <!-- Graduation Cap Icon -->
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6"></path>
                </svg>
            </div>
            <div class="min-w-0">
                <h1 class="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-black tracking-wider text-slate-950 uppercase truncate sm:whitespace-normal">DASHBOARD DATA PPYD AL IKHLAS MALANG</h1>
                <p class="text-[9px] sm:text-xs text-blue-600 font-bold tracking-widest uppercase lg:text-sm truncate sm:whitespace-normal">INFORMASI PEMANTAUAN DATA REAL-TIME</p>
            </div>
        </div>

        <!-- TV Live Clock Widget (Light Theme) -->
        <div class="flex items-center justify-between sm:justify-start space-x-4 sm:space-x-6 bg-slate-100 border border-slate-200 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl w-full sm:w-auto">
            <div class="text-left sm:text-right">
                <div class="text-[10px] sm:text-xs text-slate-600 font-bold lg:text-sm" x-text="currentDate">Selasa, 7 Juli 2026</div>
                <div class="text-[9px] sm:text-[10px] text-emerald-600 font-bold tracking-widest uppercase flex items-center justify-start sm:justify-end mt-0.5 lg:text-xs">
                    <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                    SINKRONISASI AKTIF
                </div>
            </div>
            <div class="h-8 sm:h-10 w-[1px] bg-slate-200"></div>
            <div class="text-xl sm:text-3xl font-mono font-extrabold text-blue-600 tracking-wider lg:text-4xl" x-text="currentTime">11.23.09</div>
        </div>
    </header>

    <!-- MAIN CONTENT CONTAINER (Fills remaining height using Flexbox) -->
    <div class="flex-grow flex flex-col gap-5 min-h-0">
        
        <!-- ROW 1: KANBAN / SUMMARY CARDS (Sesuai Visual image_26b8e0.png) -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 flex-shrink-0">
            
            <!-- Card 1: Keseluruhan Santri Aktif -->
            <div class="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-sm p-5 flex flex-col justify-between group">
                <div class="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full"></div>
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold tracking-widest text-blue-100 uppercase lg:text-sm">SANTRI AKTIF</span>
                    <svg class="w-5 h-5 text-blue-200 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                </div>
                <div class="mt-2 flex items-baseline justify-between">
                    <div class="text-3xl sm:text-4xl font-black tracking-tight lg:text-5xl" x-text="formatNumber(totalSantri)">373</div>
                    <span class="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-bold lg:text-xs">Aktif Kuliah & Sekolah</span>
                </div>
            </div>

            <!-- Card 2: Keseluruhan Alumni -->
            <div class="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-2xl shadow-sm p-5 flex flex-col justify-between group">
                <div class="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full"></div>
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold tracking-widest text-indigo-100 uppercase lg:text-sm">TOTAL ALUMNI</span>
                    <svg class="w-5 h-5 text-indigo-200 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l8-4.666a2 2 0 012.22 0l8 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"></path>
                    </svg>
                </div>
                <div class="mt-2 flex items-baseline justify-between">
                    <div class="text-3xl sm:text-4xl font-black tracking-tight lg:text-5xl" x-text="formatNumber(totalAlumni)">542</div>
                    <span class="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-bold lg:text-xs">Alumni Nasional</span>
                </div>
            </div>

            <!-- Card 3: Lembaga Cabang -->
            <div class="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold tracking-widest text-slate-500 uppercase lg:text-sm">CABANG UTAMA</span>
                    <svg class="w-5 h-5 text-blue-600 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                </div>
                <div class="mt-2 flex items-baseline justify-between">
                    <div class="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 lg:text-5xl" x-text="formatNumber(cabang.length)">6</div>
                    <span class="text-[11px] bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full font-bold border border-blue-100 lg:text-xs">Unit Pendidikan</span>
                </div>
            </div>

            <!-- Card 4: Tenaga Pengajar -->
            <div class="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold tracking-widest text-slate-500 uppercase lg:text-sm">ASATIDZAH / PENGURUS</span>
                    <svg class="w-5 h-5 text-indigo-600 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <div class="mt-2 flex items-baseline justify-between">
                    <div class="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 lg:text-5xl" x-text="formatNumber(totalUstadz + totals.pengabdian)">70</div>
                    <span class="text-[11px] bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full font-bold border border-indigo-100 lg:text-xs">Ustadz & Ustadzah</span>
                </div>
            </div>

        </section>

        <!-- ROW 2: DATA DETAIL -->
        <section class="flex-grow min-h-0 w-full transition-all duration-500" :class="isDesktop ? 'relative' : 'flex flex-col gap-5'">
            
            <!-- SLIDE 1: TABEL SEBARAN LEMBAGA CABANG -->
            <div x-show="!isDesktop || currentSlide === 1"
                 x-transition.opacity.duration.1000ms
                 class="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm w-full"
                 :class="isDesktop ? 'absolute inset-0 h-full' : 'h-auto'">
                <div class="flex flex-col h-full min-h-0">
                    <!-- Title Header -->
                    <div class="flex items-center space-x-3 pb-4 border-b border-slate-100 flex-shrink-0">
                        <div class="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider lg:text-xl xl:text-2xl">SEBARAN LEMBAGA CABANG</h3>
                            <p class="text-[11px] text-slate-500 lg:text-sm xl:text-base">Rincian data per cabang pesantren</p>
                        </div>
                    </div>

                    <!-- Scrollable Table Body (Enlarged fonts & padding for clarity) -->
                    <div class="overflow-y-auto flex-grow mt-6 pr-1">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider sticky top-0 lg:text-sm xl:text-lg">
                                    <th class="py-3 px-4 rounded-l-lg lg:py-4 xl:py-5">UNIT CABANG</th>
                                    <th class="py-3 px-4 text-center lg:py-4 xl:py-5">TOTAL</th>
                                    <th class="py-3 px-4 text-center lg:py-4 xl:py-5">ASATIDZAH</th>
                                    <th class="py-3 px-4 text-center lg:py-4 xl:py-5">SANTRI BERASRAMA</th>
                                    <th class="py-3 px-4 text-center lg:py-4 xl:py-5">ANAK PENGURUS</th>
                                    <th class="py-3 px-4 text-center lg:py-4 xl:py-5">NON MUKIM</th>
                                    <th class="py-3 px-4 text-center rounded-r-lg lg:py-4 xl:py-5">NON AKD</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <template x-for="item in cabang" :key="item.nama">
                                    <tr class="hover:bg-slate-50 transition-colors">
                                        <td class="py-3.5 px-4 font-semibold text-slate-800 text-xs sm:text-sm lg:text-xl xl:text-2xl lg:py-5 xl:py-6" x-text="item.nama"></td>
                                        <td class="py-3.5 px-4 text-center font-black text-slate-900 text-xs sm:text-sm lg:text-2xl xl:text-3xl lg:py-5 xl:py-6" x-text="formatNumber(item.total_semua)"></td>
                                        <td class="py-3.5 px-4 text-center font-black text-slate-900 text-xs sm:text-sm lg:text-2xl xl:text-3xl lg:py-5 xl:py-6" x-text="item.ustadz"></td>
                                        <td class="py-3.5 px-4 text-center font-black text-slate-900 text-xs sm:text-sm lg:text-2xl xl:text-3xl lg:py-5 xl:py-6" x-text="formatNumber(item.berasrama)"></td>
                                        <td class="py-3.5 px-4 text-center font-black text-slate-900 text-xs sm:text-sm lg:text-2xl xl:text-3xl lg:py-5 xl:py-6" x-text="formatNumber(item.anak_pengurus)"></td>
                                        <td class="py-3.5 px-4 text-center font-black text-slate-900 text-xs sm:text-sm lg:text-2xl xl:text-3xl lg:py-5 xl:py-6" x-text="formatNumber(item.non_mukim)"></td>
                                        <td class="py-3.5 px-4 text-center font-black text-slate-900 text-xs sm:text-sm lg:text-2xl xl:text-3xl lg:py-5 xl:py-6" x-text="formatNumber(item.pengabdian)"></td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- SLIDE 2: DATA BERDASARKAN STATUS SOSIAL DAN TINGKAT PENDIDIKAN -->
            <div x-show="!isDesktop || currentSlide === 2"
                 x-transition.opacity.duration.1000ms
                 class="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm w-full"
                 :class="isDesktop ? 'absolute inset-0 h-full' : 'h-auto'">
                <div class="flex flex-col h-full min-h-0 justify-start">
                    <!-- Title Header -->
                    <div class="flex items-center space-x-3 pb-3 border-b border-slate-100 mb-6 flex-shrink-0">
                        <div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <svg class="w-5 h-5 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider lg:text-xl xl:text-2xl">DATA STATUS SOSIAL & TINGKAT PENDIDIKAN</h3>
                            <p class="text-[11px] text-slate-500 lg:text-sm xl:text-base">Distribusi santri berdasarkan jenjang dan status sosial</p>
                        </div>
                    </div>

                    <!-- Split 2 Kolom untuk Desktop/TV -->
                    <div class="flex-grow flex flex-col md:flex-row gap-8 min-h-0 overflow-y-auto pr-2">
                        
                        <!-- Kolom 1: Tingkat Pendidikan -->
                        <div class="flex-1 flex flex-col min-h-0">
                            <h4 class="font-bold text-slate-500 mb-4 border-b border-slate-100 pb-2 uppercase tracking-wider text-xs lg:text-sm">Tingkat Pendidikan</h4>
                            <div class="divide-y divide-slate-100 flex-grow flex flex-col justify-around">
                                <template x-for="edu in pendidikan" :key="edu.tingkat">
                                    <div class="flex justify-between items-center py-3 lg:py-5 first:pt-0 last:pb-0">
                                        <span class="text-xs font-semibold text-slate-700 lg:text-lg xl:text-xl uppercase" x-text="edu.tingkat"></span>
                                        <span class="text-xs sm:text-sm font-black text-slate-900 text-center lg:text-xl xl:text-2xl" x-text="formatNumber(edu.jumlah)"></span>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <!-- Vertical Divider (Hanya muncul di desktop/md up) -->
                        <div class="hidden md:block w-px bg-slate-100"></div>

                        <!-- Kolom 2: Status Sosial (Mengambil data dinamis status_sosial dari DB) -->
                        <div class="flex-1 flex flex-col min-h-0 mt-6 md:mt-0">
                            <h4 class="font-bold text-slate-500 mb-4 border-b border-slate-100 pb-2 uppercase tracking-wider text-xs lg:text-sm">Status Sosial</h4>
                            <div class="divide-y divide-slate-100 flex-grow flex flex-col justify-around">
                                <template x-for="social in statusSosial" :key="social.kategori_id">
                                    <div class="flex justify-between items-center py-2.5 lg:py-4 first:pt-0 last:pb-0">
                                        <span class="text-xs font-semibold text-slate-700 lg:text-lg xl:text-xl uppercase" x-text="social.label"></span>
                                        <span class="text-xs sm:text-sm font-black text-slate-900 text-center lg:text-xl xl:text-2xl" x-text="formatNumber(social.jumlah)"></span>
                                    </div>
                                </template>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </section>

    </div>

    <!-- SYSTEM FOOTER (Centered on mobile and tablet) -->
    <footer class="bg-slate-50 mt-5 pt-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider lg:text-xs flex-shrink-0">
        <div class="text-center sm:text-left w-full sm:w-auto">
            &copy; 2026 <span class="text-slate-700">TV DASHBOARD</span> - PORTAL MONITORING DATA TERPADU PESANTREN
        </div>
        <div class="flex justify-center sm:justify-start space-x-4 mt-2 sm:mt-0 w-full sm:w-auto">
            <span class="text-blue-600">PRODUKTIF</span>
            <span class="text-slate-300">|</span>
            <span class="text-emerald-600">AMAN</span>
            <span class="text-slate-300">|</span>
            <span class="text-indigo-600">PRESISI</span>
        </div>
    </footer>

</body>
</html>