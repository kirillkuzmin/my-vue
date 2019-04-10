<template>
  <div class="my-table__pagination">
    <icon-first-page
      :size="16"
      :disabled="currentNum === 1"
      class="my-table__page"
      :title="$trans('myTable.firstPage')"
      @click="first"
    />
    <icon-arrow-left
      :size="16"
      :disabled="currentNum === 1"
      class="my-table__page"
      :title="$trans('myTable.previousPage')"
      @click="previous"
    />
    <div class="my-table__pagination-range">
      {{ `${from} - ${to} ${$trans('myTable.of')} ${total}` }}
    </div>
    <icon-arrow-right
      :size="16"
      :disabled="currentNum === pagesCount"
      class="my-table__page"
      :title="$trans('myTable.nextPage')"
      @click="next"
    />
    <icon-last-page
      :size="16"
      :disabled="currentNum === pagesCount"
      class="my-table__page"
      :title="$trans('myTable.lastPage')"
      @click="last"
    />
  </div>
</template>

<script>
  import IconArrowLeft from 'icons/icon-arrow-left.vue';
  import IconArrowRight from 'icons/icon-arrow-right.vue';
  import IconFirstPage from 'icons/icon-first-page.vue';
  import IconLastPage from 'icons/icon-last-page.vue';

  export default {
    name: 'my-table-pagination',

    props: {},

    data () {
      return {
        currentNum: 1,
        rowsPerPage: this.$parent.pageLength,
      };
    },

    components: {
      IconArrowLeft,
      IconArrowRight,
      IconFirstPage,
      IconLastPage,
    },

    computed: {
      from () {
        if (this.currentNum === 1) {
          return 1;
        }

        return (this.currentNum - 1) * this.rowsPerPage + 1;
      },

      to () {
        if (this.currentNum === this.pagesCount) {
          return this.total;
        }

        return this.currentNum * this.rowsPerPage;
      },

      total () {
        return this.$parent.totalRows || this.$parent.data.length;
      },

      pagesCount () {
        return Math.ceil(this.total / this.rowsPerPage);
      },
    },

    methods: {
      openPage (num) {
        if (num) {
          this.currentNum = num;
        }

        this.$emit('change', this.currentNum);
      },

      previous () {
        this.currentNum--;

        this.openPage();
      },

      next () {
        this.currentNum++;

        this.openPage();
      },

      first () {
        this.currentNum = 1;

        this.openPage();
      },

      last () {
        this.currentNum = this.pagesCount;

        this.openPage();
      },

      getPageClass (num) {
        return [
          'my-table__page',
          {
            'my-table__page--current': num === this.$parent.currentPage,
          },
        ];
      },
    },
  };
</script>
