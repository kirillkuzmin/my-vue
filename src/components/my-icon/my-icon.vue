<template>
  <div
    :class="iconClass"
    :title="title"
    @click="click"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  >
    <svg
      :fill="fill"
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

      disabled: {
        type: Boolean,
        default: false,
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
      iconClass () {
        return [
          'my-icon',
          {
            'my-icon--disabled': this.disabled,
          },
        ];
      },

      fill () {
        return (this.disabled ? '#9e9e9e' : this.color);
      },

      viewBox () {
        return `0 0 ${this.icon.size} ${this.icon.size}`;
      },
    },

    methods: {
      click (e) {
        if (this.disabled) {
          return;
        }

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