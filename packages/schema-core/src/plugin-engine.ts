//https://code.lol/post/programming/plugin-architecture/

declare abstract class EnginePlugin<I = unknown, D = unknown> {
  createInterface?(ø: Record<string, unknown>): I
  getDependencies?(): D
}

type Defined<T> = T extends undefined ? never : T

type ExtractPlugins<T> = T extends Engine<infer PX> ? PX : never

type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never

type MergeInterfaces<
  E extends Engine,
  K extends keyof EnginePlugin,
> = UnionToIntersection<ReturnType<Defined<ExtractPlugins<E>[number][K]>>>

type Assume<T, U> = T extends U ? T : never

type GetDependencies<P extends EnginePlugin> = Assume<
  P extends EnginePlugin<unknown, infer D> ? D : never,
  EnginePlugin[]
>

type PluginDependencyErrorMessage =
  `Plugin is missing one or more dependencies.`

type EnforceDependencies<
  E extends Engine,
  P extends EnginePlugin,
> = GetDependencies<P>[number] extends ExtractPlugins<E>[number]
  ? P
  : PluginDependencyErrorMessage

declare class Engine<PX extends EnginePlugin[] = []> {
  registerPlugin<P extends EnginePlugin>(
    plugin: EnforceDependencies<this, P>,
  ): asserts this is Engine<[...PX, P]>

  createInterface(): MergeInterfaces<this, "createInterface">
}

interface DogInterface {
  bark(): void
}

declare const DogPlugin: {
  new (): {
    createInterface(ø: Record<string, unknown>): DogInterface
  }
  (ø: unknown): ø is DogInterface
}

interface CatInterface {
  meow(message: string): void
}

declare const CatPlugin: {
  new (): {
    super(): typeof CatPlugin
    createInterface(ø: Record<string, unknown>): CatInterface
  }
  (ø: unknown): ø is CatInterface
}

interface PantherInterface {
  panther: {
    roar(): void
  }
}

declare const PantherPlugin: {
  new (): {
    createInterface(ø: Record<string, unknown>): PantherInterface
  }
  getDependencies(): [typeof CatPlugin]
  (ø: unknown): ø is PantherInterface
}

declare const engine: Engine

engine.registerPlugin(new DogPlugin())
engine.registerPlugin(new CatPlugin())
engine.registerPlugin(new PantherPlugin())

const ø = engine.createInterface()

ø.bark()
ø.meow("hello")
ø.panther.roar()

ø.meow("meow")

if (DogPlugin(ø)) {
  ø.bark()
}
