const babel = require('@babel/core');

const code = `
123.456.toFixed(2)
Number(n).toFixed()
toFixed(2)
`;
const output = babel.transformSync(code, {
  plugins: [
    ['./index.js', {
      useAccounting: true
    }]
  ]
})

console.log('============ generated code start ============')
console.log(output.code);
console.log('============ generated code end ============')