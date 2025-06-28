// 年・月・日のオプションを生成
function generateDateOptions() {
    const yearSelect = document.getElementById('shootingYear');
    const monthSelect = document.getElementById('shootingMonth');
    const daySelect = document.getElementById('shootingDay');
    
    // 年のオプション（今年から5年後まで）
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
    
    // 日のオプション（初期は31日まで）
    updateDayOptions();
}

// 日のオプションを更新（月と年に応じて）
function updateDayOptions() {
    const yearSelect = document.getElementById('shootingYear');
    const monthSelect = document.getElementById('shootingMonth');
    const daySelect = document.getElementById('shootingDay');
    
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    
    // 既存のオプションをクリア
    daySelect.innerHTML = '<option value="">日</option>';
    
    if (year && month) {
        // その月の最終日を取得
        const lastDay = new Date(year, month, 0).getDate();
        
        for (let day = 1; day <= lastDay; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day + '日';
            daySelect.appendChild(option);
        }
    } else {
        // デフォルトで31日まで表示
        for (let day = 1; day <= 31; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = day + '日';
            daySelect.appendChild(option);
        }
    }
}

// 曜日を計算して表示
function updateDayOfWeek() {
    const year = parseInt(document.getElementById('shootingYear').value);
    const month = parseInt(document.getElementById('shootingMonth').value);
    const day = parseInt(document.getElementById('shootingDay').value);
    const dayOfWeekSpan = document.getElementById('dayOfWeek');
    
    if (year && month && day) {
        const date = new Date(year, month - 1, day);
        const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
        const dayOfWeek = weekdays[date.getDay()];
        dayOfWeekSpan.textContent = `（${dayOfWeek}曜日）`;
    } else {
        dayOfWeekSpan.textContent = '';
    }
}

// 撮影タイプごとの作例画像データ
const sampleImages = {
    studio: [
        'https://via.placeholder.com/200x150/ff6b6b/ffffff?text=スタジオ1',
        'https://via.placeholder.com/200x150/4ecdc4/ffffff?text=スタジオ2',
        'https://via.placeholder.com/200x150/45b7d1/ffffff?text=スタジオ3',
        'https://via.placeholder.com/200x150/96ceb4/ffffff?text=スタジオ4',
        'https://via.placeholder.com/200x150/feca57/ffffff?text=スタジオ5',
        'https://via.placeholder.com/200x150/ff9ff3/ffffff?text=スタジオ6',
        'https://via.placeholder.com/200x150/54a0ff/ffffff?text=スタジオ7',
        'https://via.placeholder.com/200x150/5f27cd/ffffff?text=スタジオ8',
        'https://via.placeholder.com/200x150/00d2d3/ffffff?text=スタジオ9',
        'https://via.placeholder.com/200x150/ff6348/ffffff?text=スタジオ10'
    ],
    outdoor: [
        'https://via.placeholder.com/200x150/32cd32/ffffff?text=屋外1',
        'https://via.placeholder.com/200x150/228b22/ffffff?text=屋外2',
        'https://via.placeholder.com/200x150/7cfc00/ffffff?text=屋外3',
        'https://via.placeholder.com/200x150/adff2f/ffffff?text=屋外4',
        'https://via.placeholder.com/200x150/9acd32/ffffff?text=屋外5',
        'https://via.placeholder.com/200x150/6b8e23/ffffff?text=屋外6',
        'https://via.placeholder.com/200x150/556b2f/ffffff?text=屋外7',
        'https://via.placeholder.com/200x150/8fbc8f/ffffff?text=屋外8',
        'https://via.placeholder.com/200x150/90ee90/ffffff?text=屋外9',
        'https://via.placeholder.com/200x150/98fb98/ffffff?text=屋外10'
    ],
    sea: [
        'https://via.placeholder.com/200x150/1e90ff/ffffff?text=海1',
        'https://via.placeholder.com/200x150/4169e1/ffffff?text=海2',
        'https://via.placeholder.com/200x150/0000cd/ffffff?text=海3',
        'https://via.placeholder.com/200x150/00bfff/ffffff?text=海4',
        'https://via.placeholder.com/200x150/87ceeb/ffffff?text=海5',
        'https://via.placeholder.com/200x150/87cefa/ffffff?text=海6',
        'https://via.placeholder.com/200x150/00ced1/ffffff?text=海7',
        'https://via.placeholder.com/200x150/48d1cc/ffffff?text=海8',
        'https://via.placeholder.com/200x150/40e0d0/ffffff?text=海9',
        'https://via.placeholder.com/200x150/afeeee/ffffff?text=海10'
    ],
    house: [
        'https://via.placeholder.com/200x150/dda0dd/ffffff?text=ハウス1',
        'https://via.placeholder.com/200x150/da70d6/ffffff?text=ハウス2',
        'https://via.placeholder.com/200x150/ba55d3/ffffff?text=ハウス3',
        'https://via.placeholder.com/200x150/9370db/ffffff?text=ハウス4',
        'https://via.placeholder.com/200x150/8a2be2/ffffff?text=ハウス5',
        'https://via.placeholder.com/200x150/9400d3/ffffff?text=ハウス6',
        'https://via.placeholder.com/200x150/8b008b/ffffff?text=ハウス7',
        'https://via.placeholder.com/200x150/800080/ffffff?text=ハウス8',
        'https://via.placeholder.com/200x150/4b0082/ffffff?text=ハウス9',
        'https://via.placeholder.com/200x150/663399/ffffff?text=ハウス10'
    ],
    hotel: [
        'https://via.placeholder.com/200x150/ffd700/000000?text=ホテル1',
        'https://via.placeholder.com/200x150/ffb347/000000?text=ホテル2',
        'https://via.placeholder.com/200x150/ff8c00/ffffff?text=ホテル3',
        'https://via.placeholder.com/200x150/ffa500/000000?text=ホテル4',
        'https://via.placeholder.com/200x150/ff7f50/ffffff?text=ホテル5',
        'https://via.placeholder.com/200x150/f4a460/ffffff?text=ホテル6',
        'https://via.placeholder.com/200x150/d2691e/ffffff?text=ホテル7',
        'https://via.placeholder.com/200x150/cd853f/ffffff?text=ホテル8',
        'https://via.placeholder.com/200x150/bc8f8f/ffffff?text=ホテル9',
        'https://via.placeholder.com/200x150/deb887/000000?text=ホテル10'
    ]
};

