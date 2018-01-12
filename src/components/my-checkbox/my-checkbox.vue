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

<style lang="less" scoped>
  @color: #005eb8;
  @color-disabled: #bebebe;
  @tick-color: #fff;

  .my-checkbox {
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    align-items: center;
    display: inline-flex;
    user-select: none;
    vertical-align: middle;

    &__label {
      cursor: pointer;
      height: 16px;
      line-height: 16px;
      min-height: 16px;
      min-width: 16px;
      padding-left: 21px;
      padding-right: 5px;
      position: relative;

      &::before {
        border: 2px solid @color;
        box-sizing: border-box;
        content: '';
        height: 16px;
        left: 0;
        position: absolute;
        top: 0;
        width: 16px;
        z-index: 1;
      }

      &--empty {
        padding: 0;
      }
    }

    &__input {
      left: 0;
      pointer-events: none;
      position: absolute;
      top: 0;
      visibility: hidden;

      &:checked {
        & + label {
          &::before {
            background-color: @color;
          }

          &::after {
            -webkit-transform: rotate(45deg);
            border: 2px solid @tick-color;
            border-left: none;
            border-top: none;
            box-sizing: border-box;
            content: '';
            height: 10px;
            left: 0;
            margin-left: 5px;
            margin-top: 1px;
            position: absolute;
            top: 0;
            transform: rotate(45deg);
            width: 6px;
            z-index: 1;
          }
        }

        &:disabled {
          & + label {
            &::before {
              background-color: @color-disabled;
            }
          }
        }
      }

      &:disabled {
        & + label {
          &::before {
            border-color: @color-disabled;
          }
        }
      }
    }
  }
</style>
