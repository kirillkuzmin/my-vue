<template>
  <div class="my-tabs__pane" :id="id" v-show="isActive">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'my-tabs-pane',

    props: {
      disabled: {
        type: Boolean,
        default: false,
      },

      id: {
        type: String,
        default () {
          return Math.random().toString(36).slice(2);
        },
      },

      selected: {
        type: Boolean,
        default: false,
      },

      title: {
        type: String,
        required: true,
      },
    },

    data () {
      return {
        isActive: false,
        validators: [],
      };
    },

    created () {
      this.$bus.listen('my-tabs:add-validator', data => {
        if (data.tabId === this.id) {
          this.validators.push(data.validator);
        }
      });
    },

    mounted () {
      this.isActive = this.selected;
    },

    computed: {
      isDisabled () {
        return this.disabled;
      },

      hasErrors () {
        return this.validators.filter(validator => {
          return validator.hasErrors();
        }).length > 0;
      },
    },
  };
</script>