import { visit, EXIT } from "unist-util-visit";
import iteratee from "lodash.iteratee";
import type {
  Root,
  Element,
  Comment,
  DocType,
  Text,
  // ElementContent,
} from "hast";

declare let DEV: boolean;

export interface Obj {
  [key: string]: any;
}

export const find = (
  tree: Root | Element | Comment | DocType | Text,
  condition: any
): Root | Element | Comment | DocType | Text | undefined => {
  let predicate = iteratee(condition);
  let result: Root | Element | Comment | DocType | Text | undefined = undefined;

  visit(tree, (node) => {
    if (predicate(node)) {
      result = node;
      return EXIT;
    }
  });

  return result;
};

export const contains = (
  tree: any,
  something: string | string[]
): string | undefined => {
  DEV &&
    console.log(`040 ${`\u001b[${35}m${`contains()`}\u001b[${39}m`}: start`);
  let result: string | undefined = undefined;

  // early exit
  if (!something?.length) {
    DEV &&
      console.log(
        `047 ${`\u001b[${35}m${`contains()`}\u001b[${39}m`}: ${`\u001b[${31}m${`early return`}\u001b[${39}m`}`
      );
    return undefined;
  }

  DEV &&
    console.log(
      `054 ${`\u001b[${35}m${`contains()`}\u001b[${39}m`}: ${`\u001b[${33}m${`tree`}\u001b[${39}m`} = ${JSON.stringify(
        tree,
        null,
        4
      )}`
    );

  visit(tree, (node) => {
    if (node.type === "text" && typeof node.value === "string") {
      // it depends what we match against, versus a string or an array
      if (typeof something === "string" && node.value.trim() === something) {
        result = something;
      } else if (Array.isArray(something)) {
        // find which array's element matched
        // backwards loop for perf reasons
        for (let i = something.length; i--; ) {
          if (something[i] === node.value.trim()) {
            result = something[i];
            return EXIT;
          }
        }
      }
    }
  });

  DEV &&
    console.log(
      `081 ${`\u001b[${35}m${`contains()`}\u001b[${39}m`}: ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${JSON.stringify(
        result,
        null,
        4
      )}`
    );
  return result;
};

export const getNthChildTag = (
  tree: any,
  tagName: string,
  nth: number
): Obj | null => {
  // insurance
  if (!Array.isArray(tree.children) || !tree.children.length) {
    return null;
  }

  let counter = -1;
  for (let i = 0, len = tree.children.length; i < len; i++) {
    if (
      tree.children[i].type === "element" &&
      tree.children[i].tagName === tagName
    ) {
      counter++;

      if (nth === counter) {
        return tree.children[i];
      }
    }
  }

  // nothing found
  return null;
};
