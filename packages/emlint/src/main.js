import { version } from "../package.json";
import { charSuitableForTagName, isStr } from "./util";
import clone from "lodash.clonedeep";
import isObj from "lodash.isplainobject";

function emlint(str, originalOpts) {
  // Arg validation
  if (!isStr(str)) {
    throw new Error(
      `emlint: [THROW_ID_01] the first input argument must be a string. It was given as:\n${JSON.stringify(
        str,
        null,
        4
      )} (type ${typeof str})`
    );
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(
      `emlint: [THROW_ID_02] the second input argument must be a plain object. It was given as:\n${JSON.stringify(
        originalOpts,
        null,
        4
      )} (type ${typeof originalOpts})`
    );
  }

  // Variables
  // ---------------------------------------------------------------------------

  // Tag tracking:
  let logTag;
  const defaultLogTag = {
    tagStartAt: null,
    tagNameStartAt: null,
    tagNameEndAt: null,
    tagName: null,
    attributes: []
  };
  function resetLogTag() {
    logTag = clone(defaultLogTag);
  }
  resetLogTag();
  // PS. we do this contraption above to make life easier when we want to reset
  // the marker object. Imagine, what happens if we add a new key we want to
  // keep record of. All resets, if they were hardcoded, would have to be manually
  // updated. Now, with above reset, there's single source of truth, single
  // reference of all keys. As a bonus, besides reset, we can always query deeper
  // keys, like "if obj.key1.key2". Without reset, "key1" would not exist and
  // we could not query.

  // ================

  let logWhitespace;
  const defaultLogWhitespace = {
    startAt: null,
    includesLinebreaks: false,
    lastLinebreakAt: null
  };
  function resetLogWhitespace() {
    logWhitespace = clone(defaultLogWhitespace);
  }
  resetLogWhitespace();

  // Return-related:
  const retObj = {
    issues: []
  };

  // ---------------------------------------------------------------------------

  //                         L O O P     S T A R T S
  //                                  |
  //                                  |
  //                                  |
  //                                  |
  //                               \  |  /
  //                                \ | /
  //                                 \|/
  //                                  V
  for (let i = 0, len = str.length; i < len; i++) {
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //
    //                        RULES AT THE TOP
    //
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S

    console.log(
      `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m`
    );

    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //
    //                        RULES AT THE MIDDLE
    //
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S

    // catch the ending of whitespace chunks:
    if (logWhitespace.startAt !== null && str[i].trim().length) {
      resetLogWhitespace();
      console.log(
        `131 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`logWhitespace.startAt`}\u001b[${39}m`} = ${JSON.stringify(
          logWhitespace.startAt,
          null,
          4
        )}`
      );
    }

    // catch the start of whitespace chunks:
    if (!str[i].trim().length && logWhitespace.startAt === null) {
      logWhitespace.startAt = i;
      console.log(
        `143 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`logWhitespace.startAt`}\u001b[${39}m`} = ${JSON.stringify(
          logWhitespace.startAt,
          null,
          4
        )}`
      );
    }

    // catch linebreaks within whitespace chunks:
    if (str[i] === "\n" || str[i] === "\r") {
      if (logWhitespace.startAt !== null && !logWhitespace.includesLinebreaks) {
        logWhitespace.includesLinebreaks = true;
        console.log(
          `156 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`logWhitespace.includesLinebreaks`}\u001b[${39}m`} = ${JSON.stringify(
            logWhitespace.includesLinebreaks,
            null,
            4
          )}`
        );
      }
      logWhitespace.lastLinebreakAt = i;
    }

    // catch the ending of the tag name:
    if (logTag.tagNameStartAt !== null && !charSuitableForTagName(str[i])) {
      console.log("168 character not suitable for tag name");
      logTag.tagNameEndAt = i;
      logTag.tagName = str.slice(logTag.tagNameStartAt, i);
      console.log(
        `172 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`logTag.tagNameEndAt`}\u001b[${39}m`} = ${
          logTag.tagNameEndAt
        }; ${`\u001b[${33}m${`logTag.tagName`}\u001b[${39}m`} = ${JSON.stringify(
          logTag.tagName,
          null,
          0
        )}`
      );
    }

    // catch the start of the tag name:
    if (
      logTag.tagStartAt !== null &&
      logTag.tagNameStartAt === null &&
      charSuitableForTagName(str[i]) &&
      logTag.tagStartAt < i
    ) {
      logTag.tagNameStartAt = i;
      console.log(
        `191 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`logTag.tagNameStartAt`}\u001b[${39}m`} = ${
          logTag.tagNameStartAt
        }`
      );

      // rule "space-between-opening-bracket-and-tag-name":
      if (logTag.tagStartAt < i - 1) {
        retObj.issues.push({
          name: "space-after-opening-bracket",
          position: [[logTag.tagStartAt + 1, i]]
        });
      }
    }

    // catch the beginning of a tag:
    if (str[i] === "<" && logTag.tagStartAt === null) {
      logTag.tagStartAt = i;
      console.log(
        `209 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`logTag.tagStartAt`}\u001b[${39}m`} = ${
          logTag.tagStartAt
        }`
      );
    }

    // catch the ending of a tag:
    if (str[i] === ">" && logTag.tagStartAt !== null) {
      resetLogTag();
      console.log(
        `219 end of tag - ${`\u001b[${32}m${`RESET`}\u001b[${39}m`} logTag`
      );
    }

    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //
    //                        RULES AT THE BOTTOM
    //
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S

    const output = {
      logTag: true,
      logWhitespace: true
    };
    console.log(
      `${`\u001b[${31}m${`█ `}\u001b[${39}m`}${
        output.logTag && logTag.tagStartAt !== null
          ? `${`\u001b[${33}m${`logTag`}\u001b[${39}m`} ${JSON.stringify(
              logTag,
              null,
              0
            )}; `
          : ""
      }${
        output.logWhitespace && logWhitespace.startAt !== null
          ? `${`\u001b[${33}m${`logWhitespace`}\u001b[${39}m`} ${JSON.stringify(
              logWhitespace,
              null,
              0
            )}; `
          : ""
      }`
    );

    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
  }
  //                                  ^
  //                                 /|\
  //                                / | \
  //                               /  |  \
  //                                  |
  //                                  |
  //                                  |
  //                                  |
  //                         L O O P     E N D S

  return retObj;
}

export { emlint, version };

// REF from https://steelbrain.me/linter/examples/standard-linter-v2.html
// {
//   severity: 'info',
//   location: {
//     file: editorPath,
//     position: [[0, 0], [0, 1]],
//   },
//   excerpt: `A random value is ${Math.random()}`,
//   description: `### What is this?\nThis is a randomly generated value`
// }
