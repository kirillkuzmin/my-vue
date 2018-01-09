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

<style lang="less" scoped>
  @error-background-color: #ffcdd2;
  @error-color: #b71c1c;

  @info-background-color: #dcedc8;
  @info-color: #33691e;

  @warning-background-color: #fff59d;
  @warning-color: rgba(0, 0, 0, 0.8);

  .my-alert-custom(@color; @background-color) {
    background: @background-color;
    color: @color;
  }

  .my-alert {
    align-items: center;
    border-radius: 0;
    box-sizing: border-box;
    display: flex;
    padding: 5px;

    & > p {
      margin-left: 5px;
      vertical-align: middle;
    }

    &--info {
      .my-alert-custom(@info-color, @info-background-color);
    }

    &--warning {
      .my-alert-custom(@warning-color, @warning-background-color);
    }

    &--error {
      .my-alert-custom(@error-color, @error-background-color);
    }
  }
</style>
