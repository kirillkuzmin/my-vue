<template>
  <div class="my-select" :style="{ 'width': width }">
    <div class="my-select__container">
      <input
        :class="inputClassName"
        :disabled="disabled"
        :id="id"
        :name="name"
        :readonly="readonly || selectOnly"
        :style="{ 'width': width }"
        :title="title"
        autocomplete="off"
        ref="input"
        type="text"
        v-model="searchText"
        @blur="saveOwn"
        @click="inputClick"
        @focus="focus"
        @input="find"
      >
      <div class="my-select__actions">
        <my-loading
          :size="16"
          style="margin-right: 4px;"
          v-if="isLoading"
        />
        <icon-arrow-down
          :size="24"
          @click="showAll"
          v-else
        />
        <icon-clear
          :size="16"
          v-if="clearButton"
          @click="clear"
        />
      </div>
    </div>
    <div ref="list" class="my-select__list" v-show="showList" v-click-outside="hide">
      <ul v-if="multiple">
        <template v-for="(item, index) in filteredOptions">
          <li
            :class="$_getItemClass(item, index)"
            @click="selectAfter(item, index)"
            v-if="item.subheader"
          >
            <span class="my-select__item-label" v-text="item.subheader"></span>
          </li>
          <li
            :class="$_getItemClass(item, index)"
            @click="selectMultiple(item)"
            v-else
          >
            <span :title="item.title" class="my-select__item-label" v-text="item[labelKey]"></span>
            <span class="my-select__item-hint" v-text="item.hint"></span>
          </li>
        </template>
      </ul>
      <ul v-else>
        <template v-for="(item, index) in filteredOptions">
          <!--<li class="my-select__subheader" v-if="item.subheader">
            <span class="my-select__item-label" v-text="item.subheader"></span>
          </li>-->
          <li :class="item.class" @click="select(item)"><!--v-else-->
            <span class="my-select__item-label" v-text="item[labelKey]"></span>
          </li>
        </template>
        <li class="my-select__item--own" v-if="ownValue" @click="select('own')">
          <span class="my-select__item-label" v-text="ownValueLabel"></span>
        </li>
      </ul>
    </div>
    <input
      :id="hidden"
      :name="hidden"
      :value="selected"
      type="hidden"
      v-if="!ownValue"
    >
  </div>
</template>

