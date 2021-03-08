import { Linter, RuleObjType } from "../../linter";
import { right } from "string-left-right";

// rule: attribute-enforce-img-alt
// -----------------------------------------------------------------------------

function attributeEnforceImgAlt(context: Linter): RuleObjType {
  return {
    tag(node) {
      console.log(
        `███████████████████████████████████████ attributeEnforceImgAlt() ███████████████████████████████████████`
      );
      console.log(
        `014 attributeEnforceImgAlt(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (
        // whoever reads this, I'm writing the following lines looking
        // at the terminal, at line above, "node" object printed out.
        // Normally, you can't write rules blindly, you first wire up
        // a blank rule which does nothing (the console.log above), then
        // see what's coming in, then tap those key values you want.
        node.type === "tag" &&
        node.tagName === "img" &&
        (!node.attribs.length ||
          !node.attribs.some(
            (attrib) =>
              !attrib.attribName || attrib.attribName.toLowerCase() === "alt"
          ))
      ) {
        console.log(`031 attributeEnforceImgAlt(): missing alt`);
        const startPos = node.attribs.length
          ? node.attribs[~-node.attribs.length].attribEnds
          : node.tagNameEndsAt;
        console.log(
          `036 attributeEnforceImgAlt(): ${`\u001b[${33}m${`position`}\u001b[${39}m`} = ${JSON.stringify(
            startPos,
            null,
            4
          )}`
        );
        let endPos = startPos;
        // if there's excessive whitespace, extend the replacement:
        // <img   >
        //     ^^
        //     replace all this with ` alt=""`, respect whitespace being present
        // that is, don't turn `<img  >` into `<img alt="">` but into
        // `<img alt="" >`
        if (
          context.str[startPos + 1] &&
          !context.str[startPos].trim() &&
          !context.str[startPos + 1].trim() &&
          right(context.str, startPos)
        ) {
          endPos = (right(context.str, startPos) as number) - 1;
        }
        context.report({
          ruleId: "attribute-enforce-img-alt",
          message: `Add an alt attribute.`,
          idxFrom: node.start,
          idxTo: node.end,
          fix: {
            ranges: [[startPos, endPos, ' alt=""']],
          },
        });
      }
    },
  };
}

export default attributeEnforceImgAlt;
