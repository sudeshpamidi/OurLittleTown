//Dicription: This script contains supporting fucntions for hotel.html page
//Authot : Sudesh Pamidi
"use strict"

// hotelroom objects
let hotelRooms = [{ roomType: "Queen", maxOccupancy: 5, highSeasonRate: 250.00, lowSeasonRate: 150.00 },
    { roomType: "King", maxOccupancy: 2, highSeasonRate: 250.00, lowSeasonRate: 150.00 },
    { roomType: "King Suite", maxOccupancy: 4, highSeasonRate: 310.00, lowSeasonRate: 190.00 },
    { roomType: "2 Bedroom Suite", maxOccupancy: 6, highSeasonRate: 350.00, lowSeasonRate: 210.00 }
];

//peak season dates 
let seasonStartDate = new Date('2019-05-01');
let seasonEndDate = new Date('2019-09-30');

window.onload = function() {

    // getting all the controls tags
    const roomTypeField = document.getElementById("roomType");
    const checkinDateField = document.getElementById("checkinDate");
    const checkoutDateField = document.getElementById("checkoutDate");
    const noOfNightsField = document.getElementById("noOfNights");
    const adultsField = document.getElementById("adults");
    const kidsField = document.getElementById("kids");
    const breakfastFields = document.querySelectorAll("input[name=breakfast]"); // not in use
    const discountField = document.querySelector("input[name=discount]:checked"); // not in use
    const estimate = document.getElementById("estimate");
    const reset = document.getElementById("reset");
    const resultDiv = document.getElementById("results")
    const alertDiv = document.getElementById("alert")

    // set the date fields to today.
    initializeDates();

    // repopulate the num of nights/dates based on checkin/checkout dates
    checkinDateField.onblur = displayNumberOfNights;
    checkoutDateField.onblur = displayNumberOfNights;
    checkinDateField.onkeyup = displayNumberOfNights;
    checkoutDateField.onkeyup = displayNumberOfNights;
    noOfNightsField.onkeyup = displayCheckoutDate;

    //for (var i = 0; i < breakfastFields.length; i++) {
    //    breakfastFields[i].addEventListener("click", calculateAndDisplayRoomCost);
    //}

    //Displays the estimations on estimation button click
    estimate.onclick = displayEstimations;

    // Clear the resulrs div
    reset.onclick = clearResults;

    // Displays the calculated estimations.
    // Also it validates the room occupency and number of days.
    function displayEstimations() {

        if (!validateNumNights()) {
            return;
        };
        if (!validateRoomOccupency()) {
            return;
        }

        let roomCost = getRoomCost(roomTypeField.value, checkinDateField.value, noOfNightsField.value);

        let discountType = document.querySelector("input[name=discount]:checked").value;
        let discount = getDiscount(roomCost, discountType);

        let breakfastCost = 0.0;
        let breakfastVal = document.querySelector("input[name=breakfast]:checked").value;
        if (breakfastVal == "true") {
            breakfastCost = getbreakfastCost(adultsField.value, kidsField.value, noOfNightsField.value, "");
        }

        let tax = (roomCost + breakfastCost - discount) * 0.12;
        let totalCost = (roomCost + breakfastCost - discount) + tax;

        alertDiv.style.display = "none";
        resultDiv.style.display = "block";
        resultDiv.innerHTML = "<p><strong>Checkin Date:</strong> " + checkinDateField.value + "</p>" +
            "<p><strong>Checkout Date:</strong> " + checkoutDateField.value + "</p>" +
            "<p><strong>Hotel Cost:</strong> $" + (roomCost + breakfastCost).toFixed(2) + "</p>" +
            "<p class='red'><strong>Discount:</strong> ($" + discount.toFixed(2) + ")</p>" +
            "<p><strong>Tax:</strong> $" + tax.toFixed(2) + "</p>" +
            "<p><strong>Total Cost:</strong> $" + totalCost.toFixed(2) + "</p>";
    }

    //Function to clear the results
    //No parameters
    function clearResults() {
        resultDiv.style.display = "none";
        alertDiv.style.display = "none";
    };

    //Function to validate the data
    //No parameters    
    function validateNumNights() {

        let isValid = true;
        if (checkinDateField.value == "" || checkoutDateField.value == "") {
            alertDiv.style.display = "block";
            resultDiv.style.display = "none";
            alertDiv.innerHTML = "Invalid Date(s).";
            return false;
        }
        if (isNaN(noOfNightsField.value)) {
            alertDiv.style.display = "block";
            resultDiv.style.display = "none";
            alertDiv.innerHTML = "Number of Nights is invalid.";
            return false;
        }
        if (noOfNightsField.value > 28 || noOfNightsField.value <= 0) {
            alertDiv.style.display = "block";
            resultDiv.style.display = "none";
            alertDiv.innerHTML = "Invalid Date(s). Number of Nights is either invalid or cannot be more than 28 nights";
            return false;
        } else
            return true;
    }

    //Function to validate the Occupency 
    //takes no parameters  
    function validateRoomOccupency() {
        if (!canRoomHoldCustomer(roomTypeField.value, adultsField.value, kidsField.value)) {
            alertDiv.style.display = "block";
            resultDiv.style.display = "none";
            alertDiv.innerHTML = "The room type " + roomTypeField.value + " cannot hold all the occupants.";
            return false;
        } else
            return true;
    }

    //Function to initialize the date fiels to current date 
    //takes no parameters  
    function initializeDates() {
        let today = new Date();
        document.getElementById("today").innerHTML = today.toDateString() + " | 18° C";
        let todayString = getFormattDate(today);
        checkinDateField.defaultValue = todayString;
        checkoutDateField.defaultValue = todayString;
    }

    //Function to populate the number of days field based of checkin and checkout dates
    //takes no parameters  
    function displayNumberOfNights() {
        let numNights = getDateDiff(checkinDateField.value, checkoutDateField.value);
        if (numNights == 0) { numNights = 1; }
        noOfNightsField.value = numNights;
    };

    //Function to populate the checkout date based on number of days.
    //takes no parameters  
    function displayCheckoutDate() {
        let checkoutDate = getEndDate(checkinDateField.value, noOfNightsField.value)
        checkoutDateField.value = getFormattDate(checkoutDate);
    }

}

