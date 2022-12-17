import { describe, expect, test } from "vitest";

import { getCallExpressionArguments } from "../getCallExpressionArguments";

describe("getCallExpressionArguments", () => {
  test("basic usage", () => {
    const source = `
      const result = fun({ name: 1 }, 1, "foo", false);
      console.log(result);
    `.trim();

    const result = getCallExpressionArguments(source, "fun");
    expect(result).toEqual([{ name: 1 }, 1, "foo", false]);
    const errorResult = getCallExpressionArguments(source, "fun2");
    expect(errorResult).toBeUndefined();
  });

  test("cannot get variable", () => {
    const source = `
      const result = fun({ name: 1 }, 1, "foo", false, bar);
      console.log(result);
    `.trim();

    const result = getCallExpressionArguments(source, "fun");
    expect(result).toEqual([{ name: 1 }, 1, "foo", false, undefined]);
    const errorResult = getCallExpressionArguments(source, "fun2");
    expect(errorResult).toBeUndefined();
  });
});
