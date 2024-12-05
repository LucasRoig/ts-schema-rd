import type { Filters, InferOperators, InferValueType, Operator, Schema, SchemaWithOperatorsDef } from "src";
import { describe, expectTypeOf, test } from "vitest";
import { createField, ValueDef } from "./base-field-def";
import { SchemaDefBuilder, type SchemaDef } from "./base-schema-def";
import type { Prettify } from "./prettify";

describe("test schema", () => {
  const equalOperator = {
    name: "equal" as const,
  } satisfies Operator;

  const startsWithOperator = {
    name: "startsWith" as const,
  } satisfies Operator;

  const lteOperator = {
    name: "lte" as const,
  } satisfies Operator;

  const StringField = createField(ValueDef.of<string>(),"string");

  const NumberField = createField(ValueDef.of<number>(), "number");

  const BooleanField = createField(ValueDef.of<boolean>(), "boolean");

  const schemaDefinition = SchemaDefBuilder.new()
    .addField(StringField)
    .addField(NumberField)
    .addField(BooleanField)
    .build();

  const schemaWithOperatorsDefinition = {
    ...schemaDefinition,
    operators: {
      string: [equalOperator, startsWithOperator],
      number: [lteOperator, equalOperator],
      boolean: [equalOperator],
    },
  } satisfies SchemaWithOperatorsDef<typeof schemaDefinition>;

  const schema = {
    prop1: "string" as const,
    prop2: "number" as const,
    prop3: "boolean" as const,
  } satisfies Schema<typeof schemaDefinition>;

  test("infer value type works", () => {
    type t = InferValueType<typeof schemaDefinition, typeof schema, "prop1">;
    type t2 = InferValueType<typeof schemaDefinition, typeof schema, "prop2">;
    type t3 = InferValueType<typeof schemaDefinition, typeof schema, "prop3">;

    expectTypeOf<t>().toEqualTypeOf<string>();
    expectTypeOf<t2>().toEqualTypeOf<number>();
    expectTypeOf<t3>().toEqualTypeOf<boolean>();
  });

  test("infer operator works", () => {
    type t = InferOperators<typeof schemaDefinition, typeof schemaWithOperatorsDefinition, typeof schema, "prop1">;
    type t2 = InferOperators<typeof schemaDefinition, typeof schemaWithOperatorsDefinition, typeof schema, "prop2">;
    type t3 = InferOperators<typeof schemaDefinition, typeof schemaWithOperatorsDefinition, typeof schema, "prop3">;

    expectTypeOf<t>().toEqualTypeOf<"equal" | "startsWith">();
    expectTypeOf<t2>().toEqualTypeOf<"equal" | "lte">();
    expectTypeOf<t3>().toEqualTypeOf<"equal">();
  });

  test("filter works", () => {
    type MyFilter = Prettify<Filters<typeof schemaDefinition, typeof schemaWithOperatorsDefinition, typeof schema>>;

    expectTypeOf<MyFilter["prop1"]>().toMatchTypeOf<
      | {
          equal?: string | undefined;
          startsWith?: string | undefined;
        }
      | undefined
    >();
    expectTypeOf<MyFilter["prop2"]>().toMatchTypeOf<
      | {
          lte?: number | undefined;
          equal?: number | undefined;
        }
      | undefined
    >();
    expectTypeOf<MyFilter["prop3"]>().toMatchTypeOf<
      | {
          equal?: boolean | undefined;
        }
      | undefined
    >();

    expectTypeOf<MyFilter>().toEqualTypeOf<{
      prop1?:
        | {
            equal?: string | undefined;
            startsWith?: string | undefined;
          }
        | undefined;
      prop2?:
        | {
            lte?: number | undefined;
            equal?: number | undefined;
          }
        | undefined;
      prop3?:
        | {
            equal?: boolean | undefined;
          }
        | undefined;
    }>();
  });
});
