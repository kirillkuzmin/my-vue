<template>
  <div :class="className">
    <component :is="icon"></component>
    <p>
      <slot></slot>
    </p>
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
    },

    components: {
      'icon-error': IconError,
      'icon-info': IconInfo,
      'icon-warning': IconWarning,
    },

    computed: {
      className () {
        return [
          'my-alert',
          {
            'my-alert--error': this.type === 'error',
            'my-alert--warning': this.type === 'warning',
            'my-alert--info': this.type === 'info',
          },
        ];
      },

      icon () {
        return `icon-${this.type}`;
      },
    },
  };
</script>
