import GpxParser from 'gpxparser'
import {mean} from "@/components/utils";

function GpxProcess(fileText) {
    let gpx = new GpxParser();
    gpx.parse(fileText);

    let data = gpx.tracks[0];
    let dist = data.distance.cumul;
    let points = data.points;

    let timeArr = points.map((item) => {
        return item.time;
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
    speedArr[dataLength - 1] = 1000 * (dist[dataLength - 1] - dist[dataLength - 2]) / (points[dataLength - 1].time - points[dataLength - 2].time);

    this.timeArr = timeArr;
    this.speedArr = speedArr;
    this.gpx = gpx;
}

GpxProcess.prototype.getData = function () {
    let timeArr = this.timeArr;
    let speedArr = this.speedArr;
    let dataLength = timeArr.length;

    let chartDataArr = new Array(dataLength)
    for (let i = 0; i < dataLength; i++) {
        chartDataArr[i] = {value: [+timeArr[i], speedArr[i]]};
    }
    return chartDataArr
}

GpxProcess.prototype.getDataAsKmPreHour = function () {
    let timeArr = this.timeArr;
    let speedArr = this.speedArr;
    let dataLength = timeArr.length;

    let chartDataArr = new Array(dataLength)
    for (let i = 0; i < dataLength; i++) {
        chartDataArr[i] = {value: [+timeArr[i], 3.6 * speedArr[i]]};
    }

    return chartDataArr
}

GpxProcess.prototype.getDataAsMinutePerKm = function () {
    let timeArr = Array.from(this.timeArr);
    let speedArr = Array.from(this.speedArr);
    let dataLength = timeArr.length;

    let currPace;
    let chartDataArr = new Array(dataLength);

    let total_time = timeArr[timeArr.length - 1] - timeArr[0];
    let total_dist = this.gpx.tracks[0].distance.total
    let avgPace = total_time / (60 * total_dist);

    for (let i = 0; i < dataLength; i++) {
        if (speedArr[i] < 0.2) {
            let tempSpeed;
            if (i > 1 && i < dataLength - 2) {
                tempSpeed = speedArr.slice(i - 2, i + 2);
            } else if (i === 1 || i === dataLength - 2) {
                tempSpeed = speedArr.slice(i - 1, i + 1);
            } else {
                tempSpeed = speedArr;
            }
            currPace = 50 / (3 * mean(tempSpeed));
        } else {
            currPace = 50 / (3 * speedArr[i]);
        }

        if (currPace > avgPace * 3) currPace = 0;

        chartDataArr[i] = {value: [+timeArr[i], currPace]};
    }

    return chartDataArr
}

GpxProcess.prototype.toPolyline = function () {
    let points = this.gpx.tracks[0].points;
    let dataLength = points.length;
    let polyline = new Array(dataLength);
    let currPoint;
    for (let i = 0; i < dataLength; i++) {
        currPoint = points[i];
        polyline[i] = [currPoint.lat, currPoint.lon];
    }
    return polyline;
}

export default GpxProcess;