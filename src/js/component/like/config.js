/**
 * @file 点赞配置
 */

let config = {
    // 点赞图片基础路径
    likeImageBaseUrl: '',

    // 点赞区域宽度
    wrapperWidth: 60,

    // 点赞区域高度
    wrapperHeight: 280,

    // 点赞显示的图片
    likeImg: {
        user01     : '/assets/img/like/heart/user/like01.png',
        user02     : '/assets/img/like/heart/user/like02.png',
        user03     : '/assets/img/like/heart/user/like03.png',
        audience01 : '/assets/img/like/heart/audience/like01.png',
        audience02 : '/assets/img/like/heart/audience/like02.png',
        audience03 : '/assets/img/like/heart/audience/like03.png',
        audience04 : '/assets/img/like/heart/audience/like04.png',
        audience05 : '/assets/img/like/heart/audience/like05.png',
        audience06 : '/assets/img/like/heart/audience/like06.png',
        audience07 : '/assets/img/like/heart/audience/like07.png',
    },

    // 自动显示点赞的图片数量
    likeImgUserNum: 3,

    // 用户点击显示点赞的图片数量
    likeImgAudienceNum: 7,
}

export default config;
