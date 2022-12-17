# @charrue/ast-toolkit

一款辅助AST操作的工具库。

## 下载

```
npm add @charrue/ast-toolkit -D
```

## 方法

### getNodeIdentifierName

用于获取当前节点的字面名称。
如果是变量声明，则获取变量名:
``` js
import t from "@babel/types";
import { getNodeIdentifierName } from "@charrue/ast-helper";
    const name = "foo";

getNodeIdentifierName(t.identifier(name)) // "foo"
```

如果是函数声明，则获取函数名:
``` js
import t from "@babel/types";
import { getNodeIdentifierName } from "@charrue/ast-helper";

const name = "fn";
const fn = t.functionDeclaration(
  t.identifier(name),
  [t.identifier("arg")],
  t.blockStatement([]),
);

getNodeIdentifierName(fn) // "fn"
```

如果是函数调用，则返回完整的调用路径:
``` js
import t from "@babel/types";
import { getNodeIdentifierName } from "@charrue/ast-helper";

const oName = "console";
const pName = "log";
const callee = t.callExpression(
  t.memberExpression(t.identifier(oName), t.identifier(pName), false),
  [],
);

getNodeIdentifierName(callee)).toBe(`${oName}.${pName}` // "console.log"
```

如果不是通过`.`调用:
``` js
import t from "@babel/types";
import { getNodeIdentifierName } from "@charrue/ast-helper";

const oName = "console";
const pName = "'log'";
const callee = t.callExpression(
  t.memberExpression(t.identifier(oName), t.stringLiteral(pName), true),
  [],
);

getNodeIdentifierName(callee)).toBe(`${oName}.${pName}` // "console['log']"
```

如果是构造函数的实例化，则会返回构造函数名:
``` js
import t from "@babel/types";
import { getNodeIdentifierName } from "@charrue/ast-helper";

const name = "People";
const ctor = t.newExpression(t.identifier(name), []);

getNodeIdentifierName(ctor) // "People"
```

### getLiteralNodeValue

用于获取字面量值，并且无法识别值中包含变量，而变量所在位置将会返回undefined。

``` js
import t from "@babel/types";
import { getLiteralNodeValue } from "@charrue/ast-helper";

const key1 = "str";
const value1 = "foo";
const key2 = "num";
const value2 = 10;
const key3 = "bool";
const value3 = false;

const result = getLiteralNodeValue(
  t.objectExpression([
    t.objectProperty(t.identifier(key1), t.stringLiteral(value1)),
    t.objectProperty(t.identifier(key2), t.numericLiteral(value2)),
    t.objectProperty(t.identifier(key3), t.booleanLiteral(value3)),
  ]),
);
// { str: "foo", num: 10, bool: false }
```

如果值中包含变量:
``` js
import t from "@babel/types";
import { getLiteralNodeValue } from "@charrue/ast-helper";

const key = "str";
const value = t.identifier("CONST");

const result = getLiteralNodeValue(
  t.objectExpression([t.objectProperty(t.identifier(key), value)]),
);
// { str: undefined }
```


### getCallExpressionArguments

获取函数的入参，返回一个参数组成的数组。同样无法识别入参中的变量。


``` js
import { getCallExpressionArguments } from "@charrue/ast-helper";

const source = `const result = fun(1);
  console.log(result);`

const result = await getCallExpressionArguments(source, "fun"); // [1]
```