// 撮影タイプ選択時の処理
function handleShootingTypeChange() {
    const checkboxes = document.querySelectorAll('input[name="shootingType"]:checked');
    const sampleImagesContainer = document.getElementById('sampleImages');
    const imageGrid = document.getElementById('imageGrid');
    
    imageGrid.innerHTML = '';
    
    if (checkboxes.length > 0) {
        checkboxes.forEach(checkbox => {
            const shootingType = checkbox.value;
            if (sampleImages[shootingType]) {
                // 撮影タイプごとのセクションを作成
                const typeSection = document.createElement('div');
                typeSection.className = 'type-section';
                
                const typeTitle = document.createElement('h4');
                const shootingTypeNames = {
                    studio: 'スタジオ撮影',
                    outdoor: '屋外撮影',
                    sea: '海での撮影',
                    house: 'ハウススタジオ撮影',
                    hotel: 'ホテルでの撮影'
                };
                typeTitle.textContent = shootingTypeNames[shootingType];
                typeSection.appendChild(typeTitle);
                
                const typeGrid = document.createElement('div');
                typeGrid.className = 'type-image-grid';
                
                sampleImages[shootingType].forEach((imageSrc, index) => {
                    const img = document.createElement('img');
                    img.src = imageSrc;
                    img.alt = `${shootingTypeNames[shootingType]} 作例 ${index + 1}`;
                    img.className = 'sample-image';
                    typeGrid.appendChild(img);
                });
                
                typeSection.appendChild(typeGrid);
                imageGrid.appendChild(typeSection);
            }
        });
        
        sampleImagesContainer.style.display = 'block';
    } else {
        sampleImagesContainer.style.display = 'none';
    }
}

