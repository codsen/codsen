import { Linter, RuleObjType } from "../../linter";
import validateStyle from "../../../src/util/validateStyle";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;
// import { Property } from "../../../../codsen-tokenizer/src/util/util";
// import { Range } from "../../../../../scripts/common";

// rule: css-rule-malformed
// -----------------------------------------------------------------------------

// import { rMerge } from "ranges-merge";
// import { right } from "string-left-right";
// import splitByWhitespace from "../../util/splitByWhitespace";

interface CSSRuleMalformed {
  (context: Linter): RuleObjType;
}

const cssRuleMalformed: CSSRuleMalformed = (context) => {
  return {
    rule(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ cssRuleMalformed() ███████████████████████████████████████`
        );
      DEV &&
        console.log(
          `029 cssRuleMalformed(): ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

      if (Array.isArray(node.properties) && node.properties.length) {
        // validateStyle() will report errors into context directly
        validateStyle(
          // pass whole node, not just properties, because some errors
          // like <style>.a{;} can be indentified only by data on the token
          // root, like "node.openingCurlyAt" etc.
          node,
          context
        );
      }

      DEV &&
        console.log(
          `049 ${`\u001b[${32}m${`END of css-rule-malformed`}\u001b[${39}m`}`
        );
    },
  };
};

export default cssRuleMalformed;
