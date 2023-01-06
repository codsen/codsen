// import op from "object-path";
import {
  //   stringify,
  pad,
  Obj,
} from "./util";
import { ExtractTestNumRes } from "./extract-test-num";

declare let DEV: boolean;

export function processTestsFirstArg(
  context: Obj,
  node: Obj,
  findings: ExtractTestNumRes | null,
  expectedTestNumber: number
): void {
  DEV &&
    console.log(
      `019 ${`\u001b[${32}m${`████████████████████ processTestsFirstArg() start`}\u001b[${39}m`}`
    );

  DEV &&
    console.log(
      `024 process-tests-first-arg.ts: ${`\u001b[${33}m${`findings`}\u001b[${39}m`} = ${JSON.stringify(
        findings,
        null,
        4
      )}`
    );
  DEV &&
    console.log(
      `032 process-tests-first-arg.ts: ${`\u001b[${33}m${`expectedTestNumber`}\u001b[${39}m`} = ${pad(
        expectedTestNumber
      )}`
    );

  if (findings && findings?.extracted !== pad(expectedTestNumber)) {
    DEV &&
      console.log(
        `040 process-tests-first-arg.ts: ${`\u001b[${31}m${`test number mismatch!`}\u001b[${39}m`} ${
          findings?.extracted
        } !== ${pad(expectedTestNumber)}`
      );

    DEV &&
      console.log(
        `047 process-tests-first-arg.ts: ${`\u001b[${32}m${`REPORT`}\u001b[${39}m`}`
      );
    context.report({
      messageId: "correctTestNum",
      node,
      fix: (fixerObj: Obj) => {
        return fixerObj.replaceTextRange(
          [findings.from, findings.to],
          pad(expectedTestNumber)
        );
      },
    });
  }
}
