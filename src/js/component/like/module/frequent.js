let requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || ((fn) => setTimeout(fn, 16));

let frequent = (fn, delay) => {
    let counter = parseInt(delay / 16.7);
    requestAnimationFrame(function looper () {
        if (!--counter) {
            fn();
        } else {
            requestAnimationFrame(looper);
        }
    });
}
export default frequent;
