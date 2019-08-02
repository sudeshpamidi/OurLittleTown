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
    const noOfNightsField = document.getElementById("noOfNights");
    const adultsField = document.getElementById("adults");
    const kidsField = document.getElementById("kids");
    const breakfastField = document.querySelectorAll("input[name=breakfast]");
    const discountField = document.querySelectorAll("input[name=discount]");
    const estimate = document.getElementById("estimate");
    const reset = document.getElementById("reset");

    let roomInfo = getRoomInfo("Queeen");

    let isRoomAvailable = canRoomHoldCustomer("Queen", 1, 1);
    console.log("is room availa " + isRoomAvailable);

    estimate.onclick = calculateAndDisplayRoomCost;
    /*    noOdScoops.onchange = displayPrice;
        hotFudge.onclick = displayPrice;
        sprinkle.onclick = displayPrice;
        whipCream.onclick = displayPrice;
    */
    reset.onclick = clearResults;

    function displayEsimate() {

        let roomCost = calculateRoomCost();
        results.style.display = "block";
        results.innerHTML = "<strong>Room Cost:</strong> $" + roomCost.toFixed(2);

    }


    //Calculate the room cost
    function calculateAndDisplayRoomCost() {
        let roomCost = 0.0;
        let discount = 0.0;
        let breakfastCost = 0.0;

        roomCost = getRoomCost(roomTypeField.value, checkinDateField.value, noOfNightsField.value);
        discount = getDiscount(roomCost, "AAA");
        breakfastCost = getbreakfastCost(adultsField.value, kidsField.value, noOfNightsField.value, "");


        results.style.display = "block";
        results.innerHTML = "<p><strong>Car Rental:</strong> $" + (roomCost + breakfastCost).toFixed(2) + "</p>" +
            "<p><strong>Options:</strong> $" + discount.toFixed(2) + "</p>" +
            "<p><strong>Surchange:</strong> $" + breakfastCost.toFixed(2) + "</p>";


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
    switch (discountType) {
        case "AAA", "Senior":
            discount = roomCostBeforeDiscount * 0.1;
            break;
        case "Military":
            discount = roomCostBeforeDiscount * 0.2;
            break;
        case "None": //no break;
        default:
            discount = 0.0;
    };
    return parseFloat(discount);
};