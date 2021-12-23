/* eslint no-use-before-define: 0 */

import { pathNext, pathPrev, pathUp } from "ast-monkey-util";
import { findMalformed } from "string-find-malformed";
import { left, right } from "string-left-right";
import { tokenizer } from "codsen-tokenizer";
import type { Ranges } from "../../../ops/typedefs/common";
import op from "object-path";
import type {
  TagToken,
  TextToken,
  CommentToken,
  RuleToken,
  AtToken,
  EspToken,
  CharCb,
} from "codsen-tokenizer";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

type Severity = 0 | 1 | 2;
interface ErrorObj {
  ruleId?: string;
  message: string;
  idxFrom: number;
  idxTo: number;
  fix: null | { ranges: Ranges };
  severity?: Severity;
  keepSeparateWhenFixing?: boolean;
}

interface IdxRangeObj {
  idxFrom: number;
  idxTo: number;
}

// tokenizer doesn't have "children" property, parser, this program,
// adds this extra data, so we need to extend the types accordingly:
interface TagTokenWithChildren extends TagToken {
  children: TokenWithChildren[];
}
interface CommentTokenWithChildren extends CommentToken {
  children: TokenWithChildren[];
}
type TokenWithChildren =
  | TextToken
  | TagTokenWithChildren
  | RuleToken
  | AtToken
  | CommentTokenWithChildren
  | EspToken;

interface SupplementedErrorObj extends ErrorObj {
  tokenObj: TokenWithChildren;
}

type ErrCb = (obj: Partial<SupplementedErrorObj>) => void;

