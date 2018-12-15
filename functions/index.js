//import { database } from './node_modules/firebase-admin/lib/index';
"use strict";
const cheerio = require('cheerio');
const firebase_admin = require('firebase-admin');
const functions = require('firebase-functions');
const r = require('request');
const rp = require('request-promise');
const rp2 = require('request-promise');
const express = require('express');
const app = express();
//const slice = require('array-slice');

//require('request-promise').debug = true;

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBHriCjR84InOYuyElyL7hMbyJ5qm-u_AA",
    authDomain: "icsi418final.firebaseapp.com",
    databaseURL: "https://icsi418final.firebaseio.com",
    projectId: "icsi418final",
    storageBucket: "icsi418final.appspot.com",
    messagingSenderId: "97113985830"
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

 /*
     * Date Format 1.2.3
     * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
     * MIT license
     *
     * Includes enhancements by Scott Trenda <scott.trenda.net>
     * and Kris Kowal <cixar.com/~kris.kowal/>
     *
     * Accepts a date, a mask, or a date and a mask.
     * Returns a formatted version of the given date.
     * The date defaults to the current date/time.
     * The mask defaults to dateFormat.masks.default.
     */

    var dateFormat = function () {
        var    token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) val = "0" + val;
                return val;
            };
    
        // Regexes and supporting functions are cached through closure
        return function (date, mask, utc) {
            var dF = dateFormat;
    
            // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
            if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }
    
            // Passing date through Date applies Date.parse, if necessary
            date = date ? new Date(date) : new Date;
            if (isNaN(date)) throw SyntaxError("invalid date");
    
            mask = String(dF.masks[mask] || mask || dF.masks["default"]);
    
            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) == "UTC:") {
                mask = mask.slice(4);
                utc = true;
            }
    
            var    _ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d:    d,
                    dd:   pad(d),
                    ddd:  dF.i18n.dayNames[D],
                    dddd: dF.i18n.dayNames[D + 7],
                    m:    m + 1,
                    mm:   pad(m + 1),
                    mmm:  dF.i18n.monthNames[m],
                    mmmm: dF.i18n.monthNames[m + 12],
                    yy:   String(y).slice(2),
                    yyyy: y,
                    h:    H % 12 || 12,
                    hh:   pad(H % 12 || 12),
                    H:    H,
                    HH:   pad(H),
                    M:    M,
                    MM:   pad(M),
                    s:    s,
                    ss:   pad(s),
                    l:    pad(L, 3),
                    L:    pad(L > 99 ? Math.round(L / 10) : L),
                    t:    H < 12 ? "a"  : "p",
                    tt:   H < 12 ? "am" : "pm",
                    T:    H < 12 ? "A"  : "P",
                    TT:   H < 12 ? "AM" : "PM",
                    Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                    o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };
    
            return mask.replace(token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        };
    }();
    
    // Some common format strings
    dateFormat.masks = {
        "default":      "ddd mmm dd yyyy HH:MM:ss",
        shortDate:      "m/d/yy",
        mediumDate:     "mmm d, yyyy",
        longDate:       "mmmm d, yyyy",
        fullDate:       "dddd, mmmm d, yyyy",
        shortTime:      "h:MM TT",
        mediumTime:     "h:MM:ss TT",
        longTime:       "h:MM:ss TT Z",
        isoDate:        "yyyy-mm-dd",
        isoTime:        "HH:MM:ss",
        isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };
    
    // Internationalization strings
    dateFormat.i18n = {
        dayNames: [
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ],
        monthNames: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ]
    };
    
    // For convenience...
    Date.prototype.format = function (mask, utc) {
        return dateFormat(this, mask, utc);
    };

//app.post("/symbol",function(request,response){
//    var query = db.ref("Main").orderByKey();
//    var result =[];

//    query.once("value").then(function(snapshot){ 
//        snapshot.forEach(function(childSnapshot){
//            if(childSnapshot.child('symbol').val() == request){
//                response.send(childSnapshot);
//            }
//        });
//    });

//})


//app.post("/date",function(request,response){
//    var  result=[];
//var index = 0;
//db.ref("Main").once("value",function(snap){
//    snap.forEach(function(childSnapshot){
//       // var key = childSnapshot.ref;
//       if(childSnapshot.hasChild("date") == true){
//        var date_time = childSnapshot.child("date").val();
//        //console.log("\n");
//        //console.log(index + " " + date + "\n");
        
        
//        var date = date_time.slice(0,9);
//       // console.log(date);
//        if(request == date){
//            response.send(childSnapshot);
//        }
//        else{
//            console.log("Child doesn't have date");
//        }
//    }
       
//    })
//});
//})

//This code will trigger when the "/scrape"request is recieved (via pushing "scrape" butoon on the UI)
app.get('/scrape', function(request, response) {
    console.log("scrape request received");

    //Gets the nasdaq homepage ready
    const options = {
        url: 'https://www.nasdaq.com/options/',
        headers: {
            'Connection': 'keep-alive',
            'Accept-Encoding': '',
            'Accept-Language': 'en-US,en;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'
        }
    };

    //Gets the HTML from the nasdaq homepage, and loads it into cheerio. It is now represented by "$"
    rp(options, function(err, res, html) {

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

            console.log(neededArticlesArray)

            //Now we loop through each selected article
            for (var index = 0; index < numArticles; index++) {

                //Gets each article html (one for each iteration of the for loop)
                var options2 = {
                    url: neededArticlesArray[index],
                    headers: {
                        'Connection': 'keep-alive',
                        'Accept-Encoding': '',
                        'Accept-Language': 'en-US,en;q=0.8',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'
                    }
                };

                rp2(options2, function(err2, res2, html2) {
                        //This will hold the initial array. Will later be used to create the final array that will be converted to json
                        const array = [];

                        const $ = cheerio.load(html2);

                        console.log("Artcile Found");

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
                        var datetime = new Date();
                        var dateString = datetime.format("yyyy-mm-dd")
                        //Finally we populate the array with the data
                        for (var i = 0; i < 3; i++) {
                            arrayFinal[i] = {
                                headline: tempHeadline,
                                symbols: symbols[i],
                                articleText: symbolText[i],
                                datetime: dateString
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
                        catch (err0r) {
                            console.error("firebase write error: " + error);
                        }
                    })
                    .catch(function(err2) {
                        console.log(err2.error);
                        console.log(err2);
                    });
            }

            //Sends a response back to the place that called it (UI)
            response.send('Scrape Completed Successfully!')
        })
        .catch(function (err) {
            console.log(err.error);
            console.log(err);
        });
}) 

console.log('BTNTEST!!!!!!!!!');


