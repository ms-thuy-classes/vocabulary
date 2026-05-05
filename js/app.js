import { auth, onAuthStateChanged } from './config.js';
import { State } from './state/store.js';
import { Storage } from './services/storage.js';
import { FirebaseService } from './services/firebase.js';
import { UI } from './ui/navigation.js';
import { Features } from './features/vocabulary.js';

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
  // Load local state
  Storage.load();
  
  // Apply theme
  if (State.settings.dark) document.documentElement.classList.add('dark');
  
  // Setup auth listener
  onAuthStateChanged(auth, (user) => {
    State.userId = user?.uid || null;
    UI.Auth.update();
    if (user) FirebaseService.listen(user.uid);
  });
  
  // Initialize default page
  UI.Navigation.showPage('dashboard');
  
  // Request notification permission
  if ('Notification' in window && State.settings.reminder) {
    Notification.requestPermission();
  }
  
  console.log('✅ VocabMaster Pro initialized');
});

// Expose global functions for inline HTML handlers
window.UI = { Navigation: UI.Navigation, Theme: UI.Theme, Toast: UI.Toast, Modals: UI.Modals, Auth: UI.Auth };
window.Features = { Vocabulary: Features.Vocabulary, Topics: Features.Topics, Flashcards: Features.Flashcards, Quiz: Features.Quiz, Dashboard: Features.Dashboard };
window.FirebaseService = FirebaseService;
window.Storage = Storage;
window.TTS = { speak: (w) => { const u = new SpeechSynthesisUtterance(w); u.lang='en-US'; speechSynthesis.speak(u); } };
