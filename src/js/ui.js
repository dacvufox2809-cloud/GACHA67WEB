import { dataBanners, hinhAnhVatPham } from './config.js';
import { loadGameData, saveGameData, clearGameData } from './storage.js';
import { rollItem } from './gacha.js';

let state = loadGameData();
let currentBanner = 'cuong';
let splashQueue = [];
let currentResultCardsHtml = "";

const dom = {
    bannerTitle: document.getElementById('banner-title'),
    bannerTabs: document.getElementById('banner-tabs-container'),
    pityNum: document.getElementById('pity-num'),
    pity4Num: document.getElementById('pity-4-num'),
    guaranteeStatus: document.getElementById('guarantee-status'),
    screenGacha: document.getElementById('screen-gacha'),
    charSplashArea: document.getElementById('char-splash-area'),
    textResult: document.getElementById('text-result'),
    btnSkipGacha: document.getElementById('btn-skip-gacha'),
    screenInventory: document.getElementById('screen-inventory'),
    inventoryList: document.getElementById('inventory-list')
};

export function initUI() {
    renderTabs();
    updatePityUI();
    setupEventListeners();
}

function amThanh(fileMp3) {
    new Audio(`/audio/${fileMp3}`).play().catch(() => {});
}

function updatePityUI() {
    dom.pityNum.innerText = state.pityCount;
    dom.pity4Num.innerText = `(4★: ${state.pity4Count}/10)`;
    dom.guaranteeStatus.innerText = state.isGuaranteed ? "[Không Nổ Thì Dev Chịu]" : "[Tỷ lệ 36/64]";
    dom.guaranteeStatus.style.color = state.isGuaranteed ? "#4caf50" : "#ef5350";
}

function renderTabs() {
    dom.bannerTabs.innerHTML = Object.keys(dataBanners).map(key => `
        <button class="btn-tab ${key === currentBanner ? 'active' : ''}" data-banner="${key}">${dataBanners[key].shortName}</button>
    `).join('');
}

export function quayGacha(soLuot) {
    let chuoiTheHtml = "";
    let doHiemCaoNhat = 3; 
    let coLech = false;
    splashQueue = []; 

    for (let i = 0; i < soLuot; i++) {
        let res = rollItem(state, currentBanner);
        if (!state.tuiDo[res.name]) state.tuiDo[res.name] = { count: 0, rarity: res.rarity };
        state.tuiDo[res.name].count++;

        if (res.rarity > doHiemCaoNhat) doHiemCaoNhat = res.rarity;
        if (res.rarity === 5) {
            splashQueue.push(res);
            if (res.isLech) coLech = true;
        }

        let classVien = res.name === "★5 Ba Hĩu" ? "rarity-red" : `rarity-${res.rarity}`;
        chuoiTheHtml += `
            <div class="gacha-card ${classVien}" style="animation-delay: ${i * 0.15}s;">
                <div class="card-img-box"><img src="${hinhAnhVatPham[res.name] || ''}"></div>
                <div class="card-name">${res.name}</div>
            </div>
        `;
    }

    saveGameData(state);
    updatePityUI();

    dom.charSplashArea.style.display = 'none';
    dom.textResult.style.display = 'none';
    dom.screenGacha.className = "gacha-screen";
    currentResultCardsHtml = chuoiTheHtml;

    if (doHiemCaoNhat === 5) {
        if (splashQueue.some(q => q.name === "★5 Ba Hĩu")) amThanh('secret.mp3');
        else amThanh(coLech ? 'stagger.mp3' : 'gold.mp3');
        dom.screenGacha.classList.add('flash-gold');
        hienThiSplashArt();
    } else {
        amThanh('roll.mp3');
        dom.screenGacha.classList.add(doHiemCaoNhat === 4 ? 'flash-purple' : 'flash-blue');
        dom.textResult.innerHTML = currentResultCardsHtml;
        dom.textResult.style.display = 'flex';
    }
    dom.screenGacha.style.display = 'flex';
}

function hienThiSplashArt() {
    if (splashQueue.length > 0) {
        let curr = splashQueue.shift();
        dom.charSplashArea.innerHTML = `<img class="char-splash-img ${curr.name === "★5 Ba Hĩu" ? "red-glow" : ""}" src="${hinhAnhVatPham[curr.name]}">`;
        dom.charSplashArea.style.display = 'flex';
        dom.btnSkipGacha.innerText = "Next (Phím E)";
    } else {
        dom.charSplashArea.style.display = 'none';
        dom.textResult.innerHTML = currentResultCardsHtml;
        dom.textResult.style.display = 'flex';
        dom.btnSkipGacha.innerText = "Close (Phím E)";
    }
}

export function dongGacha() {
    if (dom.charSplashArea.style.display === 'flex') {
        hienThiSplashArt();
        return;
    }
    dom.screenGacha.style.display = 'none';
}

export function moTuiDo() {
    dom.inventoryList.innerHTML = '';
    let keys = Object.keys(state.tuiDo).sort((a,b) => state.tuiDo[b].rarity - state.tuiDo[a].rarity);
    if(keys.length === 0) {
        dom.inventoryList.innerHTML = '<p style="text-align:center;color:#aaa;">Kho đồ trống rỗng...</p>';
    } else {
        keys.forEach(k => {
            let color = k === "★5 Ba Hĩu" ? "#ff1111" : (state.tuiDo[k].rarity === 5 ? "#ffd700" : (state.tuiDo[k].rarity === 4 ? "#e100ff" : "#00ccff"));
            dom.inventoryList.innerHTML += `<div class="inventory-item" style="color:${color}"><span>${k}</span><span>x${state.tuiDo[k].count}</span></div>`;
        });
    }
    dom.screenInventory.style.display = 'flex';
}

export function dongTuiDo() { dom.screenInventory.style.display = 'none'; }
export function resetData() {
    if(confirm("Xóa toàn bộ dữ liệu?")) {
        clearGameData();
        state = { tuiDo: {}, pityCount: 0, pity4Count: 0, isGuaranteed: false };
        updatePityUI(); dongTuiDo();
    }
}

function setupEventListeners() {
    dom.bannerTabs.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-tab')) {
            currentBanner = e.target.getAttribute('data-banner');
            dom.bannerTitle.innerText = "BANNER " + dataBanners[currentBanner].name.toUpperCase();
            renderTabs();
        }
    });
    document.addEventListener('keydown', (e) => {
        if ((e.key === 'e' || e.key === 'E') && dom.screenGacha.style.display === 'flex') dongGacha();
        if (e.key === 'g' || e.key === 'G') dom.screenInventory.style.display === 'flex' ? dongTuiDo() : moTuiDo();
    });
}