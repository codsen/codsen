import { EolSetting } from "codsen-utils";

interface Opts {
  fixBrokenEntities: boolean;
  removeWidows: boolean;
  convertEntities: boolean;
  convertDashes: boolean;
  convertApostrophes: boolean;
  replaceLineBreaks: boolean;
  removeLineBreaks: boolean;
  useXHTML: boolean;
  dontEncodeNonLatin: boolean;
  addMissingSpaces: boolean;
  convertDotsToEllipsis: boolean;
  stripHtml: boolean;
  eol: EolSetting;
  stripHtmlButIgnoreTags: string[];
  stripHtmlAddNewLine: string[];
  cb: null | ((str: string) => string);
}
declare const defaultOpts: Opts;
interface ApplicableOpts {
  fixBrokenEntities: boolean;
  removeWidows: boolean;
  convertEntities: boolean;
  convertDashes: boolean;
  convertApostrophes: boolean;
  replaceLineBreaks: boolean;
  removeLineBreaks: boolean;
  useXHTML: boolean;
  dontEncodeNonLatin: boolean;
  addMissingSpaces: boolean;
  convertDotsToEllipsis: boolean;
  stripHtml: boolean;
  eol: boolean;
}
interface Res {
  res: string;
  applicableOpts: ApplicableOpts;
}

declare const version: string;
/**
 * Extracts, cleans and encodes text
 */
declare function det(str: string, opts?: Partial<Opts>): Res;

export { det, defaultOpts as opts, version };
export type { Opts, Res };
