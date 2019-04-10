<template>
  <div class="my-table__export">
    <icon-import-export
      :title="$trans('myTableExport.iconTitle')"
      @click="open"
    />
    <my-modal
      :show="show"
      max-height="500"
    >
      <span slot="header" v-text="$trans('myTableExport.header')"></span>
      <div slot="body">
        <h6 style="margin: 0 0 5px;" v-text="$trans('myTableExport.subheader')"></h6>
        <div style="display: flex; flex-direction: column;">
          <my-checkbox
            :label="column.title"
            :value="index"
            style="margin-bottom: 3px;"
            v-for="(column, index) in $parent.columns"
            v-model="selectedColumns"
          />
        </div>
      </div>
      <div slot="footer">
        {{ $trans('myTableExport.format') }}:
        <select v-model="selectedFormat">
          <option
            :value="format.label"
            v-for="format in formats"
            v-text="format.extension"
          >
          </option>
        </select>
        <button
          :disabled="!anyColumnSelected"
          @click="exportMe"
          type="button"
          v-text="$trans('myTableExport.btnExport')"
        >
        </button>
        <button
          @click="close"
          type="button"
          v-text="$trans('myTableExport.btnCancel')"
        >
        </button>
      </div>
    </my-modal>
  </div>
</template>

<script>
  import MyCheckbox from 'components/my-checkbox';
  import MyModal from 'components/my-modal';
  import IconImportExport from 'icons/icon-import-export.vue';

  const formats = [
    {
      label: 'xlsx',
      extension: '.xlsx',
    },
    {
      label: 'xls',
      extension: '.xls',
    },
    {
      label: 'csv',
      extension: '.csv',
    },
  ];

  export default {
    name: 'my-table-export',

    data () {
      return {
        formats,

        selectedColumns: [],

        selectedFormat: 'xlsx',

        show: false,
      };
    },

    components: {
      IconImportExport,
      MyCheckbox,
      MyModal,
    },

    computed: {
      anyColumnSelected () {
        return !!this.selectedColumns.length;
      },
    },

    methods: {
      open () {
        this.selectedColumns = [];

        for (let index in this.$parent.columns) {
          this.selectedColumns.push(index);
        }

        this.show = true;
      },

      close () {
        this.show = false;
      },

      exportMe () {
        this.$emit('export', {
          columns: this.selectedColumns,
          format: this.selectedFormat,
        });

        this.show = false;
      },
    },
  };
</script>
