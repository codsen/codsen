import { Ranges } from "ranges-apply";
export { Range, Ranges } from "ranges-apply";

declare const version: string;
interface Opts {
  from: number;
  to?: number;
  value?: string;
  convertEntities?: boolean;
  convertApostrophes?: boolean;
  offsetBy?: (amount: number) => void;
}
declare const defaults: {
  convertEntities: boolean;
  convertApostrophes: boolean;
};
declare function convertOne(str: string, opts: Opts): Ranges;
interface convertAllRes {
  result: string;
  ranges: Ranges;
}
/**
 * Typographically-correct the apostrophes and single/double quotes
 */
declare function convertAll(str: string, opts?: Partial<Opts>): convertAllRes;

export { convertAll, convertOne, defaults, version };
export type { Opts };
