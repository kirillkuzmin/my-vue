<template>
  <select :id="id" :name="name" v-model="selected">
    <option value="-1" style="font-style: italic;" v-text="$trans('myMonth.all')"></option>
    <option
      v-for="(month, m) in $trans('months')"
      :value="(++m).toString().padStart(2, '0')"
      v-text="month"
    >
    </option>
  </select>
</template>

<script>
  export default {
    name: 'my-month',

    props: {
      id: String,

      name: String,

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
    },
  };
</script>