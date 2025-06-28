// 年・月・日・時刻のオプションを生成
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
    
    // 時刻のオプション（30分単位）
    generateTimeOptions();
}

// 時刻オプションの生成（30分単位、6:00-22:00）
function generateTimeOptions() {
    const startTimeSelect = document.getElementById('startTime');
    const endTimeSelect = document.getElementById('endTime');
    
    for (let hour = 6; hour <= 22; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const timeText = `${hour}:${minute.toString().padStart(2, '0')}`;
            
            // 開始時間のオプション
            const startOption = document.createElement('option');
            startOption.value = timeValue;
            startOption.textContent = timeText;
            startTimeSelect.appendChild(startOption);
            
            // 終了時間のオプション
            const endOption = document.createElement('option');
            endOption.value = timeValue;
            endOption.textContent = timeText;
            endTimeSelect.appendChild(endOption);
        }
    }
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

// 撮影タイプとフォルダのマッピング
const shootingTypeFolders = {
    studio: { folder: 'studio', prefix: 'studio', maxCount: 20 },
    outdoor: { folder: 'outdoor', prefix: 'outdoor', maxCount: 20 },
    sea: { folder: 'sea', prefix: 'sea', maxCount: 20 },
    house: { folder: 'house', prefix: 'house', maxCount: 20 },
    hotel: { folder: 'hotel', prefix: 'hotel', maxCount: 30 },
    hotel2: { folder: 'bed', prefix: 'bed', maxCount: 20 },
    hotel3: { folder: 'bath', prefix: 'bath', maxCount: 20 }
};

// フォルダ内の画像を動的に検索する関数
async function getImagesFromFolder(shootingType) {
    const config = shootingTypeFolders[shootingType];
    if (!config) return [];
    
    const images = [];
    const { folder, prefix, maxCount } = config;
    
    console.log(`${shootingType}の画像を検索中: ${folder}フォルダ`);
    
    // 1から maxCount まで順番に画像の存在をチェック
    for (let i = 1; i <= maxCount; i++) {
        const imagePath = `images/${folder}/${prefix}${i}.jpg`;
        
        try {
            // 画像が存在するかチェック
            const exists = await checkImageExists(imagePath);
            if (exists) {
                images.push(imagePath);
                console.log(`画像発見: ${imagePath}`);
            } else {
                // 連続して存在しない場合は終了
                if (i > 1 && images.length === i - 1) {
                    // まだ連続している場合は続行
                } else if (images.length === 0 && i > 3) {
                    // 最初の3つが見つからない場合は終了
                    break;
                } else if (images.length > 0 && i - images.length > 3) {
                    // 3つ以上連続で見つからない場合は終了
                    break;
                }
            }
        } catch (error) {
            console.log(`画像チェックエラー: ${imagePath}`);
        }
    }
    
    console.log(`${shootingType}で見つかった画像数: ${images.length}`);
    return images;
}

// 画像の存在をチェックする関数
function checkImageExists(imagePath) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = imagePath;
    });
}

// 撮影タイプ選択時の処理（動的読み込み版）
async function handleShootingTypeChange() {
    const checkboxes = document.querySelectorAll('input[name="shootingType"]:checked');
    const sampleImagesContainer = document.getElementById('sampleImages');
    const imageGrid = document.getElementById('imageGrid');
    
    imageGrid.innerHTML = '';
    
    if (checkboxes.length > 0) {
        // ローディング表示
        imageGrid.innerHTML = '<div class="loading">画像を読み込み中...</div>';
        
        for (const checkbox of checkboxes) {
            const shootingType = checkbox.value;
            console.log('=== 選択された撮影タイプ:', shootingType, '===');
            
            // 動的に画像を取得
            const images = await getImagesFromFolder(shootingType);
            
            if (images.length > 0) {
                // ローディング表示をクリア（最初の一回のみ）
                if (imageGrid.innerHTML.includes('loading')) {
                    imageGrid.innerHTML = '';
                }
                
                console.log(`${shootingType}で${images.length}個の画像が見つかりました`);
                
                // 撮影タイプごとのセクションを作成
                const typeSection = document.createElement('div');
                typeSection.className = 'type-section';
                
                const typeTitle = document.createElement('h4');
                const shootingTypeNames = {
                    studio: 'スタジオ撮影',
                    outdoor: '屋外撮影',
                    sea: '海での撮影',
                    house: 'ハウススタジオ撮影',
                    hotel: 'ホテルでの撮影１',
                    hotel2: 'ホテルでの撮影２',
                    hotel3: 'ホテルでの撮影３'
                };
                typeTitle.textContent = shootingTypeNames[shootingType];
                typeSection.appendChild(typeTitle);
                
                const typeGrid = document.createElement('div');
                typeGrid.className = 'type-image-grid';
                
                images.forEach((imageSrc, index) => {
                    console.log('画像パスを設定:', imageSrc);
                    const img = document.createElement('img');
                    img.src = imageSrc;
                    img.alt = `${shootingTypeNames[shootingType]} 作例 ${index + 1}`;
                    img.className = 'sample-image';
                    // 画像読み込み成功ハンドリング
                    img.onload = function() {
                        console.log('画像読み込み成功:', imageSrc);
                    };
                    // 画像読み込みエラーハンドリング
                    img.onerror = function() {
                        console.error('画像読み込みエラー:', imageSrc);
                        this.style.display = 'none';
                    };
                    typeGrid.appendChild(img);
                });
                
                typeSection.appendChild(typeGrid);
                imageGrid.appendChild(typeSection);
            } else {
                console.log(`${shootingType}で画像が見つかりませんでした`);
            }
        }
        
        sampleImagesContainer.style.display = 'block';
    } else {
        sampleImagesContainer.style.display = 'none';
    }
}

