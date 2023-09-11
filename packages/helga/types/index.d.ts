declare const version: string;
interface Opts {
  targetJSON: boolean;
}
declare const defaults: {
  targetJSON: boolean;
};
declare function helga(
  str: string,
  originalOpts?: Partial<Opts>,
): {
  minified: string;
  beautified: string;
};

export { type Opts, defaults, helga, version };
