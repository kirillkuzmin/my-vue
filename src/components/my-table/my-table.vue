<template>
  <div class="my-table" v-show="ready">
    <my-table-action-bar
      v-if="actionBar && data.length"
      @search="find"
    />
    <div class="my-table__wrapper" v-if="found">
      <div class="my-table__fixed-header" ref="fixedHeader" v-if="fixedHeader">
        <table :class="tableClass" :style="getTableStyle()">
          <thead ref="thead_fixed">
          <tr>
            <td
              v-for="(column, key) in columns"
              :class="getColumnClass(column, key)"
              :style="getColumnStyle(column)"
              v-show="!column.hidden"
              @click="column.sortable === false ? false : sortBy(key, null, column.sortType)"
            >
              <slot
                :name="'columns:' + key"
                :value="column.title"
                v-if="slotExists('columns:' + key)"
              >
              </slot>
              <slot v-else>
                <span v-html="column.title ? column.title : key"></span>
              </slot>
            </td>
          </tr>
          </thead>
        </table>
      </div>
      <div class="my-table__table" ref="table">
        <table :class="tableClass" :id="id" :style="getTableStyle()">
          <thead ref="thead">
          <tr>
            <td
              v-for="(column, key) in columns"
              :class="[{ 'my-table__column--sorted': sortKey === key }, column.class]"
              :style="getColumnStyle(column)"
              v-show="!column.hidden"
              @click="column.sortable === false ? false : sortBy(key, null, column.sortType)"
            >
              <slot
                :name="'columns:' + key"
                :value="column.title"
                v-if="slotExists('columns:' + key)"
              >
              </slot>
              <slot v-else>
                <span v-html="column.title ? column.title : key"></span>
              </slot>
            </td>
          </tr>
          </thead>
          <tbody ref="tbody">
          <tr
            v-for="row in filteredData"
            :class="[{ 'my-table__row--selected': row.rowId == selectedRow }, row.rowClass]"
            :id="row.rowId"
          >
            <template v-for="(column, key) in columns">
              <td
                :class="[{ 'my-table__cell--sorted': sortKey === key }, getCellClass(row[key])]"
                v-if="slotExists(key)"
                v-show="!column.hidden"
              >
                <slot
                  :name="key"
                  :raw-value="row[key]"
                  :value="getCellValue(row[key])"
                >
                </slot>
              </td>
              <td
                :class="[{ 'my-table__cell--sorted': sortKey === key }, getCellClass(row[key])]"
                v-else
                v-html="getCellValue(row[key])"
                v-show="!column.hidden"
              >
              </td>
            </template>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <p class="alert alert-info mb-0" v-if="data.length && !found">Ничего не найдено!</p>
    <slot name="empty" v-if="!data.length">
      <p class="alert alert-info mb-0">Список пуст!</p>
    </slot>
  </div>
</template>