// 企画書生成処理（完全に修正版）
function generateProposal() {
    console.log('企画書生成開始');
    
    const modelName = document.getElementById('modelName').value.trim();
    const year = document.getElementById('shootingYear').value;
    const month = document.getElementById('shootingMonth').value;
    const day = document.getElementById('shootingDay').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const location = document.getElementById('location').value.trim();
    const selectedTypes = document.querySelectorAll('input[name="shootingType"]:checked');
    const selectedPurposes = document.querySelectorAll('input[name="purpose"]:checked');
    const fee = document.getElementById('fee').value;
    const customPurpose = document.getElementById('customPurpose').value.trim();
    
    // デバッグ用ログ
    console.log('入力値確認:', {
        modelName: modelName,
        location: location,
        selectedTypesCount: selectedTypes.length,
        selectedPurposesCount: selectedPurposes.length,
        year: year,
        month: month,
        day: day,
        startTime: startTime,
        endTime: endTime
    });
    
    // 必須項目のチェック（日時は任意）
    if (!modelName) {
        alert('モデル名を入力してください。');
        return;
    }
    
    if (!location) {
        alert('撮影場所を入力してください。');
        return;
    }
    
    if (selectedTypes.length === 0) {
        alert('撮影タイプを1つ以上選択してください。');
        return;
    }
    
    if (selectedPurposes.length === 0) {
        alert('作品の利用目的を1つ以上選択してください。');
        return;
    }
    
    // 日時の表示を作成
    let fullDate = '調整中';
    if (year && month && day) {
        const shootingDate = `${year}年${month}月${day}日`;
        const dayOfWeek = document.getElementById('dayOfWeek').textContent;
        fullDate = shootingDate + dayOfWeek;
        
        // 時刻の表示を柔軟に処理
        if (startTime || endTime) {
            let timeRange = '';
            if (startTime && endTime) {
                timeRange = `${startTime}〜${endTime}`;
            } else if (startTime) {
                timeRange = `${startTime}〜（終了時刻調整中）`;
            } else if (endTime) {
                timeRange = `（開始時刻調整中）〜${endTime}`;
            }
            fullDate += ' ' + timeRange;
        }
    }
    
    const shootingTypeNames = {
        studio: 'スタジオ撮影',
        outdoor: '屋外撮影',
        sea: '海での撮影',
        house: 'ハウススタジオ撮影',
        hotel: 'ホテルでの撮影１',
        hotel2: 'ホテルでの撮影２',
        hotel3: 'ホテルでの撮影３'
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
        if (purpose.value === 'custom' && customPurpose) {
            purposeList.push(customPurpose);
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
                        `<img src="${src}" alt="${shootingTypeNames[shootingType]} 作例 ${index + 1}" class="preview-image" onerror="this.style.display='none'">`
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
        year: year ? parseInt(year) : null,
        month: month ? parseInt(month) : null, 
        day: day ? parseInt(day) : null,
        startTime: startTime || null,
        endTime: endTime || null,
        location,
        shootingTypes: selectedTypeValues,
        purposes: purposeText,
        fee: fee ? parseInt(fee) : 0
    };
    
    // ローカルストレージに自動保存
    saveProposalToStorage(window.currentProposal, purposeList);
    
    console.log('企画書生成完了');
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
        year: data.year || '',
        month: data.month || '',
        day: data.day || '',
        startTime: data.startTime || '',
        endTime: data.endTime || '',
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
    console.log('DOMContentLoaded開始');
    
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
    
    console.log('イベントリスナー設定完了');
});