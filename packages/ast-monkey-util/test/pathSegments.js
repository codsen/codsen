import objectPath from "object-path";
import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import {
  parent,
  pathNext,
  pathPrev,
  pathUp,
} from "../dist/ast-monkey-util.esm.js";

test("01 - segment arrays must contain strings", () => {
  throws(() => parent([0]), /\[THROW_ID_01]/, "01.01");
  throws(() => pathNext([0]), /\[THROW_ID_02]/, "01.02");
  throws(() => pathPrev([0]), /\[THROW_ID_03]/, "01.03");
  throws(() => pathUp([0]), /\[THROW_ID_04]/, "01.04");
});

test("02 - parent preserves exact segment boundaries", () => {
  equal(parent(["a.b", "c"]), "a.b", "02.01");
  equal(parent(["a", "b", "c"]), "b", "02.02");
  equal(parent(["", "c"]), "", "02.03");
  equal(parent([""]), null, "02.04");
  equal(parent([]), null, "02.05");
});

test("03 - pathNext returns a new exact path", () => {
  let original = ["a.b", "c", "0"];
  equal(pathNext(original), ["a.b", "c", "1"], "03.01");
  equal(original, ["a.b", "c", "0"], "03.02");
  equal(pathNext(["a", "b", "c", "0"]), ["a", "b", "c", "1"], "03.03");
  equal(pathNext(["", ""]), ["", ""], "03.04");
  equal(pathNext(["a", "key"]), ["a", "key"], "03.05");
  equal(pathNext([]), [], "03.06");
});

test("04 - pathPrev returns a new exact path", () => {
  let original = ["a.b", "c", "9007199254740991"];
  equal(pathPrev(original), ["a.b", "c", "9007199254740990"], "04.01");
  equal(original, ["a.b", "c", "9007199254740991"], "04.02");
  equal(pathPrev(["a", "b", "c", "1"]), ["a", "b", "c", "0"], "04.03");
  equal(pathPrev(["a", "0"]), null, "04.04");
  equal(pathPrev(["a", "key"]), null, "04.05");
  equal(pathPrev(["a", ""]), null, "04.06");
  equal(pathPrev([]), null, "04.07");
});

test("05 - pathUp preserves exact segment boundaries", () => {
  equal(pathUp(["a.b", "children", "0"]), ["a.b"], "05.01");
  equal(pathUp(["a", "b", "children", "0"]), ["a", "b"], "05.02");
  equal(pathUp(["", "children", "0"]), [""], "05.03");
  equal(pathUp(["a", "0"]), ["0"], "05.04");
  equal(pathUp(["a"]), ["0"], "05.05");
  equal(pathUp([]), ["0"], "05.06");
});

test("06 - segment-array results compose with object-path", () => {
  let input = {
    "": { children: ["empty zero", "empty one"] },
    "a.b": { children: ["dotted zero", "dotted one"] },
    a: { b: { children: ["nested zero", "nested one"] } },
  };
  equal(
    objectPath.get(input, pathNext(["a.b", "children", "0"])),
    "dotted one",
    "06.01",
  );
  equal(
    objectPath.get(input, pathNext(["a", "b", "children", "0"])),
    "nested one",
    "06.02",
  );
  equal(
    objectPath.get(input, pathNext(["", "children", "0"])),
    "empty one",
    "06.03",
  );
});

test.run();
