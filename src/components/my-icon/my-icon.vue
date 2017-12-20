<template>
  <img
    :height="size"
    :src="icon"
    :width="size"
    class="my-icon"
    @click="click"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  >
</template>

<script>
  export default {
    props: {
      icon: {
        type: String,
        required: true,
      },

      size: {
        type: [Number, String],
        required: true,
      },
    },

    methods: {
      click (e) {
        if (e.shiftKey) {
          this.$parent.$emit('shift');
        } else {
          this.$parent.$emit('click');
        }
      },

      mouseenter () {
        this.$parent.$emit('mouseenter');
      },

      mouseleave () {
        this.$parent.$emit('mouseleave');
      },
    },
  };
</script>

<style lang="less" scoped>
  .my-icon {
    cursor: pointer;
  }
</style>