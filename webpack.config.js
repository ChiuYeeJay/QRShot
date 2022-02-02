var path = require('path')

module.exports = {
    entry: ['./src/index.js'],
    output: {
        path: path.join(__dirname, 'webextension'),
        filename: 'background.js'
    }
}