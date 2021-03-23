import { Linter, RuleObjType } from "../../linter";

// rule: bad-named-html-entity-not-email-friendly
// -----------------------------------------------------------------------------

// it controls, should we or should we not put the slashes on void tags,
// such as img. Is it <img...> or is it <img.../>?

import { notEmailFriendly } from "html-entities-not-email-friendly";

function htmlEntitiesNotEmailFriendly(context: Linter): RuleObjType {
  return {
    entity({ idxFrom, idxTo }) {
      console.log(
        `███████████████████████████████████████ htmlEntitiesNotEmailFriendly() ███████████████████████████████████████`
      );
      if (
        Object.keys(notEmailFriendly).includes(
          context.str.slice(idxFrom + 1, idxTo - 1)
        )
      ) {
        console.log(`022 caught an email-unfriendly entity`);
        context.report({
          ruleId: "bad-html-entity-not-email-friendly",
          message: "Email-unfriendly named HTML entity.",
          idxFrom,
          idxTo,
          fix: {
            ranges: [
              [
                idxFrom,
                idxTo,
                `&${
                  notEmailFriendly[context.str.slice(idxFrom + 1, idxTo - 1)]
                };`,
              ],
            ],
          },
        });
      }
    },
  };
}

export default htmlEntitiesNotEmailFriendly;
