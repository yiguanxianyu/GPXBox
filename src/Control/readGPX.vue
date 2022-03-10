<template>
  <n-upload
    id="uploader"
    ref="uploader"
    accept=".gpx"
    :multiple="multiple"
    :max="max"
    @before-upload="beforeUpload"
  >
    <n-button>上传文件</n-button>
  </n-upload>
</template>

<script setup>
import { NUpload, NButton } from "naive-ui";
import { getCurrentInstance, ref } from "vue";

let uploader = ref(null);
let max = 1;
let multiple = true;

const ctx = getCurrentInstance().appContext.config.globalProperties;

const beforeUpload = ({ file }) => {
  ctx.$bus.$emit("fileRead", file.file);
  return false;
};
</script>

<style>
</style>