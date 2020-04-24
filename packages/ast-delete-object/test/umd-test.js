import tap from "tap";
import del1 from "../dist/ast-delete-object.umd";

const source = [
  "elem1",
  {
    key2: "val2",
    key3: "val3",
    key4: "val4",
  },
  "elem4",
];
const target = {
  key2: "val2",
  key3: "val3",
};
const opts = { matchKeysStrictly: false, hungryForWhitespace: false };
const res = ["elem1", "elem4"];

tap.test("UMD build works fine", (t) => {
  t.same(del1(source, target, opts), res);
  t.end();
});
