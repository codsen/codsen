import { Linter, RuleObjType } from "../../linter";
import { Property } from "../../../../codsen-tokenizer/src/util/util";
// import { Range } from "../../../../../scripts/common";

// rule: trailing-semi
// -----------------------------------------------------------------------------

// import { rMerge } from "ranges-merge";
// import { right } from "string-left-right";
// import splitByWhitespace from "../../util/splitByWhitespace";

type Mode = "always" | "never";
interface TrailingSemi {
  (context: Linter, mode: Mode): RuleObjType;
}
const trailingSemi: TrailingSemi = (context, mode) => {
  return {
    rule(node) {
      console.log(
        `███████████████████████████████████████ trailingSemi() ███████████████████████████████████████`
      );
      console.log(`022 mode = ${JSON.stringify(mode, null, 4)}`);
      console.log(
        `024 trailingSemi(): ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );
      // incoming "rule"-type node will be something like:
      // {
      //   type: "rule",
      //   start: 7,
      //   end: 20,
      //   value: ".a{color:red}",
      //   left: 6,
      //   nested: false,
      //   openingCurlyAt: 9,
      //   closingCurlyAt: 19,
      //   selectorsStart: 7,
      //   selectorsEnd: 9,
      //   selectors: [
      //     {
      //       value: ".a",
      //       selectorStarts: 7,
      //       selectorEnds: 9,
      //     },
      //   ],
      //   properties: [
      //     {
      //       start: 10,
      //       end: 19,
      //       value: "red",
      //       property: "color",
      //       propertyStarts: 10,
      //       propertyEnds: 15,
      //       colon: 15,
      //       valueStarts: 16,
      //       valueEnds: 19,
      //       semi: null,
      //     },
      //   ],
      // };

      let properties: Property[] = [];
      // there can be text nodes within properties array!
      // innocent whitespace is still a text node!!!!
      if (
        Array.isArray(node.properties) &&
        node.properties.length &&
        node.properties.filter((property) => (property as any).property).length
      ) {
        properties = node.properties.filter(
          (property) => (property as any).property
        ) as Property[];
      }
      console.log(
        `078 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`properties`}\u001b[${39}m`} = ${JSON.stringify(
          properties as any,
          null,
          4
        )}`
      );

      if (
        mode !== "never" &&
        properties &&
        (properties[~-properties.length] as Property).semi === null &&
        (properties[~-properties.length] as Property).valueEnds
      ) {
        console.log(
          `092 ${`\u001b[${31}m${`caught a property without a semicolon`}\u001b[${39}m`}`
        );
        const idxFrom = properties[~-properties.length].start;
        const idxTo = properties[~-properties.length].end;
        const positionToInsert = properties[~-properties.length]
          .valueEnds as number;

        context.report({
          ruleId: "trailing-semi",
          idxFrom,
          idxTo,
          message: `Add a semicolon.`,
          fix: {
            ranges: [[positionToInsert, positionToInsert, ";"]],
          },
        });
      } else if (
        mode === "never" &&
        properties &&
        (properties[~-properties.length] as Property).semi !== null &&
        (properties[~-properties.length] as Property).valueEnds
      ) {
        const idxFrom = properties[~-properties.length].start;
        const idxTo = properties[~-properties.length].end;
        const positionToRemove = (properties[~-properties.length] as Property)
          .semi as number;
        context.report({
          ruleId: "trailing-semi",
          idxFrom,
          idxTo,
          message: `Remove the semicolon.`,
          fix: {
            ranges: [[positionToRemove, positionToRemove + 1]],
          },
        });
      }
    },
  };
};

export default trailingSemi;
