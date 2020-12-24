import tap from "tap";
import { deleteObj } from "../dist/ast-delete-object.umd";

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
  t.strictSame(deleteObj(source, target, opts), res, "01");
  t.end();
});
