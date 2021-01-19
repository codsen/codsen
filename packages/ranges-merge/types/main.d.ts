declare type Range = [from: number, to: number] | [from: number, to: number, whatToInsert: string | null | undefined];

declare const version: string;
declare type ProgressFn = (percentageDone: number) => void;
interface Opts {
    mergeType: 1 | 2 | "1" | "2";
    progressFn: null | undefined | ProgressFn;
    joinRangesThatTouchEdges: boolean;
}
declare const defaults: Opts;
declare function rMerge(arrOfRanges: Range[] | null, originalOpts?: Partial<Opts>): Range[] | null;

export { defaults, rMerge, version };
