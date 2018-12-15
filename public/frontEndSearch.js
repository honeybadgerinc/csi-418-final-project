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
    var retObjects = [];
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

        var i;
        var x = " ";

        for(i in retObjects){
            x+= "<tr> <th scope=\"row\">" + retObjects[i].symbol + "</th>"
                + "<td>" + retObjects[i].text+ "</td>" + "</tr>"
        }

        console.log(x);

        document.getElementById('DataTable').innerHTML = x;

        return retObjects;
    });
}

function SearchDate(requestedDate) {
    var retObjects = [];
    const ref = firebase.database().ref("Main");
    ref.once('value', function (snapshot) {
        snapshot.forEach(function (userSnapshot) {
            if (requestedDate === userSnapshot.val().date) {
                retObjects.push(userSnapshot.val());
            }
        });
        console.log("retObjects: " + JSON.stringify(retObjects));

        var i;
        var x = " ";

        for(i in retObjects){
            x+= "<tr> <th scope=\"row\">" + retObjects[i].symbol + "</th>"
                + "<td>" + retObjects[i].text+ "</td>" + "</tr>"
        }

        console.log(x);

        document.getElementById('DataTable').innerHTML = x;
        
        return retObjects;
    });
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
    var divToPrint = document.getElementById("DataTable");
    newWin = window.open("");
    newWin.document.write(divToPrint.outerHTML);
    newWin.print();
    newWin.close();
} 
