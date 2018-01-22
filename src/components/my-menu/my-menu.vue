<template>
  <div class="my-menu" :style="menuStyle">
    <div class="my-menu__header" v-text="header"></div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'my-menu',

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