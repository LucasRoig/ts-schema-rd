// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ValueDef<_TValue> {
  public static of<T>(): ValueDef<T> {
    return new ValueDef<T>
  }
}

export type FieldDef<_TValue, TKey extends string> = {
  name: TKey;
};

export function createField<TValue, TKey extends string>(_value: ValueDef<TValue>, name: TKey): FieldDef<TValue, TKey> {
  return {
    name,
  };
}
