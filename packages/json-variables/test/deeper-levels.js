/* eslint no-template-curly-in-string: 0 */

import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { jVar } from "../dist/json-variables.esm.js";

test("01 - variables resolve being in deeper levels", () => {
  equal(
    jVar({
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
    "01.01",
  );
});

test("02 - deeper level variables not found, bubble up and are found", () => {
  equal(
    jVar({
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
    "02.01",
  );
});

test("03 - third level resolves at its level", () => {
  equal(
    jVar({
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
    "03.01",
  );
});

test("04 - third level falls back to root", () => {
  equal(
    jVar({
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
    "04.01",
  );
});

test("05 - third level uses data container key", () => {
  equal(
    jVar({
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
    "05.01",
  );
});

test("06 - third level uses data container key, but there's nothing there so falls back to root (successfully)", () => {
  equal(
    jVar({
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
    "06.01",
  );
});

test("07 - third level uses data container key, but there's nothing there so falls back to root data container (successfully)", () => {
  equal(
    jVar({
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
    "07.01",
  );
  equal(
    jVar({
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
    "07.02",
  );
});

test.run();
