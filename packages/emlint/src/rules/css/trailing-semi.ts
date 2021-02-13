import { Linter, RuleObjType } from "../../linter";
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
const trailingSemi: TrailingSemi = (_context, mode) => {
  return {
    tag(node) {
      console.log(
        `███████████████████████████████████████ trailingSemi() ███████████████████████████████████████`
      );
      console.log(`021 mode = ${JSON.stringify(mode, null, 4)}`);
      console.log(
        `023 trailingSemi(): node = ${JSON.stringify(node, null, 4)}`
      );
    },
  };
};

export default trailingSemi;
