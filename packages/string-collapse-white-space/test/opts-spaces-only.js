import tap from "tap";
import { collapse } from "../dist/string-collapse-white-space.esm";
import { mixer } from "./util/util";

// opts.enforceSpacesOnly
// -----------------------------------------------------------------------------

tap.test(`01`, (t) => {
  mixer().forEach((opt) => {
    t.strictSame(
      collapse(`a b`, opt),
      {
        result: `a b`,
        ranges: null,
      },
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`02`, (t) => {
  mixer({
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`a \tb`, opt),
      { result: `a \tb`, ranges: null },
      "02"
    );
  });
  mixer({
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`a \tb`, opt),
      { result: `a b`, ranges: [[2, 3]] },
      "02"
    );
  });
  t.end();
});

tap.test(`03`, (t) => {
  mixer({
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`a \t\tb`, opt),
      { result: `a \t\tb`, ranges: null },
      "03"
    );
  });
  mixer({
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`a \t\tb`, opt),
      { result: `a b`, ranges: [[2, 4]] },
      "03"
    );
  });
  t.end();
});

tap.test(`04`, (t) => {
  mixer({
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`a\t\tb`, opt),
      { result: `a\t\tb`, ranges: null },
      "04"
    );
  });
  mixer({
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`a\t\tb`, opt),
      { result: `a b`, ranges: [[1, 3, " "]] },
      "04"
    );
  });
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`05`, (t) => {
  mixer({
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`a  \tb`, opt),
      { result: `a \tb`, ranges: [[1, 2]] },
      "05"
    );
  });
  mixer({
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`a  \tb`, opt),
      { result: `a b`, ranges: [[2, 4]] },
      "06"
    );
  });
  t.end();
});

tap.test(`06 - reuse the last space`, (t) => {
  mixer({
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`a\t  b`, opt),
      { result: `a\t b`, ranges: [[2, 3]] },
      "06"
    );
  });
  mixer({
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`a\t  b`, opt),
      { result: `a b`, ranges: [[1, 3]] },
      "06"
    );
  });
  t.end();
});

tap.test(`07`, (t) => {
  mixer({
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`a\t\t\tb`, opt),
      { result: `a\t\t\tb`, ranges: null },
      "07"
    );
  });
  mixer({
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`a\t\t\tb`, opt),
      { result: `a b`, ranges: [[1, 4, " "]] },
      "07"
    );
  });
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`08`, (t) => {
  t.strictSame(
    collapse(`  \tx`, {
      enforceSpacesOnly: false,
      trimStart: false,
    }),
    { result: ` \tx`, ranges: [[0, 1]] },
    "08"
  );
  t.end();
});

tap.test(`09 - reuse the space`, (t) => {
  t.strictSame(
    collapse(`  \tx`, {
      enforceSpacesOnly: true,
      trimStart: false,
    }),
    { result: ` x`, ranges: [[1, 3]] },
    "09"
  );
  t.end();
});

tap.test(`10 - full replace`, (t) => {
  t.strictSame(
    collapse(`\t \tx`, {
      enforceSpacesOnly: true,
      trimStart: false,
    }),
    { result: ` x`, ranges: [[0, 3, " "]] },
    "10"
  );
  t.end();
});

tap.test(`11`, (t) => {
  t.strictSame(
    collapse(`  \tx`, {
      enforceSpacesOnly: false,
      trimStart: true,
    }),
    { result: `x`, ranges: [[0, 3]] },
    "11"
  );
  t.end();
});

tap.test(`12`, (t) => {
  t.strictSame(
    collapse(`\t \tx`, {
      enforceSpacesOnly: false,
      trimStart: true,
    }),
    { result: `x`, ranges: [[0, 3]] },
    "12"
  );
  t.end();
});

tap.test(`13`, (t) => {
  t.strictSame(
    collapse(`  \tx`, {
      enforceSpacesOnly: true,
      trimStart: true,
    }),
    { result: `x`, ranges: [[0, 3]] },
    "13"
  );
  t.end();
});

