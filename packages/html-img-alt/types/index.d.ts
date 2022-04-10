declare const version: string;
interface Opts {
  unfancyTheAltContents: boolean;
}
declare const defaults: Opts;
declare function alts(str: string, originalOpts?: Partial<Opts>): string;

export { alts, defaults, version };
