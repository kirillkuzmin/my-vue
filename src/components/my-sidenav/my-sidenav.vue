<template>
  <div class="my-sidenav">
    <transition name="slide">
      <div class="my-sidenav__container" v-show="show">
        <slot></slot>
      </div>
    </transition>
    <transition name="fade">
      <div
        class="my-sidenav__overlay"
        v-show="show"
        @click="hide"
      >
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    props: {
      show: {
        type: Boolean,
        default: false,
      },
    },

    data () {
      return {};
    },

    methods: {
      hide () {
        this.$emit('hide');
      },
    },
  };
</script>

<style lang="less" scoped>
  .my-sidenav {
    &__container {
      background-color: #fff;
      box-shadow: 0 0 8px -4px rgba(0, 0, 0, .2), 0 0 19px 2px rgba(0, 0, 0, .14), 0 0 24px 4px rgba(0, 0, 0, .12);
      box-sizing: border-box;
      height: 100%;
      left: 0;
      padding: 20px;
      position: absolute;
      top: 0;
      width: 300px;
      z-index: 999999;
    }

    &__overlay {
      background-color: rgba(0, 0, 0, .2);
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 1002;
    }

    .slide-enter-active,
    .slide-leave-active {
      transition: .3s;
    }

    .slide-enter,
    .slide-leave-to {
      left: -300px;
    }

    .fade-enter-active,
    .fade-leave-active {
      transition: opacity .3s;
    }

    .fade-enter,
    .fade-leave-to {
      opacity: 0;
    }
  }
</style>