/**
 * @file 直播结束UI
 */

let renderTpl = (data)=>{
    let tpl = `
    <h2 class="live-player__status">直播已结束</h2>
    <p class="live-player__avatar" style="background-image:url(${data.anchorAvatar})"></p>
    <p class="live-player__nick">${data.anchorNick}</p>
    <p class="live-player__uid">ME号：${data.anchorId}</p>
    `;
    return tpl;
}

export default renderTpl;

