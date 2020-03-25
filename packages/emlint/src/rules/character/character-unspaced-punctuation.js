// rule: character-unspaced-punctuation
// -----------------------------------------------------------------------------

// Catches punctuation surrounded or not surrounded by whitespace on either side
// Applies only to "text" scope

import { left, right } from "string-left-right";

function characterUnspacedPunctuation(context, ...originalOpts) {
  const charCodeMapping = {
    "63": "questionMark",
    "33": "exclamationMark",
    "59": "semicolon",
    "187": "rightDoubleAngleQuotMark",
    "171": "leftDoubleAngleQuotMark",
  };

  return {
    text: function (node) {
      console.log(
        `███████████████████████████████████████ characterUnspacedPunctuation() ███████████████████████████████████████`
      );
      console.log(
        `${`\u001b[${33}m${`originalOpts`}\u001b[${39}m`} = ${JSON.stringify(
          originalOpts,
          null,
          4
        )}`
      );
      console.log(
        `${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      const defaults = {
        questionMark: {
          whitespaceLeft: "never",
          whitespaceRight: "always",
        },
        exclamationMark: {
          whitespaceLeft: "never",
          whitespaceRight: "always",
        },
        semicolon: {
          whitespaceLeft: "never",
          whitespaceRight: "always",
        },
        rightDoubleAngleQuotMark: {
          whitespaceLeft: "never",
          whitespaceRight: "always",
        },
        leftDoubleAngleQuotMark: {
          whitespaceLeft: "never",
          whitespaceRight: "always",
        },
      };

      let opts = Object.assign({}, defaults); // default opts above are the default
      if (
        Array.isArray(originalOpts) &&
        originalOpts.length &&
        typeof originalOpts[0] === "object" &&
        originalOpts[0] !== null
      ) {
        opts = Object.assign({}, defaults, originalOpts[0]);
      }

      console.log(
        `072 ${`\u001b[${32}m${`FINAL CALCULATED`}\u001b[${39}m`} ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );

      // plan: iterate each character from this text chunk/node, query each
      // caught character's surroundings as per config
      for (let i = node.start; i < node.end; i++) {
        console.log(`082 ███████████████████████████████████████ i = ${i}`);
        const charCode = context.str[i].charCodeAt(0);
        if (charCodeMapping[String(charCode)]) {
          console.log(`caught ${charCodeMapping[String(charCode)]}!`);
          const charName = charCodeMapping[String(charCode)];

          // precautions first.
          // if it's an exclamation mark and two dashes follow, we bail right away
          if (
            charName === "exclamationMark" &&
            context.str[right(context.str, i)] === "-" &&
            context.str[right(context.str, right(context.str, i))] === "-"
          ) {
            console.log(`095 PATTERN "!--" DETECTED, BAILING`);
            return;
          }

          if (
            opts[charName].whitespaceLeft === "never" &&
            i &&
            !context.str[i - 1].trim().length
          ) {
            console.log(
              `${`\u001b[${31}m${`! BAD SPACE ON THE LEFT !`}\u001b[${39}m`}`
            );
            console.log(`107 PING [${left(context.str, i) + 1}, ${i}]`);
            context.report({
              ruleId: "character-unspaced-punctuation",
              idxFrom: left(context.str, i) + 1,
              idxTo: i,
              message: "Remove the whitespace.",
              fix: {
                ranges: [[left(context.str, i) + 1, i]],
              },
            });
          }
          if (
            opts[charName].whitespaceRight === "never" &&
            i < node.end - 1 &&
            !context.str[i + 1].trim().length
          ) {
            console.log(
              `${`\u001b[${31}m${`! BAD SPACE ON THE RIGHT !`}\u001b[${39}m`}`
            );
            console.log(`126 PING [${i + 1}, ${right(context.str, i)}]`);
            context.report({
              ruleId: "character-unspaced-punctuation",
              idxFrom: i + 1,
              idxTo: right(context.str, i),
              message: "Remove the whitespace.",
              fix: {
                ranges: [[i + 1, right(context.str, i)]],
              },
            });
          }
          if (
            opts[charName].whitespaceLeft === "always" &&
            i &&
            context.str[i - 1].trim().length
          ) {
            console.log(
              `${`\u001b[${31}m${`! MISSING SPACE ON THE LEFT !`}\u001b[${39}m`}`
            );
            console.log(`145 PING [${i}, ${i}, " "]`);
            context.report({
              ruleId: "character-unspaced-punctuation",
              idxFrom: i,
              idxTo: i + 1,
              message: "Add a space.",
              fix: {
                ranges: [[i, i, " "]],
              },
            });
          }
          if (
            opts[charName].whitespaceRight === "always" &&
            i < node.end - 1 &&
            context.str[i + 1].trim().length
          ) {
            console.log(
              `${`\u001b[${31}m${`! MISSING SPACE ON THE RIGHT !`}\u001b[${39}m`}`
            );
            console.log(`164 PING [${i + 1}, ${i + 1}, " "]`);
            context.report({
              ruleId: "character-unspaced-punctuation",
              idxFrom: i,
              idxTo: i + 1,
              message: "Add a space.",
              fix: {
                ranges: [[i + 1, i + 1, " "]],
              },
            });
          }
        }
      }

      // Add a space.
    },
  };
}

export default characterUnspacedPunctuation;
