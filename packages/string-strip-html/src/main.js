import replaceSlicesArr from "string-replace-slices-array";
import Slices from "string-slices-array-push";
import isObj from "lodash.isplainobject";
import checkTypes from "check-types-mini";
import ent from "ent";

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

  // temporary variable to assemble the attribute pieces:
  let attrObj = {};

  // functions
  // ===========================================================================

  function isValidAttributeCharacter(char) {
    // https://html.spec.whatwg.org/multipage/syntax.html#attributes-2

    if (char.charCodeAt(0) >= 0 && char.charCodeAt(0) <= 31) {
      // C0 CONTROLS
      return false;
    } else if (char.charCodeAt(0) >= 127 && char.charCodeAt(0) <= 159) {
      // U+007F DELETE to U+009F APPLICATION PROGRAM COMMAND
      return false;
    } else if (char.charCodeAt(0) === 32) {
      // U+0020 SPACE
      return false;
    } else if (char.charCodeAt(0) === 34) {
      // U+0022 (")
      return false;
    } else if (char.charCodeAt(0) === 39) {
      // U+0027 (')
      return false;
    } else if (char.charCodeAt(0) === 62) {
      // U+003E (>)
      return false;
    } else if (char.charCodeAt(0) === 47) {
      // U+002F (/)
      return false;
    } else if (char.charCodeAt(0) === 61) {
      // U+003D (=)
      return false;
    } else if (
      // noncharacter:
      // https://infra.spec.whatwg.org/#noncharacter
      (char.charCodeAt(0) >= 64976 && char.charCodeAt(0) <= 65007) || // U+FDD0 to U+FDEF, inclusive,
      char.charCodeAt(0) === 65534 || // or U+FFFE,
      char.charCodeAt(0) === 65535 || // U+FFFF,
      (char.charCodeAt(0) === 55359 && char.charCodeAt(1) === 57342) || // U+1FFFE, or \uD83F\uDFFE
      (char.charCodeAt(0) === 55359 && char.charCodeAt(1) === 57343) || // U+1FFFF, or \uD83F\uDFFF
      (char.charCodeAt(0) === 55423 && char.charCodeAt(1) === 57342) || // U+2FFFE, or \uD87F\uDFFE
      (char.charCodeAt(0) === 55423 && char.charCodeAt(1) === 57343) || // U+2FFFF, or \uD87F\uDFFF
      (char.charCodeAt(0) === 55487 && char.charCodeAt(1) === 57342) || // U+3FFFE, or \uD8BF\uDFFE
      (char.charCodeAt(0) === 55487 && char.charCodeAt(1) === 57343) || // U+3FFFF, or \uD8BF\uDFFF
      (char.charCodeAt(0) === 55551 && char.charCodeAt(1) === 57342) || // U+4FFFE, or \uD8FF\uDFFE
      (char.charCodeAt(0) === 55551 && char.charCodeAt(1) === 57343) || // U+4FFFF, or \uD8FF\uDFFF
      (char.charCodeAt(0) === 55615 && char.charCodeAt(1) === 57342) || // U+5FFFE, or \uD93F\uDFFE
      (char.charCodeAt(0) === 55615 && char.charCodeAt(1) === 57343) || // U+5FFFF, or \uD93F\uDFFF
      (char.charCodeAt(0) === 55679 && char.charCodeAt(1) === 57342) || // U+6FFFE, or \uD97F\uDFFE
      (char.charCodeAt(0) === 55679 && char.charCodeAt(1) === 57343) || // U+6FFFF, or \uD97F\uDFFF
      (char.charCodeAt(0) === 55743 && char.charCodeAt(1) === 57342) || // U+7FFFE, or \uD9BF\uDFFE
      (char.charCodeAt(0) === 55743 && char.charCodeAt(1) === 57343) || // U+7FFFF, or \uD9BF\uDFFF
      (char.charCodeAt(0) === 55807 && char.charCodeAt(1) === 57342) || // U+8FFFE, or \uD9FF\uDFFE
      (char.charCodeAt(0) === 55807 && char.charCodeAt(1) === 57343) || // U+8FFFF, or \uD9FF\uDFFF
      (char.charCodeAt(0) === 55871 && char.charCodeAt(1) === 57342) || // U+9FFFE, or \uDA3F\uDFFE
      (char.charCodeAt(0) === 55871 && char.charCodeAt(1) === 57343) || // U+9FFFF, or \uDA3F\uDFFF
      (char.charCodeAt(0) === 55935 && char.charCodeAt(1) === 57342) || // U+AFFFE, or \uDA7F\uDFFE
      (char.charCodeAt(0) === 55935 && char.charCodeAt(1) === 57343) || // U+AFFFF, or \uDA7F\uDFFF
      (char.charCodeAt(0) === 55999 && char.charCodeAt(1) === 57342) || // U+BFFFE, or \uDABF\uDFFE
      (char.charCodeAt(0) === 55999 && char.charCodeAt(1) === 57343) || // U+BFFFF, or \uDABF\uDFFF
      (char.charCodeAt(0) === 56063 && char.charCodeAt(1) === 57342) || // U+CFFFE, or \uDAFF\uDFFE
      (char.charCodeAt(0) === 56063 && char.charCodeAt(1) === 57343) || // U+CFFFF, or \uDAFF\uDFFF
      (char.charCodeAt(0) === 56127 && char.charCodeAt(1) === 57342) || // U+DFFFE, or \uDB3F\uDFFE
      (char.charCodeAt(0) === 56127 && char.charCodeAt(1) === 57343) || // U+DFFFF, or \uDB3F\uDFFF
      (char.charCodeAt(0) === 56191 && char.charCodeAt(1) === 57342) || // U+EFFFE, or \uDB7F\uDFFE
      (char.charCodeAt(0) === 56191 && char.charCodeAt(1) === 57343) || // U+EFFFF, or \uDB7F\uDFFF
      (char.charCodeAt(0) === 56255 && char.charCodeAt(1) === 57342) || // U+FFFFE, or \uDBBF\uDFFE
      (char.charCodeAt(0) === 56255 && char.charCodeAt(1) === 57343) || // U+FFFFF, or \uDBBF\uDFFF
      (char.charCodeAt(0) === 56319 && char.charCodeAt(1) === 57342) || // U+10FFFE, or \uDBFF\uDFFE
      (char.charCodeAt(0) === 56319 && char.charCodeAt(1) === 57343) // U+10FFFF, or \uDBFF\uDFFF
    ) {
      return false;
    }
    return true;
  }

  function treatRangedTags(i) {
    if (opts.stripTogetherWithTheirContents.includes(tag.name)) {
      // it depends, is it opening or closing range tag:
      if (tag.slashPresent) {
        console.log(
          `152 \u001b[${31}m${`treatRangedTags():`}\u001b[${39}m closing ranged tag`
        );
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
              `rangesToDelete.current(): ${JSON.stringify(
                rangesToDelete.current(),
                null,
                0
              )}`
            );
            console.log(
              `391 ABOUT TO PUSH RANGE: [${
                rangedOpeningTags[y].lastOpeningBracketAt
              }, ${i}]`
            );
            if (punctuation.includes(str[i])) {
              rangesToDelete.push(
                rangedOpeningTags[y].lastOpeningBracketAt,
                i,
                null // null will remove any spaces added so far. Opening and closing range tags might
                // have received spaces as separate entities, but those might not be necessary for range:
                // "text <script>deleteme</script>."
              );
            } else {
              rangesToDelete.push(rangedOpeningTags[y].lastOpeningBracketAt, i);
            }
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
        console.log(
          `209 \u001b[${31}m${`treatRangedTags():`}\u001b[${39}m opening ranged tag`
        );
        rangedOpeningTags.push(tag);
        console.log(
          `212 pushed tag{} to \u001b[${33}m${`rangedOpeningTags`}\u001b[${39}m\nwhich is now equal to:\n${JSON.stringify(
            rangedOpeningTags,
            null,
            4
          )}`
        );
      }
    }
  }

  function calculateWhitespaceToInsert(str, currCharIdx, fromIdx, toIdx) {
    if (!punctuation.includes(str[currCharIdx - 1])) {
      return str.slice(fromIdx, toIdx).includes("\n") ? "\n" : " ";
    }
    return "";
  }

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
    deleteWhitespaceAroundTags: true,
    skipHtmlDecoding: false
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

  if (!opts.skipHtmlDecoding) {
    while (str !== ent.decode(str)) {
      str = ent.decode(str);
    }
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

    // catch slash
    // -------------------------------------------------------------------------
    if (
      str[i] === "/" &&
      !(tag.quotes && tag.quotes.value) &&
      tag.lastOpeningBracketAt !== undefined &&
      tag.lastClosingBracketAt === undefined
    ) {
      console.log(`429 \u001b[${33}m${`tag.slashPresent`}\u001b[${39}m = true`);
      tag.slashPresent = true;
    }

    // catch double or single quotes
    // -------------------------------------------------------------------------
    if (str[i] === '"' || str[i] === "'") {
      if (tag.quotes && tag.quotes.value && tag.quotes.value === str[i]) {
        // 1. finish assembling the "attrObj{}"
        attrObj.valueEnds = i;
        attrObj.value = str.slice(attrObj.valueStarts, i);
        console.log(
          `441 PUSHING ${`\u001b[${33}m${`attrObj`}\u001b[${39}m`} = ${JSON.stringify(
            attrObj,
            null,
            4
          )}`
        );
        if (!tag.attributes) {
          tag.attributes = [];
        }
        tag.attributes.push(attrObj);
        // reset:
        attrObj = {};
        // 2. finally, delete the quotes marker, we don't need it any more
        tag.quotes = undefined;
      } else if (!tag.quotes) {
        // 1. if it's opening marker, record the type and location of quotes
        tag.quotes = {};
        tag.quotes.value = str[i];
        tag.quotes.start = i;
        // 2. start assembling the attribute object which we'll dump into tag.attributes[] array:
        if (
          attrObj.nameStarts &&
          attrObj.nameEnds &&
          attrObj.nameEnds < i &&
          attrObj.nameStarts < i &&
          !attrObj.valueStarts
        ) {
          attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
          console.log(
            `471 SET ${`\u001b[${33}m${`attrObj`}\u001b[${39}m`} = ${JSON.stringify(
              attrObj,
              null,
              4
            )}`
          );
        }
      }
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
        `504 SET \u001b[${33}m${`tag.nameEnds`}\u001b[${39}m = ${tag.nameEnds}`
      );
      // 2. extract the full name string
      tag.name = str.slice(
        tag.nameStarts,
        tag.nameEnds + (str[i] !== ">" && str[i + 1] === undefined ? 1 : 0)
      );
      console.log(
        `512 SET \u001b[${33}m${`tag.name`}\u001b[${39}m = ${tag.name}`
      );
      // 3. if the input string ends here and it's not a dodgy tag, submit it for deletion:
      if (!tag.onlyPlausible && str[i + 1] === undefined) {
        console.log(
          `517 \u001b[${33}m${`SUBMIT RANGE #3: [${
            tag.leftOuterWhitespace
          }, ${i + 1}, ${calculateWhitespaceToInsert(
            str,
            i,
            tag.leftOuterWhitespace,
            i + 1
          )}]`}\u001b[${39}m`
        );
        rangesToDelete.push(
          tag.leftOuterWhitespace,
          i + 1,
          calculateWhitespaceToInsert(str, i, tag.leftOuterWhitespace, i + 1)
        );
        // also,
        treatRangedTags(i);
      }
    }

    // catch beginning of an attribute value
    // -------------------------------------------------------------------------
    if (
      tag.quotes &&
      tag.quotes.start &&
      tag.quotes.start < i &&
      !tag.quotes.end &&
      attrObj.nameEnds &&
      attrObj.equalsAt &&
      !attrObj.valueStarts
    ) {
      if (attrObj.valueEnds) {
        // TODO - freak out
        console.log(
          `544 \u001b[${31}m${`ENDING OF AN ATTRIBUTE BEFORE STARTING`}\u001b[${39}m`
        );
      } else {
        attrObj.valueStarts = i;
      }
    }

    // catch rare cases when attributes name has some space after it, before equals
    // -------------------------------------------------------------------------
    if (
      !tag.quotes &&
      attrObj.nameEnds &&
      str[i] === "=" &&
      !attrObj.valueStarts
    ) {
      if (!attrObj.equalsAt) {
        attrObj.equalsAt = i;
        console.log(
          `562 SET \u001b[${33}m${`attrObj.equalsAt`}\u001b[${39}m = ${
            attrObj.equalsAt
          }`
        );
      } else {
        // TODO
        console.log(
          `569 \u001b[${33}m${`DOUBLE EQUALS AFTER SPACE!`}\u001b[${39}m ${`\u001b[${31}m${`TODO`}\u001b[${39}m`}`
        );
      }
    }

    // catch the ending of the whole attribute
    // -------------------------------------------------------------------------
    // for example, <a b c> this "c" ends "b" because it's not "equals" sign.
    if (
      !tag.quotes &&
      attrObj.nameStarts &&
      attrObj.nameEnds &&
      !attrObj.valueStarts &&
      str[i].trim().length !== 0 &&
      str[i] !== "="
    ) {
      if (!tag.attributes) {
        tag.attributes = [];
      }
      tag.attributes.push(attrObj);
      console.log("586 PUSHED attrObj into tag.attributes, reset attrObj");
      attrObj = {};
    }

    // catch the ending of an attribute's name
    // -------------------------------------------------------------------------
    if (!tag.quotes && attrObj.nameStarts && !attrObj.nameEnds) {
      console.log("596");
      if (str[i].trim().length === 0) {
        attrObj.nameEnds = i;
        console.log(
          `600 SET ${`\u001b[${33}m${`attrObj.nameEnds`}\u001b[${39}m`} = ${JSON.stringify(
            attrObj.nameEnds,
            null,
            4
          )}`
        );
      } else if (str[i] === "=") {
        // 1. BAU cases, equal hasn't been met
        if (!attrObj.equalsAt) {
          attrObj.nameEnds = i;
          console.log(
            `611 SET ${`\u001b[${33}m${`attrObj.nameEnds`}\u001b[${39}m`} = ${JSON.stringify(
              attrObj.nameEnds,
              null,
              4
            )}`
          );
          attrObj.equalsAt = i;
          console.log(
            `619 SET ${`\u001b[${33}m${`attrObj.equalsAt`}\u001b[${39}m`} = ${JSON.stringify(
              attrObj.equalsAt,
              null,
              4
            )}`
          );
        } else {
          // 2. there are multiple equals detected
          console.log(
            `628 \u001b[${33}m${`MULTIPLE EQUALS AFTER ATTR NAME`}\u001b[${39}m - ${`\u001b[${31}m${`TODO`}\u001b[${39}m`}`
          );
          // TODO
        }
      } else if (str[i] === "/" || str[i] === ">") {
        console.log(
          `634 SET ${`\u001b[${33}m${`attrObj.nameEnds`}\u001b[${39}m`} = ${JSON.stringify(
            attrObj.nameEnds,
            null,
            4
          )}`
        );
        attrObj.nameEnds = i;
        console.log(`621 \u001b[${33}m${`PUSH attrObj and wipe`}\u001b[${39}m`);
        if (!tag.attributes) {
          tag.attributes = [];
        }
        tag.attributes.push(attrObj);
        attrObj = {};
      } else if (str[i] === "<" || isValidAttributeCharacter(str[i])) {
        console.log(
          `626 \u001b[${33}m${`ATTR NAME ENDS WITH NEW TAG`}\u001b[${39}m - ${`\u001b[${31}m${`TODO`}\u001b[${39}m`}`
        );
        // TODO - address both cases of onlyPlausible
        attrObj.nameEnds = i;
        if (!tag.attributes) {
          tag.attributes = [];
        }
        tag.attributes.push(attrObj);
        attrObj = {};
      }
    }

    // catch the beginning of an attribute's name
    // -------------------------------------------------------------------------
    if (
      !tag.quotes &&
      tag.nameEnds < i &&
      str[i] !== ">" &&
      str[i] !== "/" &&
      str[i - 1].trim().length === 0 &&
      str[i].trim().length !== 0 &&
      !attrObj.nameStarts
    ) {
      if (isValidAttributeCharacter(`${str[i]}${str[i + 1]}`)) {
        attrObj.nameStarts = i;
        console.log(
          `646 SET \u001b[${33}m${`attrObj.nameStarts`}\u001b[${39}m = ${
            attrObj.nameStarts
          }`
        );
      } else if (tag.onlyPlausible) {
        // If we have already suspicious tag where there's a space after "<", now it's fine to skip this
        // tag because it's not a tag - attribute starts with a non-legit symbol...
        // Wipe the whole tag record object:
        console.log(`654 \u001b[${33}m${`WIPE tag{}`}\u001b[${39}m`);
        tag = {};
      }
    }

    // catch "< /" - turn off "onlyPlausible"
    // -------------------------------------------------------------------------
    if (
      tag.lastOpeningBracketAt !== null &&
      tag.lastOpeningBracketAt < i &&
      str[i] === "/" &&
      tag.onlyPlausible
    ) {
      tag.onlyPlausible = false;
    }

    // catch character that follows an opening bracket:
    // -------------------------------------------------------------------------
    if (
      tag.lastOpeningBracketAt !== null &&
      tag.lastOpeningBracketAt < i &&
      str[i] !== "/" // there can be closing slashes in various places, legit and not
    ) {
      // 1. identify, is it definite or just plausible tag
      if (tag.onlyPlausible === undefined) {
        if (
          (str[i].trim().length === 0 || str[i] === "<") &&
          !tag.slashPresent
        ) {
          tag.onlyPlausible = true;
        } else {
          tag.onlyPlausible = false;
        }
        console.log(
          `634 SET \u001b[${33}m${`tag.onlyPlausible`}\u001b[${39}m = ${
            tag.onlyPlausible
          }`
        );
      }
      // 2. catch the beginning of the tag name. Consider custom HTML tag names
      // and also known (X)HTML tags:
      if (
        str[i].trim().length !== 0 &&
        tag.nameStarts === undefined &&
        str[i] !== "<" &&
        str[i] !== "/" &&
        str[i] !== ">"
      ) {
        tag.nameStarts = i;
        tag.nameContainsLetters = false;
        console.log(
          `708 \u001b[${33}m${`tag.nameStarts`}\u001b[${39}m = ${
            tag.nameStarts
          }`
        );
      }
    }

    // Catch letters in the tag name. Necessary to filter out false positives like "<------"
    if (
      tag.nameStarts &&
      !tag.quotes &&
      str[i].toLowerCase() !== str[i].toUpperCase()
    ) {
      tag.nameContainsLetters = true;
    }

    // catch closing bracket
    // -------------------------------------------------------------------------
    if (str[i] === ">") {
      if (tag.lastOpeningBracketAt !== undefined) {
        // 1. mark the index
        tag.lastClosingBracketAt = i;
        console.log(
          `747 SET tag.lastClosingBracketAt = ${tag.lastClosingBracketAt}`
        );
        // 2. push attrObj into tag.attributes[]
        if (Object.keys(attrObj).length) {
          console.log(
            `752 PUSH \u001b[${33}m${`attrObj`}\u001b[${39}m & reset`
          );
          if (!tag.attributes) {
            tag.attributes = [];
          }
          tag.attributes.push(attrObj);
          attrObj = {};
        }
      }
    }

    // catch the ending of the tag
    // -------------------------------------------------------------------------
    // the tag is "released" into "replaceSlicesArr":

    if (tag.lastOpeningBracketAt !== undefined) {
      if (tag.lastClosingBracketAt === undefined) {
        if (
          tag.lastOpeningBracketAt < i &&
          str[i] !== "<" && // to prevent cases like "text <<<<<< text"
          (str[i + 1] === undefined || str[i + 1] === "<") &&
          tag.onlyPlausible
        ) {
          // find out the tag name earlier than dedicated tag name ending catching section:
          if (str[i + 1] === undefined) {
            const tagName = str.slice(tag.nameStarts, i + 1);
            console.log(
              `776 ${`\u001b[${33}m${`tagName`}\u001b[${39}m`} = ${JSON.stringify(
                tagName,
                null,
                4
              )}`
            );
            // if the tag is only plausible (there's space after opening bracket) and it's not among
            // recognised tags, leave it as it is:
            if (
              !definitelyTagNames.concat(singleLetterTags).includes(tagName)
            ) {
              continue;
            }
          } // else {
          //   // case 1. closing bracket hasn't been encountered yet but EOL is reached
          //   // for example "<script" or "<script  "
          //   console.log(
          //     `384 \u001b[${33}m${`SUBMIT RANGE #1: [${
          //       tag.leftOuterWhitespace
          //     }, ${i + 1}, "${calculateWhitespaceToInsert(
          //       str,
          //       i,
          //       tag.leftOuterWhitespace,
          //       i + 1
          //     )}"]`}\u001b[${39}m`
          //   );
          //   rangesToDelete.push(
          //     tag.leftOuterWhitespace,
          //     i + 1,
          //     calculateWhitespaceToInsert(
          //       str,
          //       i,
          //       tag.leftOuterWhitespace,
          //       i + 1
          //     )
          //   );
          //   // also,
          //   treatRangedTags(i);
          // }
        }
      } else if (
        (i > tag.lastClosingBracketAt && str[i].trim().length !== 0) ||
        str[i + 1] === undefined
      ) {
        console.log(`row \u001b[${33}m${`738`}\u001b[${39}m`);

        // tag.lastClosingBracketAt !== undefined

        // case 2. closing bracket HAS BEEN met
        // we'll look for a non-whitespace character and delete up to it
        // BUT, we'll wipe the tag object only if that non-whitespace character
        // is not a ">". This way we'll catch and delete sequences of closing brackets.

        // part 1.

        const endingRangeIndex = tag.lastClosingBracketAt === i ? i + 1 : i;

        // if it's a dodgy suspicious tag where space follows opening bracket, there's an extra requirement
        // for this tag to be considered a tag - there has to be at least one attribute with equals if
        // the tag name is not recognised.

        console.log(
          `${`\u001b[${33}m${`tag.name`}\u001b[${39}m`} = ${JSON.stringify(
            tag.name,
            null,
            4
          )}`
        );
        if (
          !tag.onlyPlausible ||
          // tag name is recognised and there are no attributes:
          ((tag.attributes.length === 0 &&
            definitelyTagNames.concat(singleLetterTags).includes(tag.name)) ||
            // OR there is at least one equals that follow the attribute's name:
            (tag.attributes &&
              tag.attributes.some(attrObj => attrObj.equalsAt)))
        ) {
          console.log(
            `772 \u001b[${33}m${`SUBMIT RANGE #2: [${
              tag.leftOuterWhitespace
            }, ${endingRangeIndex}, ${JSON.stringify(
              calculateWhitespaceToInsert(
                str,
                i,
                tag.leftOuterWhitespace,
                endingRangeIndex
              ),
              null,
              0
            )}]`}\u001b[${39}m`
          );

          rangesToDelete.push(
            tag.leftOuterWhitespace,
            endingRangeIndex,
            calculateWhitespaceToInsert(
              str,
              i,
              tag.leftOuterWhitespace,
              endingRangeIndex
            )
          );
          // also,
          treatRangedTags(i);
        } else {
          console.log(`799 \u001b[${33}m${`RESET tag{}`}\u001b[${39}m`);
          tag = {};
        }

        // part 2.
        if (str[i] !== ">") {
          console.log(`805 \u001b[${33}m${`RESET tag{}`}\u001b[${39}m`);
          tag = {};
        }
      }
    }

    // catch opening bracket
    // -------------------------------------------------------------------------
    if (str[i] === "<" && str[i - 1] !== "<") {
      // cater sequences of opening brackets "<<<<div>>>"
      if (str[i + 1] === ">") {
        // cater cases like: "<><><>"
        continue;
      } else {
        // if new tag starts, reset:
        if (
          tag.lastOpeningBracketAt !== undefined &&
          tag.onlyPlausible &&
          tag.name &&
          !tag.quotes
        ) {
          // reset:
          tag.lastOpeningBracketAt = undefined;
          tag.onlyPlausible = false;
        }

        if (
          (tag.lastOpeningBracketAt === undefined || !tag.onlyPlausible) &&
          !tag.quotes
        ) {
          tag.lastOpeningBracketAt = i;
          tag.slashPresent = false;
          tag.attributes = [];
          tag.leftOuterWhitespace =
            chunkOfWhitespaceStartsAt === null ? i : chunkOfWhitespaceStartsAt;
          console.log(
            `840 SET \u001b[${33}m${`tag.leftOuterWhitespace`}\u001b[${39}m = ${
              tag.leftOuterWhitespace
            }; \u001b[${33}m${`tag.lastOpeningBracketAt`}\u001b[${39}m = ${
              tag.lastOpeningBracketAt
            }; \u001b[${33}m${`tag.slashPresent`}\u001b[${39}m = false`
          );
        }
      }
    }

    // catch whitespace
    // -------------------------------------------------------------------------
    if (str[i].trim() === "") {
      // 1. catch chunk boundaries:
      if (chunkOfWhitespaceStartsAt === null) {
        chunkOfWhitespaceStartsAt = i;
        console.log(
          `857 SET \u001b[${33}m${`chunkOfWhitespaceStartsAt`}\u001b[${39}m = ${chunkOfWhitespaceStartsAt}`
        );
      }
    } else if (chunkOfWhitespaceStartsAt !== null) {
      // 1. piggyback the catching of the attributes with equal and no value
      if (
        !tag.quotes &&
        tag.equalsSpottedAt === chunkOfWhitespaceStartsAt - 1 &&
        tag.attributeNameEnds &&
        tag.equalsSpottedAt > tag.attributeNameEnds &&
        str[i] !== '"' &&
        str[i] !== "'"
      ) {
        if (isObj(attrObj)) {
          // cases where there's just equal after tag name <article = >
          attrObj = {};
        }
        attrObj.equalsAt = tag.equalsSpottedAt;
        console.log(
          `876 PUSHING ${`\u001b[${33}m${`attrObj`}\u001b[${39}m`} = ${JSON.stringify(
            attrObj,
            null,
            4
          )}`
        );
        if (!tag.attributes) {
          tag.attributes = [];
        }
        tag.attributes.push(attrObj);
        // reset:
        attrObj = {};
        tag.equalsSpottedAt = undefined;
      }
      // 2. reset whitespace marker
      chunkOfWhitespaceStartsAt = null;
      console.log(
        `892 SET \u001b[${33}m${`chunkOfWhitespaceStartsAt`}\u001b[${39}m = ${chunkOfWhitespaceStartsAt}`
      );
    }

    // log all
    // -------------------------------------------------------------------------
    // console.log(
    //   `\u001b[${32}m${` - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`}\u001b[${39}m`
    // );

    console.log(
      `${
        Object.keys(tag).length
          ? `${`\u001b[${35}m${`tag`}\u001b[${39}m`} = ${Object.keys(tag)
              .map(key => {
                return `${`\u001b[${90}m${`\u001b[${7}m${key}\u001b[${27}m`}\u001b[${39}m`} ${`\u001b[${90}m: ${
                  isObj(tag[key]) || isArr(tag[key])
                    ? JSON.stringify(tag[key], null, 4)
                    : tag[key]
                }\u001b[${39}m`}`;
              })
              .join(",\n")}\n`
          : ""
      }${
        rangesToDelete.current()
          ? `RANGES: ${JSON.stringify(rangesToDelete.current(), null, 0)}`
          : ""
      }`
    );
    if (Object.keys(attrObj).length) {
      console.log(
        `${`\u001b[${33}m${`attrObj`}\u001b[${39}m`} = ${JSON.stringify(
          attrObj,
          null,
          4
        )}`
      );
    }

    // console.log(
    //   `${`\u001b[${35}m${`chunkOfWhitespaceStartsAt`}\u001b[${39}m`} = ${chunkOfWhitespaceStartsAt}`
    // );
  }

  if (rangesToDelete.current()) {
    return replaceSlicesArr(str, rangesToDelete.current()).trim();
  }
  return str.trim();
}

export default stripHtml;
