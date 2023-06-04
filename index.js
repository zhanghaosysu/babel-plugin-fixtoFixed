const t = require('@babel/types');

module.exports = function aBabelPlugin({ template }) {

  return {
    visitor: {
      Program(path, state) {
        const { useAccounting } = state.opts;
        console.log('use accounting lib', useAccounting)

        const fnBuilder = template(`
          var FNNAME = function FNNAME(target, _n) {
            var n = _n || 0;
            return Number(Math.round(target + 'e' + n) + 'e-' + n).toFixed(n);
          }
        `);
        const builtFn = fnBuilder({ FNNAME: t.identifier('fixedToFixed') });
        path.scope.push(builtFn.declarations[0]);
      },
      CallExpression(path) {
        const callee = path.get('callee');

        const property = callee.get('property');
        const isToFixedCall = callee.isMemberExpression()
        && property.isIdentifier({ name: 'toFixed' });
        if (!isToFixedCall) return;

        const blockId = path.scope.block.id;
        if (blockId && blockId.name === 'fixedToFixed') return; // 跳过自己的修复函数
        
        const number = callee.get('object');
        const args = path.get('arguments');
        if (args.length > 1) return; // Number.toFixed没有第二个参数，跳过这种情况
        
        const accountingArgs = [number.node];
        if (args[0]) accountingArgs.push(args[0].node);

        const callExp = t.callExpression(t.identifier('fixedToFixed'), accountingArgs);
        path.replaceWith(callExp);

        path.skip(); // 不对子节点继续访问
      } 
    }
  }
}