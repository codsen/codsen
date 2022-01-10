interface Opts {
  html: boolean;
  css: boolean;
  text: boolean;
  templatingTags: boolean;
  js: boolean;
  reportProgressFunc: null | ((percDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
}
interface Res {
  log: {
    timeTakenInMilliseconds: number;
  };
  result: string;
  applicableOpts: {
    html: boolean;
    css: boolean;
    text: boolean;
    templatingTags: boolean;
    js: boolean;
  };
  templatingLang: {
    name: null | string;
  };
}
declare const defaultOpts: Opts;

declare const version: string;
/**
 * Extracts or deletes HTML, CSS, text and/or templating tags from string
 */
declare function stri(input: string, originalOpts?: Partial<Opts>): Res;

export { defaultOpts as defaults, stri, version };
