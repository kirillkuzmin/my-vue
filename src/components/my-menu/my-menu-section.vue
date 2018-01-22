<template>
  <div class="my-menu-section">
    <div class="my-menu-section__header" v-text="header"></div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'my-menu-section',

    props: {
      header: {
        type: String,
        default: '',
      },
    },
  };
</script>