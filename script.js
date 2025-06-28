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
        'images/studio/studio1.jpg',
        'images/studio/studio2.jpg',
        'images/studio/studio3.jpg',
        'images/studio/studio4.jpg',
        'images/studio/studio5.jpg',
        'images/studio/studio6.jpg',
        'images/studio/studio7.jpg',
        'images/studio/studio8.jpg',
        'images/studio/studio9.jpg',
        'images/studio/studio10.jpg'
    ],
    outdoor: [
        'images/outdoor/outdoor1.jpg',
        'images/outdoor/outdoor2.jpg',
        'images/outdoor/outdoor3.jpg',
        'images/outdoor/outdoor4.jpg',
        'images/outdoor/outdoor5.jpg',
        'images/outdoor/outdoor6.jpg',
        'images/outdoor/outdoor7.jpg',
        'images/outdoor/outdoor8.jpg',
        'images/outdoor/outdoor9.jpg',
        'images/outdoor/outdoor10.jpg'
    ],
    sea: [
        'images/sea/sea1.jpg',
        'images/sea/sea2.jpg',
        'images/sea/sea3.jpg',
        'images/sea/sea4.jpg',
        'images/sea/sea5.jpg',
        'images/sea/sea6.jpg',
        'images/sea/sea7.jpg',
        'images/sea/sea8.jpg',
        'images/sea/sea9.jpg',
        'images/sea/sea10.jpg'
    ],
    house: [
        'images/house/house1.jpg',
        'images/house/house2.jpg',
        'images/house/house3.jpg',
        'images/house/house4.jpg',
        'images/house/house5.jpg',
        'images/house/house6.jpg',
        'images/house/house7.jpg',
        'images/house/house8.jpg',
        'images/house/house9.jpg',
        'images/house/house10.jpg'
    ],
    hotel: [
        'images/hotel/hotel1.jpg',
        'images/hotel/hotel2.jpg',
        'images/hotel/hotel3.jpg',
        'images/hotel/hotel4.jpg',
        'images/hotel/hotel5.jpg',
        'images/hotel/hotel6.jpg',
        'images/hotel/hotel7.jpg',
        'images/hotel/hotel8.jpg',
        'images/hotel/hotel9.jpg',
        'images/hotel/hotel10.jpg'
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
        website: 'WEBサイト',
        sns: 'SNS',
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
    
    const purposeText = purposeList.length > 0 ? purposeList.join('、') + '等で利用させていただきます。' : '';
    
    // プレビュー表示
    const previewContent = document.getElementById('previewContent');
    let previewHTML = `
        <div class="proposal-content">
            <h3>${modelName}様撮影企画書</h3>
            <div class="proposal-item">
                <strong>撮影日時:</strong> ${fullDate}
            </div>
            <div class="proposal-item">
                <strong>撮影場所:</strong> ${location}
            </div>
            <div class="proposal-item">
                <strong>作品のお渡し方法:</strong> 作品一式はデジタルデータでお渡しします。ぜひSNS等でご利用ください。
            </div>
            <div class="proposal-item">
                <strong>作品の利用目的:</strong> ${purposeText}
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
        purposes: purposeText,
        fee: fee ? parseInt(fee) : 0
    };
    
    // ローカルストレージに自動保存
    saveProposalToStorage(window.currentProposal, purposeList);
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
        purposes: encodeURIComponent(data.purposes),
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

// ローカルストレージに企画書を保存
function saveProposalToStorage(proposalData, purposeList) {
    const STORAGE_KEY = 'photo_proposals';
    
    // 既存のデータを取得
    const existingData = localStorage.getItem(STORAGE_KEY);
    const proposals = existingData ? JSON.parse(existingData) : [];
    
    // 利用目的の生データを保存（編集時に復元するため）
    const selectedPurposes = document.querySelectorAll('input[name="purpose"]:checked');
    const customPurpose = document.getElementById('customPurpose').value;
    let rawPurposes = [];
    
    selectedPurposes.forEach(purpose => {
        if (purpose.value === 'custom' && customPurpose.trim()) {
            rawPurposes.push({ type: 'custom', value: customPurpose.trim() });
        } else if (purpose.value !== 'custom') {
            rawPurposes.push({ type: purpose.value, value: purposeList.find(p => p.includes(purpose.value)) || purpose.value });
        }
    });
    
    // 新しい企画書データ
    const newProposal = {
        id: Date.now().toString(), // 簡易的なID生成
        ...proposalData,
        rawPurposes: rawPurposes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // 同じモデル名の既存企画書があるかチェック
    const existingIndex = proposals.findIndex(p => p.modelName === proposalData.modelName);
    
    if (existingIndex !== -1) {
        // 既存データを更新
        proposals[existingIndex] = { ...proposals[existingIndex], ...newProposal, createdAt: proposals[existingIndex].createdAt };
    } else {
        // 新規追加
        proposals.push(newProposal);
    }
    
    // ローカルストレージに保存
    localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
    
    console.log('企画書を保存しました:', newProposal.modelName);
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