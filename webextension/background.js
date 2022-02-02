// import jsQR from "jsqr";
// console.warn("ooo");
// inject the content script to the current tab
function go_shooting() {
    browser.tabs.executeScript({ file: "/content_scripts/start.js" });
    browser.tabs.insertCSS({ file: "/content_scripts/start.css" });
}

function handle_capture(data = []) {
    browser.tabs.captureVisibleTab().then((capturing) => {
        // console.log(data);
        let capturing_img = document.createElement("img");
        capturing_img.src = capturing;
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = data[1][0];
        canvas.height = data[1][1];

        capturing_img.onload = function() {
            ctx.drawImage(capturing_img, data[0][0], data[0][1], data[1][0], data[1][1], 0, 0, data[1][0], data[1][1]);
            let gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
            gettingActiveTab.then((tabs) => {
                // console.log(tabs[0].id);
                browser.tabs.sendMessage(tabs[0].id, canvas.toDataURL());
            });
        }

        // let selected_img = canvas.toBlob();
        // console.log(canvas.toDataURL());
        // capturing_img.src = canvas.toDataURL();

    }, (e) => { console.log("error: " + e); });


    // return canvas;
}

browser.runtime.onMessage.addListener(handle_capture);
browser.browserAction.onClicked.addListener(go_shooting);