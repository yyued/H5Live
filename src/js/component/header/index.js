/**
 * @component 头部主播名片
 * @author David
 */

import Event from '../../lib/event/index.js';
import style from './style/index.scss';
import renderTpl from './tpl/index.js';

const componentHeader = document.querySelector('[data-component="header"]');

const headerEvent = new Event;

export default {
    init ( response ) {
        let tpl  = renderTpl(response.data);
        componentHeader.innerHTML = `<style>${ style }</style>${ tpl }`;
        document.addEventListener('click', window.util.delegate('[data-role="follow"]', function () {
            headerEvent.trigger('follow', ( handler ) => {
                handler.apply(this);
            });
        }, 1), false);
        this.on = headerEvent.on.bind(headerEvent);
    },
    destroy () {
        componentHeader.innerHTML = '';
    },
};
