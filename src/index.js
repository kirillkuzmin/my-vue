import './less/index.less';
import components from './components';
import directives from './directives';
import globalMixin from 'mixins/global';
import localeMixin from 'mixins/locale';
import icons from './icons';
import plugins from './plugins';

function install (Vue) {
  Vue.mixin(globalMixin);
  Vue.mixin(localeMixin);

  for (const name in plugins) {
    Vue.use(plugins[name]);
  }

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