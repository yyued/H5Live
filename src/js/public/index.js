import '../lib/es6-promise/index.js';
import '../lib/classlist-polyfill/index.js';
import io from '../lib/socket.io/index.js';
import fastclick from '../lib/fastclick/index.js';
import queue from '../lib/queue/index.js';
import delegate from '../lib/delegate/index.js';
import './util/index.js';
import './config/index.js';
import './api/index.js';

document.addEventListener("DOMContentLoaded", function(event) {
    fastclick.attach(document.body);
});
window.io       = window.io ? window.io : io;
window.queue    = window.queue ? window.queue : queue;
window.delegate = window.delegate ? window.delegate : delegate;
