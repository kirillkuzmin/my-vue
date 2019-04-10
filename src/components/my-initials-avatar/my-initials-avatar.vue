<template>
  <div
    :style="style"
    class="my-initials-avatar"
    v-text="initials"
  >
  </div>
</template>

<script>
  export default {
    name: 'my-initials-avatar',

    props: {
      name: {
        type: String,
        default: '',
      },

      round: {
        type: Boolean,
        default: false,
      },

      size: {
        type: Number,
        default: 36,
      },
    },

    computed: {
      style () {
        return {
          borderRadius: this.round ? '50%' : 'auto',
          height: `${this.size}px`,
          width: `${this.size}px`,
        };
      },

      initials () {
        const name = this.name
          .trim()
          .split(' ');

        return `${name[0][0]}${name[1][0]}`;
      },
    },
  };
</script>