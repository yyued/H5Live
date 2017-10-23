/**
 * @component 顶部工具条
 * @author David
 */

import style from './style/index.scss';
import renderTpl from './tpl/index.js';

export default {
    init () {
        let componentTopBar = document.querySelector('[data-component="topBar"]');
        componentTopBar.innerHTML = `<style>${ style }</style>${ renderTpl() }`;
    },
};
