export function mean(numArr) {
    let dataLength = numArr.length;
    let sum = 0;
    for (let i = 0; i < dataLength; i++) {
        sum += numArr[i];
    }
    return sum / dataLength;
}

export function round(number, precision = 0) {
    let temp = Math.pow(10, precision)
    return Math.round(number * temp) / temp;
}

export function timeFormat(inputData) {
    const dt = new Date(inputData);

    let year = dt.getFullYear();//年
    let month = dt.getMonth() + 1;//月；从0开始所以要加1
    let date = dt.getDate();//日
    let hour = dt.getHours();
    let minutes = dt.getMinutes();
    let seconds = dt.getSeconds();

    month = month > 9 ? month : "0" + month;
    date = date > 9 ? date : "0" + date;
    hour = hour > 9 ? hour : "0" + hour;
    minutes = minutes > 9 ? minutes : "0" + minutes;
    seconds = seconds > 9 ? seconds : "0" + seconds;

    return `${year}-${month}-${date} ${hour}:${minutes}:${seconds}`;
}