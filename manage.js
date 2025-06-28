// ローカルストレージのキー
const STORAGE_KEY = 'photo_proposals';

// 撮影タイプ名マッピング
const shootingTypeNames = {
    studio: 'スタジオ撮影',
    outdoor: '屋外撮影',
    sea: '海での撮影',
    house: 'ハウススタジオ撮影',
    hotel: 'ホテルでの撮影'
};

// 利用目的名マッピング
const purposeNames = {
    website: 'WEBサイト',
    sns: 'SNS',
    amazon: 'amazon写真集'
};

// グローバル変数
let currentEditId = null;
let allProposals = [];

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    loadProposals();
    setupEventListeners();
    generateEditDateOptions();
});

// イベントリスナーの設定
function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', filterProposals);
    document.getElementById('sortSelect').addEventListener('change', sortProposals);
    document.getElementById('exportAll').addEventListener('click', exportAllProposals);
    document.getElementById('deleteSelected').addEventListener('click', deleteSelectedProposals);
    
    // モーダル関連
    document.getElementById('closeModal').addEventListener('click', closeEditModal);
    document.getElementById('cancelEdit').addEventListener('click', closeEditModal);
    document.getElementById('saveEdit').addEventListener('click', saveEditedProposal);
    
    // モーダル外クリックで閉じる
    document.getElementById('editModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeEditModal();
        }
    });
    
    // 編集フォームの日付変更イベント
    document.getElementById('editYear').addEventListener('change', updateEditDayOptions);
    document.getElementById('editMonth').addEventListener('change', updateEditDayOptions);
    document.getElementById('editDay').addEventListener('change', updateEditDayOfWeek);
}

// 企画書データの読み込み
function loadProposals() {
    const stored = localStorage.getItem(STORAGE_KEY);
    allProposals = stored ? JSON.parse(stored) : [];
    displayProposals();
    updateSummary();
}

// 企画書の表示
function displayProposals() {
    const container = document.getElementById('proposalsList');
    const emptyState = document.getElementById('emptyState');
    
    if (allProposals.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'block';
    emptyState.style.display = 'none';
    
    container.innerHTML = allProposals.map(proposal => createProposalItem(proposal)).join('');
    
    // チェックボックスのイベントリスナーを追加
    document.querySelectorAll('.select-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateDeleteButton);
    });
}

// 企画書アイテムのHTML生成
function createProposalItem(proposal) {
    const createdDate = new Date(proposal.createdAt).toLocaleDateString('ja-JP');
    const shootingDate = `${proposal.year}年${proposal.month}月${proposal.day}日`;
    
    const types = proposal.shootingTypes ? proposal.shootingTypes.map(type => shootingTypeNames[type]).join(', ') : '';
    const purposes = proposal.purposes || '';
    
    return `
        <div class="proposal-item">
            <div class="proposal-info">
                <div class="proposal-title">${proposal.modelName}様</div>
                <div class="proposal-details">
                    <span>📅 ${shootingDate}</span>
                    <span>📍 ${proposal.location}</span>
                    <span>📝 作成日: ${createdDate}</span>
                    ${proposal.fee && proposal.fee > 0 ? `<span>💰 ${proposal.fee.toLocaleString()}円</span>` : ''}
                </div>
            </div>
            <div class="proposal-actions">
                <input type="checkbox" class="select-checkbox" data-id="${proposal.id}">
                <button class="btn btn-primary" onclick="editProposal('${proposal.id}')">編集</button>
                <button class="btn btn-secondary" onclick="generateShareUrl('${proposal.id}')">URL生成</button>
                <button class="btn btn-danger" onclick="deleteProposal('${proposal.id}')">削除</button>
            </div>
        </div>
    `;
}

// サマリー情報の更新
function updateSummary() {
    document.getElementById('totalCount').textContent = allProposals.length;
}

// 削除ボタンの状態更新
function updateDeleteButton() {
    const selectedCount = document.querySelectorAll('.select-checkbox:checked').length;
    const deleteBtn = document.getElementById('deleteSelected');
    deleteBtn.disabled = selectedCount === 0;
    deleteBtn.textContent = selectedCount > 0 ? `選択削除 (${selectedCount}件)` : '選択削除';
}

