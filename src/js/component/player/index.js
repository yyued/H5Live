/**
 * @component 播放器
 * @description 根据不同状态渲染不同的UI界面
 * @author David
 */

import config from './config.js';
import livingStyle from './style/live-in.scss';
import liveEndStyle from './style/live-end.scss';

import livingTpl from './tpl/live-in.js'; // 直播中状态
import liveEndTpl from './tpl/live-end.js'; // 直播结束状态

let componentPlayer = document.querySelector('[data-component="player"]');
let video = null;

export default {

    init({data}) {
        this.baseLiveData = data;
        return new Promise(( resolve, reject ) => {
            // 是否在开播
            if(data.living) {
                this.renderLiving(data).then(()=>{
                    resolve();
                });
            }
            else {
                this.renderLiveEnd(data);
            }

        }).catch((err) => {
            console.log(err);
            throw err;
        });
    },

    // 监听直播状态
    listenLiveStatus(callback) {
        RequqestApi.getLiveStatus().then(({data})=>{
            if (data.status === 1 && !this.scopeLiveStatus) {
                this.renderLiving(this.baseLiveData, true);
                this.scopeLiveStatus = 1;
            }
            else if (data.status !== 1 && this.scopeLiveStatus) {
                this.renderLiveEnd(this.baseLiveData);
                this.scopeLiveStatus = 0;
            }
            callback && callback(data.status);
        });
        setTimeout(()=>{
            this.listenLiveStatus(callback);
        }, config.checkLiveStatusSpeek);
    },

    // 初始化视频
    createVideo(data) {
        return new Promise(( resolve, reject ) => {
            componentPlayer.classList.add('is-waiting');
            window.util.sleep(1000).then(()=>{
                if (!video) {
                    let newVideo = document.createElement('video');
                    document.querySelector('#player').appendChild(newVideo);
                    setTimeout(resolve, 10);
                    video = newVideo;
                    video.src = data.liveUrl;
                    video.setAttribute('playsinline', true);
                    video.removeAttribute('poster');
                }
                video.play();
                this.scopeLiveStatus = 1;
            })
        });
    },

    // 渲染直播中状态UI
    renderLiving(data, autoplay) {
        return new Promise(( resolve, reject ) => {
            let isAutoPlay = autoplay?autoplay:(Number(window.util.getUrlParam('autoplay')) || 0);
            componentPlayer.innerHTML = `<style>${ livingStyle }</style>${ livingTpl(data) }`;
            componentPlayer.classList.add('has-poster', 'has-button');
            // 自动播放
            isAutoPlay && this.createVideo(data).then(resolve);

            document.addEventListener('click', window.util.delegate('[data-role="play-video"]', () => {
                this.createVideo(data).then(resolve);
            }), false);
        })
        .then(this.bindEvent)
        .then(() => {
            this.setPlayerSize('mobile');
        });
    },

    // 渲染开播结束状态UI
    renderLiveEnd(data) {
        const posterURL = data.cover;
        componentPlayer.style['background-image'] = `url(${ posterURL })`;
        componentPlayer.innerHTML = `<style>${ liveEndStyle }</style>${ liveEndTpl(data) }`;
        componentPlayer.classList.add('has-poster');
        video = null;
    },

        // 动态计算视频窗口
    setPlayerSize( type ) {
        const winHeight = window.innerHeight;
        const topBarHeight = document.querySelector('[data-component="topBar"]').offsetHeight;
        if (type == 'mobile') {
            const playerHeight = winHeight - topBarHeight + 1;
            const videoHeight = '120%';
            const videoTop = '-10%';
            video.style['height'] = videoHeight;
            video.style['top'] = videoTop;
            componentPlayer.classList.remove('has-poster', 'has-button', 'is-waiting');
            componentPlayer.classList.add('has-live');
            return new Promise(( resolve ) => {
                componentPlayer.addEventListener('transitionend', resolve, false);
                componentPlayer.style['height'] = `${ playerHeight }px`;
            });
        }
        if (type == 'pc') {
            const winHeight = window.innerHeight;
            const topBarHeight = document.querySelector('[data-component="topBar"]').offsetHeight;
            // HACK: message bottom + message action height + message screen margin bottom
            const messageActionZone = Math.round((0.2 + 0.68 + 0.2) * parseFloat(getComputedStyle(document.documentElement)['font-size']));
            const playerHeight = winHeight - topBarHeight + 1;
            const videoHeight = (playerHeight - messageActionZone) * 0.5;
            video.style['height'] = '50%';
            video.style['width'] = `${ videoHeight * 16 / 9 }px`;
            document.querySelector('#player').style['padding-bottom'] = `${ messageActionZone }px`;
            componentPlayer.classList.remove('has-poster', 'has-button', 'is-waiting');
            componentPlayer.classList.add('has-live', 'camera-pc');
            componentPlayer.dataset.videoHeight = videoHeight;
            return new Promise(( resolve ) => {
                componentPlayer.addEventListener('transitionend', resolve, false);
                componentPlayer.style['height'] = `${ playerHeight }px`;
            });
        }
    },

    // 添加视频事件
    bindEvent() {
        // TODO: 暴露回调 其他组件可以获取直播状态
        video.addEventListener('pause', () => {
            componentPlayer.classList.add('has-button');
            this.scopeLiveStatus = 0;
        }, false);
        video.addEventListener('play', () => {
            componentPlayer.classList.remove('has-button');
        }, false)
    },

}

