<template>
  <div :class="itemClass">
    <div class="my-menu-item__before" v-if="$slots.before">
      <slot name="before"></slot>
    </div>
    <div class="my-menu-item__text" v-text="text" @click="go"></div>
    <div class="my-menu-item__after" v-if="$slots.after">
      <slot name="after"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: 'New menu item',
      },

      url: {
        type: String,
        default: '/',
      },
    },

    computed: {
      itemClass () {
        return [
          'my-menu-item',
        ];
      },
    },

    methods: {
      go () {
        location.href = this.url;
      },
    },
  };
</script>

<style lang="less" scoped>
  @menu-hover-bg: #d5e4f3;

  .my-menu-item {
    align-items: center;
    display: flex;
    padding: 0;

    &__before {
      margin-left: 5px;
    }

    &__text {
      color: #424242;
      height: 100%;
      padding: 5px;
      width: 100%;
    }

    &:hover {
      background-color: @menu-hover-bg;
      cursor: pointer;

      & > .my-menu {
        visibility: visible;
      }
    }
  }
</style>
