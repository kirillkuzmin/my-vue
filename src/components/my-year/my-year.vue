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
      v-for="year in yearRange"
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
        default: false,
        type: Boolean,
      },

      endYear: {
        default: new Date().getFullYear() + 2,
        type: Number,
      },

      id: {
        type: String,
      },

      name: {
        type: String,
      },

      startYear: {
        default: 2006,
        type: Number,
      },

      value: {
        type: [String, Number],
      },
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
        let range = new Set();

        for (let y = this.startYear; y <= this.endYear; y++) {
          range.add(y);
        }

        return Array.from(range);
      },
    },
  };
</script>