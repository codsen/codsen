import { readFileSync } from "fs";
import tap from "tap";
import path from "path";
import split from "csv-split-easy";
import csvSort from "../dist/csv-sort.esm";

const fixtures = path.join(__dirname, "fixtures");

// -------------------------------------------------------------------

function compare(t, name, throws) {
  if (throws) {
    return t.throws(() => {
      csvSort(readFileSync(path.join(fixtures, `${name}.csv`), "utf8"));
    });
  }
  const actual = csvSort(
    readFileSync(path.join(fixtures, `${name}.csv`), "utf8")
  ).res;
  const expected = readFileSync(
    path.join(fixtures, `${name}.expected.csv`),
    "utf8"
  );
  return t.same(actual, split(expected));
}

// GROUP 01. Simple file, concentrate on row sorting, Balance, Credit & Debit col detection
// -------------------------------------------------------------------

tap.test("01. sorts a basic file, empty extra column in header", (t) => {
  compare(t, "simples");
  t.end();
});

tap.test("02. sorts a basic file, no headers", (t) => {
  compare(t, "simples-no-header");
  t.end();
});

tap.test(
  "03. sorts a basic file with opposite order of the CSV entries",
  (t) => {
    compare(t, "simples-backwards");
    t.end();
  }
);

// GROUP 02. Blank row cases
// -------------------------------------------------------------------

tap.test("04. blank row above header", (t) => {
  compare(t, "simples-blank-row-aboveheader");
  t.end();
});

tap.test("05. blank row above content, header row above it", (t) => {
  compare(t, "simples-blank-row-top");
  t.end();
});

tap.test("06. blank row in the middle", (t) => {
  compare(t, "simples-blank-row-middle");
  t.end();
});

tap.test("07. blank row at the bottom", (t) => {
  compare(t, "simples-blank-row-bottom");
  t.end();
});

tap.test(
  "08. one messed up field CSV will result in missing rows on that row and higher",
  (t) => {
    compare(t, "simples-messed-up");
    t.end();
  }
);

tap.test("09. one data row has extra column with data there", (t) => {
  compare(t, "simples-one-row-has-extra-cols");
  t.end();
});

tap.test(
  "10. extra column with data there, then an extra empty column everywhere (will trim it)",
  (t) => {
    compare(t, "simples-one-row-has-extra-cols-v2");
    t.end();
  }
);

tap.test(
  "11. extra column with data there, then an extra empty column everywhere (will trim it)",
  (t) => {
    t.same(csvSort(""), [[""]], "11");
    t.end();
  }
);

// GROUP 03. Throwing
// -------------------------------------------------------------------

tap.test(
  "12. throws when it can't detect Balance column (one field is empty in this case)",
  (t) => {
    compare(t, "throws-no-balance", 1);
    t.end();
  }
);

tap.test(
  "13. throws when all exclusively-numeric columns contain same values per-column",
  (t) => {
    compare(t, "throws-identical-numeric-cols", 1);
    t.end();
  }
);

tap.test("14. offset columns - will throw", (t) => {
  compare(t, "offset-column", 1);
  t.end();
});

tap.test("15. throws because there are no numeric-only columns", (t) => {
  compare(t, "throws-when-no-numeric-columns", 1);
  t.end();
});

tap.test("16. throws when input types are wrong", (t) => {
  t.throws(() => {
    csvSort(true);
  }, /THROW_ID_02/g);
  t.throws(() => {
    csvSort(null);
  }, /THROW_ID_02/g);
  t.throws(() => {
    csvSort(1);
  }, /THROW_ID_02/g);
  t.throws(() => {
    csvSort(undefined);
  }, /THROW_ID_02/g);
  t.throws(() => {
    csvSort({ a: "b" });
  }, /THROW_ID_02/g);
  t.throws(() => {
    csvSort(["c", "d"]);
  }, /THROW_ID_01/g);

  t.end();
});

// GROUP 04. 2D Trim
// -------------------------------------------------------------------

tap.test("17. trims right side cols and bottom rows", (t) => {
  compare(t, "simples-2d-trim");
  t.end();
});

tap.test("18. trims all around, including left-side empty columns", (t) => {
  compare(t, "all-round-simples-trim");
  t.end();
});
