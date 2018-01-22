<template>
  <div class="my-collapse">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'my-collapse',

    props: {
      collapseAll: {
        type: Boolean,
        default: false,
      },

      showAll: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>