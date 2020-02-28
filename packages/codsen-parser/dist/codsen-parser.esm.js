/**
 * codsen-parser
 * Parser aiming at broken code, especially HTML & CSS
 * Version: 0.2.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-parser
 */

import tokenizer from 'codsen-tokenizer';
import op from 'object-path';

function incrementStringNumber(str) {
  if (/^\d*$/.test(str)) {
    return Number.parseInt(str, 10) + 1;
  }
  return str;
}
function pathNext(str) {
  if (typeof str !== "string" || !str.length) {
    return str;
  }
  if (str.includes(".") && /^\d*$/.test(str.slice(str.lastIndexOf(".") + 1))) {
    return `${str.slice(0, str.lastIndexOf(".") + 1)}${incrementStringNumber(
      str.slice(str.lastIndexOf(".") + 1)
    )}`;
  } else if (/^\d*$/.test(str)) {
    return `${incrementStringNumber(str)}`;
  }
  return str;
}

function decrementStringNumber(str) {
  if (/^\d*$/.test(str)) {
    return Number.parseInt(str, 10) - 1;
  }
  return str;
}
function pathPrev(str) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  const extractedValue = str.slice(str.lastIndexOf(".") + 1);
  if (extractedValue === "0") {
    return null;
  } else if (str.includes(".") && /^\d*$/.test(extractedValue)) {
    return `${str.slice(0, str.lastIndexOf(".") + 1)}${decrementStringNumber(
      str.slice(str.lastIndexOf(".") + 1)
    )}`;
  } else if (/^\d*$/.test(str)) {
    return `${decrementStringNumber(str)}`;
  }
  return null;
}

function pathUp(str) {
  if (typeof str === "string") {
    if (!str.includes(".") || !str.slice(str.indexOf(".") + 1).includes(".")) {
      return null;
    }
    let dotsCount = 0;
    for (let i = str.length; i--; ) {
      if (str[i] === ".") {
        dotsCount++;
      }
      if (dotsCount === 2) {
        return str.slice(0, i);
      }
    }
  }
  return str;
}

