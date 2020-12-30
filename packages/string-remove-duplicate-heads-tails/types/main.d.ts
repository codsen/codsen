import { version } from "../package.json";
interface Opts {
    heads: string[];
    tails: string[];
}
declare const defaults: {
    heads: string[];
    tails: string[];
};
declare function remDup(str: string, originalOpts?: Opts): string;
export { remDup, defaults, version };
