<template>
  <button
    :disabled="disabled"
    :type="type"
    class="my-button"
    @click="onClick"
  >
    <div :style="contentStyle" v-if="$slots.default">
      <slot></slot>
    </div>
    <div class="my-button__loading" v-show="loading">
      <my-loading :size="16"/>
    </div>
  </button>
</template>

<script>
  import MyLoading from 'components/my-loading';

  export default {
    name: 'my-button',

    props: {
      disabled: {
        type: Boolean,
        default: false,
      },

      loading: {
        type: Boolean,
        default: false,
      },

      type: {
        type: String,
        default: 'button',
      },
    },

    components: {
      MyLoading,
    },

    computed: {
      contentStyle () {
        return {
          'opacity': this.loading ? '0.0' : '1.0',
        };
      },
    },

    methods: {
      onClick (e) {
        this.$emit('click', e);
      },
    },
  };
</script>