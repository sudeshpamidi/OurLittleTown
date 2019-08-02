//Dicription:
//Authot : Sudesh Pamidi
"use strict"

let hotelRates = [{ roomType: "Queen", maxOccupancy: 5, highSeasonRate: 250.00, lowSeasonRate: 150.00 },
    { roomType: "King", maxOccupancy: 2, highSeasonRate: 250.00, lowSeasonRate: 150.00 },
    { roomType: "King Suite", maxOccupancy: 4, highSeasonRate: 310.00, lowSeasonRate: 190.00 },
    { roomType: "2 Bedroom Suite", maxOccupancy: 6, highSeasonRate: 350.00, lowSeasonRate: 210.00 }
];

window.onload = function() {
    const roomTypeField = document.getElementById("roomType");
    const checkinDateField = document.getElementById("checkinDate");
    const checkoutDateField = document.getElementById("checkoutDate");
    const noOfNightsField = document.getElementById("noOfNights");
    const adultsField = document.getElementById("adults");
    const kidsField = document.getElementById("kids");
    const breakfastField = document.querySelector("input[name=breakfast]:checked");
    const discountField = document.querySelector("input[name=discount]:checked");
    const estimate = document.getElementById("estimate");
    const reset = document.getElementById("reset");
    const resultDiv = document.getElementById("results")
    const alertDiv = document.getElementById("alert")


    let isRoomAvailable = canRoomHoldCustomer("Queen", 1, 1);
    console.log("is room availa " + isRoomAvailable);

    initializeDates();

    checkinDateField.onblur = displayNumberOfNights;
    checkoutDateField.onblur = displayNumberOfNights;
    checkinDateField.onkeyup = displayNumberOfNights;
    checkoutDateField.onkeyup = displayNumberOfNights;
    noOfNightsField.onkeyup = displayCheckoutDate;

    estimate.onclick = calculateAndDisplayRoomCost;

    reset.onclick = clearResults;

    //Calculate the room cost
    function calculateAndDisplayRoomCost() {

        let breakfastCost = 0.0;

        if (!validateNumNights()) {
            return;
        };

        if (!canRoomHoldCustomer(roomTypeField.value, adultsField.value, kidsField.value)) {
            alertDiv.style.display = "block";
            resultDiv.style.display = "none";
            alertDiv.innerHTML = "The room  type " + roomTypeField.value + " cannot hold all the occupants.";
            return;
        }

        let roomCost = getRoomCost(roomTypeField.value, checkinDateField.value, noOfNightsField.value);

        let discountType = document.querySelector("input[name=discount]:checked").value;
        let discount = getDiscount(roomCost, discountType);

        let breakfastVal = document.querySelector("input[name=breakfast]:checked").value;
        if (breakfastVal == "true") {
            breakfastCost = getbreakfastCost(adultsField.value, kidsField.value, noOfNightsField.value, "");
        }

        let tax = (roomCost + breakfastCost - discount) * 0.12;
        let totalCost = (roomCost + breakfastCost - discount) + tax;

        alertDiv.style.display = "none";
        resultDiv.style.display = "block";
        resultDiv.innerHTML = "<p><strong>Hotel Cost:</strong> $" + (roomCost + breakfastCost).toFixed(2) + "</p>" +
            "<p><strong>Discount:</strong> $" + discount.toFixed(2) + "</p>" +
            "<p><strong>Tax:</strong> $" + tax.toFixed(2) + "</p>" +
            "<p><strong>Total Cost:</strong> $" + totalCost.toFixed(2) + "</p>";
    }
    //Clear the results
    function clearResults() {
        resultDiv.style.display = "none";
        alertDiv.style.display = "none";
    };

    //validate the data
    function validateNumNights() {

        if (noOfNightsField.value > 28 || noOfNightsField.value <= 0) {
            alertDiv.style.display = "block";
            resultDiv.style.display = "none";
            alertDiv.innerHTML = "Cannot be more than 28 nights";

            return false;
        } else
            return true;
    }


    function initializeDates() {
        let today = new Date();
        let todayString = getFormattDate(today);
        checkinDateField.defaultValue = todayString;
        checkoutDateField.defaultValue = todayString;
    }

    function displayNumberOfNights() {
        noOfNightsField.value = getDateDiff(checkinDateField.value, checkoutDateField.value);
    };

    function displayCheckoutDate() {
        let checkoutDate = getEndDate(checkinDateField.value, noOfNightsField.value)
        checkoutDateField.value = getFormattDate(checkoutDate);
    }

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
    if (isNaN(numDays))
        return 0;
    else
        return (numDays);
};
//Description: this is scripts calculates the end date of given start date and num of dates
//Author: Sudesh pamidi
function getEndDate(startDate, numDays) {

    startDate = new Date(startDate);
    const milliSecPerDay = 1000 * 60 * 60 * 24;
    let endMilliSec = startDate.getTime() + milliSecPerDay * parseInt(numDays);

    let endDate = new Date(endMilliSec);
    return (endDate);
};


//This function return true/ false.
//@parem  roomType(string) -- RoomType
//@parem  numAdults(number) -- Number of Adults
//@parem  numKids(number) -- Number of kids
function getRoomCost(roomType, checkinDate, numNights) {

    let room = getRoomInfo(roomType);
    let roomCost = room[0].lowSeasonRate * parseInt(numNights);
    return parseFloat(roomCost);
}


//This function return true/ false.
//@parem  roomType(string) -- RoomType
//@parem  numAdults(number) -- Number of Adults
//@parem  numKids(number) -- Number of kids
function canRoomHoldCustomer(roomType, numAdults, numKids) {

    let numGuests = parseInt(numAdults) + parseInt(numKids);
    let room = getRoomInfo(roomType);

    if (room.length > 0) {
        // return room.filter(o => o.maxOccupancy >= numGuests).length;
        return (room[0].maxOccupancy >= numGuests);
    } else
        return false;
}

//This function return true/ false.
//@parem  roomType(string) -- RoomType
//@parem  numAdults(number) -- Number of Adults
//@parem  numKids(number) -- Number of kids
function getRoomInfo(roomType) {

    let room = hotelRates.filter(function(o) {
        return (o.roomType == roomType);
    });
    return room;
};

//This function return true/ false.
//@parem  roomType(string) -- RoomType
//@parem  numAdults(number) -- Number of Adults
//@parem  numKids(number) -- Number of kids
function getbreakfastCost(numAdults, numKids, numNights, discountType) {

    let breakfastCost = 0.0;

    if (discountType != "Senior") {
        breakfastCost = (6.96 * parseInt(numAdults) + 3.95 * parseInt(numKids)) * numNights;
    }
    return parseFloat(breakfastCost);
};

//This function return true/ false.
//@parem  roomType(string) -- RoomType
//@parem  numAdults(number) -- Number of Adults
//@parem  numKids(number) -- Number of kids
function getDiscount(roomCostBeforeDiscount, discountType) {

    let discount = 0.0;
    console.log("discountType: " + discountType);
    switch (discountType) {
        case "AAA":
        case "Senior":
            discount = roomCostBeforeDiscount * 0.1;
            break;
        case "Military":
            discount = roomCostBeforeDiscount * 0.2;
            break;
        case "None":
        default:
            discount = 0.0;
    };
    console.log("discountType: " + discountType + ",  Discount: " + discount);
    return parseFloat(discount);
};