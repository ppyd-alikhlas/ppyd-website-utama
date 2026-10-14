    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    menuToggle.addEventListener('click', () => {
      const opened = navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(opened));
      menuToggle.setAttribute('aria-label', opened ? 'Tutup navigasi' : 'Buka navigasi');
      menuToggle.textContent = opened ? '×' : '☰';
    });
    navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Buka navigasi');
      menuToggle.textContent = '☰';
    }));
    document.getElementById('year').textContent = new Date().getFullYear();

    // Mengambil empat postingan terbaru dari WordPress REST API Suara Al-Ikhlas.
    (async function loadLatestNews() {
      const grid = document.getElementById('newsGrid');
      const apiUrl = 'https://ppydalikhlas.org/suara-alikhlas/wp-json/wp/v2/posts?per_page=4&orderby=date&order=desc&_embed=wp:featuredmedia,wp:term';
      const archiveUrl = 'https://ppydalikhlas.org/suara-alikhlas/';
      const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      })[char]);
      const plainText = (value) => {
        const doc = new DOMParser().parseFromString(value || '', 'text/html');
        return (doc.body.textContent || '').replace(/\\s+/g, ' ').trim();
      };
      const formatDate = (value) => {
        try {
          return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
        } catch (_) { return ''; }
      };
      try {
        const response = await fetch(apiUrl, { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('WordPress API tidak merespons');
        const posts = await response.json();
        if (!Array.isArray(posts) || posts.length === 0) {
          grid.innerHTML = '<div class="news-status">Belum ada artikel yang dapat ditampilkan. Silakan kunjungi <a href="' + archiveUrl + '">Suara Al-Ikhlas</a>.</div>';
          grid.setAttribute('aria-busy', 'false');
          return;
        }
        grid.innerHTML = posts.slice(0, 4).map((post) => {
          const title = plainText(post.title && post.title.rendered) || 'Artikel Suara Al-Ikhlas';
          const excerpt = plainText(post.excerpt && post.excerpt.rendered);
          const link = /^https?:\/\//i.test(post.link || '') ? post.link : archiveUrl;
          const media = post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0];
          const imageUrl = media && media.source_url;
          const image = imageUrl
            ? '<img src="' + escapeHtml(imageUrl) + '" alt="' + escapeHtml(title) + '" loading="lazy" decoding="async">'
            : '<div class="news-thumb-fallback" aria-hidden="true">✿</div>';
          const terms = post._embedded && post._embedded['wp:term'] ? post._embedded['wp:term'].flat() : [];
          const category = terms.find((term) => term && term.taxonomy === 'category');
          const label = category && category.name ? category.name : 'Informasi';
          return '<article class="news-card">' +
            '<a class="news-thumb" href="' + escapeHtml(link) + '" target="_blank" rel="noopener noreferrer" aria-label="Baca ' + escapeHtml(title) + '">' + image + '</a>' +
            '<div class="news-body"><div class="news-meta">' + escapeHtml(label) + (post.date ? ' · ' + escapeHtml(formatDate(post.date)) : '') + '</div>' +
            '<h3><a href="' + escapeHtml(link) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(title) + '</a></h3>' +
            '<p>' + escapeHtml(excerpt || 'Baca informasi dan cerita terbaru dari TPUD An-Nuha dan PPYD Al-Ikhlas.') + '</p>' +
            '<a class="news-link" href="' + escapeHtml(link) + '" target="_blank" rel="noopener noreferrer">Baca selengkapnya →</a></div></article>';
        }).join('');
      } catch (error) {
        grid.innerHTML = '<div class="news-status">Artikel belum dapat dimuat otomatis. Coba kunjungi <a href="' + archiveUrl + '" target="_blank" rel="noopener noreferrer">Suara Al-Ikhlas</a> untuk membaca berita dan kegiatan terbaru.</div>';
      } finally {
        grid.setAttribute('aria-busy', 'false');
      }
    })();

