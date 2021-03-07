/**
 * codsen-parser
 * Parser aiming at broken or mixed code, especially HTML & CSS
 * Version: 0.10.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/codsen-parser/
 */

import { pathNext, pathUp, pathPrev } from 'ast-monkey-util';
import { findMalformed } from 'string-find-malformed';
import { left, right } from 'string-left-right';
import { tokenizer } from 'codsen-tokenizer';
import op from 'object-path';

var version$1 = "0.10.3";

/* eslint no-use-before-define: 0 */
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
  return (// usual closing case
    tokenObj.closing && layers.length && (layers[layers.length - 1].type === tokenObj.type && Object.prototype.hasOwnProperty.call(layers[layers.length - 1], "tagName") && Object.prototype.hasOwnProperty.call(tokenObj, "tagName") && layers[layers.length - 1].tagName === tokenObj.tagName && layers[layers.length - 1].closing === false || // OR,
    // rarer cases - any closing comment tag will close the layer, with
    // condition that opening exists among layers:
    // for example, consider <!--x<a>-->
    // <!-- is one layer
    // <a> is another layer
    // but
    // --> comes in and closes the last opening comment, it does not matter
    // that html tag layer hasn't been closed - comment tags take priority
    tokenObj.type === "comment" && layers.some(layerObjToken => Object.prototype.hasOwnProperty.call(layerObjToken, "closing") && !layerObjToken.closing))
  );
}
/**
 * Parser aiming at broken or mixed code, especially HTML & CSS
 */


