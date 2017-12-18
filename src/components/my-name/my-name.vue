<template>
  <div :class="className">
    <input
      :style="inputStyle"
      :value="name.lastname"
      placeholder="Lastname"
      ref="lastname"
      type="text"
      @input="update"
    >
    <input
      :style="inputStyle"
      :value="name.firstname"
      placeholder="Firstname"
      ref="firstname"
      type="text"
      @input="update"
    >
    <input
      :style="inputStyle"
      :value="name.middlename"
      placeholder="Middlename"
      ref="middlename"
      type="text"
      @input="update"
    >
  </div>
</template>

<script>
  export default {
    props: {
      direction: {
        type: String,
        default: 'h',
      },

      /*firstnameValidator: {
        type: String,
        default: '',
      },*/

      inputWidth: {
        type: String,
        default: '',
      },

      /*lastnameValidator: {
        type: String,
        default: '',
      },*/

      /*middlenameValidator: {
        type: String,
        default: '',
      },*/

      value: {
        type: String,
      },

      width: {
        type: [Number, String],
        default: 450,
      },
    },

    data () {
      return {};
    },

    computed: {
      className () {
        return [
          'my-name',
          {
            'my-name--horizontal': this.direction === 'h',
            'my-name--vertical': this.direction === 'v',
          },
        ];
      },

      inputStyle () {
        return {
          // with margin-right
          'width': this.inputWidth ? this.inputWidth : this.width / 3 - 8 / 3 + 'px',
        };
      },

      name () {
        const n = this.value.split(' ');

        return {
          firstname: n[1] || '',
          lastname: n[0] || '',
          middlename: n[2] || '',
        };
      },
    },

    methods: {
      update () {
        const fullname = [
          this.$refs.lastname.value,
          this.$refs.firstname.value,
          this.$refs.middlename.value,
        ]
          .join(' ');

        this.$emit('input', fullname);
      },
    },
  };
</script>

<style lang="less" scoped>
  .my-name {
    display: flex;

    &--horizontal {
      flex-direction: row;

      & input {
        box-sizing: border-box;
        margin-right: 4px;
      }
    }

    &--vertical {
      flex-direction: column;

      & input {
        margin-bottom: 4px;
      }
    }
  }
</style>