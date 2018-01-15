<template>
  <div class="my-disabled" @click.shift="withShift" :disabled="disabled">
    <slot></slot>
    <div v-if="disabled"></div>
  </div>
</template>

<script>
  export default {
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
    },

    data () {
      return {};
    },

    mounted () {
      if (this.disabled) {
        this.$slots.default[0].elm.setAttribute('disabled', true);
      } else {
        this.$slots.default[0].elm.removeAttribute('disabled');
      }
    },

    watch: {
      disabled (newVal) {
        this.$nextTick(() => {
          if (newVal) {
            this.$slots.default[0].elm.setAttribute('disabled', true);
          } else {
            this.$slots.default[0].elm.removeAttribute('disabled');
          }
        });
      },
    },

    methods: {
      withShift () {
        if (this.disabled) {
          this.$emit('shift-click');
        }
      },
    },
  };
</script>