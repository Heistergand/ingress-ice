/**
 * @file Ingress-ICE, everything related to plain login
 * @license MIT
 */

/*global announce */
/*global config */
/*global page */
/*global prepare */
/*global hideDebris */
/*global setMinMax */
/*global addIitc */
/*global twostep */
/*global loginTimeout */
/*global quit */
/*global storeCookies */
/*global main */

const readline = require('readline');

/**
 * Fires plain login
 */
async function firePlainLogin() {
  await page.setUserAgent('Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.5; en-US; rv:1.9.1b3) Gecko/20090305 Firefox/3.1b3 GTB5');
  const response = await page.goto('https://intel.ingress.com/', { waitUntil: 'networkidle2' });

  if (!response.ok()) {
    quit('Unable to connect to remote server');
  }

  const link = await page.evaluate(() => document.getElementsByTagName('a')[0].href);

  announce('Logging in...');
  await page.goto(link, { waitUntil: 'networkidle2' });
  await login(config.login, config.password);
}

/**
 * Log in to Google. Doesn't use post, because URI may change.
 * Fixed in 3.0.0 -- obsolete versions will not work (google changed login form)
 * @param l - google login
 * @param p - google password
 */
async function login(l, p) {
  await page.type('#Email', l);
  await page.click('#next');

  setTimeout(async () => {
    await page.type('#Passwd', p);
    await page.click('#next');
    await page.evaluate(() => document.getElementById('gaia_loginform').submit());

    setTimeout(async () => {
      announce('Validating login credentials...');
      const url = page.url();

      if (url.startsWith('https://accounts.google.com/ServiceLogin')) {
        quit('Login failed: wrong email and/or password');
      }

      if (url.startsWith('https://appengine.google.com/_ah/loginfo')) {
        announce('Accepting appEngine request...');
        await page.evaluate(() => {
          document.getElementById('persist_checkbox').checked = true;
          document.getElementsByTagName('form')[0].submit();
        });
      }

      if (url.startsWith('https://accounts.google.com/signin/challenge')) {
        announce('Using two-step verification, please enter your code:');
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        twostep = await new Promise(resolve => rl.question('', resolve));
        rl.close();
      }

      if (twostep) {
        await page.type('#totpPin', twostep);
        await page.click('#submit');
        await page.evaluate(() => document.getElementById('challenge').submit());
      }

      setTimeout(afterPlainLogin, loginTimeout);
    }, loginTimeout);
  }, loginTimeout / 10);
}

/**
 * Does all stuff needed after login/password authentication
 * @since 3.1.0
 */
async function afterPlainLogin() {
  const response = await page.goto(config.area, { waitUntil: 'networkidle2' });

  if (!await isSignedIn()) {
    announce('Something went wrong. Please, sign in to Google via your browser and restart ICE. Don\'t worry, your Ingress account will not be affected.');
    quit();
  }

  setTimeout(async () => {
    await storeCookies();
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
  }, loginTimeout / 10);
}
