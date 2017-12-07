<template>
</template>

<script>
  export default {
    props: {
      field: String,

      value: [Number, String, Object],
    },

    created () {
      this.$twig.set(this.field, this.value);
    },
  };
</script>

<style lang="less" scoped>
</style>