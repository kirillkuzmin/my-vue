<template>
  <div class="my-loading" :style="style"></div>
</template>

<script>
  export default {
    props: {
      size: {
        type: String,
        default: '24px',
      },
    },

    computed: {
      style () {
        return {
          'height': this.size,
          'width': this.size,
        };
      },
    },
  };
</script>

<style lang="less" scoped>
  .my-loading {
    -webkit-animation: spin 1s linear infinite;
    animation: spin 1s linear infinite;
    border-radius: 50%;
    border: 3px solid transparent;
    border-right: 3px solid #005eb8;
    border-top: 3px solid #005eb8;
    box-sizing: border-box;
    display: inline-flex;
  }

  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>