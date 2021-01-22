interface Res {
    res: string[][];
    msgContent: null | string;
    msgType: null | string;
}
/**
 * Sorts double-entry bookkeeping CSV coming from internet banking
 */
declare function sort(input: string): Res;

export { sort };
