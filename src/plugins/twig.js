import Twig from 'classes/Twig';

export default {
  install (Vue) {
    const twig = new Twig();

    Object.defineProperties(Vue.prototype, {
      $twig: {
        get () {
          return twig;
        },
      },
    });
  },
};