/**
 * @name codsen-parser
 * @fileoverview Parser aiming at broken or mixed code, especially HTML & CSS
 * @version 0.12.1
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/codsen-parser/}
 */

import { pathNext, pathUp, pathPrev } from 'ast-monkey-util';
import { findMalformed } from 'string-find-malformed';
import { left, right } from 'string-left-right';
import { tokenizer } from 'codsen-tokenizer';
import op from 'object-path';

var version$1 = "0.12.1";

const version = version$1;
const defaults = {
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
  tagCb: null,
  charCb: null,
  errCb: null
};
function isObj(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}
function layerPending(layers, tokenObj) {
  return (
    tokenObj.closing && layers.length && (layers[layers.length - 1].type === tokenObj.type && Object.prototype.hasOwnProperty.call(layers[layers.length - 1], "tagName") && Object.prototype.hasOwnProperty.call(tokenObj, "tagName") && layers[layers.length - 1].tagName === tokenObj.tagName && layers[layers.length - 1].closing === false || tokenObj.type === "comment" && layers.some(layerObjToken => Object.prototype.hasOwnProperty.call(layerObjToken, "closing") && !layerObjToken.closing))
  );
}
function cparser(str, originalOpts) {
  if (typeof str !== "string") {
    if (str === undefined) {
      throw new Error("codsen-tokenizer: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error(`codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${JSON.stringify(str, null, 4)}`);
    }
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(`codsen-tokenizer: [THROW_ID_03] the second input argument, an options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(originalOpts, null, 4)}`);
  }
  if (originalOpts && isObj(originalOpts) && originalOpts.tagCb && typeof originalOpts.tagCb !== "function") {
    throw new Error(`codsen-tokenizer: [THROW_ID_04] the opts.tagCb, callback function, should be a function but it was given as type ${typeof originalOpts.tagCb}, equal to ${JSON.stringify(originalOpts.tagCb, null, 4)}`);
  }
  if (originalOpts && isObj(originalOpts) && originalOpts.charCb && typeof originalOpts.charCb !== "function") {
    throw new Error(`codsen-tokenizer: [THROW_ID_05] the opts.charCb, callback function, should be a function but it was given as type ${typeof originalOpts.charCb}, equal to ${JSON.stringify(originalOpts.charCb, null, 4)}`);
  }
  if (originalOpts && isObj(originalOpts) && originalOpts.reportProgressFunc && typeof originalOpts.reportProgressFunc !== "function") {
    throw new Error(`codsen-tokenizer: [THROW_ID_06] the opts.reportProgressFunc, callback function, should be a function but it was given as type ${typeof originalOpts.reportProgressFunc}, equal to ${JSON.stringify(originalOpts.reportProgressFunc, null, 4)}`);
  }
  if (originalOpts && isObj(originalOpts) && originalOpts.errCb && typeof originalOpts.errCb !== "function") {
    throw new Error(`codsen-tokenizer: [THROW_ID_07] the opts.errCb, callback function, should be a function but it was given as type ${typeof originalOpts.errCb}, equal to ${JSON.stringify(originalOpts.errCb, null, 4)}`);
  }
  const opts = { ...defaults,
    ...originalOpts
  };
  const layers = [];
  const res = [];
  let path = "";
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
      if (typeof opts.tagCb === "function") {
        opts.tagCb(tokenObj);
      }
      if (!tokenObj.nested) {
        let prevToken = op.get(res, path);
        if (!isObj(prevToken)) {
          prevToken = null;
        }
        if (nestNext &&
        !tokenObj.closing && (!lastProcessedToken.closing || lastProcessedToken.type === "comment" &&
        lastProcessedToken.language === "html") &&
        lastProcessedToken.type !== "text" && (!prevToken || !(prevToken.tagName === tokenObj.tagName && !prevToken.closing && tokenObj.closing)) && !layerPending(layers, tokenObj)) {
          nestNext = false;
          path = `${path}.children.0`;
        } else if (tokenObj.closing && typeof path === "string" && path.includes(".") && (!tokenObj.tagName || lastProcessedToken.tagName !== tokenObj.tagName || lastProcessedToken.closing)) {
          if (tokenObj.type === "comment" && tokenObj.closing && Array.isArray(layers) && layers.length &&
          layers.some(l => l.type === "comment" && l.kind === tokenObj.kind)) {
            for (let i = layers.length; i--;) {
              path = pathNext(pathUp(path));
              if (layers[i].type === "comment" && layers[i].kind === tokenObj.kind) {
                break;
              }
            }
          } else {
            path = pathNext(pathUp(path));
          }
          if (layerPending(layers, tokenObj)) {
            while (layers.length && layers[layers.length - 1].type !== tokenObj.type && layers[layers.length - 1].kind !== tokenObj.kind) {
              layers.pop();
            }
            layers.pop();
            nestNext = false;
          } else {
            if (layers.length && tokenObj.tagName &&
            layers.some(layerObj => layerObj.type === "tag" && layerObj.tagName === tokenObj.tagName)) {
              let lastLayer = layers.pop();
              let currTagName = lastLayer.tagName;
              while (currTagName !== tokenObj.tagName) {
                if (lastLayer && typeof opts.errCb === "function") {
                  opts.errCb({
                    ruleId: `${lastLayer.type}${lastLayer.type === "comment" ? `-${lastLayer.kind}` : ""}-missing-closing`,
                    idxFrom: lastLayer.start,
                    idxTo: lastLayer.end,
                    tokenObj: lastLayer
                  });
                }
                lastLayer = layers.pop();
                currTagName = lastLayer.tagName;
                path = pathNext(pathUp(path));
              }
            } else if (
            layers.length > 1 && layers[layers.length - 2].type === tokenObj.type && layers[layers.length - 2].type === tokenObj.type && layers[layers.length - 2].tagName === tokenObj.tagName) {
              if (typeof opts.errCb === "function") {
                const lastLayersToken = layers[layers.length - 1];
                opts.errCb({
                  ruleId: `tag-rogue`,
                  idxFrom: lastLayersToken.start,
                  idxTo: lastLayersToken.end,
                  tokenObj: lastLayersToken
                });
              }
              layers.pop();
              layers.pop();
            } else ;
          }
        } else if (!path) {
          path = "0";
        } else {
          path = pathNext(path);
          if (layerPending(layers, tokenObj)) {
            layers.pop();
          }
        }
        if (tokensWithChildren.includes(tokenObj.type) && !tokenObj.void && Object.prototype.hasOwnProperty.call(tokenObj, "closing") && !tokenObj.closing) {
          nestNext = true;
          if (!tokenObj.kind || !tagNamesThatDontHaveClosings.includes(tokenObj.kind)) {
            layers.push({ ...tokenObj
            });
          }
        }
        const previousPath = pathPrev(path) || "";
        const parentPath = pathUp(path);
        let parentTagsToken;
        if (parentPath && path.includes(".")) {
          parentTagsToken = op.get(res, parentPath);
        }
        let previousTagsToken;
        if (previousPath) {
          previousTagsToken = op.get(res, previousPath);
        }
        const suspiciousCommentTagEndingRegExp = /(-+|-+[^>])>/;
        let parentsLastChildTokenValue;
        let parentsLastChildTokenPath;
        if (isObj(previousTagsToken) && Array.isArray(previousTagsToken.children) && previousTagsToken.children.length && previousTagsToken.children[previousTagsToken.children.length - 1]) {
          parentsLastChildTokenValue = previousTagsToken.children[previousTagsToken.children.length - 1];
          parentsLastChildTokenPath = `${previousPath}.children.${op.get(res, previousPath).children.length - 1}`;
        }
        let tokenTakenCareOf = false;
        if (tokenObj.type === "text" && isObj(parentTagsToken) && parentTagsToken.type === "comment" && parentTagsToken.kind === "simple" && !parentTagsToken.closing && suspiciousCommentTagEndingRegExp.test(tokenObj.value)) {
          const suspiciousEndingStartsAt = (suspiciousCommentTagEndingRegExp.exec(tokenObj.value) || {}).index;
          const suspiciousEndingEndsAt = (suspiciousEndingStartsAt || 0) + tokenObj.value.slice(suspiciousEndingStartsAt).indexOf(">") + 1;
          if (suspiciousEndingStartsAt && suspiciousEndingStartsAt > 0) {
            op.set(res, path, { ...tokenObj,
              end: tokenObj.start + suspiciousEndingStartsAt,
              value: tokenObj.value.slice(0, suspiciousEndingStartsAt)
            });
            if (tokensWithChildren.includes(tokenObj.type)) {
              tokenObj.children = [];
            }
          }
          path = pathNext(pathUp(path));
          op.set(res, path, {
            type: "comment",
            kind: "simple",
            closing: true,
            start: tokenObj.start + (suspiciousEndingStartsAt || 0),
            end: tokenObj.start + suspiciousEndingEndsAt,
            value: tokenObj.value.slice(suspiciousEndingStartsAt, suspiciousEndingEndsAt),
            children: []
          });
          if (suspiciousEndingEndsAt < tokenObj.value.length) {
            path = pathNext(path);
            op.set(res, path, {
              type: "text",
              start: tokenObj.start + suspiciousEndingEndsAt,
              end: tokenObj.end,
              value: tokenObj.value.slice(suspiciousEndingEndsAt)
            });
          }
          tokenTakenCareOf = true;
        } else if (tokenObj.type === "comment" && tokenObj.kind === "only" && isObj(previousTagsToken)) {
          if (previousTagsToken.type === "text" && previousTagsToken.value.trim() && "<!-".includes(previousTagsToken.value[left(previousTagsToken.value, previousTagsToken.value.length)])) {
            const capturedMalformedTagRanges = [];
            findMalformed(previousTagsToken.value, "<!--", obj => {
              capturedMalformedTagRanges.push(obj);
            }, {
              maxDistance: 2
            });
            if (capturedMalformedTagRanges.length && !right(previousTagsToken.value, capturedMalformedTagRanges[capturedMalformedTagRanges.length - 1].idxTo - 1)) {
              const malformedRange = capturedMalformedTagRanges.pop();
              if (!left(previousTagsToken.value, malformedRange.idxFrom) && previousPath && isObj(previousTagsToken)) {
                if (tokensWithChildren.includes(tokenObj.type)) {
                  tokenObj.children = [];
                }
                path = previousPath;
                op.set(res, path, { ...tokenObj,
                  start: malformedRange.idxFrom + previousTagsToken.start,
                  kind: "not",
                  value: `${previousTagsToken.value}${tokenObj.value}`
                });
                tokenTakenCareOf = true;
              } else if (previousPath && isObj(previousTagsToken)) {
                op.set(res, previousPath, { ...previousTagsToken,
                  end: malformedRange.idxFrom + previousTagsToken.start,
                  value: previousTagsToken.value.slice(0, malformedRange.idxFrom)
                });
                if (tokensWithChildren.includes(tokenObj.type)) {
                  tokenObj.children = [];
                }
                op.set(res, path, { ...tokenObj,
                  start: malformedRange.idxFrom + previousTagsToken.start,
                  kind: "not",
                  value: `${previousTagsToken.value.slice(malformedRange.idxFrom)}${tokenObj.value}`
                });
                tokenTakenCareOf = true;
              }
            }
          } else if (isObj(parentsLastChildTokenValue) && parentsLastChildTokenValue.type === "text" && parentsLastChildTokenValue.value.trim() && "<!-".includes(parentsLastChildTokenValue.value[left(parentsLastChildTokenValue.value, parentsLastChildTokenValue.value.length)])) {
            const capturedMalformedTagRanges = [];
            findMalformed(parentsLastChildTokenValue.value, "<!--", obj => {
              capturedMalformedTagRanges.push(obj);
            }, {
              maxDistance: 2
            });
            if (capturedMalformedTagRanges.length && !right(parentsLastChildTokenValue.value, capturedMalformedTagRanges[capturedMalformedTagRanges.length - 1].idxTo - 1)) {
              const malformedRange = capturedMalformedTagRanges.pop();
              if (!left(parentsLastChildTokenValue.value, malformedRange.idxFrom) && previousPath && isObj(parentsLastChildTokenValue)) {
                if (tokensWithChildren.includes(tokenObj.type)) {
                  tokenObj.children = [];
                }
                op.set(res, path, { ...tokenObj,
                  start: malformedRange.idxFrom + parentsLastChildTokenValue.start,
                  kind: "not",
                  value: `${parentsLastChildTokenValue.value}${tokenObj.value}`
                });
                op.del(res, `${previousPath}.children.${op.get(res, previousPath).children.length - 1}`);
                tokenTakenCareOf = true;
              } else if (previousPath && isObj(parentsLastChildTokenValue) && parentsLastChildTokenPath) {
                op.set(res, parentsLastChildTokenPath, { ...parentsLastChildTokenValue,
                  end: malformedRange.idxFrom + parentsLastChildTokenValue.start,
                  value: parentsLastChildTokenValue.value.slice(0, malformedRange.idxFrom)
                });
                if (tokensWithChildren.includes(tokenObj.type)) {
                  tokenObj.children = [];
                }
                op.set(res, path, { ...tokenObj,
                  start: malformedRange.idxFrom + parentsLastChildTokenValue.start,
                  kind: "not",
                  value: `${parentsLastChildTokenValue.value.slice(malformedRange.idxFrom)}${tokenObj.value}`
                });
                tokenTakenCareOf = true;
              }
            }
          }
        }
        if (!tokenTakenCareOf) {
          if (tokensWithChildren.includes(tokenObj.type)) {
            tokenObj.children = [];
          }
          op.set(res, path, tokenObj);
        }
        if (tokensWithChildren.includes(tokenObj.type) && tokenObj.closing && (!previousPath || !isObj(previousTagsToken) || previousTagsToken.closing || previousTagsToken.type !== tokenObj.type || previousTagsToken.tagName !== tokenObj.tagName)) {
          if (tokenObj.void) {
            if (typeof opts.errCb === "function") {
              opts.errCb({
                ruleId: `tag-void-frontal-slash`,
                idxFrom: tokenObj.start,
                idxTo: tokenObj.end,
                fix: {
                  ranges: [[tokenObj.start + 1, tokenObj.tagNameStartsAt]]
                },
                tokenObj
              });
            }
          } else {
            if (typeof opts.errCb === "function") {
              opts.errCb({
                ruleId: `${tokenObj.type}${tokenObj.type === "comment" ? `-${tokenObj.kind}` : ""}-missing-opening`,
                idxFrom: tokenObj.start,
                idxTo: tokenObj.end,
                tokenObj
              });
            }
          }
        }
        lastProcessedToken = { ...tokenObj
        };
      }
    },
    charCb: opts.charCb
  });
  if (layers.length) {
    layers.forEach(tokenObj => {
      if (typeof opts.errCb === "function") {
        opts.errCb({
          ruleId: `${tokenObj.type}${tokenObj.type === "comment" ? `-${tokenObj.kind}` : ""}-missing-closing`,
          idxFrom: tokenObj.start,
          idxTo: tokenObj.end,
          tokenObj
        });
      }
    });
  }
  return res;
}

export { cparser, defaults, version };
