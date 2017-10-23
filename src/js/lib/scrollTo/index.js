export default function scrollTo ( direction, config ) {
    let { elem, speed = 20, interval = 16, transition = true } = config;
    return new Promise(( resolve ) => {
        if (transition) {
            let scrolling = true;
            let now = elem.scrollTop;
            let next = () => {
                let destination;
                if (direction == 'top') {
                    destination = 0;
                    now -= speed;
                    if (now < destination) {
                        now = destination;
                        scrolling = false;
                    }
                } else {
                    destination = elem.scrollHeight;
                    now += speed;
                    if (now > destination) {
                        now = destination;
                        scrolling = false;
                    }
                }
                elem.scrollTop = now;
                if (scrolling) {
                    setTimeout(next, interval);
                } else {
                    resolve();
                }
            };
            next();
        } else {
            if (direction == 'top') {
                elem.scrollTop = 0;
            } else {
                elem.scrollTop = elem.scrollHeight;
            }
            resolve();
        }
    });
}
