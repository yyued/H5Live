/**
 * @component 消息流
 * @description 聊天公屏消息流
 * @author lixinliang
 */

import scrollTo  from '../../lib/scrollTo/index.js';
import style     from './style/index.scss';
import createTpl from './tpl/index.js';
import config    from './config';

const componentMessage = document.querySelector('[data-component="message"]');

// 消息上限
let {limit} = config;
// 固定时消息新增上限
let {limitWhenFixed} = config;
let length = 0;
// 消息更新间隔
let {interval} = config;
let scrollingToBottom = false;
let {autoScrollToBottom} = config;
let tipsShowing = false;
let messages = document.createDocumentFragment();

export default {
    init (socket) {
        componentMessage.innerHTML = `<style>${ style }</style>${ createTpl() }`;
        this.messageList = componentMessage.querySelector('.live-message__list');
        this.messageScreen = componentMessage.querySelector('.live-message__screen');
        if (componentMessage.matches('.camera-pc ~ [data-component="message"]')) {
            // HACK: camera pc mode
            const videoHeight = document.querySelector('[data-component="player"]').dataset.videoHeight;
            this.messageScreen.style['max-height'] = `${ videoHeight }px`;
            this.messageScreen.style['-webkit-mask-size'] = `100% ${ videoHeight }px`;
        }
        this.sid = setInterval(() => {
            this.update();
        }, interval);
        const selector = '.live-message__icon';
        const active = 'is-active';
        let fadeOutId = 0;
        let fadeOutFn = delegate(selector, function ( event ) {
            clearTimeout(fadeOutId);
            fadeOutId = setTimeout(() => {
                this.classList.remove(active);
            }, 100);
        });
        document.addEventListener('touchstart', delegate(selector, function ( event ) {
            clearTimeout(fadeOutId);
            this.classList.add(active);
        }), false);
        document.addEventListener('touchend', fadeOutFn, false);
        document.addEventListener('touchcancel', fadeOutFn, false);
        this.messageScreen.addEventListener('scroll', () => {
            let { scrollTop, scrollHeight, offsetHeight } = this.messageScreen;
            if ((scrollTop + offsetHeight) >= (scrollHeight - 1)) {
                autoScrollToBottom = true;
                if (tipsShowing) {
                    tipsShowing = false;
                    componentMessage.classList.remove('has-tips');
                }
            } else {
                autoScrollToBottom = false;
            }
        }, false);

        let button = componentMessage.querySelector('.live-message__tips');
        button.addEventListener('click', () => {
            scrollingToBottom = true;
            scrollTo('bottom', {
                elem : this.messageScreen,
                // transition : false,
            }).then(() => {
                componentMessage.classList.remove('has-tips');
                scrollingToBottom = false;
                autoScrollToBottom = true;
            });
        }, false);

        this.addSystem(config.systemMessage);
        socket.ioSocket.on(socket.socketName, ( data ) => {
            this.addChat(data.data.nick, data.data.content);
        });
    },
    add ( text, insertBefore ) {
        let message = document.createElement('p');
        message.classList.add('live-message__item');
        message.innerHTML = text;
        if (insertBefore) {
            messages.insertBefore(message, messages.firstElementChild);
        } else {
            messages.appendChild(message);
        }
        if (insertBefore) {
            this.update();
        }
    },
    update () {
        if (scrollingToBottom) {
            return;
        }
        if (!messages.children.length) {
            return;
        }
        length++;
        if (!autoScrollToBottom) {
            if (length > (limit + limitWhenFixed)) {
                autoScrollToBottom = true;
                tipsShowing = false;
                componentMessage.classList.remove('has-tips');
                for (let i = 0; i < limitWhenFixed; i++) {
                    this.messageList.removeChild(this.messageList.firstElementChild);
                }
                length -= limitWhenFixed;
            }
        }
        if (autoScrollToBottom) {
            if (length > limit) {
                this.messageList.removeChild(this.messageList.firstElementChild);
                length--;
            }
        }
        this.messageList.appendChild(messages.firstElementChild);
        if (autoScrollToBottom) {
            scrollTo('bottom', {
                elem : this.messageScreen,
                transition : false,
            });
        } else {
            if (!tipsShowing) {
                tipsShowing = true;
                componentMessage.classList.add('has-tips');
            }
        }
    },
    addSystem ( text ) {
        this.add(`<span class="is-system">系统通知 ${ text }</span>`);
    },
    addShare ( nickname ) {
        this.add(`<span class="is-share">${ nickname } 分享了这个直播</span>`);
    },
    addChat ( nickname, text, insertBefore ) {
        this.add(`<span class="is-nickname">${ nickname }</span> ${ text }`, insertBefore);
    },
    addPresent ( nickname, gift, insertBefore ) {
        this.add(`<span class="is-present">${ nickname } 送了 ${ gift }</span>`, insertBefore);
    },
    addFollow ( nickname, anchorName ) {
        this.add(`<span class="is-follow">${ nickname } 关注了 ${ anchorName }</span>`, true);
    },
    destroy () {
        clearInterval(this.sid);
        componentMessage.innerHTML = '';
    },
    show () {
        componentMessage.classList.remove('fade-out');
    },
    hide () {
        componentMessage.classList.add('fade-out');
    },
};
