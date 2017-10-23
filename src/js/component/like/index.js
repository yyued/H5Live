/**
 * @component 点赞
 * @author lixinliang
 */

import Promise from 'Promise';
import delegate from 'delegate';
import style from './style/index.scss';
import anim from './modules/anim.js'; //点赞动画
import frequent from './modules/frequent.js';

const componentLike = document.querySelector('[data-component="like"]');

export default {
    init () {
        return new Promise(( resolve ) => {
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
            resolve();
        }).catch((err) => console.log(err));
    },
    destroy () {
        return new Promise(( resolve ) => {
            this.autoLike = false;
            document.removeEventListener('click', this.delegate, false);
            componentLike.innerHTML = '';
            resolve();
        }).catch((err) => console.log(err));
    },
};
