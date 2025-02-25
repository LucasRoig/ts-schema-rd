import { SetProperty } from "./ts-utils";

type AnyObjectBuilder<T> = {
  set: <Key extends string, V>(
    key: Key,
    value: V,
  ) => AnyObjectBuilder<SetProperty<T, Key, V>>;
};

const initObjectBuilder: <T>() => AnyObjectBuilder<T> = <T>() => {
  return {
    set<Key extends string, V>(
      key: Key,
      value: V,
    ): AnyObjectBuilder<SetProperty<T, Key, V>> {
      return this;
    },
  };
};

initObjectBuilder().set("a", 1).set("b", 2).set("c", 3).build();

function main() {
  const x = {
    v: 1,
    modify() {
      this.v = 3;
    },
    me() {
      return this;
    },
    anotherMe() {
      return { ...this };
    },
  };
  const other = x.anotherMe();
  x.v = 2;
  other.v = 18;
  x.modify();
  const t = x.me().v;
  console.log(t);
  console.log(other.v);
}

main();
