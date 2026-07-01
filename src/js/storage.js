export function loadGameData() {
    return {
        tuiDo: JSON.parse(localStorage.getItem('saygex_inventory')) || {},
        pityCount: parseInt(localStorage.getItem('saygex_pity')) || 0,
        pity4Count: parseInt(localStorage.getItem('saygex_pity4')) || 0,
        isGuaranteed: localStorage.getItem('saygex_guaranteed') === 'true'
    };
}

export function saveGameData({ tuiDo, pityCount, pity4Count, isGuaranteed }) {
    localStorage.setItem('saygex_inventory', JSON.stringify(tuiDo));
    localStorage.setItem('saygex_pity', pityCount);
    localStorage.setItem('saygex_pity4', pity4Count);
    localStorage.setItem('saygex_guaranteed', isGuaranteed);
}

export function clearGameData() {
    localStorage.clear();
}