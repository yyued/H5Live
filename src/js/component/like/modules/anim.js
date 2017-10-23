import Anim from 'anim'; // 创建一个canvas
import Like from 'anim.like'; // 点赞效果的逻辑代码

// 把点赞引擎添加 animjs 上
Anim.setup('like', Like);
// 创建点赞实例
let anim = new Anim('like');
// 设置尺寸
anim.width(60).height(280);
// 设置资源集合 与 映射分组
anim.mainfest(mainfest()).group(mainfest.group);

export default anim;

function mainfest () {
    let result = {};
    let user = append.call(result, 'user', 3);
    let audience = append.call(result, 'audience', 7);
    mainfest.group = { user, audience };
    return result;
}

function append ( directory, length ) {
    // 点赞资源地址
    const baseImageUrl = './assets/img/like/heart/';
    // const baseImageUrl = './assets/img/like/luhan/';
    const defaultFileName = 'like';
    const defaultFileType = 'png';
    return Array.apply(null, { length }).map((value, index) => fixed(index + 1 + '')).map((id) => {
        let key = directory + id;
        this[key] = [baseImageUrl, directory, '/', defaultFileName, id, '.', defaultFileType].join('');
        return key
    })
}

function fixed ( value ) {
    return value.length == 1 ? '0' + value : value;
}
