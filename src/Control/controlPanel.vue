<template>
  <n-space justify="center">
    <GPXreader></GPXreader>
  </n-space>
</template>

<script>
import GPXreader from "./readGPX";
import { NSpace } from "naive-ui";

export default {
  components: {
    GPXreader,
    NSpace,
  },
};
</script>

<style>
</style>