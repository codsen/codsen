import { notEmailFriendly } from "html-entities-not-email-friendly";

import { Linter, RuleObjType } from "../../linter";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: bad-named-html-entity-not-email-friendly
// -----------------------------------------------------------------------------

// it controls, should we or should we not put the slashes on void tags,
// such as img. Is it <img...> or is it <img.../>?

function htmlEntitiesNotEmailFriendly(context: Linter): RuleObjType {
  return {
    entity({ idxFrom, idxTo }) {
      DEV &&
        console.log(
          `███████████████████████████████████████ htmlEntitiesNotEmailFriendly() ███████████████████████████████████████`
        );
      if (
        Object.keys(notEmailFriendly).includes(
          context.str.slice(idxFrom + 1, idxTo - 1)
        )
      ) {
        DEV && console.log(`026 caught an email-unfriendly entity`);
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
