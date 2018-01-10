class Validator {
  constructor (el, prop, rules, options) {
    // element
    this.element = el;

    // value or attribute
    this.property = prop;

    if (typeof rules === 'string') {
      // 'rule1 rule2'
      this.rules = rules.split(' ');
    } else {
      // or ['rule1', 'rule2']
      this.rules = rules;
    }

    this.options = options;

    // is required
    this.required = (this.rules.indexOf('required') !== -1);

    // errors
    this.errors = [];

    // error div
    this.container = null;

    // required class
    if (this.required) {
      el.classList.add('required');
    }

    // ?
    this.ignore = false;

    //
    this.assignEvents();

    //
    if (this.property) {
      this.watchProperty();
    }

    //
    this.watchErrors();

    // global validator
    /*if (typeof app.$validator !== 'undefined') {
      app.$validator.add(this);
    }*/
  }

  hasErrors () {
    return this.errors.length > 0;
  }

  showErrors () {
    if (this.hasErrors()) {
      this.container.style.display = 'inline-block';

      const elementWidth = this.element.offsetWidth;

      const errorWidth = this.container.children[0].offsetWidth;

      /*if (this.options.maxWidth && errorWidth > this.options.maxWidth) {
       this.container.children[0].style.maxWidth = this.options.maxWidth + 'px';
       this.container.children[0].style.whiteSpace = 'normal';
       } else {
       this.container.children[0].style.whiteSpace = 'nowrap';
       }*/

      const rightEdge = this.element.offsetLeft + errorWidth;

      // TODO: +6 is bad
      this.container.style.top = this.element.offsetHeight + 6 + 'px';

      this.container.style.left = (window.innerWidth < rightEdge ? -errorWidth : -elementWidth) + 'px';

      this.container.children[0].className = (window.innerWidth < rightEdge ? 'reverse' : 'normal');
    }
  }

  hideErrors () {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  assignEvents () {
    this.element.onfocus = () => {
      this.showErrors();
    };

    this.element.onblur = () => {
      this.hideErrors();
    };
  }

  getProperty () {
    if (typeof this.element === 'object') {
      switch (this.property) {
        case 'value':
          return this.element.value;
        /*case 'checked':
         return this.element.checked;*/
        default:
          return this.element.getAttribute(this.property);
      }
    }
  }

  watchProperty () {
    let oldValue = this.getProperty();

    setInterval(() => {
      if (!this.ignore) {
        let currentValue = this.getProperty();

        if (oldValue !== currentValue) {
          this.check(currentValue);

          oldValue = this.getProperty();
        }
      } else {
        oldValue = this.getProperty();
      }
    }, 200);
  }

  watchErrors () {
    setInterval(() => {
      if (this.errors.length) {
        if (!this.container) {
          let focused = this.element === document.activeElement;

          // to restore cursor position in IE
          let selStart = this.element.selectionStart;
          let selEnd = this.element.selectionEnd;

          this.createContainer();

          setTimeout(() => {
            if (focused) {
              this.element.focus();

              this.element.setSelectionRange(selStart, selEnd);
            }
          }, 1);
        }

        if (!this.element.classList.contains('has-error')) {
          this.element.classList.add('has-error');
        }

        const errorText = this.errors.join('<br>');
        const currentText = this.container.children[0].innerHTML;

        if (errorText !== currentText) {
          this.container.children[0].innerHTML = errorText;
        }

        if (this.element === document.activeElement && getComputedStyle(this.container).display === 'none') {
          this.showErrors();
        }
      } else {
        if (this.container) {
          this.element.classList.remove('has-error');

          this.container.children[0].innerHTML = '';

          this.hideErrors();
        }
      }
    }, 50);
  }

  check (val) {
    this.errors = [];

    val = val || this.getProperty();

    if (this.required && !val) {
      // to app
      this.errors.push(window.js_errors.EmptyField);

      return;
    }

    for (let i in this.rules) {
      let rule = this.rules[i];

      // TODO: to app
      let vr = window.validators[rule];

      if (vr && val) {
        if (typeof vr === 'function') {
          let error = vr(this.element);

          if (error) {
            this.errors.push(error);
          }
        } else {
          if (!vr.pattern.test(val)) {
            this.errors.push(vr.message);
          }
        }
      }
    }
  }

  createContainer () {
    this.checkTabs();

    let wrapper = document.createElement('div');

    wrapper.style.display = 'inline-flex';
    //wrapper.style.flexDirection = 'column';
    //wrapper.style.maxWidth = this.element.parentNode.getBoundingClientRect().width + 'px';
    //wrapper.style.width = this.element.getBoundingClientRect().width + 'px';

    this.element.parentNode.insertBefore(wrapper, this.element.nextSibling);

    wrapper.appendChild(this.element);

    let container = document.createElement('div');

    container.className = 'error';
    container.innerHTML = '<span></span>';

    this.element.parentNode.insertBefore(container, this.element.nextSibling);

    this.container = container;
  }

  setError (error = '') {
    if (error) {
      this.errors.splice(0, this.errors.length, error);
    }
  }

  clearErrors () {
    this.ignore = true;

    this.errors = [];

    setTimeout(() => {
      this.ignore = false;
    }, 210);
  }

  checkTabs () {
    let parent = this.element.parentNode;

    // идем вверх по dom
    while (parent.tagName !== 'HTML') {
      // if element is inside my-tabs-pane
      if (parent.classList.contains('my-tabs__pane')) {
        eventBus.fire('my-tabs:add-validator', {
          tabId: parent.id,
          validator: this,
        });

        break;
      } else if (parent.classList.contains('my-collapse__content')) {
        // if element is inside my-collapse-block
        eventBus.fire('my-collapse:add-validator', {
          blockId: parent.id,
          validator: this,
        });

        break;
      }

      parent = parent.parentNode;
    }
  }

  clearRules () {
    this.rules = [];
  }

  addRules (rules) {
    if (this.rules.indexOf(rules) === -1) {
      if (typeof rules === 'object') {
        this.rules = rules;
      } else {
        this.rules.push(rules);
      }
    }
  }
}

export default Validator;