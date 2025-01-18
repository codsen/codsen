import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import objectPath from "object-path";

import { getByKey } from "../dist/ast-get-values-by-key.esm.js";

test("01 - input is plain object, replacement is string", () => {
  equal(
    getByKey(
      {
        style: "html",
      },
      "style",
      "meta",
    ),
    {
      style: "meta",
    },
    "01.01",
  );
});

test("02 - paths match object-paht paths", () => {
  let source = {
    tags: [
      {
        style: "html",
      },
    ],
  };
  equal(
    getByKey(source, "style"),
    [
      {
        val: "html",
        path: "tags.0.style",
      },
    ],
    "02.01",
  );

  is(objectPath.get(source, "tags.0.style"), "html", "02.02");
});

test.run();
