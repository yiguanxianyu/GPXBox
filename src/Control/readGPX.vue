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

<script>
import { NUpload, NButton } from "naive-ui";
import { getCurrentInstance, ref } from "vue";

export default {
  components: {
    NUpload,
    NButton,
  },
  setup() {
    const ctx = getCurrentInstance().appContext.config.globalProperties;
    let uploader = ref(null);
    let max = 1;
    let multiple = true;

    const beforeUpload = ({ file }) => {
      ctx.$bus.$emit("click", file.file);
      return false;
    };

    return {
      uploader,
      max,
      multiple,
      beforeUpload,
    };
  },
};
</script>

<style>
</style>