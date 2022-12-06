import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { truncate } from "../dist/string-truncator.esm.js";
import { mixer } from "./util/util.js";

test("01 - widest letter: W", () => {
  mixer({
    monospace: false,
  }).forEach((opt) => {
    equal(
      truncate("WWWWWWWWWW", {
        ...opt,
        maxLen: 2, // intentionally extra-short
        ellipsisLen: 155,
      }),
      { result: "W", addEllipsis: true },
      "01.01"
    );
  });
  mixer({
    monospace: true,
  }).forEach((opt) => {
    equal(
      truncate("WWWWWWWWWW", {
        ...opt,
        maxLen: 2, // intentionally extra-short
        ellipsisLen: 155,
      }),
      { result: "W", addEllipsis: true },
      "01.02 - monospace: true"
    );
  });
});

test("02 - W x 9", () => {
  mixer({
    monospace: false,
  }).forEach((opt) => {
    equal(
      truncate("W".repeat(9), {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "W".repeat(9), addEllipsis: false },
      "02.01"
    );
  });
  mixer({
    monospace: true,
  }).forEach((opt) => {
    equal(
      truncate("W".repeat(9), {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "W".repeat(9), addEllipsis: false },
      "02.02 - monospace: true"
    );
  });
});

test("03 - W x 10", () => {
  mixer({
    monospace: false,
  }).forEach((opt) => {
    equal(
      truncate("W".repeat(10), {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "W".repeat(9), addEllipsis: true },
      "03.01"
    );
  });
  mixer({
    monospace: true,
  }).forEach((opt) => {
    equal(
      truncate("W".repeat(10), {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "W".repeat(9), addEllipsis: true },
      "03.02 - monospace: true"
    );
  });
});

test("04 - W x 11", () => {
  mixer({
    monospace: false,
  }).forEach((opt) => {
    equal(
      truncate("W".repeat(11), {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "W".repeat(9), addEllipsis: true },
      "04.01"
    );
  });
  mixer({
    monospace: true,
  }).forEach((opt) => {
    equal(
      truncate("W".repeat(11), {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "W".repeat(9), addEllipsis: true },
      "04.02 - monospace: true"
    );
  });
});

test("05 - i x 21", () => {
  mixer({
    monospace: false,
  }).forEach((opt) => {
    equal(
      truncate("i".repeat(21), {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "i".repeat(21), addEllipsis: false },
      "05.01"
    );
  });
  mixer({
    monospace: true,
  }).forEach((opt) => {
    equal(
      truncate("i".repeat(21), {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "i".repeat(9), addEllipsis: true },
      "05.02 - monospace: true"
    );
  });
});

test("06 - i x 22", () => {
  mixer({
    monospace: false,
  }).forEach((opt) => {
    equal(
      truncate("i".repeat(22), {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "i".repeat(21), addEllipsis: true },
      "06.01"
    );
  });
  mixer({
    monospace: true,
  }).forEach((opt) => {
    equal(
      truncate("i".repeat(22), {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "i".repeat(9), addEllipsis: true },
      "06.02 - monospace: true"
    );
  });
});

test("07 - i x 23", () => {
  mixer({
    monospace: false,
  }).forEach((opt) => {
    equal(
      truncate("i".repeat(23), {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "i".repeat(21), addEllipsis: true },
      "07.01"
    );
  });
  mixer({
    monospace: true,
  }).forEach((opt) => {
    equal(
      truncate("i".repeat(23), {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "i".repeat(9), addEllipsis: true },
      "07.02 - monospace: true"
    );
  });
});

test("08 - i x 24", () => {
  mixer({
    monospace: false,
  }).forEach((opt) => {
    equal(
      truncate("i".repeat(24), {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "i".repeat(21), addEllipsis: true },
      "08.01"
    );
  });
  mixer({
    monospace: true,
  }).forEach((opt) => {
    equal(
      truncate("i".repeat(24), {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "i".repeat(9), addEllipsis: true },
      "08.02 - monospace: true"
    );
  });
});

test("09 - A x 40", () => {
  mixer({
    monospace: false,
  }).forEach((opt) => {
    equal(
      truncate("A".repeat(40), {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "A".repeat(12), addEllipsis: true },
      "09.01"
    );
  });
  mixer({
    monospace: true,
  }).forEach((opt) => {
    equal(
      truncate("A".repeat(40), {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "A".repeat(9), addEllipsis: true },
      "09.02 - monospace: true"
    );
  });
});

test("10 - i x 40", () => {
  mixer({
    monospace: false,
  }).forEach((opt) => {
    equal(
      truncate("i".repeat(40), {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "i".repeat(21), addEllipsis: true },
      "10.01"
    );
  });
  mixer({
    monospace: true,
  }).forEach((opt) => {
    equal(
      truncate("i".repeat(40), {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "i".repeat(9), addEllipsis: true },
      "10.02 - monospace: true"
    );
  });
});

test("11 - a x 40", () => {
  mixer({
    monospace: false,
  }).forEach((opt) => {
    equal(
      truncate("a".repeat(40), {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "a".repeat(13), addEllipsis: true },
      "11.01"
    );
  });
  mixer({
    monospace: true,
  }).forEach((opt) => {
    equal(
      truncate("a".repeat(40), {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "a".repeat(9), addEllipsis: true },
      "11.02 - monospace: true"
    );
  });
});

test("12 - realistic, #1", () => {
  mixer({
    monospace: false,
  }).forEach((opt) => {
    equal(
      truncate("API - includesWithGlob()", {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "API - includesWithGl", addEllipsis: true },
      "12.01"
    );
  });
  mixer({
    monospace: true,
  }).forEach((opt) => {
    equal(
      truncate("API - includesWithGlob()", {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "API - includesW", addEllipsis: true },
      "12.02 - monospace: true"
    );
  });
});

test("13 - realistic, #2", () => {
  mixer({
    monospace: false,
  }).forEach((opt) => {
    equal(
      truncate("CHOMPLEFT() & CHOMPRIGHT()", {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "CHOMPLEFT() & CHOMPRIGHT()", addEllipsis: false },
      "13.01"
    );
  });
  mixer({
    monospace: true,
  }).forEach((opt) => {
    equal(
      truncate("CHOMPLEFT() & CHOMPRIGHT()", {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "CHOMPLEFT", addEllipsis: true },
      "13.02 - monospace: true"
    );
  });
});

test("14 - Russian, normal case, maxLines=1", () => {
  mixer({
    monospace: false,
  }).forEach((opt) => {
    equal(
      truncate("Газпром останавливает эксплуатацию", {
        ...opt,
        maxLen: 10,
        maxLines: 1,
        ellipsisLen: 155,
      }),
      { result: "Газпром остана", addEllipsis: true },
      "14.01"
    );
  });
  mixer({
    monospace: true,
  }).forEach((opt) => {
    equal(
      truncate("Газпром останавливает эксплуатацию", {
        ...opt,
        maxLen: 10,
        maxLines: 1,
        ellipsisLen: 155,
      }),
      { result: "Газпром", addEllipsis: true },
      "14.02 - monospace: true"
    );
  });
});

test("15 - Russian, normal case, maxLines=2", () => {
  mixer({
    monospace: false,
  }).forEach((opt) => {
    equal(
      truncate("Газпром останавливает эксплуатацию", {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "Газпром останавливает", addEllipsis: true },
      "15.01"
    );
  });
  mixer({
    monospace: true,
  }).forEach((opt) => {
    equal(
      truncate("Газпром останавливает эксплуатацию", {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "Газпром останавли", addEllipsis: true },
      "15.02 - monospace: true"
    );
  });
});

test("16 - Russian, uppercase", () => {
  mixer({
    monospace: false,
  }).forEach((opt) => {
    equal(
      truncate("ГАЗПРОМ ОСТАНАВЛИВАЕТ ЭКСПЛУАТАЦИЮ", {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "ГАЗПРОМ ОСТАНАВЛИВА", addEllipsis: true },
      "16.01"
    );
  });
  mixer({
    monospace: true,
  }).forEach((opt) => {
    equal(
      truncate("ГАЗПРОМ ОСТАНАВЛИВАЕТ ЭКСПЛУАТАЦИЮ", {
        ...opt,
        maxLen: 10,
        maxLines: 2,
        ellipsisLen: 155,
      }),
      { result: "ГАЗПРОМ ОСТАНАВЛИ", addEllipsis: true },
      "16.02 - monospace: true"
    );
  });
});

test("17 - overriding opts.letterWidths", () => {
  equal(
    truncate("the quick brown fox", {
      monospace: false,
      maxLen: 5,
      maxLines: 2,
      letterWidths: {
        A: 100,
        a: 100,
        B: 100,
        b: 100,
        C: 100,
        c: 100,
        D: 100,
        d: 100,
        E: 100,
        e: 100,
        F: 100,
        f: 100,
        G: 100,
        g: 100,
        H: 100,
        h: 100,
        I: 100,
        i: 100,
        J: 100,
        j: 100,
        K: 100,
        k: 100,
        L: 100,
        l: 100,
        M: 100,
        m: 100,
        N: 100,
        n: 100,
        O: 100,
        o: 100,
        P: 100,
        p: 100,
        Q: 100,
        q: 100,
        R: 100,
        r: 100,
        S: 100,
        s: 100,
        T: 100,
        t: 100,
        U: 100,
        u: 100,
        V: 100,
        v: 100,
        W: 100,
        w: 100,
        X: 100,
        x: 100,
        Y: 100,
        y: 100,
        Z: 100,
        z: 100,
      },
    }),
    { result: "the quic", addEllipsis: true },
    "17.01"
  );
});

test("18 - opts.letterWidths", () => {
  equal(
    truncate("the quick brown fox", {
      monospace: false,
      maxLen: 6,
      maxLines: 2,
      letterWidths: {
        a: 100,
        z: 100,
        "\u2026": 155,
      },
    }),
    { result: "the quick", addEllipsis: true },
    "18.01"
  );
});

// į is a narrow letter, so if not deburr, it would not be
// recognised and treated as the widest possible letter -
// as a result, we'd squeeze in not more than twenty but
// exactly nine of them
test("19 - deburr in action", () => {
  equal(
    truncate("į".repeat(23), {
      maxLen: 10,
      maxLines: 2,
    }),
    { result: "į".repeat(21), addEllipsis: true },
    "19.01"
  );
});

test.run();
