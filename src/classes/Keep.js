class Keep {
  constructor () {
  }

  static get (path = '') {
    return JSON.parse(localStorage.getItem(path));
  }

  static set (path, value) {
    localStorage.setItem(path, JSON.stringify(value));
  }

  static remove (path) {
    localStorage.removeItem(path);
  }
}

export default Keep;