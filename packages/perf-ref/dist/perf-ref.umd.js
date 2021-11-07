/**
 * @name perf-ref
 * @fileoverview A dummy, set-in-stone program to be used as a reference
 * @version 1.0.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/perf-ref/}
 */

!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? t(exports)
    : "function" == typeof define && define.amd
    ? define(["exports"], t)
    : t(
        ((e =
          "undefined" != typeof globalThis ? globalThis : e || self).perfRef =
          {})
      );
})(this, function (e) {
  "use strict";
  (e.opsPerSec = 183),
    (e.perfRef = function (e = 1e4) {
      const t =
        "lorem ipsum 1 dolor sit amet 2, consectetur adipiscing 3 ".repeat(e);
      let o = 0,
        n = 0,
        s = 0;
      const r = { ones: 0, twos: 0, threes: 0 };
      for (let e = 0, i = t.length; e < i; e++)
        "1" !== t[e] || e % 23
          ? "2" !== t[e] || e % 7
            ? "3" !== t[e] || e % 11 || ((s = e), r.threes++)
            : ((n = e), r.twos++)
          : ((o = e), r.ones++);
      return [
        ...new Set(
          String(
            Math.floor(
              +String((o * n) / s)
                .split("")
                .reduce((e, t) => t.charCodeAt(0) + e, 0)
            )
          ).split("")
        ),
      ]
        .map((e, t) => +e * Number(Object.values(r)[t]))
        .reduce((e, t) => `${t}${e}`, "");
    }),
    (e.version = "1.0.0"),
    Object.defineProperty(e, "__esModule", { value: !0 });
});
