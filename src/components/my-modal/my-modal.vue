<template>
  <div class="my-modal" v-show="show"><!--@click="hide"-->
    <div class="my-modal__wrapper">
      <div class="my-modal__container" :style="'opacity: '+ windowOpacity + ';'" ref="container">
        <!--@click.stop-->
        <div :class="headerClass" ref="header">
          <span v-text="header" v-if="header"></span>
          <template v-else>
            <slot name="header">default header</slot>
          </template>
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
          <div class="my-modal__body" ref="body" v-html="body" v-if="body"></div>
          <div class="my-modal__body" ref="body" v-else>
            <slot name="body">default body</slot>
          </div>
        </div>
        <div class="my-modal__footer" ref="footer">
          <template v-if="type === 'alert'">
            <button type="button" @click="$emit('ok')" autofocus>OK</button>
          </template>
          <template v-else-if="type === 'confirm'">
            <button type="button" @click="$emit('yes')" autofocus>Да</button>
            <button type="button" @click="$emit('no')">Нет</button>
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
  import IconOpacity from 'icons/icon-opacity.vue';
  import IconMaximize from 'icons/icon-maximize.vue';
  import IconMinimize from 'icons/icon-minimize.vue';

  export default {
    props: {
      body: {
        type: String,
        default: '',
      },

      close: {
        type: Boolean,
        default: false,
      },

      header: {
        type: String,
        default: '',
      },

      headerType: String,

      maxMin: {
        type: Boolean,
        default: false,
      },

      maxWidth: String,

      maxHeight: String,

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