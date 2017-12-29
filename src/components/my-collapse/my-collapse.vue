<template>
  <div class="my-collapse">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      collapseAll: {
        type: Boolean,
        default: false,
      },

      showAll: {
        type: Boolean,
        default: false,
      },
    },

    data () {
      return {};
    },
  };
</script>

<style lang="less" scoped>
</style>