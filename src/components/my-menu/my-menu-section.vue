<template>
  <div class="my-menu-section">
    <div class="my-menu-section__header" v-text="header"></div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      header: {
        type: String,
        default: '',
      },
    },
  };
</script>

<style lang="less" scoped>
  .my-menu-section {
    &__header {
      color: #000;
      margin-left: 2px;
      margin-right: 2px;
      padding: 5px 10px 5px 5px;
      vertical-align: middle;
    }

    & > .my-menu-item {
      text-indent: 20px;
    }
  }
</style>
