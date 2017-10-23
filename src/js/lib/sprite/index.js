// 从时序图尺寸 动态生成动画函数

let record = {};

export default function ( elem, src, duration ) {
    return new Promise(( resolve ) => {
        let img = new Image;
        img.onload = onload;
        img.src = src;
        elem.dataset.status = 'pause';
        function onload () {
            let frame;
            let direction;
            if (this.width > this.height) {
                direction = 'x';
                frame = Math.round(this.width / this.height);
                // elem.style['background-size'] = `auto ${ getComputedStyle(elem).width }`;
                elem.style['background-size'] = `auto 100%`;
            } else {
                direction = 'y';
                frame = Math.round(this.height / this.width);
                // elem.style['background-size'] = `${ getComputedStyle(elem).height } auto`;
                elem.style['background-size'] = `100% auto`;
            }
            elem.dataset.frame = frame;
            elem.dataset.direction = direction;
            elem.style['background-image'] = `url(${ src })`;
            let unique = direction + frame;
            if (!record[unique]) {
                record[unique] = true;
                let style = document.createElement('style');
                style.innerHTML = `
                [data-status="play"][data-frame="${ frame }"][data-direction="${ direction }"] {
                    animation-duration: ${ duration * frame }ms;
                    -webkit-animation-duration: ${ duration * frame }ms;
                    animation-name: spirit-animation-${ unique };
                    -webkit-animation-name: spirit-animation-${ unique };
                    animation-timing-function: steps(${ frame });
                    -webkit-animation-timing-function: steps(${ frame });
                    animation-iteration-count: infinite;
                    -webkit-animation-iteration-count: infinite;
                }
                @keyframes spirit-animation-${ unique } {
                    0% {
                        background-position: 0 0;
                    }
                    100% {
                        background-position: ${ direction == 'x' ? `-${ frame }00% 0` : `0 -${ frame }00%` };
                    }
                }
                @-webkit-keyframes spirit-animation-${ unique } {
                    0% {
                        background-position: 0 0;
                    }
                    100% {
                        background-position: ${ direction == 'x' ? `-${ frame }00% 0` : `0 -${ frame }00%` };
                    }
                }
                `;
                document.head.appendChild(style);
            }
            resolve();
        }
    });
};
