<template>
  <div
    :style="style"
    class="my-context-menu"
    ref="container"
    v-click-outside="hide"
    v-show="show"
    @contextmenu.prevent=""
  >
    <slot></slot>
  </div>
</template>

<script>

  export default {
    name: 'my-context-menu',

    props: {
      position: {
        type: String,
        default: 'auto',
      },
    },

    data () {
      return {
        height: 0,
        show: false,
        width: 0,
        x: 0,
        y: 0,
      };
    },

    computed: {
      style () {
        return {
          left: this.x + 'px',
          top: this.y + 'px',
        };
      },
    },

    mounted () {
      this.$bus.listen('my-context-menu:hide', this.hide);

      window.addEventListener('resize', this.hide);
    },

    methods: {
      hide () {
        if (this.show) {
          this.show = false;
        }
      },

      async open (e) {
        this.$bus.fire('my-context-menu:hide');

        // to wait for v-click-outside
        await this.$nextTick();

        this.show = true;

        await this.$nextTick();

        this.setSize();

        this.setPosition(e);
      },

      setSize () {
        this.width = this.$refs.container.getBoundingClientRect().width;
        this.height = this.$refs.container.getBoundingClientRect().height;
      },

      setPosition (e) {
        e = e || window.event;

        switch (this.position) {
          case 'auto':
            this.setAuto(e);

            break;
          case 'bottomRight':
            this.setBottomRight(e.srcElement);

            break;
          default:
            break;
        }
      },

      setAuto (e) {
        let {scrollLeft, scrollTop} = this.getScrolling();

        const mouseX = e.pageX || e.clientX + scrollLeft;
        const mouseY = e.pageY || e.clientY + scrollTop;

        let rightEdge = window.innerWidth - mouseX;

        let bottomEdge = window.innerHeight - mouseY
          - document.getElementsByTagName('footer')[0].clientHeight;

        if (rightEdge < this.width) {
          this.x = mouseX - this.width;
        } else {
          this.x = mouseX;
        }

        if (bottomEdge < this.height) {
          bottomEdge = mouseY - this.height;

          this.y = (bottomEdge < 0 ? 0 : bottomEdge);
        } else {
          this.y = mouseY;
        }
      },

      setBottomRight (element) {
        let {scrollLeft, scrollTop} = this.getScrolling();

        this.x = element.getBoundingClientRect().right - this.width + scrollLeft;
        this.y = element.getBoundingClientRect().bottom + scrollTop;
      },

      getScrolling () {
        const scrollingElement = document.scrollingElement
          || document.documentElement;

        return {
          scrollLeft: scrollingElement.scrollLeft,
          scrollTop: scrollingElement.scrollTop,
        };
      },
    },
  };
</script>
