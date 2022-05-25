<template>
  <v-chart ref="chart" :autoresize="true" :option="option"/>
</template>

<script setup>

import VChart, {THEME_KEY} from "vue-echarts";
import {getCurrentInstance, provide, ref} from "vue";
import {use} from 'echarts/core';
import {
  DataZoomComponent,
  GridComponent,
  MarkLineComponent,
  MarkPointComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent
} from 'echarts/components';
import {LineChart} from 'echarts/charts';
import {UniversalTransition} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';
import GpxProcess from "@/components/Control/gpxProcess";
import {timeFormat} from "@/components/utils";

provide(THEME_KEY, "light")

use([
  GridComponent,
  MarkPointComponent,
  MarkLineComponent,
  ToolboxComponent,
  DataZoomComponent,
  TitleComponent,
  TooltipComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

let speedRatio = 1;
let gpx;
let index;
let chartData;
let timeDelta;
let dataLength;

let speedFormatter = [{
  markLineY: '{c} m/s', tooltip: (params) => {
    return `${params[0].data.value[1].toFixed(2)}m/s`;
  }
}, {
  markLineY: '{c} km/h',
  tooltip: params => {
    return `${params[0].data.value[1].toFixed(2)}km/h`;
  }
}, {
  markLineY: (params) => {
    let min = Math.trunc(params.data.value);
    let sec = Math.trunc((params.data.value - min) * 60);
    if (sec < 10) sec = '0' + sec;
    return min + ':' + sec;
  },
  tooltip: (params) => {
    let value = params[0].data.value[1];
    let min = Math.trunc(value);
    let sec = Math.trunc((value - min) * 60);
    if (sec < 10) sec = '0' + sec;
    return min + ':' + sec + '/km';
  }
}];

const option = ref({
  title: {text: 'GPXbox', left: 'center'},
  tooltip: {
    trigger: 'axis',
    formatter: speedFormatter[0].tooltip,
    axisPointer: {
      type: 'cross',
      animation: true,
      snap: true
    }
  },
  xAxis: {
    type: 'time',
    splitLine: {
      show: false
    },
    boundaryGap: false
  },
  yAxis: {
    type: 'value',
    scale: true,
    boundaryGap: ['0%', '0%'],
    splitNumber: 2
  },
  toolbox: {
    show: true,
    feature: {
      saveAsImage: {}
    }
  },
  dataZoom: [
    {
      type: 'slider',
      xAxisIndex: 0,
      filterMode: 'filter'
    }, {
      type: 'slider',
      yAxisIndex: 0,
      filterMode: 'none',
      left: '92%'
    }
  ],
  series: [
    {
      type: 'line',
      smooth: true,
      showSymbol: false,
      markLine: {
        symbol: 'none',
        data: [
          {
            symbol: 'circle',
            label: {
              position: 'end',
              backgroundColor: "rgba(143,243,192,0.5)",
              borderRadius: [4, 4, 4, 4],
              padding: [5, 5, 5, 5],
              formatter: (input) => {
                return timeFormat(input.data.coord[0]);
              }
            },
            xAxis: 0
          },
          {
            symbol: 'circle',
            yAxis: 0,
            label: {
              position: 'start',
              backgroundColor: "rgba(143,243,192,0.75)",
              borderRadius: [4, 4, 4, 4],
              padding: [5, 5, 5, 5],
              formatter: speedFormatter[0].markLineY
            }
          }
        ]
      },
      markPoint: {
        data: [],
        symbol: "circle",
        label: {
          show: false
        },
        symbolSize: 6,
        itemStyle: {
          color: "rgba(255, 0, 0, 1)"
        }
      }
    }
  ],
});
const chart = ref();
const ctx = getCurrentInstance().appContext.config.globalProperties;

let setTimeoutID = [];

function clearID() {
  const idLength = setTimeoutID.length;
  for (let i = 0; i < idLength; i++) {
    clearTimeout(setTimeoutID[i]);
  }
  setTimeoutID = [];
}

ctx.$bus.$on("fileRead", file => {
  option.value.title.text = file.name;
  const fr = new FileReader();
  // 读取GPX文件
  fr.readAsText(file, 'utf-8');

  fr.onload = () => {
    clearID();

    gpx = new GpxProcess(fr.result);

    index = 0;
    chartData = gpx.getData();
    option.value.series[0].data = chartData;

    let timeArr = gpx.getTimeArr();
    dataLength = chartData.length;
    timeDelta = new Array(dataLength);
    for (let i = 0; i < dataLength; i++) {
      timeDelta[i] = timeArr[i + 1] - timeArr[i];
    }
    timeDelta[dataLength - 1] = 0;

    ctx.$bus.$emit('sendPolyline', {polyline: gpx.toPolyline(), timeDelta: timeDelta});
    ctx.$bus.$emit('statsData', gpx.getStats());
  }
});

ctx.$bus.$on('speedRatioChanged', (sc) => {
  speedRatio = sc;
});

ctx.$bus.$on('play', () => {
  clearID();
  let set = () => {
    if (index++ < dataLength) {
      option.value.series[0].markLine.data[0].xAxis = chartData[index].value[0];
      option.value.series[0].markLine.data[1].yAxis = chartData[index].value[1];
      option.value.series[0].markPoint.data[0] = {coord: chartData[index].value};
      setTimeoutID.push(setTimeout(set, timeDelta[index] / speedRatio));
      ctx.$bus.$emit('indexChanged', index);
    } else clearID();
  }
  setTimeoutID.push(setTimeout(set, timeDelta[index] / speedRatio));
});

ctx.$bus.$on('playReversed', () => {
  clearID();
  let set = () => {
    if (index--) {
      option.value.series[0].markLine.data[0].xAxis = chartData[index].value[0];
      option.value.series[0].markLine.data[1].yAxis = chartData[index].value[1];
      option.value.series[0].markPoint.data[0] = {coord: chartData[index].value};
      setTimeoutID.push(setTimeout(set, timeDelta[index] / speedRatio));
      ctx.$bus.$emit('indexChanged', index);
    } else clearID();
  }
  setTimeoutID.push(setTimeout(set, timeDelta[index] / speedRatio));
});

ctx.$bus.$on('pause', () => {
  clearID();
});

ctx.$bus.$on('backToStart', () => {
  index = 0;
  option.value.series[0].markLine.data[0].xAxis = chartData[0].value[0];
  option.value.series[0].markLine.data[1].yAxis = chartData[0].value[1];
  option.value.series[0].markPoint.data[0] = {coord: chartData[0].value};
});

ctx.$bus.$on('unitOfSpeedChanged', key => {
  if (key === 0) {
    chartData = gpx.getData();
  } else if (key === 1) {
    chartData = gpx.getDataAsKmPreHour();
  } else if (key === 2) {
    chartData = gpx.getDataAsMinutePerKm();
  } else {
    console.log(key);
  }
  option.value.series[0].markLine.data[1].label.formatter = speedFormatter[key].markLineY;
  option.value.tooltip.formatter = speedFormatter[key].tooltip;
  option.value.series[0].data = chartData;
  option.value.series[0].markLine.data[0].xAxis = chartData[index].value[0];
  option.value.series[0].markLine.data[1].yAxis = chartData[index].value[1];
  option.value.series[0].markPoint.data[0] = {coord: chartData[index].value};
});

ctx.$bus.$on('sliderValueChanged', value => {
  clearID();
  index = (value * dataLength).toFixed();
  option.value.series[0].markLine.data[0].xAxis = chartData[index].value[0];
  option.value.series[0].markLine.data[1].yAxis = chartData[index].value[1];
  option.value.series[0].markPoint.data[0] = {coord: chartData[index].value};
});

</script>

<style scoped>
</style>