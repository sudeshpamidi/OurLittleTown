//Dicription: This script contains supporting fucntions for carrental.html page
//Authot : Sudesh Pamidi
"use strict"

window.onload = function() {

    const pickupDateField = document.getElementById("pickupDate");
    const dropoffDateField = document.getElementById("dropoffDate");
    const noOfDaysField = document.getElementById("noOfDays");
    const carTypeField = document.getElementById("carType");
    const electronicTollField = document.getElementById("electronicToll");
    const gpsField = document.getElementById("gps");
    const roadSideAssistField = document.getElementById("roadSideAssist");
    const reset = document.getElementById("reset");
    const under24Option = document.querySelectorAll("input[name=under25]"); // not in use
    const under24RdoNoRdo = document.getElementById("under25No");
    const under24RdoYesRdo = document.getElementById("under25Yes");
    const imgTowTruck = document.getElementById("imgTowTruck"); // not in use
    const resultsDiv = document.getElementById("results")
    const alertDiv = document.getElementById("alert")


    // binding the events 
    estimate.onclick = displayEsimates;

    carTypeField.onchange = clearResults;
    electronicTollField.onclick = clearResults;
    gpsField.onclick = clearResults;
    roadSideAssistField.onclick = clearResults;
    under24RdoNoRdo.onchange = clearResults;
    under24RdoYesRdo.onchange = clearResults;

    reset.onclick = clearResults;

    pickupDateField.onblur = clearResults; //calculateNumberOfNights;
    noOfDaysField.onkeyup = displayDropoffDate;

    initializeDates();

    function displayEsimates() {

        if (!isDate(pickupDateField.value) || isNaN(noOfDaysField.value) || !(parseInt(noOfDaysField.value) > 0)) {
            alertDiv.style.display = "block";
            alertDiv.innerText = "Eigther Date is invalid or Number of Days is not a number. The input fields should be positive numbers.";
            return;
        }
        //recalculate the dropoff date, incase case there no input in num of days fields
        displayDropoffDate();

        let basicCarRent = calculateBasicCarRent();
        let options = calculateOptions();
        let under25Surcharge = calculateUnder25Surcharge(basicCarRent);
        let totalCost = parseFloat(basicCarRent) + parseFloat(options) + parseFloat(under25Surcharge);
        let pickupDate = new Date(pickupDateField.value);
        let dropoffDate = new Date(dropoffDateField.value);

        resultsDiv.style.display = "block";
        resultsDiv.innerHTML = "<p><strong>Pickup Date:</strong> " + pickupDateField.value + "</p>" +
            "<p><strong>Pickup Date:</strong> " + dropoffDateField.value + "</p>" +
            "<p><strong>Car Rental:</strong> $" + basicCarRent.toFixed(2) + "</p>" +
            "<p><strong>Options:</strong> $" + options.toFixed(2) + "</p>" +
            "<p><strong>Surchange:</strong> $" + under25Surcharge.toFixed(2) + "</p>" +
            "<p><strong>Totsl Cost:</strong> $" + totalCost.toFixed(2) + "</p>";
    }

    function calculateBasicCarRent() {

        let carType = carTypeField;
        let carPrice = 29.99;

        switch (carTypeField.options[carTypeField.selectedIndex].value) { // carTypeField.value
            case "comp":
                carPrice = 39.99;
                break;
            case "intm":
                carPrice = 49.99;
                break;
            case "fsize":
                carPrice = 59.99;
                break;
            case "eco":
            default:
                carPrice = 29.99;
        };
        return parseFloat(noOfDaysField.value) * carPrice;
    }

    function calculateUnder25Surcharge(totalCarRent) {
        let surchage = 0.0;
        let selectedOption = document.querySelector("input[name=under25]:checked").value;
        if (selectedOption == "true") {
            surchage = 0.3 * parseFloat(noOfDaysField.value) * totalCarRent;
        }
        return surchage;
    }

    //Calculate the price
    function calculateOptions() {
        let options = 0.0;
        if (electronicTollField.checked) {
            options += parseFloat(electronicTollField.value);
        }

        if (gpsField.checked) {
            options += parseFloat(gpsField.value);
        }

        if (roadSideAssistField.checked) {
            options += parseFloat(roadSideAssistField.value);
        }
        //let totoal = parseFloat(noOfDaysField.value) * 29.99 + options;

        return options;
    }
    //Clear the results
    function clearResults() {
        resultsDiv.style.display = "none";
        alertDiv.style.display = "none";
    };

    //Function to initialize the date fiels to current date 
    //takes no parameters  
    function initializeDates() {
        let today = new Date();

        document.getElementById("today").innerHTML = today.toDateString() + " | 18° C";
        let todayString = getFormattDate(today);
        pickupDate.defaultValue = todayString;
        dropoffDate.defaultValue = todayString;
    }
    //Function to populate the number of days field based of checkin and checkout dates
    //takes no parameters  
    function calculateNumberOfNights() {
        let numNights = getDateDiff(pickupDateField.value, dropoffDateField.value);
        if (numNights == 0) { numNights = 1; }
        noOfDaysField.value = numNights;
    };
    //Function to populate the checkout date based on number of days.
    //takes no parameters  
    function displayDropoffDate() {
        clearResults();
        if (isDate(pickupDateField.value)) {
            let pickupDate = getEndDate(pickupDateField.value, noOfDaysField.value);
            dropoffDateField.value = getFormattDate(pickupDate);
        } else {
            alertDiv.style.display = "block";
            alertDiv.innerHTML = "Invalid Pickup Date.";
        }
    }

}