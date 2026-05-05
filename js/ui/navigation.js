// Navigation module
export const Navigation = {
  currentPage: 'dashboard',
  
  showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add('active');
      this.currentPage = pageId;
      
      // Update active nav items
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageId);
      });
      
      // Update mobile nav
      document.querySelectorAll('.nav-tab').forEach(tab => {
        const index = ['dashboard', 'vocabulary', 'flashcards', 'quiz', 'settings'].indexOf(pageId);
        tab.classList.toggle('active', index !== -1 && tab.children[1]?.textContent.includes(['Home', 'Từ vựng', 'Flashcard', 'Quiz', 'Cài đặt'][index]));
      });
    }
    
    // Close mobile sidebar
    if (window.innerWidth < 768) {
      document.getElementById('sidebar')?.classList.remove('open');
      document.getElementById('sidebarOverlay')?.classList.remove('active');
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    console.log('📄 Navigated to:', pageId);
  },
  
  init() {
    this.showPage('dashboard');
  }
};
