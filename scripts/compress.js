const fs = require('fs');
const path = require('path');
const ChromeExtension = require('crx');

const crx = new ChromeExtension({
    privateKey: fs.readFileSync('./key.pem')
});

crx.load(path.resolve(__dirname, '../extension'))
    .then(crx => crx.pack())
    .then(crxBuffer => fs.writeFileSync('mortgage_calculator.crx', crxBuffer))
    .catch(console.error);