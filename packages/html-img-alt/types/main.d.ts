import { version } from "../package.json";
interface Opts {
    unfancyTheAltContents: boolean;
}
declare function alts(str: string, originalOpts?: Opts): string;
export { alts, version };
