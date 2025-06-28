// 撮影タイプごとの作例画像データ（実際のフォルダ構造に合わせて修正）
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
        'images/sea/sea8.jpg'
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
        'images/hotel/hotel10.jpg',
        'images/hotel/hotel11.jpg',
        'images/hotel/hotel12.jpg',
        'images/hotel/hotel13.jpg',
        'images/hotel/hotel14.jpg',
        'images/hotel/hotel15.jpg',
        'images/hotel/hotel16.jpg',
        'images/hotel/hotel17.jpg',
        'images/hotel/hotel18.jpg',
        'images/hotel/hotel19.jpg'
    ],
    hotel2: [
        'images/bed/bed1.jpg',
        'images/bed/bed2.jpg',
        'images/bed/bed3.jpg',
        'images/bed/bed4.jpg',
        'images/bed/bed5.jpg',
        'images/bed/bed6.jpg',
        'images/bed/bed7.jpg'
    ],
    hotel3: [
        'images/bath/bath1.jpg',
        'images/bath/bath2.jpg',
        'images/bath/bath3.jpg',
        'images/bath/bath4.jpg',
        'images/bath/bath5.jpg',
        'images/bath/bath6.jpg',
        'images/bath/bath7.jpg',
        'images/bath/bath8.jpg',
        'images/bath/bath9.jpg',
        'images/bath/bath10.jpg',
        'images/bath/bath11.jpg'
    ]
};

// URLパラメータから企画書データを取得
function loadProposalFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    
    const modelName = urlParams.get('name');
    const year = urlParams.get('year');
    const month = urlParams.get('month');
    const day = urlParams.get('day');
    const startTime = urlParams.get('startTime');
    const endTime = urlParams.get('endTime');
    const location = urlParams.get('location');
    const typesStr = urlParams.get('types');
    const purposesStr = urlParams.get('purposes');
    const fee = urlParams.get('fee');
    
    if (!modelName || !location || !typesStr || !purposesStr) {
        document.body.innerHTML = '<div class="error-container"><h1>エラー</h1><p>企画書データが見つかりません。</p></div>';
        return;
    }
    
    const shootingTypes = typesStr.split(',');
    const purposes = decodeURIComponent(purposesStr);
    
    // 日時の表示を作成
    let fullDate = '調整中';
    if (year && month && day) {
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
        const dayOfWeek = weekdays[date.getDay()];
        fullDate = `${year}年${month}月${day}日（${dayOfWeek}曜日）`;
        
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
    
    // データを表示
    document.getElementById('proposalTitle').textContent = `${modelName}様撮影企画書`;
    document.getElementById('shootingDate').textContent = fullDate;
    document.getElementById('location').textContent = location;
    document.getElementById('purposes').textContent = purposes;
    
    // 謝礼の表示
    if (fee && parseInt(fee) > 0) {
        document.getElementById('feeAmount').textContent = `${parseInt(fee).toLocaleString()}円を謝礼として当日現金にてお渡しさせていただきます`;
        document.getElementById('feeSection').style.display = 'block';
    }
    
    // 作例画像を表示
    const exampleImagesContainer = document.getElementById('exampleImages');
    
    shootingTypes.forEach(shootingType => {
        if (sampleImages[shootingType]) {
            const typeSection = document.createElement('div');
            typeSection.className = 'type-section';
            
            const typeTitle = document.createElement('h3');
            typeTitle.textContent = shootingTypeNames[shootingType];
            typeTitle.className = 'type-title';
            typeSection.appendChild(typeTitle);
            
            const imageGrid = document.createElement('div');
            imageGrid.className = 'image-grid';
            
            sampleImages[shootingType].forEach((imageSrc, index) => {
                const img = document.createElement('img');
                img.src = imageSrc;
                img.alt = `${shootingTypeNames[shootingType]} 作例 ${index + 1}`;
                img.className = 'sample-image';
                // 画像読み込みエラーハンドリング
                img.onerror = function() {
                    console.error('画像読み込みエラー:', imageSrc);
                    this.style.display = 'none';
                };
                imageGrid.appendChild(img);
            });
            
            typeSection.appendChild(imageGrid);
            exampleImagesContainer.appendChild(typeSection);
        }
    });
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', loadProposalFromUrl);