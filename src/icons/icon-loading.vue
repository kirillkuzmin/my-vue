<template>
  <my-icon
    :icon="icon"
    :size="size"
  />
</template>

<script>
  import MyIcon from 'components/my-icon.vue';
  import gif24 from 'images/icons/24/loading.gif';
  import svg16 from 'images/icons/16/loading.svg';
  import svg24 from 'images/icons/24/loading.svg';

  export default {
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },

      size: {
        type: [Number, String],
        default: 24,
      },
    },

    data () {
      return {
        icons: {
          '16': svg16,
          '24': (Modernizr !== undefined && !Modernizr.smil ? gif24 : svg24),
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