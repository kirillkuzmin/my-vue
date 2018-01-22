<template>
  <select :id="id" :name="name" v-model="selected">
    <option
      style="font-style: italic;"
      v-if="all"
      v-text="$trans('myYear.all')"
      value="-1"
    >
    </option>
    <option
      v-for="(year, y) in yearRange"
      :value="year"
      v-text="year"
    >
    </option>
  </select>
</template>

<script>
  export default {
    name: 'my-year',

    props: {
      all: {
        type: Boolean,
        default: false,
      },

      endYear: {
        type: Number,
        default: new Date().getFullYear() + 2,
      },

      id: String,

      name: String,

      startYear: {
        type: Number,
        default: 2006,
      },

      value: [String, Number],
    },

    computed: {
      selected: {
        get () {
          return this.value;
        },

        set (val) {
          this.$emit('input', val);
        },
      },

      yearRange () {
        let range = [];

        for (let y = this.startYear; y <= this.endYear; y++) {
          range.push(y);
        }

        return range;
      },
    },
  };
</script>