module.exports = function spirit(dom, img, time) {
    let imgArr = img.split(','),
        imgArrLen = imgArr.length,
        imgIndex = 0,
        timer = null;

    timer = setInterval(() => {
        if(imgIndex >= imgArrLen) {
            imgIndex = 0;
        }
        dom.setAttribute('src', imgArr[imgIndex])
        imgIndex++;
    }, time * 1000);
}