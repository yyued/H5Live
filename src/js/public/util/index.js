/**
 * @file util
 *
 */

import jsonp from '../../lib/jsonp/index.js';
import delegate from './delegate-event.js';
import sleep from './sleep.js';
import scrollTo from './scroll-to.js';
import sprite from './sprite.js';
import getUrlParam from './get-url-param.js';
import isAndroid from './detect-android.js';
import preloadScript from './preload-script.js';

window.util = {
    jsonp,
    delegate,
    sleep,
    scrollTo,
    sprite,
    getUrlParam,
    isAndroid,
    preloadScript,
}
