/**
 * @file 推荐列表
 */

let renderTpl = (list)=>{
    let tpl = `
    <div class="live-recommendList__head">大家都在看</div>
    <div class="live-recommendList__content">
    ${list.map(item =>
            `<div class="live-recommendList__item">
                <a href="${item.url}">
                    <div class="live-recommendList__img" data-src="${item.thumb}"></div>
                    <p class="live-recommendList__nick"><span class="live-recommendList__count">${item.users}人</span>${item.nick}</p>
                </a>
            </div>`
     ).join('')}
    </div>
    `;
    return tpl;
}

export default renderTpl;
