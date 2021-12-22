import { Ranges } from 'ranges-merge';

declare const version: string;
declare function rRegex(regx: RegExp, str: string, replacement?: string | null | undefined): Ranges;

export { rRegex, version };
