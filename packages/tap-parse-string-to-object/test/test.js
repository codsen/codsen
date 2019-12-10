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

t.only("02.03 - ranges-merge - all pass, 1 suite", t => {
  const input = `TAP version 13
  ok 1 - test/test.js # time=203.828ms {
      # Subtest: 00.00 - does not throw when the first arg is wrong
          ok 1 - 00.01.01
          ok 2 - 00.01.02
          1..2
      ok 1 - 00.00 - does not throw when the first arg is wrong # time=5.845ms

      # Subtest: 00.01 - throws when opts.progressFn is wrong
          ok 1 - expected to throw
          1..1
      ok 2 - 00.01 - throws when opts.progressFn is wrong # time=3.409ms

      # Subtest: 00.02 - throws when opts.mergeType is wrong
          ok 1 - expected to throw
          1..1
      ok 3 - 00.02 - throws when opts.mergeType is wrong # time=1.218ms

      # Subtest: 00.03 - throws when the second arg is wrong
          ok 1 - expected to throw
          1..1
      ok 4 - 00.03 - throws when the second arg is wrong # time=0.811ms

      # Subtest: 00.04 - throws when opts.joinRangesThatTouchEdges is wrong
          ok 1 - expected to throw
          1..1
      ok 5 - 00.04 - throws when opts.joinRangesThatTouchEdges is wrong # time=1.044ms

      # Subtest: 00.05
          ok 1 - expected to not throw
          1..1
      ok 6 - 00.05 # time=2.248ms

      # Subtest: 01.01 - simples: merges three overlapping ranges
          ok 1 - 01.01.01 - two args
          ok 2 - 01.01.02 - two args
          ok 3 - 01.01.03 - no mutation happened
          1..3
      ok 7 - 01.01 - simples: merges three overlapping ranges # time=3.612ms

      # Subtest: 01.02 - nothing to merge
          ok 1 - 01.02.01 - just sorted
          ok 2 - 01.02.02
          1..2
      ok 8 - 01.02 - nothing to merge # time=1.821ms

      # Subtest: 01.03 - empty input
          ok 1 - 01.03.01 - empty array
          ok 2 - 01.03.02 - null
          ok 3 - 01.03.03 - empty array
          ok 4 - 01.03.04 - null
          1..4
      ok 9 - 01.03 - empty input # time=1.721ms

      # Subtest: 01.04 - more complex case
          ok 1 - 01.04.01
          ok 2 - 01.04.02
          ok 3 - 01.04.03
          ok 4 - expect truthy value
          ok 5 - expect truthy value
          ok 6 - expect truthy value
          ok 7 - expect truthy value
          ok 8 - expect truthy value
          ok 9 - expect truthy value
          ok 10 - expect truthy value
          ok 11 - expect truthy value
          ok 12 - expect truthy value
          ok 13 - expect truthy value
          ok 14 - expect truthy value
          ok 15 - 01.04.04
          ok 16 - 01.04.05
          ok 17 - 01.04.06
          ok 18 - 01.04.07
          1..18
      ok 10 - 01.04 - more complex case # time=10.9ms

      # Subtest: 01.05 - even more complex case
          ok 1 - expect truthy value
          ok 2 - expect truthy value
          ok 3 - expect truthy value
          ok 4 - expect truthy value
          ok 5 - expect truthy value
          ok 6 - expect truthy value
          ok 7 - expect truthy value
          ok 8 - expect truthy value
          ok 9 - expect truthy value
          ok 10 - expect truthy value
          ok 11 - expect truthy value
          ok 12 - expect truthy value
          ok 13 - expect truthy value
          ok 14 - expect truthy value
          ok 15 - expect truthy value
          ok 16 - expect truthy value
          ok 17 - expect truthy value
          ok 18 - expect truthy value
          ok 19 - expect truthy value
          ok 20 - 01.05.01
          ok 21 - 01.05.02
          1..21
      ok 11 - 01.05 - even more complex case # time=5.119ms

      # Subtest: 01.06 - more merging examples
          ok 1 - 01.06.01
          1..1
      ok 12 - 01.06 - more merging examples # time=1.35ms

      # Subtest: 01.07 - superset range discards to-add content of their subset ranges #1
          ok 1 - 01.07
          1..1
      ok 13 - 01.07 - superset range discards to-add content of their subset ranges #1 # time=0.978ms

      # Subtest: 01.08 - superset range discards to-add content of their subset ranges #2
          ok 1 - 01.08
          1..1
      ok 14 - 01.08 - superset range discards to-add content of their subset ranges #2 # time=2.13ms

      # Subtest: 01.09 - superset range discards to-add content of their subset ranges #3
          ok 1 - 01.09.01
          ok 2 - 01.09.02
          ok 3 - 01.09.03
          ok 4 - 01.09.04
          1..4
      ok 15 - 01.09 - superset range discards to-add content of their subset ranges #3 # time=2.368ms

      # Subtest: 01.10 - third arg is null
          ok 1 - 01.10.01
          ok 2 - 01.10.02
          ok 3 - 01.10.03
          ok 4 - 01.10.04
          ok 5 - 01.10.05
          1..5
      ok 16 - 01.10 - third arg is null # time=4.421ms

      # Subtest: 01.11 - only one range, nothing to merge
          ok 1 - 01.11.01
          ok 2 - 01.11.02
          1..2
      ok 17 - 01.11 - only one range, nothing to merge # time=1.066ms

      # Subtest: 01.12 - input arg mutation prevention
          ok 1 - useless test
          ok 2 - 01.12.01 - mutation didn't happen
          1..2
      ok 18 - 01.12 - input arg mutation prevention # time=1.644ms

      # Subtest: 01.13 - only two identical args in the range
          ok 1 - 01.13.01
          ok 2 - 01.13.02
          ok 3 - 01.13.03
          ok 4 - 01.13.04
          1..4
      ok 19 - 01.13 - only two identical args in the range # time=3.271ms

      # Subtest: 01.14 - third arg
          ok 1 - 01.14.01
          ok 2 - 01.14.02
          ok 3 - 01.14.03
          ok 4 - 01.14.04
          ok 5 - 01.14.05
          ok 6 - 01.14.06
          ok 7 - 01.14.07
          ok 8 - 01.14.08
          1..8
      ok 20 - 01.14 - third arg # time=3.205ms

      # Subtest: 02.01 - few ranges starting at the same index
          ok 1 - 02.01.01 - control #1
          ok 2 - 02.01.02 - control #2
          ok 3 - 02.01.03 - hardcoded correct default value
          ok 4 - 02.01.04 - hardcoded incorrect type default value
          ok 5 - 02.01.05
          ok 6 - 02.01.06
          ok 7 - 02.01.07
          1..7
      ok 21 - 02.01 - few ranges starting at the same index # time=5.157ms

      # Subtest: 03.01 - third arg
          ok 1 - 03.01.01
          ok 2 - 03.01.02
          ok 3 - 03.01.03
          1..3
      ok 22 - 03.01 - third arg # time=1.975ms

      1..22
      # time=203.828ms
  }

  1..1
  # time=1658.26ms
`;

  t.same(
    parse(input),
    {
      ok: true,
      assertsTotal: 93,
      assertsPassed: 93,
      assertsFailed: 0,
      suitesTotal: 1,
      suitesPassed: 1,
      suitesFailed: 0
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
