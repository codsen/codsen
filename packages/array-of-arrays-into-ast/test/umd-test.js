const t = require("tap");
const a1 = require("../dist/array-of-arrays-into-ast.umd");

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

t.test("UMD build works fine", (t) => {
  t.same(a1(source), result);
  t.end();
});
