declare const version: string;
interface Opts {
  cssStylesContent: string;
  alwaysCenter: boolean;
}
declare const defaults: Opts;
/**
 * Visual helper to place templating code around table tags into correct places
 */
declare function patcher(
  str: string,
  generalOpts?: Partial<Opts>
): {
  result: string;
};

export { defaults, patcher, version };