function cparser(str, originalOpts) {
  //
  //
  //
  //
  //
  //
  //
  // INSURANCE
  // ---------------------------------------------------------------------------
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
  } //
  //
  //
  //
  //
  //
  //
  // OPTS
  // ---------------------------------------------------------------------------


  const opts = { ...defaults,
    ...originalOpts
  }; //
  //
  //
  //
  //
  //
  //
  // ACTION
  // ---------------------------------------------------------------------------
  // layers keep track of tag heads, so that when we hit their tails, we know
  // where both parts are:

  const layers = [];
  const res = []; // this flag is used to give notice
  // we use object-path notation
  // (https://www.npmjs.com/package/object-path)
  // outer container is array so starting path is zero.
  // object-path notation differs from normal js notation
  // in that array paths are with digits, a.2 not a[2]
  // which means, object keys can't have digit-only names.
  // The benefit of this notation is that it's consistent -
  // all the levels are joined with a dot, there are no brackets.

  let path = "";
  let nestNext = false;
  let lastProcessedToken = {};
  const tokensWithChildren = ["tag", "comment"];
  const tagNamesThatDontHaveClosings = ["doctype"]; // Call codsen-tokenizer. It works through callbacks,
  // pinging each token to the function you give, opts.tagCb

  tokenizer(str, {
    reportProgressFunc: opts.reportProgressFunc,
    reportProgressFuncFrom: opts.reportProgressFuncFrom,
    reportProgressFuncTo: opts.reportProgressFuncTo,
    tagCbLookahead: 2,
    tagCb: (tokenObj, next) => {
      //
      //
      //
      //
      //
      //
      //
      //
      //
      //              TAG CALLBACK STARTS
      //
      //
      //
      //
      //
      //
      //
      // // pass the token to the 3rd parties through opts.tagCb

      if (typeof opts.tagCb === "function") {
        opts.tagCb(tokenObj);
      } // tokenizer pings nested "rule" and "at" rule tokens separately,
      // which means, there might be duplication. To consume each "rule" and "at"
      // only once, we have to ensure their "nested" key is false.


      if (!tokenObj.nested) {
        // tokenizer does not build AST's so there is no
        // "children" key reported on each node. However,
        // here we do build AST's and while some tokens might
        // not have children tokens or can't (text nodes),
        // for consistency we will add children key with
        // an empty array value to each token in AST.
        // recalculate the path for this token
        let prevToken = op.get(res, path);

        if (!isObj(prevToken)) {
          prevToken = null;
        }

        if (nestNext && // ensure it's not a closing tag of a pair, in which case
        // don't nest it!
        !tokenObj.closing && ( // also don't nest under closing tag
        !lastProcessedToken.closing || // unless it's a comment tag
        lastProcessedToken.type === "comment" && // and it's an HTML comment
        lastProcessedToken.language === "html") && // also don't nest under text token
        lastProcessedToken.type !== "text" && (!prevToken || !(prevToken.tagName === tokenObj.tagName && !prevToken.closing && tokenObj.closing)) && !layerPending(layers, tokenObj)) {
          // 1. reset the flag
          nestNext = false; // 2. go deeper
          // "1.children.3" -> "1.children.3.children.0"
          path = `${path}.children.0`;
        } else if (tokenObj.closing && typeof path === "string" && path.includes(".") && ( // ensure preceding token was not an opening counterpart:
        !tokenObj.tagName || lastProcessedToken.tagName !== tokenObj.tagName || lastProcessedToken.closing)) {
          // goes up and then bumps,
          // "1.children.3" -> "2" // for comments, many layers could have been nested before
          // this closing comment, so we need to find out, at which level
          // above the opening comment layer was

          if (tokenObj.type === "comment" && tokenObj.closing && Array.isArray(layers) && layers.length && // there's opening comment layer somewhere above
          layers.some(l => l.type === "comment" && l.kind === tokenObj.kind)) { // find out how many levels above that opening comment tag is

            for (let i = layers.length; i--;) {
              path = pathNext(pathUp(path));

              if (layers[i].type === "comment" && layers[i].kind === tokenObj.kind) {
                break;
              }
            }
          } else {
            path = pathNext(pathUp(path));
          }

          if (layerPending(layers, tokenObj)) { //
            // in case of comment layers, there can be more layers leading
            // up to this, so more popping might be needed.
            // Imagine <!--<a><a><a><a><a><a>-->
            //                                ^
            //                              we're here

            while (layers.length && layers[layers.length - 1].type !== tokenObj.type && layers[layers.length - 1].kind !== tokenObj.kind) {
              layers.pop();
            }

            layers.pop();
            nestNext = false;
          } else {

            if (layers.length && tokenObj.tagName && // (tokenObj as TagToken).tagName ===
            //   (layers[layers.length - 2] as TagToken).tagName
            layers.some(layerObj => layerObj.type === "tag" && layerObj.tagName === tokenObj.tagName)) {
              // if this is a gap and current token closes parent token,
              // go another level up
              let lastLayer = layers.pop();
              let currTagName = lastLayer.tagName; // let i = 0;

              while (currTagName !== tokenObj.tagName) { // i++;
                // 1. report the last layer's token as missing closing

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
            } else if ( // so it's a closing tag (</table> in example below)
            // and it was not pending (meaning opening heads were not in front)
            // and this token is tag and it's closing the first layer backwards
            // imagine code: <table><tr><td>x</td></a></table>
            // imagine we're on </table>
            // The </a> didn't open a new layer so we have layers:
            // <table>, <tr>
            // </tr> was meant to be instead of </a>,
            // the first layer backwards, the <table> does match our </table>
            // that's path "layers[layers.length - 2]"
            layers.length > 1 && layers[layers.length - 2].type === tokenObj.type && layers[layers.length - 2].type === tokenObj.type && layers[layers.length - 2].tagName === tokenObj.tagName) { // 1. don't amend the path, because this rogue closing tag has
              // already triggered "UP", tree is fine
              // 2. report the last layer's token as missing closing

              if (typeof opts.errCb === "function") {
                const lastLayersToken = layers[layers.length - 1];
                opts.errCb({
                  ruleId: `tag-rogue`,
                  idxFrom: lastLayersToken.start,
                  idxTo: lastLayersToken.end,
                  tokenObj: lastLayersToken
                });
              } // 3. pop all 2


              layers.pop();
              layers.pop();
            } else ;
          }
        } else if (!path) {
          // it's the first element - push the token into index 0
          path = "0";
        } else {
          // bumps the index,
          // "1.children.3" -> "1.children.4"
          path = pathNext(path);

          if (layerPending(layers, tokenObj)) {
            layers.pop();
          }
        } // activate the nestNext

        if (tokensWithChildren.includes(tokenObj.type) && !tokenObj.void && Object.prototype.hasOwnProperty.call(tokenObj, "closing") && !tokenObj.closing) {
          nestNext = true;

          if (!tokenObj.kind || !tagNamesThatDontHaveClosings.includes(tokenObj.kind)) {
            layers.push({ ...tokenObj
            });
          }
        } // check, does this closing tag have an
        // opening counterpart

        const previousPath = pathPrev(path) || ""; // console.log(
        //   `269 ${`\u001b[${33}m${`previousPath`}\u001b[${39}m`} = ${JSON.stringify(
        //     previousPath,
        //     null,
        //     4
        //   )}`
        // );

        const parentPath = pathUp(path);
        let parentTagsToken;

        if (parentPath && path.includes(".")) {
          parentTagsToken = op.get(res, parentPath);
        }
        let previousTagsToken;

        if (previousPath) {
          previousTagsToken = op.get(res, previousPath);
        } //
        // AST CORRECTION PART
        //
        // We change nodes where we recognise the error.
        // // case of "a<!--b->c", current token being "text" type, value "b->c"

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
          const suspiciousEndingEndsAt = (suspiciousEndingStartsAt || 0) + tokenObj.value.slice(suspiciousEndingStartsAt).indexOf(">") + 1; // part 1.
          // if any text precedes the "->" that text goes in as normal,
          // at this level, under this path:

          if (suspiciousEndingStartsAt && suspiciousEndingStartsAt > 0) {
            op.set(res, path, { ...tokenObj,
              end: tokenObj.start + suspiciousEndingStartsAt,
              value: tokenObj.value.slice(0, suspiciousEndingStartsAt)
            });

            if (tokensWithChildren.includes(tokenObj.type)) {
              tokenObj.children = [];
            }
          } // part 2.
          // further, the "->" goes as closing token at parent level
          path = pathNext(pathUp(path));
          op.set(res, path, {
            type: "comment",
            kind: "simple",
            closing: true,
            start: tokenObj.start + (suspiciousEndingStartsAt || 0),
            end: tokenObj.start + suspiciousEndingEndsAt,
            value: tokenObj.value.slice(suspiciousEndingStartsAt, suspiciousEndingEndsAt),
            children: []
          }); // part 3.
          // if any text follows "->" add that after

          if (suspiciousEndingEndsAt < tokenObj.value.length) {
            path = pathNext(path);
            op.set(res, path, {
              type: "text",
              start: tokenObj.start + suspiciousEndingEndsAt,
              end: tokenObj.end,
              value: tokenObj.value.slice(suspiciousEndingEndsAt)
            });
          } // part 4.
          // stop token from being pushed in the ELSE clauses below


          tokenTakenCareOf = true; //
        } else if (tokenObj.type === "comment" && tokenObj.kind === "only" && isObj(previousTagsToken)) { // check "only" kind comment-type tokens for malformed front parts,
          // "<!--", which would turn them into "not" kind comment-type tokens

          if (previousTagsToken.type === "text" && previousTagsToken.value.trim() && "<!-".includes(previousTagsToken.value[left(previousTagsToken.value, previousTagsToken.value.length)])) {
            // if "only" kind token is preceded by something that resembles
            // opening HTML comment ("simple" kind), that might be first part
            // of "not" kind comment:
            //
            // <img/><--<![endif]-->
            //       ^
            //      excl. mark missing on the first part ("<!--") // findMalformed

            const capturedMalformedTagRanges = []; // Contents will be objects like:
            // {
            //   idxFrom: 3,
            //   idxTo: 9
            // }

            findMalformed(previousTagsToken.value, "<!--", obj => {
              capturedMalformedTagRanges.push(obj);
            }, {
              maxDistance: 2
            });

            if (capturedMalformedTagRanges.length && !right(previousTagsToken.value, capturedMalformedTagRanges[capturedMalformedTagRanges.length - 1].idxTo - 1)) { // pick the last
              // imagine, there were multiple malformed opening comments:
              // <img/><1--<1--<1--<1--<![endif]-->

              const malformedRange = capturedMalformedTagRanges.pop(); // is the whole text token to be merged into the closing comment token,
              // or were there characters in front of text token which remain and
              // form the shorter, text token?

              if (!left(previousTagsToken.value, malformedRange.idxFrom) && previousPath && isObj(previousTagsToken)) { // if there are no whitespace characters to the left of "from" index
                // of the malformed "<!--", this means whole token is a malformed
                // value and needs to be merged into current "comment" type token
                // and its kind should be changed from "only" to "not".

                if (tokensWithChildren.includes(tokenObj.type)) {
                  tokenObj.children = [];
                } // path becomes the path of previous, text token - we overwrite it


                path = previousPath;
                op.set(res, path, { ...tokenObj,
                  start: malformedRange.idxFrom + previousTagsToken.start,
                  kind: "not",
                  value: `${previousTagsToken.value}${tokenObj.value}`
                }); // stop token from being pushed in the ELSE clauses below

                tokenTakenCareOf = true;
              } else if (previousPath && isObj(previousTagsToken)) { // if there are text characters which are not part of "<!--",
                // shorten the text token, push a new comment token
                // 1. tweak the "text" token

                op.set(res, previousPath, { ...previousTagsToken,
                  end: malformedRange.idxFrom + previousTagsToken.start,
                  value: previousTagsToken.value.slice(0, malformedRange.idxFrom)
                }); // 2. tweak the current "comment" token

                if (tokensWithChildren.includes(tokenObj.type)) {
                  tokenObj.children = [];
                }

                op.set(res, path, { ...tokenObj,
                  start: malformedRange.idxFrom + previousTagsToken.start,
                  kind: "not",
                  value: `${previousTagsToken.value.slice(malformedRange.idxFrom)}${tokenObj.value}`
                }); // stop token from being pushed in the ELSE clauses below

                tokenTakenCareOf = true;
              }
            }
          } else if (isObj(parentsLastChildTokenValue) && parentsLastChildTokenValue.type === "text" && parentsLastChildTokenValue.value.trim() && "<!-".includes(parentsLastChildTokenValue.value[left(parentsLastChildTokenValue.value, parentsLastChildTokenValue.value.length)])) {
            // the text token might be in parent token's children array, as
            // last element, for example, consider the AST of:
            // <!--[if !mso]><!--><img src="gif"/>!--<![endif]-->
            // // findMalformed

            const capturedMalformedTagRanges = []; // Contents will be objects like:
            // {
            //   idxFrom: 3,
            //   idxTo: 9
            // }

            findMalformed(parentsLastChildTokenValue.value, "<!--", obj => {
              capturedMalformedTagRanges.push(obj);
            }, {
              maxDistance: 2
            });

            if (capturedMalformedTagRanges.length && !right(parentsLastChildTokenValue.value, capturedMalformedTagRanges[capturedMalformedTagRanges.length - 1].idxTo - 1)) { // pick the last
              // imagine, there were multiple malformed opening comments:
              // <!--[if !mso]><!--><img src="gif"/>!--!--!--!--<![endif]-->

              const malformedRange = capturedMalformedTagRanges.pop(); // is the whole text token to be merged into the closing comment token,
              // or were there characters in front of text token which remain and
              // form the shorter, text token?

              if (!left(parentsLastChildTokenValue.value, malformedRange.idxFrom) && previousPath && isObj(parentsLastChildTokenValue)) { // if there are no whitespace characters to the left of "from" index
                // of the malformed "<!--", this means whole token is a malformed
                // value and needs to be merged into current "comment" type token
                // and its kind should be changed from "only" to "not".

                if (tokensWithChildren.includes(tokenObj.type)) {
                  tokenObj.children = [];
                } // 1. Insert current node. The path for current token remains the same - text node was among
                // the previous token's children tokens


                op.set(res, path, { ...tokenObj,
                  start: malformedRange.idxFrom + parentsLastChildTokenValue.start,
                  kind: "not",
                  value: `${parentsLastChildTokenValue.value}${tokenObj.value}`
                }); // 2. Delete the text node.
                op.del(res, `${previousPath}.children.${op.get(res, previousPath).children.length - 1}`); // stop token from being pushed in the ELSE clauses below

                tokenTakenCareOf = true;
              } else if (previousPath && isObj(parentsLastChildTokenValue) && parentsLastChildTokenPath) { // if there are text characters which are not part of "<!--",
                // shorten the text token, push a new comment token // 1. tweak the "text" token

                op.set(res, parentsLastChildTokenPath, { ...parentsLastChildTokenValue,
                  end: malformedRange.idxFrom + parentsLastChildTokenValue.start,
                  value: parentsLastChildTokenValue.value.slice(0, malformedRange.idxFrom)
                }); // 2. tweak the current "comment" token

                if (tokensWithChildren.includes(tokenObj.type)) {
                  tokenObj.children = [];
                }

                op.set(res, path, { ...tokenObj,
                  start: malformedRange.idxFrom + parentsLastChildTokenValue.start,
                  kind: "not",
                  value: `${parentsLastChildTokenValue.value.slice(malformedRange.idxFrom)}${tokenObj.value}`
                }); // stop token from being pushed in the ELSE clauses below

                tokenTakenCareOf = true;
              }
            }
          }
        } // if token was not pushed yet, push it

        if (!tokenTakenCareOf) {

          if (tokensWithChildren.includes(tokenObj.type)) {
            tokenObj.children = [];
          }

          op.set(res, path, tokenObj);
        } //
        // CHECK CHILD-PARENT MATCH
        //

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
        } // SET a new previous token's value


        lastProcessedToken = { ...tokenObj
        }; //
        // LOGGING
        //
      } //
      //
      //
      //
      //
      //
      //
      //
      //              TAG CALLBACK ENDS
      //
      //
      //
      //
      //
      //
      //
      //

    },
    charCb: opts.charCb
  }); // if there are some unclosed layer tokens, raise errors about them all:

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
} // -----------------------------------------------------------------------------

export { cparser, defaults, version };
