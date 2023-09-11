declare const version: string;
interface Opts {
  offset: number;
  offsetFillerCharacter: string;
}
declare const defaults: Opts;
declare function overlap(
  str1: string,
  str2: string,
  opts?: Partial<Opts>,
): string;

export { type Opts, defaults, overlap, version };
