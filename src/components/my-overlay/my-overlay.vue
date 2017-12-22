<template>
  <div class="my-overlay" v-show="show">
    <div class="my-overlay__container">
      <div class="my-overlay__message">
        <my-loading/>
        <span v-text="message" v-if="message"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import MyLoading from 'components/my-loading';

  export default {
    props: {
      hash: {
        type: String,
        default () {
          return Math.random().toString(36).slice(2);
        },
      },

      message: {
        type: String,
        default: 'Запрос отправлен, ожидайте ответа.',
      },

      /*show: {
       type: Boolean,
       default: false
       },

       simple: {
       type: Boolean,
       default: false
       }*/
    },

    data () {
      return {
        show: false,
      };
    },

    components: {
      'my-loading': MyLoading,
    },

    created () {
      this.$bus.listen('my-overlay:show', hash => {
        if (this.hash === hash) {
          this.show = true;
        }
      });

      this.$bus.listen('my-overlay:hide', hash => {
        if (this.hash === hash) {
          this.show = false;
        }
      });
    },
  };
</script>

<style lang="less" scoped>
  .my-overlay {
    background-color: rgba(0, 0, 0, .2);
    display: table;
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 99999;

    &__container {
      display: table-cell;
      text-align: center;
      vertical-align: middle;
    }

    &__message {
      background-color: #fff;
      display: inline-flex;
      align-items: center;
      margin: 0 auto;
      padding: 20px;
      text-align: left;
      box-shadow: 0 7px 8px -4px rgba(0, 0, 0, .2), 0 13px 19px 2px rgba(0, 0, 0, .14), 0 5px 24px 4px rgba(0, 0, 0, .12);

      & span {
        display: inline-block;
        font-family: Amadeus, serif;
        font-size: 16px;
        margin-left: 10px;
      }
    }
  }
</style>