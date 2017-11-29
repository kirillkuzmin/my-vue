<template>
  <select :id="id" :name="name" v-model="selected">
    <option value="-1" style="font-style: italic;">- All -</option>
    <option
      v-for="(month, m) in months"
      :value="(++m).toString().padStart(2, '0')"
      v-text="month"
    >
    </option>
  </select>
</template>

<script>
  export default {
    props: {
      id: String,

      months: {
        type: Array,
        default() {
          return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        },
      },

      name: String,

      value: [String, Number],
    },

    data() {
      return {};
    },

    computed: {
      selected: {
        get() {
          return this.value;
        },

        set(val) {
          this.$emit('input', val);
        },
      },
    },

    methods: {},
  };
</script>

<style lang="less" scoped>
</style>
