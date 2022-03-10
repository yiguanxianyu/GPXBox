<template>
  <div id="map"></div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getCurrentInstance, onMounted } from "vue";

export default {
  setup() {
    let map = null;
    let mainLayer = null;

    const addMap = () => {
      map = L.map("map", {
        center: [51.508, -0.11],
        layers: [],
        zoom: 14,
      });
    };

    const addScale = (map) => {
      let scale = L.control.scale({
        maxWidth: 200,
        metric: true,
        imperial: false,
      });
      scale.addTo(map);
    };

    const addTile = (map) => {
      const image = L.tileLayer(
        "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 18,
        }
      );
      image.addTo(map);
    };

    const addCircle = (file) => {
      let circle = L.circle([51.508, -0.11], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: 500,
      });
      circle.addTo(mainLayer);

      console.log(file);
    };

    onMounted(() => {
      addMap();
      addScale(map);
      addTile(map);

      mainLayer = L.layerGroup();
      mainLayer.addTo(map);

      const ctx = getCurrentInstance().appContext.config.globalProperties;
      ctx.$bus.$on("click", addCircle);
    });

    return {
      addCircle,
    };
  },
};
</script>

<style>
#map-container {
  width: 100%;
  height: 100%;
}
</style>