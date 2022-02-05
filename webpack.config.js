var path = require('path')

module.exports = {
    entry: ['./webextension/background_original.js'],
    output: {
        path: path.join(__dirname, 'webextension'),
        filename: 'background.js'
    }
}