import { Linter, RuleObjType } from "../../linter";

// rule: tag-bold
// -----------------------------------------------------------------------------

// it flags up any <bold> tags

function tagBold(context: Linter, suggested = "strong"): RuleObjType {
  return {
    tag(node) {
      console.log(
        `███████████████████████████████████████ tagBold() ███████████████████████████████████████`
      );
      console.log(`019 tagBold(): node = ${JSON.stringify(node, null, 4)}`);

      if (node.tagName === "bold") {
        console.log(`031 RAISE ERROR [${node.start}, ${node.end}]`);
        context.report({
          ruleId: "tag-bold",
          message: `Tag "bold" does not exist in HTML.`,
          idxFrom: node.start,
          idxTo: node.end, // second elem. from last range
          fix: {
            ranges: [
              [
                node.tagNameStartsAt as number,
                node.tagNameEndsAt as number,
                suggested,
              ],
            ],
          },
        });
      }
    },
  };
}

export default tagBold;