function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}
function layerPending(layers, tokenObj) {
  return (
    tokenObj.closing &&
    layers.length &&
    layers[layers.length - 1].type === tokenObj.type &&
    layers[layers.length - 1].closing === false
  );
}
function cparser(str, originalOpts) {
  if (typeof str !== "string") {
    if (str === undefined) {
      throw new Error(
        "codsen-tokenizer: [THROW_ID_01] the first input argument is completely missing! It should be given as string."
      );
    } else {
      throw new Error(
        `codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${JSON.stringify(
          str,
          null,
          4
        )}`
      );
    }
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_03] the second input argument, an options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }
  if (
    isObj(originalOpts) &&
    originalOpts.tagCb &&
    typeof originalOpts.tagCb !== "function"
  ) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_04] the opts.tagCb, callback function, should be a function but it was given as type ${typeof originalOpts.tagCb}, equal to ${JSON.stringify(
        originalOpts.tagCb,
        null,
        4
      )}`
    );
  }
  if (
    isObj(originalOpts) &&
    originalOpts.charCb &&
    typeof originalOpts.charCb !== "function"
  ) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_05] the opts.charCb, callback function, should be a function but it was given as type ${typeof originalOpts.charCb}, equal to ${JSON.stringify(
        originalOpts.charCb,
        null,
        4
      )}`
    );
  }
  if (
    isObj(originalOpts) &&
    originalOpts.reportProgressFunc &&
    typeof originalOpts.reportProgressFunc !== "function"
  ) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_06] the opts.reportProgressFunc, callback function, should be a function but it was given as type ${typeof originalOpts.reportProgressFunc}, equal to ${JSON.stringify(
        originalOpts.reportProgressFunc,
        null,
        4
      )}`
    );
  }
  if (
    isObj(originalOpts) &&
    originalOpts.errCb &&
    typeof originalOpts.errCb !== "function"
  ) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_07] the opts.errCb, callback function, should be a function but it was given as type ${typeof originalOpts.errCb}, equal to ${JSON.stringify(
        originalOpts.errCb,
        null,
        4
      )}`
    );
  }
  const defaults = {
    reportProgressFunc: null,
    reportProgressFuncFrom: 0,
    reportProgressFuncTo: 100,
    tagCb: null,
    charCb: null,
    errCb: null
  };
  const opts = Object.assign({}, defaults, originalOpts);
  const layers = [];
  const res = [];
  let path;
  let nestNext = false;
  tokenizer(str, {
    reportProgressFunc: opts.reportProgressFunc,
    reportProgressFuncFrom: opts.reportProgressFuncFrom,
    reportProgressFuncTo: opts.reportProgressFuncTo,
    tagCb: tokenObj => {
      console.log(`-`.repeat(80));
      console.log(
        `185 ██ ${`\u001b[${33}m${`INCOMING TOKEN`}\u001b[${39}m`}:\n${JSON.stringify(
          {
            type: tokenObj.type,
            tagName: tokenObj.tagName,
            start: tokenObj.start,
            end: tokenObj.end,
            value: tokenObj.value
          },
          null,
          4
        )}`
      );
      if (typeof opts.tagCb === "function") {
        opts.tagCb(tokenObj);
      }
      let prevToken = op.get(res, path);
      if (!isObj(prevToken)) {
        prevToken = null;
      }
      console.log(
        `216 FIY, ${`\u001b[${33}m${`prevToken`}\u001b[${39}m`} = ${JSON.stringify(
          prevToken,
          null,
          4
        )}`
      );
      if (
        nestNext &&
        (!prevToken ||
          !(
            prevToken.tagName === tokenObj.tagName &&
            !prevToken.closing &&
            tokenObj.closing
          )) &&
        !layerPending(layers, tokenObj)
      ) {
        nestNext = false;
        console.log(`240 ${`\u001b[${35}m${`██ NEST`}\u001b[${39}m`}`);
        path = `${path}.children.0`;
      } else if (
        tokenObj.closing &&
        typeof path === "string" &&
        path.includes(".")
      ) {
        console.log(`249 ${`\u001b[${35}m${`██ UP`}\u001b[${39}m`}`);
        path = pathNext(pathUp(path));
        if (layerPending(layers, tokenObj)) {
          layers.pop();
          console.log(
            `255 POP layers, now equals to: ${JSON.stringify(layers, null, 4)}`
          );
          nestNext = false;
          console.log(
            `260 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nestNext`}\u001b[${39}m`}: ${nestNext}`
          );
        }
      } else if (!path) {
        console.log(`265 ${`\u001b[${35}m${`██ FIRST`}\u001b[${39}m`}`);
        path = "0";
      } else {
        console.log(`270 ${`\u001b[${35}m${`██ BUMP`}\u001b[${39}m`}`);
        path = pathNext(path);
      }
      if (
        ["tag", "comment"].includes(tokenObj.type) &&
        !tokenObj.void &&
        !tokenObj.closing
      ) {
        nestNext = true;
        console.log(
          `282 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nestNext`}\u001b[${39}m`} = true`
        );
        if (tokenObj.type === "comment") {
          layers.push(tokenObj);
          console.log(
            `288 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to layers, which is now: ${JSON.stringify(
              layers,
              null,
              4
            )}`
          );
        }
      }
      console.log(
        `298 FIY, ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${path}`
      );
      const previousPath = pathPrev(path);
      const parentPath = pathUp(path);
      console.log(
        `313 ${`\u001b[${33}m${`parentPath`}\u001b[${39}m`} = ${JSON.stringify(
          parentPath,
          null,
          4
        )}`
      );
      let parentTagsToken;
      if (parentPath) {
        parentTagsToken = op.get(res, parentPath);
      }
      console.log(
        `325 ${`\u001b[${33}m${`parentTagsToken`}\u001b[${39}m`} at path "${`\u001b[${33}m${parentPath}\u001b[${39}m`}" - ${JSON.stringify(
          Object.assign({}, parentTagsToken, { children: "..." }),
          null,
          4
        )}`
      );
      let previousTagsToken;
      if (previousPath) {
        previousTagsToken = op.get(res, previousPath);
      }
      console.log(
        `337 ${`\u001b[${33}m${`previousTagsToken`}\u001b[${39}m`} at path "${`\u001b[${33}m${previousPath}\u001b[${39}m`}" - ${JSON.stringify(
          previousTagsToken,
          null,
          4
        )}`
      );
      console.log(
        `344 ${`\u001b[${33}m${`tokenObj.closing`}\u001b[${39}m`} = ${JSON.stringify(
          tokenObj.closing,
          null,
          4
        )}`
      );
      if (
        ["tag", "comment"].includes(tokenObj.type) &&
        tokenObj.closing &&
        (!previousPath ||
          !isObj(previousTagsToken) ||
          previousTagsToken.closing ||
          previousTagsToken.type !== tokenObj.type ||
          previousTagsToken.tagName !== tokenObj.tagName)
      ) {
        console.log(
          `361 ${`\u001b[${31}m${`██ RAISE ERROR ${tokenObj.type}-${
            tokenObj.type === "comment" ? tokenObj.kind : ""
          }-missing-opening`}\u001b[${39}m`}`
        );
        if (opts.errCb) {
          opts.errCb({
            ruleId: `${tokenObj.type}${
              tokenObj.type === "comment" ? `-${tokenObj.kind}` : ""
            }-missing-opening`,
            idxFrom: tokenObj.start,
            idxTo: tokenObj.end
          });
        }
      }
      console.log(
        `377 ${`\u001b[${33}m${`res`}\u001b[${39}m`} BEFORE: ${JSON.stringify(
          res,
          null,
          4
        )}`
      );
      const suspiciousCommentTagEndingRegExp = /(-+|-+[^>])>/;
      if (
        tokenObj.type === "text" &&
        isObj(parentTagsToken) &&
        parentTagsToken.type === "comment" &&
        parentTagsToken.kind === "simple" &&
        suspiciousCommentTagEndingRegExp.test(tokenObj.value)
      ) {
        console.log(
          `395 ${`\u001b[${31}m${`██ intervention needed`}\u001b[${39}m`}`
        );
        const suspiciousEndingStartsAt = suspiciousCommentTagEndingRegExp.exec(
          tokenObj.value
        ).index;
        const suspiciousEndingEndsAt =
          suspiciousEndingStartsAt +
          tokenObj.value.slice(suspiciousEndingStartsAt).indexOf(">") +
          1;
        console.log(
          `405 SUSPICIOUS ENDING: [${`\u001b[${33}m${`suspiciousEndingStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
            suspiciousEndingStartsAt,
            null,
            4
          )}, ${`\u001b[${33}m${`suspiciousEndingEndsAt`}\u001b[${39}m`} = ${JSON.stringify(
            suspiciousEndingEndsAt,
            null,
            4
          )}] - value: "${tokenObj.value.slice(
            suspiciousEndingStartsAt,
            suspiciousEndingEndsAt
          )}"`
        );
        if (suspiciousEndingStartsAt > 0) {
          console.log(
            `424 ${`\u001b[${32}m${`ADD`}\u001b[${39}m`} text leading up to "->"`
          );
          console.log(
            `427 ${`\u001b[${33}m${`res`}\u001b[${39}m`} BEFORE: ${JSON.stringify(
              res,
              null,
              4
            )}`
          );
          op.set(
            res,
            path,
            Object.assign({}, tokenObj, {
              end: tokenObj.start + suspiciousEndingStartsAt,
              value: tokenObj.value.slice(0, suspiciousEndingStartsAt)
            })
          );
          if (["tag", "comment"].includes(tokenObj.type)) {
            tokenObj.children = [];
          }
          console.log(
            `445 ${`\u001b[${33}m${`res`}\u001b[${39}m`} AFTER: ${JSON.stringify(
              res,
              null,
              4
            )}`
          );
        }
        console.log(
          `456 OLD ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${path}`
        );
        path = pathNext(pathUp(path));
        console.log(
          `460 NEW ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${path}`
        );
        op.set(res, path, {
          type: "comment",
          kind: "simple",
          closing: true,
          start: tokenObj.start + suspiciousEndingStartsAt,
          end: tokenObj.start + suspiciousEndingEndsAt,
          value: tokenObj.value.slice(
            suspiciousEndingStartsAt,
            suspiciousEndingEndsAt
          ),
          children: []
        });
        console.log(
          `475 ${`\u001b[${33}m${`res`}\u001b[${39}m`} AFTER: ${JSON.stringify(
            res,
            null,
            4
          )}`
        );
        if (suspiciousEndingEndsAt < tokenObj.value.length) {
          console.log(
            `486 OLD ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${path}`
          );
          path = pathNext(path);
          console.log(
            `490 NEW ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${path}`
          );
          op.set(res, path, {
            type: "text",
            start: tokenObj.start + suspiciousEndingEndsAt,
            end: tokenObj.end,
            value: tokenObj.value.slice(suspiciousEndingEndsAt)
          });
          console.log(
            `499 ${`\u001b[${33}m${`res`}\u001b[${39}m`} AFTER: ${JSON.stringify(
              res,
              null,
              4
            )}`
          );
        }
      } else {
        console.log(`507 setting as usual`);
        if (["tag", "comment"].includes(tokenObj.type)) {
          tokenObj.children = [];
        }
        op.set(res, path, tokenObj);
      }
      console.log(
        `515 ${`\u001b[${33}m${`res`}\u001b[${39}m`} AFTER: ${JSON.stringify(
          res,
          null,
          4
        )}`
      );
      console.log(
        `523 ENDING ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${JSON.stringify(
          path,
          null,
          4
        )}`
      );
      console.log(`${`\u001b[${90}m${`---`}\u001b[${39}m`}`);
      console.log(
        `${`\u001b[${90}m${`██ nestNext = ${`\u001b[${
          nestNext ? 32 : 31
        }m${nestNext}\u001b[${39}m`}`}\u001b[${39}m`}`
      );
    },
    charCb: opts.charCb
  });
  console.log(`-`.repeat(80));
  console.log(
    `561 ${`\u001b[${32}m${`FINAL RETURN`}\u001b[${39}m`} ${JSON.stringify(
      res,
      null,
      4
    )}`
  );
  return res;
}

export default cparser;