// 検索フィルター
function filterProposals() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allProposals.filter(proposal => 
        proposal.modelName.toLowerCase().includes(searchTerm)
    );
    
    displayFilteredProposals(filtered);
}

// ソート機能
function sortProposals() {
    const sortType = document.getElementById('sortSelect').value;
    
    let sorted = [...allProposals];
    
    switch (sortType) {
        case 'date-desc':
            sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'date-asc':
            sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'name-asc':
            sorted.sort((a, b) => a.modelName.localeCompare(b.modelName, 'ja'));
            break;
    }
    
    allProposals = sorted;
    displayProposals();
}

// フィルター結果の表示
function displayFilteredProposals(proposals) {
    const container = document.getElementById('proposalsList');
    container.innerHTML = proposals.map(proposal => createProposalItem(proposal)).join('');
    
    document.querySelectorAll('.select-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateDeleteButton);
    });
}

// 企画書編集
function editProposal(id) {
    const proposal = allProposals.find(p => p.id === id);
    if (!proposal) return;
    
    currentEditId = id;
    
    // フォームにデータを設定
    document.getElementById('editModelName').value = proposal.modelName;
    document.getElementById('editYear').value = proposal.year;
    document.getElementById('editMonth').value = proposal.month;
    document.getElementById('editLocation').value = proposal.location;
    document.getElementById('editFee').value = proposal.fee || '';
    
    // 日のオプションを更新してから値を設定
    updateEditDayOptions();
    setTimeout(() => {
        document.getElementById('editDay').value = proposal.day;
        updateEditDayOfWeek();
    }, 100);
    
    // 撮影タイプのチェック
    document.querySelectorAll('input[name="editShootingType"]').forEach(checkbox => {
        checkbox.checked = proposal.shootingTypes && proposal.shootingTypes.includes(checkbox.value);
    });
    
    // 利用目的の復元
    if (proposal.rawPurposes) {
        proposal.rawPurposes.forEach(purpose => {
            if (purpose.type === 'custom') {
                document.querySelector('input[name="editPurpose"][value="custom"]').checked = true;
                document.getElementById('editCustomPurpose').value = purpose.value;
            } else {
                document.querySelector(`input[name="editPurpose"][value="${purpose.type}"]`).checked = true;
            }
        });
    }
    
    // モーダルを表示
    document.getElementById('editModal').style.display = 'flex';
}

// 編集保存
function saveEditedProposal() {
    const modelName = document.getElementById('editModelName').value;
    const year = parseInt(document.getElementById('editYear').value);
    const month = parseInt(document.getElementById('editMonth').value);
    const day = parseInt(document.getElementById('editDay').value);
    const location = document.getElementById('editLocation').value;
    const fee = document.getElementById('editFee').value;
    
    const selectedTypes = Array.from(document.querySelectorAll('input[name="editShootingType"]:checked'))
        .map(cb => cb.value);
    
    const selectedPurposes = Array.from(document.querySelectorAll('input[name="editPurpose"]:checked'));
    const customPurpose = document.getElementById('editCustomPurpose').value;
    
    if (!modelName || !year || !month || !day || !location || selectedTypes.length === 0 || selectedPurposes.length === 0) {
        alert('すべての項目を入力してください。');
        return;
    }
    
    // 利用目的の処理
    let purposeList = [];
    let rawPurposes = [];
    
    selectedPurposes.forEach(purpose => {
        if (purpose.value === 'custom' && customPurpose.trim()) {
            purposeList.push(customPurpose.trim());
            rawPurposes.push({ type: 'custom', value: customPurpose.trim() });
        } else if (purpose.value !== 'custom') {
            purposeList.push(purposeNames[purpose.value]);
            rawPurposes.push({ type: purpose.value, value: purposeNames[purpose.value] });
        }
    });
    
    const purposeText = purposeList.length > 0 ? purposeList.join('、') + '等で利用させていただきます。' : '';
    
    // 既存の企画書を更新
    const proposalIndex = allProposals.findIndex(p => p.id === currentEditId);
    if (proposalIndex !== -1) {
        allProposals[proposalIndex] = {
            ...allProposals[proposalIndex],
            modelName,
            year,
            month,
            day,
            location,
            shootingTypes: selectedTypes,
            purposes: purposeText,
            rawPurposes: rawPurposes,
            fee: fee ? parseInt(fee) : 0,
            updatedAt: new Date().toISOString()
        };
        
        // ローカルストレージに保存
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allProposals));
        
        // 表示更新
        displayProposals();
        updateSummary();
        closeEditModal();
        
        alert('企画書を更新しました。');
    }
}

