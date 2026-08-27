import { version as v } from "../package.json";

const version: string = v;

function emptyCondCommentRegex(): RegExp {
  return /(?:<!\[if[\t\n\f\r ][^<\]]*\]>[\t\n\f\r ]*<!\[endif\]>(?!--)|<!--\[if[\t\n\f\r ][^<\]]*\]>(?:[\t\n\f\r ]*<!\[endif\]-->|<!--(?:>| -->)[\t\n\f\r ]*<!--<!\[endif\]-->))/gi;
}

export { emptyCondCommentRegex, version };
