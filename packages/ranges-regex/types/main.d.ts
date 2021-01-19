declare type Range = [from: number, to: number] | [from: number, to: number, whatToInsert: string | null | undefined];
declare type Ranges = Range[] | null;

declare const version: string;
declare function rRegex(regx: RegExp, str: string, replacement?: string | null | undefined): Ranges;

export { rRegex, version };