<script>
  import debounce from 'lodash/debounce';
  import IconArrowDown from 'icons/icon-arrow-down.vue';
  import IconClear from 'icons/icon-clear.vue';
  import Validator from 'classes/Validator';

  export default {
    name: 'my-select',

    props: {
      ajax: {
        type: Boolean,
        default: true,
      },

      clearButton: {
        type: Boolean,
        default: false,
      },

      disabled: Boolean,

      hidden: {
        type: String,
        default: 'my-select',
      },

      id: String,

      initLabel: {
        type: String,
        default: '',
      },

      initValue: {
        type: String,
        default: '',
      },

      inputClass: String,

      labelKey: String,

      minLength: {
        type: Number,
        default: 3,
      },

      multiple: {
        type: Boolean,
        default: false,
      },

      name: String,

      options: {
        type: Array,
        default () {
          return [];
        },
      },

      ownValue: {
        type: Boolean,
        default: false,
      },

      ownValueLabel: {
        type: String,
        default: 'Свое значение',
      },

      readonly: {
        type: Boolean,
        default: false,
      },

      validate: {
        type: String,
        default: '',
      },

      validateOnBlur: {
        type: Boolean,
        default: false,
      },

      valueKey: String,

      width: String,
    },

    data () {
      return {
        expandClicked: false,
        isLoading: false,
        searchText: this.initLabel,
        selected: this.initValue,
        selectOnly: false,
        showList: false,
        validator: null,
      };
    },

    components: {
      'icon-clear': IconClear,
      'icon-arrow-down': IconArrowDown,
    },

    created () {
      this.$bus.listen('my-select:ready', () => {
        if (this.ownValue) {
          // ?????
          let f = this.options.filter(item => {
            return item[this.labelKey] === this.initLabel;
          });

          this.selectOnly = f.length > 0 || !this.initLabel;
        }
      });

      this.$bus.listen('my-select:reset', mySelectId => {
        //if (this.id === mySelectId) {
        this.searchText = this.initLabel;
        this.selected = this.initValue;
        //}
      });

      this.$bus.listen('my-select:fill', data => {
        if (data.id === this.id) {
          this.searchText = data.label;
          this.selected = data.value;

        }
      });
    },

    mounted () {
      if (this.validate) {
        const input = this.$refs.input;

        this.validator = new Validator(input, 'value', this.validate);

        this.$on('validation-error', error => {
          this.validator.setError(error);
        });
      }
    },

    computed: {
      filteredOptions () {
        if (this.options) {
          if (this.ajax) {
            return this.options;
          } else {
            let options = this.options.slice();

            if (this.searchText) {
              options = options.filter(item => {
                let val = item[this.labelKey];

                return String(val)
                  .toLowerCase()
                  .indexOf((this.expandClicked ? '' : this.searchText).toLowerCase()) > -1;
              });
            }

            return options;
          }
        } else {
          return [];
        }
      },

      inputClassName () {
        return [
          'my-select__input',
          {
            'my-select__input--clear': this.clearButton,
          },
          this.inputClass,
        ];
      },

      title () {
        return this.searchText.replace(/; /g, '\n');
      },
    },

    methods: {
      $_getItemClass (item, index) {
        return [
          (item.subheader ? 'my-select__subheader' : 'my-select__item'),
          {
            'my-select__item--selected': this.itemSelected(item, index),
          },
        ];
      },

      find: debounce(function (t) {
        if (!this.multiple) {
          this.selected = '';
        }

        const text = (typeof t === 'string' ? t : this.searchText);

        if (text.length >= this.minLength) {
          if (this.ajax) {
            this.$emit('search', text, this.changeState);
          } else {
            this.expandClicked = (text === 'all');

            this.show();
          }
        } else {
          this.hide();
        }
      }, (this.ajax ? 300 : 5)),

      select (item) {
        if (item === 'own') {
          this.selected = '';
          this.searchText = '';
          this.selectOnly = false;

          this.$refs.input.focus();
        } else {
          this.selected = item[this.valueKey];

          this.searchText = item[this.labelKey];

          if (this.ownValue) {
            this.selectOnly = true;
          }
        }

        this.hide();

        if (this.validate) {
          this.validator.clearErrors();
        }

        this.$emit('input', this.selected);

        this.$emit('select', this.selected);
      },

      selectMultiple (item, state) {
        //
        if (!this.selected || typeof this.selected !== 'object') {
          this.selected = [];
        }

        const val = item[this.valueKey];

        const valIndex = this.selected.indexOf(val);

        // easier?
        if (state !== undefined) {
          if (state && valIndex === -1) {
            this.selected.push(val);
          }

          if (!state && valIndex > -1) {
            this.selected.splice(valIndex, 1);
          }
        } else {
          if (valIndex > -1) {
            this.selected.splice(valIndex, 1);
          } else {
            this.selected.push(val);
          }
        }

        let values = [];

        this.filteredOptions.every(item => {
          if (this.selected.indexOf(item[this.valueKey]) > -1) {
            values.push(item[this.labelKey]);
          }
        });

        this.searchText = values.join('; ');

        this.$emit('input', this.selected);

        this.$emit('select', this.selected);
      },

      selectAfter (afterItem, index) {
        afterItem.selected = (afterItem.selected !== undefined ? !afterItem.selected : true);

        this.filteredOptions.some((item, i) => {
          if (i > index) {
            if (item.subheader) {
              return true;
            }

            this.selectMultiple(item, afterItem.selected);
          }
        });
      },

      saveOwn () {
        if (this.ownValue) {
          this.selected = this.searchText;

          this.$emit('input', this.selected);
        } else {
          // plak
          if (this.validate && this.validateOnBlur && !this.selected) {
            this.validator.setError('Выберите значение из выпадающего списка');
          }
        }
      },

      showAll () {
        // to prevent double click
        if (!this.showList && !this.disabled) {
          this.find('all');
        }
      },

      show () {
        this.showList = true;

        this.$nextTick(() => {
          this.$refs.list.scrollTop = 0;
        });
      },

      hide () {
        this.showList = false;
      },

      changeState (loading = false) {
        // handles begin and end of ajax request
        this.$nextTick(() => {
          this.isLoading = loading;

          if (!this.isLoading && this.options.length > 0) {
            // check
            /*if (this.options.length === 1) {
              this.select(this.options[0]);
            }*/

            this.showList = true;
          } else if (this.options.length === 0) {
            this.showList = false;
          }
        });
      },

      clear () {
        this.selected = '';
        this.searchText = '';

        this.$emit('clear');
      },

      focus () {
        if (!this.selected && !this.selectOnly) {
          if (this.validate) {
            this.validator.clearErrors();
          }

          this.find();
        }
      },

      itemSelected (item, index) {
        if (item.subheader) {
          let all = true;

          this.filteredOptions.some((fItem, i) => {
            if (i > index) {
              if (fItem.subheader) {
                return true;
              }

              if (this.selected.indexOf(fItem[this.valueKey]) === -1) {
                all = false;
              }
            }
          });

          item.selected = all;

          return all;
        } else {
          return this.selected.indexOf(item[this.valueKey]) > -1;
        }
      },

      inputClick () {
        if (this.readonly || this.selectOnly) {
          this.showAll();
        }
      },
    },
  };
</script>