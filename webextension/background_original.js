import jsQR from "jsqr";
// inject the content script to the current tab
function go_shooting() {
    browser.tabs.executeScript({ file: "/content_scripts/utility.js" });
    browser.tabs.executeScript({ file: "/content_scripts/selection_highlight.js" });
    browser.tabs.executeScript({ file: "/content_scripts/ui_event_handler.js" });
    browser.tabs.executeScript({ file: "/content_scripts/message_handler.js" });
    browser.tabs.executeScript({ file: "/content_scripts/start.js" });
    browser.tabs.insertCSS({ file: "/content_scripts/start.css" });
}

function msg_handler(msg) {
    if (msg.msg_type == "qrcode_decode") {
        handle_capture(msg.data);
    } else if (msg.msg_type == "url_go") {
        url_go(msg.data);
    } else if (msg.msg_type == "url_newtab") {
        url_newtab(msg.data);
    }
}

function handle_capture(data) {
    browser.tabs.captureVisibleTab({ rect: data }).then((capturing) => {
        // console.log(data);
        //> draw img on canvas
        let img_elm = document.createElement("img");
        img_elm.src = capturing;
        img_elm.onload = function() {
            let shot_canvas = document.createElement("canvas");
            shot_canvas.width = data.width;
            shot_canvas.height = data.height;
            let shot_ctx = shot_canvas.getContext("2d");
            shot_ctx.drawImage(img_elm, 0, 0, data.width, data.height);
            // console.log([data.window_width, img_elm.width, data.window_height, img_elm.height]);

            //> decode QRcode
            let imgdata = shot_ctx.getImageData(0, 0, data.width, data.height);
            let decoded = jsQR(imgdata.data, imgdata.width, imgdata.height);
            // console.log(decoded);

            let gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
            gettingActiveTab.then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, { msg_type: "decode_result", data: decoded });
                // browser.tabs.sendMessage(tabs[0].id, [clip_canvas.toDataURL(), resized_imgurl]);
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
            browser.tabs.sendMessage(tabs[0].id, { msg_type: "error_report", data: err });
        });
    });
}

function url_newtab(url) {
    browser.tabs.create({ url: url }).then(() => {
        console.log("new tab with new url:" + url);
    }, (err) => {
        let gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
        gettingActiveTab.then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, { msg_type: "error_report", data: err });
        });
    });
}

browser.runtime.onMessage.addListener(msg_handler);
browser.browserAction.onClicked.addListener(go_shooting);