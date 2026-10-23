// Script logika data & inisialisasi jam real-time
function dashboardData() {
  return {
    search: "",
    // Memasukkan hasil server-side rendering PHP langsung ke inisialisasi awal Alpine.js
    totalSantri: $totalSantri,
    totalAlumni: $totalAlumni,
    totalUstadz: $totalUstadz,
    currentTime: "",
    currentDate: "",

    cabang: json_encode($cabangData),
    pendidikan: json_encode($pendidikanData),

    // Fungsi pencarian
    get filteredCabang() {
      if (this.search === "") {
        return this.cabang;
      }
      return this.cabang.filter((item) =>
        item.nama.toLowerCase().includes(this.search.toLowerCase()),
      );
    },

    // Format angka ribuan
    formatNumber(number) {
      return new Intl.NumberFormat("id-ID").format(number);
    },

    async fetchDatabaseData() {
      try {
        // Mengambil data secara asinkron dari file PHP ini sendiri tanpa reload
        const response = await fetch("dashboard_pesantren.php?action=get_data");
        const result = await response.json();

        if (result.success) {
          this.totalSantri = result.totalSantri;
          this.totalAlumni = result.totalAlumni;
          this.totalUstadz = result.totalUstadz;
          this.cabang = result.cabang;
          this.pendidikan = result.pendidikan;
        }
      } catch (error) {
        console.log(
          "Koneksi database/jaringan terputus, menggunakan data lokal.",
        );
      }
    },

    // Inisialisasi Jam Aktif TV & Sinkronisasi
    init() {
      const updateTime = () => {
        const now = new Date();

        // Format jam: HH:MM:SS
        this.currentTime = now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });

        // Format tanggal Indonesia
        this.currentDate = now.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      };
      updateTime();
      setInterval(updateTime, 1000);

      // Melakukan polling data ke database secara otomatis setiap 5 detik tanpa mereload halaman
      setInterval(() => {
        this.fetchDatabaseData();
      }, 5000);
    },
  };
}
