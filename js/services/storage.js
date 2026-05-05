import { State } from '../state/store.js';

export const Storage = {
  KEY: 'vocabMaster',
  
  save() {
    const data = {
      v: State.vocab, t: State.topics, h: State.history, l: State.learned, s: State.settings
    };
    localStorage.setItem(this.KEY, JSON.stringify(data));
  },
  
  load() {
    const raw = localStorage.getItem(this.KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      State.vocab = data.v || [];
      State.topics = data.t || [];
      State.history = data.h || [];
      State.learned = data.l || [];
      State.settings = { ...State.settings, ...data.s };
    } catch(e) { console.error('Load error:', e); }
  },
  
  exportData() {
    const blob = new Blob([JSON.stringify({
      vocabulary: State.vocab, topics: State.topics, 
      quizHistory: State.history, learnedWords: State.learned
    }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `vocab_${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  },
  
  importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        State.vocab = data.vocabulary || [];
        State.topics = data.topics || [];
        State.history = data.quizHistory || [];
        State.learned = data.learnedWords || [];
        this.save();
        location.reload();
      } catch { alert('File không hợp lệ'); }
    };
    reader.readAsText(file);
  },
  
  clearAll() {
    if (!confirm('Xóa TẤT CẢ dữ liệu local?')) return;
    State.vocab = []; State.topics = []; State.history = []; State.learned = [];
    this.save();
    location.reload();
  }
};
