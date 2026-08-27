declare const version: string;
interface UnknownValueObject {
  [key: string]: unknown;
}
/** A combination row when no values are pinned through an override. */
type BoolObj = Record<string, boolean>;
type BooleanCombination<Input extends UnknownValueObject> = {
  -readonly [Key in keyof Input as Key extends string | number
    ? Key
    : never]: boolean;
};
type Combination<
  Input extends UnknownValueObject,
  Override extends UnknownValueObject | undefined,
> = Override extends UnknownValueObject
  ? {
      -readonly [Key in keyof Input as Key extends string | number
        ? Key
        : never]: Key extends keyof Override
        ? Record<never, never> extends Pick<Override, Key>
          ? boolean | Override[Key]
          : Override[Key]
        : boolean;
    }
  : BooleanCombination<Input>;
declare function combinations<
  Input extends UnknownValueObject,
  Override extends UnknownValueObject | undefined = undefined,
>(input: Input, Override?: Override): Combination<Input, Override>[];

export { combinations, version };
export type { BoolObj, BooleanCombination, Combination, UnknownValueObject };
