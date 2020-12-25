import tap from "tap";
import { getByKey } from "../dist/ast-get-values-by-key.esm";

tap.test("01 - get with wildcards", (t) => {
  const source = {
    popsicles: 1,
    tentacles: 0,
    nested: [
      {
        cutticles: "yes",
      },
    ],
  };

  t.strictSame(
    getByKey(source, "*cles"),
    [
      {
        val: 1,
        path: "popsicles",
      },
      {
        val: 0,
        path: "tentacles",
      },
      {
        val: "yes",
        path: "nested.0.cutticles",
      },
    ],
    "01.01"
  );

  t.strictSame(
    getByKey(source, ["*cles"]),
    [
      {
        val: 1,
        path: "popsicles",
      },
      {
        val: 0,
        path: "tentacles",
      },
      {
        val: "yes",
        path: "nested.0.cutticles",
      },
    ],
    "01.02"
  );
  t.end();
});
