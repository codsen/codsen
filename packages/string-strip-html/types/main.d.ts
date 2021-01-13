import { version } from "../package.json";
import { Range, Ranges as RangesType } from "../../../scripts/common";
interface Tag {
    attributes: string[];
    lastClosingBracketAt: number;
    lastOpeningBracketAt: number;
    slashPresent: number;
    leftOuterWhitespace: number;
    onlyPlausible: boolean;
    nameStarts: number;
    nameContainsLetters: boolean;
    nameEnds: number;
    name: string;
}
interface CbObj {
    tag: Tag;
    deleteFrom: null | number;
    deleteTo: null | number;
    insert: null | string;
    rangesArr: Range[] | null;
    proposedReturn: Range | null;
}
interface Opts {
    ignoreTags: string[];
    onlyStripTags: string[];
    stripTogetherWithTheirContents: string[];
    skipHtmlDecoding: boolean;
    trimOnlySpaces: boolean;
    dumpLinkHrefsNearby: {
        enabled: boolean;
        putOnNewLine: boolean;
        wrapHeads: string;
        wrapTails: string;
    };
    cb: null | ((cbObj: Partial<CbObj>) => void);
}
declare const defaults: {
    ignoreTags: never[];
    onlyStripTags: never[];
    stripTogetherWithTheirContents: string[];
    skipHtmlDecoding: boolean;
    trimOnlySpaces: boolean;
    dumpLinkHrefsNearby: {
        enabled: boolean;
        putOnNewLine: boolean;
        wrapHeads: string;
        wrapTails: string;
    };
    cb: null;
};
interface Res {
    log: {
        timeTakenInMilliseconds: number;
    };
    result: string;
    ranges: RangesType;
    allTagLocations: [number, number][];
    filteredTagLocations: [number, number][];
}
declare function stripHtml(str: string, originalOpts?: Partial<Opts>): Res;
export { stripHtml, defaults, version };
