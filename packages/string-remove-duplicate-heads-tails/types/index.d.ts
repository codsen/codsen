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
declare function remDup(str: string, opts?: Partial<LenientOpts>): string;

export { type LenientOpts, type Opts, defaults, remDup, version };
