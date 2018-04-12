<template>
  <div class="my-table" v-show="ready">
    <my-table-action-bar
      v-if="actionBar && data.length"
      @search="find"
    />
    <my-table-pagination
      ref="pagination"
      v-if="paging"
      @change="onPageChange"
    />
    <div class="my-table__wrapper" v-if="found">
      <div class="my-table__fixed-header" ref="fixedHeader" v-if="fixedHeader">
        <table :class="tableClass" :style="tableStyle">
          <thead ref="thead_fixed">
          <tr>
            <td
              v-for="(column, key) in columns"
              :class="getColumnClass(column, key)"
              :style="getColumnStyle(column)"
              v-show="!column.hidden"
              @click="column.sortable === false ? false : sortBy(key, null, column.sortType, $event)"
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
        <table :class="tableClass" :id="id" :style="tableStyle">
          <thead ref="thead">
          <tr>
            <td
              v-for="(column, key) in columns"
              :class="getColumnClass(column, key)"
              :style="getColumnStyle(column)"
              v-show="!column.hidden"
              @click="column.sortable === false ? false : sortBy(key, null, column.sortType, $event)"
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
            v-for="(row, i) in filteredData"
            :class="getRowClass(row)"
            :id="row.rowId"
          >
            <template v-for="(column, key) in columns">
              <td
                :class="getCellClass(row[key], key)"
                :style="getCellStyle(column)"
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
                :class="getCellClass(row[key], key)"
                :style="getCellStyle(column)"
                v-html="getCellValue(row[key])"
                v-show="!column.hidden"
                v-else
              >
              </td>
            </template>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <my-alert type="warning" v-if="data.length && !found">
      {{ $trans('myTable.nothingFound') }}
    </my-alert>
    <slot name="empty" v-if="!data.length">
      <my-alert type="info">
        {{ $trans('myTable.empty') }}
      </my-alert>
    </slot>
  </div>
</template>

