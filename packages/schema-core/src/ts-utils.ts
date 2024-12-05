import type { Prettify } from "./prettify";

export type AddProperty<TBase, TKey extends string, TValue> = Prettify<
  TBase & {
    [key in TKey]: TValue;
  }
>;

export type SetProperty<TBase, TKey extends string, TValue> = Prettify<
  Omit<TBase, TKey> & {
    [key in TKey]: TValue;
  }
>;

export type MergePropertiesRelacing<TBase, TOther> = Prettify<Omit<TBase, keyof TOther> & TOther>;
