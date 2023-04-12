import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { truncate } from "../dist/string-truncator.esm.js";
import { mixer } from "./util/util.js";

const dashes = [
  { name: "hyphen", dash: "-" },
  { name: "n-dash", dash: "–" },
  { name: "m-dash", dash: "—" },
];

test("01 - space+dash+space", () => {
  mixer({
    monospace: false,
  }).forEach((opt) => {
    dashes.forEach(({ name, dash }) => {
      equal(
        truncate(`API ${dash} includesWithGlob()`, {
          ...opt,
          maxLen: 10,
          maxLines: 2,
          ellipsisLen: 155,
        }),
        { result: `API ${dash} includesWithGl`, addEllipsis: true },
        `01.01 - ${name} - monospace: false`
      );
    });
  });
  mixer({
    monospace: true,
  }).forEach((opt) => {
    dashes.forEach(({ name, dash }) => {
      equal(
        truncate(`API ${dash} includesWithGlob()`, {
          ...opt,
          maxLen: 10,
          maxLines: 2,
          ellipsisLen: 155,
        }),
        { result: `API ${dash} includesW`, addEllipsis: true },
        `01.02 - ${name} - monospace: true`
      );
    });
  });
});

test("02 - dash+space", () => {
  mixer({
    monospace: false,
  }).forEach((opt) => {
    dashes.forEach(({ name, dash }) => {
      equal(
        truncate(`API${dash} includesWithGlob()`, {
          ...opt,
          maxLen: 10,
          maxLines: 2,
          ellipsisLen: 155,
        }),
        { result: `API${dash} includesWithGl`, addEllipsis: true },
        `02 - ${name} - monospace: false`
      );
    });
  });
  mixer({
    monospace: true,
  }).forEach((opt) => {
    dashes.forEach(({ name, dash }) => {
      equal(
        truncate(`API${dash} includesWithGlob()`, {
          ...opt,
          maxLen: 10,
          maxLines: 2,
          ellipsisLen: 155,
        }),
        { result: `API${dash} includesW`, addEllipsis: true },
        `02 - ${name} - monospace: true`
      );
    });
  });
});

test("03 - space+dash", () => {
  mixer({
    monospace: false,
  }).forEach((opt) => {
    dashes.forEach(({ name, dash }) => {
      equal(
        truncate(`API ${dash}includesWithGlob()`, {
          ...opt,
          maxLen: 10,
          maxLines: 2,
          ellipsisLen: 155,
        }),
        { result: `API ${dash}includesWithGl`, addEllipsis: true },
        `03 - ${name} - monospace: false`
      );
    });
  });
  mixer({
    monospace: true,
  }).forEach((opt) => {
    dashes.forEach(({ name, dash }) => {
      equal(
        truncate(`API ${dash}includesWithGlob()`, {
          ...opt,
          maxLen: 10,
          maxLines: 2,
          ellipsisLen: 155,
        }),
        { result: `API ${dash}includesW`, addEllipsis: true },
        `03 - ${name} - monospace: true`
      );
    });
  });
});

test("04 - tight dash", () => {
  mixer({
    monospace: false,
  }).forEach((opt) => {
    dashes.forEach(({ name, dash }) => {
      equal(
        truncate(`API${dash}includesWithGlob()`, {
          ...opt,
          maxLen: 10,
          maxLines: 2,
          ellipsisLen: 155,
        }),
        { result: `API${dash}includesWithGl`, addEllipsis: true },
        `04 - ${name} - monospace: false`
      );
    });
  });
  mixer({
    monospace: true,
  }).forEach((opt) => {
    dashes.forEach(({ name, dash }) => {
      equal(
        truncate(`API${dash}includesWithGlob()`, {
          ...opt,
          maxLen: 10,
          maxLines: 2,
          ellipsisLen: 155,
        }),
        { result: `API${dash}includesW`, addEllipsis: true },
        `04 - ${name} - monospace: true`
      );
    });
  });
});

test("adhoc - maxLines=1", () => {
  equal(
    truncate("API - INCLUDESWITHGLOB()", {
      monospace: false,
      maxLen: 10,
      maxLines: 1,
      ellipsisLen: 155,
    }),
    { result: "API - INCLUDES", addEllipsis: true },
    "d1"
  );
});

test("adhoc - maxLines=2", () => {
  equal(
    truncate("API - INCLUDESWITHGLOB()", {
      monospace: false,
      maxLen: 10,
      maxLines: 2,
      ellipsisLen: 155,
    }),
    { result: "API - INCLUDESWITH", addEllipsis: true },
    "d1"
  );
});

test("adhoc - maxLines=3", () => {
  equal(
    truncate("API - INCLUDESWITHGLOB()", {
      monospace: false,
      maxLen: 10,
      maxLines: 3,
      ellipsisLen: 155,
    }),
    { result: "API - INCLUDESWITH", addEllipsis: true },
    "d1"
  );
});

test("adhoc - maxLines=4", () => {
  equal(
    truncate("API - INCLUDESWITHGLOB()", {
      monospace: false,
      maxLen: 10,
      maxLines: 4,
      ellipsisLen: 155,
    }),
    { result: "API - INCLUDESWITH", addEllipsis: true },
    "d1"
  );
});

// -----------------------------------------------------------------------------

// TODO:
// ` some text `

// `          some text  `
//        ^
//      cutoff?

//

test.run();
