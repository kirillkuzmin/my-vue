class Twig {
  constructor () {
  }

  set (field, value) {
    this[field] = value;
  }

  get (field) {
    return this[field];
  }
}

export default Twig;