// biome-ignore lint/complexity/noBannedTypes: <explanation>
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Functions = Record<string, (...args: any[]) => any>

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type BaseBuilder<T, TExtensions extends Functions = {}> = {
  setProperty<TName extends keyof T>(name: TName, value: T[TName]): BaseBuilder<T, TExtensions>
  extend: <TAddedExtension extends Functions, TAddedState>(extension: BuilderExtension<TAddedState, TAddedExtension>) => BaseBuilder<T, TExtensions & TAddedExtension>
  build(): T
} & {
  [K in keyof TExtensions]: (...args : Parameters<TExtensions[K]>) => BaseBuilder<T, TExtensions>
}

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type BuilderExtension<TState, TFunctions extends Functions> = {
  getMethods: () => TFunctions
}

function getHandler<T>(): ProxyHandler<BaseBuilder<T>> {
  return {
    get(target, prop, receiver) {
      const builder = target as unknown as Builder;
      if (prop === 'build') {
        return () => builder.value;
      }
      // biome-ignore lint/complexity/noBannedTypes: <explanation>
      let fn: Function | undefined = undefined;
      if (prop in builder.extensions && typeof prop === 'string') {
        fn = builder.extensions[prop].bind(target);
      } else {
        // biome-ignore lint/complexity/noBannedTypes: <explanation>
        fn = Reflect.get(target, prop, receiver).bind(target) as Function;
      }
      if (fn === undefined) {
        throw new Error(`no function named ${String(prop)} found`)
      }
      return (...args: unknown[]) => {
        fn(...args);
        return receiver;
      }
    },
    set(target, prop, value, receiver) {
      throw new Error('cannot set a property on the builder')
      // biome-ignore lint/correctness/noUnreachable: <explanation>
      return Reflect.set(target, prop, value, receiver);
    }
  }
}

class Builder {
  public value: Record<string, unknown> = {};
  public extensions: Functions = {}
  public setProperty(name: string, value: unknown) {
    this.value[name] = value;
  }
  public extend<TAddedExtension extends Functions>(extension: BuilderExtension<any, TAddedExtension>) {
    const methods = extension.getMethods();
    Object.assign(this.extensions, methods);
  }
}

function makeBuilder<T>(): BaseBuilder<T> {
  const handler = getHandler<T>()
  const baseBuilder = new Builder();
  return new Proxy<BaseBuilder<T>>(baseBuilder as unknown as BaseBuilder<T>, handler)
}

const builder = makeBuilder<{ a: number }>().extend({
  getMethods() {
    return {
      extensionMethod1(builderState: { a: number }) {
        console.info('extensionMethod1')
        return builderState;
      },
      extensionMethod2() {
        console.info('extensionMethod2')
      }
    }
  }
}).setProperty('a', 1).setProperty('a', 2).extensionMethod1().extensionMethod2();

const value = builder.build()
console.info(value)
