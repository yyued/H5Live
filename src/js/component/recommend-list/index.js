/**
 * @component 直播推荐列表（大家都在看）
 * @author lixinliang
 */

import style from './style/index.scss';
import renderTpl from './tpl/index.js';
import LazyloadImg from '../../lib/lazy-load-img/index.js';

let liveContent = document.querySelector('[data-role="liveContent"]');
let componentRecommendList = document.createElement('div');
componentRecommendList.setAttribute('data-component', 'recommendList');
componentRecommendList.classList.add('live-recommendList');
liveContent.parentNode.insertBefore(componentRecommendList, liveContent.nextSibling);

export default {
    init() {
        RequqestApi.getRecommendList().then((response)=>{
            let list = response.data;
            componentRecommendList.innerHTML = `<style>${ style }</style>${ renderTpl(list) }`;
            new LazyloadImg({
                el: componentRecommendList.querySelector('.live-recommendList__content'),
                mode: 'diy',
                position: {
                    top: -150,
                    right: -150,
                    bottom: -150,
                    left: -150,
                },
                diy: {
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                },
            }).start();
        })

    },
};
