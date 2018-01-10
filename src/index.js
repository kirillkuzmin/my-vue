import globalMixin from 'mixins/global';
import EventBus from 'plugins/event-bus';
import directives from './directives';
import components from './components';
import icons from './icons';

function install (Vue) {
  Vue.mixin(globalMixin);

  Vue.use(EventBus);

  for (const name in directives) {
    Vue.directive(name, directives[name]);
  }

  for (const name in components) {
    Vue.component(name, components[name]);
  }

  for (const name in icons) {
    Vue.component(name, icons[name]);
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  ...components,
  ...icons,
};