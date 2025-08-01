declare const version: string;
interface Obj {
  [key: string]: any;
}
interface Opts {
  cssStylesContent: string;
  alwaysCenter: boolean;
}
declare const defaults: Opts;
interface Res {
  result: string;
}
/**
 * Visual helper to place templating code around table tags into correct places
 */
declare function patcher(str: string, opts?: Partial<Opts>): Res;

export { defaults, patcher, version };
export type { Obj, Opts, Res };
