// 撮影タイプごとの作例画像データ（メインスクリプトと同じ）
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

// URLパラメータから企画書データを取得
function loadProposalFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    
    const modelName = urlParams.get('name');
    const year = urlParams.get('year');
    const month = urlParams.get('month');
    const day = urlParams.get('day');
    const location = urlParams.get('location');
    const typesStr = urlParams.get('types');
    const purposesStr = urlParams.get('purposes');
    const fee = urlParams.get('fee');
    
    if (!modelName || !year || !month || !day || !location || !typesStr || !purposesStr) {
        document.body.innerHTML = '<div class="error-container"><h1>エラー</h1><p>企画書データが見つかりません。</p></div>';
        return;
    }
    
    const shootingTypes = typesStr.split(',');
    const purposes = decodeURIComponent(purposesStr);
    
    // 曜日を計算
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const dayOfWeek = weekdays[date.getDay()];
    const fullDate = `${year}年${month}月${day}日（${dayOfWeek}曜日）`;
    
    const shootingTypeNames = {
        studio: 'スタジオ撮影',
        outdoor: '屋外撮影',
        sea: '海での撮影',
        house: 'ハウススタジオ撮影',
        hotel: 'ホテルでの撮影'
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
                imageGrid.appendChild(img);
            });
            
            typeSection.appendChild(imageGrid);
            exampleImagesContainer.appendChild(typeSection);
        }
    });
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', loadProposalFromUrl);