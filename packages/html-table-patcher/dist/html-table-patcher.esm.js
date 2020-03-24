/**
 * html-table-patcher
 * Wraps any content between TR/TD tags in additional rows/columns to appear in browser correctly
 * Version: 1.1.45
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/html-table-patcher
 */

import parser from 'html-dom-parser';
import domUtils from 'domutils-bastardised';
import renderer from 'dom-serializer';

var version = "1.1.45";

const { replaceElement, appendChild, getSiblings, getChildren } = domUtils;
function isStr(something) {
  return typeof something === "string";
}
const isArr = Array.isArray;
const defaults = {
  cssStylesContent: "",
  alwaysCenter: false
};
function traverse(nodes = [], cb) {
  if (!isArr(nodes) || !nodes.length) {
    return;
  }
  nodes.forEach(node => {
    cb(node);
    traverse(node.children, cb);
  });
}
function patcher(html, generalOpts) {
  if (typeof html !== "string" || html.length === 0) {
    return html;
  }
  const opts = Object.assign({}, defaults, generalOpts);
  if (
    opts.cssStylesContent &&
    (!isStr(opts.cssStylesContent) || !opts.cssStylesContent.trim().length)
  ) {
    opts.cssStylesContent = undefined;
  }
  const dom = parser(html);
  traverse(dom, node => {
    if (
      node.type === "text" &&
      node["parent"] &&
      node["parent"].type === "tag" &&
      node["parent"].name === "table" &&
      isStr(node.data) &&
      node.data.trim().length
    ) {
      let colspan = 1;
      let centered = !!opts.alwaysCenter;
      const siblings = getSiblings(node);
      if (isArr(siblings) && siblings.length) {
        for (let i = 0, len = siblings.length; i < len; i++) {
          if (siblings[i].type === "tag" && siblings[i].name === "tr") {
            const tdcount = getChildren(siblings[i]).reduce((acc, node) => {
              if (node.name === "td" && node.type === "tag") {
                if (
                  !centered &&
                  node.attribs &&
                  ((node.attribs.align && node.attribs.align === "center") ||
                    (isStr(node.attribs.style) &&
                      node.attribs.style.match(/text-align:\s*center/gi) &&
                      node.attribs.style.match(/text-align:\s*center/gi)
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
      const replacementTr = {
        type: "tag",
        name: "tr",
        children: []
      };
      const replacementTd = {
        type: "tag",
        name: "td",
        children: [node]
      };
      if (colspan && colspan > 1) {
        if (!replacementTd["attribs"]) {
          replacementTd["attribs"] = {};
        }
        replacementTd["attribs"].colspan = String(colspan);
      }
      if (centered) {
        if (!replacementTd["attribs"]) {
          replacementTd["attribs"] = {};
        }
        replacementTd["attribs"].align = "center";
      }
      if (isStr(opts.cssStylesContent) && opts.cssStylesContent.trim().length) {
        replacementTd["attribs"].style = opts.cssStylesContent;
      }
      const linebreak = {
        type: "text",
        data: "\n"
      };
      appendChild(replacementTr, replacementTd);
      appendChild(replacementTr, linebreak);
      replaceElement(node, replacementTr);
    } else if (
      node.type === "tag" &&
      node.name === "table" &&
      node.children &&
      node.children.some(
        node =>
          node.type === "tag" &&
          node.name === "tr" &&
          node.children &&
          node.children.some(
            childNode =>
              childNode.type === "text" &&
              isStr(childNode.data) &&
              childNode.data.trim().length
          )
      )
    ) {
      let centered = !!opts.alwaysCenter;
      const newChildren = [];
      node.children.forEach(oneOfNodes => {
        if (
          oneOfNodes.type === "text" &&
          isStr(oneOfNodes.data) &&
          !oneOfNodes.data.trim().length
        ) {
          newChildren.push(oneOfNodes);
        }
        if (oneOfNodes.type === "tag" && oneOfNodes.name === "tr") {
          let consecutiveTDs = 0;
          let lastWasTd = false;
          oneOfNodes.children.forEach(oneOfSubNodes => {
            if (oneOfSubNodes.type === "tag" && oneOfSubNodes.name === "td") {
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
              if (!lastWasTd) {
                lastWasTd = true;
              } else {
                consecutiveTDs++;
              }
            } else if (
              lastWasTd &&
              (oneOfSubNodes.type !== "text" ||
                (isStr(oneOfSubNodes.data) && oneOfSubNodes.data.trim().length))
            ) {
              lastWasTd = false;
            }
          });
          lastWasTd = false;
          let staging = [];
          oneOfNodes.children.forEach(oneOfSubNodes => {
            if (oneOfSubNodes.type === "tag" && oneOfSubNodes.name === "td") {
              if (!lastWasTd) {
                lastWasTd = true;
              }
              staging.push(oneOfSubNodes);
            } else if (
              oneOfSubNodes.type === "text" &&
              isStr(oneOfSubNodes.data)
            ) {
              if (!oneOfSubNodes.data.trim().length) {
                staging.push(oneOfSubNodes);
              } else {
                lastWasTd = false;
                if (staging.length) {
                  newChildren.push({
                    type: "tag",
                    name: "tr",
                    children: Array.from(staging)
                  });
                  staging = [];
                }
                const replacementTr = {
                  type: "tag",
                  name: "tr",
                  children: []
                };
                const replacementTd = {
                  type: "tag",
                  name: "td",
                  children: [oneOfSubNodes]
                };
                if (consecutiveTDs > 0) {
                  if (!replacementTd.attribs) {
                    replacementTd.attribs = {};
                  }
                  replacementTd.attribs.colspan = String(consecutiveTDs + 1);
                }
                if (centered) {
                  if (!replacementTd["attribs"]) {
                    replacementTd["attribs"] = {};
                  }
                  replacementTd["attribs"].align = "center";
                }
                if (
                  isStr(opts.cssStylesContent) &&
                  opts.cssStylesContent.trim().length
                ) {
                  replacementTd["attribs"].style = opts.cssStylesContent;
                }
                appendChild(replacementTr, replacementTd);
                newChildren.push(replacementTr);
                staging = [];
              }
            } else {
              lastWasTd = false;
              newChildren.push({
                type: "tag",
                name: "tr",
                children: Array.from(staging)
              });
              staging = [];
              staging.push(oneOfSubNodes);
            }
          });
          if (staging.length) {
            newChildren.push({
              type: "tag",
              name: "tr",
              children: Array.from(staging)
            });
            staging = [];
          }
        }
      });
      node.children = newChildren;
    }
  });
  return renderer(dom);
}

export { defaults, patcher, version };
