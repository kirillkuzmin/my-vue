<template>
  <div class="my-menu" :style="menuStyle">
    <div class="my-menu__header" v-text="header"></div>
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

      width: {
        type: String,
        default: '300px',
      },
    },

    computed: {
      menuStyle () {
        return {
          'width': this.width,
        };
      },
    },
  };
</script>

<style lang="less" scoped>
  @menu-bg: #f5f5f5;
  @menu-header-bg: #e0e0e0;

  .my-menu {
    background-color: @menu-bg;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0 0 2px 0;
    white-space: nowrap;

    &__header {
      background-color: @menu-header-bg;
      font-family: Amadeus, serif;
      font-size: 16px;
      margin: 1px 0 1px 0;
      padding: 5px 40px 5px 40px;
      text-align: center;

      &:hover {
        background-color: @menu-header-bg;
        cursor: default;
      }

      &:first-of-type {
        margin-top: 0;
      }
    }
  }
</style>
