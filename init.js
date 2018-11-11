
const puppeteer = require('puppeteer');
const $ = require('cheerio');
const nasdaqURL = 'https://www.nasdaq.com/options';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // await page.goto(wikiUrl);
    await page.goto(nasdaqURL);
    // const wikiText = await page.evaluate(() => document.querySelector('#mp-tfa').innerHTML);
    // const nasdaqText = await page.evaluate(() => document.querySelector('.orange-ordered-list').getAttribute('href').innerHTML);

    // await page.goto('https://tokenmarket.net/blockchain/');

    const articleURLs = await page.$$eval('.orange-ordered-list > li > a', assetLinks => assetLinks.map(link => link.href));

    console.log(articleURLs);

    for (let articleURL of articleURLs) {
        await page.goto(articleURL);
        const articleText = await page.evaluate(() => document.querySelector('#articleText').innerHTML);
        console.log(articleText);
    }


    // const hrefs = await page.evaluate(() => {
    //     const anchors = document.querySelectorAll('a');
    //     const nasdaqText = document.querySelector('.orange-ordered-list');
    //     return [].map.call(anchors, a => a.href);
    // });

    // console.log(articleURLs);
    // console.log(wikiText);

    await browser.close();
})();