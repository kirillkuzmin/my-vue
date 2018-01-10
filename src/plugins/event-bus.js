import EventBus from 'classes/EventBus';

export default {
  install (Vue) {
    const bus = window.eventBus = new EventBus(Vue);

    Object.defineProperties(Vue.prototype, {
      $bus: {
        get () {
          return bus;
        },
      },
    });
  },
};