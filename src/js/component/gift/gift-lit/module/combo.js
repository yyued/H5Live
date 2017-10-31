/**
 * @component 礼物连击
 * @author wilson
 */

import config from '../config.js'; // 连击参数配置

let levelMap = config.levelMap; // 礼物连击图片映射数据


let combo = function(option) {
    this.curNum      = 0;
    this.endNum      = option.endNum;
    this.aniDom      = option.aniDom;
    this.comboImgDom = option.comboImgDom;
    this.numDom      = option.numDom;
    this.cb          = option.cb;

    this.hasCritModel = false; // 是否启动了暴击模式
    this.start();
}

combo.prototype = {
    start() {
        this.countUp();
    },

    // 查询连击图片更换
    changeComboImg(curNum) {
        let levelMapLen = levelMap.length;
        for(let i = 0;i < levelMapLen;i++) {
            if(curNum == levelMap[i].levelNum) {
                return i;
            } else if(curNum > levelMap[i].levelNum) {
                if((i + 1) < levelMapLen && curNum < levelMap[i + 1].levelNum) {
                    return i;
                } else if((i + 1) == levelMapLen) {
                    return i;
                }
            }
        }

        return (levelMapLen - 1);
    },

    // 计数
    countUp() {
        if(this.curNum < this.endNum) { // 累加

            this.remainNum = this.endNum - this.curNum;
            if(this.remainNum > 10) {
                this.curNum += 10;
                this.hasCritModel = true;
            } else {
                if(this.hasCritModel) {
                    this.curNum += this.remainNum;
                } else {
                    this.curNum++;
                }
            }
            this.numDom.textContent = this.curNum;
            setTimeout(() => {
                this.aniDom.classList.add('is-ani');
                if(this.aniDom.classList.contains('is-ani')) {
                    // 判断是否需要更换连击图片
                    let level = this.changeComboImg(this.curNum);
                    this.comboImgDom.style.backgroundImage = `url(${levelMap[level].levelImg})`;
                }
            }, 0);

            setTimeout(() => {
                this.aniDom.classList.remove('is-ani');
                this.comboImgDom.style.backgroundImage = '';
                setTimeout(() => {
                    this.countUp();
                }, 100)
            }, 250)
        } else { // 连击结束
            let checkTimer = setInterval(() => {
                if(this.curNum < this.endNum) {
                    this.countUp();
                    clearTimeout(overTimer);
                    clearInterval(checkTimer);
                }
            }, 200);

            let overTimer = setTimeout(() => {
                this.cb(this.aniDom);
                clearInterval(checkTimer);
            }, config.duration);
        }
    },

    // 更新
    update(offsetNum) {
        this.endNum += offsetNum;
    }
}

export default combo;
