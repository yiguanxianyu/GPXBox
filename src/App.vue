<template>
  <div id="container">
    <div id="counter">{{ counter }}</div>
    <Map id="map"></Map>
    <Panel id="panel"></Panel>
  </div>
</template>

<script>
import Map from "./Map/MapBox";
import Panel from "./Control/controlPanel";
import { ref } from "vue";

export default {
  name: "App",
  components: {
    Map,
    Panel,
  },
  setup() {
    let counter = ref(1);

    const add = () => {
      counter.value++;
    };

    return {
      counter,
      add,
    };
  },
  mounted() {
    this.$bus.$on("fileRead", this.add);
  },
};
</script>

<style>
body {
  margin: 0;
  overflow-y: hidden;
}

#container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
}

#map {
  flex-grow: 1;
}

#panel {
  width: 300px;
  text-align: center;
  background-color: wheat;
}
</style>
