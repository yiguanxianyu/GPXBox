<template>
  <n-space justify="space-around" vertical>
    <n-card
        id="title"
        :bordered="false"
        header-style="font-size:2.5em"
        title="GPXbox"
    ></n-card>
    <!--这个是网页的标题-->

    <n-space justify="space-evenly">
      <GPXreader/>
      <n-button secondary strong @click="clickPlayButton">
        <n-icon :component="Play"/>
        &nbsp;播放
      </n-button>

      <n-button secondary strong @click="clickPauseButton">
        <n-icon :component="Pause"/>
        &nbsp;暂停
      </n-button>
    </n-space>

    <n-space justify="space-evenly">
      <n-button secondary strong @click="clickPlayButton">
        <n-icon :component="PlayBack"/>
        &nbsp;倒放
      </n-button>

      <n-button secondary strong @click="clickBackToStartButton">
        <n-icon :component="ReturnUpBack"/>
        &nbsp;回到起点
      </n-button>

      <n-dropdown :options="speedUnitOptions" trigger="hover" @select="handleSpeedUnitChanged">
        <n-button secondary strong>
          <n-icon :component="BarChart"/>
          &nbsp;速度单位
        </n-button>
      </n-dropdown>
    </n-space>

    <n-tooltip trigger="hover">
      <template #trigger>
        <n-input-number id="inputNumber" :default-value="1" :max="5" :min="0.1" :value="speedRatio"
                        @update:value="handleSpeedRatioChanged">
          <template #suffix>
            倍速
          </template>
          <template #prefix>
            <n-icon :component="Speedometer" :depth="1"/>
          </template>
        </n-input-number>
      </template>
      允许设置的倍速范围为 0.1 ~ 5
    </n-tooltip>

    <n-grid :cols="2" x-gap="4">
      <n-gi class="statsLabel">总里程</n-gi>
      <n-gi class="statsLabel">总时间</n-gi>
      <n-gi class="statsData">
        <n-icon :component="Analytics"/>
        {{ totalDistance }}
      </n-gi>
      <n-gi class="statsData">
        <n-icon :component="Timer"/>
        {{ totalTime }}
      </n-gi>
      <n-gi class="statsLabel">平均速度</n-gi>
      <n-gi class="statsLabel">记录点数量</n-gi>
      <n-gi class="statsData">
        <n-icon :component="SpeedometerSharp"/>
        {{ meanSpeed }}
      </n-gi>
      <n-gi class="statsData">
        <n-icon :component="StatsChart"/>
        {{ numPoints }}
      </n-gi>
    </n-grid>

    <n-slider id="slider" v-model:value="sliderValue" :format-tooltip="v=>{return `${v/10}%`}" :max="1000"
              :step="1" placement="bottom"/>
  </n-space>

</template>

<script setup>
//TODO 拖动进度条 倒放
// noinspection SpellCheckingInspection
import GPXreader from "./readGPX";
import {getCurrentInstance, h, ref} from "vue";
import {
  Analytics,
  BarChart,
  Checkmark,
  Pause,
  Play,
  PlayBack,
  ReturnUpBack,
  Speedometer,
  SpeedometerSharp,
  StatsChart,
  Timer
} from "@vicons/ionicons5";
import {
  NButton,
  NCard,
  NDropdown,
  NGi,
  NGrid,
  NIcon,
  NInputNumber,
  NSlider,
  NSpace,
  NTooltip,
  useMessage
} from "naive-ui";

//TODO:拖动进度、信息展示、倒放

const renderIcon = (icon) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    });
  };
};

let _meanSpeed;
let unitOfSpeed = 0;
let stats;
const speedRatio = ref();
const sliderValue = ref(500);
const totalDistance = ref();
const totalTime = ref();
const meanSpeed = ref();
const numPoints = ref();
const message = useMessage();
const checkMark = renderIcon(Checkmark);
const ctx = getCurrentInstance().appContext.config.globalProperties;

ctx.$bus.$on('statsData', _stats => {
  stats = _stats;

  if (stats.totalDistance >= 10000)
    totalDistance.value = (stats.totalDistance / 1000).toFixed(2) + 'km';
  else totalDistance.value = stats.totalDistance + 'm';

  totalTime.value = stats.totalTime;
  numPoints.value = stats.numPoints;

  _meanSpeed = stats.meanSpeed;
  meanSpeed.value = _meanSpeed[unitOfSpeed];
});


const speedUnitOptions = ref([
  {
    label: 'm/s',
    key: 0,
    icon: checkMark
  },
  {
    label: 'km/h',
    key: 1
  },
  {
    label: 'min/km (Experimental)',
    key: 2
  }
])

function handleSpeedUnitChanged(key) {
  for (let i = 0; i < 3; i++) {
    speedUnitOptions.value[i].icon = null;
  }
  speedUnitOptions.value[key].icon = checkMark;
  ctx.$bus.$emit('unitOfSpeedChanged', key);
  meanSpeed.value = _meanSpeed[key];
}


function handleSpeedRatioChanged(key) {
  if (key !== null) {
    ctx.$bus.$emit('speedRatioChanged', key);
    message.info('调整为' + key + '倍速');
    speedRatio.value = key;
  }
}

function clickPlayButton() {
  ctx.$bus.$emit('play');
}

function clickPauseButton() {
  ctx.$bus.$emit('pause');
}

function clickBackToStartButton() {
  ctx.$bus.$emit('backToStart');
}

</script>

<style>
#title {
  background-color: rgba(0, 0, 0, 0);
}

#inputNumber {
  margin: 0 auto;
  width: 90%;
}

#slider {
  margin: 0 auto;
  width: 80%;
}

.statsLabel {
  font-size: 12px;
  opacity: 75%;
}

.statsData {
  font-size: 17px;
}
</style>