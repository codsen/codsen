import tap from "tap";
import { generateAst } from "../dist/array-of-arrays-into-ast.umd";

const source = [[5], [1, 2, 3], [1, 2]];
const result = {
  1: [
    {
      2: [
        {
          3: [null],
        },
        null,
      ],
    },
  ],
  5: [null],
};

tap.test("UMD build works fine", (t) => {
  t.strictSame(generateAst(source), result, "01");
  t.end();
});
