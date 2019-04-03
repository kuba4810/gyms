async function addXDays(daysCount) {

    let date = new Date();
    let day = parseInt(date.getDate());
    let month = parseInt(date.getMonth());
    let year = parseInt(date.getFullYear());
    let isLeapYear = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    let monthDays = [31, (isLeapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    for (let i = 0; i < daysCount; i++) {


        if (month === 11 && day === 31) {
            day = 1;
            month = 0;
            year++;
            isLeapYear = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
            monthDays = [31, (isLeapYear ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        } else if(day === monthDays[month]){
            day = 1;
            month ++;
        } else {
            day ++;
        }
    }

    console.log('Wygenerowana data : ',`${year}-${month}-${day}`)
    return `${year}-${month}-${day}`;
}

module.exports = {
    addXDays: addXDays
}