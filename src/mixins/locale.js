import i18n from 'locale';

export default {
  methods: {
    t (key = '') {
      return i18n[this.$my.lang][key] || '';
    },
  },
};