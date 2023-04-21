import { Linter, RuleObjType } from "../../linter";
import { isPlainObject as isObj } from "codsen-utils";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

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
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeRequired() ███████████████████████████████████████`
        );
      // DEV && console.log(
      //   `022 attributeRequired(): node = ${JSON.stringify(node, null, 4)}`
      // );

      let normalisedOpts = opts || {};

      if (
        isObj(normalisedOpts) &&
        Object.keys(normalisedOpts).includes(node.tagName) &&
        normalisedOpts[node.tagName] &&
        isObj(normalisedOpts[node.tagName])
      ) {
        DEV && console.log(`037 attributeRequired(): check attrs`);

        Object.keys(normalisedOpts[node.tagName])
          // pick boolean true
          .filter((attr) => {
            return normalisedOpts[node.tagName][attr];
          })
          // check is each one present
          .forEach((attr) => {
            if (!node.attribs?.some((attrObj) => attrObj.attribName === attr)) {
              DEV &&
                console.log(
                  `049 attributeRequired(): ${`\u001b[${31}m${`${attr} missing`}\u001b[${39}m`}`
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
