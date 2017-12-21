<template>
  <div class="my-code">
    <pre ref="code">
      <code :class="lang"></code>
    </pre>
  </div>
</template>

<script>
  export default {
    props: {
      //
      src: {
        type: String,
        default: '',
      },

      //
      lang: {
        type: String,
        default: '',
      },
    },

    methods: {
      highlight () {
        if (hljs !== undefined) {
          hljs.highlightBlock(this.$refs.code);
        }
      },
    },

    watch: {
      src (newVal) {
        this.$refs.code.textContent = newVal;

        this.highlight();
      },
    },
  };
</script>

<style lang="less" scoped>
  .my-code {
    font-family: PTMonoRegular, serif;
    font-size: 12px;
  }
</style>