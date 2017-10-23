export default class Event {
    constructor() {
        this.handlers = {};
    }
    on ( type, handler ) {
        let handlers = this.handlers;
        if (handlers[type]) {
            handlers[type].push(handler);
        } else {
            handlers[type] = [handler];
        }
        return this;
    }
    trigger ( type, callback ) {
        let handlers = this.handlers;
        if (handlers[type] instanceof Array) {
            handlers[type].forEach(( handler ) => {
                callback(handler);
            });
        }
    }
}
