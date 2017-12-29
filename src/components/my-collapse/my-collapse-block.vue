<template>
  <div>
    <div
      :class="headerClass"
      ref="header"
      v-text="title"
      @click="click"
    >
    </div>
    <div
      :class="contentClass"
      :id="id"
      :style="contentStyle"
      ref="content"
    >
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      id: {
        type: String,
        default () {
          return Math.random().toString(36).slice(2);
        },
      },

      show: {
        type: Boolean,
        default: false,
      },

      title: {
        type: String,
        default: '',
      },
    },

    data () {
      return {
        showBlock: false,

        validators: [],
      };
    },

    computed: {
      hasErrors () {
        let errorsCount = 0;

        this.validators.forEach(validator => {
          if (validator.hasErrors()) {
            errorsCount++;
          }
        });

        return errorsCount > 0;
      },

      headerClass () {
        return [
          'my-collapse__header',
          {
            'my-collapse__header--has-errors': this.hasErrors,
          },
        ];
      },

      contentClass () {
        return [
          'my-collapse__content',
          {
            'my-collapse__content--has-errors': this.hasErrors,
          },
        ];
      },

      contentStyle () {
        return {
          'height': this.showBlock ? this.$refs.content.scrollHeight + 'px' : 0,
        };
      },
    },

    mounted () {
      if (this.$parent.showAll) {
        this.showBlock = true;
      } else if (this.$parent.collapseAll) {
        this.showBlock = false;
      } else {
        this.showBlock = this.show;
      }
    },

    created () {
      this.$bus.listen('my-collapse:add-validator', data => {
        if (data.blockId === this.id) {
          this.validators.push(data.validator);
        }
      });
    },

    methods: {
      click () {
        this.showBlock = !this.showBlock;
      },
    },
  };
</script>

<style lang="less" scoped>
  @error-background-color: #f44336;
  @error-border-color: #f44336;

  .my-collapse {
    &__header {
      -moz-user-select: none;
      -ms-user-select: none;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      background-color: #e6e6e6;
      border: 1px solid #d3d3d3;
      color: #000;
      cursor: pointer;
      display: block;
      font-size: 13px;
      font-weight: bold;
      margin-top: 2px;
      outline: none;
      padding: 5px;
      position: relative;
      text-align: left;
      user-select: none;

      &--has-errors {
        background-color: @error-background-color;
        border-color: @error-border-color;
        color: #fff;
      }
    }

    &__content {
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      background-color: #fff;
      box-sizing: border-box;
      height: 0;
      overflow: hidden;
      transition: height 0.1s ease-out;

      & > div {
        border: 1px solid #d3d3d3;
        border-top: none;
        padding: 5px;
      }

      &--has-errors {
        border-color: @error-border-color;
      }
    }
  }
</style>