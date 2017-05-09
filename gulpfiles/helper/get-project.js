const argv = require('yargs').argv;

const projConfig = {
    'igb': 'ig-base',
    'igc': 'ig-com',
    'igcp': 'ig-cp'
};

module.exports = function() {
    return `${projConfig[argv.proj] ? projConfig[argv.proj] : projConfig['igc']}`
};