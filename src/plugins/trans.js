import deepFind from 'utils/deep-find';
import i18n from 'locale';

export default {
  install (Vue) {
    const t = function (path = '') {
      return deepFind(i18n[this.$my.lang], path);
    };

    Object.defineProperties(Vue.prototype, {
      $trans: {
        get () {
          return t;
        },
      },
    });
  },
};