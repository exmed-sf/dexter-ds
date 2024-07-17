const buildIcons = require('./icons');
const generateCss = require('./css');

console.log("🤖	Hi, I'm Dexter[BOT]\n	I will generate the module for you.");

Promise.all([buildIcons(), generateCss()]);
