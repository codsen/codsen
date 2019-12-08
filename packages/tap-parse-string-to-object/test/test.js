const t = require("tap");
const parse = require("../dist/tap-parse-string-to-object.cjs");

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

t.test("01 - wrong/missing input = throw", t => {
  t.throws(() => {
    parse();
  }, /THROW_ID_01/g);
  t.throws(() => {
    parse(1);
  }, /THROW_ID_01/g);
  t.throws(() => {
    parse(null);
  }, /THROW_ID_01/g);
  t.throws(() => {
    parse(undefined);
  }, /THROW_ID_01/g);
  t.throws(() => {
    parse(true);
  }, /THROW_ID_01/g);

  t.end();
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |

t.test("02.01 - case 01 - arrayiffy-if-string - all pass", t => {
  const input = `TAP version 13
  ok 1 - test/test.js # time=22.582ms { # Subtest: 01.01 - string input
  ok 1 - 01.01.01
  ok 2 - 01.01.02
  1..2
  ok 1 - 01.01 - string input # time=7.697ms

   # Subtest: 01.02 - non-string input
  ok 1 - 01.02.01
  ok 2 - 01.02.02
  ok 3 - 01.02.03
  ok 4 - 01.02.04
  ok 5 - 01.02.05
  1..5
  ok 2 - 01.02 - non-string input # time=2.791ms

   1..2 # time=22.582ms
  }

  ok 2 - test/umd-test.js # time=16.522ms { # Subtest: UMD build works fine
  ok 1 - should be equivalent
  1..1
  ok 1 - UMD build works fine # time=10.033ms

   1..1 # time=16.522ms
  }

  1..2

  # time=1816.082ms
`;

  t.same(
    parse(input),
    {
      ok: true,
      assertsTotal: 8,
      assertsPassed: 8,
      assertsFailed: 0,
      suitesTotal: 2,
      suitesPassed: 2,
      suitesFailed: 0
    },
    "02.01"
  );
  t.end();
});

//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |

t.test("02.02 - case 01 - arrayiffy-if-string - none pass", t => {
  const input = `TAP version 13
  not ok 1 - test/test.js # time=229.587ms
    ---
    env: {}
    file: test/test.js
    command: /Users/z/n/bin/node
    args:
      - -r
      - /libs/node_modules/esm/esm.js
      - test/test.js
    stdio:
      - 0
      - pipe
      - 2
    cwd: /libs/packages/arrayiffy-if-string
    exitCode: 1
    ...
  {
      # Subtest: 01.01 - string input
          not ok 1 - 01.01.01
            ---
            diff: |
              --- expected
              +++ actual
              @@ -1,3 +1,1 @@
              -Array [
              -  "aaa",
              -]
              +"lgdfhdjkhfgkdfgdkfgkjdhfkgh"
            at:
              line: 9
              column: 5
              file: test/test.js
              type: Test
            stack: >
              Test.<anonymous> (test/test.js:9:5)

              Object.<anonymous> (test/test.js:8:3)

              Object.<anonymous> (/libs/node_modules/append-transform/index.js:62:4)
            source: |
              t.test("01.01 - string input", t => {
                t.same(a("aaa"), ["aaa"], "01.01.01");
              ----^
                t.same(a(""), [], "01.01.02");
                t.end();
            ...

          not ok 2 - 01.01.02
            ---
            diff: |
              --- expected
              +++ actual
              @@ -1,1 +1,1 @@
              -Array []
              +"lgdfhdjkhfgkdfgdkfgkjdhfkgh"
            at:
              line: 10
              column: 5
              file: test/test.js
              type: Test
            stack: >
              Test.<anonymous> (test/test.js:10:5)

              Object.<anonymous> (test/test.js:8:3)

              Object.<anonymous> (/libs/node_modules/append-transform/index.js:62:4)
            source: |2
                t.same(a("aaa"), ["aaa"], "01.01.01");
                t.same(a(""), [], "01.01.02");
              ----^
                t.end();
              });
            ...

          1..2
          # failed 2 of 2 tests
      not ok 1 - 01.01 - string input # time=65.258ms

      # Subtest: 01.02 - non-string input
          not ok 1 - 01.02.01
            ---
            diff: |
              --- expected
              +++ actual
              @@ -1,1 +1,1 @@
              -1
              +"lgdfhdjkhfgkdfgdkfgkjdhfkgh"
            at:
              line: 15
              column: 5
              file: test/test.js
              type: Test
            stack: >
              Test.<anonymous> (test/test.js:15:5)

              Object.<anonymous> (test/test.js:14:3)

              Object.<anonymous> (/libs/node_modules/append-transform/index.js:62:4)
            source: |
              t.test("01.02 - non-string input", t => {
                t.same(a(1), 1, "01.02.01");
              ----^
                t.same(a(null), null, "01.02.02");
                t.same(a(undefined), undefined, "01.02.03");
            ...

          not ok 2 - 01.02.02
            ---
            diff: |
              --- expected
              +++ actual
              @@ -1,1 +1,1 @@
              -null
              +"lgdfhdjkhfgkdfgdkfgkjdhfkgh"
            at:
              line: 16
              column: 5
              file: test/test.js
              type: Test
            stack: >
              Test.<anonymous> (test/test.js:16:5)

              Object.<anonymous> (test/test.js:14:3)

              Object.<anonymous> (/libs/node_modules/append-transform/index.js:62:4)
            source: |2
                t.same(a(1), 1, "01.02.01");
                t.same(a(null), null, "01.02.02");
              ----^
                t.same(a(undefined), undefined, "01.02.03");
                t.same(a(), undefined, "01.02.04");
            ...

          not ok 3 - 01.02.03
            ---
            diff: |
              --- expected
              +++ actual
              @@ -1,1 +1,1 @@
              -undefined
              +"lgdfhdjkhfgkdfgdkfgkjdhfkgh"
            at:
              line: 17
              column: 5
              file: test/test.js
              type: Test
            stack: >
              Test.<anonymous> (test/test.js:17:5)

              Object.<anonymous> (test/test.js:14:3)

              Object.<anonymous> (/libs/node_modules/append-transform/index.js:62:4)
            source: |2
                t.same(a(null), null, "01.02.02");
                t.same(a(undefined), undefined, "01.02.03");
              ----^
                t.same(a(), undefined, "01.02.04");
                t.same(a(true), true, "01.02.05");
            ...

          not ok 4 - 01.02.04
            ---
            diff: |
              --- expected
              +++ actual
              @@ -1,1 +1,1 @@
              -undefined
              +"lgdfhdjkhfgkdfgdkfgkjdhfkgh"
            at:
              line: 18
              column: 5
              file: test/test.js
              type: Test
            stack: >
              Test.<anonymous> (test/test.js:18:5)

              Object.<anonymous> (test/test.js:14:3)

              Object.<anonymous> (/libs/node_modules/append-transform/index.js:62:4)
            source: |2
                t.same(a(undefined), undefined, "01.02.03");
                t.same(a(), undefined, "01.02.04");
              ----^
                t.same(a(true), true, "01.02.05");
                t.end();
            ...

          not ok 5 - 01.02.05
            ---
            diff: |
              --- expected
              +++ actual
              @@ -1,1 +1,1 @@
              -true
              +"lgdfhdjkhfgkdfgdkfgkjdhfkgh"
            at:
              line: 19
              column: 5
              file: test/test.js
              type: Test
            stack: >
              Test.<anonymous> (test/test.js:19:5)

              Object.<anonymous> (test/test.js:14:3)

              Object.<anonymous> (/libs/node_modules/append-transform/index.js:62:4)
            source: |2
                t.same(a(), undefined, "01.02.04");
                t.same(a(true), true, "01.02.05");
              ----^
                t.end();
              });
            ...

          1..5
          # failed 5 of 5 tests
      not ok 2 - 01.02 - non-string input # time=96.004ms

      1..2
      # failed 2 of 2 tests
      # time=229.587ms
  }

  not ok 2 - test/umd-test.js # time=42.735ms
    ---
    env: {}
    file: test/umd-test.js
    command: /Users/z/n/bin/node
    args:
      - -r
      - /libs/node_modules/esm/esm.js
      - test/umd-test.js
    stdio:
      - 0
      - pipe
      - 2
    cwd: /libs/packages/arrayiffy-if-string
    exitCode: 1
    ...
  {
      # Subtest: UMD build works fine
          not ok 1 - should be equivalent
            ---
            diff: |
              --- expected
              +++ actual
              @@ -1,3 +1,1 @@
              -Array [
              -  "aaa",
              -]
              +"lgdfhdjkhfgkdfgdkfgkjdhfkgh"
            at:
              line: 8
              column: 5
              file: test/umd-test.js
              type: Test
            stack: >
              Test.<anonymous> (test/umd-test.js:8:5)

              Object.<anonymous> (test/umd-test.js:7:3)

              Object.<anonymous> (/libs/node_modules/append-transform/index.js:62:4)
            source: |
              t.test("UMD build works fine", t => {
                t.same(a1(source), res);
              ----^
                t.end();
              });
            ...

          1..1
          # failed 1 test
      not ok 1 - UMD build works fine # time=32.242ms

      1..1
      # failed 1 test
      # time=42.735ms
  }

  1..2
  # failed 2 of 2 tests
  # time=2198.062ms
`;

  t.same(
    parse(input),
    {
      ok: true,
      assertsTotal: 8,
      assertsPassed: 0,
      assertsFailed: 8,
      suitesTotal: 2,
      suitesPassed: 0,
      suitesFailed: 2
    },
    "02.02"
  );
  t.end();
});

//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
//                            |
