window.onload = function () {
    document.getElementById('btnLogOut').addEventListener('click', signout, true);
    document.getElementById('btnScrape').addEventListener('click', scraper, true);
};

function scraper() {
    const Http = new XMLHttpRequest();
    const url = '/scrape';
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

function myFunction() {

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
    var divToPrint = document.getElementById("print");
    newWin = window.open("");
    newWin.document.write(divToPrint.outerHTML);
    newWin.print();
    newWin.close();
}