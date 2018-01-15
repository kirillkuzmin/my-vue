<template>
  <button
    :disabled="disabled"
    :type="type"
    class="my-button"
    @click="onClick"
  >
    <my-loading
      :size="16"
      v-if="loading"
    />
    <div :style="contentStyle" v-if="$slots.default">
      <slot></slot>
    </div>
  </button>
</template>

<script>
  import MyLoading from 'components/my-loading';

  export default {
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
      'my-loading': MyLoading,
    },

    computed: {
      contentStyle () {
        return {
          'margin-left': this.loading ? '5px' : '0',
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