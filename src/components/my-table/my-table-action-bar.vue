<template>
  <div class="my-table__action-bar" v-click-outside="hideActionBar">
    <div class="my-table__action-bar-icon">
      <icon-settings @click="showActionBar"/>
    </div>
    <div class="my-table__action-bar-container" v-show="show">
      <div class="my-table__search">
        <input type="text" placeholder="Поиск" @input="search($event.target.value)">
      </div>
    </div>
  </div>
</template>

<script>
  import clickOutside from 'directives/click-outside';
  import IconSettings from 'icons/icon-settings.vue';

  export default {
    props: {},

    data () {
      return {
        show: false,
      };
    },

    components: {
      'icon-settings': IconSettings,
    },

    directives: {
      'click-outside': clickOutside,
    },

    methods: {
      search (text) {
        this.$emit('search', text);
      },

      showActionBar () {
        this.show = true;
      },

      hideActionBar () {
        this.show = false;
      },
    },
  };
</script>

<style lang="less" scoped>
  @excel-icon-margin-left: 5px;
  @excel-icon-width: 16px;
  @search-input-width: 160px;

  .my-table {
    &__action-bar {
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      position: absolute;
    }

    &__action-bar-container {
      align-items: center;
      background-color: #fff;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12);
      cursor: default;
      display: inline-flex;
      justify-content: center;
      min-width: @search-input-width + @excel-icon-width + @excel-icon-margin-left;
      padding: 5px;
      position: absolute;
      z-index: 9998;
    }

    &__action-bar-icon {
      position: absolute;
      z-index: 9997;
    }

    &__excel {
      margin-left: @excel-icon-margin-left;
    }

    &__search {
      & input {
        width: @search-input-width;
      }
    }
  }
</style>