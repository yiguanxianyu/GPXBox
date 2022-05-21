<template>
  <n-space vertical>
    <n-card
        id="title"
        :bordered="false"
        header-style="font-size:2.5em"
        title="GPXbox"
    ></n-card>
    <!--这个是网页的标题-->

    <n-space justify="space-around">
      <GPXreader></GPXreader>

      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button size="large" type="primary" @click="otherClick">其他功能</n-button>
        </template>
        别看了，还没做呢
      </n-tooltip>
    </n-space>

    <n-space justify="space-around">
      <n-button secondary strong @click="clickPlayButton">
        <n-icon>
          <play/>
        </n-icon>
        &nbsp;播放
      </n-button>

      <n-button secondary strong @click="clickPauseButton">
        <n-icon>
          <pause/>
        </n-icon>
        &nbsp;暂停
      </n-button>

      <n-dropdown :options="speedScaleOption" trigger="hover" @select="handleSpeedScaleSelect">
        <n-button secondary strong>
          <n-icon>
            <speedometer/>
          </n-icon>&nbsp;倍速
        </n-button>
      </n-dropdown>
    </n-space>

  </n-space>
</template>

<script setup>
// noinspection SpellCheckingInspection
import GPXreader from "./readGPX";
import {getCurrentInstance, ref} from "vue";
import {NButton, NCard, NDropdown, NIcon, NSpace, NTooltip, useMessage} from "naive-ui";
import {Pause, Play, Speedometer} from "@vicons/ionicons5";

const message = useMessage();

const ctx = getCurrentInstance().appContext.config.globalProperties;

const otherClick = () => {
  message.success("别点了，真的还没做呢");
  ctx.$bus.$emit("titleRead", {
    title: {
      text: "Success",
      left: "center"
    },
  });
};

const speedScaleOption = ref([
  {label: '1倍速', key: 1},
  {label: '1.25倍速', key: 1.25},
  {label: '1.5倍速', key: 1.5},
  {label: '2倍速', key: 2},
  {label: '4倍速', key: 4},
  {label: '8倍速', key: 8},
  {label: '16倍速', key: 16},
])

function handleSpeedScaleSelect(key) {
  message.info(String(key) + '倍速');
  ctx.$bus.$emit('speedScaleChanged', key);
  //TODO
}

function clickPlayButton(params) {
  console.log(params);
  //TODO
}

function clickPauseButton(params) {
  console.log(params);
  //TODO
}

</script>

<style>
#title {
  background-color: rgba(0, 0, 0, 0);
}

</style>