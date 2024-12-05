import type { FieldDef } from "./base-field-def";
import type { SchemaDef } from "./base-schema-def";
import type { Prettify } from "./prettify";

export type Operator = {
  name: string;
};

export type SchemaWithOperatorsDef<TSchemaDef extends SchemaDef> = TSchemaDef & {
  operators: Record<keyof TSchemaDef["fields"], Operator[]>;
};

type InferFieldNames<S extends SchemaDef> = keyof S["fields"];

export type Schema<S extends SchemaDef> = Record<string, InferFieldNames<S>>;

export type InferValueType<
  TSchemaDef extends SchemaDef,
  TSchema extends Schema<TSchemaDef>,
  TFieldName extends keyof TSchema,
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
> = TSchemaDef["fields"][TSchema[TFieldName]] extends FieldDef<infer TValueType, any> ? TValueType : never;

export type InferOperators<
  TDef extends SchemaDef,
  TSchemaDef extends SchemaWithOperatorsDef<TDef>,
  TSchema extends Schema<TSchemaDef>,
  TFieldName extends keyof TSchema,
> = TSchemaDef["operators"][TSchema[TFieldName]] extends Operator[]
  ? TSchemaDef["operators"][TSchema[TFieldName]][number]["name"]
  : never;

export type Filters<
  TDef extends SchemaDef,
  TSchemaDef extends SchemaWithOperatorsDef<TDef>,
  TSchema extends Schema<TSchemaDef>,
> = Partial<{
  [TFieldName in keyof TSchema]: Prettify<
    Partial<{
      [TOperatorName in InferOperators<TDef, TSchemaDef, TSchema, TFieldName>]: InferValueType<
        TSchemaDef,
        TSchema,
        TFieldName
      >;
    }>
  >;
}>;
