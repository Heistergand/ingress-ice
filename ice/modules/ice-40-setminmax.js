/**
 * @file Ingress-ICE, setMinMax
 * @license MIT
 */

/*global page */
/*global announce */

/**
 * Sets minimal and maximal portal levels (filter) by clicking those buttons on filter panel.
 * 10 000 ms will be enough
 * @summary Portal level filter
 * @param {number} min - minimal portal level
 * @param {number} max - maximum portal level
 */
async function setMinMax(min, max) {
  const minAvailable = await page.evaluate(() => {
    return document.querySelectorAll('.level_notch.selected')[0];
  });

  if (parseInt(minAvailable.id[9], 10) > min) {
    announce('The minimal portal level is too low for current zoom, using default.');
  } else {
    const rect = await page.evaluate(() => {
      return document.querySelectorAll('.level_notch.selected')[0].getBoundingClientRect();
    });

    await page.mouse.click(rect.left + rect.width / 2, rect.top + rect.height / 2);

    setTimeout(async () => {
      const rect1 = await page.evaluate(min => {
        return document.querySelector('#level_low' + min).getBoundingClientRect();
      }, min);

      await page.mouse.click(rect1.left + rect1.width / 2, rect1.top + rect1.height / 2);

      if (max === 8) {
        await page.evaluate(() => {
          document.querySelector('#filters_container').style.display = 'none';
        });
      }
    }, 2000);
  }

  if (max < 8) {
    setTimeout(async () => {
      const rect2 = await page.evaluate(() => {
        return document.querySelectorAll('.level_notch.selected')[1].getBoundingClientRect();
      });

      await page.mouse.click(rect2.left + rect2.width / 2, rect2.top + rect2.height / 2);

      setTimeout(async () => {
        const rect3 = await page.evaluate(max => {
          return document.querySelector('#level_high' + max).getBoundingClientRect();
        }, max);

        await page.mouse.click(rect3.left + rect3.width / 2, rect3.top + rect3.height / 2);

        await page.evaluate(() => {
          document.querySelector('#filters_container').style.display = 'none';
        });
      }, 2000);
    }, 4000);
  }
}
