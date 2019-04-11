import Modal from 'classes/Modal';

export default {
  install (Vue) {
    const modal = new Modal(Vue);

    const myVue = window.myVue = new Vue({
      data: {
        lang: Vue.config.lang || 'en',
        tables: {
          exportService: null,
        },
        validators: {},
      },

      methods: {
        alert (params) {
          return modal.make('alert', params);
        },

        confirm (params) {
          return modal.make('confirm', params);
        },
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