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