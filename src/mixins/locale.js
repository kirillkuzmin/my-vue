import deepFind from 'utils/deep-find';
import i18n from 'locale';

export default {
  methods: {
    t (path = '') {
      return deepFind(i18n[this.$my.lang], path) || '';
    },
  },
};