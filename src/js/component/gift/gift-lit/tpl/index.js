let renderTpl = (data)=>{
    let tpl = `
        <img src="${data.headerUrl}" class="live-gift__userImg">
        <p class="live-gift__userName">${data.nick}</p>
        <p class="live-gift__giftName">送了<span>${data.giftName}</span></p>
        <div class="live-gift__giftImg"></div>
        <p class="live-gift__giftNum"><span>x</span><span></span><span></span></p>
    `;
    return tpl;
}

export default renderTpl;
