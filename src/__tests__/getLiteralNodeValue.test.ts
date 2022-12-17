import t from "@babel/types";
import { describe, expect, test } from "vitest";

import { getLiteralNodeValue } from "../getLiteralNodeValue";

describe("getLiteralNodeValue", () => {
  test("numericLiteral", () => {
    const value = 100;
    expect(getLiteralNodeValue(t.numericLiteral(value))).toBe(value);
  });

  test("stringLiteral", () => {
    const value = "100";
    expect(getLiteralNodeValue(t.stringLiteral(value))).toBe(value);
  });

  test("booleanLiteral", () => {
    const value = false;
    expect(getLiteralNodeValue(t.booleanLiteral(value))).toBe(value);
  });

  test("regExpLiteral", () => {
    const pattern = "abc";
    const flags = "g";
    expect(getLiteralNodeValue(t.regExpLiteral(pattern, flags))).toEqual(
      new RegExp(pattern, flags),
    );
  });

  test("nullLiteral", () => {
    expect(getLiteralNodeValue(t.nullLiteral())).toBe(null);
  });

  test("objectProperty", () => {
    const key = "name";
    const value = "foo";

    expect(
      getLiteralNodeValue(t.objectProperty(t.identifier(key), t.stringLiteral(value))),
    ).toEqual({
      [key]: value,
    });
  });

  test("objectExpression", () => {
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
    expect(result).toEqual({
      [key1]: value1,
      [key2]: value2,
      [key3]: value3,
    });
  });

  test("arrayExpression", () => {
    const value1 = "str";
    const value2 = 2;
    const value3 = false;
    const key1 = "key";
    const value4 = "value";

    const ast = t.arrayExpression([
      t.stringLiteral(value1),
      t.numericLiteral(value2),
      t.booleanLiteral(value3),
      t.objectExpression([t.objectProperty(t.identifier(key1), t.stringLiteral(value4))]),
    ]);
    expect(getLiteralNodeValue(ast)).toEqual([value1, value2, value3, { [key1]: value4 }]);
  });

  test("has variable", () => {
    const key = "str";
    const value = t.identifier("CONST");

    const result = getLiteralNodeValue(
      t.objectExpression([t.objectProperty(t.identifier(key), value)]),
    );

    expect(result).toEqual({
      [key]: undefined,
    });
  });
});
