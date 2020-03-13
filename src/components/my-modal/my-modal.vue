<template>
  <div class="my-modal" v-cloak v-show="show"><!--@click="hide"-->
    <div class="my-modal__wrapper" @click.self="closeMe(true)">
      <div
        class="my-modal__container"
        :style="'opacity: '+ windowOpacity + ';'"
        ref="container"
      >
        <!--@click.stop-->
        <div :class="headerClass" ref="header">
          <span v-text="header" v-if="header"></span>
          <template v-else>
            <slot name="header">default header</slot>
          </template>
          <div class="my-modal__header-icons">
            <icon-opacity
              :title="$trans('myModal.opacity')"
              v-if="opacityControl"
              @mouseenter.native="disappear"
              @mouseleave.native="appear"
            />
            <template v-if="fullScreen">
              <icon-enter-full-screen
                :title="$trans('myModal.enterFullScreen')"
                @click="enterFullScreen()"
                v-if="!inFullScreen"
              />
              <icon-exit-full-screen
                :title="$trans('myModal.exitFullScreen')"
                @click="exitFullScreen()"
                v-else
              />
            </template>
            <icon-minimize
              :title="$trans('myModal.minimize')"
              @click="minimizeMe"
              v-if="minimize"
            />
            <icon-close
              :title="$trans('myModal.close')"
              v-if="close"
              @click="closeMe"
            />
          </div>
        </div>
        <div
          :style="bodyWrapperStyle"
          class="my-modal__body-wrapper"
          ref="bodyWrapper"
        >
          <div class="my-modal__body" ref="body" v-html="body" v-if="body"></div>
          <div class="my-modal__body" ref="body" v-else>
            <slot name="body">default body</slot>
          </div>
        </div>
        <div class="my-modal__footer" ref="footer">
          <template v-if="type === 'alert'">
            <button
              ref="auto"
              type="button"
              v-text="$trans('myModal.btnOk')"
              @click="$emit('ok')"
            >
            </button>
          </template>
          <template v-else-if="type === 'confirm'">
            <button
              ref="auto"
              type="button"
              v-text="$trans('myModal.btnYes')"
              @click="$emit('yes')"
            >
            </button>
            <button
              type="button"
              v-text="$trans('myModal.btnNo')"
              @click="$emit('no')"
            >
            </button>
          </template>
          <template v-else>
            <slot name="footer">default footer</slot>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import IconClose from 'icons/icon-close.vue';
  import IconEnterFullScreen from 'icons/icon-enter-full-screen.vue';
  import IconExitFullScreen from 'icons/icon-exit-full-screen.vue';
  import IconMinimize from 'icons/icon-minimize.vue';
  import IconOpacity from 'icons/icon-opacity.vue';

  export default {
    name: 'my-modal',

    props: {
      body: {
        type: String,
        default: '',
      },

      close: {
        type: Boolean,
        default: false,
      },

      fullScreen: {
        type: Boolean,
        default: false,
      },

      header: {
        type: String,
        default: '',
      },

      headerType: String,

      maxWidth: String,

      maxHeight: String,

      minimize: {
        type: Boolean,
        default: false,
      },

      outsideClose: {
        type: Boolean,
        default: true,
      },

      opacityControl: {
        type: Boolean,
        default: true,
      },

      scroll: {
        type: Boolean,
        default: false,
      },

      show: {
        type: Boolean,
        default: false,
      },

      type: {
        type: String,
        default: '',
      },
    },

    data () {
      return {
        inFullScreen: false,
        intervalLive: false,
        opacityStep: 0.05,
        windowOpacity: 1.0,
      };
    },

    components: {
      IconClose,
      IconEnterFullScreen,
      IconExitFullScreen,
      IconMinimize,
      IconOpacity,
    },

    computed: {
      bodyWrapperStyle () {
        return {
          maxHeight: this.maxHeight + 'px',
          maxWidth: this.maxWidth + 'px',
          overflowY: this.scroll ? 'scroll' : 'auto',
        };
      },

      headerClass () {
        return [
          'my-modal__header',
          this.headerType ? 'my-modal__header--' + this.headerType : '',
        ];
      },

      /*hasExtSlot() {
         return !!this.$slots['ext'];
         }*/
    },

    created () {
      window.addEventListener('resize', () => {
        if (this.inFullScreen) {
          this.enterFullScreen();
        }
      });
    },

    mounted () {
      if (this.type) {
        this.$nextTick(() => this.$refs.auto.focus());
      }
    },

    methods: {
      closeMe (out = false) {
        if (out && !this.outsideClose) {
          return;
        }

        this.$emit('close');
      },

      minimizeMe () {
        this.$emit('minimize');
      },

      enterFullScreen () {
        this.inFullScreen = true;

        //
        this.$refs.bodyWrapper.style.maxHeight =
          document.body.clientHeight -
          this.$refs.header.clientHeight -
          this.$refs.footer.clientHeight +
          'px';

        //
        this.$refs.container.style.width = document.body.clientWidth + 'px';
        this.$refs.container.style.height = document.body.clientHeight + 'px';
      },

      exitFullScreen () {
        this.inFullScreen = false;

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
          this.exitFullScreen();

          this.$emit('open');
        }
      },
    },
  };
</script>