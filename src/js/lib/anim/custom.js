/**
 * @desc 把点赞源码打包成一个js 可以提供给其他团队快速使用
 * @version 订制版 开发者自定义点赞图片
 * @author lixinliang
 * @doc 使用文档等待补充
 */

import Anim from 'anim';
import Like from 'anim.like';

// 把点赞引擎添加 animjs 上
Anim.setup('like', Like);
// 创建实例
let anim = new Anim('like');
// 设置尺寸
anim.width(60).height(280);
// 设置资源
let base64 = {
    user01 : require('../../../assets/like/heart/user/like01.png'),
    user02 : require('../../../assets/like/heart/user/like02.png'),
    user03 : require('../../../assets/like/heart/user/like03.png'),
    audience01 : require('../../../assets/like/heart/audience/like01.png'),
    audience02 : require('../../../assets/like/heart/audience/like02.png'),
    audience03 : require('../../../assets/like/heart/audience/like03.png'),
    audience04 : require('../../../assets/like/heart/audience/like04.png'),
    audience05 : require('../../../assets/like/heart/audience/like05.png'),
    audience06 : require('../../../assets/like/heart/audience/like06.png'),
    audience07 : require('../../../assets/like/heart/audience/like07.png'),
};
// 设置资源集合 与 映射分组
anim.mainfest(mainfest()).group(mainfest.group);

export default anim;

function mainfest () {
    let result = {};
    let user = append.call(result, 'user', 3);
    let audience = append.call(result, 'audience', 7);
    // let user = result::append('user', 3);
    // let audience = result::append('audience', 7);
    // let user = mainfest::append('user', 6);
    // let audience = user;
    mainfest.group = { user, audience };
    return result;
}

function append ( directory, length ) {
    const baseImageUrl = './assets/like/heart/';
    // const baseImageUrl = './assets/like/luhan/';
    const defaultFileName = 'like';
    const defaultFileType = 'png';
    return Array.apply(null, { length }).map((value, index) => fixed(index + 1 + '')).map((id) => {
        let key = directory + id;
        //  this[key] = [baseImageUrl, directory, '/', defaultFileName, id, '.', defaultFileType].join('');
        this[key] = base64[key];
        return key;
    });
}

function fixed ( value ) {
    return value.length == 1 ? '0' + value : value;
}

export default anim;
