declare const version: string;
interface Opts {
  throwIfEdgeWhitespace: boolean;
}
declare const defaults: Opts;
declare function split(str: string, opts?: Partial<Opts>): number;

export { defaults, split, version };
