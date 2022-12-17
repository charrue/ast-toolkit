import t from "@babel/types";
import { describe, expect, test } from "vitest";

import { getNodeIdentifierName } from "../getNodeIdentifierName";

describe("getNodeIdentifierName", () => {
  test("identifier", () => {
    const name = "foo";
    expect(getNodeIdentifierName(t.identifier(name))).toBe(name);
  });

  test("functionDeclaration", () => {
    const name = "fn";
    const fn = t.functionDeclaration(
      t.identifier(name),
      [t.identifier("arg")],
      t.blockStatement([]),
    );

    expect(getNodeIdentifierName(fn)).toBe(name);
  });

  test("callExpression", () => {
    const oName = "console";
    const pName = "log";
    const pName2 = "'info'";
    const callee1 = t.callExpression(
      t.memberExpression(t.identifier(oName), t.identifier(pName), false),
      [],
    );

    expect(getNodeIdentifierName(callee1)).toBe(`${oName}.${pName}`);

    const callee2 = t.callExpression(
      t.memberExpression(t.identifier(oName), t.stringLiteral(pName2), true),
      [],
    );
    expect(getNodeIdentifierName(callee2)).toBe(`${oName}[${pName2}]`);
  });

  test("newExpression", () => {
    const name = "People";

    const ctor = t.newExpression(t.identifier(name), []);

    expect(getNodeIdentifierName(ctor)).toBe(name);
  });
});
