import { version } from "../package.json";
interface Opts {
    offset: number;
    offsetFillerCharacter: string;
}
declare function overlap(str1: string, str2: string, originalOpts?: Opts): string;
export { overlap, version };
