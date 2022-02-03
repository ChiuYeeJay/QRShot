# QRShot

## Description

QRShot is a Firefox browser extension, which allows users to scan QR codes on webpages with a screenshot action. At the moment, it is in an early stage of development.

QRShot use[cozmo](https://github.com/cozmo)’s [jsQR](https://github.com/cozmo/jsQR) library to read QR code image.



QRShot是一個firefox的附加元件，點擊toolbar的按鈕，然後像是螢幕截圖一樣的拖移滑鼠擷取畫面，就會自動解析擷取方框中的QR code，並提供選項複製內容或前往該網址。目前這個附加元件還不成熟，仍在持續開發中。

QRShot使用[cozmo](https://github.com/cozmo)的[jsQR](https://github.com/cozmo/jsQR)庫來解析QR code圖片。

<img src="src/demo.gif" alt="demo2" style="zoom: 33%;" />

## Installation

- Download in firefox extension store (in the future)

- Clone this repository, and run [web-ext](https://www.npmjs.com/package/web-ext). 
- Clone this repository, and open the Firefox [about:debugging](https://developer.mozilla.org/en-US/docs/Tools/about:debugging) page, click the This Firefox option, click the Load Temporary Add-on  button, then select `webextension/manifest.json`.

## Todo

- [ ] Better selecting square and remove flash light
- [ ] Resolve the CSS interfere problem