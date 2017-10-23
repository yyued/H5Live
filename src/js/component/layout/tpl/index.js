/**
 * @file UI布局
 */

let renderTpl = (data)=>{
    let tpl = `
<div class="live-topBar" data-component="topBar"></div>
<div class="live-content" data-role="liveContent">
    <div class="live-player" data-component="player"></div>
    <div class="live-header" data-component="header"></div>
    <div class="live-danmaku" data-component="danmaku"></div>
    <div class="live-gift" data-component="gift"></div>
    <div class="live-message" data-component="message"></div>
    <div class="live-SVGAPlayer" data-component="SVGAPlayer"></div>
</div>
<div class="live-loading" data-component="loading"></div>
<div class="live-downloadTips" data-component="downloadTips"></div>
    `;
    return tpl;
}

export default renderTpl;
