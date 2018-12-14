window.onload = function () {
    document.getElementById('btnLogOut').addEventListener('click', signout, true);
    // document.getElementById('btnSearch').addEventListener('click', Search, true);
    document.getElementById('btnSearchDate').addEventListener('click', SearchDate, true);
    document.getElementById('btnScrapest').addEventListener('click', Scraper, true);
    //scraper();
};

function Scraper() {
    console.log('In Srape');
    const Http = new XMLHttpRequest();
    const url = 'https://us-central1-icsi418final.cloudfunctions.net/app/scrape';
    Http.onload = function () {
        if (this.status != 200) {
            // Typical action to be performed when the document is ready:
            console.log('Error getting Scrape');
        }
        else {
            console.log(this.responseText);
        }
    };
    Http.open("GET", url);
    Http.send();
}

function Search(requestedSymbol) {
    //Get elements
    const ref = firebase.database().ref("Main");
    ref.once('value', function (snapshot) {
        snapshot.forEach(function (userSnapshot) {
            if (requestedSymbol === userSnapshot.val().One.symbol) {
                retObjects.push(userSnapshot.val().One);
            } else if (requestedSymbol === userSnapshot.val().Two.symbol) {
                retObjects.push(userSnapshot.val().Two);
            } else if (requestedSymbol === userSnapshot.val().Three.symbol) {
                retObjects.push(userSnapshot.val().Three);
            }
        });
        console.log("retObjects: " + JSON.stringify(retObjects));

        

        return retObjects;
    });
}

function SearchDate() {
    //Get elements
    console.log('In Date');

    const daty = document.getElementById('dateInput');

    var dbRef = firebase.database().ref('Main');
    dbRef.orderByChild('date').equalTo(daty).on('child_added', function(snap) {
        console.log(snap.val());
    });
   /*  var result = [];
    var index = 0;
    db.ref("Main").once("value", function (snap) {
        snap.forEach(function (childSnapshot) {
            // var key = childSnapshot.ref;
            if (childSnapshot.hasChild("date") == true) {
                var date_time = childSnapshot.child("date").val();
                //console.log("\n");
                //console.log(index + " " + date + "\n");
                if (request == date) {
                    response.send(childSnapshot);
                } else {
                    console.log("Child doesn't have date");
                }
            }

        })
    }); */

    var myObj, i, j, x = " ";

    myObj = {
        "name": "John",
        "age": 30,
        "cars": [
            { "name": "Ford", "models": ["Fiesta", "Focus", "Mustang"] },
            { "name": "BMW", "models": ["320", "X3", "X5"] },
            { "name": "Fiat", "models": ["500", "Panda"] }
        ]
    }

    for (i in myObj.cars) {
        x += "<h2>" + myObj.cars[i].name + "</h2>";
        for (j in myObj.cars[i].models) {
            x += myObj.cars[i].models[j] + "<br>";
        }
    }
    document.getElementById("DataTable").innerHTML = x;
}


function signout() {
    //Get elements
    const btnSignOut = document.getElementById('btnLogOut');

    if (btnSignOut) {

        console.log('In SignOUT');

        //Get Email and Pass
        const auth = firebase.auth();
        const promise = auth.signOut();
        promise.catch(e => alert(e.message));
    }

    firebase.auth().onAuthStateChanged(firebaseUser => {

        console.log('In AuthChanged');

        if (firebaseUser) {

        } else {
            window.location.href = './index.html';
        }
    });
}

/* function myFunction() {

            var x = document.getElementById("selection").value;
            if (x == "y") {
                document.getElementById('symbol').style.visibility = 'visible';
                document.getElementById('newdate').style.visibility = 'hidden';
            }
            else if (x == "z") {
                document.getElementById('newdate').style.visibility = 'visible';
                document.getElementById('symbol').style.visibility = 'hidden';
            }
            else {
                document.getElementById('symbol').style.visibility = 'hidden';
                document.getElementById('newdate').style.visibility = 'hidden';
            }
        }*/

function object1() {
    document.getElementById('exp').style.visibility = "visible";
    document.getElementById('printtable').style.visibility = "visible";
}

function downloadCsv(csv, filename) {
    var csvFile;
    var downloadLink;

    csvFile = new Blob([csv], { type: "text/csv" });

    // download link for file
    downloadLink = document.createElement("a");

    //filename
    downloadLink.download = filename;

    // link to file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // making sure link is not displayed
    downloadLink.style.display = "none";

    //linking to download/body
    document.body.appendChild(downloadLink);

    //onclick
    downloadLink.click();
}

function exportTableToCsv(filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");

    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");

        for (var j = 0; j < cols.length; j++)
            row.push(cols[j].innerText);

        csv.push(row.join(","));
    }
    //downloads the csv file
    downloadCsv(csv.join("\n"), filename);
}

function printData() {
    var divToPrint = document.getElementById("print");
    newWin = window.open("");
    newWin.document.write(divToPrint.outerHTML);
    newWin.print();
    newWin.close();
} 