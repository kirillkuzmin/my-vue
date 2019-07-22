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
              v.$el.parentNode.removeChild(v.$el);
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
              no: this.close(reject),
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