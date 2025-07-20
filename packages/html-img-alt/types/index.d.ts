declare const version: string;
interface Opts {
  unfancyTheAltContents: boolean;
}
declare const defaults: Opts;
declare function alts(str: string, opts?: Partial<Opts>): string;

export { alts, defaults, version };
export type { Opts };
