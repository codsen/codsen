declare const version: string;
interface Opts {
    offset: number;
    offsetFillerCharacter: string;
}
declare function overlap(str1: string, str2: string, originalOpts?: Partial<Opts>): string;

export { overlap, version };