tap.test(`14`, (t) => {
  t.strictSame(
    collapse(`\t \tx`, {
      enforceSpacesOnly: true,
      trimStart: true,
    }),
    { result: `x`, ranges: [[0, 3]] },
    "14"
  );
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`15`, (t) => {
  t.strictSame(
    collapse(`x\t  `, {
      enforceSpacesOnly: false,
      trimEnd: false,
    }),
    { result: `x\t `, ranges: [[2, 3]] },
    "15"
  );
  t.end();
});

tap.test(`16 - reuse`, (t) => {
  t.strictSame(
    collapse(`x\t  `, {
      enforceSpacesOnly: true,
      trimEnd: false,
    }),
    { result: `x `, ranges: [[1, 3]] },
    "16"
  );
  t.end();
});

tap.test(`17 - replace`, (t) => {
  t.strictSame(
    collapse(`x\t \t`, {
      enforceSpacesOnly: true,
      trimEnd: false,
    }),
    { result: `x `, ranges: [[1, 4, " "]] },
    "17"
  );
  t.end();
});

tap.test(`18`, (t) => {
  t.strictSame(
    collapse(`x\t  `, {
      enforceSpacesOnly: false,
      trimEnd: true,
    }),
    { result: `x`, ranges: [[1, 4]] },
    "18"
  );
  t.end();
});

tap.test(`19`, (t) => {
  t.strictSame(
    collapse(`x\t  `, {
      enforceSpacesOnly: true,
      trimEnd: true,
    }),
    { result: `x`, ranges: [[1, 4]] },
    "19"
  );
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`20`, (t) => {
  t.strictSame(
    collapse(`a\t b`, {
      enforceSpacesOnly: false,
    }),
    { result: `a\t b`, ranges: null },
    "20"
  );
  t.end();
});

tap.test(`21`, (t) => {
  t.strictSame(
    collapse(`a\t b`, {
      enforceSpacesOnly: true,
    }),
    { result: `a b`, ranges: [[1, 2]] },
    "21"
  );
  t.end();
});

tap.test(`22`, (t) => {
  t.strictSame(
    collapse(`a\t\tb`, {
      enforceSpacesOnly: true,
    }),
    { result: `a b`, ranges: [[1, 3, " "]] },
    "22"
  );
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`23`, (t) => {
  t.strictSame(
    collapse(`a\tb`, {
      enforceSpacesOnly: false,
    }),
    { result: `a\tb`, ranges: null },
    "23"
  );
  t.end();
});

tap.test(`24`, (t) => {
  t.strictSame(
    collapse(`a\tb`, {
      enforceSpacesOnly: true,
    }),
    { result: `a b`, ranges: [[1, 2, " "]] },
    "24"
  );
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`25`, (t) => {
  t.strictSame(
    collapse(`a\t\tb`, {
      enforceSpacesOnly: false,
    }),
    { result: `a\t\tb`, ranges: null },
    "25"
  );
  t.end();
});

tap.test(`26`, (t) => {
  t.strictSame(
    collapse(`a\t\tb`, {
      enforceSpacesOnly: true,
    }),
    { result: `a b`, ranges: [[1, 3, " "]] },
    "26"
  );
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`27`, (t) => {
  t.strictSame(
    collapse(`a\nb`, {
      enforceSpacesOnly: false,
    }),
    { result: `a\nb`, ranges: null },
    "27"
  );
  t.end();
});

tap.test(`28`, (t) => {
  t.strictSame(
    collapse(`a\nb`, {
      enforceSpacesOnly: true,
    }),
    { result: `a\nb`, ranges: null },
    "28"
  );
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`29`, (t) => {
  t.strictSame(
    collapse(`a\r\nb`, {
      enforceSpacesOnly: false,
    }),
    { result: `a\r\nb`, ranges: null },
    "29"
  );
  t.end();
});

tap.test(`30`, (t) => {
  t.strictSame(
    collapse(`a\r\nb`, {
      enforceSpacesOnly: true,
    }),
    { result: `a\r\nb`, ranges: null },
    "30"
  );
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`31`, (t) => {
  mixer({
    removeEmptyLines: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`a\n\nb`, opt),
      { result: `a\n\nb`, ranges: null },
      "31"
    );
  });
  mixer({
    removeEmptyLines: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`a\n\nb`, opt),
      { result: `a\nb`, ranges: [[1, 2]] },
      "33"
    );
  });
  t.end();
});

// -----------------------------------------------------------------------------

tap.test(`32`, (t) => {
  mixer({
    enforceSpacesOnly: false,
    trimLines: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`a \t \n \t b`, opt),
      { result: `a \t \n \t b`, ranges: null },
      "32"
    );
  });
  mixer({
    enforceSpacesOnly: true,
    trimLines: false,
  }).forEach((opt) => {
    t.strictSame(collapse(`a \t \n \t b`, opt).result, `a \n b`, "32");
  });
  mixer({
    trimLines: true,
  }).forEach((opt) => {
    t.strictSame(collapse(`a \t \n \t b`, opt).result, `a\nb`, "32");
  });
  t.end();
});

tap.test(`33`, (t) => {
  mixer({
    enforceSpacesOnly: false,
    trimLines: false,
  }).forEach((opt) => {
    t.strictSame(collapse(`a \n \t b`, opt).result, `a \n \t b`, "33");
  });
  mixer({
    enforceSpacesOnly: true,
    trimLines: false,
  }).forEach((opt) => {
    t.strictSame(collapse(`a \n \t b`, opt).result, `a \n b`, "33");
  });
  mixer({
    trimLines: true,
  }).forEach((opt) => {
    t.strictSame(collapse(`a \n \t b`, opt).result, `a\nb`, "33");
  });
  t.end();
});
