export default function (object, path) {
  let p = path.split('.');
  let c = object;

  for (let i = 0; i < p.length; ++i) {
    if (c[p[i]] === undefined) {
      c = `${path} not found`;

      break;
    }

    c = c[p[i]];
  }

  return c;
}