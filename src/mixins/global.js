export default {
  created () {
    this.$options.delimiters = ['${', '}'];
  },
  methods: {
    $_showOverlay (text, hash = 'global') {
      this.$bus.fire('my-overlay:show', hash);
    },

    $_hideOverlay (text, hash = 'global') {
      this.$bus.fire('my-overlay:hide', hash);
    },
  },
};