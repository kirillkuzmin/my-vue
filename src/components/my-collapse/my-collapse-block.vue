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
    name: 'my-collapse-block',

    props: {
      id: {
        type: String,
        default () {
          return Math.random()
            .toString(36)
            .slice(2);
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
          'max-height': this.showBlock
            ? this.$refs.content.scrollHeight + 'px'
            : 0,
        };
      },
    },

    created () {
      this.$bus.listen('my-collapse:add-validator', data => {
        if (data.blockId === this.id) {
          this.validators.push(data.validator);
        }
      });

      this.$bus.listen(`${this.id}:resize`, this.onResize);
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

    methods: {
      click () {
        this.showBlock = !this.showBlock;
      },

      onResize () {
        this.$refs.content.style.maxHeight =
          this.$refs.content.scrollHeight + 'px';
      },
    },
  };
</script>
