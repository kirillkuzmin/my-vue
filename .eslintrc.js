module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  extends: 'fbjs',
  // required to lint *.vue files
  plugins: [
    'html',
  ],
  // add your custom rules here
  'rules': {
    'no-new': 0,
    'space-before-function-paren': 0,
    'no-undef': 0,
  },
};