<template>
  <my-icon
    :icon="icon"
    :size="size"
  />
</template>

<script>
  import MyIcon from 'components/my-icon';
  import s16 from 'images/icons/16/opacity.svg';

  export default {
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },

      size: {
        type: [Number, String],
        default: 16,
      },
    },

    data () {
      return {
        icons: {
          '16': s16,
        },
      };
    },

    components: {
      'my-icon': MyIcon,
    },

    computed: {
      icon () {
        const name = this.size + (this.disabled ? '_disabled' : '');

        return this.icons[name];
      },
    },
  };
</script>

<style lang="less" scoped>
</style>