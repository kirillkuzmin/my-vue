<template>
  <div class="my-table__action-bar" v-click-outside="hideActionBar">
    <div class="my-table__action-bar-icon">
      <icon-settings
        :size="16"
        @click="showActionBar"
      />
    </div>
    <div class="my-table__action-bar-container" v-show="show">
      <div class="my-table__search">
        <input type="text" placeholder="Поиск" @input="search($event.target.value)">
      </div>
      <my-excel
        :columns="$parent.columns"
        :data="$parent.filteredData"
        class="my-table__excel"
      />
    </div>
  </div>
</template>

<script>
  import IconSettings from 'icons/icon-settings.vue';
  import MyExcel from 'components/my-excel';

  export default {
    props: {},

    data () {
      return {
        show: false,
      };
    },

    components: {
      'icon-settings': IconSettings,
      'my-excel': MyExcel,
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