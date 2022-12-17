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
): Promise<any[] | undefined> => {
  return new Promise((resolve) => {
    let ast: Node;
    if (typeof source === "string") {
      if (!source.includes(name)) {
        resolve(undefined);
      }

      ast = parse(source).program;
    } else {
      ast = source;
    }

    walk(ast, {
      enter(node: Node) {
        if (node.type === "CallExpression") {
          const calleeName = getNodeIdentifierName(node);

          if (calleeName === name) {
            const args = node.arguments.map(getLiteralNodeValue);
            resolve(args);
          }
        }
      },
    });
  });
};
