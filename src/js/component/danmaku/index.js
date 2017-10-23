/**
 * @component 弹幕模块
 * @author wilson
 */

import style from'./style/index.scss';
import createTpl from './tpl/index.js';

const danmakuElement = document.querySelector('[data-component="danmaku"]');
danmakuElement.innerHTML = `<style>${ style }</style>`;

let main = {
    // 记录插入的位置
    slotArr: [0, 0],

	// 选择下一条弹幕插入的位置
    chooseMinPos: (slotArr) => {
        let minNum = Math.min.apply(Math, slotArr);
        let minPos = slotArr.indexOf(minNum);
        if(minPos < 0) return 0;
        return minPos;
    },

    // 准备下一条弹幕
    followUp: (wrapDomTemp, minPos, danmaku) => {
        let slotArr = main.slotArr;
        let minPosTemp = slotArr[minPos];
        if (minPosTemp === 0) {
            return;
        }else if (minPosTemp < 0) {
            minPosTemp = 0
        } else if(minPosTemp === 1) {
            minPosTemp -= 1;
            if(danmaku.paused) {
                danmaku.resume();
            }
        }
        slotArr[minPos] = minPosTemp;
        main.slotArr = slotArr;
    },

    // 创建弹幕
    create: (data) => {
        let danmakuItem = document.createElement('div');
        danmakuItem.setAttribute('class', 'live-danmaku__item');
        const tpl = createTpl(data);
        danmakuItem.innerHTML = tpl;
        danmakuElement.appendChild(danmakuItem);
        return danmakuItem;
    },

    // 睡眠
    sleep: (delay) => {
        return new Promise(( resolve ) => {
            setTimeout(resolve, delay);
        });
    },

    // 初始化队列
    initQueue: () => {
        const speed = 96;
        let wrapDom = danmakuElement;
        let danmaku = queue.queue(function (task, callback) {
            let danmakuItem;
            let danmakuItemWidth;
            let danmakuItemHeight;
            let translateWidth;
            let durationTime;
            let slotArr = main.slotArr;
            let minPos = main.chooseMinPos(slotArr);
            if(slotArr[minPos] === 0) {
                slotArr[minPos] += 1;
                danmakuItem = main.create(task);
                danmakuItemWidth = danmakuItem.offsetWidth;
                danmakuItemHeight = danmakuItem.offsetHeight;
                translateWidth = document.body.clientWidth + danmakuItemWidth + 8;
                durationTime = (translateWidth / speed);
                let topPos = minPos * (danmakuItemHeight + 4);
                danmakuItem.style.top = `${topPos}px`;
                danmakuItem.style.webkitTransform = `translate(${-translateWidth}px, 0)`;
                danmakuItem.style.transform = `translate(${-translateWidth}px, 0)`;
                danmakuItem.style.webkitTransitionDuration = `${durationTime}s`;
                danmakuItem.style.transitionDuration = `${durationTime}s`;
            }

            main.slotArr = slotArr;
            main.sleep(Math.floor(durationTime * 1000 / 1.3)).then(() => {
                main.followUp(wrapDom, minPos, danmaku)
            })
            callback(danmakuItem, slotArr, durationTime);
        }, 2);

        return danmaku;
    },

    // 添加队列
    addQueue: (danmakuItemObj, danmaku, isLast) => {
        if(isLast) {
            // 插到队列尾部
            danmaku.push(danmakuItemObj, function (danmakuItem, slotArr, durationTime) {
                if(slotArr[0] == 1 && slotArr[1] == 1) {
                    if(!danmaku.paused) {
                        danmaku.pause();
                    }
                }

                main.sleep(Math.ceil(durationTime * 1000)).then(() => {
                    danmakuElement.removeChild(danmakuItem)
                });
            });
        } else {
            // 插到队列首部
            danmaku.unshift(danmakuItemObj, function (danmakuItem, slotArr, durationTime) {
                if(slotArr[0] == 1 && slotArr[1] == 1) {
                    if(!danmaku.paused) {
                        danmaku.pause();
                    }
                }

                main.sleep(Math.ceil(durationTime * 1000)).then(() => {
                    danmakuElement.removeChild(danmakuItem)
                });
            });
        }
    }
}

export default {
    init(socket) {
        let danmaku = main.initQueue();
        socket.ioSocket.on(socket.socketName, (data) => {
            let danmakuItemObj = {
                "nick": data.data.nick,
                "headerUrl": data.data.headerUrl,
                "userComm": data.data.userComm
            }
            main.addQueue(danmakuItemObj, danmaku, true);
        });

        // 用户发弹幕优先显示
        // this.unShiftQueue = (danmakuItemObj) => {
        //     main.addQueue(danmakuItemObj, danmaku, false);
        // }

        // 销毁弹幕
        this.destroy = () => {
            danmakuElement.style['display'] = 'none';
            danmaku.tasks.length = 0;
        }
    }
}
