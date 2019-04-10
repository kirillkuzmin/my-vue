<template>
  <div class="my-table__search">
    <input
      :placeholder="$trans('myTableSearch.search')"
      @input="search($event.target.value)"
      type="text"
    >
  </div>
</template>

<script>
  export default {
    name: 'my-table-search',

    methods: {
      search (text) {
        this.$emit('search', text);
      },
    },
  };
</script>