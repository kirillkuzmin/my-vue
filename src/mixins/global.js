Vue.mixin({
  created() {
    this.$options.delimiters = ['${', '}'];
  },
});
