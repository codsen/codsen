import { Linter, RuleObjType } from "../../linter";
import validateStyle from "../../../src/util/validateStyle";
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
      console.log(
        `███████████████████████████████████████ cssRuleMalformed() ███████████████████████████████████████`
      );
      console.log(
        `024 cssRuleMalformed(): ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
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

      console.log(
        `043 ${`\u001b[${32}m${`END of css-rule-malformed`}\u001b[${39}m`}`
      );
    },
  };
};

export default cssRuleMalformed;
