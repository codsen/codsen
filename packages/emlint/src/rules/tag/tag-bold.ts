import { Linter, RuleObjType } from "../../linter";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: tag-bold
// -----------------------------------------------------------------------------

// it flags up any <bold> tags

function tagBold(context: Linter, suggested = "strong"): RuleObjType {
  return {
    tag(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ tagBold() ███████████████████████████████████████`
        );
      DEV &&
        console.log(`019 tagBold(): node = ${JSON.stringify(node, null, 4)}`);

      if (node.tagName === "bold") {
        DEV && console.log(`022 RAISE ERROR [${node.start}, ${node.end}]`);
        context.report({
          ruleId: "tag-bold",
          message: `Tag "bold" does not exist in HTML.`,
          idxFrom: node.start,
          idxTo: node.end, // second elem. from last range
          fix: {
            ranges: [[node.tagNameStartsAt, node.tagNameEndsAt, suggested]],
          },
        });
      }
    },
  };
}

export default tagBold;
