import GpxParser from 'gpxparser'
import {formatSecond, mean} from "@/components/utils";

function GpxProcess(fileText) {
    let gpx = new GpxParser();
    gpx.parse(fileText);

    let data = gpx.tracks[0];
    let dist = data.distance.cumul;
    let points = data.points;

    let timeArr = points.map((item) => {
        return +item.time;
    });

    let dataLength = dist.length;
    let speedArr = new Array(dataLength);
    let diffDist, diffTime;
    for (let i = 0; i < dataLength - 2; i++) {
        diffDist = dist[i + 2] - dist[i];
        diffTime = timeArr[i + 2] - timeArr[i];
        speedArr[i + 1] = 1000 * diffDist / diffTime;
    }

    speedArr[0] = 1000 * dist[0] / (points[1].time - points[0].time);
    speedArr[dataLength - 1] = 1000 * (dist[dataLength - 1] - dist[dataLength - 3]) / (points[dataLength - 1].time - points[dataLength - 3].time);

    this._timeArr = timeArr;
    this.speedArr = speedArr;
    this.gpx = gpx;
    this._data = null;
    this._dataAsKmPreHour = null;
    this._dataAsMinutePerKm = null;
    this._polyline = null;
    this._stats = null;
}

GpxProcess.prototype.getData = function () {
    if (this._data === null) {
        const timeArr = this._timeArr;
        const speedArr = this.speedArr;
        const dataLength = timeArr.length;

        let chartDataArr = new Array(dataLength)
        for (let i = 0; i < dataLength; i++) {
            chartDataArr[i] = {value: [timeArr[i], speedArr[i]]};
        }
        this._data = chartDataArr;
    }

    return this._data;
}

GpxProcess.prototype.getDataAsKmPreHour = function () {
    if (this._dataAsKmPreHour === null) {
        const timeArr = this._timeArr;
        const speedArr = this.speedArr;
        const dataLength = timeArr.length;

        let chartDataArr = new Array(dataLength)
        for (let i = 0; i < dataLength; i++) {
            chartDataArr[i] = {value: [timeArr[i], 3.6 * speedArr[i]]};
        }
        this._dataAsKmPreHour = chartDataArr;
    }

    return this._dataAsKmPreHour;
}

GpxProcess.prototype.getDataAsMinutePerKm = function () {
    if (this._dataAsMinutePerKm === null) {

        const timeArr = this._timeArr;
        const speedArr = this.speedArr;
        const dataLength = timeArr.length;

        const total_time = timeArr[timeArr.length - 1] - timeArr[0];
        const total_dist = this.gpx.tracks[0].distance.total
        const avgPace = total_time / (60 * total_dist);

        let chartDataArr = new Array(dataLength);
        let tempSpeed;
        let currPace;
        for (let i = 0; i < dataLength; i++) {
            if (speedArr[i] < 0.2) {
                if (i > 1 && i < dataLength - 2) {
                    tempSpeed = speedArr.slice(i - 2, i + 2);
                } else if (i === 1 || i === dataLength - 2) {
                    tempSpeed = speedArr.slice(i - 1, i + 1);
                } else if (i === 0) {
                    tempSpeed = speedArr.slice(0, 2);
                } else {
                    tempSpeed = speedArr.slice(dataLength - 2, dataLength);
                }
                currPace = 50 / (3 * mean(tempSpeed));
            } else {
                currPace = 50 / (3 * speedArr[i]);
            }

            if (currPace > avgPace * 3) currPace = 0;

            chartDataArr[i] = {value: [timeArr[i], currPace]};
        }

        this._dataAsMinutePerKm = chartDataArr;
    }

    return this._dataAsMinutePerKm;
}

GpxProcess.prototype.toPolyline = function () {
    if (this._polyline === null) {
        const points = this.gpx.tracks[0].points;
        const dataLength = points.length;
        let polyline = new Array(dataLength);
        let currPoint;
        for (let i = 0; i < dataLength; i++) {
            currPoint = points[i];
            polyline[i] = [currPoint.lat, currPoint.lon];
        }
        this._polyline = polyline;
    }

    return this._polyline;
}

GpxProcess.prototype.getTimeArr = function () {
    return this._timeArr;
}
GpxProcess.prototype.getStats = function () {
    if (this._stats === null) {
        let stats = {};
        const dataLength = this._timeArr.length;
        const _totalTime = this.gpx.tracks[0].points[dataLength - 1].time - this.gpx.tracks[0].points[0].time;
        stats.numPoints = dataLength;
        stats.totalTime = formatSecond(_totalTime)
        stats.totalDistance = this.gpx.tracks[0].distance.total.toFixed();
        const speed = 1000 * stats.totalDistance / _totalTime;
        const speedAsKmPreHour = speed * 3.6;
        const speedAsMinutePerKm = 1000 / speed;

        stats.meanSpeed = [
            speed.toFixed(2) + 'm/s',
            speedAsKmPreHour.toFixed(2) + 'km/h',
            speedAsMinutePerKm.toFixed(0) + 'sec/km'
        ];
        console.log(stats.meanSpeed);
        this._stats = stats;
    }
    return this._stats;
}


export default GpxProcess;