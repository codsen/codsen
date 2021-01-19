declare type Range = [from: number, to: number] | [from: number, to: number, whatToInsert: string | null | undefined];
declare type Ranges = Range[] | null;

declare const version: string;
interface Opts {
    isAttributeValue: boolean;
    strict: boolean;
}
declare const defaults: Opts;
declare function rEntDecode(str: string, originalOpts?: Partial<Opts>): Ranges;

export { defaults, rEntDecode, version };
