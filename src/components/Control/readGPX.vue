<template>
  <n-upload
      ref="uploader"
      accept=".gpx"
      :max="1"
      @before-upload="beforeUpload"
  >
    <n-button color="#149D1F" primary strong>打开 GPX</n-button>
  </n-upload>
</template>

<script setup>
import {NButton, NUpload} from "naive-ui";
import {getCurrentInstance, ref} from "vue";

let uploader = ref(null);

const ctx = getCurrentInstance().appContext.config.globalProperties;

const beforeUpload = ({file}) => {
  ctx.$bus.$emit("fileRead", file.file);
  ctx.$bus.$emit("fileTitleRead", file.file.name);
  return false;
};
</script>

<style>
</style>