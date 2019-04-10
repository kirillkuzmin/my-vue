export default {
  install (Vue) {
    const myVue = window.myVue = new Vue({
      data: {
        tables: {
          exportService: null,
        },
        lang: Vue.config.lang || 'en',
        validators: {},
      },
    });

    Object.defineProperties(Vue.prototype, {
      $my: {
        get () {
          return myVue;
        },
      },
    });
  },
};