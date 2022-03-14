<template>
  <n-message-provider>
    <div id="container">
      <!-- <div>{{ counter }}</div> -->
      <Map id="map"></Map>
      <Panel id="panel"></Panel>
    </div>
  </n-message-provider>
</template>

<script>
import Map from "@/components/Map/MapBox";
import Panel from "@/components/Control/controlPanel";
//import { ref } from "vue";
import { NMessageProvider } from "naive-ui";

export default {
  name: "App",
  components: {
    Map,
    Panel,
    NMessageProvider,
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
  width: 400px;
  text-align: center;
  background-color: aliceblue;
}
</style>
