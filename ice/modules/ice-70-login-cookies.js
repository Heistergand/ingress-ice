/**
 * @file Ingress-ICE, everything related to cookies login
 * @license MIT
 */

/*global announce */
/*global config */
/*global page */
/*global prepare */
/*global hideDebris */
/*global setMinMax */
/*global addIitc */
/*global loginTimeout */
/*global quit */
/*global firePlainLogin */
/*global main */
/*global fs */
/*global cookiespath */

const fs = require('fs');

/**
 * Checks if cookies file exists. If so, it sets sessionid and CSRF vars
 * @returns {boolean}
 */
function loadCookies() {
  if (fs.existsSync(cookiespath)) {
    const lines = fs.readFileSync(cookiespath, 'utf-8').split('\n');
    lines.forEach(line => {
      const [key, value] = line.split('=');
      if (key === 'sessionid') {
        config.sessionid = value;
      } else if (key === 'csrftoken') {
        config.CSRF = value;
      }
    });
  }
}

/**
 * Log in using cookies
 * @param {String} csrf
 * @param {String} sessionid
 */
async function addCookies(csrf, sessionid) {
  await page.setCookie({
    name: 'sessionid',
    value: sessionid,
    domain: 'intel.ingress.com',
    path: '/',
    httpOnly: true,
    secure: true
  });
  await page.setCookie({
    name: 'csrftoken',
    value: csrf,
    domain: 'intel.ingress.com',
    path: '/'
  });
}

/**
 * Does all stuff needed after cookie authentication
 */
async function afterCookieLogin() {
  const response = await page.goto(config.area, { waitUntil: 'networkidle2' });
  if (!response.ok()) {
    quit('Unable to connect to remote server');
  }

  if (!await isSignedIn()) {
    if (fs.existsSync(cookiespath)) {
      fs.unlinkSync(cookiespath);
    }
    if (config.login && config.password) {
      await page.deleteCookie({ name: 'sessionid', domain: 'intel.ingress.com' });
      await page.deleteCookie({ name: 'csrftoken', domain: 'intel.ingress.com' });
      firePlainLogin();
      return;
    } else {
      quit('Cookies are obsolete. Update your config file.');
    }
  }

  if (config.iitc) {
    await addIitc();
  }

  setTimeout(async () => {
    announce(`Will start screenshooting in ${config.delay / 1000} seconds...`);
    if ((config.minlevel > 1 || config.maxlevel < 8) && !config.iitc) {
      await setMinMax(config.minlevel, config.maxlevel);
    } else if (!config.iitc) {
      await page.evaluate(() => {
        document.querySelector("#filters_container").style.display = 'none';
      });
    }
    await hideDebris(config.iitc);
    await prepare(config.iitc, config.width, config.height);
    announce('The first screenshot may not contain all portals, it is intended for you to check framing.');
    await main();
    setInterval(main, config.delay);
  }, loginTimeout);
}

/**
 * Checks if user is signed in by looking for the "Sign in" button
 * @returns {boolean}
 */
async function isSignedIn() {
  return await page.evaluate(() => {
    return document.getElementsByTagName('a')[0].innerText.trim() !== 'Sign in';
  });
}

async function storeCookies() {
  const cookies = await page.cookies();
  fs.writeFileSync(cookiespath, '');
  cookies.forEach(cookie => {
    fs.appendFileSync(cookiespath, `${cookie.name}=${cookie.value}\n`);
  });
}
