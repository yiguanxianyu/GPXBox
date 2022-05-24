<template>
  <div id="map"></div>
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-polylinedecorator"
import {getCurrentInstance, onMounted} from "vue";

let map;
let gpxPolyline;
let gpxLineDecorator;
let speedRatio = 1;
let index;
let setTimeoutID = [];
let animP;
let dataLength;
let inputPolyline;
let timeDelta;

const addMap = () => {
  map = L.map("map", {
    center: [39.99, 116.303],
    zoom: 15,
    attributionControl: false
  });
};

const addScale = (map) => {
  L.control.scale({
    maxWidth: 100,
    metric: true,
    imperial: false,
  }).addTo(map);
};

const addTile = (map) => {
  let tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  L.tileLayer(tileUrl, {minZoom: 7, maxZoom: 19}).addTo(map);
};

const addCircle = () => {
  /*L.motion
    .polyline(
      [
        [39.990, 116.3030],
        [39.991, 116.3036],
        [39.993, 116.3039],
        [39.996, 116.3033],
        [39.992, 116.3010],
      ],
      {
        color: "red",
      },
      {
        auto: true,
        duration: 5000,
        easing: L.Motion.Ease.easeInOutQuart,
      },
      {
        removeOnEnd: false,
        icon: L.icon({
          iconUrl: "../assets/logo.png",
          iconSize: [25.1, 25],
        }),
      }
    )
    .addTo(map);*/
};

const ctx = getCurrentInstance().appContext.config.globalProperties;
ctx.$bus.$on('fileRead', addCircle);
ctx.$bus.$on('speedRatioChanged', (sc) => {
  speedRatio = sc;
})

ctx.$bus.$on('sendPolyline', (input) => {
  gpxPolyline.setLatLngs(input.polyline);
  gpxLineDecorator.setPaths(input.polyline);
  map.fitBounds(gpxPolyline.getBounds())

  // 实时轨迹线
  if (animP === undefined) {
    //第一次读入
    animP = L.polyline([{lat: input.polyline[0][0], lon: input.polyline[0][1]}], {
      smoothFactor: 0.5,
      weight: 4,
      color: '#ff6500'
    }).addTo(map);
  } else {
    //重新读入
    animP.setLatLngs([{lat: input.polyline[0][0], lon: input.polyline[0][1]}])
  }

  index = 0;
  dataLength = input.polyline.length;
  timeDelta = input.timeDelta;

  let inputPl = new Array(dataLength);
  for (let i = 0; i < dataLength; i++) {
    let point = input.polyline[i];
    inputPl[i] = {lat: point[0], lon: point[1]}
  }
  inputPolyline = inputPl;
});

ctx.$bus.$on('play', () => {
  let set = () => {
    if (index < dataLength - 1) {
      animP.addLatLng(inputPolyline[index]);
      setTimeoutID.push(setTimeout(set, timeDelta[index] / speedRatio));
      index++;
    }
  }
  setTimeoutID.push(setTimeout(set, 0));
});

ctx.$bus.$on('pause', () => {
  for (let j = 0, idLength = setTimeoutID.length; j < idLength; j++) {
    clearTimeout(setTimeoutID[j]);
  }
});

ctx.$bus.$on('backToStart', () => {
  index = 0;
  let startPoint = animP.getLatLngs()[0];
  animP.setLatLngs([startPoint]);
})

onMounted(() => {
  addMap();
  addScale(map);
  addTile(map);

  gpxPolyline = L.polyline([],
      {smoothFactor: 0.5, weight: 4, color: '#00ad53'}).addTo(map);

  gpxLineDecorator = L.polylineDecorator([], {
    patterns: [{
      repeat: 50,
      symbol: L.Symbol.arrowHead({
        pixelSize: 5,
        headAngle: 75,
        polygon: false,
        pathOptions: {
          stroke: true,
          weight: 2,
          color: '#f5f5dc'
        }
      })
    }]
  }).addTo(map);
});
</script>

<style>
#map {
  width: 100%;
  height: 100%;
}
</style>