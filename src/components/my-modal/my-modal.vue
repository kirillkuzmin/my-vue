<template>
  <div class="my-modal" v-show="show"><!--@click="hide"-->
    <div class="my-modal__wrapper">
      <div class="my-modal__container" :style="'opacity: '+ windowOpacity + ';'" ref="container">
        <!--@click.stop-->
        <div :class="headerClass" ref="header">
          <slot name="header">default header</slot>
          <div class="my-modal__header-icons">
            <icon-opacity
              title="Изменить прозрачность"
              v-if="opacityControl"
              @mouseenter="disappear"
              @mouseleave="appear"
            />
            <template v-if="maxMin">
              <icon-maximize
                title="Развернуть"
                v-if="!maximized"
                @click="max()"
              />
              <icon-minimize
                title="Свернуть в окно"
                v-else
                @click="min()"
              />
            </template>
            <icon-close
              title="Закрыть"
              v-if="close"
              @click="$emit('close')"
            />
          </div>
        </div>
        <div
          :style="bodyWrapperStyle"
          class="my-modal__body-wrapper"
          ref="bodyWrapper"
        >
          <div class="my-modal__body" ref="body">
            <slot name="body">default body</slot>
          </div>
        </div>
        <div class="my-modal__footer" ref="footer">
          <slot name="footer">default footer</slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import IconClose from 'icons/icon-close.vue';
  import IconOpacity from 'icons/icon-opacity.vue';
  import IconMaximize from 'icons/icon-maximize.vue';
  import IconMinimize from 'icons/icon-minimize.vue';

  export default {
    props: {
      //
      close: {
        type: Boolean,
        default: false,
      },

      //
      headerType: String,

      //
      maxMin: {
        type: Boolean,
        default: false,
      },

      //
      maxWidth: String,

      //
      maxHeight: String,

      //
      opacityControl: {
        type: Boolean,
        default: true,
      },

      scroll: {
        type: Boolean,
        default: false,
      },

      //
      show: {
        type: Boolean,
        default: false,
      },
    },

    data () {
      return {
        maximized: false,
        intervalLive: false,
        opacityStep: 0.05,
        windowOpacity: 1.0,
      };
    },

    components: {
      'icon-close': IconClose,
      'icon-opacity': IconOpacity,
      'icon-maximize': IconMaximize,
      'icon-minimize': IconMinimize,
    },

    computed: {
      bodyWrapperStyle () {
        return {
          maxHeight: this.maxHeight + 'px',
          maxWidth: this.maxWidth + 'px',
          overflowY: (this.scroll ? 'scroll' : 'auto'),
        };
      },

      headerClass () {
        return [
          'my-modal__header',
          (this.headerType ? 'my-modal__header--' + this.headerType : ''),
        ];
      },

      /*hasExtSlot() {
       return !!this.$slots['ext'];
       }*/
    },

    created () {
      window.addEventListener('resize', () => {
        if (this.maximized) {
          this.max();
        }
      });
    },

    methods: {
      max () {
        this.maximized = true;

        //
        this.$refs.bodyWrapper.style.maxHeight = document.body.clientHeight - this.$refs.header.clientHeight - this.$refs.footer.clientHeight + 'px';

        //
        this.$refs.container.style.width = document.body.clientWidth + 'px';
        this.$refs.container.style.height = document.body.clientHeight + 'px';
      },

      min () {
        this.maximized = false;

        this.$refs.bodyWrapper.style.maxHeight = this.maxHeight + 'px';
        this.$refs.bodyWrapper.style.maxWidth = this.maxWidth + 'px';

        this.$refs.container.style.width = 'auto';
        this.$refs.container.style.height = 'auto';
      },

      appear () {
        this.opacityStep = 0.05;

        if (!this.intervalLive) {
          this.showOrHide();
        }
      },

      disappear () {
        this.opacityStep = -0.05;

        if (!this.intervalLive) {
          this.showOrHide();
        }
      },

      showOrHide () {
        this.intervalLive = true;

        let interv = setInterval(() => {
          if (this.windowOpacity <= 0.15 && this.opacityStep < 0) {
            clearInterval(interv);

            this.intervalLive = false;
            this.windowOpacity = 0.15;
          } else if (this.windowOpacity >= 1.0 && this.opacityStep > 0) {
            clearInterval(interv);

            this.intervalLive = false;
            this.windowOpacity = 1.0;
          } else {
            this.windowOpacity += this.opacityStep;
          }
        }, 30);
      },
    },

    watch: {
      show (newVal) {
        if (newVal) {
          this.min();

          this.$emit('open');
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  @header-bgcolor-default: #005eb8;
  @header-bgcolor-success: #00a34e;
  @header-bgcolor-error: #ce0058;

  .my-modal {
    background-color: rgba(0, 0, 0, .2);
    box-sizing: border-box;
    display: table;
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9999;

    &__wrapper {
      display: table-cell;
      text-align: center;
      vertical-align: middle;
      z-index: 9999;
    }

    &__container {
      background-color: #fff;
      box-shadow: 0 7px 8px -4px rgba(0, 0, 0, .2), 0 13px 19px 2px rgba(0, 0, 0, .14), 0 5px 24px 4px rgba(0, 0, 0, .12);
      display: inline-block;
      margin: 0 auto;
      text-align: left;
      width: auto;
    }

    &__header {
      align-items: center;
      background-color: @header-bgcolor-default;
      box-sizing: border-box;
      color: #fff;
      cursor: default;
      display: flex;
      font-family: Amadeus, serif;
      font-size: 16px;
      font-weight: 400;
      justify-content: space-between;
      overflow: hidden;
      padding: 10px;
      text-overflow: ellipsis;
      user-select: none;
      white-space: nowrap;

      &--success {
        background-color: @header-bgcolor-success;
      }

      &--error {
        background-color: @header-bgcolor-error;
      }
    }

    &__header-icons {
      align-items: center;
      display: inline-flex;
      justify-content: center;

      & img {
        margin-left: 10px;
      }
    }

    &__close {
      cursor: pointer;
    }

    &__body-wrapper {
      box-sizing: border-box;
      overflow: auto;
    }

    &__body {
      box-sizing: border-box;
      padding: 10px;
    }

    &__ext {
      padding: 0 10px 10px;
    }

    &__footer {
      align-items: center;
      border-top: 1px solid #aaa;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-end;
      padding: 10px;

      & > * {
        margin-left: 5px;
      }
    }
  }
</style>