// モーダルを閉じる
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditId = null;
    
    // フォームをリセット
    document.getElementById('editForm').reset();
    document.querySelectorAll('input[name="editPurpose"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[name="editShootingType"]').forEach(cb => cb.checked = false);
    document.getElementById('editCustomPurpose').value = '';
}

// 企画書削除
function deleteProposal(id) {
    const proposal = allProposals.find(p => p.id === id);
    if (!proposal) return;
    
    if (confirm(`「${proposal.modelName}様」の企画書を削除しますか？`)) {
        allProposals = allProposals.filter(p => p.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allProposals));
        displayProposals();
        updateSummary();
    }
}

// 選択削除
function deleteSelectedProposals() {
    const selectedIds = Array.from(document.querySelectorAll('.select-checkbox:checked'))
        .map(cb => cb.dataset.id);
    
    if (selectedIds.length === 0) return;
    
    if (confirm(`選択した${selectedIds.length}件の企画書を削除しますか？`)) {
        allProposals = allProposals.filter(p => !selectedIds.includes(p.id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allProposals));
        displayProposals();
        updateSummary();
        updateDeleteButton();
    }
}

// 共有URL生成
function generateShareUrl(id) {
    const proposal = allProposals.find(p => p.id === id);
    if (!proposal) return;
    
    const params = new URLSearchParams({
        name: proposal.modelName,
        year: proposal.year,
        month: proposal.month,
        day: proposal.day,
        location: proposal.location,
        types: proposal.shootingTypes.join(','),
        purposes: encodeURIComponent(proposal.purposes),
        fee: proposal.fee || 0
    });
    
    const shareUrl = `${window.location.origin}${window.location.pathname.replace('manage.html', '')}proposal.html?${params.toString()}`;
    
    // URLをクリップボードにコピー
    navigator.clipboard.writeText(shareUrl).then(() => {
        alert('共有URLをクリップボードにコピーしました！');
    }).catch(() => {
        // フォールバック
        prompt('共有URL:', shareUrl);
    });
}

// 全件エクスポート
function exportAllProposals() {
    if (allProposals.length === 0) {
        alert('エクスポートする企画書がありません。');
        return;
    }
    
    const data = JSON.stringify(allProposals, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `photo_proposals_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 編集用日付オプション生成
function generateEditDateOptions() {
    const yearSelect = document.getElementById('editYear');
    const monthSelect = document.getElementById('editMonth');
    
    // 年のオプション
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year <= currentYear + 5; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year + '年';
        yearSelect.appendChild(option);
    }
    
    // 月のオプション
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month + '月';
        monthSelect.appendChild(option);
    }
}

// 編集用日オプション更新
function updateEditDayOptions() {
    const yearSelect = document.getElementById('editYear');
    const monthSelect = document.getElementById('editMonth');
    const daySelect = document.getElementById('editDay');
    
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    
    daySelect.innerHTML = '<option value="">日</option>';
    
    if (year && month) {
        const lastDay = new Date(year, month, 0).getDate();
        for (let day = 1; day <= lastDay; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day + '日';
            daySelect.appendChild(option);
        }
    }
}

// 編集用曜日更新
function updateEditDayOfWeek() {
    const year = parseInt(document.getElementById('editYear').value);
    const month = parseInt(document.getElementById('editMonth').value);
    const day = parseInt(document.getElementById('editDay').value);
    const dayOfWeekSpan = document.getElementById('editDayOfWeek');
    
    if (year && month && day) {
        const date = new Date(year, month - 1, day);
        const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
        const dayOfWeek = weekdays[date.getDay()];
        dayOfWeekSpan.textContent = `（${dayOfWeek}曜日）`;
    } else {
        dayOfWeekSpan.textContent = '';
    }
}