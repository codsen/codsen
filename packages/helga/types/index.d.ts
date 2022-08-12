declare const version: string;
interface Obj {
  [key: string]: any;
}
interface Opts {
  targetJSON: boolean;
}
declare const defaults: {
  targetJSON: boolean;
};
declare function helga(
  str: string,
  originalOpts?: Partial<Opts>
): {
  minified: string;
  beautified: string;
};

export { Obj, Opts, defaults, helga, version };
