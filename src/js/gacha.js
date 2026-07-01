import { kho5Sao, kho4Sao, kho3Sao, dataBanners } from './config.js';

export function rollItem(state, currentBannerKey) {
    state.pityCount++;
    state.pity4Count++;
    
    let nolo5Sao = false;
    let nolo4Sao = false;
    let ngauNhien = Math.random() * 100;
    let isLech = false;

    if (state.pityCount >= 90 || ngauNhien <= 0.5) {
        nolo5Sao = true;
    } else if (state.pity4Count >= 10 || ngauNhien <= 25.5) {
        nolo4Sao = true;
    }

    if (nolo5Sao) {
        state.pityCount = 0;
        state.pity4Count = 0; 
        let tenNhanVat = "";
        let banner = dataBanners[currentBannerKey];

        if (state.isGuaranteed || Math.random() * 100 <= 36) {
            tenNhanVat = banner.featured5Star;
            state.isGuaranteed = false;
            isLech = false;
        } else {
            let danhSachLech = kho5Sao.filter(char => char !== banner.featured5Star);
            tenNhanVat = danhSachLech[Math.floor(Math.random() * danhSachLech.length)];
            state.isGuaranteed = true;
            isLech = true;
        }
        return { name: tenNhanVat, rarity: 5, isLech };
    } else if (nolo4Sao) {
        state.pity4Count = 0;
        return { name: kho4Sao[Math.floor(Math.random() * kho4Sao.length)], rarity: 4 };
    } else {
        return { name: kho3Sao[Math.floor(Math.random() * kho3Sao.length)], rarity: 3 };
    }
}