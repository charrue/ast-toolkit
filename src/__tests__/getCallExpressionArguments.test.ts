import { describe, expect, test } from "vitest";

import { getCallExpressionArguments } from "../getCallExpressionArguments";

describe("getCallExpressionArguments", () => {
  test("number", async () => {
    const source = `
      const result = fun(1);
      console.log(result);
    `.trim();

    const result = await getCallExpressionArguments(source, "fun");
    expect(result).toEqual([1]);
    const errorResult = await getCallExpressionArguments(source, "fun2");
    expect(errorResult).toBeUndefined();
  });
});
