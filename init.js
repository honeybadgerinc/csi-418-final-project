
const puppeteer = require('puppeteer');
const $ = require('cheerio');
const Apify = require('apify');
const randomUA = require('modern-random-ua');
// const nasdaqURL = 'https://www.nasdaq.com/options';
const nasdaqURL = 'file:///media/lucas/OS/Users/Lucas/Documents/Back%20to%20school/fall%202018/software%20engineering/final%20project/nasdaq_html.html';

Apify.main(async () => {
    // Set one random modern user agent for entire browser
    const browser = await Apify.launchPuppeteer({
        useChrome: true,
    });

    var page = await browser.newPage();

    await Apify.utils.puppeteer.hideWebDriver(page);

    await page.setUserAgent(randomUA.generate());
    await page.goto(nasdaqURL);

    const articleURLs = await page.$$eval('.orange-ordered-list > li > a', assetLinks => assetLinks.map(link => link.href));

    for (let articleURL of articleURLs) {
        await page.setUserAgent(randomUA.generate());
        await Apify.utils.puppeteer.hideWebDriver(page);
        await page.goto(articleURL), { waitUntil: 'networkidle0', timeout: 100000 };
        await page.evaluate(_ => window.stop());
        const articleText = await page.evaluate(() => document.querySelector('#articleText').innerHTML);
        await page.close();
        console.log(articleText);
    }
    await browser.close();
});

// (async () => {
//     const browser = await puppeteer.launch();
//     browser.setMaxListeners(1);
//     const page = await browser.newPage();
//     await page.setViewport({ width: 320, height: 600 })
//     await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1')

//     await page.goto(nasdaqURL);

//     const articleURLs = await page.$$eval('.orange-ordered-list > li > a', assetLinks => assetLinks.map(link => link.href));

//     console.log(articleURLs[0]);

//     await page.goto(articleURLs[0]);

//     const articleText = await page.evaluate(() => document.querySelector('#articleText').innerHTML);

//     console.log(articleText);

//     // for (let articleURL of articleURLs) {
//     //     await page.goto(articleURL);
//     //     const articleText = await page.evaluate(() => document.querySelector('#articleText').innerHTML);
//     //     console.log(articleText);
//     // }


//     // const hrefs = await page.evaluate(() => {
//     //     const anchors = document.querySelectorAll('a');
//     //     const nasdaqText = document.querySelector('.orange-ordered-list');
//     //     return [].map.call(anchors, a => a.href);
//     // });

//     // console.log(articleURLs);
//     // console.log(wikiText);

//     await browser.close();
// })();