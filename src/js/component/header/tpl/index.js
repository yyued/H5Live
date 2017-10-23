/**
 * @file header主播信息
 */

let renderTpl = (data)=>{
    let tpl = `
    <div class="live-hostInfo">
        <div class="live-hostInfo__avatar" style="background-image:url(${data.anchorAvatar})" ></div>
        <div class="live-hostInfo__cnt">
            <p class="live-hostInfo__nick">${data.anchorNick}</p>
            <p class="live-hostInfo__online">${data.users}人</p>
        </div>
        <div class="live-hostInfo__follow" data-role="follow" data-verify>关注</div>
    </div>
    <div class="live-uid" data-role="open-share">主播ID: ${data.anchorId}</div>
    `;
    return tpl;
}

export default renderTpl;



