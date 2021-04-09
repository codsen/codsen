import { Linter, RuleObjType } from "../../linter";
import { isObj } from "../../util/util";

// rule: attribute-required
// -----------------------------------------------------------------------------

interface Opts {
  [tagName: string]: {
    [attrName: string]: undefined | null | boolean;
  };
}
interface AttributeRequired {
  (context: Linter, opts?: Opts): RuleObjType;
}
const attributeRequired: AttributeRequired = (context, opts) => {
  return {
    tag(node) {
      console.log(
        `███████████████████████████████████████ attributeRequired() ███████████████████████████████████████`
      );
      // console.log(
      //   `022 attributeRequired(): node = ${JSON.stringify(node, null, 4)}`
      // );

      const normalisedOpts = opts || {};

      if (
        isObj(normalisedOpts) &&
        Object.keys(normalisedOpts).includes(node.tagName) &&
        normalisedOpts[node.tagName] &&
        isObj(normalisedOpts[node.tagName])
      ) {
        console.log(`033 attributeRequired(): check attrs`);

        Object.keys(normalisedOpts[node.tagName])
          // pick boolean true
          .filter((attr) => {
            return normalisedOpts[node.tagName][attr];
          })
          // check is each one present
          .forEach((attr) => {
            if (
              !node.attribs ||
              !node.attribs.some((attrObj) => attrObj.attribName === attr)
            ) {
              console.log(
                `047 attributeRequired(): ${`\u001b[${31}m${`${attr} missing`}\u001b[${39}m`}`
              );
              context.report({
                ruleId: "attribute-required",
                message: `Attribute "${attr}" is missing.`,
                idxFrom: node.start,
                idxTo: node.end,
                fix: null,
              });
            }
          });
      }
    },
  };
};

export default attributeRequired;
