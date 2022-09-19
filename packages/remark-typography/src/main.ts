import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root } from "hast";
import { convertAll } from "string-apostrophes";

type UnifiedPlugin<T> = Plugin<[T], Root>;
// declare let DEV: boolean;

const fixTypography: UnifiedPlugin<any[]> = () => {
  let ellipsis = "\u2026";
  let mDash = "\u2014";
  //
  return async (tree) => {
    visit(tree, "text", (node) => {
      node.value = convertAll(node.value)
        .result.replace(/([^.])\.\.\.$/, `$1${ellipsis}`)
        .replace(/([^.])\.\.\.([^.])/g, `$1${ellipsis}$2`)
        .replace(/ - /g, ` ${mDash} `);
    });
  };
};

export default fixTypography;
