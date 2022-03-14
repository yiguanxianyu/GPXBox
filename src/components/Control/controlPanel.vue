<template>
  <div>
    <n-space vertical>
      <n-card
        id="title"
        :bordered="false"
        title="GPXbox"
        header-style="font-size:1.5em"
      ></n-card>
      <!--这个是网页的标题-->

      <n-space justify="space-around">
        <GPXreader></GPXreader>

        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button type="primary" @click="otherClick">其他功能</n-button>
          </template>
          <span> 别看了，还没做呢 </span>
        </n-tooltip>
      </n-space>
      <!--以上是乱七八糟的按钮-->
    </n-space>
  </div>
</template>

<script setup>
import GPXreader from "./readGPX";
import { NSpace, NCard, NButton, NTooltip, useMessage } from "naive-ui";

const message = useMessage();

const otherClick = () => {
    message.success("别点了，真的还没做呢");
};
</script>

<style>
#title {
  background-color: rgba(0, 0, 0, 0);
}
</style>