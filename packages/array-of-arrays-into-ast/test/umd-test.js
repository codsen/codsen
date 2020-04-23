import tap from "tap";
import a1 from "../dist/array-of-arrays-into-ast.umd";

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
  t.same(a1(source), result);
  t.end();
});
