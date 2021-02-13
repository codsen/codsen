import { Linter, RuleObjType } from "../../linter";
import { left, right } from "string-left-right";

// rule: character-unspaced-punctuation
// -----------------------------------------------------------------------------

// Catches punctuation surrounded or not surrounded by whitespace on either side
// Applies only to "text" scope

interface Obj {
  [key: string]: any;
}

interface Opts {
  questionMark: {
    whitespaceLeft: "never" | "always";
    whitespaceRight: "never" | "always";
  };
  exclamationMark: {
    whitespaceLeft: "never" | "always";
    whitespaceRight: "never" | "always";
  };
  semicolon: {
    whitespaceLeft: "never" | "always";
    whitespaceRight: "never" | "always";
  };
  rightDoubleAngleQuotMark: {
    whitespaceLeft: "never" | "always";
    whitespaceRight: "never" | "always";
  };
  leftDoubleAngleQuotMark: {
    whitespaceLeft: "never" | "always";
    whitespaceRight: "never" | "always";
  };
}

function characterUnspacedPunctuation(
  context: Linter,
  originalOpts?: Partial<Opts>
): RuleObjType {
  const charCodeMapping = {
    63: "questionMark",
    33: "exclamationMark",
    59: "semicolon",
    187: "rightDoubleAngleQuotMark",
    171: "leftDoubleAngleQuotMark",
  };

  return {
    text(node) {
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

      const defaults: Opts = {
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

      const opts: Opts = { ...defaults, ...originalOpts };

      console.log(
        `095 ${`\u001b[${32}m${`FINAL CALCULATED`}\u001b[${39}m`} ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );

      // plan: iterate each character from this text chunk/node, query each
      // caught character's surroundings as per config
      for (let i = node.start; i < node.end; i++) {
        console.log(`105 i = ${i}`);
        const charCode = context.str[i].charCodeAt(0);
        if ((charCodeMapping as Obj)[String(charCode)]) {
          console.log(
            `109 caught ${(charCodeMapping as Obj)[String(charCode)]}!`
          );
          const charName = (charCodeMapping as Obj)[String(charCode)];

          // precautions first.
          // if it's an exclamation mark and two dashes follow, we bail right away
          if (
            charName === "exclamationMark" &&
            context.str[right(context.str, i) as number] === "-" &&
            context.str[
              right(context.str, right(context.str, i) as number) as number
            ] === "-"
          ) {
            console.log(`122 PATTERN "!--" DETECTED, BAILING`);
            return;
          }

          if (
            (opts as Obj)[charName].whitespaceLeft === "never" &&
            i &&
            !context.str[i - 1].trim().length
          ) {
            console.log(
              `${`\u001b[${31}m${`! BAD SPACE ON THE LEFT !`}\u001b[${39}m`}`
            );
            console.log(
              `135 PING [${(left(context.str, i) as number) + 1}, ${i}]`
            );
            const idxFrom = left(context.str, i)
              ? (left(context.str, i) as number) + 1
              : 0;
            context.report({
              ruleId: "character-unspaced-punctuation",
              idxFrom,
              idxTo: i,
              message: "Remove the whitespace.",
              fix: {
                ranges: [[idxFrom, i]],
              },
            });
          }
          if (
            (opts as Obj)[charName].whitespaceRight === "never" &&
            i < node.end - 1 &&
            !context.str[i + 1].trim().length
          ) {
            console.log(
              `${`\u001b[${31}m${`! BAD SPACE ON THE RIGHT !`}\u001b[${39}m`}`
            );
            console.log(`158 PING [${i + 1}, ${right(context.str, i)}]`);
            context.report({
              ruleId: "character-unspaced-punctuation",
              idxFrom: i + 1,
              idxTo: right(context.str, i) || context.str.length,
              message: "Remove the whitespace.",
              fix: {
                ranges: [[i + 1, right(context.str, i) || context.str.length]],
              },
            });
          }
          if (
            (opts as Obj)[charName].whitespaceLeft === "always" &&
            i &&
            context.str[i - 1].trim().length
          ) {
            console.log(
              `${`\u001b[${31}m${`! MISSING SPACE ON THE LEFT !`}\u001b[${39}m`}`
            );
            console.log(`177 PING [${i}, ${i}, " "]`);
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
            (opts as Obj)[charName].whitespaceRight === "always" &&
            i < node.end - 1 &&
            context.str[i + 1].trim().length
          ) {
            console.log(
              `${`\u001b[${31}m${`! MISSING SPACE ON THE RIGHT !`}\u001b[${39}m`}`
            );
            console.log(`196 PING [${i + 1}, ${i + 1}, " "]`);
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
    },
  };
}

export default characterUnspacedPunctuation;
