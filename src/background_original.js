import jsQR from "jsqr";
// inject the content script to the current tab
function go_shooting() {
    browser.tabs.executeScript({ file: "/content_scripts/start.js" });
    browser.tabs.insertCSS({ file: "/content_scripts/start.css" });
}

function handle_capture(data = []) {
    browser.tabs.captureVisibleTab().then((capturing) => {
        // console.log(data);
        //> resize image
        let img_elm = document.createElement("img");
        img_elm.src = capturing;
        img_elm.onload = function() {
            let resize_canvas = document.createElement("canvas");
            // resize_canvas.width = img_elm.width;
            // resize_canvas.height = img_elm.height;
            resize_canvas.width = data[2][0];
            resize_canvas.height = data[2][1];
            let resize_ctx = resize_canvas.getContext("2d");
            resize_ctx.drawImage(img_elm, 0, 0, data[2][0], data[2][1]);
            console.log([data[2][0], img_elm.width, data[2][1], img_elm.height]);
            // resize_ctx.scale(data[2][0] / img_elm.width, data[2][1] / img_elm.height);
            let resized_imgurl = resize_canvas.toDataURL();

            //> clip image
            let capturing_img = document.createElement("img");
            capturing_img.src = resized_imgurl;
            let clip_canvas = document.createElement('canvas');
            let clip_ctx = clip_canvas.getContext('2d');
            clip_canvas.width = data[1][0];
            clip_canvas.height = data[1][1];

            capturing_img.onload = function() {
                clip_ctx.drawImage(capturing_img, data[0][0], data[0][1], data[1][0], data[1][1], 0, 0, data[1][0], data[1][1]);

                //> decode QRcode
                let imgdata = clip_ctx.getImageData(0, 0, data[1][0], data[1][1]);
                let decoded = jsQR(imgdata.data, imgdata.width, imgdata.height);
                console.log(decoded);

                let gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });
                gettingActiveTab.then((tabs) => {
                    browser.tabs.sendMessage(tabs[0].id, decoded ? decoded.data : null);
                    // browser.tabs.sendMessage(tabs[0].id, [clip_canvas.toDataURL(), resized_imgurl]);
                });
            }
        }
    }, (e) => { console.log("error: " + e); });


    // return canvas;
}

browser.runtime.onMessage.addListener(handle_capture);
browser.browserAction.onClicked.addListener(go_shooting);