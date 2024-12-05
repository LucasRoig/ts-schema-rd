import { describe, expectTypeOf, test } from "vitest";
import type { AddProperty, MergePropertiesRelacing, SetProperty } from "./ts-utils";

describe("ts-utils", () => {
  test("AddProperty", () => {
    type t = AddProperty<{ a: number }, "b", string>;

    expectTypeOf<t>().toEqualTypeOf<{ a: number; b: string }>();
  });

  test("SetProperty", () => {
    type t2 = SetProperty<{ a: number }, "b", string>;
    type t3 = SetProperty<{ a: number }, "a", string>;

    expectTypeOf<t2>().toEqualTypeOf<{ a: number; b: string }>();
    expectTypeOf<t3>().toEqualTypeOf<{ a: string }>();
  });

  test("MergePropertiesRelacing", () => {
    type t4 = MergePropertiesRelacing<{ a: number }, { b: string }>;
    type t5 = MergePropertiesRelacing<{ a: number }, { a: string }>;
    type t6 = MergePropertiesRelacing<{ a: number, c: boolean }, { a: string; b: string }>;

    expectTypeOf<t4>().toEqualTypeOf<{ a: number; b: string }>();
    expectTypeOf<t5>().toEqualTypeOf<{ a: string }>();
    expectTypeOf<t6>().toEqualTypeOf<{ a: string; b: string; c: boolean }>();
  });
});
