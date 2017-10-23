let renderTpl = (data)=>{
    let tpl = `
        <img src="${data.headerUrl}" alt="${data.nick}" class="live-danmaku__userImg">
        <p class="live-danmaku__userName">${data.nick}</p>
        <p class="live-danmaku__userComm">${data.userComm}</p>
    `;
    return tpl;
}

export default renderTpl;
