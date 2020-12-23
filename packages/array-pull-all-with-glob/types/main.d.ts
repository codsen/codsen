import { version } from "../package.json";
interface Opts {
    caseSensitive?: boolean;
}
declare function pull(originalInput: string[], originalToBeRemoved: string | string[], originalOpts?: Opts): string[];
export { pull, version };
