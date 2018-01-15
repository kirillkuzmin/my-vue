<template>
  <div :class="itemClass">
    <div class="my-menu-item__before" v-if="$slots.before">
      <slot name="before"></slot>
    </div>
    <div class="my-menu-item__text" @click="go">
      <span v-text="text"></span>
    </div>
    <div class="my-menu-item__after" v-if="$slots.after">
      <slot name="after"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: 'New menu item',
      },

      url: {
        type: String,
        default: '/',
      },
    },

    computed: {
      itemClass () {
        return [
          'my-menu-item',
        ];
      },
    },

    methods: {
      go () {
        location.href = this.url;
      },
    },
  };
</script>