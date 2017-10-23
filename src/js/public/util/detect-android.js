/**
 * 检测当前环境是否为Android
 *
 * @return {boolean} true|false
 */


function isAndroid() {
    let userAgent = window.navigator.userAgent;
    return /Android/i.test(userAgent);
}

export default isAndroid

