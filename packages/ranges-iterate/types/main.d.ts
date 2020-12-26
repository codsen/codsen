import { Ranges } from "../../../scripts/common";
import { version } from "../package.json";
interface Obj {
    i: number;
    val: any;
}
declare type Callback = (obj: Obj) => void;
declare function rIterate(str: string, originalRanges: Ranges, cb: Callback, offset?: number): void;
export { rIterate, version };
