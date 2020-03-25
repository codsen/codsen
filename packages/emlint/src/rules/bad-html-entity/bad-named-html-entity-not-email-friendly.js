// rule: bad-named-html-entity-not-email-friendly
// -----------------------------------------------------------------------------

// it controls, should we or should we not put the slashes on void tags,
// such as img. Is it <img...> or is it <img.../>?

import { notEmailFriendly } from "html-entities-not-email-friendly";

function htmlEntitiesNotEmailFriendly(context) {
  return {
    entity: function ({ idxFrom, idxTo }) {
      console.log(
        `███████████████████████████████████████ htmlEntitiesNotEmailFriendly() ███████████████████████████████████████`
      );
      if (
        Object.keys(notEmailFriendly).includes(
          context.str.slice(idxFrom + 1, idxTo - 1)
        )
      ) {
        console.log(`020 caught an email-unfriendly entity`);
        context.report({
          ruleId: "bad-named-html-entity-not-email-friendly",
          message: "Email-unfriendly named HTML entity.",
          idxFrom: idxFrom,
          idxTo: idxTo,
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
