<template>
  <n-message-provider>
    <div id="container-up-down">

      <div id="container-left-right">

        <Map id="map"></Map>
        <Panel id="panel" ref="panel"></Panel>

      </div>

      <Vc id="map-charts"></Vc>

    </div>
  </n-message-provider>
</template>

<script setup>
import Map from "@/components/Map/MapBox";
import Panel from "@/components/Control/controlPanel";
import Vc from "@/components/Chart/viewChart";
//import { ref } from "vue";
import {NMessageProvider} from "naive-ui";

</script>

<style>
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  overflow-y: hidden;
}

#container-up-down {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

#container-left-right {
  /*flex-grow: 1;*/
  height: 70vh;
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
}

#map-charts {
  /*flex-grow: 1;*/
  margin: 0 auto;
  height: 30vh;
  text-align: center;
}

#map {
  /*flex-grow: 1;*/
  height: 100%;
  width: 100%;
}

#panel {
  /*flex-grow: 1;*/
  width: 30vw;
  min-width: 300px;
  max-width: 600px;
  text-align: center;
  background-color: aliceblue;
}
</style>
