import { Ranges } from "../../../scripts/common";
import { version } from "../package.json";
interface Inputs {
    from: number;
    to?: number;
    value?: string;
    convertEntities?: boolean;
    convertApostrophes?: boolean;
    offsetBy?: (amount: number) => void;
}
declare function convertOne(str: string, { from, to, value, convertEntities, convertApostrophes, offsetBy, }: Inputs): Ranges;
declare function convertAll(str: string, opts?: Inputs): {
    result: string;
    ranges: Ranges;
};
export { convertOne, convertAll, version };
