/**
 * @file top-bar
 */

let renderTpl = (data)=>{
    let tpl = `
<p class="live-topBar__cnt">下载ME立即与TA</p>
<p class="live-topBar__cnt">零距离实时互动</p>
<div class="live-topBar__btn" data-role="download-app" data-action="app-call"></div>
    `;
    return tpl;
}

export default renderTpl;

