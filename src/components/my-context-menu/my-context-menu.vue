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
    props: {},

    data () {
      return {
        show: false,
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

    created () {
      this.$bus.listen('my-context-menu:hide', () => {
        this.hide();
      });
    },

    methods: {
      hide () {
        this.show = false;
      },

      open (e) {
        this.$bus.fire('my-context-menu:hide');

        e = e || window.event;

        const scrollingElement = document.scrollingElement
          || document.documentElement;

        const mouseX = e.pageX || e.clientX + scrollingElement.scrollLeft;
        const mouseY = e.pageY || e.clientY + scrollingElement.scrollTop;

        this.show = true;

        this.$nextTick(() => {
          const menuHeight = this.$refs.container.getBoundingClientRect().height;
          const menuWidth = this.$refs.container.getBoundingClientRect().width;

          let rightEdge = window.innerWidth - mouseX;

          let bottomEdge = window.innerHeight - mouseY
            - document.getElementsByTagName('footer')[0].clientHeight;

          if (rightEdge < menuWidth) {
            this.x = mouseX - menuWidth;
          } else {
            this.x = mouseX;
          }

          if (bottomEdge < menuHeight) {
            bottomEdge = mouseY - menuHeight;

            this.y = (bottomEdge < 0 ? 0 : bottomEdge);
          } else {
            this.y = mouseY;
          }
        });
      },
    },
  };
</script>
