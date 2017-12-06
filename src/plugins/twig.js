class Twig {
  constructor () {
  }

  set (field, value) {
    this[field] = value;
  }

  get (field) {
    return this[field];
  }
}

const twig = new Twig();

export default {
  install (Vue) {
    Object.defineProperties(Vue.prototype, {
      $twig: {
        get () {
          return twig;
        },
      },
    });
  },
};