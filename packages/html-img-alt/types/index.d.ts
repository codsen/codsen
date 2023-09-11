declare const version: string;
interface Opts {
  unfancyTheAltContents: boolean;
}
declare const defaults: Opts;
declare function alts(str: string, opts?: Partial<Opts>): string;

export { type Opts, alts, defaults, version };
