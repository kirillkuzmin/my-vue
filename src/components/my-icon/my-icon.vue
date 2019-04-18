<template>
  <div
    :class="iconClass"
    :title="title"
    @click="onClick"
    @mouseout="onMouseOut"
    @mouseover="onMouseOver"
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
    name: 'my-icon',

    props: {
      color: {
        type: String,
        default: '#fff',
      },

      disabled: {
        type: Boolean,
        default: false,
      },

      hover: {
        type: String,
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

    data () {
      return {
        cc: '',
      };
    },

    computed: {
      currentColor () {
        return this.cc || this.color;
      },

      iconClass () {
        return [
          'my-icon',
          {
            'my-icon--disabled': this.disabled,
          },
        ];
      },

      fill () {
        return (this.disabled ? '#9e9e9e' : this.currentColor);
      },

      viewBox () {
        return `0 0 ${this.icon.size} ${this.icon.size}`;
      },
    },

    methods: {
      onClick (e) {
        if (!this.disabled) {
          this.$emit('click');
        } else if (e.shiftKey) {
          this.$emit('shift');
        }
      },

      onMouseOver () {
        if (this.hover) {
          this.cc = this.hover;
        }
      },

      onMouseOut () {
        if (this.hover) {
          this.cc = '';
        }
      },
    },
  };
</script>
