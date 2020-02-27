import { matchRight } from "string-match-left-right";
import { right } from "string-left-right";
const BACKSLASH = "\u005C";
const knownHtmlTags = [
  "a",
  "abbr",
  "acronym",
  "address",
  "applet",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "basefont",
  "bdi",
  "bdo",
  "big",
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
  "dir",
  "div",
  "dl",
  "doctype", // matching is not case-sensitive and we skip ! and slashes
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "font",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h1 - h6",
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
  "i",
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
  "noframes",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rb",
  "rp",
  "rt",
  "rtc",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "slot",
  "small",
  "source",
  "span",
  "strike",
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
  "tt",
  "u",
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

function isOpening(str, idx = 0, originalOpts) {
  console.log(
    `152 ${`\u001b[${33}m${`idx`}\u001b[${39}m`} = ${`\u001b[${31}m${idx}\u001b[${39}m`}, "${
      str[idx]
    }"`
  );

  const defaults = {
    allowCustomTagNames: false
  };
  const opts = Object.assign({}, defaults, originalOpts);

  // =======

  const whitespaceChunk = `[\\\\ \\t\\r\\n/]*`;

  // generalChar does not include the dash, -
  const generalChar = `._a-z0-9\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\uFFFF`;

  // =======
  // r1. tag without attributes
  // for example <br>, <br/>
  const r1 = new RegExp(`^<${whitespaceChunk}\\w+${whitespaceChunk}>`, "g");
  // its custom-html tag version:
  const r5 = new RegExp(
    `^<${whitespaceChunk}[${generalChar}]+[-${generalChar}]*${whitespaceChunk}>`,
    "g"
  );
  // to anybody who wonders, the \u2070-\uFFFF covers all the surrogates
  // of which emoji can be assembled. This is a very rough match, aiming to
  // catch as much as possible, not the validation-level match.
  // If you put bunch of opening surrogates in a sequence, for example,
  // this program would still match them positively. It's to catch all emoji,
  // including future, new-fangled emoji.

  // =======
  // r2. tag with one healthy attribute (no closing slash or whatever follow afterwards is matched)
  const r2 = new RegExp(`^<\\s*\\w+\\s+\\w+(?:-\\w+)?\\s*=\\s*['"\\w]`, "g");
  // its custom-html tag version:
  const r6 = new RegExp(
    `^<\\s*\\w+\\s+[${generalChar}]+[-${generalChar}]*(?:-\\w+)?\\s*=\\s*['"\\w]`
  );

  // =======
  // r3. closing/self-closing tags
  const r3 = new RegExp(`^<\\s*\\/?\\s*\\w+\\s*\\/?\\s*>`, "g");
  // its custom-html tag version:
  const r7 = new RegExp(
    `^<\\s*\\/?\\s*[${generalChar}]+[-${generalChar}]*\\s*\\/?\\s*>`,
    "g"
  );

  // =======
  // r4. opening tag with attributes,
  const r4 = new RegExp(
    `^<${whitespaceChunk}\\w+(?:\\s*\\w+)*\\s*\\w+=['"]`,
    "g"
  );
  // its custom-html tag version:
  const r8 = new RegExp(
    `^<${whitespaceChunk}[${generalChar}]+[-${generalChar}]*(?:\\s*\\w+)*\\s*\\w+=['"]`,
    "g"
  );

  // =======
  const whatToTest = idx ? str.slice(idx) : str;
  let passed = false;

  if (opts.allowCustomTagNames) {
    console.log(`219 inside opts.allowCustomTagNames clauses`);
    if (r5.test(whatToTest)) {
      console.log(`221 ${`\u001b[${31}m${`R5`}\u001b[${39}m`} passed`);
      passed = true;
    } else if (r6.test(whatToTest)) {
      console.log(`224 ${`\u001b[${31}m${`R6`}\u001b[${39}m`} passed`);
      passed = true;
    } else if (r7.test(whatToTest)) {
      console.log(`227 ${`\u001b[${31}m${`R7`}\u001b[${39}m`} passed`);
      passed = true;
    } else if (r8.test(whatToTest)) {
      console.log(`230 ${`\u001b[${31}m${`R8`}\u001b[${39}m`} passed`);
      passed = true;
    }
  } else {
    console.log(`234 outside opts.allowCustomTagNames clauses`);
    if (r1.test(whatToTest)) {
      console.log(`236 ${`\u001b[${31}m${`R1`}\u001b[${39}m`} passed`);
      passed = true;
    } else if (r2.test(whatToTest)) {
      console.log(`239 ${`\u001b[${31}m${`R2`}\u001b[${39}m`} passed`);
      passed = true;
    } else if (r3.test(whatToTest)) {
      console.log(`242 ${`\u001b[${31}m${`R3`}\u001b[${39}m`} passed`);
      passed = true;
    } else if (r4.test(whatToTest)) {
      console.log(`245 ${`\u001b[${31}m${`R4`}\u001b[${39}m`} passed`);
      passed = true;
    }
  }

  // applicable for both
  if (
    !passed &&
    str[idx] === "<" &&
    str[idx + 1] &&
    ((["/", BACKSLASH].includes(str[idx + 1]) &&
      matchRight(str, idx + 1, knownHtmlTags, {
        cb: isNotLetter,
        i: true
      })) ||
      (!isNotLetter(str[idx + 1]) &&
        matchRight(str, idx, knownHtmlTags, {
          cb: isNotLetter,
          i: true,
          trimCharsBeforeMatching: ["/", BACKSLASH, "!", " ", "\t", "\n", "\r"]
        })) ||
      (isNotLetter(str[idx + 1]) &&
        matchRight(str, idx, knownHtmlTags, {
          // enhanced isNotLetter()
          cb: (char, theRemainderOfTheString, indexOfTheFirstOutsideChar) => {
            return (
              (char === undefined ||
                (char.toUpperCase() === char.toLowerCase() &&
                  !`0123456789`.includes(char))) &&
              (str[right(str, indexOfTheFirstOutsideChar - 1)] === "/" ||
                str[right(str, indexOfTheFirstOutsideChar - 1)] === ">")
            );
          },
          i: true,
          trimCharsBeforeMatching: ["/", BACKSLASH, "!", " ", "\t", "\n", "\r"]
        })))
  ) {
    passed = true;
  }

  console.log(
    `286 ${`\u001b[${33}m${`passed`}\u001b[${39}m`} = ${JSON.stringify(
      passed,
      null,
      4
    )}`
  );

  //
  console.log(
    `295 ${`\u001b[${33}m${`isNotLetter(str[${idx +
      1}])`}\u001b[${39}m`} = ${JSON.stringify(
      isNotLetter(str[idx + 1]),
      null,
      4
    )}`
  );
  const res = isStr(str) && idx < str.length && passed;
  console.log(`303 return ${`\u001b[${36}m${res}\u001b[${39}m`}`);
  return res;
}

export default isOpening;
