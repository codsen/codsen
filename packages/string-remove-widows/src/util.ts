// consts
export const encodedNbspHtml = "&nbsp;";
export const encodedNbspCss = "\\00A0";
export const encodedNbspJs = "\\u00A0";

export const encodedNdashHtml = "&ndash;";
export const encodedNdashCss = "\\2013";
export const encodedNdashJs = "\\u2013";

export const encodedMdashHtml = "&mdash;";
export const encodedMdashCss = "\\2014";
export const encodedMdashJs = "\\u2014";

const headsAndTailsJinja = [
  {
    heads: "{{",
    tails: "}}",
  },
  {
    heads: ["{% if", "{%- if"],
    tails: ["{% endif", "{%- endif"],
  },
  {
    heads: ["{% for", "{%- for"],
    tails: ["{% endfor", "{%- endfor"],
  },
  {
    heads: ["{%", "{%-"],
    tails: ["%}", "-%}"],
  },
  {
    heads: "{#",
    tails: "#}",
  },
];

const headsAndTailsHugo = [
  {
    heads: "{{",
    tails: "}}",
  },
];

const headsAndTailsHexo = [
  {
    heads: ["<%", "<%=", "<%-"],
    tails: ["%>", "=%>", "-%>"],
  },
];

const knownHTMLTags = [
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "base",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "doctype",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "math",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "param",
  "picture",
  "pre",
  "progress",
  "rb",
  "rp",
  "rt",
  "rtc",
  "ruby",
  "samp",
  "script",
  "section",
  "select",
  "slot",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "svg",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "ul",
  "var",
  "video",
  "wbr",
  "xml",
];

// finally,
export {
  headsAndTailsJinja,
  headsAndTailsHugo,
  headsAndTailsHexo,
  knownHTMLTags,
};
