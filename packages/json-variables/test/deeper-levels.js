/* eslint no-template-curly-in-string: 0 */

import tap from "tap";
import jv from "../dist/json-variables.esm";

tap.test("01 - variables resolve being in deeper levels", (t) => {
  t.same(
    jv({
      a: [
        {
          b: "zzz %%_c_%% yyy",
          c: "d1",
        },
      ],
      c: "d2",
    }),
    {
      a: [
        {
          b: "zzz d1 yyy",
          c: "d1",
        },
      ],
      c: "d2",
    },
    "01 - defaults"
  );
  t.end();
});

tap.test(
  "02 - deeper level variables not found, bubble up and are found",
  (t) => {
    t.same(
      jv({
        a: [
          {
            b: "zzz %%_c_%% yyy",
            z: "d1",
          },
        ],
        c: "d2",
      }),
      {
        a: [
          {
            b: "zzz d2 yyy",
            z: "d1",
          },
        ],
        c: "d2",
      },
      "02 - defaults"
    );
    t.end();
  }
);

tap.test("03 - third level resolves at its level", (t) => {
  t.same(
    jv({
      a: [
        {
          b: [
            {
              c: "zzz %%_d_%% yyy",
              d: "e1",
            },
          ],
        },
      ],
      d: "e2",
    }),
    {
      a: [
        {
          b: [
            {
              c: "zzz e1 yyy",
              d: "e1",
            },
          ],
        },
      ],
      d: "e2",
    },
    "03 - defaults"
  );
  t.end();
});

tap.test("04 - third level falls back to root", (t) => {
  t.same(
    jv({
      a: [
        {
          b: [
            {
              c: "zzz %%_d_%% yyy",
              z: "e1",
            },
          ],
        },
      ],
      d: "e2",
    }),
    {
      a: [
        {
          b: [
            {
              c: "zzz e2 yyy",
              z: "e1",
            },
          ],
        },
      ],
      d: "e2",
    },
    "04 - defaults"
  );
  t.end();
});

tap.test("05 - third level uses data container key", (t) => {
  t.same(
    jv({
      a: [
        {
          b: [
            {
              c: "zzz %%_d_%% yyy",
              c_data: {
                x: "x1",
                y: "y1",
                d: "e1",
              },
            },
          ],
        },
      ],
      d: "e2",
    }),
    {
      a: [
        {
          b: [
            {
              c: "zzz e1 yyy",
              c_data: {
                x: "x1",
                y: "y1",
                d: "e1",
              },
            },
          ],
        },
      ],
      d: "e2",
    },
    "05 - defaults"
  );
  t.end();
});

tap.test(
  "06 - third level uses data container key, but there's nothing there so falls back to root (successfully)",
  (t) => {
    t.same(
      jv({
        a: [
          {
            b: [
              {
                c: "zzz %%_d_%% yyy",
                c_data: {
                  x: "x1",
                  y: "y1",
                },
              },
            ],
          },
        ],
        d: "e2",
      }),
      {
        a: [
          {
            b: [
              {
                c: "zzz e2 yyy",
                c_data: {
                  x: "x1",
                  y: "y1",
                },
              },
            ],
          },
        ],
        d: "e2",
      },
      "06 - defaults"
    );
    t.end();
  }
);

tap.test(
  "07 - third level uses data container key, but there's nothing there so falls back to root data container (successfully)",
  (t) => {
    t.same(
      jv({
        a: [
          {
            b: [
              {
                c: "zzz %%_d_%% yyy",
                c_data: {
                  x: "x1",
                  y: "y1",
                },
              },
            ],
          },
        ],
        a_data: {
          d: "e2",
        },
      }),
      {
        a: [
          {
            b: [
              {
                c: "zzz e2 yyy",
                c_data: {
                  x: "x1",
                  y: "y1",
                },
              },
            ],
          },
        ],
        a_data: {
          d: "e2",
        },
      },
      "07.01 - defaults - root has normal container, a_data, named by topmost parent key"
    );
    t.same(
      jv({
        a: [
          {
            b: [
              {
                c: "zzz %%_d_%% yyy",
                c_data: {
                  x: "x1",
                  y: "y1",
                },
              },
            ],
          },
        ],
        c_data: {
          d: "e2",
        },
      }),
      {
        a: [
          {
            b: [
              {
                c: "zzz e2 yyy",
                c_data: {
                  x: "x1",
                  y: "y1",
                },
              },
            ],
          },
        ],
        c_data: {
          d: "e2",
        },
      },
      "07.02 - root has container, named how deepest data contaienr should be named"
    );
    t.end();
  }
);
