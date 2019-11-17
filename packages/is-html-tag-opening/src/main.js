import { matchRight } from "string-match-left-right";

const knownHtmlTags = [
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
  "xml"
];

function isStr(something) {
  return typeof something === "string";
}
function isNotLetter(char) {
  return (
    char === undefined ||
    (char.toUpperCase() === char.toLowerCase() && !`0123456789`.includes(char))
  );
}

function isOpening(str, idx = 0) {
  console.log(
    `132 ${`\u001b[${33}m${`idx`}\u001b[${39}m`} = ${`\u001b[${31}m${idx}\u001b[${39}m`}`
  );
  console.log(`134 idx = ${idx}`);

  // r1. tag without attributes
  // for example <br>, <br/>
  const r1 = /^<\s*\w+\s*\/?\s*>/g;

  // r2. tag with one healthy attribute (no closing slash or whatever follow afterwards is matched)
  const r2 = /^<\s*\w+\s+\w+\s*=\s*['"]/g;

  // r3. closing/self-closing tags
  const r3 = /^<\s*\/?\s*\w+\s*\/?\s*>/g;

  // r4. opening tag with attributes,
  const r4 = /^<\s*\w+(?:\s*\w+)*\s*\w+=['"]/g;

  const whatToTest = idx ? str.slice(idx) : str;
  let passed = false;
  if (r1.test(whatToTest)) {
    console.log(`152 ${`\u001b[${31}m${`R1`}\u001b[${39}m`} passed`);
    passed = true;
  } else if (r2.test(whatToTest)) {
    console.log(`155 ${`\u001b[${31}m${`R2`}\u001b[${39}m`} passed`);
    passed = true;
  } else if (r3.test(whatToTest)) {
    console.log(`158 ${`\u001b[${31}m${`R3`}\u001b[${39}m`} passed`);
    passed = true;
  } else if (r4.test(whatToTest)) {
    console.log(`161 ${`\u001b[${31}m${`R4`}\u001b[${39}m`} passed`);
    passed = true;
  } else if (
    str[idx] === "<" &&
    str[idx + 1] &&
    str[idx + 1].trim().length &&
    matchRight(str, idx, knownHtmlTags, { cb: isNotLetter })
  ) {
    passed = true;
  }
  const res = isStr(str) && idx < str.length && passed;
  console.log(`172 return ${`\u001b[${36}m${res}\u001b[${39}m`}`);
  return res;
}

export default isOpening;
