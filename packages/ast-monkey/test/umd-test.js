const t = require("tap");
const { find } = require("../dist/ast-monkey.umd");

const input = {
  a1: {
    b1: "c1"
  },
  a2: {
    b2: "c2"
  },
  z1: {
    x1: "y1"
  }
};
const intended = [
  {
    index: 1,
    key: "a1",
    val: {
      b1: "c1"
    },
    path: [1]
  },
  {
    index: 3,
    key: "a2",
    val: {
      b2: "c2"
    },
    path: [3]
  }
];

t.test("UMD build works fine", t => {
  t.same(find(input, { key: "a*" }), intended);
  t.end();
});
