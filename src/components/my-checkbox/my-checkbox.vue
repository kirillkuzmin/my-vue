<template>
  <div class="my-checkbox">
    <input
      :class="inputClass"
      :disabled="disabled"
      :false-value="falseValue"
      :id="id"
      :name="name"
      :true-value="trueValue"
      :value="value"
      type="checkbox"
      v-model="model"
    >
    <label
      :class="labelClass"
      :for="id"
      v-text="label"
    >
    </label>
    <input
      :name="name"
      type="hidden"
      v-if="withHidden"
      v-model="model"
    >
  </div>
</template>

<script>
  export default {
    name: 'my-checkbox',

    model: {
      prop: 'checked',
      event: 'change',
    },

    props: {
      checked: [Boolean, Array, Number],

      disabled: [Boolean, String],

      falseValue: {
        type: [Boolean, Number, String],
        default: 0,
      },

      id: {
        type: String,
        default () {
          return Math.random().toString(36).slice(2);
        },
      },

      label: String,

      name: String,

      trueValue: {
        type: [Boolean, Number, String],
        default: 1,
      },

      value: [String, Number],

      withHidden: {
        type: Boolean,
        default: false,
      },
    },

    computed: {
      inputClass () {
        return [
          'my-checkbox__input',
        ];
      },

      labelClass () {
        return [
          'my-checkbox__label',
          {
            'my-checkbox__label--empty': !this.label,
          },
        ];
      },

      model: {
        get () {
          return this.checked;
        },

        set (val) {
          this.$emit('change', val);
        },
      },
    },
  };
</script>