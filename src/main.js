import { initUI, quayGacha, moTuiDo, dongTuiDo, resetData, dongGacha } from './js/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    initUI();
    document.getElementById('btn-roll-1').addEventListener('click', () => quayGacha(1));
    document.getElementById('btn-roll-10').addEventListener('click', () => quayGacha(10));
    document.getElementById('btn-open-inv').addEventListener('click', moTuiDo);
    document.getElementById('btn-close-inv').addEventListener('click', dongTuiDo);
    document.getElementById('btn-reset-data').addEventListener('click', resetData);
    document.getElementById('btn-skip-gacha').addEventListener('click', dongGacha);
});