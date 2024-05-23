[ingress-ice](http://ingress.netlify.com/)
===========
Automatic screenshooter for ingress intel map.

v4.5.3 "final" release. Development will not be continued.

Features:
=========
 - Captures screenshots of ingress intel map every *n* seconds
 - Set your location 
 - Authentication using login and password or cookies available
 - Supports 2-step authentication
 - Doesn't require X server to be run
 - Set portal levels to display
 - Use IITC (optionally)
 - Timestamp on screenshots (optionally)
 - Fully cross-platform: supports Windows, GNU/Linux and Mac OS X!
 - Hide some features like fields or links from the map (IITC only)
 - It's portable — you can run ice from a flash drive or a DropBox folder
 - Can be run via Docker (see the Dockerfile for usage)

Usage
=====
> *WARNING!* ingress-ice may be considered against Ingress ToS (although it hasn't happened before). Use it at your own risk!

### Windows
 1. Unpack the archieve wherever you want
 2. Download and extract phantomjs archive: https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-windows.zip
 3. Move `phantomjs-2.1.1-windows/bin/phantomjs.exe` to the same directory where you extracted the ingress-ice archive,
    so it can be found by `ingress-ice.cmd`
 4. Double-Click `ingress-ice.cmd` and follow the instructions
 5. It will save captured screenshots with into `ice-2014-07-13--09-13-37.png`, `ice-2014-07-13--09-14-07.png`...
 6. You can copy `ice/ingress-ice.conf.sample` to `ingress-ice.conf` in the ice root and enter your settings there, so you can have different configurations for every `ingress-ice`

If you want to reconfigure the script, just double click `reconfigure.cmd`.

### Linux/Mac OS X
 1. Unpack the archieve wherever you want
 2. Download and extract phantomjs archive
    - linux64: https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2
    - linux32: https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-i686.tar.bz2
    - armv6l:  https://github.com/spfaffly/phantomjs-linux-armv6l/blob/master/phantomjs-2.0.1-development-linux-armv6l.tar.gz?raw=true
    - osx:     https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-macosx.zip
 3. Move `phantomjs-*/bin/phantomjs` to the same directory where you extracted the ingress-ice archive,
    so it can be found by `ingress-ice.sh`
 4. Run `chmod +x ingress-ice.sh&&./ingress-ice.sh` in console and follow the instructions
 5. It will save captured screenshots with into `ice-2014-07-13--09-13-37.png`, `ice-2014-07-13--09-14-07.png`...
 6. You can run it from any folder where you want to save screenshots.

If you want to reconfigure the script, run `./ingress-ice.sh -r`. In case Ingress ICE crashes sometimes, run it with option `-s`: it will run ICE in an endless loop.

#### Creating videos
To create a video from your screenshots, you can use *MPlayer* [(Windows download)](http://oss.netfarm.it/mplayer-win32.php) (install from your repo if on linux). It includes a `mencoder` command. The following will produce an `.avi` video:
```
mencoder mf://*.png -mf w=1366:h=768:fps=4:type=png -ovc lavc -lavcopts vcodec=mpeg4:mbd=2:trell -oac copy -o ingress-ice.avi
```

Change 1366 and 768 to your width and height, fps=4 to your FPS (more FPS - faster video, but shorter)

#### Troubleshooting
If you have problems logging in, that may be a CAPTCHA. Try visiting https://accounts.google.com/displayunlockcaptcha and following the instructions.

#### Contributors
[the main dev](https://ingress.netlify.com)
[c2nprds](https://github.com/c2nprds)
[serjvanilla](https://github.com/serjvanilla)
[pheanex](https://github.com/pheanex)
[mxxcon](https://github.com/mxxcon)
[mfcanovas](https://github.com/mfcanovas)
[sndirsch](https://github.com/sndirsch)
[CyBot](https://github.com/CyBot)
[fesse](https://github.com/fesse)
[tom-eagle92](https://github.com/tom-eagle92)
[rawdr](https://github.com/rawdr)
[mcdoubleyou](https://github.com/mcdoubleyou)
[RomanIsko](https://github.com/RomanIsko)
[jankatins](https://github.com/jankatins)
[EdJoPaTo](https://github.com/EdJoPaTo)

#### Backers
See backers.md.

# Ingress-ICE Migration from PhantomJS to Puppeteer

## Overview
This document outlines the changes made to migrate Ingress-ICE from PhantomJS to Puppeteer. Each script has been carefully modified to replace PhantomJS-specific functions with Puppeteer equivalents while maintaining the original functionality.

## Modified Files and Changes

### 1. `ice.js`
- **Changes**: Loads modules and starts Puppeteer browser.

### 2. `ice-10-utils.js`
- **Changes**: Replaced `phantom.exit()` with `process.exit()` for Node.js compatibility.

### 3. `ice-20.aws.js`
- **Changes**: Implemented AWS S3 upload using AWS SDK for Node.js.

### 4. `ice-20-dropbox.js`
- **Changes**: Implemented Dropbox upload using `node-fetch`.

### 5. `ice-30-config.js`
- **Changes**: Replaced PhantomJS `fs` with Node.js `fs` and adjusted for Puppeteer usage.

### 6. `ice-40-setminmax.js`
- **Changes**: Set minimum and maximum portal levels using Puppeteer click events.

### 7. `ice-50-extra.js`
- **Changes**: Adjusted `page.evaluate` calls to be asynchronous with Puppeteer.

### 8. `ice-60-core.js`
- **Changes**: Modified main functionalities including screenshot and webpage manipulation for Puppeteer.

### 9. `ice-70-login-cookies.js`
- **Changes**: Adapted cookie-based login to use Puppeteer’s cookie management.

### 10. `ice-80-login-plain.js`
- **Changes**: Adapted plain login flow to use Puppeteer for Google login interactions.

## Summary
The migration replaces PhantomJS with Puppeteer, ensuring the functionality remains consistent. All file interactions, webpage evaluations, and login procedures have been updated to utilize Puppeteer’s capabilities. These changes were made by Heistergand with the help of AI. Due to the extensive modifications, there might be errors, especially with the old login method which has been transitioned as-is.
