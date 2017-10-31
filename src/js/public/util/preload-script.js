function preloadScript(url) {
    new Promise(( resolve ) => {
        let script = document.createElement('script');
        script.src = url;
        script.onload = () => {
            document.head.removeChild(script);
            resolve();
        };
        document.head.appendChild(script);
    });
}

export default preloadScript;
