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