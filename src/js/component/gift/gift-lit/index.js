/**
 * @component 礼物模块
 * @author wilson
 */

import sprite from '../../../lib/sprite/index.js'; // 礼物动画
import combo from './lib/combo.js'; // 礼物连击
import style from'./style/index.scss';
import createTpl from './tpl/index.tpl';

const componentGift = document.querySelector('[data-component="gift"]');
componentGift.innerHTML = `<style>${style}</style>`;

let main = {
    // 创建dom
    create: (data, pos) => {
        if(pos == 1) {
            main.pos1Comboid = data.comboId;
        } else {
            main.pos2Comboid = data.comboId;
        }

        let giftItem = document.createElement('div');
        giftItem.setAttribute('class', `live-gift__item ext-pos${pos} gift-ani`);
        const tpl = createTpl(data);
        giftItem.innerHTML = tpl;
        componentGift.appendChild(giftItem);
    },

    // pos1的comboid
    pos1Comboid: '',

    // pos2的comboid
    pos2Comboid: '',

    // 连击对象
    comboObj1: null,
    comboObj2: null,

    // 礼物位置数
    giftQueueNum: 0,

    // 初始化队列
    initQueue: (giftMapObj) => {
        let timer = null;
        //礼物消息队列
        let giftLit = queue.queue(function (task, callback) {
            let extPos1Dom = document.querySelector('.ext-pos1');
            let extPos2Dom = document.querySelector('.ext-pos2');

            main.giftQueueNum++;
            if(main.giftQueueNum <= 2) {
                if(extPos1Dom) {
                    // 创建礼物dom,并指定显示位置
                    main.create(task, 2);
                    let extPos2Dom = document.querySelector('.ext-pos2');
                    let aniDom = extPos2Dom.querySelector('.live-gift__giftNum'),
                        comboImgDom = aniDom.children[1],
                        originalDom = aniDom.children[2];

                    // 礼物图片动画
                    // sprite(extPos2Dom.querySelector('.live-gift__giftImg'), giftMapObj[task.propId].sequenceIcon, giftMapObj[task.propId].sequenceInterval);
                    let giftImgDom = extPos2Dom.querySelector('.live-gift__giftImg');
                    sprite(giftImgDom, giftMapObj[task.propId].spriteIcon, 100);
                    giftImgDom.dataset.status = 'play';

                    main.comboObj2 = new combo({
                        endNum: task.giftNum,
                        aniDom: aniDom,
                        comboImgDom: comboImgDom,
                        numDom: originalDom,
                        cb: function(aniDom) {
                            extPos2Dom.classList.add('is-hide');

                            //重置
                            main.comboObj2 = null;
                            main.pos2Comboid = '';

                            setTimeout(() => {
                                componentGift.removeChild(extPos2Dom);
                                callback(task);
                            }, 500);
                        }
                    })
                } else {
                    // 创建礼物dom,并指定显示位置
                    main.create(task, 1);

                    let extPos1Dom = document.querySelector('.ext-pos1');
                    let aniDom = extPos1Dom.querySelector('.live-gift__giftNum'),
                        comboImgDom = aniDom.children[1],
                        originalDom = aniDom.children[2];

                    // 礼物图片动画
                    // sprite(extPos1Dom.querySelector('.live-gift__giftImg'), giftMapObj[task.propId].sequenceIcon, giftMapObj[task.propId].sequenceInterval);
                    let giftImgDom = extPos1Dom.querySelector('.live-gift__giftImg');
                    sprite(giftImgDom, giftMapObj[task.propId].spriteIcon, 100);
                    giftImgDom.dataset.status = 'play';

                    main.comboObj1 = new combo({
                        endNum: task.giftNum,
                        aniDom: aniDom,
                        comboImgDom: comboImgDom,
                        numDom: originalDom,
                        cb: function(aniDom) {
                            extPos1Dom.classList.add('is-hide');

                            //重置
                            main.comboObj1 = null;
                            main.pos1Comboid = '';

                            setTimeout(() => {
                                componentGift.removeChild(extPos1Dom);
                                callback(task);
                            }, 500);
                        }
                    })
                }
            } else {
                // 超出队列显示，队列暂停
                giftLit.pause();
            }
        }, 2);

        return giftLit;
    },

    // 加入队列
    addQueue: (data, giftMapObj, giftLitle, isLast) => {
        let {nick, headerUrl, propId, propCount, expand} = data.data;
        let giftItemObj = {
            "propId": propId,
            "nick":nick,
            "headerUrl": headerUrl,
            "giftNum": propCount,
            "giftName": giftMapObj[propId].name,
            "giftImg": giftMapObj[propId].staticIcon,
            "comboId": expand.comboId
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
    giftHandle: (data, giftMapObj, giftLit, callback) => {
        if(giftMapObj[data.propId]) {
            let svga = giftMapObj[data.propId].svga;
            if(!svga) {
                let comboId = data.expand.comboId;
                if(comboId == main.pos1Comboid) {
                    main.comboObj1.update(data.propCount);
                } else if(comboId == main.pos2Comboid) {
                    main.comboObj2.update(data.propCount);
                } else {
                    callback(data, giftMapObj, giftLit);
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
        if (componentGift.matches('.camera-pc ~ [data-component="gift"]')) {
            // HACK: camera pc mode
            const videoHeight = document.querySelector('[data-component="player"]').dataset.videoHeight;
            componentGift.style['top'] = `${ videoHeight }px`;
            componentGift.style['bottom'] = `0`;
            componentGift.style['transform'] = componentGift.style['-webkit-transform'] = `translateY(-100%)`;
            // HACK: image padding
            componentGift.style['margin-top'] = `-10px`;
        }

        let giftLit = main.initQueue(giftMapObj);

        socket.ioSocket.on(socket.socketName, (data) => {
            main.giftHandle(data.data, giftMapObj, giftLit, function() {
                onSendGift({
                    uid: data.data.uid,
                    nickname: data.data.nick,
                    name: giftMapObj[data.data.propId].name,
                });
                main.addQueue(data, giftMapObj, giftLit, true);
            })
        });

        // 礼物面板送礼优先显示
        this.unShiftQueue = (data) => {
            main.giftHandle(data, giftMapObj, giftLit, function() {
                main.addQueue(data, giftMapObj, giftLit, false);
            })
        };
    },
    destroy () {
        componentGift.style['display'] = 'none';
	},
    onSendGift ( callback ) {
        onSendGift = callback;
    },
}
