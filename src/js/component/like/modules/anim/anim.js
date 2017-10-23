/**
 * @component animjs 包含以下功能：点赞图片预加载、点赞图片分组、定义点赞的canvas样式
 * @author lixinliang
 */

import Ticker from './modules/ticker.js';

const DPR = window.devicePixelRatio || 1;

let closure = {};
let storage = [];

// animjs 不涉及动画的实现 调用show方法时 把图片集合交给 动画引擎处理
class Anim {

    /**
     * new的时候决定该实例使用那种动画引擎
     * @type {String} name 动画引擎
     */
    constructor ( name = '' ) {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        this.canvas = canvas;
        this.context = context;
        this.id = storage.length;
        this.name = name;
        let imageSet = {};
        let imageMap = {};
        storage.push({ imageSet, imageMap });
        let ticker = new Ticker();
        ticker.on(() => {
            context.clearRect(0, 0, canvas.width, canvas.height);
        });
        this.ticker = ticker;
        this.dpr = DPR;
        if (DPR > 1) {
            this.canvas.style['transform'] = this.canvas.style['-webkit-transform'] = `scale(${ 1/DPR })`;
        }
    }

    /**
     * 传入一组图片集合 进行预加载
     * @param  {Object} imageSet 资源集合 { 图片id : 图片url }
     * @return {Anim} this anim
     */
    mainfest ( imageSet ) {
        let mySet = storage[this.id].imageSet;
        for (let key in imageSet) {
            let value = imageSet[key];
            let image = {
                url : value,
                status : false
            };
            image.img = loadImage(image.url, () => {
                image.status = true;
            });
            mySet[key] = image;
        }
        return this
    }

    /**
     * 传入图片分组的映射关系
     * @param  {Object} imageMap 资源分组映射 { 分组id : [图片id,...] }
     * @return {Anim} this anim
     */
    group ( imageMap ) {
        let myMap = storage[this.id].imageMap;
        for (let key in imageMap) {
            myMap[key] = imageMap[key].slice();
        }
        return this
    }

    /**
     * 随机播放动画
     * @param  {String} groupName 资源分组名
     * @return {Anim} this anim
     */
    show ( groupName ) {
        let { imageSet, imageMap } = storage[this.id];
        let images = [];
        imageMap[groupName].forEach((imageName) => {
            let image = imageSet[imageName];
            if (image.status) {
                images.push(image.img);
            }
        });
        if (this.name) {
            return new closure[this.name](this, images);
        }
        return this
    }

    /**
     * 设置宽度
     * @param  {Number} canvasWidth 画布宽度
     * @return {Anim} this anim
     */
    width ( canvasWidth ) {
        let result = correct(canvasWidth);
        if (result) {
            let { num, str } = result;
            this.canvas.width = num;
            this.canvas.style.width = str;
        }
        return this
    }

    /**
     * 设置高度
     * @param  {Number} canvasHeight 画布高度
     * @return {Anim} this anim
     */
    height ( canvasHeight ) {

        let result = correct(canvasHeight);
        if (result) {
            let { num, str } = result;
            this.canvas.height = num;
            this.canvas.style.height = str;
        }

        return this
    }
}

export default Anim;

/**
 * 加载图片
 * @param  {String} url 图片地址
 * @param  {Function} cb 加载回调
 * @return {HTMLImageElement} img 图片标签
 */
function loadImage ( url, cb ) {
    let img = new Image;
    img.onload = cb;
    img.src = url;
    return img;
};

/**
 * 对canvas的宽高修正 在hidpi屏上 尺寸需要加倍
 * @param  {Number} value 尺寸
 * @return {Number} value 尺寸
 */
function correct ( value ) {
    value *= DPR;
    let num;
    let str;
    if (typeof value == 'number') {
        num = value;
        str = value + 'px';
    } else if (typeof value == 'string') {
        str = value;
        num = parseInt(value);
    }
    if (num && str) {
        return { num, str }
    } else {
        return null
    }
};

/**
 * 定义动画引擎
 * @param  {String} name 动画引擎名
 * @param  {Class} plugin 动画引擎
 */
Anim.setup = function ( name, plugin ) {
    closure[name] = plugin;
};
