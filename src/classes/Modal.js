class Modal {
  #Vue;

  constructor (Vue) {
    this.#Vue = Vue;
  }

  make (type, params = {}) {
    return new Promise((resolve, reject) => {
      const v = new this.#Vue({
        methods: {
          close (fn, arg) {
            return function () {
              fn(arg);

              v.$destroy();
              v.$el.remove();
            };
          },
        },
        render (h) {
          return h('my-modal', {
            props: {
              show: true,
              type,
              ...params,
            },
            on: {
              no: this.close(() => {}),
              ok: this.close(resolve),
              yes: this.close(resolve),
            },
          });
        },
      }).$mount();

      document.body.appendChild(v.$el);
    });
  }
}

export default Modal;