import deepFind from 'utils/deep-find';
import i18n from 'locale';

export default {
  methods: {
    t (path = '') {
      let trans = deepFind(i18n[this.$my.lang], path);

      return typeof trans === 'object' ? `${path}: not found` : trans;
    },
  },
};