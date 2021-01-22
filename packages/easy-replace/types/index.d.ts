declare const version: string;
interface Opts {
    leftOutsideNot: string | string[];
    leftOutside: string | string[];
    leftMaybe: string | string[];
    searchFor: string | string[];
    rightMaybe: string | string[];
    rightOutside: string | string[];
    rightOutsideNot: string | string[];
    i: {
        leftOutsideNot: boolean;
        leftOutside: boolean;
        leftMaybe: boolean;
        searchFor: boolean;
        rightMaybe: boolean;
        rightOutside: boolean;
        rightOutsideNot: boolean;
    };
}
declare function er(originalSource: string, options: Opts, originalReplacement: string): string;

export { er, version };