<script>
  import debounce from 'lodash/debounce';
  import isObject from 'lodash/isObject';
  import MyAlert from 'components/my-alert';
  import MyTableActionBar from './my-table-action-bar.vue';
  import MyTablePagination from './my-table-pagination.vue';
  import orderBy from 'lodash/orderBy';
  import remove from 'lodash/remove';
  import { getScrollbarWidth } from 'utils/scroll';

  let onWindowResize = () => {};

  export default {
    name: 'my-table',

    props: {
      actionBar: {
        type: Boolean,
        default: true,
      },

      ajax: {
        type: Boolean,
        default: false,
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

      excelFilename: {
        type: String,
        default: 'table',
      },

      excelTimestamp: {
        type: Boolean,
        default: false,
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

      multiSort: {
        type: Boolean,
        default: true,
      },

      pageLength: {
        type: Number,
        default: 50,
      },

      paging: {
        type: Boolean,
        default: false,
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
      MyAlert,
      MyTableActionBar,
      MyTablePagination,
    },

    data () {
      return {
        currentPage: 1,
        sCols: [],
        scrollX: false,
        sDirs: [],
        searchQuery: '',
        selectedRow: '',
        sortKey: this.sortColumn,
        sortOrder: this.sortDirection,
        sortType: '',
        sTypes: [],
        totalRows: 0,
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

      this.$bus.listen(`${this.id}:goto`, pageNum => {
        this.$refs.pagination.currentNum = pageNum;

        this.currentPage = pageNum;
      });

      this.$bus.listen(`${this.id}:set_total`, total => {
        this.totalRows = total;
      });

      if (this.fixedHeader) {
        this.$bus.listen('my-table:onload', myTableId => {
          if (!myTableId || myTableId === this.id) {
            this.$nextTick(this.redraw);
          }
        });

        this.$bus.listen('my-table:redraw', myTableId => {
          if (!myTableId || myTableId === this.id) {
            this.$nextTick(this.redraw);
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
      $_forKeep: {
        get () {
          if (!this.multiSort) {
            return {
              selectedRow: this.selectedRow,
              sortKey: this.sortKey,
              sortOrder: this.sortOrder,
              pageNum: this.currentPage,
            };
          }

          return {
            selectedRow: this.selectedRow,
            sortKeys: this.sCols,
            sortOrders: this.sDirs,
            sortTypes: this.sTypes,
            pageNum: this.currentPage,
          };
        },

        set (newValue) {
          let i = setInterval(() => {
            if (this.ready) {
              clearInterval(i);

              this.$bus.fire('my-table:select', {
                myTableId: this.id,
                rowId: newValue.selectedRow,
                scrollTo: true,
              });
            }
          }, 50);

          if (this.paging) {
            this.currentPage = newValue.pageNum;

            this.$refs.pagination.currentNum = newValue.pageNum;
          }

          if (!this.multiSort) {
            this.sortBy(newValue.sortKey, newValue.sortOrder);

            return;
          }

          if (!newValue.hasOwnProperty('sortKeys')) {
            return;
          }

          this.sCols = newValue.sortKeys;
          this.sDirs = newValue.sortOrders;
          this.sTypes = newValue.sortTypes;

          let j = this.sCols.length - 1;

          this.sortBy(this.sCols[j], this.sDirs[j], this.sTypes[j]);
        },
      },

      found () {
        return this.filteredData.length > 0;
      },

      filteredData () {
        return this.ajax ? this.dynamicData : this.staticData;
      },

      dynamicData () {
        if (!this.ajax) {
          return {};
        }

        return this.data.slice();
      },

      staticData () {
        if (this.ajax) {
          return {};
        }

        const sortKey = this.sortKey;
        const sortDir = this.sortOrder;
        const sortType = this.sortType;
        const filterKey = this.searchQuery && this.searchQuery.toLowerCase();

        let data;

        if (this.paging) {
          const from = (this.currentPage - 1) * this.pageLength;
          const to = from + this.pageLength;

          data = this.data.slice(from, to);
        } else {
          data = this.data.slice();
        }

        if (filterKey) {
          data = data.filter(function (row) {
            return Object.keys(row).some(function (key) {
              return (
                String(isObject(row[key]) ? row[key].value : row[key])
                  .toLowerCase()
                  .indexOf(filterKey) > -1
              );
            });
          });
        }

        if (sortKey) {
          let fixed = remove(data, function (row) {
            return row.ignoreSort;
          });

          const pos = this.sCols.indexOf(sortKey);

          if (pos !== -1 || sortDir === 'none') {
            this.sCols.splice(pos, 1);
            this.sDirs.splice(pos, 1);
            this.sTypes.splice(pos, 1);
          }

          if (sortDir !== 'none') {
            this.sCols.push(sortKey);
            this.sDirs.push(sortDir);
            this.sTypes.push(sortType);
          }

          if (sortDir === 'none') {
            this.sortKey = '';
            this.sortOrder = '';
            this.sortType = '';
          }

          this.sCols.forEach((col, i) => {
            data = orderBy(
              data,
              e => {
                const sType = this.sTypes[i];

                let cell = e[col];

                // TODO: regexp
                if (sType && sType.includes('column')) {
                  cell = e[sType.split(':')[1]];

                  return isObject(cell) ? cell.value : cell;
                }

                if (sType === 'numeric') {
                  cell = isObject(cell) ? cell.value : cell;
                  cell = isNaN(parseFloat(cell)) ? cell : parseFloat(cell);

                  return cell;
                }

                return isObject(cell) ? cell.value : cell;
              },
              this.sDirs[i],
            );
          });

          fixed.forEach(element => {
            data.push(element);
          });
        }

        this.$emit('found', data);

        return data;
      },
    },

    methods: {
      $_getLastSortCol () {
        if (this.multiSort) {
          return this.sCols[this.sCols.length - 1];
        }

        return this.sortKey;
      },

      $_getSortDir (column) {
        if (this.multiSort) {
          const pos = this.sCols.indexOf(column);

          return this.sDirs[pos];
        }

        return this.sortOrder;
      },

      sortBy (key, dir, type, event) {
        if (this.sort) {
          if (key === undefined) {
            this.sortKey = '';
            this.sortOrder = '';
            this.sortType = '';

            return;
          }

          let sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';

          if (this.multiSort) {
            switch (this.$_getSortDir(key)) {
              case 'asc':
                sortOrder = 'desc';
                break;
              case 'desc':
                sortOrder = 'none';
                break;
              default:
                sortOrder = 'asc';
                break;
            }
          }

          this.sortKey = key;
          this.sortOrder = dir ? dir : sortOrder;
          this.sortType = type;

          if (event && event.type === 'click') {
            this.$emit('sort', {
              col: this.sortKey,
              dir: this.sortOrder,
            });
          }
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

      getColumnClass (column, key) {
        return [
          'my-table__column',
          {
            'my-table__column--multi':
            this.multiSort && column.sortable !== false,
            'my-table__column--sorted': this.$_getLastSortCol() === key,
            'my-table__column--sorted-asc':
            this.multiSort && this.$_getSortDir(key) === 'asc',
            'my-table__column--sorted-desc':
            this.multiSort && this.$_getSortDir(key) === 'desc',
            'my-table__column--not-sortable':
            column.sortable === false || !this.sort,
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

      getRowClass (row) {
        return [
          {
            'my-table__row--selected': row.rowId == this.selectedRow,
          },
          row.rowClass,
        ];
      },

      getCellValue (cell) {
        if (isObject(cell)) {
          return cell.value;
        } else {
          return cell;
        }
      },

      getCellClass (cell, key) {
        let cl = [];

        if (isObject(cell) && cell.hasOwnProperty('class')) {
          cl.push(cell.class);
        }

        if (key === this.$_getLastSortCol()) {
          cl.push('my-table__cell--sorted');
        }

        return cl;
      },

      getCellStyle (column) {
        let style = '';

        if (column.width) {
          style = 'width: ' + column.width + ';';
        }

        return style;
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
          if (
            getComputedStyle(myTable).display === 'block' &&
            myTable.clientHeight > 0
          ) {
            scrollPositions[i] = myTable.scrollTop;

            scrollHeights[i] = myTable.scrollHeight - myTable.clientHeight;

            myTable.style.height = 'auto';
            myTable.style.width = 'auto';

            const tableHeight = myTable.firstChild.getBoundingClientRect().height;

            initialHeights[i] = tableHeight;

            minHeights[i] =
              tableHeight < this.minHeight ? tableHeight : this.minHeight;

            totalHeight += tableHeight;

            myTablesCount++;
          }
        });

        const main = document.getElementsByTagName('main')[0];

        let content = document.getElementsByClassName('content')[0];

        spaceForMyTables =
          main.offsetHeight - (content.offsetHeight - totalHeight) - 0.001;

        for (let i in initialHeights) {
          if (initialHeights[i] < spaceForMyTables / myTablesCount) {
            newHeights[i] = initialHeights[i];
            spaceForMyTables -= initialHeights[i];
            myTablesCount--;
          }
        }

        for (let i in initialHeights) {
          if (newHeights[i] === undefined) {
            newHeights[i] = Math.round(
              Math.min(initialHeights[i], spaceForMyTables / myTablesCount),
            );
          }
        }

        Array.from(myTables).forEach((myTable, i) => {
          if (
            getComputedStyle(myTable).display === 'block' &&
            myTable.clientHeight > 0
          ) {
            let height = 0;

            if (spaceForMyTables / myTablesCount > minHeights[i]) {
              height = newHeights[i];
            } else {
              height = minHeights[i];
            }

            myTable.style.height = height + 'px';

            let width = 0;

            if (this.getScrollHeight(myTable) > myTable.clientHeight) {
              width =
                myTable.firstChild.getBoundingClientRect().width +
                0.001 +
                window.scrollbarWidth;
            } else {
              width = myTable.firstChild.getBoundingClientRect().width + 0.001;
            }

            myTable.style.width = width + 'px';

            let diff =
              myTable.scrollHeight - myTable.clientHeight - scrollHeights[i];

            if (scrollPositions[i] > 0) {
              myTable.scrollTop = scrollPositions[i] + diff;
            }
          }
        });
      },

      getScrollHeight (element) {
        const rect = element.getBoundingClientRect();

        return Math.floor(
          element.scrollHeight + (parseInt(rect.height, 10) - rect.height - 0.01),
        );
      },

      getScrollWidth (element) {
        const rect = element.getBoundingClientRect();

        return Math.floor(
          element.scrollWidth + (parseInt(rect.width, 10) - rect.width - 0.01),
        );
      },

      fixHeader () {
        const baseRow = this.$refs.thead.firstChild;
        const fixedRow = this.$refs.thead_fixed.firstChild;

        Array.from(fixedRow.cells).forEach((cell, index) => {
          cell.style.width =
            baseRow.cells[index].getBoundingClientRect().width + 0.001 + 'px';
        });

        this.$refs.fixedHeader.style.width =
          this.$refs.thead.getBoundingClientRect().width + 1 + 'px';

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

        this.$refs.table.scrollTop = tr ? tr.offsetTop - headerHeight : 0;
      },

      onPageChange (num) {
        this.currentPage = num;

        this.$emit('page-change');

        this.$nextTick(this.redraw);
      },
    },

    watch: {
      data () {
        this.$nextTick(this.assignEvents);
      },

      ready () {
        if (this.sortKey) {
          this.sortBy(this.sortKey, this.sortOrder);
        }
      },

      sortColumn () {
        this.sortKey = this.sortColumn;
        this.sortOrder = this.sortDirection;
      },
    },
  };
</script>