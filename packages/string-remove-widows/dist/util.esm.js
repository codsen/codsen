const rawnbsp = "\u00A0";
const encodedNbspHtml = "&nbsp;";
const encodedNbspCss = "\\00A0";
const encodedNbspJs = "\\u00A0";
const rawNdash = "\u2013";
const encodedNdashHtml = "&ndash;";
const encodedNdashCss = "\\2013";
const encodedNdashJs = "\\u2013";
const rawMdash = "\u2014";
const encodedMdashHtml = "&mdash;";
const encodedMdashCss = "\\2014";
const encodedMdashJs = "\\u2014";
const headsAndTailsJinja = [
  {
    heads: "{{",
    tails: "}}"
  },
  {
    heads: ["{% if", "{%- if"],
    tails: ["{% endif", "{%- endif"]
  },
  {
    heads: ["{% for", "{%- for"],
    tails: ["{% endfor", "{%- endfor"]
  },
  {
    heads: ["{%", "{%-"],
    tails: ["%}", "-%}"]
  },
  {
    heads: "{#",
    tails: "#}"
  }
];
const headsAndTailsHugo = [
  {
    heads: "{{",
    tails: "}}"
  }
];
const headsAndTailsHexo = [
  {
    heads: ["<%", "<%=", "<%-"],
    tails: ["%>", "=%>", "-%>"]
  }
];

export { encodedMdashCss, encodedMdashHtml, encodedMdashJs, encodedNbspCss, encodedNbspHtml, encodedNbspJs, encodedNdashCss, encodedNdashHtml, encodedNdashJs, headsAndTailsHexo, headsAndTailsHugo, headsAndTailsJinja, rawMdash, rawNdash, rawnbsp };
