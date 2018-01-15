<template>
  <div :class="className">
    <input
      :style="inputStyle"
      :value="name.lastname"
      placeholder="Фамилия"
      ref="lastname"
      type="text"
      v-validate="lastnameValidator"
      @input="update"
    >
    <input
      :style="inputStyle"
      :value="name.firstname"
      placeholder="Имя"
      ref="firstname"
      type="text"
      v-validate="firstnameValidator"
      @input="update"
    >
    <input
      :style="inputStyle"
      :value="name.middlename"
      placeholder="Отчество"
      ref="middlename"
      type="text"
      v-validate="middlenameValidator"
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

      firstnameValidator: {
        type: String,
        default: '',
      },

      inputWidth: {
        type: String,
        default: '',
      },

      lastnameValidator: {
        type: String,
        default: '',
      },

      middlenameValidator: {
        type: String,
        default: '',
      },

      value: {
        type: String,
        default: '',
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
          // с учетом margin-right
          'width': this.inputWidth ? this.inputWidth : this.width / 3 - 8 / 3 + 'px',
        };
      },

      name () {
        const n = (this.value ? this.value : '').split(' ');

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