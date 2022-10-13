import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root } from "hast";
import { convertAll } from "string-apostrophes";
import { removeWidows } from "string-remove-widows";

type UnifiedPlugin<T> = Plugin<[T], Root>;
// declare let DEV: boolean;

const fixTypography: UnifiedPlugin<any[]> = () => {
  let ellipsis = "\u2026";
  let mDash = "\u2014";
  let rightSingleQuote = "\u2019";
  //
  return async (tree) => {
    visit(tree, "text", (node, index, parent) => {
      let originalNodeValue = node.value;

      node.value = removeWidows(
        convertAll(node.value)
          .result.replace(/([^.])\.\.\.$/, `$1${ellipsis}`)
          .replace(/([^.])\.\.\.([^.])/g, `$1${ellipsis}$2`)
          .replace(/ - /g, ` ${mDash} `),
        {
          convertEntities: false,
        }
      ).res;

      // correction for:
      // <code>deno</code>'s
      //                  ^
      //              input gets split by parser into separate nodes
      //              so this apostrophe will lose the context on the left
      if (
        (parent as any).children[(index as any) - 1]?.type === "inlineCode" &&
        originalNodeValue[0] === "'" &&
        originalNodeValue[1] === "s"
      ) {
        node.value = `${rightSingleQuote}${node.value.slice(1)}`;
      }
    });
  };
};

export default fixTypography;
