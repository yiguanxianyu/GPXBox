<template>
  <div id="map"></div>
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.motion/dist/leaflet.motion.min.js";
import "leaflet-polylinedecorator"
import {getCurrentInstance, onMounted} from "vue";

let map;
let gpxPolyline;
let speedScale = 1;

const addMap = () => {
  map = L.map("map", {
    center: [39.99, 116.303],
    zoom: 15,
    preferCanvas: true
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
ctx.$bus.$on('speedScaleChanged', (sc) => {
  speedScale = sc
})

ctx.$bus.$on('sendPolyline', (input) => {
  gpxPolyline.setLatLngs(input.polyLine);

  L.polylineDecorator(input.polyLine, {
    patterns: [{
      repeat: 50,
      symbol: L.Symbol.arrowHead({
        pixelSize: 4,
        headAngle: 75,
        polygon: false,
        pathOptions: {
          stroke: true,
          weight: 1,
          color: '#d20b0b'
        }
      })
    }]
  }).addTo(map);

  map.fitBounds(gpxPolyline.getBounds())
  let setTimeoutID = [];
  // 实时轨迹线
  let animP = L.polyline([{lat: input.polyLine[0][0], lon: input.polyLine[0][1]}], {
    weight: 8,
    color: '#FF9900'
  }).addTo(map);

  let dataLength = input.polyLine.length;
  let i = 0;


  let set = () => {
    if (i < dataLength - 1) {
      let point = input.polyLine[i];
      animP.addLatLng({lat: point[0], lon: point[1]});

      let timeDelta = (input.timeArr[i + 1] - input.timeArr[i]) / speedScale;
      setTimeoutID.push(setTimeout(set, timeDelta));
      i++;
    }
  }

  setTimeoutID.push(setTimeout(set, 0));

});

onMounted(() => {
  addMap();
  addScale(map);
  addTile(map);

  gpxPolyline = L.polyline([], {smoothFactor: 0.5}).addTo(map);

});
</script>

<style>
#map {
  width: 100%;
  height: 100%;
}
</style>