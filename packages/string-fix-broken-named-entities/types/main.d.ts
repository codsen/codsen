import { version } from "../package.json";
import { Ranges } from "../../../scripts/common";
interface cbObj {
    rangeFrom: number;
    rangeTo: number;
    rangeValEncoded: string | null;
    rangeValDecoded: string | null;
    ruleName: string;
    entityName: string | null;
}
interface Opts {
    decode?: boolean;
    cb: (obj: cbObj) => void;
    entityCatcherCb?: undefined | null | ((from: number, to: number) => void);
    progressFn?: undefined | null | ((percDone: number) => void);
}
declare function fixEnt(str: string, originalOpts?: Opts): Ranges;
export { fixEnt, version };
