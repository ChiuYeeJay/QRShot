import jsQR from "jsqr";

var tab_ids = new Set();

// inject the content script to the current tab
function go_shooting() {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        if (tabs[0].id === undefined) return;

        if (!tab_ids.has(tabs[0].id)) {
            tab_ids.add(tabs[0].id);
            let a = browser.tabs.executeScript({ file: "/content_scripts/utility.js" });
            a = a.then(() => { return browser.tabs.executeScript({ file: "/content_scripts/selection_highlight.js" }) });
            a = a.then(() => { return browser.tabs.executeScript({ file: "/content_scripts/ui_event_handler.js" }) });
            a = a.then(() => { return browser.tabs.executeScript({ file: "/content_scripts/message_handler.js" }) });
            a.then(() => { return browser.tabs.executeScript({ file: "/content_scripts/start.js" }) });
        } else {
            browser.tabs.executeScript({ file: "/content_scripts/start.js" });
        }
    });
}

function msg_handler(msg) {
    if (msg.type == "qrcode_decode") {
        handle_capture(msg.data);
    } else if (msg.type == "url_go") {
        url_go(msg.data);
    } else if (msg.type == "url_newtab") {
        url_newtab(msg.data);
    }
}

function handle_capture(data) {
    browser.tabs.captureVisibleTab({ rect: data }).then((capturing) => {
        //> draw img on canvas
        let img_elm = document.createElement("img");
        img_elm.src = capturing;
        img_elm.onload = function() {
            let shot_canvas = document.createElement("canvas");
            shot_canvas.width = data.width;
            shot_canvas.height = data.height;
            let shot_ctx = shot_canvas.getContext("2d");
            shot_ctx.drawImage(img_elm, 0, 0, data.width, data.height);

            //> decode QRcode
            let imgdata = shot_ctx.getImageData(0, 0, data.width, data.height);
            let decoded = jsQR(imgdata.data, imgdata.width, imgdata.height);

            let gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
            gettingActiveTab.then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, { type: "decode_result", data: decoded });
                // browser.tabs.sendMessage(tabs[0].id, { type: "return_capture_img", data: capturing });
            });
        }
    }, (e) => { console.log("error: " + e); });
}

function url_go(url) {
    browser.tabs.update({ url: url }).then(() => {
        console.log("go to new url:" + url);
    }, (err) => {
        let gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
        gettingActiveTab.then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, { type: "error_report", data: err });
        });
    });
}

function url_newtab(url) {
    browser.tabs.create({ url: url }).then(() => {
        console.log("new tab with new url:" + url);
    }, (err) => {
        let gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
        gettingActiveTab.then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, { type: "error_report", data: err });
        });
    });
}

function handle_tab_status_changing(tabId, changeInfo, tab) {
    if (changeInfo.status == "loading" && tab_ids.has(tabId)) {
        tab_ids.delete(tabId);
    }
}

browser.tabs.onUpdated.addListener(handle_tab_status_changing, { properties: ["status"] });
browser.runtime.onMessage.addListener(msg_handler);
browser.browserAction.onClicked.addListener(go_shooting);