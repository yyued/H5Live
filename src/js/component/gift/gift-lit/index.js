/**
 * @component 礼物模块
 * @author wilson
 */

import sprite from '../../../lib/sprite/index.js'; // 礼物动画
import combo from './module/combo.js'; // 礼物连击
import style from'./style/index.scss';
import createTpl from './tpl/index.js';

const componentGift = document.querySelector('[data-component="gift"]');
componentGift.innerHTML = `<style>${style}</style>`;

let giftMap = null;

let main = {
    // 创建dom
    create: (data, position) => {
        main.comboId[`line${position}`] = data.comboId;
        let giftItem = document.createElement('div');
        giftItem.setAttribute('class', `live-gift__item ext-line${position} gift-ani`);
        const tpl = createTpl(data);
        giftItem.innerHTML = tpl;
        componentGift.appendChild(giftItem);
    },

    // 礼物连送ID
    comboId: {
        'line1': '',
        'line2': '',
    },

    // 礼物连送对象
    comboObj: {
        'line1': null,
        'line2': null,
    },

    // 礼物位置数
    giftQueueNum: 0,

    // 礼物推送
    pushGift: (queue, position) => {
        // 创建礼物dom,并指定显示位置
        main.create(queue.task, position);
        let currentGiftElement = document.querySelector(`.ext-line${position}`);
        let giftImgDom = currentGiftElement.querySelector('.live-gift__giftImg'); // 礼物图片动画
        let aniDom = currentGiftElement.querySelector('.live-gift__giftNum');
        let comboImgDom = aniDom.children[1];
        let originalDom = aniDom.children[2];

        sprite(giftImgDom, giftMap[queue.task.propId].spriteImage, giftMap[queue.task.propId].spriteDuration);
        giftImgDom.dataset.status = 'play';

        main.comboObj[`line${position}`] = new combo({
            endNum: queue.task.giftNum,
            aniDom: aniDom,
            comboImgDom: comboImgDom,
            numDom: originalDom,
            cb: function(aniDom) {
                currentGiftElement.classList.add('is-hide');

                //重置
                main.comboObj[`line${position}`] = null;
                main.comboId[`line${position}`] = '';

                setTimeout(() => {
                    componentGift.removeChild(currentGiftElement);
                    queue.callback(queue.task);
                }, 500);
            }
        })
    },

    // 初始化队列
    initQueue: () => {
        let timer = null;
        //礼物消息队列
        let giftLit = queue.queue(function (task, callback) {
            let extPos1Dom = document.querySelector('.ext-line1');
            let extPos2Dom = document.querySelector('.ext-line2');
            let currentQuene = {
                task,
                callback,
            };

            main.giftQueueNum++;
            if(main.giftQueueNum <= 2) {
                if(extPos1Dom) {
                    main.pushGift(currentQuene, 2);
                } else {
                    main.pushGift(currentQuene, 1);
                }
            } else {
                // 超出队列显示，队列暂停
                giftLit.pause();
            }
        }, 2);

        return giftLit;
    },

    // 加入队列
    addQueue: (data, giftLitle, isLast) => {
        let {nick, avatar, propId, propCount, comboId} = data.data;
        let giftItemObj = {
            "propId": propId,
            "nick":nick,
            "avatar": avatar,
            "giftNum": propCount,
            "giftName": giftMap[propId].name,
            "giftImg": giftMap[propId].thumb,
            "comboId": comboId
        };

        if(isLast) {
            // 插到队列尾部
            giftLitle.push(giftItemObj, main.queueCallback(giftLitle));
        } else {
            // 插到队列首部
            giftLitle.unshift(giftItemObj, main.queueCallback(giftLitle));
        }

    },

    // 队列回调
    queueCallback: (giftLitle) => {
        if(giftLitle.tasks.length > 0) {
            let tempArr = giftLitle.tasks,
                tempArrLen = tempArr.length;
            let comboArr = [];
            let comboTotal = 0;
            let beLeftArr = [];
            let firstTaskComboid = tempArr[0].data.comboId;
            for(let i = 0; i < tempArrLen;i++) {
                if(tempArr[i].data.comboId == firstTaskComboid) {
                    comboArr.push(tempArr[i]);
                    comboTotal += tempArr[i].data.giftNum;
                } else {
                    beLeftArr.push(tempArr[i]);
                }
            }

            if(comboArr.length > 1) {
                // 累积comboid相同的礼物
                comboArr[0].data.giftNum = comboTotal;
                comboArr.length = 1;
            }

            // 拼接队列
            giftLitle.tasks = comboArr.concat(beLeftArr, giftLitle.tasks.slice(tempArrLen));
        }
        main.giftQueueNum--;
        // 恢复队列
        if(giftLitle.paused) {
            giftLitle.resume();
        }
    },

    // 礼物推送判断
    giftHandle: (data, giftLit, callback) => {
        if(giftMap[data.propId]) {
            let svga = giftMap[data.propId].svga;
            if(!svga) {
                let comboId = data.comboId;
                if(comboId == main.comboId['line1']) {
                    main.comboObj['line1'].update(data.propCount);
                } else if(comboId == main.comboId['line2']) {
                    main.comboObj['line2'].update(data.propCount);
                } else {
                    callback(data, giftMap, giftLit);
                }
            }
        } else {
            console.log('没有匹配到礼物！')
        }
    }
}

let onSendGift = function () {};

export default {
    // 初始化
    init(socket, giftMapObj) {
        giftMap = giftMapObj;
        if (componentGift.matches('.camera-pc ~ [data-component="gift"]')) {
            // HACK: camera pc mode
            const videoHeight = document.querySelector('[data-component="player"]').dataset.videoHeight;
            componentGift.style['top'] = `${ videoHeight }px`;
            componentGift.style['bottom'] = `0`;
            componentGift.style['transform'] = componentGift.style['-webkit-transform'] = `translateY(-100%)`;
            // HACK: image padding
            componentGift.style['margin-top'] = `-10px`;
        }

        let giftLit = main.initQueue();

        socket.ioSocket.on(socket.socketName, (data) => {
            main.giftHandle(data.data, giftLit, function() {
                let {uid, nick, propId} = data.data;
                onSendGift({
                    uid: uid,
                    nickname: nick,
                    name: giftMap[propId].name,
                });
                main.addQueue(data, giftLit, true);
            })
        });

        // 礼物面板送礼优先显示
        // this.unShiftQueue = (data) => {
        //     main.giftHandle(data, giftLit, function() {
        //         main.addQueue(data, giftLit, false);
        //     })
        // };
    },
    destroy () {
        componentGift.style['display'] = 'none';
    },
    onSendGift ( callback ) {
        onSendGift = callback;
    },
}
