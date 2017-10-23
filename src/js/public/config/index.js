/**
 * @description 全局配置
 * @author wuweishuan
 */

window.CONFIG = {

    type: 'mobile', //终端类型 mobile||pc

    wrapSelector: 'body', //最外层的选择器

    // 组件引入
    components: {
        'message'        : true, //公屏消息
        'gift-danmaku'   : true, //弹幕礼物
        'gift-big'       : true, //大礼物
        'gift-little'    : true, //下礼物
        'like'           : true, //点赞
        'top-bar'        : true, //顶部条
        'download-tips'  : true, //下载提示
        'recommend-list' : true, //视频推荐列表
    },

    // 功能启用
    function: {
        'send-message' : false, //发送公屏消息
        'send-gift'    : false, //发送礼物
        'use-svga'     : true, //大礼物动画使用SVGA
    },
};
