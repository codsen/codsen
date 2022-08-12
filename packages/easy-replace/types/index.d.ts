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
declare function er(source: string, opts: Opts, replacement: string): string;

export { Opts, er, version };
