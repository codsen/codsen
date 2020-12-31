import { version } from "../package.json";
interface Opts {
    flagUpUrisWithSchemes?: boolean;
    offset?: 0;
}
interface Res {
    res: boolean;
    message: string | null;
}
declare function isRel(str: string, originalOpts?: Opts): Res;
export { isRel, version };
