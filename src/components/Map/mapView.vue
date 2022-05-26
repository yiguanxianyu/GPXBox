<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-polylinedecorator"
import {getCurrentInstance, onMounted} from "vue";

let map;
let gpxPolyline;
let gpxLineDecorator;
let animP;
let polyline;

const addMap = () => {
  map = L.map("map", {
    center: [39.99, 116.303],
    zoom: 15,
    attributionControl: false
  });
};

const addScale = map => {
  L.control.scale({
    maxWidth: 100,
    metric: true,
    imperial: false,
  }).addTo(map);
};

const addTile = map => {
  let tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  L.tileLayer(tileUrl, {minZoom: 7, maxZoom: 19}).addTo(map);
};

const eventBus = getCurrentInstance().appContext.config.globalProperties.$bus;

eventBus.$on('sendPolyline', inputPolyline => {
  gpxPolyline.setLatLngs(inputPolyline);
  gpxLineDecorator.setPaths(gpxPolyline.getLatLngs());
  map.fitBounds(gpxPolyline.getBounds())

  // 实时轨迹线
  if (animP === undefined) {
    //第一次读入
    animP = L.polyline([inputPolyline[0]], {
      weight: 4,
      color: '#ff6500'
    }).addTo(map);
  } else {
    //重新读入
    animP.setLatLngs([inputPolyline[0]])
  }
  polyline = inputPolyline;
});

eventBus.$on('backToStart', () => {
  let startPoint = animP.getLatLngs()[0];
  animP.setLatLngs([startPoint]);
})

eventBus.$on('indexChanged', index => {
  animP.setLatLngs(polyline.slice(0, index));
});

eventBus.$on('sliderValueChanged', index => {
  animP.setLatLngs(polyline.slice(0, index))
});

onMounted(() => {
  addMap();
  addScale(map);
  addTile(map);

  gpxPolyline = L.polyline([], {weight: 4, color: '#00ad53'}).addTo(map);

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
          color: '#0f2fe0'
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
