declare const version: string;
interface Opts {
    flagUpUrisWithSchemes: boolean;
    offset: number;
}
interface Res {
    res: boolean;
    message: string | null;
}
declare function isRel(str: string, originalOpts?: Partial<Opts>): Res;

export { isRel, version };
