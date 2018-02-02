<template>
  <div
    :style="style"
    class="my-popover"
    ref="popover"
    v-click-outside="$_hide"
    v-show="show"
    @contextmenu.prevent=""
  >
    <div class="my-popover__body" ref="body" v-html="body" v-if="body"></div>
    <div class="my-popover__body" ref="body" v-else>
      <slot name="body">default body</slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'my-popover',

    props: {
      body: {
        type: String,
        default: '',
      },

      maxHeight: String,

      maxWidth: String,
    },

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
          maxHeight: this.maxHeight + 'px',
          maxWidth: this.maxWidth + 'px',
          top: this.y + 'px',
        };
      },
    },

    created () {
      this.$bus.listen('my-popover:show', this.$_show);
      this.$bus.listen('my-popover:hide', this.$_hide);
    },

    methods: {
      $_hide () {
        this.show = false;
      },

      $_show () {
        const source = window.event.target.getBoundingClientRect();

        const scrollingElement = document.scrollingElement || document.documentElement;

        this.show = true;

        this.$nextTick(() => {
          const popoverHeight = this.$refs.popover.getBoundingClientRect().height;
          const popoverWidth = this.$refs.popover.getBoundingClientRect().width;

          const bottomEdge = window.innerHeight + scrollingElement.scrollTop;
          const rightEdge = window.innerWidth + scrollingElement.scrollLeft;

          const bottom = source.top + source.height + popoverHeight;
          const right = source.left + popoverWidth;

          if (bottomEdge < bottom) {
            this.y = source.top - popoverHeight + scrollingElement.scrollTop;
          } else {
            this.y = source.top + source.height + scrollingElement.scrollTop;
          }

          if (rightEdge < right) {
            this.x = source.left + source.width - popoverWidth;
          } else {
            this.x = source.left;
          }
        });
      },
    },
  };
</script>