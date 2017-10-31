/**
 * @component 点赞
 * @author lixinliang
 */

import style from './style/index.scss';
import anim from './module/anim.js'; //点赞动画
import frequent from './module/frequent.js';

const componentLike = document.querySelector('[data-component="like"]');

export default {
    init () {
        componentLike.innerHTML = `<style>${ style }</style>`;
        componentLike.appendChild(anim.canvas);
        // 根据在线人数模拟点赞量
        let online = document.querySelector('.live-hostInfo__online');
        this.autoLike = true;
        let autoLike = () => {
            let viewer = (parseInt(online ? online.innerText : 0) + '').length;
            let delay = 50 + 2520 / (viewer > 6 ? 6 : viewer);
            frequent(() => {
                if (this.autoLike) {
                    anim.show('audience');
                    autoLike();
                }
            }, delay)
        };
        autoLike();
        this.delegate = delegate('.live-content', function ( event ) {
            anim.show('user');
        });
        document.addEventListener('click', this.delegate, false);
    },
    destroy () {
        this.autoLike = false;
        document.removeEventListener('click', this.delegate, false);
        componentLike.innerHTML = '';
    },
};
