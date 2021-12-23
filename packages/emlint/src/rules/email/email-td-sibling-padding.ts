import { Linter, RuleObjType } from "../../linter";
import { Property } from "../../../../codsen-tokenizer/src/util/util";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: email-td-sibling-padding
// -----------------------------------------------------------------------------

// prohibits use of CSS padding style on TD if sibling TD's are present

function tdSiblingPadding(context: Linter): RuleObjType {
  let start: number;
  let end: number;
  return {
    tag(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ tdSiblingPadding() ███████████████████████████████████████`
        );
      if (
        // if this node is TR tag
        node.tagName === "tr" &&
        // and it's got at least some some children tags
        Array.isArray(node.children) &&
        // there are more than one TD children tags
        node.children.filter(
          (tokenObj) =>
            tokenObj.type === "tag" &&
            tokenObj.tagName === "td" &&
            !tokenObj.closing
        ).length > 1 &&
        // any one of TD children tags contains a css style property "padding-*"
        node.children.some(
          (tokenObj) =>
            tokenObj.type === "tag" &&
            tokenObj.tagName === "td" &&
            !tokenObj.closing &&
            Array.isArray(tokenObj.attribs) &&
            tokenObj.attribs.some(
              (attribObj) =>
                attribObj.attribName === "style" &&
                Array.isArray(attribObj.attribValue) &&
                (attribObj.attribValue as Property[]).some((attribValueObj) => {
                  if (
                    typeof attribValueObj.property === "string" &&
                    attribValueObj.property.startsWith("padding-")
                  ) {
                    start = attribValueObj.start;
                    end = attribValueObj.end;
                    return true;
                  }
                  return false;
                })
            )
        )
      ) {
        DEV &&
          console.log(
            `060 ${`${`\u001b[${36}m${`██`}\u001b[${39}m`}${`\u001b[${34}m${`██`}\u001b[${39}m`}`.repeat(
              20
            )} RAISE ERROR [${start}, ${end}]`
          );
        context.report({
          ruleId: "email-td-sibling-padding",
          message: `Don't set padding on TD when sibling TD's are present.`,
          idxFrom: start,
          idxTo: end,
          fix: null,
        });
      }
    },
  };
}

export default tdSiblingPadding;
