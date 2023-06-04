
const t = require('@babel/types');

module.exports = function aBabelPlugin() {

    return {
      visitor: {
        CallExpression(path) {
          const callee = path.get('callee');
          const property = callee.get('property');
          const isToFixedCall = callee.isMemberExpression()
          && property.isIdentifier({ name: 'toFixed' });
          if (isToFixedCall) {
            const number = callee.get('object');
            const accountingArgs = [number.node];
            const args = path.get('arguments');
            // number.toFixed() 没有第二个参数，跳过这种情况
            if (args.length > 1) {
                return;
            }
            if (args[0]) {
                accountingArgs.push(args[0].node);
            }
            // 创建 memberExpression 节点
            const accountingToFixed = t.memberExpression(t.identifier('accounting'), t.identifier('toFixed'));
            // 创建 callExpression 节点
            const callExp = t.callExpression(accountingToFixed, accountingArgs);
            path.replaceWith(callExp);
    
          }
          path.skip(); // 不对子节点继续访问
        } 
      }
    }
  }