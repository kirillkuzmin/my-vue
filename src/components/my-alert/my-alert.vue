<template>
  <div :class="className" v-if="show">
    <component
      :is="iconComponent"
      class="my-alert__icon"
      v-if="typeIcon"
    />
    <div class="my-alert__content">
      <slot></slot>
    </div>
    <!--<icon-close
      :color="closeColor"
      class="my-alert__close"
      v-if="hideIcon"
      @click="hide"
    />-->
  </div>
</template>

<script>
  import IconClose from 'icons/icon-close.vue';
  import IconError from 'icons/icon-error.vue';
  import IconInfo from 'icons/icon-info.vue';
  import IconWarning from 'icons/icon-warning.vue';

  export default {
    name: 'my-alert',

    props: {
      flat: {
        type: Boolean,
        default: true,
      },

      hideIcon: {
        type: Boolean,
        default: false,
      },

      typeIcon: {
        type: Boolean,
        default: true,
      },

      type: {
        type: String,
        default: 'warning',
      },
    },

    data () {
      return {
        show: true,
      };
    },

    components: {
      IconClose,
      IconError,
      IconInfo,
      IconWarning,
    },

    computed: {
      className () {
        return [
          'my-alert',
          {
            'my-alert--flat': this.flat,
            'my-alert--error': this.type === 'error',
            'my-alert--warning': this.type === 'warning',
            'my-alert--info': this.type === 'info',
          },
        ];
      },

      /*closeColor () {
        return '#33691e';
      },*/

      closeClass () {
        return `my-alert__close--${this.type}`;
      },

      iconComponent () {
        return `icon-${this.type}`;
      },
    },

    methods: {
      hide () {
        this.show = false;
      },
    },
  };
</script>