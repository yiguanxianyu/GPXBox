<template>
  <v-chart ref="chart" :autoresize="true" :option="option" @click="clickEvent"/>
</template>

<script setup>

import VChart, {THEME_KEY} from "vue-echarts";
import {getCurrentInstance, onMounted, provide, ref} from "vue";
import * as echarts from 'echarts/core';
import {
  DataZoomComponent,
  GraphicComponent,
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
import {round, timeFormat} from "@/components/utils";

provide(THEME_KEY, "light")

echarts.use([
  MarkPointComponent,
  MarkLineComponent,
  ToolboxComponent,
  DataZoomComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  GraphicComponent
]);

function clickEvent(params) {
  console.log(params);
}

//生成测试数据
let speedScale = 1;
let date = new Date(2022, 5, 16, 5, 30, 30);
let dataLength = 105;
let data = Array(dataLength);
for (let i = 0; i < dataLength; i++) {
  date = new Date(date.valueOf() + 1000)
  // data[i] = {
  //   value: [date.valueOf(), round(Math.random() * 20 + 100, 2)],
  //   someValue: '哈哈哈哈哈'
  // }
  data[i] = {value: [+date, round(Math.random() * 20 + 100, 2)]}
}

let _option = {
  title: {text: 'GPXbox', left: 'middle'},
  tooltip: {
    trigger: 'axis',
    formatter: (params) => {
      params = params[0].data;
      let dateStr = timeFormat(params.value[0]);
      return `<p>${dateStr}<br/>${round(params.value[1], 2)}</p>`;
    },
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
      data: data,
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
              formatter: (params) => {
                return timeFormat(params.data.value);
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
  graphic: {
    type: 'line',
    draggable: 'horizontal',
    z: 100
  }
}
let option = ref(_option);
const chart = ref(null);

onMounted(() => {
  // chart.value.setOption(_option);
})

const ctx = getCurrentInstance().appContext.config.globalProperties;

let setTimeoutID = [];

function addChart(file) {
  const fr = new FileReader();
  fr.readAsText(file, 'utf-8')
  fr.onload = () => {

    for (let j = 0, idLength = setTimeoutID.length; j < idLength; j++) {
      clearTimeout(setTimeoutID[j]);
    }

    let gp = new GpxProcess(fr.result);
    ctx.$bus.$emit('sendPolyline', {polyLine: gp.toPolyline(), timeArr: gp.getTimeArr()});

    let chartData = gp.getData();
    option.value.series[0].data = chartData;

    let dataLength = chartData.length;
    let i = 0;
    let set = () => {
      if (i < dataLength - 1) {
        option.value.series[0].markLine.data[0].xAxis = chartData[i].value[0];
        option.value.series[0].markLine.data[1].yAxis = chartData[i].value[1];
        option.value.series[0].markPoint.data[0] = {
          coord: [chartData[i].value[0], chartData[i].value[1]]
        };

        let timeDelta = (chartData[i + 1].value[0] - chartData[i].value[0]) / speedScale;
        setTimeoutID.push(setTimeout(set, timeDelta));
        i++;
      }
    }

    setTimeoutID.push(setTimeout(set, 0));
  }

}

ctx.$bus.$on("fileRead", addChart)

ctx.$bus.$on("titleRead", (newOptions) => {
  option.value = newOptions;
});

ctx.$bus.$on('speedScaleChanged', (sc) => {
  speedScale = sc
})

</script>

<style scoped>
</style>