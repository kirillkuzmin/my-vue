class Keep {
  constructor() {
  }

  static get(path = '') {
    try {
      return JSON.parse(localStorage.getItem(path));
    } catch (e) {
      return localStorage.getItem(path);
    }
  }

  static set(path, value) {
    if (_.isObject(value)) {
      value = JSON.stringify(value);
    }

    localStorage.setItem(path, value);
  }
}

// plak 2017
// сохранялка значений вводимых.

let keep = Vue.directive('keep', {


  inserted(el, binding, vNode) {
    // теперь можно так:
    // const keep = vNode.context.$keep;

    var vkeepId = _.find(vNode.data.directives, (e) => {
      return e.name === 'keep';
    }).value;
    vkeepId = vkeepId ? vkeepId : '';


    const data = Keep.get(_.trim([vkeepId, _.trim(location.pathname, '/'), el.id].join('.'), '.'));


    if (data) {
      var whatToSwitch = vNode.componentOptions ? vNode.componentOptions.tag : '';
      switch (whatToSwitch || vNode.tag) {
        case 'input':
        case 'select':
          var modelDirective = _.find(vNode.data.directives, (e) => {
            return e.name === 'model';
          });
          if (modelDirective) {
            // eval('vNode.context.' + modelDirective.expression + '=data;')
            // нет, ну eval - это пипец, конечно, но я хз как по другому сделать обращение такого рода this['vasya.id']
            // тут, в общем, в модель записывается значение. Может можно как-то по другому обратиться, неинвазивно - не знаю.
            var cat = vNode.context;
            var splittedWay = modelDirective.expression.split('.');
            for (var elem in splittedWay.slice(0, -1))
              cat = cat[splittedWay[elem]];
            cat[splittedWay[splittedWay.length - 1]] = data;
            // это решение хорошо тем, что оно без eval'a, прохо тем, что если элемент будет по адресу
            // hell[666].satan, то мы до него не доберёмся :(
          }

          break;
        case 'my-tabs':
          // vNode.componentInstance.selectTab(vNode.componentInstance.tabs[data], data);
          // break;
        case 'my-table':
          vNode.componentInstance.forKeep = data;
          // vNode.componentInstance.sortKey = data.sortKey;
          // vNode.componentInstance.sortOrder = data.sortOrder;
          // let intId = setInterval(() => {
          //   if (vNode.componentInstance.ready) {
          //     clearInterval(intId);
          //     eventBus.fire('my-table:select', {
          //       myTableId: vNode.componentInstance.$options.propsData.id,
          //       rowId: data.selectedRow,
          //       scrollTo: true,
          //     });
          //   }
          // }, 50);
          // vNode.componentInstance.sortBy(data.sortKey, data.sortOrder);
          break;
        default:
          break;
      }
    }

  },

  componentUpdated(el, binding, vNode, oldVnode) {
    var whatToSwitch = vNode.componentOptions ? vNode.componentOptions.tag : '';

    var vkeepId = vNode.data.directives[_.findIndex(vNode.data.directives, (e) => {
      return e.name === 'keep';
    })].value;
    vkeepId = vkeepId ? vkeepId : '';
    var keepname = _.trim([vkeepId, _.trim(location.pathname, '/'), el.id].join('.'), '.');
    switch (whatToSwitch || vNode.tag) {
      case 'input':
      case 'select':
        Keep.set(keepname, el['value']);
        break;
      case 'my-tabs':
      case 'my-table':
        Keep.set(keepname, vNode.componentInstance.forKeep);
        break;
      default:

        break;
    }
  },
});

export default keep;
