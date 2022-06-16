declare const version: string;
interface Opts {
  maxLen: number;
  maxLines: number;
  ellipsisLen?: number;
  monospace: boolean;
  noEmpty: boolean;
  letterWidths: Record<string, number>;
}
declare const defaults: Opts;
interface Res {
  result: string;
  addEllipsis: boolean;
}
declare function truncate(str: string, opts?: Partial<Opts>): Res;

export { defaults, truncate, version };
