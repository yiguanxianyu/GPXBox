<template>
  <div id="map"></div>
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-gpx";
import "leaflet.motion/dist/leaflet.motion.min.js";
import "@/components/Control/L.Polyline.SnakeAnim.js"
import {getCurrentInstance, onMounted} from "vue";

let map;
let mainLayer;

const addMap = () => {
  map = L.map("map", {
    center: [39.99, 116.303],
    layers: [],
    zoom: 15,
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

const addCircle = (file) => {
  // console.log(file);
  // let circle = L.circle([39.985699, 116.303039], {
  //   color: "red",
  //   fillColor: "#f03",
  //   fillOpacity: 0.5,
  //   radius: 50,
  // });
  // circle.addTo(mainLayer);

  let gpxUrl = window.URL.createObjectURL(file);

  new L.GPX(gpxUrl, {async: true})
      .on("loaded", function (e) {
        map.fitBounds(e.target.getBounds());
      })
  //.addTo(map);

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
ctx.$bus.$on("fileRead", addCircle);

ctx.$bus.$on('sendPolyline', (input) => {
  let pl = L.polyline(input, {snakingSpeed: 200});
  pl.addTo(map).snakeIn();
});

onMounted(() => {
  addMap();
  addScale(map);
  addTile(map);

  mainLayer = L.layerGroup();
  mainLayer.addTo(map);

});
</script>

<style>
#map {
  width: 100%;
  height: 100%;
}
</style>