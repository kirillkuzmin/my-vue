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
    model: {
      prop: 'checked',
      event: 'change',
    },

    props: {
      checked: [Boolean, Array, Number],

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

<style lang="less" scoped>
  @color: #005eb8;
  @color-disabled: #bebebe;

  .my-radio {
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
      min-height: 16px;
      min-width: 16px;
      line-height: 16px;
      padding-left: 21px;
      padding-right: 5px;
      position: relative;

      &::before {
        border-radius: 50%;
        border: 2px solid @color;
        box-sizing: border-box;
        content: '';
        height: 16px;
        left: 0;
        position: absolute;
        top: 0;
        width: 16px;
      }

      &--empty {
        padding: 0;
      }
    }

    &__input {
      pointer-events: none;
      position: absolute;
      visibility: hidden;

      &:checked {
        & + label {
          &::after {
            -webkit-transform: scale(0.5);
            background-color: @color;
            border-radius: 50%;
            border: 2px solid @color;
            box-sizing: border-box;
            content: '';
            height: 16px;
            left: 0;
            position: absolute;
            top: 0;
            transform: scale(0.5);
            width: 16px;
          }
        }
      }

      &:disabled {
        & + label {
          &::before {
            border-color: @color-disabled;
          }

          &::after {
            background-color: @color-disabled;
            border-color: @color-disabled;
            color: @color-disabled;
          }
        }
      }
    }
  }
</style>
