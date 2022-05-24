export function mean(numArr) {
    let dataLength = numArr.length;

    if (dataLength === undefined) {
        return numArr;
    } else {
        let sum = 0;
        for (let i = 0; i < dataLength; i++) {
            sum += numArr[i];
        }
        return sum / dataLength;
    }
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


export function formatSecond(time) {
    time = time / 1000;
    const h = parseInt(time / 3600);
    const minute = parseInt(time / 60 % 60);
    const second = Math.ceil(time % 60);

    const hours = h < 10 ? '0' + h : h;
    const formatSecond = second > 59 ? 59 : second;
    return `${hours > 0 ? `${hours}:` : ''}${minute < 10 ? '0' + minute : minute}:${formatSecond < 10 ? '0' + formatSecond : formatSecond}`;
}
