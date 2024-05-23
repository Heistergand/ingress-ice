/**
 * @file Ingress-ICE, the main script
 * @version 4.5.3
 * @license MIT
 * @see {@link https://ingress.netlify.com/|Website }
 */

"use strict";

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

(async () => {
    const args = process.argv.slice(2);
    const filename = 'ice.js';
    const iceFolder = args[0].substring(0, args[0].length - filename.length) + 'modules/';
    const iceModules = fs.readdirSync(iceFolder).sort();

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    global.page = page;
    global.browser = browser;

    /*
     * Loads all scripts in the 'modules' folder
     */
    function loadModules() {
        for (const module of iceModules) {
            const file = path.join(iceFolder, module);
            if (fs.lstatSync(file).isFile()) {
                require(file);
            }
        }
    }

    loadModules();
    setTimeout(global.ice, 1000);
})();

