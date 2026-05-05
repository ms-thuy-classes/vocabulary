import { State } from '../state/store.js';
import { Storage } from '../services/storage.js';
import { FirebaseService } from '../services/firebase.js';
import { UI } from '../ui/toast.js';

export const Features = {
  Vocabulary: {
    render() {
      let list = [...State.vocab];
      const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
      const topicFilter = document.getElementById('filterTopic')?.value || '';
      const posFilter = document.getElementById('filterPos')?.value || '';
      
      if (search) list = list.filter(v => v.word.toLowerCase().includes(search) || v.vietnameseMeaning.includes(search));
      if (topicFilter) list = list.filter(v => v.topicId === topicFilter);
      if (posFilter) list = list.filter(v => v.partOfSpeech === posFilter);
      
      list.sort((a,b) => State.sort.desc ? (b.createdAt - a.createdAt) : (a.createdAt - b.createdAt));
      
      const total = Math.ceil(list.length / State.pageSize) || 1;
      if (State.page > total) State.page = total;
      const start = (State.page - 1) * State.pageSize;
      const page = list.slice(start, start + State.pageSize);
      
      const tbody = document.getElementById('vocabTableBody');
      if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="10" class="p-8 text-center text-muted">Không có từ</td></tr>';
      } else {
        tbody.innerHTML = page.map((v,i) => {
          const topic = State.topics.find(t => t.id === v.topicId);
          return `<tr>
            <td class="p-3 border-b">${start+i+1}</td>
            <td class="p-3 border-b">${topic ? `<span class="badge text-white" style="background:${topic.color}">${topic.name}</span>` : '-'}</td>
            <td class="p-3 border-b font-semibold">${v.word}</td>
            <td class="p-3 border-b hidden md:table-cell font-mono text-sm text-muted">${v.ipa||'-'}</td>
            <td class="p-3 border-b"><span class="badge bg-indigo-100 text-indigo-600">${v.partOfSpeech||'-'}</span></td>
            <td class="p-3 border-b">${v.vietnameseMeaning}</td>
            <td class="p-3 border-b hidden lg:table-cell text-muted italic">"${v.example||'-'}"</td>
            <td class="p-3 border-b text-center"><button onclick="TTS.speak('${v.word}')" class="btn-circle">🔊</button></td>
            <td class="p-3 border-b text-center"><button onclick="Features.Vocabulary.toggleStar('${v.id}')" class="text-lg ${v.isStarred?'text-yellow':'text-gray-300'}">${v.isStarred?'⭐':'☆'}</button></td>
            <td class="p-3 border-b text-center">
              <button onclick="Features.Vocabulary.openModal('${v.id}')" class="p-1 hover:bg-gray-100 rounded">✏️</button>
              <button onclick="Features.Vocabulary.del('${v.id}')" class="p-1 hover:bg-gray-100 rounded">🗑️</button>
            </td>
          </tr>`;
        }).join('');
      }
      document.getElementById('paginationInfo').textContent = `${start+1}-${Math.min(start+State.pageSize, list.length)}/${list.length}`;
    },
    
    openModal(id = null) {
      // Populate topic dropdown
      const select = document.getElementById('vTopic');
      select.innerHTML = '<option value="">Chọn chủ đề</option>' + State.topics.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
      
      document.getElementById('editVocabId').value = id || '';
      document.getElementById('vocabTitle').textContent = id ? 'Sửa từ' : 'Thêm từ';
      ['vWord','vIpa','vMean','vSyn','vEx'].forEach(f => document.getElementById(f).value = '');
      document.getElementById('vPos').value = '';
      document.getElementById('vTopic').value = '';
      
      if (id) {
        const v = State.vocab.find(x => x.id === id);
        if (v) {
          document.getElementById('vTopic').value = v.topicId;
          document.getElementById('vWord').value = v.word;
          document.getElementById('vIpa').value = v.ipa;
          document.getElementById('vPos').value = v.partOfSpeech;
          document.getElementById('vMean').value = v.vietnameseMeaning;
          document.getElementById('vSyn').value = v.synonym;
          document.getElementById('vEx').value = v.example;
        }
      }
      document.getElementById('vocabModal').classList.add('show');
    },
    
    async save() {
      const word = document.getElementById('vWord').value.trim();
      const mean = document.getElementById('vMean').value.trim();
      if (!word || !mean) return UI.Toast.show('Nhập từ và nghĩa', 'error');
      
      const id = document.getElementById('editVocabId').value;
      const data = {
        topicId: document.getElementById('vTopic').value,
        word, ipa: document.getElementById('vIpa').value.trim(),
        partOfSpeech: document.getElementById('vPos').value,
        vietnameseMeaning: mean, synonym: document.getElementById('vSyn').value.trim(),
        example: document.getElementById('vEx').value.trim()
      };
      
      if (id) {
        const v = State.vocab.find(x => x.id === id);
        if (v) Object.assign(v, data);
      } else {
        State.vocab.push({ id: Date.now().toString(), ...data, isStarred: false, createdAt: Date.now() });
      }
      
      Storage.save();
      UI.Modals.close('vocabModal');
      this.render();
      if (State.userId) FirebaseService.syncUp();
      UI.Toast.show('Đã lưu');
    },
    
    async del(id) {
      if (!confirm('Xóa từ?')) return;
      State.vocab = State.vocab.filter(x => x.id !== id);
      State.learned = State.learned.filter(x => x !== id);
      Storage.save();
      this.render();
      if (State.userId) FirebaseService.syncUp();
      UI.Toast.show('Đã xóa');
    },
    
    async toggleStar(id) {
      const v = State.vocab.find(x => x.id === id);
      if (v) v.isStarred = !v.isStarred;
      Storage.save();
      this.render();
      if (State.userId) FirebaseService.syncUp();
    },
    
    handleSearch(val) {
      clearTimeout(this._searchTimeout);
      this._searchTimeout = setTimeout(() => { State.page = 1; this.render(); }, 300);
    },
    
    changePage(delta) { State.page += delta; if (State.page < 1) State.page = 1; this.render(); }
  }
};
