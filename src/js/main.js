import './public/index.js';
import './component/layout/index.js';
import player from './component/player/index.js';

import topBar from './component/top-bar/index.js';
import header from './component/header/index.js';
import recommendList from './component/recommend-list/index.js';

import danmaku from './component/danmaku/index.js';
import message from './component/message/index.js';
import giftLit from './component/gift/gift-lit/index.js';
import giftLarge from './component/gift/gift-large/index.js';

// 直播间基础信息准备就绪
RequqestApi.getLiveData().then((liveData)=>{

    player.init(liveData).then(()=>{

        // 弹幕初始化
        RequqestApi.getDanmaku().then(( socket ) => {
            danmaku.init(socket);
        });

        // 公屏初始化
        RequqestApi.getMessage().then((socket) => {
            message.init(socket);
        })

        // 请求礼物映射
        let giftMapReady = RequqestApi.getGiftMap();

        // 小礼物初始化
        Promise.all([RequqestApi.getGiftLit(), giftMapReady]).then(([ giftSocket, giftMapObj ]) => {
            giftLit.init(giftSocket, giftMapObj);
        });

        // 大礼物初始化
        Promise.all([RequqestApi.getGiftLarge(), giftMapReady]).then(([ giftSocket, giftMapObj ]) => {
            giftLarge.init(giftSocket, giftMapObj);
        });


        player.listenLiveStatus((status)=>{
            if (status) return;
            header.destroy();
            danmaku.destroy();
            message.destroy();
            giftLit.destroy();
            giftLarge.destroy();
            console.log('直播结束');
        });
    });

    (typeof topBar !== "undefined") && topBar.init();
    (typeof header !== "undefined") && header.init(liveData);
    (typeof recommendList !== "undefined") && recommendList.init();
})