// 企画書生成処理
function generateProposal() {
    const modelName = document.getElementById('modelName').value;
    const year = document.getElementById('shootingYear').value;
    const month = document.getElementById('shootingMonth').value;
    const day = document.getElementById('shootingDay').value;
    const location = document.getElementById('location').value;
    const selectedTypes = document.querySelectorAll('input[name="shootingType"]:checked');
    const selectedPurposes = document.querySelectorAll('input[name="purpose"]:checked');
    const fee = document.getElementById('fee').value;
    const customPurpose = document.getElementById('customPurpose').value;
    
    if (!modelName || !year || !month || !day || !location || selectedTypes.length === 0 || selectedPurposes.length === 0) {
        alert('すべての項目を入力してください。');
        return;
    }
    
    const shootingDate = `${year}年${month}月${day}日`;
    const dayOfWeek = document.getElementById('dayOfWeek').textContent;
    const fullDate = shootingDate + dayOfWeek;
    
    const shootingTypeNames = {
        studio: 'スタジオ撮影',
        outdoor: '屋外撮影',
        sea: '海での撮影',
        house: 'ハウススタジオ撮影',
        hotel: 'ホテルでの撮影'
    };
    
    const selectedTypeValues = Array.from(selectedTypes).map(type => type.value);
    const selectedTypeNames = selectedTypeValues.map(type => shootingTypeNames[type]);
    
    // 利用目的の処理
    const purposeNames = {
        web: 'WEBサイトやSNS、メールマガジン等での利用',
        amazon: 'amazon写真集'
    };
    
    let purposeList = [];
    selectedPurposes.forEach(purpose => {
        if (purpose.value === 'custom' && customPurpose.trim()) {
            purposeList.push(customPurpose.trim());
        } else if (purpose.value !== 'custom') {
            purposeList.push(purposeNames[purpose.value]);
        }
    });
    
    // プレビュー表示
    const previewContent = document.getElementById('previewContent');
    let previewHTML = `
        <div class="proposal-content">
            <h3>${modelName}様撮影企画書</h3>
            <div class="proposal-item">
                <strong>モデル名:</strong> ${modelName}
            </div>
            <div class="proposal-item">
                <strong>撮影日時:</strong> ${fullDate}
            </div>
            <div class="proposal-item">
                <strong>撮影場所:</strong> ${location}
            </div>
            <div class="proposal-item">
                <strong>作品の利用目的:</strong> ${purposeList.join(', ')}
            </div>`;
    
    if (fee && fee > 0) {
        previewHTML += `
            <div class="proposal-item">
                <strong>謝礼:</strong> ${parseInt(fee).toLocaleString()}円を謝礼として当日現金にてお渡しさせていただきます
            </div>`;
    }
    
    previewHTML += `
            <div class="proposal-item">
                <strong>撮影させていただきたいイメージ:</strong>
    `;
    
    selectedTypes.forEach(typeCheckbox => {
        const shootingType = typeCheckbox.value;
        previewHTML += `
            <div class="preview-type-section">
                <h5>${shootingTypeNames[shootingType]}</h5>
                <div class="preview-images">
                    ${sampleImages[shootingType].map((src, index) => 
                        `<img src="${src}" alt="${shootingTypeNames[shootingType]} 作例 ${index + 1}" class="preview-image">`
                    ).join('')}
                </div>
            </div>
        `;
    });
    
    previewHTML += `
            </div>
        </div>
    `;
    
    previewContent.innerHTML = previewHTML;
    document.getElementById('preview').style.display = 'block';
    
    // 企画書データを保存（グローバル変数として）
    window.currentProposal = {
        modelName,
        year: parseInt(year),
        month: parseInt(month), 
        day: parseInt(day),
        location,
        shootingTypes: selectedTypeValues,
        purposes: purposeList,
        fee: fee ? parseInt(fee) : 0
    };
}

// 共有URL生成機能
function generateShareUrl() {
    if (!window.currentProposal) {
        alert('まず企画書を作成してください。');
        return;
    }
    
    const data = window.currentProposal;
    const params = new URLSearchParams({
        name: data.modelName,
        year: data.year,
        month: data.month,
        day: data.day,
        location: data.location,
        types: data.shootingTypes.join(','),
        purposes: data.purposes.join('|'),
        fee: data.fee
    });
    
    const shareUrl = `${window.location.origin}${window.location.pathname.replace('index.html', '')}proposal.html?${params.toString()}`;
    
    document.getElementById('shareUrl').value = shareUrl;
    document.getElementById('shareUrlContainer').style.display = 'block';
}

// URL をクリップボードにコピー
function copyUrl() {
    const shareUrlInput = document.getElementById('shareUrl');
    shareUrlInput.select();
    shareUrlInput.setSelectionRange(0, 99999);
    
    try {
        document.execCommand('copy');
        alert('URLをクリップボードにコピーしました！');
    } catch (err) {
        console.error('コピーに失敗しました:', err);
        alert('URLのコピーに失敗しました。手動でコピーしてください。');
    }
}

// イベントリスナー設定
document.addEventListener('DOMContentLoaded', function() {
    generateDateOptions();
    
    // 年・月変更時に日のオプションを更新
    document.getElementById('shootingYear').addEventListener('change', function() {
        updateDayOptions();
        updateDayOfWeek();
    });
    document.getElementById('shootingMonth').addEventListener('change', function() {
        updateDayOptions();
        updateDayOfWeek();
    });
    document.getElementById('shootingDay').addEventListener('change', updateDayOfWeek);
    
    // 撮影タイプのチェックボックス変更時
    document.querySelectorAll('input[name="shootingType"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleShootingTypeChange);
    });
    
    document.getElementById('generateProposal').addEventListener('click', generateProposal);
    document.getElementById('generateShareUrl').addEventListener('click', generateShareUrl);
    document.getElementById('copyUrl').addEventListener('click', copyUrl);
});