/**
 * @component 大礼物播放器
 * @author lixinliang
 */

import Event from '../../../lib/event/index.js';
import style from'./style/index.scss';
import config from'./config.js';

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
            util.preloadScript(config.urlSVGA),
            // util.preloadScript(config.urlSVGADB),
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
                canvas.style.width = `400px`;
                canvas.style.height = `400px`;
                canvas.clearsAfterStop = true;
                componentSVGAPlayer.appendChild(canvas);

                var player = new SVGA.Player(`#${ canvas.id }`);
                var parser = new SVGA.Parser();
                player.loops = 1;
                parser.load(url, function(videoItem) {
                    player.canvas = canvas;
                    componentSVGAPlayer.removeChild(canvas);
                    canvas.classList.add('is-active');
                    resolve({
                        player,
                        videoItem,
                    });
                })
            }
        });
    }).catch((err) => console.log(err));
}

function playSVGA ( options ) {
    let {player, videoItem} = options;
    return new Promise(( resolve ) => {
        componentSVGAPlayer.appendChild(player.canvas);
        player.onFinished(() => {
            componentSVGAPlayer.removeChild(player.canvas);
            resolve();
        });
        player.setVideoItem(videoItem);
        player.startAnimation();
    }).catch((err) => console.log(err));
}