<script>
  import debounce from 'lodash/debounce';
  import isObject from 'lodash/isObject';
  import MyTableActionBar from './my-table-action-bar.vue';
  import orderBy from 'lodash/orderBy';
  import remove from 'lodash/remove';
  import { getScrollbarWidth } from 'utils/scroll';

  let onWindowResize = () => {
  };

  export default {
    props: {
      actionBar: {
        type: Boolean,
        default: true,
      },

      columns: {
        type: Object,
        required: true,
      },

      data: {
        type: Array,
        required: true,
      },

      events: {
        type: String,
        default: '',
      },

      fixedHeader: {
        type: Boolean,
        default: true,
      },

      id: {
        type: String,
        required: true,
      },

      minHeight: {
        type: Number,
        default: 150,
      },

      ready: {
        type: Boolean,
        default: false,
      },

      sort: {
        type: Boolean,
        default: true,
      },

      sortColumn: String,

      sortDirection: {
        type: String,
        default: 'asc',
      },

      tableClass: {
        type: String,
        required: true,
      },

      tableStyle: {
        type: Object,
        default () {
          return {};
        },
      },
    },

    components: {
      'my-table-action-bar': MyTableActionBar,
    },

    data () {
      return {
        sortKey: this.sortColumn,
        sortOrder: this.sortDirection,
        sortType: '',
        searchQuery: '',
        selectedRow: '',
        scrollX: false,
      };
    },

    created () {
      if (typeof scrollbarWidth === 'undefined') {
        window.scrollbarWidth = getScrollbarWidth();
      }

      this.$bus.listen('my-table:select', data => {
        if (data.myTableId === this.id) {
          this.selectedRow = data.rowId;

          if (data.scrollTo) {
            this.scrollTo();
          }
        }
      });

      if (this.fixedHeader) {
        this.$bus.listen('my-table:onload', myTableId => {
          if (!myTableId || myTableId === this.id) {
            this.$nextTick(() => this.redraw());
          }
        });

        this.$bus.listen('my-table:redraw', myTableId => {
          if (!myTableId || myTableId === this.id) {
            this.$nextTick(() => this.redraw());
          }
        });
      }
    },

    mounted () {
      if (this.fixedHeader) {
        onWindowResize = debounce(this.redraw, 100);

        window.addEventListener('resize', onWindowResize);
      }
    },

    destroyed () {
      this.$bus.destroy();

      if (this.fixedHeader) {
        window.removeEventListener('resize', onWindowResize);
      }
    },

    computed: {
      found () {
        return this.filteredData.length > 0;
      },

      filteredData () {
        const sortKey = this.sortKey;
        const sortDir = this.sortOrder;
        const sortType = this.sortType;
        const filterKey = this.searchQuery && this.searchQuery.toLowerCase();

        let data = this.data.slice();

        if (filterKey) {
          data = data.filter(function (row) {
            return Object.keys(row).some(function (key) {
              return String((isObject(row[key]) ? row[key].value : row[key])).toLowerCase().indexOf(filterKey) > -1;
            });
          });
        }

        if (sortKey) {
          let fixed = remove(data, function (row) {
            return row.ignoreSort;
          });

          data = orderBy(data, (e) => {
            let cell = e[sortKey];

            if (sortType === 'numeric') {
              cell = (isObject(cell) ? cell.value : cell);
              cell = (isNaN(parseFloat(cell)) ? cell : parseFloat(cell));
              return cell;
            }

            return (isObject(cell) ? cell.value : cell);
          }, sortDir);

          fixed.forEach(element => {
            data.push(element);
          });
        }

        this.$emit('found', data);

        return data;
      },
    },

    watch: {
      data () {
        this.$nextTick(() => this.assignEvents());
      },

      ready () {
        if (this.sortColumn && this.sortColumn === this.sortKey) {
          this.sortBy(this.sortColumn, this.sortDirection);
        }
      },
    },

    methods: {
      sortBy (key, dir, type) {
        if (this.sort) {
          if (this.sortKey !== key) {
            this.sortOrder = 'asc';
          } else {
            this.sortOrder = (dir ? dir : (this.sortOrder === 'asc' ? 'desc' : 'asc'));
          }

          this.sortKey = key;
          this.sortType = type;
        }
      },

      slotExists (name) {
        return typeof this.$scopedSlots[name] === 'function';
      },

      assignEvents () {
        if (this.events.length && this.found) {
          const events = this.events.split(',');

          Array.from(this.$refs.tbody.children).forEach((row, index) => {
            if (!this.data[index].ignoreEvents) {
              for (let i in events) {
                let ev = events[i].toLowerCase().trim();

                row.addEventListener(ev, e => {
                  if (e.target === row) {
                    e.preventDefault();
                  }

                  this.selectedRow = row.id;
                  this.$emit('row-' + ev, row.id, e);
                });
              }
            }
          });

          this.$emit('events-assigned');
        }
      },

      getTableStyle () {
        let style = '';

        const hasStyles = Object.keys(this.tableStyle).length;

        if (hasStyles) {
          for (let key in this.tableStyle) {
            let value = this.tableStyle[key];

            style += key + ': ' + value + ';';
          }
        }

        return style;
      },

      getColumnClass (column, key) {
        return [
          {
            'my-table__column--sorted': this.sortKey === key,
            'my-table__column--not-sortable': column.sortable === false,
          },
          column.class,
        ];
      },

      getColumnStyle (options) {
        let style = '';

        if (options.width) {
          style = 'width: ' + options.width + ';';
        }

        return style;
      },

      getCellValue (cell) {
        if (isObject(cell)) {
          return cell.value;
        } else {
          return cell;
        }
      },

      getCellClass (cell) {
        if (isObject(cell) && cell.hasOwnProperty('class')) {
          return cell.class;
        }

        return '';
      },

      adjustHeight () {
        let totalHeight = 0;

        let myTablesCount = 0;

        let initialHeights = [];

        let scrollPositions = [];

        let scrollHeights = [];

        let minHeights = [];

        let newHeights = [];

        let spaceForMyTables = 0;

        const myTables = document.getElementsByClassName('my-table__table');

        Array.from(myTables).forEach((myTable, i) => {
          if (getComputedStyle(myTable).display === 'block' && myTable.clientHeight > 0) {
            scrollPositions[i] = myTable.scrollTop;

            scrollHeights[i] = myTable.scrollHeight - myTable.clientHeight;

            myTable.style.height = 'auto';
            myTable.style.width = 'auto';

            let tableHeight = myTable.firstChild.offsetHeight;

            initialHeights[i] = tableHeight;

            minHeights[i] = (tableHeight < this.minHeight ? tableHeight : this.minHeight);

            totalHeight += tableHeight;

            myTablesCount++;
          }
        });

        const main = document.getElementsByTagName('main')[0];

        let content = document.getElementsByClassName('content')[0];

        /*if (content === undefined) {
          content = document.getElementsByTagName('body')[0];
        }*/

        spaceForMyTables = main.offsetHeight - (content.offsetHeight - totalHeight) - 0.001;

        for (let i in initialHeights) {
          if (initialHeights[i] < spaceForMyTables / myTablesCount) {
            newHeights[i] = initialHeights[i];
            spaceForMyTables -= initialHeights[i];
            myTablesCount--;
          }
        }

        for (let i in initialHeights) {
          if (newHeights[i] === undefined) {
            newHeights[i] = Math.round(Math.min(initialHeights[i], spaceForMyTables / myTablesCount));
          }
        }

        Array.from(myTables).forEach((myTable, i) => {
          if (getComputedStyle(myTable).display === 'block' && myTable.clientHeight > 0) {
            let height = 0;

            if (spaceForMyTables / myTablesCount > minHeights[i]) {
              height = newHeights[i];
            } else {
              height = minHeights[i];
            }

            myTable.style.height = height + 'px';

            let width = 0;

            if (myTable.scrollHeight > myTable.offsetHeight) {
              width = myTable.firstChild.getBoundingClientRect().width + 0.001 + window.scrollbarWidth;
            } else {
              width = myTable.firstChild.getBoundingClientRect().width + 0.001;
            }

            myTable.style.width = width + 'px';

            let diff = (myTable.scrollHeight - myTable.clientHeight) - scrollHeights[i];

            if (scrollPositions[i] > 0) {
              myTable.scrollTop = scrollPositions[i] + diff;
            }
          }
        });
      },

      fixHeader () {
        const baseRow = this.$refs.thead.firstChild;
        const fixedRow = this.$refs.thead_fixed.firstChild;

        Array.from(fixedRow.cells).forEach((cell, index) => {
          cell.style.width = baseRow.cells[index].getBoundingClientRect().width + 0.001 + 'px';
        });

        this.$refs.fixedHeader.style.width = this.$refs.thead.getBoundingClientRect().width + 1 + 'px';
        this.$refs.table.style.marginTop = -baseRow.offsetHeight - 1 + 'px';
      },

      redraw () {
        if (this.ready && this.found) {
          this.fixHeader();
          this.adjustHeight();
          this.fixHeader();
        }
      },

      find (text) {
        this.searchQuery = text;

        this.$nextTick(() => {
          this.$bus.fire('my-table:redraw');

          this.assignEvents();
        });
      },

      scrollTo () {
        if (!this.found) {
          return;
        }
        const tr = document.getElementById(this.selectedRow);

        const headerHeight = this.$refs.fixedHeader.clientHeight;

        this.$refs.table.scrollTop = (tr ? tr.offsetTop - headerHeight : 0);
      },
    },
  };
</script>

<style lang="less" scoped>
  @table-column-sorted: #dcedf8;
  @table-cell-sorted: #edf5fb;
  @table-row-selected: #e0e0e0;

  .my-table {
    position: relative;

    &__wrapper {
      overflow-x: auto;
      width: auto;
    }

    &__fixed-header {
      position: relative;
      z-index: 2;

      & table {
        & thead {
          & td, th {
            box-sizing: border-box;
            cursor: pointer;
          }
        }
      }
    }

    &__column {
      &--sorted {
        background-color: @table-column-sorted !important;
      }

      &--not-sortable {
        cursor: default !important;
      }
    }

    &__row {
      &--selected {
        & td {
          background-color: @table-row-selected;
        }
      }
    }

    &__cell {
      &--sorted {
        background-color: @table-cell-sorted;
      }
    }

    &__table {
      overflow-x: hidden;
      overflow-y: auto;

      & table {
        & thead {
          & td, th {
            box-sizing: border-box;
          }
        }
      }
    }

    & p {
      margin-top: 0;
    }
  }
</style>
