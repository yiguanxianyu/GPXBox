<template>
  <div>
    <div id="box">
      <!--这个是网页的标题-->
      <n-card id="title" bordered embedded header-style="font-size:2.5em" size="small" title="GPXbox">
        一个还算不错的 GPX 可视化工具
      </n-card>

      <div class="row">
        <div>
          <n-upload :max="1" accept=".gpx" @before-upload="beforeUpload">
            <n-button color="#149D1F" secondary strong>
              <n-icon :component="FolderOpen"/>&nbsp;打开 GPX
            </n-button>
          </n-upload>
        </div>

        <n-button :disabled="fileNotRead" secondary strong @click="clickPlayButton">
          <n-icon :component="Play"/>
          &nbsp;播放
        </n-button>

        <n-button :disabled="fileNotRead" secondary strong @click="clickPauseButton">
          <n-icon :component="Pause"/>
          &nbsp;暂停
        </n-button>

      </div>

      <div class="row">
        <n-button :disabled="fileNotRead" secondary strong @click="clickPlayReversedButton">
          <n-icon :component="PlayBack"/>
          &nbsp;倒放
        </n-button>

        <n-button :disabled="fileNotRead" secondary strong @click="clickBackToStartButton">
          <n-icon :component="ReturnUpBack"/>
          &nbsp;回到起点
        </n-button>

        <n-dropdown :options="speedUnitOptions" trigger="hover" @select="handleSpeedUnitChanged">
          <n-button secondary strong>
            <n-icon :component="BarChart"/>
            &nbsp;速度单位
          </n-button>
        </n-dropdown>
      </div>

      <n-tooltip trigger="hover">
        <template #trigger>
          <n-input-number id="inputNumber" :default-value="1" :max="8" :min="0.1" :value="speedRatio"
                          @update:value="handleSpeedRatioChanged">
            <template #prefix>
              <n-icon :component="Speedometer" :depth="1"/>
            </template>
            <template #suffix>
              倍速
            </template>
          </n-input-number>
        </template>
        允许设置的倍速范围为 0.1 ~ 8
      </n-tooltip>

      <n-grid :cols="2" y-gap="6">
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

        <n-gi class="statsLabel">已移动时间</n-gi>
        <n-gi class="statsLabel">已移动距离</n-gi>
        <n-gi class="statsData">{{ movedTime }}</n-gi>
        <n-gi class="statsData">{{ movedDist }}</n-gi>

      </n-grid>

      <n-slider id="slider" v-model:value="sliderValue" :disabled="fileNotRead"
                :format-tooltip="v=>{return `${(v*0.01).toFixed(2)}%`}"
                :max="10000" :step="1" placement="bottom" show-tooltip @update:value="sliderValueChanged"/>
    </div>
  </div>
</template>

<script setup>
// noinspection SpellCheckingInspection
import {getCurrentInstance, h, ref} from "vue";
import {
  Analytics,
  BarChart,
  Checkmark,
  FolderOpen,
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
  NTooltip,
  NUpload,
  useMessage
} from "naive-ui";
import {formatDistance, formatSecond} from "@/components/utils";

const renderIcon = icon => {
  //渲染图标用的
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    });
  };
};

let _meanSpeed;
let cumulDist;//累积距离
let timeArr;//时间列表
let startTime;//起始时间
let fileNotRead = ref(true);
const speedRatio = ref();//加速比率
const sliderValue = ref(0);
const movedTime = ref(0);
const movedDist = ref(0);
const totalDistance = ref();
const totalTime = ref();
const meanSpeed = ref();
const numPoints = ref();// 点的总数量
const checkMark = renderIcon(Checkmark);
const message = useMessage();
const eventBus = getCurrentInstance().appContext.config.globalProperties.$bus;

//速度单位
let unitOfSpeedIndex = 0;
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

const setMovedData = index => {
  movedDist.value = formatDistance(cumulDist[index]);
  movedTime.value = formatSecond(timeArr[index] - startTime);
}

eventBus.$on('statsData', stats => {
  //展示统计数据
  totalDistance.value = formatDistance(stats.totalDistance);

  totalTime.value = stats.totalTime;
  numPoints.value = stats.numPoints;

  _meanSpeed = stats.meanSpeed;
  meanSpeed.value = _meanSpeed[unitOfSpeedIndex];

  timeArr = stats.timeArr;
  startTime = timeArr[0];
  cumulDist = stats.cumulDist;
});

eventBus.$on("fileRead", () => {
  fileNotRead.value = false;
});

eventBus.$on('indexChanged', index => {
  sliderValue.value = 10000 * index / numPoints.value;
  setMovedData(index);
});

function sliderValueChanged(value) {
  const tempIndex = (value * 0.0001 * numPoints.value).toFixed();
  //更新已移动距离和时间的值
  setMovedData(tempIndex);
  //更新地图和图表
  eventBus.$emit('sliderValueChanged', tempIndex);
}

function handleSpeedUnitChanged(key) {
  if (fileNotRead.value) {
    message.warning('请先读取文件');
  } else {
    eventBus.$emit('unitOfSpeedChanged', key);
    meanSpeed.value = _meanSpeed[key];

    for (let i = 0; i < 3; i++) {
      speedUnitOptions.value[i].icon = null;
    }
    speedUnitOptions.value[key].icon = checkMark;
  }
}

function handleSpeedRatioChanged(key) {
  if (key === null) {
    //当输入框为空的时候 key===null
    message.error('请输入正确的倍速');
  } else {
    eventBus.$emit('speedRatioChanged', key);
    speedRatio.value = key;
    message.success('调整为' + key + '倍速');
  }
}

function clickPlayButton() {
  eventBus.$emit('play');
}

function clickPauseButton() {
  eventBus.$emit('pause');
}

function clickPlayReversedButton() {
  eventBus.$emit('playReversed');
}

function clickBackToStartButton() {
  eventBus.$emit('backToStart');
  setMovedData(0);
  sliderValue.value = 0;
}

function beforeUpload({file}) {
  eventBus.$emit("fileRead", file.file);
  return false;
}
</script>

<style>
#title {
  display: flex;
  order: 0;
}

#inputNumber {
  margin: 0 auto;
  width: 80%;
}

#box {
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

#slider {
  margin: 0 auto;
  width: 80%;
}

.row {
  display: flex;
  justify-content: space-evenly;
}

.statsLabel {
  font-size: 12px;
  opacity: 75%;
}

.statsData {
  font-size: 17px;
}
</style>
