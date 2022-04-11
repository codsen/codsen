declare const version: string;
interface Opts {
  caseSensitive: boolean;
}
declare const defaults: Opts;
/**
 * Like _.pullAll but with globs (wildcards)
 */
declare function pull(
  strArr: string[],
  toBeRemoved: string | string[],
  opts?: Partial<Opts>
): string[];

export { defaults, pull, version };
