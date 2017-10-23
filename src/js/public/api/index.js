/**
 * @file API接口
 *
 */

let jsonpPromise = (url) => {
    return new Promise(( resolve, reject ) => {
        window.util.jsonp({
            url: url,
            success: resolve,
            error: reject,
        });
    }).catch((err) => {
        console.log(err);
        throw err;
    });
}

let socketPromise = (key, socketName) => {
    let ioUrl = 'ws://legox.org:5353';
    let ioSocket = io.connect(ioUrl);
    return new Promise(( resolve ) => {
        let ioSocket = io.connect(ioUrl);
        ioSocket.emit(socketName,{ key: key, time: 5000 });
        resolve({
            ioSocket,
            socketName,
        });
    });
};

window.RequqestApi = {

    // 获取直播间基础信息
    getLiveData(){
        return jsonpPromise('https://legox.org/mock/e7507320-b270-11e7-ba75-c111f832c2e3');
    },

    // 获取视频推荐列表
    getRecommendList(){
        return jsonpPromise('https://legox.org/mock/7d57faa0-b3c0-11e7-ba75-c111f832c2e3');
    },

    // 获取直播状态
    getLiveStatus(){
        return jsonpPromise('https://legox.org/mock/fbec5f60-b3c9-11e7-ba75-c111f832c2e3');
    },

    // 获取礼物映射
    getGiftMap() {
        return jsonpPromise('https://legox.org/mock/10e15760-b53f-11e7-ba75-c111f832c2e3');
    },

    // 获取登录用户信息（预留）
    getUserInfo(){
        return jsonpPromise('http://uedfe.yypm.com/mock/api/344');
    },

    // 获取小礼物
    getGiftLit() {
        return socketPromise('52741350-b541-11e7-ba75-c111f832c2e3', 'mock');
    },

    // 获取大礼物
    getGiftLarge() {
        return socketPromise('a11dce30-b56c-11e7-ba75-c111f832c2e3', 'mock');
    },

    // 获取弹幕
    getDanmaku() {
        return socketPromise('64af4540-b4c3-11e7-ba75-c111f832c2e3', 'mock');
    },

    // 获取公屏
    getMessage() {
        return socketPromise('4a2691b0-b4c8-11e7-ba75-c111f832c2e3', 'mock');
    },

}
