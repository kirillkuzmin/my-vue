<template>
  <div class="my-loading" :style="style"></div>
</template>

<script>
  export default {
    props: {
      size: {
        type: Number,
        default: 24,
      },
    },

    computed: {
      style () {
        return {
          'height': this.size + 'px',
          'width': this.size + 'px',
        };
      },
    },
  };
</script>