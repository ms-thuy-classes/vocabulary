export const State = {
  // Data
  vocab: [],
  topics: [],
  history: [],
  learned: [],
  
  // Settings
  settings: { dark: false, reminder: true },
  
  // UI State
  page: 1,
  pageSize: 20,
  sort: { field: 'createdAt', desc: true },
  
  // Feature State
  flashcards: [],
  fcIndex: 0,
  quiz: { questions: [], index: 0, score: 0, timer: null, seconds: 0 },
  
  // Auth
  userId: null,
  syncPending: false,
  
  // Helpers
  getStarred() { return this.vocab.filter(v => v.isStarred); },
  getTopicCount(tid) { return this.vocab.filter(v => v.topicId === tid).length; },
  getAvgScore() { return this.history.length ? Math.round(this.history.reduce((a,b)=>a+b.score,0)/this.history.length) : 0; }
};
