import {
  visit,
  // SKIP
} from "unist-util-visit";
import {
  stringify,
  extractStartingVersionString,
  extractDateString,
} from "./util";
import type { Plugin } from "unified";

// Note for self: don't add "hast" itself as a dependency
// This type comes from "@types/hast"
import type { Root } from "hast";

import { raw } from "hast-util-raw";
import { u } from "unist-builder";
import semverRegex from "semver-regex";

declare let DEV: boolean;

export interface DateParamsObj {
  date: Date;
  year: string;
  month: string;
  day: string;
}
export interface Opts {
  dateDivLocale: string;
  dateDivMarkup: (dateParamsObj: DateParamsObj) => string;
}

export const defaults: Opts = {
  dateDivLocale: "en-US",
  dateDivMarkup: ({ year, month, day }) =>
    `${month} ${day}, <span>${year}</span>`,
};

type UnifiedPlugin<T> = Plugin<[T], Root>;
// declare let DEV: boolean;

const changelogTimeline: UnifiedPlugin<[Partial<Opts>?]> = (opts) => {
  let resolvedOpts: Opts = { ...defaults, ...opts };
  DEV &&
    console.log(
      `046 final ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedOpts,
        null,
        4
      )}`
    );

  return (tree) => {
    // ██████████████████ 1. █████████████████████

    // delete the h1, "# Change Log"

    visit(tree, "element", (node, index, parent) => {
      // DEV &&
      //   console.log(
      //     `025 ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${stringify(node)}`
      //   );

      if (
        typeof index === "number" &&
        (node as any)?.tagName === "h1" &&
        Array.isArray(node.children) &&
        node.children.length
      ) {
        if ((node.children[0] as any).value === "Change Log") {
          // 1. delete this h1
          (parent as any).children.splice(index, 1);
          // console.log(`045 ${`\u001b[${32}m${`deleted`}\u001b[${39}m`} h1`);

          // 2. tackle the line break that normally follows
          if (
            (parent as any).children[index]?.type === "text" &&
            (parent as any).children[index]?.value === "\n"
          ) {
            (parent as any).children.splice(index, 1);
            // console.log(
            //   `054 ${`\u001b[${32}m${`deleted`}\u001b[${39}m`} line break`
            // );
          }

          // 3. Remove "All notable changes to this project" if present
          if (
            (parent as any).children[index]?.tagName === "p" &&
            (parent as any).children[index]?.children?.length &&
            typeof (parent as any).children[index].children[0]?.value ===
              "string" &&
            (parent as any).children[index].children[0].value.startsWith(
              "All notable changes to this project"
            )
          ) {
            (parent as any).children.splice(index, 1);
            // console.log(
            //   `070 ${`\u001b[${32}m${`deleted`}\u001b[${39}m`} "All notable changes..."`
            // );
          }
        } else if (
          // normal, not linked heading, for example
          // ## 1.0.0 (2022-09-25)
          (typeof (node.children[0] as any).value === "string" &&
            extractStartingVersionString((node.children[0] as any).value)) ||
          (Array.isArray((node as any).children[0]?.children) &&
            (node as any).children[0].children[0]?.value &&
            extractStartingVersionString(
              (node as any).children[0].children[0]?.value
            ))
        ) {
          // it's something like:
          // # 3.1.0(2022 - 08 - 12)
          // turn it into h2
          node.tagName = "h2";
        }
      }
    });

    // ███████████████████ 2. ████████████████████

    // turn all h2 version headings from:

    // # 3.1.0 (2022-08-12)
    // or
    // # [0.4.0](https://github.com/blablabla) (2022-10-13)
    //
    // into:
    // <h2>3.1.0</h2>
    // <div className="release-date">
    //   12 Aug
    //   <br />
    //   2022
    // </div>

    DEV &&
      console.log(
        `138 ${`\u001b[${33}m${`tree`}\u001b[${39}m`} = ${stringify(tree)}`
      );

    visit(tree, "element", (node, index, parent) => {
      // version can be unlinked:
      // ## 1.0.0(2022 - 09 - 25)
      // or it can be linked:
      // # [0.4.0](https://github.com/blablabla) (2022-10-13)
      // this means, to retrieve it, we have to check either
      // node.value or its first children's value
      let versionStr = "";
      let dateStr = "";

      if (
        typeof index === "number" &&
        (node as any)?.tagName === "h2" &&
        Array.isArray(node.children)
      ) {
        DEV &&
          console.log(
            `158 processing: ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${stringify(
              node
            )}`
          );

        if (
          typeof (node.children[0] as any)?.value === "string" &&
          semverRegex().test((node.children[0] as any)?.value)
        ) {
          versionStr = extractStartingVersionString(
            (node.children[0] as any)?.value
          );
          dateStr = extractDateString((node.children[0] as any)?.value);
        } else if (
          (node.children[0] as any).tagName === "a" &&
          (node.children[0] as any)?.children[0] &&
          (node.children[0] as any).children[0].type === "text" &&
          semverRegex().test((node.children[0] as any).children[0].value)
        ) {
          // extract version from within anchor tag
          versionStr = extractStartingVersionString(
            (node.children[0] as any).children[0].value
          );

          // date text node will be following anchor tag
          if (
            (node.children[1] as any)?.type === "text" &&
            extractDateString((node.children[1] as any)?.value)
          ) {
            dateStr = extractDateString((node.children[1] as any)?.value);
          }
        }
      }

      if (versionStr && dateStr) {
        DEV &&
          console.log(`194 versionStr: ${versionStr}; dateStr: ${dateStr}`);

        DEV &&
          console.log(
            `198  ███████████████████████████████████████ ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
              node,
              null,
              4
            )}`
          );

        node.children = [
          {
            type: "text",
            value: versionStr,
          },
        ];

        DEV && console.log(`212 set the h2 to ${versionStr}`);

        if (dateStr && typeof index === "number") {
          DEV && console.log(`215 add the .release-date div`);
          let date = new Date(dateStr);
          let formatDay = new Intl.DateTimeFormat(resolvedOpts.dateDivLocale, {
            day: "numeric",
          }).format;
          let formatMonth = new Intl.DateTimeFormat(
            resolvedOpts.dateDivLocale,
            {
              month: "short",
            }
          ).format;
          let formatYear = new Intl.DateTimeFormat(resolvedOpts.dateDivLocale, {
            year: "numeric",
          }).format;

          let month = formatMonth(date); // "Jan"
          let day = formatDay(date); // "1"
          let year = formatYear(date); // "2020"

          let dateParamsObj: DateParamsObj = {
            date,
            year,
            month,
            day,
          };
          DEV &&
            console.log(
              `242 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`dateParamsObj`}\u001b[${39}m`} = ${JSON.stringify(
                dateParamsObj,
                null,
                4
              )}`
            );

          let newMarkup = raw(
            u("raw", resolvedOpts.dateDivMarkup(dateParamsObj))
          );

          DEV &&
            console.log(
              `255 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`newMarkup`}\u001b[${39}m`} = ${JSON.stringify(
                newMarkup,
                null,
                4
              )}`
            );

          // it depends, on what newMarkup, the generated AST ended up -
          // - if it was a static string, it ended up as:
          //
          // {
          //     "type": "text",
          //     "value": "foo"
          // }
          //
          // - if user actually used those date strings and nested
          // some tags, it will be like:
          //   {
          //     "type": "root",
          //     "children": [
          //         {
          //             "type": "text",
          //             "value": "2 Sept"
          //         },
          //         {
          //             "type": "element",
          //             "tagName": "br",
          //             ...
          //         },
          //     ],
          //     "data": {
          //         "quirksMode": false
          //     }
          // }

          if (newMarkup.type === "root") {
            parent?.children.splice(index + 1, 0, {
              type: "element",
              tagName: "div",
              properties: {
                className: "release-date",
              },
              children: Array.from((newMarkup as any)?.children || []),
            });
          } else if (newMarkup.type === "text") {
            parent?.children.splice(index + 1, 0, {
              type: "element",
              tagName: "div",
              properties: {
                className: "release-date",
              },
              children: Array.from([newMarkup]),
            });
          }
        }
      }

      // add emoji to h3
      // from:
      // ### Bug Fixes
      // to:
      // ### 🔧 Bug Fixes
      if (
        typeof index === "number" &&
        (node as any)?.tagName === "h3" &&
        (node as any)?.children &&
        (node as any)?.children[0]?.type === "text"
      ) {
        DEV &&
          console.log(
            `325 ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
              node,
              null,
              4
            )}`
          );

        let emoji = "";

        switch ((node as any)?.children[0].value) {
          case "Features":
            emoji = "✨";
            break;
          case "BREAKING CHANGES":
            emoji = "💥";
            break;
          case "Reverts":
            emoji = "⏪";
            break;
          case "Changes":
            emoji = "✈️";
            break;
          case "Improvements":
            emoji = "🏗️";
            break;
          case "Bug Fixes":
          case "Fixed":
            // don't mention "bugs"
            (node as any).children[0].value = "Fixed";
            emoji = "🔧";
            break;
          default:
            break;
        }

        if (emoji) {
          // 1. add a space in between emoji and existing label
          (node as any).children[0].value = ` ${
            (node as any)?.children[0].value
          }`;
          // 2. insert span with emoji in front:
          (node as any).children.unshift({
            type: "element",
            tagName: "span",
            properties: {
              className: "emoji",
            },
            children: [
              {
                type: "text",
                value: `${emoji}`,
              },
            ],
          });
        }
      }
    });

    // ███████████████████ fin. ████████████████████
  };
};

export default changelogTimeline;
