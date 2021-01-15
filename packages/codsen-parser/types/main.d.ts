declare const version: string;
interface Opts {
    reportProgressFunc: null | ((percDone: number) => void);
    reportProgressFuncFrom: number;
    reportProgressFuncTo: number;
    tagCb: null;
    charCb: null;
    errCb: null;
}
declare const defaults: Opts;
declare function cparser(str: string, originalOpts?: Partial<Opts>): any[];

export { cparser, defaults, version };
