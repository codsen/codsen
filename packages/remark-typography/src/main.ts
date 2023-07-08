import { pipe } from "fp-ts/lib/function.js";
import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root } from "hast";
import { convertAll as convertApostrophesOriginal } from "string-apostrophes";
import { convertAll as convertDashesOriginal } from "string-dashes";
import { removeWidows as removeWidowsOriginal } from "string-remove-widows";
import { multiplicationSign, ellipsis, rightSingleQuote } from "codsen-utils";

type UnifiedPlugin<T> = Plugin<[T], Root>;
// declare let DEV: boolean;

const fixTypography: UnifiedPlugin<any[]> = () => {
  // -----------------------------------------------------------------------------

  function removeWidows(val: string): string {
    return removeWidowsOriginal(val, {
      convertEntities: false,
    }).res;
  }
  function convertApostrophes(val: string): string {
    return convertApostrophesOriginal(val, {
      convertEntities: false,
    }).result;
  }
  function convertDashes(val: string): string {
    return convertDashesOriginal(val, {
      convertEntities: false,
    }).result;
  }
  function extras(val: string): string {
    return val
      .replace(/([^.])\.\.\.$/, `$1${ellipsis}`)
      .replace(/([^.])\.\.\.([^.])/g, `$1${ellipsis}$2`)
      .replace(/ x (\d)/g, ` ${multiplicationSign} $1`);
  }

  // -----------------------------------------------------------------------------

  return (tree: any) => {
    visit(tree, "text", (node, index, parent) => {
      let originalNodeValue = node.value;

      node.value = pipe(
        node.value,
        convertApostrophes,
        convertDashes,
        extras,
        removeWidows,
      );

      // correction for:
      // <code>deno</code>'s
      //                  ^
      //              input gets split by parser into separate nodes
      //              so this apostrophe will lose the context on the left
      if (
        parent.children[(index as any) - 1]?.type === "inlineCode" &&
        originalNodeValue[0] === "'" &&
        originalNodeValue[1] === "s"
      ) {
        node.value = `${rightSingleQuote}${node.value.slice(1)}`;
      }
    });
  };
};

export default fixTypography;
