
const t = require('@babel/types');
module.exports = function aBabelPlugin() {

  return {
    visitor: {
      Program(path) {
        const accountingRefName = 'accounting';
        // 没有引入 accounting
        console.log(path.scope.hasBinding(accountingRefName), Object.keys(path.scope.bindings));
        if (!path.scope.hasBinding(accountingRefName)){
          const requireDefine = {
            id: t.identifier(accountingRefName),
            init: t.callExpression(t.identifier('require'), [t.stringLiteral('accounting')]),
          };
          path.scope.push(requireDefine);
        }
        // 已引入 accounting
        console.log(path.scope.hasBinding(accountingRefName), Object.keys(path.scope.bindings));
      },
      CallExpression(path) {
        const callee = path.get('callee');
        const property = callee.get('property');
        const isToFixedCall = callee.isMemberExpression()
        && property.isIdentifier({ name: 'toFixed' });
        if (isToFixedCall) {
          const number = callee.get('object');
          const args = path.get('arguments');
          // number.toFixed() 没有第二个参数，跳过这种情况
          if (args.length > 1) {
              return;
          }
          const accountingFixedArgs = args.length === 0 ? '' : ',' + args[0];
          path.replaceWithSourceString(`accounting.toFixed(${number} ${accountingFixedArgs})`);
  
        }
        path.skip(); // 不对子节点继续访问
      } 
    }
  }
}