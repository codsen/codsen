declare const version: string;
type PlainObject = {
  [name: string]: any;
};
/**
 * @deprecated `mixer()` rows can contain non-boolean values. Use
 * `MixerResult` for generated rows.
 */
type PlainObjectOfBool = {
  [name: string]: boolean;
};
type BooleanValuesWidened<T extends PlainObject> = {
  [Key in keyof T]: T[Key] extends boolean ? boolean : T[Key];
};
type MixerResult<Ref extends PlainObject, Defaults extends PlainObject> = Omit<
  BooleanValuesWidened<Defaults>,
  keyof Ref
> &
  Ref;
interface MixerOptions {
  maxCombinations: number;
}
declare const defaults: Readonly<MixerOptions>;
declare function mixer<Defaults extends PlainObject = Record<never, never>>(
  ref?: undefined,
  defaultsObj?: Defaults,
  opts?: Partial<MixerOptions>,
): BooleanValuesWidened<Defaults>[];
declare function mixer<
  Ref extends PlainObject,
  Defaults extends PlainObject = Record<never, never>,
>(
  ref: Ref,
  defaultsObj?: Defaults,
  opts?: Partial<MixerOptions>,
): MixerResult<Ref, Defaults>[];
declare function mixer<
  Ref extends PlainObject,
  Defaults extends PlainObject = Record<never, never>,
>(
  ref: Ref | undefined,
  defaultsObj?: Defaults,
  opts?: Partial<MixerOptions>,
): Array<MixerResult<Ref, Defaults> | BooleanValuesWidened<Defaults>>;
declare function mixerLazy<Defaults extends PlainObject = Record<never, never>>(
  ref?: undefined,
  defaultsObj?: Defaults,
): Generator<BooleanValuesWidened<Defaults>, void, unknown>;
declare function mixerLazy<
  Ref extends PlainObject,
  Defaults extends PlainObject = Record<never, never>,
>(
  ref: Ref,
  defaultsObj?: Defaults,
): Generator<MixerResult<Ref, Defaults>, void, unknown>;
declare function mixerLazy<
  Ref extends PlainObject,
  Defaults extends PlainObject = Record<never, never>,
>(
  ref: Ref | undefined,
  defaultsObj?: Defaults,
): Generator<
  MixerResult<Ref, Defaults> | BooleanValuesWidened<Defaults>,
  void,
  unknown
>;

export { defaults, mixer, mixerLazy, version };
export type {
  BooleanValuesWidened,
  MixerOptions,
  MixerResult,
  PlainObject,
  PlainObjectOfBool,
};
