declare const defaultOpts: {
  allowCustomTagNames: boolean;
  skipOpeningBracket: boolean;
};

declare const version: string;
interface Opts {
  allowCustomTagNames: boolean;
  skipOpeningBracket: boolean;
}
declare function isOpening(
  str: string,
  idx?: number,
  opts?: Partial<Opts>,
): boolean;

export { defaultOpts as defaults, isOpening, version };
export type { Opts };
