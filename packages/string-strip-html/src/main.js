import replaceSlicesArr from "string-replace-slices-array";
import Slices from "string-slices-array-push";
import isObj from "lodash.isplainobject";
import checkTypes from "check-types-mini";

function stripHtml(str, originalOpts) {
  // constants
  // ===========================================================================
  const isArr = Array.isArray;
  const definitelyTagNames = [
    "!doctype",
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
  const singleLetterTags = ["a", "b", "i", "p", "q", "s", "u"];
  const suspiciousList = ["="];
  const punctuation = [".", ",", "!", "?", ";", ")", "\u2026", '"']; // \u2026 is &hellip; - ellipsis
  const stripTogetherWithTheirContentsDefaults = ["script", "style", "xml"];

  const rangesToDelete = new Slices({ limitToBeAddedWhitespace: true });

  // variables
  // ===========================================================================

  // records the info about the suspected tag:
  let tag = {};

  // records the beginning of the current whitespace chunk:
  let chunkOfWhitespaceStartsAt = null;

  // we'll gather opening tags from ranged-pairs here:
  const rangedOpeningTags = [];

  // validation
  // ===========================================================================
  if (typeof str !== "string") {
    throw new TypeError(
      `string-strip-html/stripHtml(): [THROW_ID_01] Input must be string! Currently it's: ${typeof str}, equal to:\n${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  }
  if (
    originalOpts !== undefined &&
    originalOpts !== null &&
    !isObj(originalOpts)
  ) {
    throw new TypeError(
      `string-strip-html/stripHtml(): [THROW_ID_02] Optional Options Object must be a plain object! Currently it's: ${typeof originalOpts}, equal to:\n${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }

  // prep opts
  // ===========================================================================
  const defaults = {
    ignoreTags: [],
    stripOnlyTags: [],
    stripTogetherWithTheirContents: stripTogetherWithTheirContentsDefaults,
    keepHtmlCommentContents: false,
    deleteWhitespaceAroundTags: true
  };
  const opts = Object.assign({}, defaults, originalOpts);
  if (!opts.stripTogetherWithTheirContents) {
    opts.stripTogetherWithTheirContents = [];
  } else if (
    typeof opts.stripTogetherWithTheirContents === "string" &&
    opts.stripTogetherWithTheirContents.length > 0
  ) {
    opts.stripTogetherWithTheirContents = [opts.stripTogetherWithTheirContents];
  }
  checkTypes(opts, defaults, {
    msg: "string-strip-html/stripHtml(): [THROW_ID_03*]",
    schema: {
      stripTogetherWithTheirContents: ["array", "null", "undefined"]
    }
  });
  if (!isArr(opts.stripTogetherWithTheirContents)) {
    // means either null or undefined
    opts.stripTogetherWithTheirContents = [];
  }

  const somethingCaught = {};
  if (
    opts.stripTogetherWithTheirContents &&
    isArr(opts.stripTogetherWithTheirContents) &&
    opts.stripTogetherWithTheirContents.length > 0 &&
    !opts.stripTogetherWithTheirContents.every((el, i) => {
      if (!(typeof el === "string")) {
        somethingCaught.el = el;
        somethingCaught.i = i;
        return false;
      }
      return true;
    })
  ) {
    throw new TypeError(
      `string-strip-html/stripHtml(): [THROW_ID_04] Optional Options Object's key stripTogetherWithTheirContents was set to contain not just string elements! For example, element at index ${
        somethingCaught.i
      } has a value ${
        somethingCaught.el
      } which is not string but ${typeof somethingCaught.el}.`
    );
  }

  console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");

  // step 0.
  // ===========================================================================
  // End sooner if it's an empty or empty-ish string:

  if (str === "" || str.trim() === "") {
    console.log("ENDING EARLY, empty input");
    return str;
  }

  // step 1.
  // ===========================================================================

  for (let i = 0, len = str.length; i < len; i++) {
    console.log(
      `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${`\u001b[${31}m${
        str[i].trim() === ""
          ? str[i] === null
            ? "null"
            : str[i] === "\n"
              ? "line break"
              : str[i] === "\t"
                ? "tab"
                : "space"
          : str[i]
      }\u001b[${39}m`}`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m`
    );

    // catch closing bracket
    // -------------------------------------------------------------------------
    if (str[i] === ">") {
      if (tag.lastOpeningBracketAt !== undefined) {
        tag.lastClosingBracketAt = i;
        console.log(
          `255 SET tag.lastClosingBracketAt = ${tag.lastClosingBracketAt}`
        );
      }
    }

    // catch the ending of the tag
    // -------------------------------------------------------------------------
    // the tag is "released" into "replaceSlicesArr":

    if (tag.lastOpeningBracketAt !== undefined) {
      if (tag.lastClosingBracketAt === undefined) {
        if (str[i + 1] === undefined || str[i + 1] === "<") {
          // case 1. closing bracket hasn't been encountered yet but EOL is reached
          // for example "<script" or "<script  "
          console.log(
            `272 \u001b[${33}m${`SUBMIT RANGE #1: [${
              tag.leftOuterWhitespace
            },${i + 1}]`}\u001b[${39}m`
          );
          rangesToDelete.push(
            tag.leftOuterWhitespace,
            i + 1,
            str.slice(tag.leftOuterWhitespace, i + 1).includes("\n")
              ? "\n"
              : " "
          );
        }
      } else if (
        (i > tag.lastClosingBracketAt && str[i].trim().length !== 0) ||
        str[i + 1] === undefined
      ) {
        // tag.lastClosingBracketAt !== undefined

        // case 2. closing bracket HAS BEEN met
        // we'll look for a non-whitespace character and delete up to it
        // BUT, we'll wipe the tag object only if that non-whitespace character
        // is not a ">". This way we'll catch and delete sequences of closing brackets.

        // part 1.
        console.log(
          `294 \u001b[${33}m${`SUBMIT RANGE #2: [${tag.leftOuterWhitespace},${
            tag.lastClosingBracketAt === i ? i + 1 : i
          }]`}\u001b[${39}m`
        );
        rangesToDelete.push(
          tag.leftOuterWhitespace,
          tag.lastClosingBracketAt === i ? i + 1 : i,
          str.slice(tag.leftOuterWhitespace, i).includes("\n") ? "\n" : " "
        );
        // part 2.
        if (str[i] !== ">") {
          console.log(`305 \u001b[${33}m${`RESET tag{}`}\u001b[${39}m`);
          tag = {};
        }
      }
    }

    // catch opening bracket
    // -------------------------------------------------------------------------
    if (str[i] === "<" && tag.lastOpeningBracketAt === undefined) {
      tag.lastOpeningBracketAt = i;
      tag.slashPresent = false;
      tag.leftOuterWhitespace =
        chunkOfWhitespaceStartsAt === null ? i : chunkOfWhitespaceStartsAt;
      console.log(
        `319 SET \u001b[${33}m${`tag.leftOuterWhitespace`}\u001b[${39}m = ${
          tag.leftOuterWhitespace
        }; \u001b[${33}m${`tag.lastOpeningBracketAt`}\u001b[${39}m = ${
          tag.lastOpeningBracketAt
        }; \u001b[${33}m${`tag.slashPresent`}\u001b[${39}m = false`
      );
    }

    // catch slash
    // -------------------------------------------------------------------------
    if (
      str[i] === "/" &&
      tag.lastOpeningBracketAt !== undefined &&
      tag.lastClosingBracketAt === undefined
    ) {
      console.log(`334 \u001b[${33}m${`tag.slashPresent`}\u001b[${39}m = true`);
      tag.slashPresent = true;
    }

    // catch whitespace
    // -------------------------------------------------------------------------
    if (str[i].trim() === "") {
      // 1. catch chunk boundaries:
      if (chunkOfWhitespaceStartsAt === null) {
        chunkOfWhitespaceStartsAt = i;
        console.log(
          `345 SET \u001b[${33}m${`chunkOfWhitespaceStartsAt`}\u001b[${39}m = ${chunkOfWhitespaceStartsAt}`
        );
      }
    } else if (chunkOfWhitespaceStartsAt !== null) {
      chunkOfWhitespaceStartsAt = null;
      console.log(
        `351 SET \u001b[${33}m${`chunkOfWhitespaceStartsAt`}\u001b[${39}m = ${chunkOfWhitespaceStartsAt}`
      );
    }

    // catch ending of the tag name:
    // -------------------------------------------------------------------------
    if (
      tag.nameStarts !== undefined &&
      tag.nameEnds === undefined &&
      (str[i].trim().length === 0 ||
        str[i] === "/" ||
        str[i] === "<" ||
        str[i] === ">" ||
        (str[i].trim().length !== 0 && str[i + 1] === undefined))
    ) {
      // 1. mark the name ending
      tag.nameEnds = i;
      console.log(
        `369 SET \u001b[${33}m${`tag.nameEnds`}\u001b[${39}m = ${tag.nameEnds}`
      );
      // 2. extract the full name string
      tag.name = str.slice(tag.nameStarts, tag.nameEnds);
      console.log(
        `374 SET \u001b[${33}m${`tag.name`}\u001b[${39}m = ${tag.name}`
      );
      // 3. check, is it a range tag
      if (opts.stripTogetherWithTheirContents.includes(tag.name)) {
        // it depends, is it opening or closing range tag:
        if (tag.slashPresent) {
          // closing tag.
          // filter and remove the found tag
          for (let y = rangedOpeningTags.length; y--; ) {
            if (rangedOpeningTags[y].name === tag.name) {
              // we'll remove from opening tag's opening bracket to closing tag's
              // closing bracket because whitespace will be taken care of separately,
              // when tags themselves will be removed.
              // Basically, for each range tag there will be 3 removals:
              // opening tag, closing tag and all from opening to closing tag.
              // We keep removing opening and closing tags along whole range
              // because of few reasons: 1. cases of broken/dirty code, 2. keeping
              // the algorithm simpler, 3. opts that control whitespace removal
              // around tags.

              // 1. add range without caring about surrounding whitespace around
              // the range
              console.log(
                `391 ABOUT TO PUSH: [${
                  rangedOpeningTags[y].lastOpeningBracketAt
                }, ${i}]`
              );
              rangesToDelete.push(rangedOpeningTags[y].lastOpeningBracketAt, i);
              // 2. delete the reference to this range from rangedOpeningTags[]
              // because there might be more ranged tags of the same name or
              // different, overlapping or encompassing ranged tags with same
              // or different name.
              rangedOpeningTags.splice(y, 1);
              console.log(
                `401 new \u001b[${33}m${`rangedOpeningTags`}\u001b[${39}m = ${JSON.stringify(
                  rangedOpeningTags,
                  null,
                  4
                )}`
              );
              // 3. stop the loop
              break;
            }
          }
        } else {
          // opening tag.
          rangedOpeningTags.push(tag);
          console.log(
            `416 pushed tag{} to \u001b[${33}m${`rangedOpeningTags`}\u001b[${39}m\nwhich is now equal to:\n${JSON.stringify(
              rangedOpeningTags,
              null,
              4
            )}`
          );
        }
      }
    }

    // catch character that follows opening bracket:
    // -------------------------------------------------------------------------
    if (
      tag.lastOpeningBracketAt !== null &&
      tag.lastOpeningBracketAt < i &&
      str[i] !== "/" // there can be closing slashes in various places, legit and not
    ) {
      // 1. identify, is it definite or just plausible tag
      if (tag.onlyPlausible === undefined) {
        if (str[i].trim().length === 0) {
          tag.onlyPlausible = true;
        } else {
          tag.onlyPlausible = false;
        }
        console.log(
          `441 SET \u001b[${33}m${`tag.onlyPlausible`}\u001b[${39}m = ${
            tag.onlyPlausible
          }`
        );
      }
      // 2. catch the beginning of the tag name. Consider custom HTML tag names
      // and also known (X)HTML tags:
      if (str[i].trim().length !== 0 && tag.nameStarts === undefined) {
        tag.nameStarts = i;
        console.log(
          `451 \u001b[${33}m${`tag.nameStarts`}\u001b[${39}m = ${
            tag.nameStarts
          }`
        );
      }
    }

    // log all
    // -------------------------------------------------------------------------
    console.log(
      `\u001b[${32}m${` - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`}\u001b[${39}m`
    );
    console.log(
      `${`\u001b[${35}m${`tag`}\u001b[${39}m`} = ${JSON.stringify(
        tag,
        null,
        4
      )}`
    );
    if (rangesToDelete.current()) {
      console.log(
        `RANGES:\n${JSON.stringify(rangesToDelete.current(), null, 0)}`
      );
    }
    // console.log(
    //   `${`\u001b[${35}m${`chunkOfWhitespaceStartsAt`}\u001b[${39}m`} = ${chunkOfWhitespaceStartsAt}`
    // );
  }

  if (rangesToDelete.current()) {
    return replaceSlicesArr(str, rangesToDelete.current()).trim();
  }
  return str;
}

export default stripHtml;
