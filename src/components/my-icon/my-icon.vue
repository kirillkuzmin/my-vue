<template>
  <div
    :title="title"
    class="my-icon"
    @click="click"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  >
    <svg
      :fill="color"
      :height="size"
      :viewBox="viewBox"
      :width="size"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        v-for="(path, i) in icon.paths"
        :d="path.d"
        :fill="path.fill"
      />
    </svg>
  </div>
</template>

<script>
  export default {
    props: {
      color: {
        type: String,
        default: '#fff',
      },

      size: {
        type: [Number, String],
        default: 24,
      },

      title: {
        type: String,
        default: '',
      },
    },

    computed: {
      viewBox () {
        return `0 0 ${this.icon.size} ${this.icon.size}`;
      },
    },

    methods: {
      click (e) {
        if (e.shiftKey) {
          this.$emit('shift');
        } else {
          this.$emit('click');
        }
      },

      mouseenter () {
        this.$emit('mouseenter');
      },

      mouseleave () {
        this.$emit('mouseleave');
      },
    },
  };
</script>

<style lang="less" scoped>
  .my-icon {
    cursor: pointer;
    display: inline-flex;
  }
</style>