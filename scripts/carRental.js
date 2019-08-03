window.onload = function() {

        const pickupDateField = document.getElementById("pickupDate");
        const noOfDaysField = document.getElementById("noOfDays");
        const carTypeField = document.getElementById("carType");
        const electronicTollField = document.getElementById("electronicToll");
        const gpsField = document.getElementById("gps");
        const roadSideAssistField = document.getElementById("roadSideAssist");
        //const price = document.getElementById("price");
        const reset = document.getElementById("reset");
        const under24Option = document.querySelectorAll("input[name=under25]");
        const imgTowTruck = document.getElementById("imgTowTruck");

        // binding the events 
        estimate.onclick = displayEsimates;
        electronicTollField.onclick = displayEsimates;
        gpsField.onclick = displayEsimates;
        roadSideAssistField.onclick = displayEsimates;
        reset.onclick = clearResults;

        let today = new Date();
        let todayString = getFormattDate(today);

        pickupDateField.defaultValue = todayString; //"2014-02-09";

        dropoffDate.defaultValue = "2019-08-09";

        console.log(getDateDiff(pickupDateField.value, dropoffDate.value));

        function displayEsimates() {
            let basicCarRent = calculateBasicCarRent();
            let options = calculateOptions();
            let under25Surcharge = calculateUnder25Surcharge(basicCarRent);

            results.style.display = "block";
            results.innerHTML = "<p><strong>Car Rental:</strong> $" + basicCarRent.toFixed(2) + "</p>" +
                "<p><strong>Options:</strong> $" + options.toFixed(2) + "</p>" +
                "<p><strong>Surchange:</strong> $" + under25Surcharge.toFixed(2) + "</p>";
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
            document.getElementById("results").style.display = "none";
            results.innerHTML = "";
        };

    }
    // returns the date into a string in yyyy-mm-dd format
function getFormattDate(date) {
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : "0" + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;

    return (date.getFullYear() + "-" + month + "-" + day);
}

//Description: this is scripts for lab execises for dates to find out the date differences
//Author: Sudesh pamidi
function getDateDiff(startDate, endDate) {

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    let msecPerDay = 1000 * 60 * 60 * 24;
    let elapsedMilliSec = endDate.getTime() - startDate.getTime();
    let dayDiff = elapsedMilliSec / msecPerDay;
    let numDays = Math.round(dayDiff);

    return (numDays);
}