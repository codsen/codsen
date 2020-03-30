/**
 * codsen-parser
 * Parser aiming at broken code, especially HTML & CSS
 * Version: 0.4.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-parser
 */

import { pathNext, pathUp, pathPrev } from 'ast-monkey-util';
import strFindMalformed from 'string-find-malformed';
import { left, right } from 'string-left-right';
import tokenizer from 'codsen-tokenizer';
import op from 'object-path';

function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}
function layerPending(layers, tokenObj) {
  console.log(`013 layerPending() received: `);
  console.log(
    `015 - 1.${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
      layers,
      null,
      4
    )}`
  );
  console.log(
    `022 - 2. ${`\u001b[${33}m${`tokenObj`}\u001b[${39}m`} = ${JSON.stringify(
      tokenObj,
      null,
      4
    )}`
  );
  console.log(
    `029 >>>>>> ${`\u001b[${33}m${`layers[layers.length - 1].tagName`}\u001b[${39}m`} = ${JSON.stringify(
      layers.length &&
        isObj(layers[layers.length - 1]) &&
        layers[layers.length - 1].tagName
        ? layers[layers.length - 1].tagName
        : null,
      null,
      4
    )}`
  );
  console.log(
    `040 >>>>>> ${`\u001b[${33}m${`tokenObj.tagName`}\u001b[${39}m`} = ${JSON.stringify(
      tokenObj.tagName,
      null,
      4
    )}`
  );
  return (
    tokenObj.closing &&
    layers.length &&
    ((layers[layers.length - 1].type === tokenObj.type &&
      Object.prototype.hasOwnProperty.call(
        layers[layers.length - 1],
        "tagName"
      ) &&
      Object.prototype.hasOwnProperty.call(tokenObj, "tagName") &&
      layers[layers.length - 1].tagName === tokenObj.tagName &&
      layers[layers.length - 1].closing === false) ||
      (tokenObj.type === "comment" &&
        layers.some(
          (layerObjToken) =>
            Object.prototype.hasOwnProperty.call(layerObjToken, "closing") &&
            !layerObjToken.closing
        )))
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
    errCb: null,
  };
  const opts = Object.assign({}, defaults, originalOpts);
  const layers = [];
  const res = [];
  let path;
  let nestNext = false;
  let lastProcessedToken = {};
  const tokensWithChildren = ["tag", "comment"];
  const tagNamesThatDontHaveClosings = ["doctype"];
  tokenizer(str, {
    reportProgressFunc: opts.reportProgressFunc,
    reportProgressFuncFrom: opts.reportProgressFuncFrom,
    reportProgressFuncTo: opts.reportProgressFuncTo,
    tagCbLookahead: 2,
    tagCb: (tokenObj, next) => {
      console.log(`-`.repeat(80));
      console.log(
        `247 ██ ${`\u001b[${33}m${`INCOMING TOKEN`}\u001b[${39}m`}:\n${JSON.stringify(
          {
            type: tokenObj.type,
            tagName: tokenObj.tagName,
            start: tokenObj.start,
            end: tokenObj.end,
            value: tokenObj.value,
            kind: tokenObj.kind,
            closing: tokenObj.closing,
          },
          null,
          4
        )}`
      );
      console.log(
        `262 FIY, ${`\u001b[${33}m${`NEXT`}\u001b[${39}m`} = ${JSON.stringify(
          next,
          null,
          4
        )}`
      );
      console.log(
        `269 FIY, STARTING ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
          layers,
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
        `294 FIY, ${`\u001b[${33}m${`prevToken`}\u001b[${39}m`} = ${JSON.stringify(
          prevToken,
          null,
          4
        )}`
      );
      console.log(
        `301 FIY, ${`\u001b[${33}m${`lastProcessedToken`}\u001b[${39}m`} = ${JSON.stringify(
          lastProcessedToken,
          null,
          4
        )}`
      );
      if (
        nestNext &&
        !tokenObj.closing &&
        (!prevToken ||
          !(
            prevToken.tagName === tokenObj.tagName &&
            !prevToken.closing &&
            tokenObj.closing
          )) &&
        !layerPending(layers, tokenObj)
      ) {
        nestNext = false;
        console.log(`326 ${`\u001b[${35}m${`██ NEST`}\u001b[${39}m`}`);
        path = `${path}.children.0`;
      } else if (
        tokenObj.closing &&
        typeof path === "string" &&
        path.includes(".") &&
        (!tokenObj.tagName ||
          lastProcessedToken.tagName !== tokenObj.tagName ||
          lastProcessedToken.closing)
      ) {
        console.log(`339 ${`\u001b[${35}m${`██ UP`}\u001b[${39}m`}`);
        path = pathNext(pathUp(path));
        if (layerPending(layers, tokenObj)) {
          console.log(
            `344 current token was pending, so we pop() it from layers`
          );
          while (
            layers.length &&
            layers[layers.length - 1].type !== tokenObj.type &&
            layers[layers.length - 1].kind !== tokenObj.kind
          ) {
            layers.pop();
          }
          layers.pop();
          console.log(
            `362 POP layers, now equals to: ${JSON.stringify(layers, null, 4)}`
          );
          nestNext = false;
          console.log(
            `367 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nestNext`}\u001b[${39}m`}: ${nestNext}`
          );
        } else {
          console.log(
            `371 ${`\u001b[${31}m${`layer for "${tokenObj.value}" was not pending!`}\u001b[${39}m`}`
          );
          console.log(
            `374 ${`\u001b[${31}m${`yet this was a closing token`}\u001b[${39}m`}`
          );
          if (
            layers.length > 1 &&
            tokenObj.tagName &&
            tokenObj.tagName === layers[layers.length - 2].tagName
          ) {
            console.log(
              `385 ${`\u001b[${32}m${`THIS WAS A GAP`}\u001b[${39}m`}`
            );
            path = pathNext(pathUp(path));
            console.log(`390 ${`\u001b[${35}m${`██ UP again`}\u001b[${39}m`}`);
            if (opts.errCb) {
              const lastLayersToken = layers[layers.length - 1];
              console.log(
                `397 ${`\u001b[${31}m${`██ RAISE ERROR`}\u001b[${39}m`} ${
                  lastLayersToken.type
                }${
                  lastLayersToken.type === "comment"
                    ? `-${lastLayersToken.kind}`
                    : ""
                }-missing-closing`
              );
              opts.errCb({
                ruleId: `${lastLayersToken.type}${
                  lastLayersToken.type === "comment"
                    ? `-${lastLayersToken.kind}`
                    : ""
                }-missing-closing`,
                idxFrom: lastLayersToken.start,
                idxTo: lastLayersToken.end,
                tokenObj: lastLayersToken,
              });
            }
            layers.pop();
            layers.pop();
            console.log(
              `422 POP layers twice, now equals to: ${JSON.stringify(
                layers,
                null,
                4
              )}`
            );
          } else if (
            layers.length > 2 &&
            layers[layers.length - 3].type === tokenObj.type &&
            layers[layers.length - 3].type === tokenObj.type &&
            layers[layers.length - 3].tagName === tokenObj.tagName
          ) {
            console.log(
              `443 ${`\u001b[${32}m${`PREVIOUS TAG WAS ROGUE OPENING`}\u001b[${39}m`}`
            );
            path = pathNext(pathUp(path));
            console.log(`448 ${`\u001b[${35}m${`██ UP again`}\u001b[${39}m`}`);
            if (opts.errCb) {
              const lastLayersToken = layers[layers.length - 1];
              console.log(
                `455 ${`\u001b[${31}m${`██ RAISE ERROR`}\u001b[${39}m`} tag-rogue [${
                  lastLayersToken.start
                }, ${lastLayersToken.end}]`
              );
              opts.errCb({
                ruleId: `tag-rogue`,
                idxFrom: lastLayersToken.start,
                idxTo: lastLayersToken.end,
                tokenObj: lastLayersToken,
              });
            }
            layers.pop();
            layers.pop();
            layers.pop();
          } else if (
            layers.length > 1 &&
            layers[layers.length - 2].type === tokenObj.type &&
            layers[layers.length - 2].type === tokenObj.type &&
            layers[layers.length - 2].tagName === tokenObj.tagName
          ) {
            console.log(
              `488 ${`\u001b[${32}m${`PREVIOUS TAG WAS ROGUE CLOSING`}\u001b[${39}m`}`
            );
            if (opts.errCb) {
              const lastLayersToken = layers[layers.length - 1];
              console.log(
                `499 ${`\u001b[${31}m${`██ RAISE ERROR`}\u001b[${39}m`} tag-rogue [${
                  lastLayersToken.start
                }, ${lastLayersToken.end}]`
              );
              opts.errCb({
                ruleId: `tag-rogue`,
                idxFrom: lastLayersToken.start,
                idxTo: lastLayersToken.end,
                tokenObj: lastLayersToken,
              });
            }
            layers.pop();
            layers.pop();
          } else {
            console.log(`515 ELSE clauses - TODO`);
          }
        }
      } else if (!path) {
        console.log(`526 ${`\u001b[${35}m${`██ FIRST`}\u001b[${39}m`}`);
        path = "0";
      } else {
        console.log(`531 ${`\u001b[${35}m${`██ BUMP`}\u001b[${39}m`}`);
        path = pathNext(path);
        if (layerPending(layers, tokenObj)) {
          layers.pop();
          console.log(
            `537 POP layers, now equals to: ${JSON.stringify(layers, null, 4)}`
          );
        }
      }
      console.log(
        `${`\u001b[${90}m${`----------------- path calculations done -----------------`}\u001b[${39}m`}`
      );
      if (
        tokensWithChildren.includes(tokenObj.type) &&
        !tokenObj.void &&
        Object.prototype.hasOwnProperty.call(tokenObj, "closing") &&
        !tokenObj.closing
      ) {
        nestNext = true;
        console.log(
          `555 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nestNext`}\u001b[${39}m`} = true`
        );
        if (!tagNamesThatDontHaveClosings.includes(tokenObj.kind)) {
          layers.push(Object.assign({}, tokenObj));
          console.log(
            `561 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to layers, which is now: ${JSON.stringify(
              layers,
              null,
              4
            )}`
          );
        }
      }
      console.log(
        `571 FIY, ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${path}`
      );
      const previousPath = pathPrev(path);
      const parentPath = pathUp(path);
      console.log(
        `586 ${`\u001b[${33}m${`parentPath`}\u001b[${39}m`} = ${JSON.stringify(
          parentPath,
          null,
          4
        )}`
      );
      let parentTagsToken;
      if (parentPath && path.includes(".")) {
        parentTagsToken = op.get(res, parentPath);
      }
      console.log(
        `598 ${`\u001b[${33}m${`parentTagsToken`}\u001b[${39}m`} at path "${`\u001b[${33}m${parentPath}\u001b[${39}m`}" - ${JSON.stringify(
          parentTagsToken
            ? Object.assign({}, parentTagsToken, {
                children: "...",
              })
            : parentTagsToken,
          null,
          4
        )}`
      );
      let previousTagsToken;
      if (previousPath) {
        previousTagsToken = op.get(res, previousPath);
      }
      console.log(
        `614 NOW ${`\u001b[${33}m${`previousTagsToken`}\u001b[${39}m`} at path "${`\u001b[${33}m${previousPath}\u001b[${39}m`}" - ${JSON.stringify(
          previousTagsToken,
          null,
          4
        )}`
      );
      console.log(
        `621 FIY, ${`\u001b[${33}m${`tokenObj.closing`}\u001b[${39}m`} = ${JSON.stringify(
          tokenObj.closing,
          null,
          4
        )}`
      );
      console.log(
        `635 ${`\u001b[${33}m${`res`}\u001b[${39}m`} BEFORE: ${JSON.stringify(
          res,
          null,
          4
        )}`
      );
      const suspiciousCommentTagEndingRegExp = /(-+|-+[^>])>/;
      let parentsLastChildTokenValue;
      let parentsLastChildTokenPath;
      if (
        isObj(previousTagsToken) &&
        Array.isArray(previousTagsToken.children) &&
        previousTagsToken.children.length &&
        previousTagsToken.children[previousTagsToken.children.length - 1]
      ) {
        parentsLastChildTokenValue =
          previousTagsToken.children[previousTagsToken.children.length - 1];
        parentsLastChildTokenPath = `${previousPath}.children.${
          op.get(res, previousPath).children.length - 1
        }`;
      }
      let tokenTakenCareOf = false;
      console.log(
        `663 FIY, ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
          layers,
          null,
          4
        )}`
      );
      if (
        tokenObj.type === "text" &&
        isObj(parentTagsToken) &&
        parentTagsToken.type === "comment" &&
        parentTagsToken.kind === "simple" &&
        !parentTagsToken.closing &&
        suspiciousCommentTagEndingRegExp.test(tokenObj.value)
      ) {
        console.log(
          `678 ${`\u001b[${31}m${`██ intervention needed`}\u001b[${39}m`}`
        );
        const suspiciousEndingStartsAt = suspiciousCommentTagEndingRegExp.exec(
          tokenObj.value
        ).index;
        const suspiciousEndingEndsAt =
          suspiciousEndingStartsAt +
          tokenObj.value.slice(suspiciousEndingStartsAt).indexOf(">") +
          1;
        console.log(
          `688 SUSPICIOUS ENDING: [${`\u001b[${33}m${`suspiciousEndingStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
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
            `707 ${`\u001b[${32}m${`ADD`}\u001b[${39}m`} text leading up to "->"`
          );
          console.log(
            `710 ${`\u001b[${33}m${`res`}\u001b[${39}m`} BEFORE: ${JSON.stringify(
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
              value: tokenObj.value.slice(0, suspiciousEndingStartsAt),
            })
          );
          if (tokensWithChildren.includes(tokenObj.type)) {
            tokenObj.children = [];
          }
          console.log(
            `728 ${`\u001b[${33}m${`res`}\u001b[${39}m`} AFTER: ${JSON.stringify(
              res,
              null,
              4
            )}`
          );
        }
        console.log(
          `739 OLD ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${path}`
        );
        path = pathNext(pathUp(path));
        console.log(
          `743 NEW ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${path}`
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
          children: [],
        });
        console.log(
          `758 ${`\u001b[${33}m${`res`}\u001b[${39}m`} AFTER: ${JSON.stringify(
            res,
            null,
            4
          )}`
        );
        if (suspiciousEndingEndsAt < tokenObj.value.length) {
          console.log(
            `769 OLD ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${path}`
          );
          path = pathNext(path);
          console.log(
            `773 NEW ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${path}`
          );
          op.set(res, path, {
            type: "text",
            start: tokenObj.start + suspiciousEndingEndsAt,
            end: tokenObj.end,
            value: tokenObj.value.slice(suspiciousEndingEndsAt),
          });
          console.log(
            `782 ${`\u001b[${33}m${`res`}\u001b[${39}m`} AFTER: ${JSON.stringify(
              res,
              null,
              4
            )}`
          );
        }
        tokenTakenCareOf = true;
      } else if (
        tokenObj.type === "comment" &&
        tokenObj.kind === "only" &&
        isObj(previousTagsToken)
      ) {
        console.log(
          `800 ${`\u001b[${31}m${`██ intervention needed`}\u001b[${39}m`}`
        );
        if (
          previousTagsToken.type === "text" &&
          previousTagsToken.value.trim().length &&
          "<!-".includes(
            previousTagsToken.value[
              left(previousTagsToken.value, previousTagsToken.value.length)
            ]
          )
        ) {
          console.log(
            `821 ${`\u001b[${31}m${`MALFORMED "NOT" COMMENT`}\u001b[${39}m`}`
          );
          const capturedMalformedTagRanges = [];
          strFindMalformed(
            previousTagsToken.value,
            "<!--",
            (obj) => {
              capturedMalformedTagRanges.push(obj);
            },
            {
              maxDistance: 2,
            }
          );
          console.log(
            `841 ${`\u001b[${33}m${`capturedMalformedTagRanges`}\u001b[${39}m`} = ${JSON.stringify(
              capturedMalformedTagRanges,
              null,
              4
            )}`
          );
          if (
            capturedMalformedTagRanges.length &&
            !right(
              previousTagsToken.value,
              capturedMalformedTagRanges[capturedMalformedTagRanges.length - 1]
                .idxTo - 1
            )
          ) {
            console.log(`855 picking the last malformed range`);
            const malformedRange = capturedMalformedTagRanges.pop();
            console.log(
              `861 ${`\u001b[${33}m${`malformedRange`}\u001b[${39}m`} = ${JSON.stringify(
                malformedRange,
                null,
                4
              )}`
            );
            if (
              !left(previousTagsToken.value, malformedRange.idxFrom) &&
              previousPath &&
              isObj(previousTagsToken)
            ) {
              console.log(`877 whole token is malformed <!--`);
              if (tokensWithChildren.includes(tokenObj.type)) {
                tokenObj.children = [];
              }
              path = previousPath;
              op.set(
                res,
                path,
                Object.assign({}, tokenObj, {
                  start: malformedRange.idxFrom + previousTagsToken.start,
                  kind: "not",
                  value: `${previousTagsToken.value}${tokenObj.value}`,
                })
              );
              tokenTakenCareOf = true;
            } else if (previousPath && isObj(previousTagsToken)) {
              console.log(`900 there are characters in front of <!--`);
              op.set(
                res,
                previousPath,
                Object.assign({}, previousTagsToken, {
                  end: malformedRange.idxFrom + previousTagsToken.start,
                  value: previousTagsToken.value.slice(
                    0,
                    malformedRange.idxFrom
                  ),
                })
              );
              if (tokensWithChildren.includes(tokenObj.type)) {
                tokenObj.children = [];
              }
              op.set(
                res,
                path,
                Object.assign({}, tokenObj, {
                  start: malformedRange.idxFrom + previousTagsToken.start,
                  kind: "not",
                  value: `${previousTagsToken.value.slice(
                    malformedRange.idxFrom
                  )}${tokenObj.value}`,
                })
              );
              tokenTakenCareOf = true;
            }
          }
        } else if (
          isObj(parentsLastChildTokenValue) &&
          parentsLastChildTokenValue.type === "text" &&
          parentsLastChildTokenValue.value.trim().length &&
          "<!-".includes(
            parentsLastChildTokenValue.value[
              left(
                parentsLastChildTokenValue.value,
                parentsLastChildTokenValue.value.length
              )
            ]
          )
        ) {
          console.log(
            `955 ${`\u001b[${31}m${`MALFORMED "NOT" COMMENT`}\u001b[${39}m`}`
          );
          const capturedMalformedTagRanges = [];
          strFindMalformed(
            parentsLastChildTokenValue.value,
            "<!--",
            (obj) => {
              capturedMalformedTagRanges.push(obj);
            },
            {
              maxDistance: 2,
            }
          );
          console.log(
            `975 ${`\u001b[${33}m${`capturedMalformedTagRanges`}\u001b[${39}m`} = ${JSON.stringify(
              capturedMalformedTagRanges,
              null,
              4
            )}`
          );
          if (
            capturedMalformedTagRanges.length &&
            !right(
              parentsLastChildTokenValue.value,
              capturedMalformedTagRanges[capturedMalformedTagRanges.length - 1]
                .idxTo - 1
            )
          ) {
            console.log(`989 picking the last malformed range`);
            const malformedRange = capturedMalformedTagRanges.pop();
            console.log(
              `995 ${`\u001b[${33}m${`malformedRange`}\u001b[${39}m`} = ${JSON.stringify(
                malformedRange,
                null,
                4
              )}`
            );
            if (
              !left(parentsLastChildTokenValue.value, malformedRange.idxFrom) &&
              previousPath &&
              isObj(parentsLastChildTokenValue)
            ) {
              console.log(`1011 whole token is malformed <!--`);
              if (tokensWithChildren.includes(tokenObj.type)) {
                tokenObj.children = [];
              }
              op.set(
                res,
                path,
                Object.assign({}, tokenObj, {
                  start:
                    malformedRange.idxFrom + parentsLastChildTokenValue.start,
                  kind: "not",
                  value: `${parentsLastChildTokenValue.value}${tokenObj.value}`,
                })
              );
              console.log(
                `1035 ██ ${`\u001b[${33}m${`previousPath`}\u001b[${39}m`} = ${JSON.stringify(
                  previousPath,
                  null,
                  4
                )}`
              );
              console.log(
                `1042 DELETING TEXT NODE - RES BEFORE: ${JSON.stringify(
                  res,
                  null,
                  4
                )}`
              );
              op.del(
                res,
                `${previousPath}.children.${
                  op.get(res, previousPath).children.length - 1
                }`
              );
              console.log(
                `1055 DELETING TEXT NODE - RES AFTER: ${JSON.stringify(
                  res,
                  null,
                  4
                )}`
              );
              tokenTakenCareOf = true;
            } else if (
              previousPath &&
              isObj(parentsLastChildTokenValue) &&
              parentsLastChildTokenPath
            ) {
              console.log(`1069 there are characters preceding <!--`);
              console.log(
                `1074 FIY, ${`\u001b[${33}m${`parentsLastChildTokenPath`}\u001b[${39}m`} = ${JSON.stringify(
                  parentsLastChildTokenPath,
                  null,
                  4
                )}`
              );
              op.set(
                res,
                parentsLastChildTokenPath,
                Object.assign({}, parentsLastChildTokenValue, {
                  end:
                    malformedRange.idxFrom + parentsLastChildTokenValue.start,
                  value: parentsLastChildTokenValue.value.slice(
                    0,
                    malformedRange.idxFrom
                  ),
                })
              );
              if (tokensWithChildren.includes(tokenObj.type)) {
                tokenObj.children = [];
              }
              op.set(
                res,
                path,
                Object.assign({}, tokenObj, {
                  start:
                    malformedRange.idxFrom + parentsLastChildTokenValue.start,
                  kind: "not",
                  value: `${parentsLastChildTokenValue.value.slice(
                    malformedRange.idxFrom
                  )}${tokenObj.value}`,
                })
              );
              tokenTakenCareOf = true;
            }
          }
        }
      }
      console.log(`1119 ███████████████████████████████████████`);
      console.log(
        `1121 FIY, ${`\u001b[${33}m${`next`}\u001b[${39}m`} = ${JSON.stringify(
          next,
          null,
          4
        )}`
      );
      console.log(
        `1128 FIY, ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
          layers,
          null,
          4
        )}`
      );
      if (!tokenTakenCareOf) {
        console.log(`1137 setting as usual`);
        if (tokensWithChildren.includes(tokenObj.type)) {
          tokenObj.children = [];
        }
        op.set(res, path, tokenObj);
      }
      console.log(
        `1145 ${`\u001b[${33}m${`res`}\u001b[${39}m`} AFTER: ${JSON.stringify(
          res,
          null,
          4
        )}`
      );
      console.log(
        `1153 ENDING ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${JSON.stringify(
          path,
          null,
          4
        )}`
      );
      if (
        tokensWithChildren.includes(tokenObj.type) &&
        tokenObj.closing &&
        (!previousPath ||
          !isObj(previousTagsToken) ||
          previousTagsToken.closing ||
          previousTagsToken.type !== tokenObj.type ||
          previousTagsToken.tagName !== tokenObj.tagName)
      ) {
        if (tokenObj.void) {
          console.log(
            `1175 frontal slash must be removed because it's a void tag`
          );
          if (opts.errCb) {
            console.log(
              `1179 ${`\u001b[${31}m${`██ RAISE ERROR tag-void-frontal-slash`}\u001b[${39}m`}`
            );
            opts.errCb({
              ruleId: `tag-void-frontal-slash`,
              idxFrom: tokenObj.start,
              idxTo: tokenObj.end,
              fix: { ranges: [[tokenObj.start + 1, tokenObj.tagNameStartsAt]] },
              tokenObj,
            });
          }
        } else {
          console.log(`1190 it's an unpaired tag`);
          if (opts.errCb) {
            console.log(
              `1193 ${`\u001b[${31}m${`██ RAISE ERROR`}\u001b[${39}m`} ${
                tokenObj.type
              }${
                tokenObj.type === "comment" ? `-${tokenObj.kind}` : ""
              }-missing-opening`
            );
            opts.errCb({
              ruleId: `${tokenObj.type}${
                tokenObj.type === "comment" ? `-${tokenObj.kind}` : ""
              }-missing-opening`,
              idxFrom: tokenObj.start,
              idxTo: tokenObj.end,
              tokenObj,
            });
          }
        }
      }
      lastProcessedToken = { ...tokenObj };
      console.log(`${`\u001b[${90}m${`---`}\u001b[${39}m`}`);
      console.log(
        `${`\u001b[${90}m${`██ nestNext = ${`\u001b[${
          nestNext ? 32 : 31
        }m${nestNext}\u001b[${39}m`}`}\u001b[${39}m`}`
      );
      console.log(
        `${`\u001b[${90}m${`██ layers = ${JSON.stringify(
          layers,
          null,
          4
        )}`}\u001b[${39}m`}`
      );
    },
    charCb: opts.charCb,
  });
  console.log(`-`.repeat(80));
  console.log(
    `1254 FIY, ENDING ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
      layers,
      null,
      4
    )}`
  );
  if (layers.length) {
    layers.forEach((tokenObj) => {
      if (opts.errCb) {
        console.log(
          `1265 ${`\u001b[${31}m${`██ RAISE ERROR`}\u001b[${39}m`} ${
            tokenObj.type
          }${
            tokenObj.type === "comment" ? `-${tokenObj.kind}` : ""
          }-missing-closing`
        );
        opts.errCb({
          ruleId: `${tokenObj.type}${
            tokenObj.type === "comment" ? `-${tokenObj.kind}` : ""
          }-missing-closing`,
          idxFrom: tokenObj.start,
          idxTo: tokenObj.end,
          tokenObj,
        });
      }
    });
  }
  console.log(
    `1284 ${`\u001b[${32}m${`FINAL RETURN`}\u001b[${39}m`} ${JSON.stringify(
      res,
      null,
      4
    )}`
  );
  return res;
}

export default cparser;
