import { Identifier, Node, StringLiteral } from "@babel/types";

export const getLiteralNodeValue = (node: Node): any => {
  switch (node.type) {
    case "NumericLiteral":
    case "NumberLiteral":
    case "StringLiteral":
    case "BooleanLiteral": {
      return node.value;
    }
    case "NullLiteral": {
      return null;
    }
    case "RegExpLiteral": {
      return new RegExp(node.pattern, node.flags);
    }
    case "Identifier": {
      return undefined;
    }
    case "ObjectProperty": {
      const key = (node.key as Identifier).name || (node.key as StringLiteral).value;
      return {
        [key]: getLiteralNodeValue(node.value),
      };
    }
    case "ObjectExpression": {
      if (node.properties && node.properties.length > 0) {
        return node.properties.reduce((acc, cur) => {
          // 只会解析对象表达式中的对象属性
          if (cur.type === "ObjectProperty") {
            const value = getLiteralNodeValue(cur);
            acc = {
              ...acc,
              ...value,
            };
          }
          return acc;
        }, {} as unknown as Record<string, any>);
      }
      return {};
    }

    case "ArrayExpression": {
      if (node.elements && node.elements.length > 0) {
        return node.elements.map((item) => {
          return getLiteralNodeValue(item as unknown as Node);
        });
      }

      return [];
    }

    default: {
      return undefined;
    }
  }
};
