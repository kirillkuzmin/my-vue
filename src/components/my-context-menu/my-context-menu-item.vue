<template>
  <li
    :class="itemClass"
    tabindex="-1"
    v-html="label"
    v-if="!hidden"
    @click="onClick"
  >
  </li>
</template>

<script>
  export default {
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },

      hidden: {
        type: Boolean,
        default: false,
      },

      label: {
        type: String,
        default: 'default label',
      },

      separator: {
        type: Boolean,
        default: false,
      },
    },

    data () {
      return {};
    },

    computed: {
      itemClass () {
        return {
          'my-context-menu__item': true,
          'my-context-menu__item--disabled': this.disabled,
          'my-context-menu__item--with-separator': this.separator,
        };
      },
    },

    methods: {
      onClick () {
        if (!this.disabled) {
          this.$parent.show = false;

          this.$emit('click');
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .my-context-menu {
    &__item {
      background: none;
      box-sizing: border-box;
      cursor: pointer;
      height: 24px;
      line-height: 24px;
      list-style: none outside none;
      margin: 0;
      padding-left: 24px;
      padding-right: 24px;
      white-space: nowrap;

      &:focus {
        outline: none;
      }

      &:hover {
        background-color: #eee;
        cursor: pointer;
      }

      &--disabled {
        color: #bdbdbd;
        cursor: default;

        &:hover {
          background-color: #fff;
          cursor: default;
        }
      }

      &--with-separator {
        border-bottom: 1px solid rgba(0, 0, 0, .12);
      }
    }
  }
</style>
