import { db, auth, ref, set, get, onValue, remove, serverTimestamp } from '../config.js';
import { State } from '../state/store.js';
import { Storage } from './storage.js';
import { UI } from '../ui/toast.js';

export const FirebaseService = {
  path(uid) { return `users/${uid}/data`; },
  
  async syncUp() {
    if (!State.userId) return UI.Toast.show('Vui lòng đăng nhập', 'error');
    if (State.syncPending) return;
    
    State.syncPending = true;
    UI.Status.update('Đang tải lên...', 'yellow');
    
    try {
      await set(ref(db, this.path(State.userId)), {
        vocabulary: State.vocab,
        topics: State.topics,
        quizHistory: State.history,
        learnedWords: State.learned,
        lastSync: serverTimestamp()
      });
      UI.Toast.show('✅ Đồng bộ thành công');
      UI.Status.update('Đã đồng bộ ✓', 'green');
    } catch(e) {
      console.error(e);
      UI.Toast.show('❌ Lỗi: ' + e.message, 'error');
      UI.Status.update('Lỗi kết nối', 'red');
    } finally {
      State.syncPending = false;
      setTimeout(() => UI.Status.update('Online ✓', 'green'), 2000);
    }
  },
  
  async syncDown() {
    if (!State.userId) return UI.Toast.show('Vui lòng đăng nhập', 'error');
    UI.Status.update('Đang tải về...', 'yellow');
    
    try {
      const snap = await get(ref(db, this.path(State.userId)));
      if (snap.exists()) {
        const data = snap.val();
        State.vocab = data.vocabulary || State.vocab;
        State.topics = data.topics || State.topics;
        State.history = data.quizHistory || State.history;
        State.learned = data.learnedWords || State.learned;
        Storage.save();
        UI.Toast.show('✅ Đã cập nhật từ Firebase');
        location.reload();
      } else {
        UI.Toast.show('📭 Chưa có dữ liệu trên Firebase');
      }
    } catch(e) {
      UI.Toast.show('❌ Lỗi: ' + e.message, 'error');
      UI.Status.update('Lỗi kết nối', 'red');
    } finally {
      setTimeout(() => UI.Status.update('Online ✓', 'green'), 2000);
    }
  },
  
  async clear() {
    if (!State.userId || !confirm('Xóa toàn bộ dữ liệu trên Firebase?')) return;
    try {
      await remove(ref(db, this.path(State.userId)));
      UI.Toast.show('✅ Đã xóa dữ liệu cloud');
    } catch(e) { UI.Toast.show('❌ Lỗi: ' + e.message, 'error'); }
  },
  
  listen(uid) {
    if (!uid) return;
    onValue(ref(db, this.path(uid)), (snap) => {
      if (snap.exists() && !State.syncPending) {
        const data = snap.val();
        if (data.lastSync && (!State.lastRemoteSync || data.lastSync > State.lastRemoteSync)) {
          State.vocab = data.vocabulary || State.vocab;
          State.topics = data.topics || State.topics;
          State.history = data.quizHistory || State.history;
          State.learned = data.learnedWords || State.learned;
          State.lastRemoteSync = data.lastSync;
          Storage.save();
          UI.Toast.show('🔄 Dữ liệu đã cập nhật từ thiết bị khác');
          if (['vocabulary','topics','dashboard'].includes(State.currentPage)) {
            // Re-render current page
            window.location.reload();
          }
        }
      }
    });
  }
};
