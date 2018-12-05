const axios = require('axios');
const cheerio = require('cheerio');
const firebase_admin = require('firebase-admin');
const functions = require('firebase-functions');
const express = require('express');
const app = express();

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
//var database = firebase_admin.database();
//This code will look for all articles on the nasdaq options front page with "Notable" or "Noteworthy" in the title

app.get('/scrape', (request, response) => {
    console.log("scrape received");
    var webscrapeTrimmed;
    axios.get('https://www.nasdaq.com/options/').then((response) => {
        console.info("at nasdaq.com")
        if (response.status == 200) {
            console.log("at line 32")
            const html = response.data;

            //Loads html document into cheerio so we can look for articles we need
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
                //This code will go into each selected article and scrape the data we need
                axios.get(neededArticlesArray[index])
                    .then((response) => {
                        console.log("at line 63");
                        if (response.status === 200) {
                            console.log("at line 65");
                            const html = response.data;

                            //Loads the html document into cheerio to start webscraping the data from
                            const $ = cheerio.load(html);

                            //This will hold the initial array. Will later be used to create the final array that will be converted to json
                            const array = [];

                            //This removes all of the unecessary parts from the article text
                            $('strong').remove();
                            //$('a').remove();      //Removes hyperlinks from text
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
                                    //headline: tempHeadline,
                                    symbols: symbols[i],
                                    articleText: symbolText[i],
                                    datetime: datetime
                                };
                            }


                            //Here we trim down the array
                            webscrapeTrimmed = arrayFinal.filter(n => n != undefined)

                            try {
                                firebase_admin.database().ref(tempHeadline).set(
                                    {
                                        tempHeadline: {
                                            One: {
                                                symbol: webscrapeTrimmed[0].symbols,
                                                text: webscrapeTrimmed[0].articleText
                                            },
                                            Two: {
                                                symbol: webscrapeTrimmed[1].symbols,
                                                text: webscrapeTrimmed[1].articleText
                                            },
                                            Three: {
                                                symbol: webscrapeTrimmed[2].symbols,
                                                text: webscrapeTrimmed[2].articleText
                                            },
                                            date: webscrapeTrimmed[0].datetime
                                        }
                                    }
                            } catch (err) {
                                console.error("firebase write error: " + err);
                            }

                            //Finally, print out the array to the console for checking over
                            console.log(webscrapeTrimmed);
                            console.log("\n\n")
                        }
                    }, (error) => console.log(err));
            }
        }
    })
})
exports.app = functions.https.onRequest(app);