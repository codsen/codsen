import { Opts, ResObj } from "./util";
import { version } from "../package.json";
declare const defaults: {
    offset: number;
};
declare function isMediaD(originalStr: string, originalOpts?: Opts): ResObj[];
export { isMediaD, defaults, version };
