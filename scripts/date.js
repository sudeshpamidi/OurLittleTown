"use strict"
/** This is helper function to findout end date based start date and  number of days.
 * @parem (date) startDate
 * @parem (number) number of days
 */
function getEndDate(startDate, numDays) {

    startDate = new Date(startDate);
    const milliSecPerDay = 1000 * 60 * 60 * 24;
    let endMilliSec = startDate.getTime() + milliSecPerDay * parseInt(numDays);

    let endDate = new Date(endMilliSec);
    return (endDate);
};

// returns the date into a string in yyyy-mm-dd format
// @parem (date) startDate
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
/**
 * Checks if a value is a valid date.
 *
 * @param  {*} value - The value.
 * @return {Boolean}
 */
function isDate(value) {
    switch (typeof value) {
        case 'number':
            return true;
        case 'string':
            return !isNaN(Date.parse(value));
        case 'object':
            if (value instanceof Date) {
                return !isNaN(value.getTime());
            }
        default:
            return false;
    }
}