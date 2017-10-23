function sleep(delay) {
    return new Promise(( resolve ) => {
        setTimeout(resolve, delay);
    });
}

export default sleep;
