declare const version: string;
interface UnknownValueObj {
    [key: string]: any;
}
interface Opts {
    dedupe: boolean;
}
declare const defaults: Opts;
declare function generateAst(input: any[], originalOpts?: Partial<Opts>): UnknownValueObj;

export { defaults, generateAst, version };
