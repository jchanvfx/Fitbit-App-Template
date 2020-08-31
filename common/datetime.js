export const DATE_TODAY = new Date();
export const DAYS = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday"
];
export const DAYS_SHORT = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
];
export const MONTHS = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
];
export const MONTHS_SHORT = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul",
    "Aug", "Sep", "Oct", "Nov", "Dec"
];
export const formatDayName        = (date) => {return DAYS[date.getDay()];}
export const formatDayShortName   = (date) => {return DAYS_SHORT[date.getDay()];}
export const formatMonthName      = (date) => {return MONTHS[date.getMonth()];}
export const formatMonthShortName = (date) => {return MONTHS_SHORT[date.getMonth()];}
export const format12hrTime       = (date) => {
    let hours = date.getHours();
    let mins  = date.getMinutes();
    mins      = (mins < 10) ? "0" + mins : mins;
    let ampm  = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // hour "0" should be '12'
    return {hours:`${hours}`, mins:`${mins}`, ampm:`${ampm}`};
}
export function formatMilliseconds(msecs) {
    let seconds = (msecs / 1000).toFixed(0);
    let minutes = Math.floor(seconds / 60);
    let hours;
    if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        hours = zeroPad(hours);
        minutes = minutes - hours * 60;
        minutes = zeroPad(minutes);
    }
    seconds = Math.floor(seconds % 60);
    seconds = zeroPad(seconds);
    if (hours) {
        return `${hours}:${minutes}:${seconds}`;
    }
    return `${minutes}:${seconds}`;
}