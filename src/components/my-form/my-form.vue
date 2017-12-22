<template>
  <div>
    <slot></slot>
    <my-overlay
      :hash="overlayHash"
      :message="overlayMessage"
    />
  </div>
</template>

<script>
  import MyOverlay from 'components/my-overlay';

  export default {
    props: {
      //
      overlayHash: String,

      //
      overlayMessage: {
        type: String,
        default: 'Запрос отправлен, ожидайте ответа.',
      },
    },

    data () {
      return {};
    },

    components: {
      'my-overlay': MyOverlay,
    },

    methods: {},
  };
</script>