//This function calculates estimated cost for hotel room.
//@parem  roomType(string) -- RoomType
//@parem  numAdults(date) -- check in Date
//@parem  numNights(number) -- Number of Nights
function getRoomCost(roomType, checkinDate, numNights) {

    let chkoutDate = getEndDate(checkinDate, numNights)
    let chkinDate = new Date(checkinDate);
    let room = getRoomInfo(roomType);
    let roomCost = room[0].lowSeasonRate * parseInt(numNights);
    let highSeasonDays = 0

    if (chkinDate > seasonStartDate && chkoutDate < seasonEndDate) {
        roomCost = room[0].highSeasonRate * parseInt(numNights);
    }

    if (chkinDate < seasonStartDate && chkoutDate > seasonStartDate) {

        highSeasonDays = getDateDiff(chkinDate, seasonStartDate);
        roomCost = room[0].highSeasonRate * parseInt(highSeasonDays) + room[0].lowSeasonRate * (numNights - highSeasonDays);
    }

    if (chkinDate < seasonEndDate && chkoutDate > seasonEndDate) {

        highSeasonDays = getDateDiff(chkinDate, seasonEndDate);
        roomCost = room[0].highSeasonRate * parseInt(highSeasonDays) + room[0].lowSeasonRate * (numNights - highSeasonDays);
    }

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

//This returns room object for given room type
//@parem  roomType(string) -- RoomType
function getRoomInfo(roomType) {

    let room = hotelRooms.filter(function(o) {
        return (o.roomType == roomType);
    });
    return room;
};

//This function calculates the breakfast cost based on guest couunt and discount type.
//@parem  numAdults(number) -- Number of Adults
//@parem  numKids(number) -- Number of kids
//@parem  numNights(number) -- Number of nights
//@parem  discountType(string) -- Discount Type
function getbreakfastCost(numAdults, numKids, numNights, discountType) {

    let breakfastCost = 0.0;

    if (discountType != "Senior") {
        breakfastCost = (6.96 * parseInt(numAdults) + 3.95 * parseInt(numKids)) * numNights;
    }
    return parseFloat(breakfastCost);
};

//This function calculate the discount amount
//@parem  roomCostBeforeDiscount(number) -- totol basic room cost
//@parem  discountType(string) -- discount Type
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