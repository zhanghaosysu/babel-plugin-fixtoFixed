const path = require('path');
const pluginTester = require('babel-plugin-tester').default;
const fixToFixedPlugin = require('./index');

pluginTester({
  pluginName: 'fixToFixedPlugin',
  plugin: fixToFixedPlugin,
  tests: {
    'nothing changed': {
      code: 'toFixed(2)',
      snapshot: true,
      pluginOptions: { useAccounting: true },
    },
    'NumberLiteral': {
      code: '123.456.toFixed(2)',
      snapshot: true
    }
  },
});
