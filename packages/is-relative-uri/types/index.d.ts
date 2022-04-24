declare const version: string;
interface Opts {
  flagUpUrisWithSchemes: boolean;
}
declare const defaults: Opts;
interface Res {
  res: boolean;
  message: string | null;
}
declare function isRel(str: string, opts?: Partial<Opts>): Res;

export { defaults, isRel, version };
