//Dicription: This script contains supporting functions for tourexplorer.html page
//Author : Sudesh Pamidi
"use strict"

// hotelroom objects
let tours = [{ category: "Sightseeing", Title: "Invisible Falls", Description: "Spend an afternoon searching for our invisible falls. Pan gold while you look.", cost: 29.99 },
    { category: "Adventure", Title: "Trekking", Description: "Alberta - get ready for an adventure that brings together the beautiful expanse of the prairie and the soaring majesty of the Canadian Rockies.", cost: 59.99 },
    { category: "Sightseeing", Title: "River Walk", Description: "These 50-minute guided tours provide guests an opportunity to view the Pawtucket/Seekonk River – its beauty, ecology and history – from a new perspective.", cost: 49.99 },
    { category: "Museums/Galleries", Title: "Amazing Science", Description: "Visit our great science museum with its world-class exhibit of magician.", cost: 9.99 },
    { category: "Adventure", Title: "Ziplining the Canyons", Description: "Spend 2 hours ziplining across conyons and through the treetops.", cost: 119.99 }
];

window.onload = function() {

    const tourCategoryField = document.getElementById("tourCategory");
    let tbody = document.getElementById("tourbody");

    let today = new Date();
    document.getElementById("today").innerHTML = today.toDateString() + " | 18° C";

    tourCategoryField.onchange = diplayTours;

    // display default tours - Sightseeing
    diplayTours();

    /** Displays the Tour object information  */
    function diplayTours() {
        deleteTableRows(tbody);
        let tour = getTourInfo(tourCategoryField.value); //("Sightseeing");
        addToursToTbody(tbody, tour);
    }
}

/** This returns tour object for given category
 *   @param  category(string) -- category
 */
function getTourInfo(category) {
    let tour = tours.filter(function(o) {
        return (o.category == category);
    });
    return tour;
};

/** Adds the tours object elements to table 
 *   @param  tbody(string) -- table body
 *   @param  data(string) --  arrayobjects 
 */
function addToursToTbody(tbody, data) {
    for (let i = 0; i < data.length; i++) {
        var tr = tbody.insertRow(i);
        Object.keys(data[i]).forEach((k, j) => {
            var cell = tr.insertCell(j);
            cell.innerHTML = data[i][k];
        });
        tbody.appendChild(tr);
    }
}

/** Deletes the rows from the table 
 *   @param  tbody(string) -- table body
 */
function deleteTableRows(tbody) {
    for (var i = tbody.rows.length; i > 0; i--) {
        tbody.deleteRow(i - 1);
    }
}