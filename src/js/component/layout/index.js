/**
 * @component UI布局
 */

import renderTpl from './tpl/index.js';
import style from './style/index.scss';

let wrapSelector = window.wrapSelector?window.wrapSelector:'body';
document.querySelector(wrapSelector).innerHTML = `<style>${style}</style>${renderTpl()}`;
