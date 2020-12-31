import { version } from "../package.json";
interface Res {
    res: boolean;
    message: string | null;
}
declare function isLangCode(str: string): Res;
export { isLangCode, version };
