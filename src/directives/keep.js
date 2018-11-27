import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import Keep from 'classes/Keep';
import trim from 'lodash/trim';

export default {
  inserted (el, binding, vNode) {
    let vkeepId = find(vNode.data.directives, e => {
      return e.name === 'keep';
    }).value;

    vkeepId = vkeepId || '';

    const data = Keep.get(trim([vkeepId, trim(location.pathname, '/'), el.id].join('.'), '.'));

    if (data) {
      let whatToSwitch = vNode.componentOptions ? vNode.componentOptions.tag : '';

      switch (whatToSwitch || vNode.tag) {
        case 'input':
        case 'select':
          const modelDirective = find(vNode.data.directives, e => {
            return e.name === 'model';
          });

          if (modelDirective) {
            let cat = vNode.context;
            let splittedWay = modelDirective.expression.split('.');

            for (let elem in splittedWay.slice(0, -1)) {
              cat = cat[splittedWay[elem]];
            }

            cat[splittedWay[splittedWay.length - 1]] = data;
          }

          break;
        default:
          if (vNode.componentInstance && vNode.componentInstance.$_forKeep) {
            vNode.componentInstance.$_forKeep = data;
          }
          break;
      }
    }
  },

  componentUpdated (el, binding, vNode, oldVnode) {
    let whatToSwitch = vNode.componentOptions ? vNode.componentOptions.tag : '';

    let vkeepId = vNode.data.directives[findIndex(vNode.data.directives, e => {
      return e.name === 'keep';
    })].value;

    vkeepId = vkeepId || '';

    let keepname = trim([vkeepId, trim(location.pathname, '/'), el.id].join('.'), '.');

    switch (whatToSwitch || vNode.tag) {
      case 'input':
      case 'select':
        Keep.set(keepname, el['value']);
        break;
      default:
        if (vNode.componentInstance && vNode.componentInstance.$_forKeep) {
          Keep.set(keepname, vNode.componentInstance.$_forKeep);
        }
        break;
    }
  },
};
