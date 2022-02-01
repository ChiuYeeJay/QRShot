// inject the content script to the current tab
function go_shooting() {
    browser.tabs.executeScript({ file: "/content_scripts/start.js" });
    browser.tabs.insertCSS({ file: "/content_scripts/start.css" });
}

browser.browserAction.onClicked.addListener(go_shooting);