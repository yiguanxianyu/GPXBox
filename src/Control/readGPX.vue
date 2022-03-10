<template>
  <n-upload
    id="uploader"
    accept=".gpx"
    :multiple="multiple"
    :max="max"
    @before-upload="handlechange"
  >
    <n-button>上传文件</n-button>
  </n-upload>
</template>

<script>
import { NUpload, NButton } from "naive-ui";
import { getCurrentInstance } from "vue";

export default {
  components: {
    NUpload,
    NButton,
  },
  setup() {
    const ctx = getCurrentInstance().appContext.config.globalProperties;   
    
    let max = 1;
    let multiple = true;

    let handlechange = ({ file }) => {
      ctx.$bus.$emit("click", file.file);
    };

    return {
      max,
      multiple,
      handlechange,
    };
  },
};
</script>

<style>
</style>