class Keep {
  constructor () {
  }

  static get (path = '') {
    try {
      return JSON.parse(localStorage.getItem(path));
    } catch (e) {
      return localStorage.getItem(path);
    }
  }

  static set (path, value) {
    if (_.isObject(value)) {
      value = JSON.stringify(value);
    }

    localStorage.setItem(path, value);
  }

  static remove (path) {
    localStorage.removeItem(path);
  }
}

export default Keep;