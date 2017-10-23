/**
 * @file 直播中UI
 */

let renderTpl = (data)=>{
    let tpl = `
    <style>
        .live-player.has-poster {
            background-image: url(${data.cover});
        }
    </style>
    <div id="player"></div>
    <div class="live-player__playBtn" data-role="play-video">播放</div>
    `;
    return tpl;
}

export default renderTpl;




