/**
 * @file Ingress-ICE, configurations
 * @license MIT
 */

/*global announce */
/*global args */
/*global quit */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-extra');

const cookiespath = '.iced_cookies';
const config = configure(args[1]);

// Check if no login/password/link provided
if (
  (
    (
      typeof config.login == 'undefined' || config.login === '' ||
      typeof config.password == 'undefined' || config.password === ''
    ) && (
      typeof config.sessionid == 'undefined' || config.sessionid === '' ||
      typeof config.CSRF == 'undefined' || config.CSRF === ''
    )
  ) || (
    typeof config.area == 'undefined' || config.area === ''
  )) {
  quit('No login/password/area link specified. You need to reconfigure ice:\n - Double-click reconfigure.cmd on Windows;\n - Start ./ingress-ice -r on Linux/Mac OS X/*BSD;');
}

if (config.directory == '' || config.directory == undefined) {
  config.directory = 'screenshots/';
}

const folder = path.join(process.cwd(), config.directory);
let ssnum = 0;
if (args[2]) {
  ssnum = parseInt(args[2], 10);
}

/**
 * Counter for number of screenshots
 */
let curnum = 0;

/**
 * Take single screenshot and exit via setting delay=-1
 * @since 4.3.0
 */
if (config.delay == -1) {
  ssnum = 1;
  config.delay = 300000;
  //announce('Will take a single screenshot and exit');
}

/**
 * Delay between logging in and checking if successful
 * @default 10000
 */
let loginTimeout = config.loginTimeout;
if (loginTimeout == undefined || loginTimeout == '') {
  loginTimeout = 10000;
}

/**
 * Presets for settings not present in old versions of ice
 */
if (config.timezone == undefined || config.timezone == '') {
  config.timezone = false;
}

/**
 * twostep auth trigger
 */
let twostep = 0;
let page;

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('error', err => console.error('PAGE ERROR:', err));

  if (config.consoleLog !== undefined && config.consoleLog !== '') {
    page.on('console', async msg => {
      try {
        fs.appendFileSync(config.consoleLog, msg.text() + '\n');
      } catch (e) {
        announce(e);
      }
    });
  }

/**
 * aborting unnecessary API
 * @since 4.0.0
 * @author c2nprds
 */
  if (!config.iitc) {
    page.on('request', request => {
      const url = request.url();
      if (url.match(/(getGameScore|getPlexts|getPortalDetails)/g)) {
        request.abort();
      } else {
        request.continue();
      }
    });
  }

/** @function setVieportSize */
  if (!config.iitc) {
    await page.setViewport({
      width: config.width + 42,
      height: config.height + 167
    });
  } else {
    await page.setViewport({
      width: config.width,
      height: config.height
    });
  }
})();

/**
 * Parse the configuration .conf file
 * @since 4.0.0
 * @param {String} path
 */
function configure(path) {
  const settings = {};
  const settingsfile = fs.readFileSync(path, 'utf-8');
  const lines = settingsfile.split('\n');
  lines.forEach(line => {
    if (!(line[0] === '#' || line[0] === '[' || line.indexOf('=', 1) === -1)) {
      const pos = line.indexOf('=', 1);
      const key = line.substring(0, pos).trim();
      let value = line.substring(pos + 1).trim();
      if (value === 'false') {
        settings[key] = false;
      } else if (/^-?[\d.]+(?:e-?\d+)?$/.test(value) && value !== '') {
        settings[key] = parseInt(value, 10);
      } else {
        settings[key] = value;
      }
    }
  });
  return settings;
}
