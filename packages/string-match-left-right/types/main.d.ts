interface Opts {
    cb?: undefined | null | ((wholeCharacterOutside: string | undefined, theRemainderOfTheString: string, firstCharOutsideIndex: number) => string | boolean);
    i?: boolean;
    trimBeforeMatching?: boolean;
    trimCharsBeforeMatching?: string[];
    maxMismatches?: number;
    firstMustMatch?: boolean;
    lastMustMatch?: boolean;
}
declare function matchLeftIncl(str: string, position: number, whatToMatch: (() => string) | string | string[], opts?: Opts): boolean | string;
declare function matchLeft(str: string, position: number, whatToMatch: (() => string) | string | string[], opts?: Opts): boolean | string;
declare function matchRightIncl(str: string, position: number, whatToMatch: (() => string) | string | string[], opts?: Opts): boolean | string;
declare function matchRight(str: string, position: number, whatToMatch: (() => string) | string | string[], opts?: Opts): boolean | string;
export { matchLeftIncl, matchRightIncl, matchLeft, matchRight };
