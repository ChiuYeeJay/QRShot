// inject the content script to the current tab
function go_shooting() {
    browser.tabs.executeScript({ file: "start.js" });
}

browser.browserAction.onClicked.addListener(go_shooting);