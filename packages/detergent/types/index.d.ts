declare type EndOfLine = "lf" | "crlf" | "cr";
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
  eol: EndOfLine;
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

export { Opts, Res, det, defaultOpts as opts, version };
