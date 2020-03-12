<template>
  <div class="my-radio">
    <input
      :class="inputClass"
      :disabled="disabled"
      :id="id"
      :name="name"
      :value="value"
      type="radio"
      v-model="model"
    >
    <label
      :class="labelClass"
      :for="id"
      v-text="label"
    >
    </label>
  </div>
</template>

<script>
  export default {
    name: 'my-radio',

    model: {
      prop: 'checked',
      event: 'change',
    },

    props: {
      checked: null,

      disabled: [Boolean, String],

      id: {
        type: String,
        default () {
          return Math.random().toString(36).slice(2);
        },
      },

      label: String,

      name: String,

      value: [String, Number],
    },

    computed: {
      inputClass () {
        return [
          'my-radio__input',
        ];
      },

      labelClass () {
        return [
          'my-radio__label',
          {
            'my-radio__label--empty': !this.label,
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