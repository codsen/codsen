import parser from "html-dom-parser";
import domUtils from "domutils-bastardised";
import renderer from "dom-serializer";
import { version } from "../package.json";

const { replaceElement, appendChild, getSiblings, getChildren } = domUtils;

function isStr(something) {
  return typeof something === "string";
}
const isArr = Array.isArray;
const defaults = {
  cssStylesContent: "",
  alwaysCenter: false,
};

function traverse(nodes = [], cb) {
  if (!isArr(nodes) || !nodes.length) {
    return;
  }
  nodes.forEach((node) => {
    cb(node);
    traverse(node.children, cb);
  });
}

function patcher(html, generalOpts) {
  if (typeof html !== "string" || html.length === 0) {
    return html;
  }

  const opts = { ...defaults, ...generalOpts };
  if (
    opts.cssStylesContent &&
    (!isStr(opts.cssStylesContent) || !opts.cssStylesContent.trim())
  ) {
    opts.cssStylesContent = undefined;
  }

  const dom = parser(html);
  traverse(dom, (node) => {
    if (
      node.type === "text" &&
      node.parent &&
      node.parent.type === "tag" &&
      node.parent.name === "table" &&
      isStr(node.data) &&
      node.data.trim()
    ) {
      let colspan = 1;
      let centered = !!opts.alwaysCenter;

      // 1. calculate the colspan (if needed at all, that is, colspan > 1)
      const siblings = getSiblings(node);

      // Loop through all siblings and look for the first TR.
      // If such exists, count its TD's. If more than two, Bob's your uncle,
      // here's the colspan value.
      if (isArr(siblings) && siblings.length) {
        for (let i = 0, len = siblings.length; i < len; i++) {
          if (siblings[i].type === "tag" && siblings[i].name === "tr") {
            const tdcount = getChildren(siblings[i]).reduce((acc, currNode) => {
              if (currNode.name === "td" && currNode.type === "tag") {
                if (
                  !centered &&
                  currNode.attribs &&
                  ((currNode.attribs.align &&
                    currNode.attribs.align === "center") ||
                    (isStr(currNode.attribs.style) &&
                      currNode.attribs.style.match(/text-align:\s*center/gi) &&
                      currNode.attribs.style.match(/text-align:\s*center/gi)
                        .length))
                ) {
                  centered = true;
                }
                return acc + 1;
              }
              return acc;
            }, 0);
            if (tdcount && tdcount > 1) {
              colspan = tdcount;
            }
            break;
          }
        }
      }

      // 2. append TR with a nested TD.
      // create a blank TR:
      const replacementTr = {
        type: "tag",
        name: "tr",
        children: [],
      };
      const replacementTd = {
        type: "tag",
        name: "td",
        children: [node],
      };
      if (colspan && colspan > 1) {
        if (!replacementTd.attribs) {
          replacementTd.attribs = {};
        }
        replacementTd.attribs.colspan = String(colspan);
      }
      if (centered) {
        if (!replacementTd.attribs) {
          replacementTd.attribs = {};
        }
        replacementTd.attribs.align = "center";
      }
      if (isStr(opts.cssStylesContent) && opts.cssStylesContent.trim()) {
        replacementTd.attribs.style = opts.cssStylesContent;
      }
      const linebreak = {
        type: "text",
        data: "\n",
      };
      appendChild(replacementTr, replacementTd);
      appendChild(replacementTr, linebreak);
      replaceElement(node, replacementTr);
    } else if (
      node.type === "tag" &&
      node.name === "table" &&
      node.children &&
      node.children.some(
        (currNode) =>
          currNode.type === "tag" &&
          currNode.name === "tr" &&
          currNode.children &&
          currNode.children.some(
            (childNode) =>
              childNode.type === "text" &&
              isStr(childNode.data) &&
              childNode.data.trim()
          )
      )
    ) {
      // type 2 - <tr>zzz<td>... ; ...</td>zzz<td>... - content around TD tags
      //
      // filter all TABLES which have TR's which have non-whitespace text nodes.

      let centered = !!opts.alwaysCenter;

      const newChildren = [];
      node.children.forEach((oneOfNodes) => {
        // 1. if it's whitespace text node, let it pass:
        if (
          oneOfNodes.type === "text" &&
          isStr(oneOfNodes.data) &&
          !oneOfNodes.data.trim()
        ) {
          newChildren.push(oneOfNodes);
        }
        // 2. if it's TR, process its children and push separate TR for each
        // text node
        if (oneOfNodes.type === "tag" && oneOfNodes.name === "tr") {
          // PART 2-1.
          // ███████████████████████████████████████

          // Count how many TD's within this TR are consecutive. That will be colspan
          // value we'll append on each newly wrapped TR's TD.

          // For example, consider this:
          //
          // <table>
          //   <tr>
          //     x
          //     <td> <---- TD #1
          //       1
          //     </td>
          //     <td> <---- TD #2
          //       2
          //     </td>
          //   </tr>
          // </table>

          // this would get patched to:

          // <table>
          //   <tr>
          //     <td colspan="2">  <---- colspan="2" because there were two consecutive TD's
          //       x
          //     </td>
          //   </tr>
          //   <tr>
          //     <td>
          //       1
          //     </td>
          //     <td>
          //       2
          //     </td>
          //   </tr>
          // </table>

          let consecutiveTDs = 0;
          let lastWasTd = false;
          oneOfNodes.children.forEach((oneOfSubNodes) => {
            if (oneOfSubNodes.type === "tag" && oneOfSubNodes.name === "td") {
              // 1. check for centered'ness
              if (
                !centered &&
                oneOfSubNodes.attribs &&
                ((oneOfSubNodes.attribs.align &&
                  oneOfSubNodes.attribs.align === "center") ||
                  (oneOfSubNodes.attribs.style &&
                    oneOfSubNodes.attribs.style.match(/text-align:\s*center/gi)
                      .length))
              ) {
                centered = true;
              }

              // 2. count TD consecutive'ness
              if (!lastWasTd) {
                lastWasTd = true;
              } else {
                consecutiveTDs += 1;
              }
            } else if (
              lastWasTd &&
              (oneOfSubNodes.type !== "text" ||
                (isStr(oneOfSubNodes.data) && oneOfSubNodes.data.trim()))
            ) {
              lastWasTd = false;
            }
          });

          // PART 2-2.
          // ███████████████████████████████████████

          // push each text node or chunk of consecutive TD's into separate
          // TR's and replace this TR with those TR's.

          lastWasTd = false;

          // We gather consecutive TD's or whitespace into staging.
          // Reaching the end or a first non-TD and non-whitespace node submits
          // everything what was staged under a separate TR, this TR goes into
          // "newChildren" array.
          let staging = [];

          oneOfNodes.children.forEach((oneOfSubNodes) => {
            if (oneOfSubNodes.type === "tag" && oneOfSubNodes.name === "td") {
              // if it's a TD, submit it

              if (!lastWasTd) {
                lastWasTd = true;
              }
              // push the current node into staging:
              staging.push(oneOfSubNodes);
            } else if (
              oneOfSubNodes.type === "text" &&
              isStr(oneOfSubNodes.data)
            ) {
              if (!oneOfSubNodes.data.trim()) {
                // if it's whitespace, stage it
                staging.push(oneOfSubNodes);
              } else {
                lastWasTd = false;
                // release stage contents
                if (staging.length) {
                  newChildren.push({
                    type: "tag",
                    name: "tr",
                    children: Array.from(staging),
                  });
                  staging = [];
                }

                // push raw text within TR > TD > this-text-node
                const replacementTr = {
                  type: "tag",
                  name: "tr",
                  children: [],
                };
                const replacementTd = {
                  type: "tag",
                  name: "td",
                  children: [oneOfSubNodes],
                };
                if (consecutiveTDs > 0) {
                  if (!replacementTd.attribs) {
                    replacementTd.attribs = {};
                  }
                  replacementTd.attribs.colspan = String(consecutiveTDs + 1);
                }
                if (centered) {
                  if (!replacementTd.attribs) {
                    replacementTd.attribs = {};
                  }
                  replacementTd.attribs.align = "center";
                }
                if (
                  isStr(opts.cssStylesContent) &&
                  opts.cssStylesContent.trim()
                ) {
                  replacementTd.attribs.style = opts.cssStylesContent;
                }
                appendChild(replacementTr, replacementTd);
                newChildren.push(replacementTr);

                // reset stage
                staging = [];
              }
            } else {
              lastWasTd = false;
              // Wrap this TD with a new TR and push into the new CHILDREN array
              newChildren.push({
                type: "tag",
                name: "tr",
                children: Array.from(staging),
              });

              // 2. Wipe stage
              staging = [];

              // 3. Push current node to stage
              staging.push(oneOfSubNodes);
            }
          });

          if (staging.length) {
            // if there's anything in staging after the loop, push and wipe
            newChildren.push({
              type: "tag",
              name: "tr",
              children: Array.from(staging),
            });
            // wipe
            staging = [];
          }
        }
      });

      // eslint-disable-next-line no-param-reassign
      node.children = newChildren;
    }
  });
  return renderer(dom);
}

export { patcher, defaults, version };
