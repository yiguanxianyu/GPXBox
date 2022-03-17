<template>
  <div>
    <n-space vertical>
      <n-card
        id="title"
        :bordered="false"
        title="GPXbox"
        header-style="font-size:2.5em"
      ></n-card>
      <!--这个是网页的标题-->

      <n-space justify="space-around">
        <GPXreader></GPXreader>

        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button type="primary" @click="otherClick" size="large">其他功能</n-button>
          </template>
          <span> 别看了，还没做呢 </span>
        </n-tooltip>
      </n-space>

      <!--以上是乱七八糟的按钮-->
      <div id="gd"></div>
    </n-space>
  </div>
</template>

<script setup>
import GPXreader from "./readGPX";
import { NSpace, NCard, NButton, NTooltip, useMessage } from "naive-ui";
import { onMounted } from "vue";
import Plotly from "plotly.js-dist-min";

const message = useMessage();

const otherClick = () => {
  message.success("别点了，真的还没做呢");
};

onMounted(() => {
  let layout = {
    title: "Scroll and Zoom",
    //showlegend: false,
  };
  let data = [{ x: [1, 2, 3], y: [1, 0.2, 2] }];
  Plotly.newPlot("gd", data, layout, { scrollZoom: false });
});
</script>

<style>
#title {
  background-color: rgba(0, 0, 0, 0);
}

#gd {
  position: absolute;
  bottom: 0;
  width: 590px;
  height: 280px;
  margin: 5px 5px;
  background-color: rgba(0, 0, 0, 0);
}
</style>