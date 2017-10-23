/**
 * @desc 把点赞源码打包成一个js 可以提供给其他团队快速使用
 * @version 订制版 开发者自定义点赞图片
 * @author lixinliang
 */

import Anim from 'anim';
import Like from 'anim.like';
import config from '../../config.js';

// 把点赞引擎添加 animjs 上
Anim.setup('like', Like);
// 创建实例
let anim = new Anim('like');
// 设置尺寸
anim.width(60).height(280);

// 设置资源集合 与 映射分组
anim.mainfest(mainfest()).group(mainfest.group);

export default anim;

function mainfest () {
    let result = {};
    let user = append.call(result, 'user', config.likeImgUserNum);
    let audience = append.call(result, 'audience', config.likeImgAudienceNum);
    mainfest.group = { user, audience };
    return result;
}

function append ( directory, length ) {
    return Array.apply(null, { length }).map((value, index) => fixed(index + 1 + '')).map((id) => {
        let key = directory + id;
        this[key] = config.likeImg[key];
        return key;
    });
}

function fixed ( value ) {
    return value.length == 1 ? '0' + value : value;
}

export default anim;
