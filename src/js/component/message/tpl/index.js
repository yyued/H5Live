let renderTpl = (data)=>{
    let tpl = `
        <div class="live-message__screen">
            <div class="live-message__list"></div>
        </div>
        <div class="live-message__action">
            <span data-role="open-chat-bar" class="live-message__icon is-chat"></span>
            <span data-role="open-download-tips" class="live-message__icon is-share"></span>
            <span data-role="open-connect-mic" class="live-message__icon is-live"></span>
            <span data-role="open-gift-panel" data-verify class="live-message__icon is-gift"></span>
        </div>
        <div class="live-message__tips">有新消息<i></i></div>
    `;
    return tpl;
}

export default renderTpl;
