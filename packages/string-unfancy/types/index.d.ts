declare const version: string;
interface Opts {
  preserveCombiningMarks: boolean;
}
declare function unfancy(str: string, opts?: Partial<Opts>): string;
declare function unfancy(str: string): string;

export { unfancy, version };
export type { Opts };
