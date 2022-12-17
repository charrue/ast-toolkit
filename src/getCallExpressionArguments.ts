import { parse } from "@babel/parser";
import { Node } from "@babel/types";
import { walk } from "estree-walker";

import { getLiteralNodeValue } from "./getLiteralNodeValue";
import { getNodeIdentifierName } from "./getNodeIdentifierName";

/**
 * @example
 * getCallExpressionArguments("fn(1)", "fn") // 1
 */
export const getCallExpressionArguments = (
  source: string | Node,
  name: string,
): any[] | undefined => {
  let ast: Node;
  if (typeof source === "string") {
    if (!source.includes(name)) {
      return undefined;
    }

    ast = parse(source).program;
  } else {
    ast = source;
  }

  let args;

  walk(ast, {
    enter(node: Node) {
      if (node.type === "CallExpression") {
        const calleeName = getNodeIdentifierName(node);

        if (calleeName === name) {
          args = node.arguments.map(getLiteralNodeValue);
        }
      }
    },
  });

  return args;
};
