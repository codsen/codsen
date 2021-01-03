import { version } from "../package.json";
interface Opts {
    targetJSON: boolean;
}
declare const defaults: {
    targetJSON: boolean;
};
declare function helga(str: string, originalOpts?: Opts): {
    minified: string;
    beautified: string;
};
export { helga, defaults, version };
