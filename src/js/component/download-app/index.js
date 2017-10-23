/**
 * @component 下载逻辑
 * @description 点击下载按钮后的逻辑
 * @author wuweishuan
 */
/**
 * 状态类名
 * @type {String}
 */
const active = 'is-active';
/**
 * 按钮选择器
 * @type {String}
 */
const selector = '[data-role="download-app"]';

import delegate from 'delegate';
import downloadTips from 'component/download-tips/index.js'; // 下载弹窗

document.addEventListener('touchstart', delegate(selector, function ( event ) {
    this.classList.add(active);
}), false);

document.addEventListener('touchend', delegate(selector, function ( event ) {
    this.classList.remove(active);
}), false);

document.addEventListener('touchcancel', delegate(selector, function ( event ) {
    this.classList.remove(active);
}), false);

document.addEventListener('click', delegate(selector, function ( event ) {
    if(window.CONFIG.downloadLink) {
        window.location.href = window.CONFIG.downloadLink;
    } else {
        // 如果没有下载链接就打开下载窗
        downloadTips.show();
    }
}), false);
