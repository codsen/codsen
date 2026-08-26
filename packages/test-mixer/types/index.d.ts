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
declare function mixer<Defaults extends PlainObject = Record<never, never>>(
  ref?: undefined,
  defaultsObj?: Defaults,
): BooleanValuesWidened<Defaults>[];
declare function mixer<
  Ref extends PlainObject,
  Defaults extends PlainObject = Record<never, never>,
>(ref: Ref, defaultsObj?: Defaults): MixerResult<Ref, Defaults>[];
declare function mixer<
  Ref extends PlainObject,
  Defaults extends PlainObject = Record<never, never>,
>(
  ref: Ref | undefined,
  defaultsObj?: Defaults,
): Array<MixerResult<Ref, Defaults> | BooleanValuesWidened<Defaults>>;

export { mixer, version };
export type {
  BooleanValuesWidened,
  MixerResult,
  PlainObject,
  PlainObjectOfBool,
};
