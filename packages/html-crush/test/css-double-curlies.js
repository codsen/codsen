import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { crush } from "../dist/html-crush.esm.js";
import { m, mixer } from "./util/util.js";

// https://github.com/codsen/codsen/issues/16
// https://github.com/hteumeuleu/email-bugs/issues/92

test("01 - sampler", () => {
  equal(
    crush(
      `<style>
\t@media screen {
\t\tdiv {
\t\t\tcolor: white;
\t\t}}

\t.foo {
\t\tbackground: green;
\t}
</style>`,
      {
        removeLineBreaks: true,
      }
    ).result,
    `<style>
@media screen{div{color:white;} }.foo{background:green;}
</style>`,
    "01.01"
  );
});

test("02 - spaced", () => {
  mixer({
    removeLineBreaks: true,
  }).forEach((opt) => {
    equal(
      m(
        equal,
        `<style>
\t@media screen {
\t\tdiv {
\t\t\tcolor: white;
\t\t}
  }
\t.foo {
\t\tbackground: green;
\t}
</style>`,
        opt
      ).result,
      `<style>
@media screen{div{color:white;} }.foo{background:green;}
</style>`,
      `${JSON.stringify(opt, null, 0)}`
    );
  });
});

test("03 - already come tight", () => {
  mixer({
    removeLineBreaks: true,
  }).forEach((opt) => {
    equal(
      m(
        equal,
        `<style>
\t@media screen {
\t\tdiv {
\t\t\tcolor: white;
\t\t}}

\t.foo {
\t\tbackground: green;
\t}
</style>`,
        opt
      ).result,
      `<style>
@media screen{div{color:white;} }.foo{background:green;}
</style>`,
      `${JSON.stringify(opt, null, 0)}`
    );
  });
});

test("04 - already come tight, vs. Nunjucks", () => {
  mixer({
    removeLineBreaks: true,
  }).forEach((opt) => {
    equal(
      m(
        equal,
        `<style>
@media screen{div{color:{{brandWhite}}}}.foo{background:green;}
</style>`,
        opt
      ).result,
      `<style>
@media screen{div{color:{{brandWhite}}} }.foo{background:green;}
</style>`,
      `${JSON.stringify(opt, null, 0)}`
    );
  });
});

test("05 - line break falls between two curlies, #1", () => {
  equal(
    crush(
      `<style>
\t@media screen {
\t\tdiv {
\t\t\tcolor: white;
\t\t}}

\t.foo {
\t\tbackground: green;
\t}
</style>`,
      {
        removeLineBreaks: true,
        lineLengthLimit: 31,
      }
    ).result,
    `<style>
@media screen{div{color:white;}
}.foo{background:green;}
</style>`,
    "05.01"
  );
});

test("06 - line break falls between two curlies, #2", () => {
  equal(
    crush(
      `<style>
\t@media screen {
\t\tdiv {
\t\t\tcolor: white;
\t\t}}

\t.foo {
\t\tbackground: green;
\t}
</style>`,
      {
        removeLineBreaks: true,
        lineLengthLimit: 32,
      }
    ).result,
    `<style>
@media screen{div{color:white;}
}.foo{background:green;}
</style>`,
    "06.01"
  );
});

test("07 - line break falls between two curlies, #3", () => {
  equal(
    crush(
      `<style>
\t@media screen {
\t\tdiv {
\t\t\tcolor: white;
\t\t}}

\t.foo {
\t\tbackground: green;
\t}
</style>`,
      {
        removeLineBreaks: true,
        lineLengthLimit: 33,
      }
    ).result,
    `<style>
@media screen{div{color:white;} }
.foo{background:green;}
</style>`,
    "07.01"
  );
});

test("08 - line break falls between two curlies, #4", () => {
  equal(
    crush(
      `<style>
\t@media screen {
\t\tdiv {
\t\t\tcolor: white;
\t\t}}

\t.foo {
\t\tbackground: green;
\t}
</style>`,
      {
        removeLineBreaks: true,
        lineLengthLimit: 34,
      }
    ).result,
    `<style>
@media screen{div{color:white;} }
.foo{background:green;}
</style>`,
    "08.01"
  );
});

test.run();
