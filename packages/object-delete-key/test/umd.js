import tap from "tap";
import deleteKey from "../dist/object-delete-key.umd";

tap.test("01 - general sanity check", (t) => {
  const actual = deleteKey(
    {
      a: "a",
      b: "b",
    },
    {
      key: "b",
      val: "b",
    }
  );
  const intended = {
    a: "a",
  };

  t.same(actual, intended, "01");
  t.end();
});
