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
    name: 'my-context-menu-item',

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