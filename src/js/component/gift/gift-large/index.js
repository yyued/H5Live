/**
 * @component 大礼物播放器
 * @author lixinliang
 */

import Event from '../../../lib/event/index.js';
import style from'./style/index.scss';

const urlSVGA = '/assets/js/svga/svga.min.js';
const urlSVGADB = '/assets/js/svga/svga-db.min.js';

const componentSVGAPlayer = document.querySelector('[data-component="SVGAPlayer"]');

const giftLargeEvent = new Event;

let cache = {};
let giftFromWeb = [];
let giftFromUser = [];
let readyToPlay = Promise.resolve();

let onSendGift = function () {};

let loadSVGA;

export default {
    init ( giftSocket, giftMapObj ) {
        loadSVGA = Promise.all([
            new Promise(( resolve ) => {
                let script = document.createElement('script');
                script.src = urlSVGA;
                script.onload = () => {
                    document.head.removeChild(script);
                    resolve();
                };
                document.head.appendChild(script);
            }),
            new Promise(( resolve ) => {
                let script = document.createElement('script');
                script.src = urlSVGADB;
                script.onload = () => {
                    document.head.removeChild(script);
                    resolve();
                };
                document.head.appendChild(script);
            }),
        ]);
        return new Promise(( resolve ) => {
            componentSVGAPlayer.innerHTML = `<style>${ style }</style>`;
            this.send = ( svga ) => {
                giftFromUser.push(svga);
                // console.log('push');
                readyToPlay = readyToPlay.then(play);
            };
            // TODO: dev
            giftSocket.ioSocket.on(giftSocket.socketName, ( responese ) => {
                let data = responese.data;
                let svga = giftMapObj[data.propId].svga;
                if (svga) {
                    giftFromWeb.push(svga);
                    readyToPlay = readyToPlay.then(play);
                    onSendGift({
                        uid: '',
                        nickname: data.nick,
                        name: giftMapObj[data.propId].name,
                    });
                }
            });
            // TODO: dev
            this.on = giftLargeEvent.on.bind(giftLargeEvent);
            resolve();
        }).catch((err) => console.log(err));
    },
    onSendGift ( callback ) {
        onSendGift = callback;
    },
    setPosition () {
        let offsetTop = componentSVGAPlayer.offsetTop;
        let style = componentSVGAPlayer.style;
        style['transform'] = style['-webkit-transform'] = `translateY(${ -offsetTop/2 }px)`;
    },
    destroy () {
		return new Promise(( resolve ) => {
            componentSVGAPlayer.style.display = 'none';
            resolve();
        }).catch((err) => console.log(err));
	},
};

function play () {
    return new Promise(( resolve ) => {
        let url = giftFromUser.shift() || giftFromWeb.shift();
        if (url) {
            getSVGA(url).then(playSVGA).then(resolve);
        } else {
            resolve();
        }
    }).catch((err) => console.log(err));
}

function getSVGA ( url ) {
    return new Promise(( resolve ) => {
        loadSVGA.then(() => {
            if (cache[url]) {
                resolve(cache[url]);
            } else {
                let a = document.createElement('a');
                a.href = url;
                let canvas = document.createElement('canvas');
                canvas.id = `svga-player__${ Object.keys(cache).length }`;
                canvas.width = canvas.height = 500;
                componentSVGAPlayer.appendChild(canvas);
                let player = cache[url] = new Svga({
                    worker : 'assets/js/svga/svga-worker.min.js',
                    canvas : `#${ canvas.id }`,
                    assets : a.href,
                    playCount : 1,
                    autoPlay : false,
                    loop : false,
                }, () => {
                    player.canvas = canvas;
                    componentSVGAPlayer.removeChild(canvas);
                    canvas.classList.add('is-active');
                    resolve(player);
                });
            }
        });
    }).catch((err) => console.log(err));
}

function playSVGA ( player ) {
    return new Promise(( resolve ) => {
        componentSVGAPlayer.appendChild(player.canvas);
        player.complete = () => {
            componentSVGAPlayer.removeChild(player.canvas);
            resolve();
        };
        player.play();
    }).catch((err) => console.log(err));
}
