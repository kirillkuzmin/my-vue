<template>
  <div :class="className">
    <component
      :is="iconComponent"
      class="my-alert__icon"
      v-if="icon"
    />
    <div class="my-alert__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import IconError from 'icons/icon-error.vue';
  import IconInfo from 'icons/icon-info.vue';
  import IconWarning from 'icons/icon-warning.vue';

  export default {
    name: 'my-alert',

    props: {
      type: {
        type: String,
        default: 'warning',
      },

      icon: {
        type: Boolean,
        default: true,
      },
    },

    components: {
      IconError,
      IconInfo,
      IconWarning,
    },

    computed: {
      className () {
        return [
          'my-alert',
          {
            //'my-alert--no-icon': !this.icon,
            'my-alert--error': this.type === 'error',
            'my-alert--warning': this.type === 'warning',
            'my-alert--info': this.type === 'info',
          },
        ];
      },

      iconComponent () {
        return `icon-${this.type}`;
      },
    },
  };
</script>
