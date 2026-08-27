declare const version: string;
type Converted<Input> = Input extends string
  ? string
  : Input extends (...arguments_: never[]) => unknown
    ? Input
    : Input extends abstract new (
          ...arguments_: never[]
        ) => unknown
      ? Input
      : Input extends readonly unknown[]
        ? {
            [Key in keyof Input]: Converted<Input[Key]>;
          }
        : Input extends object
          ? {
              [Key in keyof Input]: Converted<Input[Key]>;
            }
          : Input;
/**
 * Convert shorthand hex color codes into full
 */
declare function conv(): undefined;
declare function conv<Input>(input: Input): Converted<Input>;

export { conv, version };
export type { Converted };
