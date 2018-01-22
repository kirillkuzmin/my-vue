<template>
</template>

<script>
  export default {
    name: 'my-twig',

    props: {
      field: String,

      value: [Number, String, Object],
    },

    created () {
      this.$twig.set(this.field, this.value);
    },
  };
</script>