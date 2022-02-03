import jsQR from "jsqr";
// inject the content script to the current tab
function go_shooting() {
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
    browser.tabs.captureVisibleTab().then((capturing) => {
        // console.log(data);
        //> resize image
        let img_elm = document.createElement("img");
        img_elm.src = capturing;
        img_elm.onload = function() {
            let resize_canvas = document.createElement("canvas");
            // resize_canvas.width = img_elm.width;
            // resize_canvas.height = img_elm.height;
            resize_canvas.width = data.window_width;
            resize_canvas.height = data.window_height;
            let resize_ctx = resize_canvas.getContext("2d");
            resize_ctx.drawImage(img_elm, 0, 0, data.window_width, data.window_height);
            console.log([data.window_width, img_elm.width, data.window_height, img_elm.height]);
            // resize_ctx.scale(data.window_width / img_elm.width, data.window_height / img_elm.height);
            let resized_imgurl = resize_canvas.toDataURL();

            //> clip image
            let capturing_img = document.createElement("img");
            capturing_img.src = resized_imgurl;
            let clip_canvas = document.createElement('canvas');
            let clip_ctx = clip_canvas.getContext('2d');
            clip_canvas.width = data.cv_width;
            clip_canvas.height = data.cv_height;

            capturing_img.onload = function() {
                clip_ctx.drawImage(capturing_img, data.offset_x, data.offset_y, data.cv_width, data.cv_height, 0, 0, data.cv_width, data.cv_height);

                //> decode QRcode
                let imgdata = clip_ctx.getImageData(0, 0, data.cv_width, data.cv_height);
                let decoded = jsQR(imgdata.data, imgdata.width, imgdata.height);
                console.log(decoded);

                let gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
                gettingActiveTab.then((tabs) => {
                    browser.tabs.sendMessage(tabs[0].id, { msg_type: "decode_result", data: decoded });
                    // browser.tabs.sendMessage(tabs[0].id, [clip_canvas.toDataURL(), resized_imgurl]);
                });
            }
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