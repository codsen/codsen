declare const rawnbsp = "\u00A0";
declare const encodedNbspHtml = "&nbsp;";
declare const encodedNbspCss = "\\00A0";
declare const encodedNbspJs = "\\u00A0";
declare const rawNdash = "\u2013";
declare const encodedNdashHtml = "&ndash;";
declare const encodedNdashCss = "\\2013";
declare const encodedNdashJs = "\\u2013";
declare const rawMdash = "\u2014";
declare const encodedMdashHtml = "&mdash;";
declare const encodedMdashCss = "\\2014";
declare const encodedMdashJs = "\\u2014";
declare const headsAndTailsJinja: (
  | {
      heads: string;
      tails: string;
    }
  | {
      heads: string[];
      tails: string[];
    }
)[];
declare const headsAndTailsHugo: {
  heads: string;
  tails: string;
}[];
declare const headsAndTailsHexo: {
  heads: string[];
  tails: string[];
}[];
declare const knownHTMLTags: string[];
export {
  rawnbsp,
  encodedNbspHtml,
  encodedNbspCss,
  encodedNbspJs,
  rawNdash,
  encodedNdashHtml,
  encodedNdashCss,
  encodedNdashJs,
  rawMdash,
  encodedMdashHtml,
  encodedMdashCss,
  encodedMdashJs,
  headsAndTailsJinja,
  headsAndTailsHugo,
  headsAndTailsHexo,
  knownHTMLTags,
};
