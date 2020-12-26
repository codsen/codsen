import { version } from "../package.json";
import { Range, Ranges } from "../../../scripts/common";
declare function rApply(str: string, originalRangesArr: Range | Ranges, progressFn?: (percentageDone: number) => void): string;
export { rApply, version };
