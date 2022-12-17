import { Node } from "@babel/types";

export const getNodeIdentifierName = (node: Node): string => {
  switch (node.type) {
    case "Identifier": {
      return node.name;
    }
    case "StringLiteral": {
      return `${node.extra?.raw || ""}` || node.value;
    }
    case "CallExpression": {
      return getNodeIdentifierName(node.callee);
    }
    case "MemberExpression": {
      const objectName = getNodeIdentifierName(node.object);
      const propertyName = getNodeIdentifierName(node.property);
      if (node.computed) {
        return `${objectName}[${propertyName}]`;
      }

      return `${objectName}.${propertyName}`;
    }
    case "FunctionDeclaration": {
      return node.id ? getNodeIdentifierName(node.id!) : "";
    }
    case "NewExpression": {
      return getNodeIdentifierName(node.callee);
    }
    default: {
      return "";
    }
  }
};
