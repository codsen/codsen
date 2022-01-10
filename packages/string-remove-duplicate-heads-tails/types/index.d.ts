declare const version: string;
interface Opts {
  heads: string[];
  tails: string[];
}
interface LenientOpts {
  heads: string | string[];
  tails: string | string[];
}
declare const defaults: Opts;
declare function remDup(str: string, originalOpts?: LenientOpts): string;

export { defaults, remDup, version };
