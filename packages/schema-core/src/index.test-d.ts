import { createField, Filters, InferOperators, InferValueType, Operator, Schema, SchemaDef, SchemaWithOperatorsDef } from "src";
import { describe, expectTypeOf, test } from "vitest";
import { Prettify } from "./prettify";

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

  const StringField = createField<string>("string");

  const NumberField = createField<number>("number");

  const BooleanField = createField<boolean>("boolean");

  const schemaDefinition = {
    fields: {
      string: StringField,
      number: NumberField,
      boolean: BooleanField,
    },
  } satisfies SchemaDef;

  const schemaWithOperatorsDefinition = {
    ...schemaDefinition,
    operators: {
      string: [equalOperator, startsWithOperator],
      number: [lteOperator, equalOperator],
      boolean: [equalOperator],
    }
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
  })

  test("infer operator works", () => {
    type t = InferOperators<typeof schemaDefinition, typeof schemaWithOperatorsDefinition, typeof schema, "prop1">;
    type t2 = InferOperators<typeof schemaDefinition, typeof schemaWithOperatorsDefinition, typeof schema, "prop2">;
    type t3 = InferOperators<typeof schemaDefinition, typeof schemaWithOperatorsDefinition, typeof schema, "prop3">;

    expectTypeOf<t>().toEqualTypeOf<"equal" | "startsWith">();
    expectTypeOf<t2>().toEqualTypeOf<"equal" | "lte">();
    expectTypeOf<t3>().toEqualTypeOf<"equal">();
  })

  test("filter works", () => {
    type MyFilter = Prettify<Filters<typeof schemaDefinition, typeof schemaWithOperatorsDefinition, typeof schema>>;

    expectTypeOf<MyFilter["prop1"]>().toMatchTypeOf<{
      equal?: string | undefined;
      startsWith?: string | undefined;
    } | undefined>();
    expectTypeOf<MyFilter["prop2"]>().toMatchTypeOf<{
      lte?: number | undefined;
      equal?: number | undefined;
    } | undefined>();
    expectTypeOf<MyFilter["prop3"]>().toMatchTypeOf<{
      equal?: boolean | undefined;
    } | undefined>();

    expectTypeOf<MyFilter>().toEqualTypeOf<{
      prop1?: {
        equal?: string | undefined;
        startsWith?: string | undefined;
      } | undefined;
      prop2?: {
        lte?: number | undefined;
        equal?: number | undefined;
      } | undefined;
      prop3?: {
        equal?: boolean | undefined;
      } | undefined;
    }>();
  });
});
