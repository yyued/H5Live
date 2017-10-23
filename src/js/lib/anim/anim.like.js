/**
 * @component anim.like 基于 animjs 的点赞动画引擎
 * @author lixinliang
 */

import {
    getRandomByMedian,
    getRandomBetweenInt,
    getRandomWithBinomial,
} from './modules/random.js';

// 点赞动画引擎
class Like {
    /**
     * 调用 new Like 创建一个赞的动画
     * @param  {Anim} anim Anim实例
     * @param  {Array} images 素材集合
     * @return {Like} like 点赞实例
     */
    constructor ( anim, images ) {
        // 从图片集合 随机抽取一张
        let image = images[getRandomBetweenInt(0, images.length - 1)];

        this.image = image;
        this.canvas = anim.canvas;

        let DPR = this.dpr = anim.dpr;

        let imageWidth = image.width;
        let imageHeight = image.height;

        // @return 当前动画进度 0 ~ 100
        let getImageTimeline = this.createImageTimeline();
        // @return 旋转后的图片 canvas
        let getImageData = this.createImageData();
        // @return 获取当前缩放曲线 number
        let getImageScaleSize = this.createImageScaleSize();
        // @return 获取当前透明度曲线 number
        let getImageOpacityValue = this.createImageOpacityValue();
        // @return 获取当前位移曲线 { x, y }
        let getImagePathPosition = this.createImagePathPosition();

        let handler = () => {
            let percentage = getImageTimeline();
            let { imageCanvas, imageContext } = getImageData();
            let scaleSize = getImageScaleSize(percentage);
            let globalAlpha = getImageOpacityValue(percentage);
            let { x, y } = getImagePathPosition(percentage);

            // 最后渲染的时候 再把 dpr 计算进去
            if (scaleSize == 1 && globalAlpha == 1) {
                anim.context.drawImage(imageCanvas, x * DPR, y * DPR, imageWidth * DPR, imageHeight * DPR);
            } else {
                if (globalAlpha == 1) {
                    let scaleWidth = imageWidth * scaleSize;
                    let deltaWidth = (imageWidth - scaleWidth) / 2;
                    let scaleHeight = imageHeight * scaleSize;
                    let deltaHeight = (imageHeight - scaleHeight) / 2;
                    anim.context.drawImage(imageCanvas, (x + deltaWidth) * DPR, (y + deltaHeight) * DPR, scaleWidth * DPR, scaleHeight * DPR);
                } else {
                    anim.context.globalAlpha = globalAlpha;
                    anim.context.drawImage(imageCanvas, x * DPR, y * DPR, imageWidth * DPR, imageHeight * DPR);
                    anim.context.globalAlpha = 1;
                }
            }
            if (percentage == 100) {
                getImageTimeline = null;
                getImageData = null;
                getImageScaleSize = null;
                getImageOpacityValue = null;
                getImagePathPosition = null;
                anim.ticker.off(handler);
            }
        };
        anim.ticker.on(handler);
    }

    /**
     * 创建每一个动画的独立时间线
     * @return {Function} getImageTimeline 获得该动画当前时间线的函数
     */
    createImageTimeline () {
        // 动画总时基数 3000ms 浮动系数 20%
        let originDuration = 3000;
        let range = 0.2;

        let duration = getRandomByMedian(originDuration, range);
        let times = Math.round(duration / 16.7);
        let now = 0;
        return () => {
            now++;
            let percentage = parseInt(now * 1000 / times) / 10;
            return percentage > 100 ? 100 : percentage
        }
    }

