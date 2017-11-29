import Vue from 'vue';

class EventBus {
  constructor () {
    this.vue = new Vue();
  }

  fire (event, data = null) {
    this.vue.$emit(event, data);
  }

  listen (event, callback) {
    this.vue.$on(event, callback);
  }

  destroy () {
    this.vue.$off();
  }
}

const bus = new EventBus();

export default {
  install (Vue) {
    Object.defineProperties(Vue.prototype, {
      $bus: {
        get () {
          return bus;
        },
      },
    });
  },
};
