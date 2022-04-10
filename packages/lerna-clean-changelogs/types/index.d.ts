declare const version: string;
interface Opts {
  extras: boolean;
}
declare const defaults: Opts;
declare function cleanChangelogs(
  changelogContents: string,
  originalOpts?: Partial<Opts>
): {
  version: string;
  res: string;
};

export { cleanChangelogs, defaults, version };
