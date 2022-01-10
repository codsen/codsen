declare const version: string;
interface Opts {
  unfancyTheAltContents: boolean;
}
declare function alts(str: string, originalOpts?: Partial<Opts>): string;

export { alts, version };