    /**
     * 创建每一个动画的独立形态
     * @return {Function} getImageData 获得该动画形态的对象的函数
     */
    createImageData () {
        // 图像旋转幅度 -30 ~ 30deg
        let minRotate = -30;
        let maxRotate = 30;
        // 缩放系数的二项分布 70 ~ 120 出现95的概率最高
        let minScale = 70;
        let maxScale = 120;
        // 缩放最大值为105 超出105的概率以105为对称轴 添加到 90 ~ 105 的区间
        let maxLimitScale = 105;

        let image = this.image;
        let { width, height } = image;
        let rotate = getRandomBetweenInt(minRotate, maxRotate);
        let scale = getRandomWithBinomial(minScale, maxScale);
        if (scale > maxLimitScale) {
            scale -= (maxScale - maxLimitScale);
        }
        scale = scale / 100;

        let imageCanvas = document.createElement('canvas');
        let imageContext = imageCanvas.getContext('2d');

        // 使用离屏canvas保存旋转后的图片并多次复用 为了避免旋转后图片被切割 画布的尺寸是图片的2倍
        imageCanvas.width = width * 2;
        imageCanvas.height = height * 2;

        imageContext.translate(width, height);
        imageContext.rotate(rotate * Math.PI / 180);
        imageContext.scale(scale, scale);
        imageContext.translate(-width, -height);

        imageContext.drawImage(image, width / 2, height / 2, width, height);

        return () => ({ imageCanvas, imageContext })
    }

    /**
     * 创建每一个动画的独立放大曲线
     * @return {Function} getImageScaleSize 获得该动画当前尺寸的函数
     */
    createImageScaleSize () {
        // 完成缩放动画的百分比阶段 9 ~ 11
        let minAppearStage = 9;
        let maxAppearStage = 11;

        let appearStage = getRandomBetweenInt(minAppearStage, maxAppearStage);
        return ( percentage ) => {
            return percentage >= appearStage ? 1 : ((parseInt(100 * percentage / appearStage) / 100) || 0.1)
        }
    }

    /**
     * 创建每一个动画的独立透明曲线
     * @return {Function} getImageOpacityValue 获得该动画当前透明度的函数
     */

    createImageOpacityValue () {
        // 开始淡出动画的百分比阶段 82 ~ 86
        let minDisappearStage = 82;
        let maxDisappearStage = 86;

        let disappearStage = getRandomBetweenInt(minDisappearStage, maxDisappearStage);
        let area = 100 - disappearStage;
        return ( percentage ) => {
            if (percentage < disappearStage) {
                return 1;
            } else {
                let opacity = ((percentage - disappearStage) / area).toFixed(2) - 0;
                return 1 - opacity;
            }
        }
    }

    /**
     * 创建每一个动画的独立位移曲线
     * @return {Function} getImagePathPosition 获得该动画当前位移值的函数
     */
    createImagePathPosition () {
        // 以下计算均以 dpr 为 1作为参考值
        // 动画初始位置的横向定位的浮动系数 10%
        let startX = 10;
        // 动画纵向位移距离delta y是总距离的 95% 浮动系数 5%
        let deltaY = 0.95;
        let deltaYRange = 1 - deltaY;
        // 动画横向位移距离符合正弦曲线 正弦波峰最小值10% 最大值15%
        let minCrest = 10;
        let maxCrest = 15;
        // 正弦波长系数 最小值16 最大值32
        let minWavelength = 16;
        let maxWavelength = 32;

        let DPR = this.dpr;
        // @2x 图片要先砍半
        let imageWidth = this.image.width / 2;
        let imageHeight = this.image.height / 2;
        // 画布尺寸根据dpr计算
        let canvasWidth = this.canvas.width / DPR;
        let canvasHeight = this.canvas.height / DPR;
        // console.log(imageWidth, imageHeight, canvasWidth, canvasHeight);
        let originX = canvasWidth * (0.5 + getRandomBetweenInt(-startX, startX) / 100);
        let originY = canvasHeight;
        // 初始值居中是画布总长度减去图片长度后的一半
        // 再减去旋转的偏移量 也是图片尺寸的一半
        // 刚好减去一倍的图片尺寸
        originX -= imageWidth;
        originY -= imageHeight;

        let translateX = canvasWidth * getRandomBetweenInt(minCrest, maxCrest) / 100;
        let translateY = getRandomByMedian(originY * deltaY, deltaYRange);

        let wavelength = getRandomBetweenInt(minWavelength, maxWavelength);

        // 方向是 -1/1
        let direction = getRandomBetweenInt(0, 1) * 2 - 1;

        return ( percentage ) => {
            let x = originX + translateX * Math.sin(percentage / wavelength) * direction;
            let y = originY - translateY * percentage / 100;
            return { x, y }
        }
    }
}

export default Like;
