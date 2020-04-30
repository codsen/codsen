import tap from "tap";
import fix from "../dist/string-fix-broken-named-entities.esm";

tap.test(
  `01 - ${`\u001b[${32}m${`opts.progressFn`}\u001b[${39}m`} - reports progress - baseline`,
  (t) => {
    t.same(
      fix(
        "text &ang text&ang text text &ang text&ang text text &ang text&ang text"
      ),
      [
        [5, 9, "&ang;"],
        [14, 18, "&ang;"],
        [29, 33, "&ang;"],
        [38, 42, "&ang;"],
        [53, 57, "&ang;"],
        [62, 66, "&ang;"],
      ],
      "01"
    );

    let count = 0;
    t.same(
      fix(
        "text &ang text&ang text text &ang text&ang text text &ang text&ang text",
        {
          progressFn: (percentageDone) => {
            // console.log(`percentageDone = ${percentageDone}`);
            t.ok(typeof percentageDone === "number");
            count += 1;
          },
        }
      ),
      [
        [5, 9, "&ang;"],
        [14, 18, "&ang;"],
        [29, 33, "&ang;"],
        [38, 42, "&ang;"],
        [53, 57, "&ang;"],
        [62, 66, "&ang;"],
      ],
      "02 - calls the progress function"
    );
    t.ok(typeof count === "number" && count <= 101 && count > 0, "03");
    t.end();
  }
);
