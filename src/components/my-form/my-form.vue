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
    name: 'my-form',

    props: {
      overlayHash: String,

      overlayMessage: {
        type: String,
        default () {
          return this.$trans('myForm.overlayMessage');
        },
      },
    },

    components: {
      MyOverlay,
    },
  };
</script>