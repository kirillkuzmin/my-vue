<template>
  <icon-loading
    :size="size"
    class="my-loading"
  />
</template>

<script>
  import IconLoading from 'icons/icon-loading.vue';

  export default {
    props: {
      size: {
        type: [Number, String],
        default: 24,
      },
    },

    components: {
      'icon-loading': IconLoading,
    },
  };
</script>

<style lang="less" scoped>
  .my-loading {
    display: inline-flex;
  }
</style>