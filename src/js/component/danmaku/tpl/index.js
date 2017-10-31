let renderTpl = (data)=>{
    let tpl = `
        <img src="${data.avatar}" alt="${data.nick}" class="live-danmaku__avatar">
        <p class="live-danmaku__nick">${data.nick}</p>
        <p class="live-danmaku__content">${data.content}</p>
    `;
    return tpl;
}

export default renderTpl;
