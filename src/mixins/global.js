import Vue from 'vue';

Vue.mixin({
  created () {
    this.$options.delimiters = ['${', '}'];
  },
});