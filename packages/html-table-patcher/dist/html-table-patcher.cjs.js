/**
 * html-table-patcher
 * Wraps any content between TR/TD tags in additional rows/columns to appear in browser correctly
 * Version: 1.1.33
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/html-table-patcher
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var parser = _interopDefault(require('html-dom-parser'));
var domUtils = _interopDefault(require('domutils-bastardised'));
var renderer = _interopDefault(require('dom-serializer'));

var version = "1.1.33";

var replaceElement = domUtils.replaceElement,
    appendChild = domUtils.appendChild,
    getSiblings = domUtils.getSiblings,
    getChildren = domUtils.getChildren;
function isStr(something) {
  return typeof something === "string";
}
var isArr = Array.isArray;
var defaults = {
  cssStylesContent: "",
  alwaysCenter: false
};
function traverse() {
  var nodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var cb = arguments.length > 1 ? arguments[1] : undefined;
  if (!isArr(nodes) || !nodes.length) {
    return;
  }
  nodes.forEach(function (node) {
    cb(node);
    traverse(node.children, cb);
  });
}
function patcher(html, generalOpts) {
  if (typeof html !== "string" || html.length === 0) {
    return html;
  }
  var opts = Object.assign({}, defaults, generalOpts);
  if (opts.cssStylesContent && (!isStr(opts.cssStylesContent) || !opts.cssStylesContent.trim().length)) {
    opts.cssStylesContent = undefined;
  }
  var dom = parser(html);
  traverse(dom, function (node) {
    if (node.type === "text" && node["parent"] && node["parent"].type === "tag" && node["parent"].name === "table" && isStr(node.data) && node.data.trim().length) {
      (function () {
        var colspan = 1;
        var centered = !!opts.alwaysCenter;
        var siblings = getSiblings(node);
        if (isArr(siblings) && siblings.length) {
          for (var i = 0, len = siblings.length; i < len; i++) {
            if (siblings[i].type === "tag" && siblings[i].name === "tr") {
              var tdcount = getChildren(siblings[i]).reduce(function (acc, node) {
                if (node.name === "td" && node.type === "tag") {
                  if (!centered && node.attribs && (node.attribs.align && node.attribs.align === "center" || isStr(node.attribs.style) && node.attribs.style.match(/text-align:\s*center/gi) && node.attribs.style.match(/text-align:\s*center/gi).length)) {
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
        var replacementTr = {
          type: "tag",
          name: "tr",
          children: []
        };
        var replacementTd = {
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
        var linebreak = {
          type: "text",
          data: "\n"
        };
        appendChild(replacementTr, replacementTd);
        appendChild(replacementTr, linebreak);
        replaceElement(node, replacementTr);
      })();
    } else if (node.type === "tag" && node.name === "table" && node.children && node.children.some(function (node) {
      return node.type === "tag" && node.name === "tr" && node.children && node.children.some(function (childNode) {
        return childNode.type === "text" && isStr(childNode.data) && childNode.data.trim().length;
      });
    })) {
      var centered = !!opts.alwaysCenter;
      var newChildren = [];
      node.children.forEach(function (oneOfNodes) {
        if (oneOfNodes.type === "text" && isStr(oneOfNodes.data) && !oneOfNodes.data.trim().length) {
          newChildren.push(oneOfNodes);
        }
        if (oneOfNodes.type === "tag" && oneOfNodes.name === "tr") {
          var consecutiveTDs = 0;
          var lastWasTd = false;
          oneOfNodes.children.forEach(function (oneOfSubNodes) {
            if (oneOfSubNodes.type === "tag" && oneOfSubNodes.name === "td") {
              if (!centered && oneOfSubNodes.attribs && (oneOfSubNodes.attribs.align && oneOfSubNodes.attribs.align === "center" || oneOfSubNodes.attribs.style && oneOfSubNodes.attribs.style.match(/text-align:\s*center/gi).length)) {
                centered = true;
              }
              if (!lastWasTd) {
                lastWasTd = true;
              } else {
                consecutiveTDs++;
              }
            } else if (lastWasTd && (oneOfSubNodes.type !== "text" || isStr(oneOfSubNodes.data) && oneOfSubNodes.data.trim().length)) {
              lastWasTd = false;
            }
          });
          lastWasTd = false;
          var staging = [];
          oneOfNodes.children.forEach(function (oneOfSubNodes) {
            if (oneOfSubNodes.type === "tag" && oneOfSubNodes.name === "td") {
              if (!lastWasTd) {
                lastWasTd = true;
              }
              staging.push(oneOfSubNodes);
            } else if (oneOfSubNodes.type === "text" && isStr(oneOfSubNodes.data)) {
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
                var replacementTr = {
                  type: "tag",
                  name: "tr",
                  children: []
                };
                var replacementTd = {
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
                if (isStr(opts.cssStylesContent) && opts.cssStylesContent.trim().length) {
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

exports.defaults = defaults;
exports.patcher = patcher;
exports.version = version;
