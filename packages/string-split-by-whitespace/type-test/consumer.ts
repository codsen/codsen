import { type Opts, splitByW } from "string-split-by-whitespace";

const options: Partial<Opts> = { ignoreRanges: undefined };
const tokens: string[] = splitByW("a b", options);
const filtered: string[] = splitByW("abc", { ignoreRanges: [[1, 2]] });
void tokens;
void filtered;