interface Opts {
  reportProgressFunc: null | ((percDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
  tagCb: null | ((obj: TokenWithChildren) => void);
  charCb: null | CharCb;
  errCb: null | ErrCb;
}

const defaults: Opts = {
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
  tagCb: null,
  charCb: null,
  errCb: null,
};

function isObj(something: any): boolean {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}
function layerPending(
  layers: TokenWithChildren[],
  tokenObj: TokenWithChildren
): boolean {
  DEV && console.log(`090 layerPending() received: `);
  DEV &&
    console.log(
      `093 - 1.${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
        layers,
        null,
        4
      )}`
    );
  DEV &&
    console.log(
      `101 - 2. ${`\u001b[${33}m${`tokenObj`}\u001b[${39}m`} = ${JSON.stringify(
        tokenObj,
        null,
        4
      )}`
    );
  DEV &&
    console.log(
      `109 >>>>>> ${`\u001b[${33}m${`layers[layers.length - 1].tagName`}\u001b[${39}m`} = ${JSON.stringify(
        layers.length &&
          isObj(layers[layers.length - 1]) &&
          (layers[layers.length - 1] as any).tagName
          ? (layers[layers.length - 1] as any).tagName
          : null,
        null,
        4
      )}`
    );
  DEV &&
    console.log(
      `121 >>>>>> ${`\u001b[${33}m${`tokenObj.tagName`}\u001b[${39}m`} = ${JSON.stringify(
        (tokenObj as any).tagName,
        null,
        4
      )}`
    );
  return (
    // usual closing case
    (tokenObj as any).closing &&
    layers.length &&
    ((layers[layers.length - 1].type === tokenObj.type &&
      Object.prototype.hasOwnProperty.call(
        layers[layers.length - 1],
        "tagName"
      ) &&
      Object.prototype.hasOwnProperty.call(tokenObj, "tagName") &&
      (layers[layers.length - 1] as TagToken).tagName ===
        (tokenObj as TagToken).tagName &&
      (layers[layers.length - 1] as TagToken).closing === false) ||
      // OR,
      // rarer cases - any closing comment tag will close the layer, with
      // condition that opening exists among layers:
      // for example, consider <!--x<a>-->
      // <!-- is one layer
      // <a> is another layer
      // but
      // --> comes in and closes the last opening comment, it does not matter
      // that html tag layer hasn't been closed - comment tags take priority
      (tokenObj.type === "comment" &&
        layers.some(
          (layerObjToken) =>
            Object.prototype.hasOwnProperty.call(layerObjToken, "closing") &&
            !(layerObjToken as CommentToken).closing
        )))
  );
}

/**
 * Parser aiming at broken or mixed code, especially HTML & CSS
 */
function cparser(str: string, originalOpts?: Partial<Opts>): any[] {
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
    originalOpts &&
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
    originalOpts &&
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
    originalOpts &&
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
    originalOpts &&
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

  //
  //
  //
  //
  //
  //
  //
  // OPTS
  // ---------------------------------------------------------------------------

  let opts: Opts = { ...defaults, ...originalOpts };

  //
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
  let layers: TokenWithChildren[] = [];

  let res: any[] = [];

  // this flag is used to give notice
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

  let lastProcessedToken: any = {};

  let tokensWithChildren = ["tag", "comment"];

  let tagNamesThatDontHaveClosings = ["doctype"];

  // Call codsen-tokenizer. It works through callbacks,
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

      DEV && console.log(`-`.repeat(100));
      DEV &&
        console.log(
          `329 ██ ${`\u001b[${33}m${`INCOMING TOKEN`}\u001b[${39}m`}:\n${JSON.stringify(
            {
              type: tokenObj.type,
              tagName: (tokenObj as any).tagName,
              start: tokenObj.start,
              end: tokenObj.end,
              value: tokenObj.value,
              kind: (tokenObj as any).kind,
              closing: (tokenObj as any).closing,
            },
            null,
            4
          )}`
        );
      DEV &&
        console.log(
          `345 FIY, ${`\u001b[${33}m${`NEXT`}\u001b[${39}m`} = ${JSON.stringify(
            next,
            null,
            4
          )}`
        );
      DEV &&
        console.log(
          `353 FIY, STARTING ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
            layers,
            null,
            4
          )}`
        );
      // pass the token to the 3rd parties through opts.tagCb
      if (typeof opts.tagCb === "function") {
        (opts.tagCb as any)(tokenObj);
      }

      // tokenizer pings nested "rule" and "at" rule tokens separately,
      // which means, there might be duplication. To consume each "rule" and "at"
      // only once, we have to ensure their "nested" key is false.

      if (!(tokenObj as any).nested) {
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
        DEV &&
          console.log(
            `383 FIY, ${`\u001b[${33}m${`prevToken`}\u001b[${39}m`} = ${JSON.stringify(
              prevToken,
              null,
              4
            )}`
          );
        DEV &&
          console.log(
            `391 FIY, ${`\u001b[${33}m${`lastProcessedToken`}\u001b[${39}m`} = ${JSON.stringify(
              lastProcessedToken,
              null,
              4
            )}`
          );

        if (
          nestNext &&
          // ensure it's not a closing tag of a pair, in which case
          // don't nest it!
          !(tokenObj as any).closing &&
          // also don't nest under closing tag
          (!lastProcessedToken.closing ||
            // unless it's a comment tag
            (lastProcessedToken.type === "comment" &&
              // and it's an HTML comment
              lastProcessedToken.language === "html")) &&
          // also don't nest under text token
          lastProcessedToken.type !== "text" &&
          (!prevToken ||
            !(
              prevToken.tagName === (tokenObj as any).tagName &&
              !prevToken.closing &&
              (tokenObj as any).closing
            )) &&
          !layerPending(layers, tokenObj as TokenWithChildren)
        ) {
          // 1. reset the flag
          nestNext = false;

          // 2. go deeper
          // "1.children.3" -> "1.children.3.children.0"
          DEV && console.log(`424 ${`\u001b[${35}m${`██ NEST`}\u001b[${39}m`}`);
          path = `${path}.children.0`;
        } else if (
          (tokenObj as any).closing &&
          typeof path === "string" &&
          path.includes(".") &&
          // ensure preceding token was not an opening counterpart:
          (!(tokenObj as any).tagName ||
            lastProcessedToken.tagName !== (tokenObj as any).tagName ||
            lastProcessedToken.closing)
        ) {
          // goes up and then bumps,
          // "1.children.3" -> "2"
          DEV && console.log(`437 ${`\u001b[${35}m${`██ UP`}\u001b[${39}m`}`);

          // for comments, many layers could have been nested before
          // this closing comment, so we need to find out, at which level
          // above the opening comment layer was
          if (
            tokenObj.type === "comment" &&
            tokenObj.closing &&
            Array.isArray(layers) &&
            layers.length &&
            // there's opening comment layer somewhere above
            layers.some((l) => l.type === "comment" && l.kind === tokenObj.kind)
          ) {
            DEV && console.log(`450 standard comment path bump clauses`);
            // find out how many levels above that opening comment tag is
            let count = 0;
            for (let i = layers.length; i--; ) {
              path = pathNext(pathUp(path));
              if (
                layers[i].type === "comment" &&
                (layers[i] as CommentToken).kind === tokenObj.kind
              ) {
                break;
              }
              count++;
            }
            DEV &&
              console.log(
                `465 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`count`}\u001b[${39}m`} = ${JSON.stringify(
                  count,
                  null,
                  4
                )}; ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${JSON.stringify(
                  path,
                  null,
                  4
                )}`
              );
          } else {
            DEV && console.log(`476 standard comment path bump clauses`);
            path = pathNext(pathUp(path));
          }

          if (layerPending(layers, tokenObj as TokenWithChildren)) {
            DEV &&
              console.log(
                `483 current token was pending, so we pop() it from layers`
              );
            //
            // in case of comment layers, there can be more layers leading
            // up to this, so more popping might be needed.
            // Imagine <!--<a><a><a><a><a><a>-->
            //                                ^
            //                              we're here
            while (
              layers.length &&
              layers[layers.length - 1].type !== tokenObj.type &&
              (layers[layers.length - 1] as any).kind !== (tokenObj as any).kind
            ) {
              layers.pop();
            }

            layers.pop();
            DEV &&
              console.log(
                `502 POP layers, now equals to: ${JSON.stringify(
                  layers,
                  null,
                  4
                )}`
              );

            nestNext = false;
            DEV &&
              console.log(
                `512 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nestNext`}\u001b[${39}m`}: ${nestNext}`
              );
          } else {
            DEV &&
              console.log(
                `517 ${`\u001b[${31}m${`layer for "${tokenObj.value}" was not pending!`}\u001b[${39}m`}`
              );
            DEV &&
              console.log(
                `521 ${`\u001b[${31}m${`yet this was a closing token`}\u001b[${39}m`}`
              );

            if (
              layers.length &&
              (tokenObj as TagToken).tagName &&
              // (tokenObj as TagToken).tagName ===
              //   (layers[layers.length - 2] as TagToken).tagName
              layers.some(
                (layerObj) =>
                  layerObj.type === "tag" &&
                  layerObj.tagName === (tokenObj as TagToken).tagName
              )
            ) {
              // if this is a gap and current token closes parent token,
              // go another level up
              DEV &&
                console.log(
                  `539 ${`\u001b[${32}m${`THIS WAS A GAP`}\u001b[${39}m`}`
                );
              DEV &&
                console.log(
                  `543 FIY, ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${JSON.stringify(
                    path,
                    null,
                    4
                  )}`
                );

              DEV &&
                console.log(
                  `552 ${`\u001b[${36}m${`███████████████████████████████████████ WHILE STARTS`}\u001b[${39}m`} `
                );

              let lastLayer = layers.pop();
              let currTagName = (lastLayer as TagToken).tagName;
              // let i = 0;
              while (currTagName !== (tokenObj as TagToken).tagName) {
                DEV &&
                  console.log(
                    `561 ${`\u001b[${36}m${`==================`}\u001b[${39}m`}`
                  );
                // i++;

                // 1. report the last layer's token as missing closing
                if (lastLayer && typeof opts.errCb === "function") {
                  DEV &&
                    console.log(
                      `569 ${`\u001b[${31}m${`██ RAISE ERROR`}\u001b[${39}m`} ${
                        lastLayer.type
                      }${
                        lastLayer.type === "comment" ? `-${lastLayer.kind}` : ""
                      }-missing-closing at [${lastLayer.start}, ${
                        lastLayer.end
                      }]`
                    );
                  opts.errCb({
                    ruleId: `${lastLayer.type}${
                      lastLayer.type === "comment" ? `-${lastLayer.kind}` : ""
                    }-missing-closing`,
                    idxFrom: lastLayer.start,
                    idxTo: lastLayer.end,
                    tokenObj: lastLayer,
                  });
                }

                lastLayer = layers.pop();
                currTagName = (lastLayer as TagToken).tagName;

                path = pathNext(pathUp(path));

                DEV &&
                  console.log(
                    `594 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastLayer`}\u001b[${39}m`} = ${JSON.stringify(
                      lastLayer,
                      null,
                      4
                    )}; ${`\u001b[${33}m${`currTagName`}\u001b[${39}m`} = ${JSON.stringify(
                      currTagName,
                      null,
                      4
                    )}`
                  );

                DEV &&
                  console.log(
                    `607 ${`\u001b[${36}m${`ENDING`}\u001b[${39}m`} ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
                      layers,
                      null,
                      4
                    )}`
                  );
              }
              DEV &&
                console.log(
                  `616 ${`\u001b[${36}m${`███████████████████████████████████████ WHILE ENDS`}\u001b[${39}m`} `
                );

              DEV &&
                console.log(
                  `621 layers now: ${JSON.stringify(layers, null, 4)}`
                );
            } else if (
              // so it's a closing tag (</table> in example below)
              // and it was not pending (meaning opening heads were not in front)
              // and this token is tag and it's closing the first layer backwards
              // imagine code: <table><tr><td>x</td></a></table>
              // imagine we're on </table>
              // The </a> didn't open a new layer so we have layers:
              // <table>, <tr>
              // </tr> was meant to be instead of </a>,
              // the first layer backwards, the <table> does match our </table>
              // that's path "layers[layers.length - 2]"
              layers.length > 1 &&
              layers[layers.length - 2].type === tokenObj.type &&
              layers[layers.length - 2].type === tokenObj.type &&
              (layers[layers.length - 2] as any).tagName ===
                (tokenObj as any).tagName
            ) {
              DEV &&
                console.log(
                  `642 ${`\u001b[${32}m${`PREVIOUS TAG WAS ROGUE CLOSING`}\u001b[${39}m`}`
                );

              // 1. don't amend the path, because this rogue closing tag has
              // already triggered "UP", tree is fine

              // 2. report the last layer's token as missing closing
              if (typeof opts.errCb === "function") {
                let lastLayersToken = layers[layers.length - 1];

                DEV &&
                  console.log(
                    `654 ${`\u001b[${31}m${`██ RAISE ERROR`}\u001b[${39}m`} tag-rogue [${
                      lastLayersToken.start
                    }, ${lastLayersToken.end}]`
                  );
                (opts.errCb as any)({
                  ruleId: `tag-rogue`,
                  idxFrom: lastLayersToken.start,
                  idxTo: lastLayersToken.end,
                  tokenObj: lastLayersToken,
                });
              }

              // 3. pop all 2
              layers.pop();
              layers.pop();
            } else {
              DEV && console.log(`670 ELSE clauses - TODO`);
            }
          }
        } else if (!path) {
          // it's the first element - push the token into index 0
          DEV &&
            console.log(`676 ${`\u001b[${35}m${`██ FIRST`}\u001b[${39}m`}`);
          path = "0";
        } else {
          // bumps the index,
          // "1.children.3" -> "1.children.4"
          DEV && console.log(`681 ${`\u001b[${35}m${`██ BUMP`}\u001b[${39}m`}`);
          path = pathNext(path);

          if (layerPending(layers, tokenObj as TokenWithChildren)) {
            layers.pop();
            DEV &&
              console.log(
                `688 POP layers, now equals to: ${JSON.stringify(
                  layers,
                  null,
                  4
                )}`
              );
          }
        }

        DEV &&
          console.log(
            `${`\u001b[${90}m${`----------------- path calculations done -----------------`}\u001b[${39}m`}`
          );

        // activate the nestNext
        if (
          tokensWithChildren.includes(tokenObj.type) &&
          !(tokenObj as any).void &&
          Object.prototype.hasOwnProperty.call(tokenObj, "closing") &&
          !(tokenObj as any).closing
        ) {
          nestNext = true;
          DEV &&
            console.log(
              `712 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nestNext`}\u001b[${39}m`} = true`
            );

          if (
            !(tokenObj as any).kind ||
            !tagNamesThatDontHaveClosings.includes((tokenObj as any).kind)
          ) {
            layers.push({ ...(tokenObj as TokenWithChildren) });
            DEV &&
              console.log(
                `722 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to layers, which is now: ${JSON.stringify(
                  layers,
                  null,
                  4
                )}`
              );
          }
        }

        DEV &&
          console.log(
            `733 FIY, ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${path}`
          );

        // check, does this closing tag have an
        // opening counterpart
        let previousPath = pathPrev(path) || "";
        // DEV && console.log(
        //   `269 ${`\u001b[${33}m${`previousPath`}\u001b[${39}m`} = ${JSON.stringify(
        //     previousPath,
        //     null,
        //     4
        //   )}`
        // );
        let parentPath = pathUp(path);
        DEV &&
          console.log(
            `749 ${`\u001b[${33}m${`parentPath`}\u001b[${39}m`} = ${JSON.stringify(
              parentPath,
              null,
              4
            )}`
          );

        let parentTagsToken;
        if (parentPath && path.includes(".")) {
          parentTagsToken = op.get(res, parentPath);
        }
        DEV &&
          console.log(
            `762 ${`\u001b[${33}m${`parentTagsToken`}\u001b[${39}m`} at path "${`\u001b[${33}m${parentPath}\u001b[${39}m`}" - ${JSON.stringify(
              parentTagsToken
                ? { ...parentTagsToken, children: "..." }
                : parentTagsToken,
              null,
              4
            )}`
          );

        let previousTagsToken;
        if (previousPath) {
          previousTagsToken = op.get(res, previousPath);
        }
        DEV &&
          console.log(
            `777 NOW ${`\u001b[${33}m${`previousTagsToken`}\u001b[${39}m`} at path "${`\u001b[${33}m${previousPath}\u001b[${39}m`}" - ${JSON.stringify(
              previousTagsToken,
              null,
              4
            )}`
          );
        DEV &&
          console.log(
            `785 FIY, ${`\u001b[${33}m${`tokenObj.closing`}\u001b[${39}m`} = ${JSON.stringify(
              (tokenObj as any).closing,
              null,
              4
            )}`
          );

        //
        // AST CORRECTION PART
        //
        // We change nodes where we recognise the error.
        //

        DEV &&
          console.log(
            `800 ${`\u001b[${33}m${`res`}\u001b[${39}m`} BEFORE: ${JSON.stringify(
              res,
              null,
              4
            )}`
          );

        // case of "a<!--b->c", current token being "text" type, value "b->c"

        let suspiciousCommentTagEndingRegExp = /(-+|-+[^>])>/;
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

        DEV &&
          console.log(
            `829 FIY, ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
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
          DEV &&
            console.log(
              `845 ${`\u001b[${31}m${`██ intervention needed`}\u001b[${39}m`}`
            );
          let suspiciousEndingStartsAt = (
            suspiciousCommentTagEndingRegExp.exec(tokenObj.value) || {}
          ).index;

          let suspiciousEndingEndsAt =
            (suspiciousEndingStartsAt || 0) +
            tokenObj.value.slice(suspiciousEndingStartsAt).indexOf(">") +
            1;
          DEV &&
            console.log(
              `857 SUSPICIOUS ENDING: [${`\u001b[${33}m${`suspiciousEndingStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
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

          // part 1.
          // if any text precedes the "->" that text goes in as normal,
          // at this level, under this path:
          if (suspiciousEndingStartsAt && suspiciousEndingStartsAt > 0) {
            DEV &&
              console.log(
                `877 ${`\u001b[${32}m${`ADD`}\u001b[${39}m`} text leading up to "->"`
              );
            DEV &&
              console.log(
                `881 ${`\u001b[${33}m${`res`}\u001b[${39}m`} BEFORE: ${JSON.stringify(
                  res,
                  null,
                  4
                )}`
              );
            op.set(res, path, {
              ...tokenObj,
              end: tokenObj.start + suspiciousEndingStartsAt,
              value: tokenObj.value.slice(0, suspiciousEndingStartsAt),
            });
            if (tokensWithChildren.includes(tokenObj.type)) {
              (tokenObj as any).children = [];
            }
            DEV &&
              console.log(
                `897 ${`\u001b[${33}m${`res`}\u001b[${39}m`} AFTER: ${JSON.stringify(
                  res,
                  null,
                  4
                )}`
              );
          }

          // part 2.
          // further, the "->" goes as closing token at parent level
          DEV &&
            console.log(
              `909 OLD ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${path}`
            );
          path = pathNext(pathUp(path));
          DEV &&
            console.log(
              `914 NEW ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${path}`
            );
          op.set(res, path, {
            type: "comment",
            kind: "simple",
            closing: true,
            start: tokenObj.start + (suspiciousEndingStartsAt || 0),
            end: tokenObj.start + suspiciousEndingEndsAt,
            value: tokenObj.value.slice(
              suspiciousEndingStartsAt,
              suspiciousEndingEndsAt
            ),
            children: [],
          });
          DEV &&
            console.log(
              `930 ${`\u001b[${33}m${`res`}\u001b[${39}m`} AFTER: ${JSON.stringify(
                res,
                null,
                4
              )}`
            );

          // part 3.
          // if any text follows "->" add that after
          if (suspiciousEndingEndsAt < tokenObj.value.length) {
            DEV &&
              console.log(
                `942 OLD ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${path}`
              );
            path = pathNext(path);
            DEV &&
              console.log(
                `947 NEW ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${path}`
              );
            op.set(res, path, {
              type: "text",
              start: tokenObj.start + suspiciousEndingEndsAt,
              end: tokenObj.end,
              value: tokenObj.value.slice(suspiciousEndingEndsAt),
            });
            DEV &&
              console.log(
                `957 ${`\u001b[${33}m${`res`}\u001b[${39}m`} AFTER: ${JSON.stringify(
                  res,
                  null,
                  4
                )}`
              );
          }

          // part 4.
          // stop token from being pushed in the ELSE clauses below
          tokenTakenCareOf = true;
          //
        } else if (
          tokenObj.type === "comment" &&
          tokenObj.kind === "only" &&
          isObj(previousTagsToken)
        ) {
          DEV &&
            console.log(
              `976 ${`\u001b[${31}m${`██ intervention needed`}\u001b[${39}m`}`
            );
          // check "only" kind comment-type tokens for malformed front parts,
          // "<!--", which would turn them into "not" kind comment-type tokens
          if (
            previousTagsToken.type === "text" &&
            previousTagsToken.value.trim() &&
            "<!-".includes(
              previousTagsToken.value[
                left(
                  previousTagsToken.value,
                  previousTagsToken.value.length
                ) as number
              ]
            )
          ) {
            // if "only" kind token is preceded by something that resembles
            // opening HTML comment ("simple" kind), that might be first part
            // of "not" kind comment:
            //
            // <img/><--<![endif]-->
            //       ^
            //      excl. mark missing on the first part ("<!--")
            DEV &&
              console.log(
                `1001 ${`\u001b[${31}m${`MALFORMED "NOT" COMMENT`}\u001b[${39}m`}`
              );
            // findMalformed
            let capturedMalformedTagRanges: IdxRangeObj[] = [];
            // Contents will be objects like:
            // {
            //   idxFrom: 3,
            //   idxTo: 9
            // }
            findMalformed(
              previousTagsToken.value,
              "<!--",
              (obj) => {
                capturedMalformedTagRanges.push(obj as any);
              },
              {
                maxDistance: 2,
              }
            );
            DEV &&
              console.log(
                `1022 ${`\u001b[${33}m${`capturedMalformedTagRanges`}\u001b[${39}m`} = ${JSON.stringify(
                  capturedMalformedTagRanges,
                  null,
                  4
                )}`
              );
            if (
              capturedMalformedTagRanges.length &&
              !right(
                previousTagsToken.value,
                capturedMalformedTagRanges[
                  capturedMalformedTagRanges.length - 1
                ].idxTo - 1
              )
            ) {
              DEV && console.log(`1037 picking the last malformed range`);
              // pick the last
              // imagine, there were multiple malformed opening comments:
              // <img/><1--<1--<1--<1--<![endif]-->
              let malformedRange: IdxRangeObj =
                capturedMalformedTagRanges.pop() as any;
              DEV &&
                console.log(
                  `1045 ${`\u001b[${33}m${`malformedRange`}\u001b[${39}m`} = ${JSON.stringify(
                    malformedRange,
                    null,
                    4
                  )}`
                );

              // is the whole text token to be merged into the closing comment token,
              // or were there characters in front of text token which remain and
              // form the shorter, text token?

              if (
                !left(previousTagsToken.value, malformedRange.idxFrom) &&
                previousPath &&
                isObj(previousTagsToken)
              ) {
                DEV && console.log(`1061 whole token is malformed <!--`);
                // if there are no whitespace characters to the left of "from" index
                // of the malformed "<!--", this means whole token is a malformed
                // value and needs to be merged into current "comment" type token
                // and its kind should be changed from "only" to "not".
                if (tokensWithChildren.includes(tokenObj.type)) {
                  (tokenObj as any).children = [];
                }
                // path becomes the path of previous, text token - we overwrite it
                path = previousPath;
                op.set(res, path, {
                  ...tokenObj,
                  start:
                    malformedRange.idxFrom +
                    (previousTagsToken.start as number),
                  kind: "not",
                  value: `${previousTagsToken.value}${tokenObj.value}`,
                });

                // stop token from being pushed in the ELSE clauses below
                tokenTakenCareOf = true;
              } else if (previousPath && isObj(previousTagsToken)) {
                DEV &&
                  console.log(`1084 there are characters in front of <!--`);
                // if there are text characters which are not part of "<!--",
                // shorten the text token, push a new comment token

                // 1. tweak the "text" token
                op.set(res, previousPath, {
                  ...previousTagsToken,
                  end:
                    malformedRange.idxFrom +
                    (previousTagsToken.start as number),
                  value: previousTagsToken.value.slice(
                    0,
                    malformedRange.idxFrom
                  ),
                });

                // 2. tweak the current "comment" token
                if (tokensWithChildren.includes(tokenObj.type)) {
                  (tokenObj as any).children = [];
                }
                op.set(res, path, {
                  ...tokenObj,
                  start:
                    malformedRange.idxFrom +
                    (previousTagsToken.start as number),
                  kind: "not",
                  value: `${previousTagsToken.value.slice(
                    malformedRange.idxFrom
                  )}${tokenObj.value}`,
                });

                // stop token from being pushed in the ELSE clauses below
                tokenTakenCareOf = true;
              }
            }
          } else if (
            isObj(parentsLastChildTokenValue) &&
            parentsLastChildTokenValue.type === "text" &&
            parentsLastChildTokenValue.value.trim() &&
            "<!-".includes(
              parentsLastChildTokenValue.value[
                left(
                  parentsLastChildTokenValue.value,
                  parentsLastChildTokenValue.value.length
                ) as number
              ]
            )
          ) {
            // the text token might be in parent token's children array, as
            // last element, for example, consider the AST of:
            // <!--[if !mso]><!--><img src="gif"/>!--<![endif]-->
            //
            DEV &&
              console.log(
                `1138 ${`\u001b[${31}m${`MALFORMED "NOT" COMMENT`}\u001b[${39}m`}`
              );
            // findMalformed
            let capturedMalformedTagRanges: IdxRangeObj[] = [];
            // Contents will be objects like:
            // {
            //   idxFrom: 3,
            //   idxTo: 9
            // }
            findMalformed(
              parentsLastChildTokenValue.value,
              "<!--",
              (obj) => {
                capturedMalformedTagRanges.push(obj);
              },
              {
                maxDistance: 2,
              }
            );
            DEV &&
              console.log(
                `1159 ${`\u001b[${33}m${`capturedMalformedTagRanges`}\u001b[${39}m`} = ${JSON.stringify(
                  capturedMalformedTagRanges,
                  null,
                  4
                )}`
              );
            if (
              capturedMalformedTagRanges.length &&
              !right(
                parentsLastChildTokenValue.value,
                capturedMalformedTagRanges[
                  capturedMalformedTagRanges.length - 1
                ].idxTo - 1
              )
            ) {
              DEV && console.log(`1174 picking the last malformed range`);
              // pick the last
              // imagine, there were multiple malformed opening comments:
              // <!--[if !mso]><!--><img src="gif"/>!--!--!--!--<![endif]-->
              let malformedRange: IdxRangeObj =
                capturedMalformedTagRanges.pop() as IdxRangeObj;
              DEV &&
                console.log(
                  `1182 ${`\u001b[${33}m${`malformedRange`}\u001b[${39}m`} = ${JSON.stringify(
                    malformedRange,
                    null,
                    4
                  )}`
                );

              // is the whole text token to be merged into the closing comment token,
              // or were there characters in front of text token which remain and
              // form the shorter, text token?

              if (
                !left(
                  parentsLastChildTokenValue.value,
                  malformedRange.idxFrom
                ) &&
                previousPath &&
                isObj(parentsLastChildTokenValue)
              ) {
                DEV && console.log(`1201 whole token is malformed <!--`);
                // if there are no whitespace characters to the left of "from" index
                // of the malformed "<!--", this means whole token is a malformed
                // value and needs to be merged into current "comment" type token
                // and its kind should be changed from "only" to "not".
                if (tokensWithChildren.includes(tokenObj.type)) {
                  (tokenObj as any).children = [];
                }

                // 1. Insert current node. The path for current token remains the same - text node was among
                // the previous token's children tokens
                op.set(res, path, {
                  ...tokenObj,
                  start:
                    malformedRange.idxFrom +
                    (parentsLastChildTokenValue.start as number),
                  kind: "not",
                  value: `${parentsLastChildTokenValue.value}${tokenObj.value}`,
                });

                // 2. Delete the text node.
                DEV &&
                  console.log(
                    `1224 ██ ${`\u001b[${33}m${`previousPath`}\u001b[${39}m`} = ${JSON.stringify(
                      previousPath,
                      null,
                      4
                    )}`
                  );
                DEV &&
                  console.log(
                    `1232 DELETING TEXT NODE - RES BEFORE: ${JSON.stringify(
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
                DEV &&
                  console.log(
                    `1246 DELETING TEXT NODE - RES AFTER: ${JSON.stringify(
                      res,
                      null,
                      4
                    )}`
                  );

                // stop token from being pushed in the ELSE clauses below
                tokenTakenCareOf = true;
              } else if (
                previousPath &&
                isObj(parentsLastChildTokenValue) &&
                parentsLastChildTokenPath
              ) {
                DEV && console.log(`1260 there are characters preceding <!--`);
                // if there are text characters which are not part of "<!--",
                // shorten the text token, push a new comment token

                DEV &&
                  console.log(
                    `1266 FIY, ${`\u001b[${33}m${`parentsLastChildTokenPath`}\u001b[${39}m`} = ${JSON.stringify(
                      parentsLastChildTokenPath,
                      null,
                      4
                    )}`
                  );

                // 1. tweak the "text" token
                op.set(res, parentsLastChildTokenPath, {
                  ...parentsLastChildTokenValue,
                  end:
                    malformedRange.idxFrom +
                    (parentsLastChildTokenValue.start as number),
                  value: parentsLastChildTokenValue.value.slice(
                    0,
                    malformedRange.idxFrom
                  ),
                });

                // 2. tweak the current "comment" token
                if (tokensWithChildren.includes(tokenObj.type)) {
                  (tokenObj as any).children = [];
                }
                op.set(res, path, {
                  ...tokenObj,
                  start:
                    malformedRange.idxFrom +
                    (parentsLastChildTokenValue.start as number),
                  kind: "not",
                  value: `${parentsLastChildTokenValue.value.slice(
                    malformedRange.idxFrom
                  )}${tokenObj.value}`,
                });

                // stop token from being pushed in the ELSE clauses below
                tokenTakenCareOf = true;
              }
            }
          }
        }

        DEV &&
          console.log(
            `1309 ███████████████████████████████████████ the bottom clauses`
          );
        DEV &&
          console.log(
            `1313 FIY, ${`\u001b[${33}m${`next`}\u001b[${39}m`} = ${JSON.stringify(
              next,
              null,
              4
            )}`
          );
        DEV &&
          console.log(
            `1321 FIY, ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
              layers,
              null,
              4
            )}`
          );

        // if token was not pushed yet, push it
        if (!tokenTakenCareOf) {
          DEV && console.log(`1330 setting as usual`);
          if (tokensWithChildren.includes(tokenObj.type)) {
            (tokenObj as any).children = [];
          }
          op.set(res, path, tokenObj);
        }

        DEV &&
          console.log(
            `1339 ${`\u001b[${33}m${`res`}\u001b[${39}m`} AFTER: ${JSON.stringify(
              res,
              null,
              4
            )}`
          );

        DEV &&
          console.log(
            `1348 ENDING ${`\u001b[${33}m${`path`}\u001b[${39}m`} = ${JSON.stringify(
              path,
              null,
              4
            )}`
          );

        //
        // CHECK CHILD-PARENT MATCH
        //

        if (
          tokensWithChildren.includes(tokenObj.type) &&
          (tokenObj as any).closing &&
          (!previousPath ||
            !isObj(previousTagsToken) ||
            previousTagsToken.closing ||
            previousTagsToken.type !== tokenObj.type ||
            previousTagsToken.tagName !== (tokenObj as any).tagName)
        ) {
          if ((tokenObj as any).void) {
            DEV &&
              console.log(
                `1371 frontal slash must be removed because it's a void tag`
              );
            if (typeof opts.errCb === "function") {
              DEV &&
                console.log(
                  `1376 ${`\u001b[${31}m${`██ RAISE ERROR tag-void-frontal-slash`}\u001b[${39}m`}`
                );
              (opts.errCb as any)({
                ruleId: `tag-void-frontal-slash`,
                idxFrom: tokenObj.start,
                idxTo: tokenObj.end,
                fix: {
                  ranges: [
                    [tokenObj.start + 1, (tokenObj as any).tagNameStartsAt],
                  ],
                },
                tokenObj,
              });
            }
          } else {
            DEV && console.log(`1391 it's an unpaired tag`);
            if (typeof opts.errCb === "function") {
              DEV &&
                console.log(
                  `1395 ${`\u001b[${31}m${`██ RAISE ERROR`}\u001b[${39}m`} ${
                    tokenObj.type
                  }${
                    tokenObj.type === "comment" ? `-${tokenObj.kind}` : ""
                  }-missing-opening`
                );
              (opts.errCb as any)({
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

        // SET a new previous token's value
        lastProcessedToken = { ...tokenObj };

        //
        // LOGGING
        //
        DEV && console.log(`${`\u001b[${90}m${`---`}\u001b[${39}m`}`);
        DEV &&
          console.log(
            `${`\u001b[${90}m${`██ nestNext = ${`\u001b[${
              nestNext ? 32 : 31
            }m${nestNext}\u001b[${39}m`}`}\u001b[${39}m`}`
          );
        DEV &&
          console.log(
            `${`\u001b[${90}m${`██ layers = ${JSON.stringify(
              layers,
              null,
              4
            )}`}\u001b[${39}m`}`
          );
      }

      //
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
    charCb: opts.charCb,
  });
  DEV && console.log(`-`.repeat(80));

  DEV &&
    console.log(
      `1460 FIY, ENDING ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
        layers,
        null,
        4
      )}`
    );
  // if there are some unclosed layer tokens, raise errors about them all:
  if (layers.length) {
    layers.forEach((tokenObj) => {
      if (typeof opts.errCb === "function") {
        DEV &&
          console.log(
            `1472 ${`\u001b[${31}m${`██ RAISE ERROR`}\u001b[${39}m`} ${
              tokenObj.type
            }${
              tokenObj.type === "comment" ? `-${tokenObj.kind}` : ""
            }-missing-closing`
          );
        (opts.errCb as any)({
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

  DEV &&
    console.log(
      `1492 ${`\u001b[${32}m${`FINAL RETURN`}\u001b[${39}m`} ${JSON.stringify(
        res,
        null,
        4
      )}`
    );
  return res;
}

// -----------------------------------------------------------------------------

export {
  cparser,
  defaults,
  version,
  ErrorObj,
  TokenWithChildren,
  TagTokenWithChildren,
  CommentTokenWithChildren,
};
