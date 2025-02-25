import { createField, ValueDef, type FieldDef } from "./base-field-def";
import type { Prettify } from "./prettify";
import type { AddProperty, SetProperty } from "./ts-utils";

export type SchemaDef = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  fields: Record<string, FieldDef<any, string>>;
};

type EmptySchemaDef = {
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  fields: {};
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type AddField<TSchemaDef extends SchemaDef, TKey extends string, T extends FieldDef<any, TKey>> =
  SetProperty<TSchemaDef, "fields", AddProperty<TSchemaDef["fields"], TKey, T>>;

const field1 = createField(ValueDef.of<string>(), "stringField");
const field2 = createField(ValueDef.of<number>(), "fieldNumber");
// type t = AddField<EmptySchemaDef, "stringField", typeof field1>;
// type t2 = AddField<t, "fieldNumber", typeof field2>;

// // biome-ignore lint/suspicious/noExplicitAny: <explanation>
// declare function addField<TValue, TKey extends string>(field: FieldDef<TValue, TKey>) : AddField<EmptySchemaDef, TKey, FieldDef<TValue, TKey>>;
// // biome-ignore lint/suspicious/noExplicitAny: <explanation>
// declare function inferFieldName<TKey extends string>(field: FieldDef<any, TKey>): TKey

// const t3 = addField(field1);

// const t4 = inferFieldName(field1)

export class SchemaDefBuilder<TSchemaDef extends SchemaDef> {
  //Using a class as a builder works but looks hard to extend with plugins
  private schemaDef: TSchemaDef;

  public static new(): SchemaDefBuilder<EmptySchemaDef> {
    return new SchemaDefBuilder({
      fields: {},
    });
  }

  private constructor(schemaDef: TSchemaDef) {
    this.schemaDef = schemaDef;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  public addField<TValue, TKey extends string>(field: FieldDef<TValue, TKey>): SchemaDefBuilder<AddField<TSchemaDef, TKey, FieldDef<TValue, TKey>>> {
    return new SchemaDefBuilder<AddField<TSchemaDef, TKey, FieldDef<TValue, TKey>>>({
      ...this.schemaDef,
      fields: {
        ...this.schemaDef.fields,
        [field.name]: field,
      },
    } as AddField<TSchemaDef, TKey, FieldDef<TValue, TKey>>);
  }

  public build(): TSchemaDef {
    return this.schemaDef;
  }
}

const initSchemaDefBuilder = () => {
  const props = {
    fields: {},
    
  };
  const propsInteractor = {
    addField: <TValue, TKey extends string>(field: FieldDef<TValue, TKey>) => {
      return propsInteractor;
    },
    build: () => {
      return props;
    }
  }
  return propsInteractor;
  // $props: {
  //   fields: {},
  // },
  // addField: <TValue, TKey extends string>(field: FieldDef<TValue, TKey>) =>  {
  //   const n = {
  //     ...this,
  //     $props: {
  //       ...this.$props,
  //       [field.name]: field
  //     } as AddProperty<typeof this.$props, TKey, FieldDef<TValue, TKey>>
  //   }
  //   return n;
  // },
  // build: () => {
  //   return this.$props;
  // }
}

const s = initSchemaDefBuilder.addField(field1).build()
