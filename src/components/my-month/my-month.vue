<template>
  <select :id="id" :name="name" v-model="selected">
    <option
      style="font-style: italic;"
      v-if="all"
      v-text="$trans('myMonth.all')"
      value="-1"
    >
    </option>
    <option
      v-for="(month, m) in $trans('months')"
      :value="getMonthNumber(m)"
      v-text="month"
    >
    </option>
  </select>
</template>

<script>
  export default {
    name: 'my-month',

    props: {
      all: {
        default: false,
        type: Boolean,
      },

      id: {
        type: String,
      },

      leadingZero: {
        type: Boolean,
        default: true,
      },

      name: {
        type: String,
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
    },

    methods: {
      getMonthNumber (m) {
        m = (++m).toString();

        return this.leadingZero ? m.padStart(2, '0') : m;
      },
    },
  };
</script>