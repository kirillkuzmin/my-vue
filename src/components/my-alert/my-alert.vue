<template>
  <my-modal :opacity-control="false" :show="show" :header-type="type">
    <span slot="header" v-text="header"></span>
    <div slot="body" style="max-width: 550px;" v-html="body"></div>
    <div slot="footer">
      <button type="button" @click="ok" autofocus>OK</button>
    </div>
  </my-modal>
</template>

<script>
  import MyModal from 'components/my-modal';

  export default {
    props: {
      body: {
        type: String,
        default: '',
      },

      header: {
        type: String,
        default: '',
      },

      show: {
        type: Boolean,
        default: false,
      },

      type: String,
    },

    components: {
      'my-modal': MyModal,
    },

    methods: {
      ok () {
        this.$emit('ok');
      },
    },
  };
</script>