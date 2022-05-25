import GpxParser from 'gpxparser'
import {formatSecond} from "@/components/utils";

function GpxProcess(fileText) {
    let gpx = new GpxParser();
    gpx.parse(fileText);

    let data = gpx.tracks[0];
    let dist = data.distance.cumul;//累积距离
    let points = data.points;

    let timeArr = points.map((item) => {
        return +item.time;
    });

    const dataLength = dist.length;
    let diffDistArr = new Array(dataLength + 10);
    let diffTimeArr = new Array(dataLength + 10);
    let speedArr = new Array(dataLength);
    let diffDist, diffTime;

    for (let i = 0; i < 5; i++) {
        diffDistArr[i] = 0;
        diffTimeArr[i] = timeArr[0];
    }
    for (let i = 5; i < dataLength + 5; i++) {
        diffDistArr[i] = dist[i - 5];
        diffTimeArr[i] = timeArr[i - 5];
    }
    for (let i = dataLength + 5; i < dataLength + 10; i++) {
        diffDistArr[i] = dist[dataLength - 1];
        diffTimeArr[i] = timeArr[dataLength - 1];
    }
    for (let i = 0; i < dataLength; i++) {
        diffDist = diffDistArr[i + 10] - diffDistArr[i];
        diffTime = diffTimeArr[i + 10] - diffTimeArr[i];
        speedArr[i] = 1000 * diffDist / diffTime;
    }

    this.speedArr = speedArr;
    this.gpx = gpx;
    this.dataLength = dataLength;
    this._timeArr = timeArr;
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
        const dataLength = this.dataLength;

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
        const dataLength = this.dataLength;

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
        const dataLength = this.dataLength;
        const speedArr = new Array(dataLength + 10).fill(0);

        for (let i = 5; i < dataLength + 5; i++) {
            speedArr[i] = this.speedArr[i];
        }

        const total_time = timeArr[timeArr.length - 1] - timeArr[0];
        const total_dist = this.gpx.tracks[0].distance.total
        const avgPace = total_time / (60 * total_dist);

        let chartDataArr = new Array(dataLength);
        let currPace;
        for (let i = 0; i < dataLength; i++) {
            currPace = 50 / (3 * speedArr[i]);
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
        const dataLength = this.dataLength;
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
        const dataLength = this.dataLength;
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
            formatSecond(speedAsMinutePerKm * 1000) + '/km'
        ];

        stats.cumulDist = this.gpx.tracks[0].distance.cumul;
        stats.timeArr = this._timeArr;

        this._stats = stats;
    }
    return this._stats;
}


export default GpxProcess;