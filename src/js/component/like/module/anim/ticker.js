const TICK = 'tick';
const TICKER = new Event(TICK);

let elements = [];

let requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || ((fn) => setTimeout(fn, 16));

let looper = () => {
    elements.forEach((elem) => elem.dispatchEvent(TICKER));
    requestAnimationFrame(looper);
};

requestAnimationFrame(looper);

class Ticker {
    constructor () {
        this.elem = document.createElement('div');
        elements.push(this.elem);
    }
    on ( fn ) {
        this.elem.addEventListener(TICK, fn, false);
        return this
    }
    off ( fn ) {
        this.elem.removeEventListener(TICK, fn, false);
        return this
    }
}

export default Ticker;
