import { Ranges } from "ranges-apply";
export { Range, Ranges } from "ranges-apply";

declare const version: string;
interface Opts {
  from: number;
  to?: number;
  value?: string;
  convertEntities?: boolean;
  convertDashes?: boolean;
  offsetBy?: (amount: number) => void;
}
declare const defaults: {
  convertEntities: boolean;
  convertDashes: boolean;
};
declare function convertOne(str: string, opts: Opts): Ranges;
interface convertAllRes {
  result: string;
  ranges: Ranges;
}
/**
 * Typographically-correct the hyphens and dashes
 */
declare function convertAll(str: string, opts?: Partial<Opts>): convertAllRes;

export { Opts, convertAll, convertOne, defaults, version };
