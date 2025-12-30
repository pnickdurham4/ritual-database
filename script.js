// Concept 2: Index Card - Modified for Grid Layout

class RitualsArchive {
  constructor() {
    this.allRituals = [];
    this.filteredRituals = [];
    this.displayedCount = 0;
    this.perPage = 30;
    this.searchQuery = '';
    this.activeCategories = new Set();
    this.activeMediaTypes = new Set();
    this.isLoading = false;

    this.init();
  }

  async init() {
    await this.loadRituals();
    this.setupEventListeners();
    this.setupModal();
    this.setupVideoModal();
    this.applyFilters();
    this.renderRituals(this.perPage);
    this.setupInfiniteScroll();
  }

  async loadRituals() {
    try {
      const response = await fetch('rituals.json');
      const data = await response.json();
      this.allRituals = data.rituals.sort((a, b) =>
        new Date(b.date) - new Date(a.date)
      );
    } catch (error) {
      console.error('Error loading rituals:', error);
      this.allRituals = [];
    }
  }

  setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.searchQuery = e.target.value.toLowerCase();
          this.resetAndFilter();
        }, 300);
      });
    }

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-chip')) {
        this.toggleFilter(e.target);
      }

      if (e.target.classList.contains('ritual-link')) {
        const url = e.target.getAttribute('href');
        const mediaType = e.target.dataset.mediaType;

        if (mediaType === 'video') {
          if (this.showVideoModal(url)) {
            e.preventDefault();
          }
        }
      }
    });
  }

  setupModal() {
    const aboutLink = document.querySelector('.about-link');
    const modal = document.getElementById('about-modal');
    const closeBtn = document.querySelector('.modal-close');

    aboutLink.addEventListener('click', () => {
      modal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  setupVideoModal() {
    const videoModal = document.getElementById('video-modal');
    const videoIframe = document.getElementById('video-iframe');
    const closeBtn = document.querySelector('.video-modal-close');

    closeBtn.addEventListener('click', () => {
      videoModal.classList.remove('active');
      videoIframe.src = '';
    });

    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        videoModal.classList.remove('active');
        videoIframe.src = '';
      }
    });
  }

  extractYouTubeId(url) {
    const patterns = [
      /youtube\.com\/watch\?v=([^&]+)/,
      /youtu\.be\/([^?]+)/,
      /youtube\.com\/embed\/([^?]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  showVideoModal(url) {
    const videoId = this.extractYouTubeId(url);
    if (videoId) {
      const videoModal = document.getElementById('video-modal');
      const videoIframe = document.getElementById('video-iframe');
      videoIframe.src = `https://www.youtube.com/embed/${videoId}`;
      videoModal.classList.add('active');
      return true;
    }
    return false;
  }

  toggleFilter(chip) {
    const filterType = chip.dataset.filterType;
    const filterValue = chip.dataset.filterValue;

    if (filterType === 'category') {
      if (this.activeCategories.has(filterValue)) {
        this.activeCategories.delete(filterValue);
        chip.classList.remove('active');
      } else {
        this.activeCategories.add(filterValue);
        chip.classList.add('active');
      }
    } else if (filterType === 'mediaType') {
      if (this.activeMediaTypes.has(filterValue)) {
        this.activeMediaTypes.delete(filterValue);
        chip.classList.remove('active');
      } else {
        this.activeMediaTypes.add(filterValue);
        chip.classList.add('active');
      }
    }

    this.resetAndFilter();
  }

  applyFilters() {
    this.filteredRituals = this.allRituals.filter(ritual => {
      const matchesSearch = !this.searchQuery ||
        ritual.title.toLowerCase().includes(this.searchQuery) ||
        ritual.category.toLowerCase().includes(this.searchQuery) ||
        ritual.mediaType.toLowerCase().includes(this.searchQuery);

      const matchesCategory = this.activeCategories.size === 0 ||
        this.activeCategories.has(ritual.category);

      const matchesMediaType = this.activeMediaTypes.size === 0 ||
        this.activeMediaTypes.has(ritual.mediaType);

      return matchesSearch && matchesCategory && matchesMediaType;
    });
  }

  resetAndFilter() {
    this.displayedCount = 0;
    this.applyFilters();
    this.clearRitualsList();
    this.renderRituals(this.perPage);
    this.updateResultsCount();
  }

  renderRituals(count) {
    const container = document.getElementById('ritual-list');
    if (!container) return;

    const ritualsToRender = this.filteredRituals.slice(
      this.displayedCount,
      this.displayedCount + count
    );

    if (ritualsToRender.length === 0 && this.displayedCount === 0) {
      this.showEmptyState();
      return;
    }

    this.hideEmptyState();

    ritualsToRender.forEach(ritual => {
      const article = this.createRitualElement(ritual);
      container.appendChild(article);
    });

    this.displayedCount += ritualsToRender.length;
    this.updateResultsCount();
  }

  createRitualElement(ritual) {
    const article = document.createElement('article');
    article.className = 'ritual-entry';

    article.innerHTML = `
      <a href="${ritual.url}" target="_blank" class="ritual-link" data-media-type="${ritual.mediaType}">${ritual.title}</a>
      <div class="ritual-meta">
        <span class="ritual-category">${ritual.category}</span>
        <span class="ritual-tag">${ritual.mediaType}</span>
        <time class="ritual-date">${ritual.dateDisplay}</time>
      </div>
    `;

    return article;
  }

  clearRitualsList() {
    const container = document.getElementById('ritual-list');
    if (container) {
      container.innerHTML = '';
    }
  }

  showEmptyState() {
    const container = document.getElementById('ritual-list');
    if (container) {
      container.innerHTML = '<p class="empty-state">No rituals found</p>';
    }
  }

  hideEmptyState() {
    const emptyState = document.querySelector('.empty-state');
    if (emptyState) {
      emptyState.remove();
    }
  }

  updateResultsCount() {
    const counter = document.getElementById('results-count');
    if (!counter) return;

    const total = this.allRituals.length;
    const filtered = this.filteredRituals.length;

    if (this.searchQuery || this.activeCategories.size > 0 || this.activeMediaTypes.size > 0) {
      counter.textContent = `Showing ${filtered} of ${total}`;
    } else {
      counter.textContent = `${total} rituals`;
    }
  }

  setupInfiniteScroll() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.checkScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  checkScroll() {
    if (this.isLoading) return;
    if (this.displayedCount >= this.filteredRituals.length) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 200) {
      this.isLoading = true;
      setTimeout(() => {
        this.renderRituals(this.perPage);
        this.isLoading = false;
      }, 100);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new RitualsArchive();
});
