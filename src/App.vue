<template>
  <n-message-provider>

    <div id="container-up-down">

      <div id="container-left-right">
        <Map id="map"/>
        <Panel id="panel"/>
      </div>

      <Vc id="map-charts"/>
    </div>

  </n-message-provider>
</template>

<script setup>
import Map from "@/components/Map/mapView";
import Panel from "@/components/Control/controlPanel";
import Vc from "@/components/Chart/viewChart";
import {NMessageProvider} from "naive-ui";</script>

<style>
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  overflow-y: hidden;
}

#container-up-down {
  display: flex;
  flex-direction: column;
}

#container-left-right {
  height: 70vh;
  display: flex;
  align-items: stretch;
}

#map-charts {
  margin: 0 auto;
  height: 30vh;
  text-align: center;
}

#panel {
  width: 30vw;
  min-width: 300px;
  max-width: 600px;
  text-align: center;
  background-color: aliceblue;
}
</style>
