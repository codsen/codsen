/**
 * codsen-parser
 * Parser aiming at broken or mixed code, especially HTML & CSS
 * Version: 0.9.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/codsen-parser/
 */

import { pathNext, pathUp, pathPrev } from 'ast-monkey-util';
import { findMalformed } from 'string-find-malformed';
import { left, right } from 'string-left-right';
import { tokenizer } from 'codsen-tokenizer';
import op from 'object-path';

var version = "0.9.2";

/* eslint no-use-before-define: 0 */
const version$1 = version;
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
  console.log(`013 layerPending() received: `);
  console.log(`015 - 1.${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(layers, null, 4)}`);
  console.log(`022 - 2. ${`\u001b[${33}m${`tokenObj`}\u001b[${39}m`} = ${JSON.stringify(tokenObj, null, 4)}`);
  console.log(`029 >>>>>> ${`\u001b[${33}m${`layers[layers.length - 1].tagName`}\u001b[${39}m`} = ${JSON.stringify(layers.length && isObj(layers[layers.length - 1]) && layers[layers.length - 1].tagName ? layers[layers.length - 1].tagName : null, null, 4)}`);
  console.log(`040 >>>>>> ${`\u001b[${33}m${`tokenObj.tagName`}\u001b[${39}m`} = ${JSON.stringify(tokenObj.tagName, null, 4)}`);
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
      //
      console.log(`-`.repeat(100));
      console.log(`247 ██ ${`\u001b[${33}m${`INCOMING TOKEN`}\u001b[${39}m`}:\n${JSON.stringify({
        type: tokenObj.type,
        tagName: tokenObj.tagName,
        start: tokenObj.start,
        end: tokenObj.end,
        value: tokenObj.value,
        kind: tokenObj.kind,
        closing: tokenObj.closing
      }, null, 4)}`);
      console.log(`262 FIY, ${`\u001b[${33}m${`NEXT`}\u001b[${39}m`} = ${JSON.stringify(next, null, 4)}`);
      console.log(`269 FIY, STARTING ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(layers, null, 4)}`); // pass the token to the 3rd parties through opts.tagCb

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

        console.log(`298 FIY, ${`\u001b[${33}m${`prevToken`}\u001b[${39}m`} = ${JSON.stringify(prevToken, null, 4)}`);
        console.log(`305 FIY, ${`\u001b[${33}m${`lastProcessedToken`}\u001b[${39}m`} = ${JSON.stringify(lastProcessedToken, null, 4)}`);

        if (nestNext && // ensure it's not a closing tag of a pair, in which case
        // don't nest it!
        !tokenObj.closing && (!prevToken || !(prevToken.tagName === tokenObj.tagName && !prevToken.closing && tokenObj.closing)) && !layerPending(layers, tokenObj) && ( //
        // --------
        // imagine the case:
        // <div><a> </div>
        // we don't want to nest that space text token under "a" if the following
        // token </div> closes the pending layer -
        // this means matching token that comes next against second layer
        // behind (the layers[layers.length - 3] below):
        // --------
        //
        !next.length || !(tokenObj.type === "text" && next[0].type === "tag" && (next[0].closing && lastProcessedToken.closing || // ensure it's not a legit closing tag following:
        layers[layers.length - 3] && next[0].tagName !== layers[layers.length - 1].tagName && layers[layers.length - 3].type === "tag" && !layers[layers.length - 3].closing && next[0].tagName === layers[layers.length - 3].tagName)))) {
          // 1. reset the flag
          nestNext = false; // 2. go deeper
          // "1.children.3" -> "1.children.3.children.0"

          console.log(`352 ${`\u001b[${35}m${`██ NEST`}\u001b[${39}m`}`);
          path = `${path}.children.0`;
        } else if (tokenObj.closing && typeof path === "string" && path.includes(".") && ( // ensure preceding token was not an opening counterpart:
        !tokenObj.tagName || lastProcessedToken.tagName !== tokenObj.tagName || lastProcessedToken.closing)) {
          // goes up and then bumps,
          // "1.children.3" -> "2"
          console.log(`365 ${`\u001b[${35}m${`██ UP`}\u001b[${39}m`}`);
          path = pathNext(pathUp(path));

          if (layerPending(layers, tokenObj)) {
            console.log(`370 current token was pending, so we pop() it from layers`); //
            // in case of comment layers, there can be more layers leading
            // up to this, so more popping might be needed.
            // Imagine <!--<a><a><a><a><a><a>-->
            //                                ^
            //                              we're here

            while (layers.length && layers[layers.length - 1].type !== tokenObj.type && layers[layers.length - 1].kind !== tokenObj.kind) {
              layers.pop();
            }

            layers.pop();
            console.log(`388 POP layers, now equals to: ${JSON.stringify(layers, null, 4)}`);
            nestNext = false;
            console.log(`397 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nestNext`}\u001b[${39}m`}: ${nestNext}`);
          } else {
            console.log(`401 ${`\u001b[${31}m${`layer for "${tokenObj.value}" was not pending!`}\u001b[${39}m`}`);
            console.log(`404 ${`\u001b[${31}m${`yet this was a closing token`}\u001b[${39}m`}`); // if this is a gap and current token closes parent token,
            // go another level up

            if (layers.length > 1 && tokenObj.tagName && tokenObj.tagName === layers[layers.length - 2].tagName) {
              console.log(`415 ${`\u001b[${32}m${`THIS WAS A GAP`}\u001b[${39}m`}`); // 1. amend the path

              path = pathNext(pathUp(path));
              console.log(`421 ${`\u001b[${35}m${`██ UP again`}\u001b[${39}m`}`); // 2. report the last layer's token as missing closing

              if (typeof opts.errCb === "function") {
                const lastLayersToken = layers[layers.length - 1];
                console.log(`429 ${`\u001b[${31}m${`██ RAISE ERROR`}\u001b[${39}m`} ${lastLayersToken.type}${lastLayersToken.type === "comment" ? `-${lastLayersToken.kind}` : ""}-missing-closing`);
                opts.errCb({
                  ruleId: `${lastLayersToken.type}${lastLayersToken.type === "comment" ? `-${lastLayersToken.kind}` : ""}-missing-closing`,
                  idxFrom: lastLayersToken.start,
                  idxTo: lastLayersToken.end,
                  tokenObj: lastLayersToken
                });
              } // 3. clean up the layers


              layers.pop();
              layers.pop();
              console.log(`454 POP layers twice, now equals to: ${JSON.stringify(layers, null, 4)}`);
            } else if ( // so it's a closing tag (</table> in example below)
            // and it was not pending (meaning opening heads were not in front)
            // and this token is tag and it's closing the second layer backwards
            // imagine code: <table><tr><td>x</td><a></table>
            // imagine on </table> we have layers:
            // <table>, <tr>, <a> - so <a> is rogue, maybe in its place the
            // </tr> was meant to be, hance the second layer backwards,
            // the "layers[layers.length - 3]"
            layers.length > 2 && layers[layers.length - 3].type === tokenObj.type && layers[layers.length - 3].type === tokenObj.type && layers[layers.length - 3].tagName === tokenObj.tagName) {
              console.log(`475 ${`\u001b[${32}m${`PREVIOUS TAG WAS ROGUE OPENING`}\u001b[${39}m`}`); // 1. amend the path

              path = pathNext(pathUp(path));
              console.log(`481 ${`\u001b[${35}m${`██ UP again`}\u001b[${39}m`}`); // 2. report the last layer's token as missing closing

              if (typeof opts.errCb === "function") {
                const lastLayersToken = layers[layers.length - 1];
                console.log(`489 ${`\u001b[${31}m${`██ RAISE ERROR`}\u001b[${39}m`} tag-rogue [${lastLayersToken.start}, ${lastLayersToken.end}]`);
                opts.errCb({
                  ruleId: `tag-rogue`,
                  idxFrom: lastLayersToken.start,
                  idxTo: lastLayersToken.end,
                  tokenObj: lastLayersToken
                });
              } // 3. pop all 3


              layers.pop();
              layers.pop();
              layers.pop();
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
            layers.length > 1 && layers[layers.length - 2].type === tokenObj.type && layers[layers.length - 2].type === tokenObj.type && layers[layers.length - 2].tagName === tokenObj.tagName) {
              console.log(`522 ${`\u001b[${32}m${`PREVIOUS TAG WAS ROGUE CLOSING`}\u001b[${39}m`}`); // 1. don't amend the path, because this rogue closing tag has
              // already triggered "UP", tree is fine
              // 2. report the last layer's token as missing closing

              if (typeof opts.errCb === "function") {
                const lastLayersToken = layers[layers.length - 1];
                console.log(`533 ${`\u001b[${31}m${`██ RAISE ERROR`}\u001b[${39}m`} tag-rogue [${lastLayersToken.start}, ${lastLayersToken.end}]`);
                opts.errCb({
                  ruleId: `tag-rogue`,
                  idxFrom: lastLayersToken.start,
                  idxTo: lastLayersToken.end,
                  tokenObj: lastLayersToken
                });
              } // 3. pop all 2


              layers.pop();
              layers.pop();
            } else {
              console.log(`549 ELSE clauses - TODO`); // if next tag closes second-to-last layer,
              // pop this last layer
              // if () {
              //   // TODO
              // }
            }
          }
        } else if (!path) {
          // it's the first element - push the token into index 0
          console.log(`560 ${`\u001b[${35}m${`██ FIRST`}\u001b[${39}m`}`);
          path = "0";
        } else {
          // bumps the index,
          // "1.children.3" -> "1.children.4"
          console.log(`565 ${`\u001b[${35}m${`██ BUMP`}\u001b[${39}m`}`);
          path = pathNext(path);

          if (layerPending(layers, tokenObj)) {
            layers.pop();
            console.log(`571 POP layers, now equals to: ${JSON.stringify(layers, null, 4)}`);
          }
        }

        console.log(`${`\u001b[${90}m${`----------------- path calculations done -----------------`}\u001b[${39}m`}`); // activate the nestNext

        if (tokensWithChildren.includes(tokenObj.type) && !tokenObj.void && Object.prototype.hasOwnProperty.call(tokenObj, "closing") && !tokenObj.closing) {
          nestNext = true;
          console.log(`593 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nestNext`}\u001b[${39}m`} = true`);

          if (!tokenObj.kind || !tagNamesThatDontHaveClosings.includes(tokenObj.kind)) {
            layers.push({ ...tokenObj
            });
            console.log(`599 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to layers, which is now: ${JSON.stringify(layers, null, 4)}`);
          }
        }

        console.log(`609 FIY, ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${path}`); // check, does this closing tag have an
        // opening counterpart

        const previousPath = pathPrev(path) || ""; // console.log(
        //   `269 ${`\u001b[${33}m${`previousPath`}\u001b[${39}m`} = ${JSON.stringify(
        //     previousPath,
        //     null,
        //     4
        //   )}`
        // );

        const parentPath = pathUp(path);
        console.log(`624 ${`\u001b[${33}m${`parentPath`}\u001b[${39}m`} = ${JSON.stringify(parentPath, null, 4)}`);
        let parentTagsToken;

        if (parentPath && path.includes(".")) {
          parentTagsToken = op.get(res, parentPath);
        }

        console.log(`636 ${`\u001b[${33}m${`parentTagsToken`}\u001b[${39}m`} at path "${`\u001b[${33}m${parentPath}\u001b[${39}m`}" - ${JSON.stringify(parentTagsToken ? { ...parentTagsToken,
          children: "..."
        } : parentTagsToken, null, 4)}`);
        let previousTagsToken;

        if (previousPath) {
          previousTagsToken = op.get(res, previousPath);
        }

        console.log(`650 NOW ${`\u001b[${33}m${`previousTagsToken`}\u001b[${39}m`} at path "${`\u001b[${33}m${previousPath}\u001b[${39}m`}" - ${JSON.stringify(previousTagsToken, null, 4)}`);
        console.log(`657 FIY, ${`\u001b[${33}m${`tokenObj.closing`}\u001b[${39}m`} = ${JSON.stringify(tokenObj.closing, null, 4)}`); //
        // AST CORRECTION PART
        //
        // We change nodes where we recognise the error.
        //

        console.log(`671 ${`\u001b[${33}m${`res`}\u001b[${39}m`} BEFORE: ${JSON.stringify(res, null, 4)}`); // case of "a<!--b->c", current token being "text" type, value "b->c"

        const suspiciousCommentTagEndingRegExp = /(-+|-+[^>])>/;
        let parentsLastChildTokenValue;
        let parentsLastChildTokenPath;

        if (isObj(previousTagsToken) && Array.isArray(previousTagsToken.children) && previousTagsToken.children.length && previousTagsToken.children[previousTagsToken.children.length - 1]) {
          parentsLastChildTokenValue = previousTagsToken.children[previousTagsToken.children.length - 1];
          parentsLastChildTokenPath = `${previousPath}.children.${op.get(res, previousPath).children.length - 1}`;
        }

        let tokenTakenCareOf = false;
        console.log(`699 FIY, ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(layers, null, 4)}`);

        if (tokenObj.type === "text" && isObj(parentTagsToken) && parentTagsToken.type === "comment" && parentTagsToken.kind === "simple" && !parentTagsToken.closing && suspiciousCommentTagEndingRegExp.test(tokenObj.value)) {
          console.log(`714 ${`\u001b[${31}m${`██ intervention needed`}\u001b[${39}m`}`);
          const suspiciousEndingStartsAt = (suspiciousCommentTagEndingRegExp.exec(tokenObj.value) || {}).index;
          const suspiciousEndingEndsAt = (suspiciousEndingStartsAt || 0) + tokenObj.value.slice(suspiciousEndingStartsAt).indexOf(">") + 1;
          console.log(`724 SUSPICIOUS ENDING: [${`\u001b[${33}m${`suspiciousEndingStartsAt`}\u001b[${39}m`} = ${JSON.stringify(suspiciousEndingStartsAt, null, 4)}, ${`\u001b[${33}m${`suspiciousEndingEndsAt`}\u001b[${39}m`} = ${JSON.stringify(suspiciousEndingEndsAt, null, 4)}] - value: "${tokenObj.value.slice(suspiciousEndingStartsAt, suspiciousEndingEndsAt)}"`); // part 1.
          // if any text precedes the "->" that text goes in as normal,
          // at this level, under this path:

          if (suspiciousEndingStartsAt && suspiciousEndingStartsAt > 0) {
            console.log(`743 ${`\u001b[${32}m${`ADD`}\u001b[${39}m`} text leading up to "->"`);
            console.log(`746 ${`\u001b[${33}m${`res`}\u001b[${39}m`} BEFORE: ${JSON.stringify(res, null, 4)}`);
            op.set(res, path, { ...tokenObj,
              end: tokenObj.start + suspiciousEndingStartsAt,
              value: tokenObj.value.slice(0, suspiciousEndingStartsAt)
            });

            if (tokensWithChildren.includes(tokenObj.type)) {
              tokenObj.children = [];
            }

            console.log(`761 ${`\u001b[${33}m${`res`}\u001b[${39}m`} AFTER: ${JSON.stringify(res, null, 4)}`);
          } // part 2.
          // further, the "->" goes as closing token at parent level


          console.log(`772 OLD ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${path}`);
          path = pathNext(pathUp(path));
          console.log(`776 NEW ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${path}`);
          op.set(res, path, {
            type: "comment",
            kind: "simple",
            closing: true,
            start: tokenObj.start + (suspiciousEndingStartsAt || 0),
            end: tokenObj.start + suspiciousEndingEndsAt,
            value: tokenObj.value.slice(suspiciousEndingStartsAt, suspiciousEndingEndsAt),
            children: []
          });
          console.log(`791 ${`\u001b[${33}m${`res`}\u001b[${39}m`} AFTER: ${JSON.stringify(res, null, 4)}`); // part 3.
          // if any text follows "->" add that after

          if (suspiciousEndingEndsAt < tokenObj.value.length) {
            console.log(`802 OLD ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${path}`);
            path = pathNext(path);
            console.log(`806 NEW ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${path}`);
            op.set(res, path, {
              type: "text",
              start: tokenObj.start + suspiciousEndingEndsAt,
              end: tokenObj.end,
              value: tokenObj.value.slice(suspiciousEndingEndsAt)
            });
            console.log(`815 ${`\u001b[${33}m${`res`}\u001b[${39}m`} AFTER: ${JSON.stringify(res, null, 4)}`);
          } // part 4.
          // stop token from being pushed in the ELSE clauses below


          tokenTakenCareOf = true; //
        } else if (tokenObj.type === "comment" && tokenObj.kind === "only" && isObj(previousTagsToken)) {
          console.log(`833 ${`\u001b[${31}m${`██ intervention needed`}\u001b[${39}m`}`); // check "only" kind comment-type tokens for malformed front parts,
          // "<!--", which would turn them into "not" kind comment-type tokens

          if (previousTagsToken.type === "text" && previousTagsToken.value.trim() && "<!-".includes(previousTagsToken.value[left(previousTagsToken.value, previousTagsToken.value.length)])) {
            // if "only" kind token is preceded by something that resembles
            // opening HTML comment ("simple" kind), that might be first part
            // of "not" kind comment:
            //
            // <img/><--<![endif]-->
            //       ^
            //      excl. mark missing on the first part ("<!--")
            console.log(`854 ${`\u001b[${31}m${`MALFORMED "NOT" COMMENT`}\u001b[${39}m`}`); // findMalformed

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
            console.log(`874 ${`\u001b[${33}m${`capturedMalformedTagRanges`}\u001b[${39}m`} = ${JSON.stringify(capturedMalformedTagRanges, null, 4)}`);

            if (capturedMalformedTagRanges.length && !right(previousTagsToken.value, capturedMalformedTagRanges[capturedMalformedTagRanges.length - 1].idxTo - 1)) {
              console.log(`889 picking the last malformed range`); // pick the last
              // imagine, there were multiple malformed opening comments:
              // <img/><1--<1--<1--<1--<![endif]-->

              const malformedRange = capturedMalformedTagRanges.pop();
              console.log(`895 ${`\u001b[${33}m${`malformedRange`}\u001b[${39}m`} = ${JSON.stringify(malformedRange, null, 4)}`); // is the whole text token to be merged into the closing comment token,
              // or were there characters in front of text token which remain and
              // form the shorter, text token?

              if (!left(previousTagsToken.value, malformedRange.idxFrom) && previousPath && isObj(previousTagsToken)) {
                console.log(`911 whole token is malformed <!--`); // if there are no whitespace characters to the left of "from" index
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
              } else if (previousPath && isObj(previousTagsToken)) {
                console.log(`931 there are characters in front of <!--`); // if there are text characters which are not part of "<!--",
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
            //
            console.log(`980 ${`\u001b[${31}m${`MALFORMED "NOT" COMMENT`}\u001b[${39}m`}`); // findMalformed

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
            console.log(`1000 ${`\u001b[${33}m${`capturedMalformedTagRanges`}\u001b[${39}m`} = ${JSON.stringify(capturedMalformedTagRanges, null, 4)}`);

            if (capturedMalformedTagRanges.length && !right(parentsLastChildTokenValue.value, capturedMalformedTagRanges[capturedMalformedTagRanges.length - 1].idxTo - 1)) {
              console.log(`1015 picking the last malformed range`); // pick the last
              // imagine, there were multiple malformed opening comments:
              // <!--[if !mso]><!--><img src="gif"/>!--!--!--!--<![endif]-->

              const malformedRange = capturedMalformedTagRanges.pop();
              console.log(`1021 ${`\u001b[${33}m${`malformedRange`}\u001b[${39}m`} = ${JSON.stringify(malformedRange, null, 4)}`); // is the whole text token to be merged into the closing comment token,
              // or were there characters in front of text token which remain and
              // form the shorter, text token?

              if (!left(parentsLastChildTokenValue.value, malformedRange.idxFrom) && previousPath && isObj(parentsLastChildTokenValue)) {
                console.log(`1040 whole token is malformed <!--`); // if there are no whitespace characters to the left of "from" index
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

                console.log(`1061 ██ ${`\u001b[${33}m${`previousPath`}\u001b[${39}m`} = ${JSON.stringify(previousPath, null, 4)}`);
                console.log(`1068 DELETING TEXT NODE - RES BEFORE: ${JSON.stringify(res, null, 4)}`);
                op.del(res, `${previousPath}.children.${op.get(res, previousPath).children.length - 1}`);
                console.log(`1081 DELETING TEXT NODE - RES AFTER: ${JSON.stringify(res, null, 4)}`); // stop token from being pushed in the ELSE clauses below

                tokenTakenCareOf = true;
              } else if (previousPath && isObj(parentsLastChildTokenValue) && parentsLastChildTokenPath) {
                console.log(`1095 there are characters preceding <!--`); // if there are text characters which are not part of "<!--",
                // shorten the text token, push a new comment token

                console.log(`1100 FIY, ${`\u001b[${33}m${`parentsLastChildTokenPath`}\u001b[${39}m`} = ${JSON.stringify(parentsLastChildTokenPath, null, 4)}`); // 1. tweak the "text" token

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
        }

        console.log(`1140 ███████████████████████████████████████ the bottom clauses`);
        console.log(`1143 FIY, ${`\u001b[${33}m${`next`}\u001b[${39}m`} = ${JSON.stringify(next, null, 4)}`);
        console.log(`1150 FIY, ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(layers, null, 4)}`); // if token was not pushed yet, push it

        if (!tokenTakenCareOf) {
          console.log(`1159 setting as usual`);

          if (tokensWithChildren.includes(tokenObj.type)) {
            tokenObj.children = [];
          }

          op.set(res, path, tokenObj);
        }

        console.log(`1167 ${`\u001b[${33}m${`res`}\u001b[${39}m`} AFTER: ${JSON.stringify(res, null, 4)}`);
        console.log(`1175 ENDING ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${JSON.stringify(path, null, 4)}`); //
        // CHECK CHILD-PARENT MATCH
        //

        if (tokensWithChildren.includes(tokenObj.type) && tokenObj.closing && (!previousPath || !isObj(previousTagsToken) || previousTagsToken.closing || previousTagsToken.type !== tokenObj.type || previousTagsToken.tagName !== tokenObj.tagName)) {
          if (tokenObj.void) {
            console.log(`1197 frontal slash must be removed because it's a void tag`);

            if (typeof opts.errCb === "function") {
              console.log(`1201 ${`\u001b[${31}m${`██ RAISE ERROR tag-void-frontal-slash`}\u001b[${39}m`}`);
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
            console.log(`1214 it's an unpaired tag`);

            if (typeof opts.errCb === "function") {
              console.log(`1217 ${`\u001b[${31}m${`██ RAISE ERROR`}\u001b[${39}m`} ${tokenObj.type}${tokenObj.type === "comment" ? `-${tokenObj.kind}` : ""}-missing-opening`);
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

        console.log(`${`\u001b[${90}m${`---`}\u001b[${39}m`}`);
        console.log(`${`\u001b[${90}m${`██ nestNext = ${`\u001b[${nestNext ? 32 : 31}m${nestNext}\u001b[${39}m`}`}\u001b[${39}m`}`);
        console.log(`${`\u001b[${90}m${`██ layers = ${JSON.stringify(layers, null, 4)}`}\u001b[${39}m`}`);
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
  });
  console.log(`-`.repeat(80));
  console.log(`1279 FIY, ENDING ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(layers, null, 4)}`); // if there are some unclosed layer tokens, raise errors about them all:

  if (layers.length) {
    layers.forEach(tokenObj => {
      if (typeof opts.errCb === "function") {
        console.log(`1290 ${`\u001b[${31}m${`██ RAISE ERROR`}\u001b[${39}m`} ${tokenObj.type}${tokenObj.type === "comment" ? `-${tokenObj.kind}` : ""}-missing-closing`);
        opts.errCb({
          ruleId: `${tokenObj.type}${tokenObj.type === "comment" ? `-${tokenObj.kind}` : ""}-missing-closing`,
          idxFrom: tokenObj.start,
          idxTo: tokenObj.end,
          tokenObj
        });
      }
    });
  }

  console.log(`1309 ${`\u001b[${32}m${`FINAL RETURN`}\u001b[${39}m`} ${JSON.stringify(res, null, 4)}`);
  return res;
} // -----------------------------------------------------------------------------

export { cparser, defaults, version$1 as version };
