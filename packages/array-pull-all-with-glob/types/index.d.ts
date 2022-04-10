declare const version: string;
interface Opts {
  caseSensitive?: boolean;
}
declare const defaults: Opts;
/**
 * Like _.pullAll but with globs (wildcards)
 */
declare function pull(
  originalInput: string[],
  originalToBeRemoved: string | string[],
  originalOpts?: Opts
): string[];

export { defaults, pull, version };
