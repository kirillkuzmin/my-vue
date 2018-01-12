<template>
  <div class="my-excel">
    <icon-import-export
      title="Экспорт"
      @click="show"
    />
    <my-modal :show="modalShow" :close="!blockButton" max-height="500" @close="modalShow = false">
      <span slot="header">Экспорт таблицы</span>
      <div slot="body">
        <h6 style="margin: 0 0 5px;">Выберите колонки для экспорта</h6>
        <template v-for="(col, ind) in columns">
          <my-checkbox
            :label="col.title.replace(/<\/?[^>]+>/gi, ' ')"
            :value="ind"
            v-model="selectedCols"
          />
          <br>
        </template>
      </div>
      <div slot="footer">
        Формат:
        <select v-model="format">
          <option
            v-for="form in fformats"
            :value="form.type"
            v-text="form.ext"
          >
          </option>
        </select>
        <button
          :disabled="!anyColumnSelected"
          type="button"
          v-if="!blockButton"
          v-text="'Экспорт'"
          @click="loadExcel"
        >
        </button>
        <my-loading v-else/>
      </div>
    </my-modal>
  </div>
</template>

<script>
  import IconImportExport from 'icons/icon-import-export.vue';
  import MyCheckbox from 'components/my-checkbox';
  import MyLoading from 'components/my-loading';
  import MyModal from 'components/my-modal';

  export default {
    props: {
      ajaxPath: {
        type: String,
        default: '/ajax/excel/mytable2excel',
      },

      columns: {
        type: Object,
        required: true,
      },

      data: {
        type: Array,
        required: true,
      },

      filename: {
        type: String,
        default: 'table',
      },

      header: {
        type: String,
        default: '',
      },

      sheet: {
        type: String,
        default: 'Sheet',
      },
    },

    data () {
      return {
        allCb: true,
        blockButton: false,
        fformats: [
          {
            type: 'Excel2007',
            ext: '.xlsx',
          },
          {
            type: 'Excel5',
            ext: '.xls',
          },
          {
            type: 'CSV',
            ext: '.csv',
          },
        ],
        format: 'Excel2007',
        modalShow: false,
        selectedCols: [],
      };
    },

    components: {
      'icon-import-export': IconImportExport,
      'my-modal': MyModal,
      'my-loading': MyLoading,
      'my-checkbox': MyCheckbox,
    },

    computed: {
      anyColumnSelected () {
        return this.selectedCols.length > 0;
      },
    },

    methods: {
      /*allSel() {
       for (let ind in this.columns) {
       this.selectedCols[ind] = this.allCb;
       }
       },*/

      show () {
        this.selectedCols = [];

        for (let ind in this.columns) {
          this.selectedCols.push(ind);
        }

        this.modalShow = true;
      },

      loadExcel () {
        let truncColumns = JSON.parse(JSON.stringify(this.columns));
        let truncData = JSON.parse(JSON.stringify(this.data));
        let invalidColumns = [];

        for (let el in this.columns) {
          if (!this.selectedCols.includes(el)) {
            invalidColumns.push(el);
            delete truncColumns[el];
          }
        }

        for (let el in invalidColumns) {
          for (let ind in this.data) {
            delete truncData[ind][invalidColumns[el]];
          }
        }

        let tc = [];

        for (let el in truncColumns) {
          tc.push(el);
        }

        let dt = [];
        let comprRow = [];
        let element = 0;

        for (let row in truncData) {
          comprRow = [];

          for (let el in tc) {
            if (truncData[row][tc[el]]) {
              element = JSON.parse(JSON.stringify(truncData[row][tc[el]]));
              if (typeof element === 'object') {
                if ('value' in element) {
                  element['v'] = element.value;
                  delete element.value;
                }

                if ('class' in element) {
                  element['c'] = element.class;
                  delete element.class;
                }
              }
            } else {
              element = null;
            }

            comprRow.push(element);

            delete truncData[row][tc[el]];
          }

          dt.push(comprRow);

          truncData[row]['__cmpr'] = comprRow;
        }

        this.blockButton = true;

        axios.post(this.ajaxPath, {
          cmpCol: tc,
          columns: truncColumns,
          data: truncData,
          format: this.format,
          headerName: this.header,
          sheetName: this.sheet,
        }).then(response => {
            this.blockButton = false;

            let downloadLink = document.createElement('a');

            downloadLink.href = response.data.file;

            // ie11 не умеет
            downloadLink.download = this.filename + '.' + response.data.ext;
            document.body.appendChild(downloadLink);

            downloadLink.click();

            document.body.removeChild(downloadLink);

            this.modalShow = false;
          },
          error => {
            this.blockButton = false;
            this.modalShow = false;

            alert('Произошла ошибка на сервере.');
          });
      },
    },
  };
</script>

<style lang="less" scoped>
  .my-excel {
    align-items: center;
    display: flex;
  }
</style>
