//import { database } from './node_modules/firebase-admin/lib/index';

const cheerio = require('cheerio');
const firebase_admin = require('firebase-admin');
const functions = require('firebase-functions');
const r = require('request');
const rp = require('request-promise');
const express = require('express');
const app = express();

//require('request-promise').debug = true;

// Initialize Firebase
var config = {
    apiKey: "AIzaSyA2pM55uTodnnX1wHcKBcYrQQByDSup-rU",
    authDomain: "finalproject-37ce0.firebaseapp.com",
    databaseURL: "https://finalproject-37ce0.firebaseio.com",
    projectId: "finalproject-37ce0",
    storageBucket: "finalproject-37ce0.appspot.com",
    messagingSenderId: "260652345298"
};
if (!firebase_admin.apps.length) {
    firebase_admin.initializeApp(config);
}
else {
    firebase_admin.app();
}
//Initialize firebase database
var db = firebase_admin.database();


const runtimeOpts = {
    timeoutSeconds: 300,
    memory: '512MB'
}
exports.app = functions.runWith(runtimeOpts).https.onRequest(app);

//This code will trigger when the "/scrape"request is recieved (via pushing "scrape" butoon on the UI)
app.get('/scrape', (request, response) => {
    console.log("scrape request received");

    //Gets the nasdaq homepage ready
    const options = {
        url: 'https://www.nasdaq.com/topic/options?page=5',
        headers: {
            'Connection': 'keep-alive',
            'Accept-Encoding': '',
            'Accept-Language': 'en-US,en;q=0.8'
        }
    };

    //Gets the HTML from the nasdaq homepage, and loads it into cheerio. It is now represented by "$"
    rp.get(options)
        .then(function (html) {

            console.log("got the homepage loaded");

            //const html = res.data;
            const $ = cheerio.load(html);

            //This will actually hold every article on the page
            const articlesArray = [];

            //This is what actually sets up the array. it will get the article names and text
            $('.orange-ordered-list').children('li').each(function (i, elem) {
                articlesArray[i] = {
                    link: $(this).find('a').attr('href'),
                    name: $(this).find('b').text().trim(),
                }
            });

            //This will hold the articles we actually need to scrape
            const neededArticlesArray = [];
            var len = articlesArray.length;
            for (var x = 0; x < len; x++) {
                if (articlesArray[x].name.startsWith("Notable") || articlesArray[x].name.startsWith("Noteworthy"))
                    neededArticlesArray.push(articlesArray[x].link);
            }

            const numArticles = neededArticlesArray.length;

            //Now we loop through each selected article
            for (var index = 0; index < numArticles; index++) {

                //Gets each article html (one for each iteration of the for loop)
                var options2 = {
                    url: neededArticlesArray[index],
                    headers: {
                        'Connection': 'keep-alive',
                        'Accept-Encoding': '',
                        'Accept-Language': 'en-US,en;q=0.8'
                    }
                };

                rp.get(options2)
                    .then(function (html2) {
                        //This will hold the initial array. Will later be used to create the final array that will be converted to json
                        const array = [];

                        const $ = cheerio.load(html2);

                        //This removes all of the unecessary parts from the article text
                        $('strong').remove();
                        $('img').remove();
                        $('table').remove();
                        $(':contains("  : ")').each(function () {
                            $(this).html($(this).html().split("  : ").join(""));
                        });

                        //This is what actually sets up the array. it will get the headline and text from the article
                        $('.three-hundred-wide-right-rail').each(function (i, elem) {
                            array[i] = {
                                headline: $(this).find('h1').text().trim(),
                                text: $('#articleText div').parent().text().trim().replace(/  /g, ' ').replace(/ ,/g, ','),
                            }
                        });

                        //Now set up info for a final array (the one that will actually be the JSON)
                        const arrayFinal = [];
                        var tempText = array[0].text;
                        var tempHeadline = array[0].headline;
                        var symbols = [];
                        var symbolText = [];
                        //Sets up the array of symbols
                        var temp = tempHeadline.split(/[:,]/);
                        symbols[0] = temp[1].trim();
                        symbols[1] = temp[2].trim();
                        symbols[2] = temp[3].trim();
                        //Sets up the array of text blobs for each symbol
                        var tempIndex = tempText.indexOf("), ") + 3;
                        var tempIndex2 = tempText.indexOf("orange:") + 7;
                        symbolText[0] = tempText.substring(tempIndex, tempIndex2);
                        tempText = tempText.substring(tempIndex2);
                        tempIndex = tempText.indexOf(") ") + 2;
                        tempIndex2 = tempText.indexOf("orange:") + 7;
                        symbolText[1] = tempText.substring(tempIndex, tempIndex2);
                        tempText = tempText.substring(tempIndex2);
                        tempIndex = tempText.indexOf(") ") + 2;
                        tempIndex2 = tempText.indexOf("orange:") + 7;
                        symbolText[2] = tempText.substring(tempIndex, tempIndex2);
                        //The datetime of the webscrape
                        var datetime = new Date().toLocaleString();
                        //Finally we populate the array with the data
                        for (var i = 0; i < 3; i++) {
                            arrayFinal[i] = {
                                headline: tempHeadline,
                                symbols: symbols[i],
                                articleText: symbolText[i],
                                datetime: datetime
                            };
                        }

                        //This will not write the data to firebase
                        var ref = db.ref("Main");
                        try {
                            ref.child(tempHeadline).set(
                                {
                                    One: {
                                        symbol: arrayFinal[0].symbols,
                                        text: arrayFinal[0].articleText
                                    },
                                    Two: {
                                        symbol: arrayFinal[1].symbols,
                                        text: arrayFinal[1].articleText
                                    },
                                    Three: {
                                        symbol: arrayFinal[2].symbols,
                                        text: arrayFinal[2].articleText
                                    },
                                    date: arrayFinal[0].datetime
                                });
                        }
                        catch (err) {
                            console.error("firebase write error: " + err);
                        }
                    })
                    .catch(function(err) {
                        console.log(err.error);
                        console.log(err);
                    });
            }

            //Sends a response back to the place that called it (UI)
            response.send('Scrape Completed Successfully!')

            return null;
        })
        .catch(function (err) {
            console.log(err.error);
            console.log(err);
        });

    //A test to see if the database can be written to at all
    var ref = db.ref("Main");
    try {
        ref.child("TEST").set(
            {
                One: "TEST"
            });
    }
    catch (err) {
        console.error("firebase write error: " + err);
    }
})     