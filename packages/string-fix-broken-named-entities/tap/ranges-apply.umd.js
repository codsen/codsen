/**
 * ranges-apply
 * Take an array of string slice ranges, delete/replace the string according to them
 * Version: 2.12.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply
 */

!(function(t, e) {
  typeof exports == "object" && typeof module != "undefined"
    ? (module.exports = e())
    : typeof define == "function" && define.amd
    ? define(e)
    : ((t = t || self).rangesApply = e());
})(this, () => {
  function t(e) {
    return (t =
      typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
        ? function(t) {
            return typeof t;
          }
        : function(t) {
            return t &&
              typeof Symbol == "function" &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          })(e);
  }
  const e = function(t, e) {
    if (e) {
      if (typeof e != "object") {
        throw new TypeError(
          `${String(
            e
          )} is not an object. Expected an object that has boolean \`includeZero\` property.`
        );
      }
      if ("includeZero" in e) {
        if (typeof e.includeZero != "boolean") {
          throw new TypeError(
            `${String(
              e.includeZero
            )} is neither true nor false. \`includeZero\` option must be a Boolean value.`
          );
        }
        if (e.includeZero && t === 0) {
          return !0;
        }
      }
    }
    return Number.isSafeInteger(t) && t >= 1;
  };
  const r = function(t, e) {
    if (typeof t != "string") {
      return !1;
    }
    if (e && "includeZero" in e) {
      if (typeof e.includeZero != "boolean") {
        throw new TypeError(
          `${String(
            e.includeZero
          )} is neither true nor false. \`includeZero\` option must be a Boolean value.`
        );
      }
      if (e.includeZero) {
        return /^(-?0|[1-9]\d*)(\.0+)?$/.test(t);
      }
    }
    return /^[1-9]\d*(\.0+)?$/.test(t);
  };
  const n =
    typeof window != "undefined"
      ? window
      : typeof global != "undefined"
      ? global
      : typeof self != "undefined"
      ? self
      : {};
  function o(t, e) {
    return t((e = { exports: {} }), e.exports), e.exports;
  }
  const i = o((t, e) => {
    (e = t.exports = function(t) {
      return t + e.suffix(+t);
    }).suffix = function(t) {
      return (
        (t %= 100),
        Math.floor(t / 10) === 1
          ? "th"
          : t % 10 == 1
          ? "st"
          : t % 10 == 2
          ? "nd"
          : t % 10 == 3
          ? "rd"
          : "th"
      );
    };
  });
  const a =
    (i.suffix,
    o((t, e) => {
      let r;
      let o;
      let i;
      let a;
      let c;
      let u;
      let s;
      let f;
      let l;
      let p;
      let y;
      let h;
      let g;
      let d;
      let b;
      let v;
      let m;
      let _;
      let w;
      let j;
      t.exports =
        ((r = typeof Promise == "function"),
        (o = typeof self == "object" ? self : n),
        (i = typeof Symbol != "undefined"),
        (a = typeof Map != "undefined"),
        (c = typeof Set != "undefined"),
        (u = typeof WeakMap != "undefined"),
        (s = typeof WeakSet != "undefined"),
        (f = typeof DataView != "undefined"),
        (l = i && void 0 !== Symbol.iterator),
        (p = i && void 0 !== Symbol.toStringTag),
        (y = c && typeof Set.prototype.entries == "function"),
        (h = a && typeof Map.prototype.entries == "function"),
        (g = y && Object.getPrototypeOf(new Set().entries())),
        (d = h && Object.getPrototypeOf(new Map().entries())),
        (b = l && typeof Array.prototype[Symbol.iterator] == "function"),
        (v = b && Object.getPrototypeOf([][Symbol.iterator]())),
        (m = l && typeof String.prototype[Symbol.iterator] == "function"),
        (_ = m && Object.getPrototypeOf(""[Symbol.iterator]())),
        (w = 8),
        (j = -1),
        function(t) {
          const e = typeof t;
          if (e !== "object") {
            return e;
          }
          if (t === null) {
            return "null";
          }
          if (t === o) {
            return "global";
          }
          if (Array.isArray(t) && (!1 === p || !(Symbol.toStringTag in t))) {
            return "Array";
          }
          if (typeof window == "object" && window !== null) {
            if (typeof window.location == "object" && t === window.location) {
              return "Location";
            }
            if (typeof window.document == "object" && t === window.document) {
              return "Document";
            }
            if (typeof window.navigator == "object") {
              if (
                typeof window.navigator.mimeTypes == "object" &&
                t === window.navigator.mimeTypes
              ) {
                return "MimeTypeArray";
              }
              if (
                typeof window.navigator.plugins == "object" &&
                t === window.navigator.plugins
              ) {
                return "PluginArray";
              }
            }
            if (
              (typeof window.HTMLElement == "function" ||
                typeof window.HTMLElement == "object") &&
              t instanceof window.HTMLElement
            ) {
              if (t.tagName === "BLOCKQUOTE") {
                return "HTMLQuoteElement";
              }
              if (t.tagName === "TD") {
                return "HTMLTableDataCellElement";
              }
              if (t.tagName === "TH") {
                return "HTMLTableHeaderCellElement";
              }
            }
          }
          const n = p && t[Symbol.toStringTag];
          if (typeof n == "string") {
            return n;
          }
          const i = Object.getPrototypeOf(t);
          return i === RegExp.prototype
            ? "RegExp"
            : i === Date.prototype
            ? "Date"
            : r && i === Promise.prototype
            ? "Promise"
            : c && i === Set.prototype
            ? "Set"
            : a && i === Map.prototype
            ? "Map"
            : s && i === WeakSet.prototype
            ? "WeakSet"
            : u && i === WeakMap.prototype
            ? "WeakMap"
            : f && i === DataView.prototype
            ? "DataView"
            : a && i === d
            ? "Map Iterator"
            : c && i === g
            ? "Set Iterator"
            : b && i === v
            ? "Array Iterator"
            : m && i === _
            ? "String Iterator"
            : i === null
            ? "Object"
            : Object.prototype.toString.call(t).slice(w, j);
        });
    }));
  function c(t, e, r) {
    if (e != e) {
      return (function(t, e, r, n) {
        for (let o = t.length, i = r + (n ? 1 : -1); n ? i-- : ++i < o; ) {
          if (e(t[i], i, t)) {
            return i;
          }
        }
        return -1;
      })(t, s, r);
    }
    for (let n = r - 1, o = t.length; ++n < o; ) {
      if (t[n] === e) {
        return n;
      }
    }
    return -1;
  }
  function u(t, e, r, n) {
    for (let o = r - 1, i = t.length; ++o < i; ) {
      if (n(t[o], e)) {
        return o;
      }
    }
    return -1;
  }
  function s(t) {
    return t != t;
  }
  const f = Array.prototype.splice;
  function l(t, e, r, n) {
    let o;
    const i = n ? u : c;
    let a = -1;
    const s = e.length;
    let l = t;
    for (
      t === e &&
        (e = (function(t, e) {
          let r = -1;
          const n = t.length;
          e || (e = Array(n));
          for (; ++r < n; ) {
            e[r] = t[r];
          }
          return e;
        })(e)),
        r &&
          (l = (function(t, e) {
            for (var r = -1, n = t ? t.length : 0, o = Array(n); ++r < n; ) {
              o[r] = e(t[r], r, t);
            }
            return o;
          })(
            t,
            ((o = r),
            function(t) {
              return o(t);
            })
          ));
      ++a < s;

    ) {
      for (let p = 0, y = e[a], h = r ? r(y) : y; (p = i(l, h, p, n)) > -1; ) {
        l !== t && f.call(l, p, 1), f.call(t, p, 1);
      }
    }
    return t;
  }
  const p = function(t, e) {
    return t && t.length && e && e.length ? l(t, e) : t;
  };
  const y = o((t, e) => {
    const r = 200;
    const o = "__lodash_hash_undefined__";
    const i = 9007199254740991;
    const a = "[object Arguments]";
    const c = "[object Boolean]";
    const u = "[object Date]";
    const s = "[object Function]";
    const f = "[object GeneratorFunction]";
    const l = "[object Map]";
    const p = "[object Number]";
    const y = "[object Object]";
    const h = "[object RegExp]";
    const g = "[object Set]";
    const d = "[object String]";
    const b = "[object Symbol]";
    const v = "[object ArrayBuffer]";
    const m = "[object DataView]";
    const _ = "[object Float32Array]";
    const w = "[object Float64Array]";
    const j = "[object Int8Array]";
    const O = "[object Int16Array]";
    const $ = "[object Int32Array]";
    const S = "[object Uint8Array]";
    const A = "[object Uint8ClampedArray]";
    const T = "[object Uint16Array]";
    const E = "[object Uint32Array]";
    const N = /\w*$/;
    const I = /^\[object .+?Constructor\]$/;
    const k = /^(?:0|[1-9]\d*)$/;
    const M = {};
    (M[a] = M["[object Array]"] = M[v] = M[m] = M[c] = M[u] = M[_] = M[w] = M[
      j
    ] = M[O] = M[$] = M[l] = M[p] = M[y] = M[h] = M[g] = M[d] = M[b] = M[S] = M[
      A
    ] = M[T] = M[E] = !0),
      (M["[object Error]"] = M[s] = M["[object WeakMap]"] = !1);
    const x = typeof n == "object" && n && n.Object === Object && n;
    const P = typeof self == "object" && self && self.Object === Object && self;
    const W = x || P || Function("return this")();
    const C = e && !e.nodeType && e;
    const D = C && t && !t.nodeType && t;
    const H = D && D.exports === C;
    function L(t, e) {
      return t.set(e[0], e[1]), t;
    }
    function R(t, e) {
      return t.add(e), t;
    }
    function Z(t, e, r, n) {
      let o = -1;
      const i = t ? t.length : 0;
      for (n && i && (r = t[++o]); ++o < i; ) {
        r = e(r, t[o], o, t);
      }
      return r;
    }
    function J(t) {
      let e = !1;
      if (t != null && typeof t.toString != "function") {
        try {
          e = !!`${t}`;
        } catch (t) {}
      }
      return e;
    }
    function K(t) {
      let e = -1;
      const r = Array(t.size);
      return (
        t.forEach((t, n) => {
          r[++e] = [n, t];
        }),
        r
      );
    }
    function F(t, e) {
      return function(r) {
        return t(e(r));
      };
    }
    function V(t) {
      let e = -1;
      const r = Array(t.size);
      return (
        t.forEach(t => {
          r[++e] = t;
        }),
        r
      );
    }
    let q;
    const B = Array.prototype;
    const U = Function.prototype;
    const z = Object.prototype;
    const G = W["__core-js_shared__"];
    const Q = (q = /[^.]+$/.exec((G && G.keys && G.keys.IE_PROTO) || ""))
      ? `Symbol(src)_1.${q}`
      : "";
    const X = U.toString;
    const Y = z.hasOwnProperty;
    const tt = z.toString;
    const et = RegExp(
      `^${X.call(Y)
        .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
        .replace(
          /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
          "$1.*?"
        )}$`
    );
    const rt = H ? W.Buffer : void 0;
    const nt = W.Symbol;
    const ot = W.Uint8Array;
    const it = F(Object.getPrototypeOf, Object);
    const at = Object.create;
    const ct = z.propertyIsEnumerable;
    const ut = B.splice;
    const st = Object.getOwnPropertySymbols;
    const ft = rt ? rt.isBuffer : void 0;
    const lt = F(Object.keys, Object);
    const pt = Dt(W, "DataView");
    const yt = Dt(W, "Map");
    const ht = Dt(W, "Promise");
    const gt = Dt(W, "Set");
    const dt = Dt(W, "WeakMap");
    const bt = Dt(Object, "create");
    const vt = Jt(pt);
    const mt = Jt(yt);
    const _t = Jt(ht);
    const wt = Jt(gt);
    const jt = Jt(dt);
    const Ot = nt ? nt.prototype : void 0;
    const $t = Ot ? Ot.valueOf : void 0;
    function St(t) {
      let e = -1;
      const r = t ? t.length : 0;
      for (this.clear(); ++e < r; ) {
        const n = t[e];
        this.set(n[0], n[1]);
      }
    }
    function At(t) {
      let e = -1;
      const r = t ? t.length : 0;
      for (this.clear(); ++e < r; ) {
        const n = t[e];
        this.set(n[0], n[1]);
      }
    }
    function Tt(t) {
      let e = -1;
      const r = t ? t.length : 0;
      for (this.clear(); ++e < r; ) {
        const n = t[e];
        this.set(n[0], n[1]);
      }
    }
    function Et(t) {
      this.__data__ = new At(t);
    }
    function Nt(t, e) {
      const r =
        Ft(t) ||
        (function(t) {
          return (
            (function(t) {
              return (
                (function(t) {
                  return !!t && typeof t == "object";
                })(t) && Vt(t)
              );
            })(t) &&
            Y.call(t, "callee") &&
            (!ct.call(t, "callee") || tt.call(t) == a)
          );
        })(t)
          ? (function(t, e) {
              for (var r = -1, n = Array(t); ++r < t; ) {
                n[r] = e(r);
              }
              return n;
            })(t.length, String)
          : [];
      const n = r.length;
      const o = !!n;
      for (const i in t) {
        (!e && !Y.call(t, i)) ||
          (o && (i == "length" || Rt(i, n))) ||
          r.push(i);
      }
      return r;
    }
    function It(t, e, r) {
      const n = t[e];
      (Y.call(t, e) && Kt(n, r) && (void 0 !== r || e in t)) || (t[e] = r);
    }
    function kt(t, e) {
      for (let r = t.length; r--; ) {
        if (Kt(t[r][0], e)) {
          return r;
        }
      }
      return -1;
    }
    function Mt(t, e, r, n, o, i, I) {
      let k;
      if ((n && (k = i ? n(t, o, i, I) : n(t)), void 0 !== k)) {
        return k;
      }
      if (!Ut(t)) {
        return t;
      }
      const x = Ft(t);
      if (x) {
        if (
          ((k = (function(t) {
            const e = t.length;
            const r = t.constructor(e);
            e &&
              typeof t[0] == "string" &&
              Y.call(t, "index") &&
              ((r.index = t.index), (r.input = t.input));
            return r;
          })(t)),
          !e)
        ) {
          return (function(t, e) {
            let r = -1;
            const n = t.length;
            e || (e = Array(n));
            for (; ++r < n; ) {
              e[r] = t[r];
            }
            return e;
          })(t, k);
        }
      } else {
        const P = Lt(t);
        const W = P == s || P == f;
        if (qt(t)) {
          return (function(t, e) {
            if (e) {
              return t.slice();
            }
            const r = new t.constructor(t.length);
            return t.copy(r), r;
          })(t, e);
        }
        if (P == y || P == a || (W && !i)) {
          if (J(t)) {
            return i ? t : {};
          }
          if (
            ((k = (function(t) {
              return typeof t.constructor != "function" || Zt(t)
                ? {}
                : ((e = it(t)), Ut(e) ? at(e) : {});
              let e;
            })(W ? {} : t)),
            !e)
          ) {
            return (function(t, e) {
              return Wt(t, Ht(t), e);
            })(
              t,
              (function(t, e) {
                return t && Wt(e, zt(e), t);
              })(k, t)
            );
          }
        } else {
          if (!M[P]) {
            return i ? t : {};
          }
          k = (function(t, e, r, n) {
            const o = t.constructor;
            switch (e) {
              case v:
                return Pt(t);
              case c:
              case u:
                return new o(+t);
              case m:
                return (function(t, e) {
                  const r = e ? Pt(t.buffer) : t.buffer;
                  return new t.constructor(r, t.byteOffset, t.byteLength);
                })(t, n);
              case _:
              case w:
              case j:
              case O:
              case $:
              case S:
              case A:
              case T:
              case E:
                return (function(t, e) {
                  const r = e ? Pt(t.buffer) : t.buffer;
                  return new t.constructor(r, t.byteOffset, t.length);
                })(t, n);
              case l:
                return (function(t, e, r) {
                  return Z(e ? r(K(t), !0) : K(t), L, new t.constructor());
                })(t, n, r);
              case p:
              case d:
                return new o(t);
              case h:
                return (
                  ((s = new (a = t).constructor(
                    a.source,
                    N.exec(a)
                  )).lastIndex = a.lastIndex),
                  s
                );
              case g:
                return (function(t, e, r) {
                  return Z(e ? r(V(t), !0) : V(t), R, new t.constructor());
                })(t, n, r);
              case b:
                return (i = t), $t ? Object($t.call(i)) : {};
            }
            let i;
            let a;
            let s;
          })(t, P, Mt, e);
        }
      }
      I || (I = new Et());
      const C = I.get(t);
      if (C) {
        return C;
      }
      if ((I.set(t, k), !x)) {
        var D = r
          ? (function(t) {
              return (function(t, e, r) {
                const n = e(t);
                return Ft(t)
                  ? n
                  : (function(t, e) {
                      for (let r = -1, n = e.length, o = t.length; ++r < n; ) {
                        t[o + r] = e[r];
                      }
                      return t;
                    })(n, r(t));
              })(t, zt, Ht);
            })(t)
          : zt(t);
      }
      return (
        (function(t, e) {
          for (
            let r = -1, n = t ? t.length : 0;
            ++r < n && !1 !== e(t[r], r, t);

          ) {}
        })(D || t, (o, i) => {
          D && (o = t[(i = o)]), It(k, i, Mt(o, e, r, n, i, t, I));
        }),
        k
      );
    }
    function xt(t) {
      return (
        !(!Ut(t) || ((e = t), Q && Q in e)) &&
        (Bt(t) || J(t) ? et : I).test(Jt(t))
      );
      let e;
    }
    function Pt(t) {
      const e = new t.constructor(t.byteLength);
      return new ot(e).set(new ot(t)), e;
    }
    function Wt(t, e, r, n) {
      r || (r = {});
      for (let o = -1, i = e.length; ++o < i; ) {
        const a = e[o];
        const c = n ? n(r[a], t[a], a, r, t) : void 0;
        It(r, a, void 0 === c ? t[a] : c);
      }
      return r;
    }
    function Ct(t, e) {
      let r;
      let n;
      const o = t.__data__;
      return ((n = typeof (r = e)) == "string" ||
      n == "number" ||
      n == "symbol" ||
      n == "boolean"
      ? r !== "__proto__"
      : r === null)
        ? o[typeof e == "string" ? "string" : "hash"]
        : o.map;
    }
    function Dt(t, e) {
      const r = (function(t, e) {
        return t == null ? void 0 : t[e];
      })(t, e);
      return xt(r) ? r : void 0;
    }
    (St.prototype.clear = function() {
      this.__data__ = bt ? bt(null) : {};
    }),
      (St.prototype.delete = function(t) {
        return this.has(t) && delete this.__data__[t];
      }),
      (St.prototype.get = function(t) {
        const e = this.__data__;
        if (bt) {
          const r = e[t];
          return r === o ? void 0 : r;
        }
        return Y.call(e, t) ? e[t] : void 0;
      }),
      (St.prototype.has = function(t) {
        const e = this.__data__;
        return bt ? void 0 !== e[t] : Y.call(e, t);
      }),
      (St.prototype.set = function(t, e) {
        return (this.__data__[t] = bt && void 0 === e ? o : e), this;
      }),
      (At.prototype.clear = function() {
        this.__data__ = [];
      }),
      (At.prototype.delete = function(t) {
        const e = this.__data__;
        const r = kt(e, t);
        return !(r < 0 || (r == e.length - 1 ? e.pop() : ut.call(e, r, 1), 0));
      }),
      (At.prototype.get = function(t) {
        const e = this.__data__;
        const r = kt(e, t);
        return r < 0 ? void 0 : e[r][1];
      }),
      (At.prototype.has = function(t) {
        return kt(this.__data__, t) > -1;
      }),
      (At.prototype.set = function(t, e) {
        const r = this.__data__;
        const n = kt(r, t);
        return n < 0 ? r.push([t, e]) : (r[n][1] = e), this;
      }),
      (Tt.prototype.clear = function() {
        this.__data__ = {
          hash: new St(),
          map: new (yt || At)(),
          string: new St()
        };
      }),
      (Tt.prototype.delete = function(t) {
        return Ct(this, t).delete(t);
      }),
      (Tt.prototype.get = function(t) {
        return Ct(this, t).get(t);
      }),
      (Tt.prototype.has = function(t) {
        return Ct(this, t).has(t);
      }),
      (Tt.prototype.set = function(t, e) {
        return Ct(this, t).set(t, e), this;
      }),
      (Et.prototype.clear = function() {
        this.__data__ = new At();
      }),
      (Et.prototype.delete = function(t) {
        return this.__data__.delete(t);
      }),
      (Et.prototype.get = function(t) {
        return this.__data__.get(t);
      }),
      (Et.prototype.has = function(t) {
        return this.__data__.has(t);
      }),
      (Et.prototype.set = function(t, e) {
        let n = this.__data__;
        if (n instanceof At) {
          const o = n.__data__;
          if (!yt || o.length < r - 1) {
            return o.push([t, e]), this;
          }
          n = this.__data__ = new Tt(o);
        }
        return n.set(t, e), this;
      });
    var Ht = st
      ? F(st, Object)
      : function() {
          return [];
        };
    var Lt = function(t) {
      return tt.call(t);
    };
    function Rt(t, e) {
      return (
        !!(e = e == null ? i : e) &&
        (typeof t == "number" || k.test(t)) &&
        t > -1 &&
        t % 1 == 0 &&
        t < e
      );
    }
    function Zt(t) {
      const e = t && t.constructor;
      return t === ((typeof e == "function" && e.prototype) || z);
    }
    function Jt(t) {
      if (t != null) {
        try {
          return X.call(t);
        } catch (t) {}
        try {
          return `${t}`;
        } catch (t) {}
      }
      return "";
    }
    function Kt(t, e) {
      return t === e || (t != t && e != e);
    }
    ((pt && Lt(new pt(new ArrayBuffer(1))) != m) ||
      (yt && Lt(new yt()) != l) ||
      (ht && Lt(ht.resolve()) != "[object Promise]") ||
      (gt && Lt(new gt()) != g) ||
      (dt && Lt(new dt()) != "[object WeakMap]")) &&
      (Lt = function(t) {
        const e = tt.call(t);
        const r = e == y ? t.constructor : void 0;
        const n = r ? Jt(r) : void 0;
        if (n) {
          switch (n) {
            case vt:
              return m;
            case mt:
              return l;
            case _t:
              return "[object Promise]";
            case wt:
              return g;
            case jt:
              return "[object WeakMap]";
          }
        }
        return e;
      });
    var Ft = Array.isArray;
    function Vt(t) {
      return (
        t != null &&
        (function(t) {
          return typeof t == "number" && t > -1 && t % 1 == 0 && t <= i;
        })(t.length) &&
        !Bt(t)
      );
    }
    var qt =
      ft ||
      function() {
        return !1;
      };
    function Bt(t) {
      const e = Ut(t) ? tt.call(t) : "";
      return e == s || e == f;
    }
    function Ut(t) {
      const e = typeof t;
      return !!t && (e == "object" || e == "function");
    }
    function zt(t) {
      return Vt(t)
        ? Nt(t)
        : (function(t) {
            if (!Zt(t)) {
              return lt(t);
            }
            const e = [];
            for (const r in Object(t)) {
              Y.call(t, r) && r != "constructor" && e.push(r);
            }
            return e;
          })(t);
    }
    t.exports = function(t) {
      return Mt(t, !0, !0);
    };
  });
  const h = "[object Object]";
  let g;
  let d;
  const b = Function.prototype;
  const v = Object.prototype;
  const m = b.toString;
  const _ = v.hasOwnProperty;
  const w = m.call(Object);
  const j = v.toString;
  const O =
    ((g = Object.getPrototypeOf),
    (d = Object),
    function(t) {
      return g(d(t));
    });
  const $ = function(t) {
    if (
      !(function(t) {
        return !!t && typeof t == "object";
      })(t) ||
      j.call(t) != h ||
      (function(t) {
        let e = !1;
        if (t != null && typeof t.toString != "function") {
          try {
            e = !!`${t}`;
          } catch (t) {}
        }
        return e;
      })(t)
    ) {
      return !1;
    }
    const e = O(t);
    if (e === null) {
      return !0;
    }
    const r = _.call(e, "constructor") && e.constructor;
    return typeof r == "function" && r instanceof r && m.call(r) == w;
  };
  const S = Array.isArray;
  function A(t) {
    return typeof t == "string" && t.length > 0 && t[0] === "."
      ? t.slice(1)
      : t;
  }
  function T(t, e) {
    return (function t(e, r, n) {
      const o = y(e);
      let i;
      let a;
      let c;
      let u;
      let s;
      if (
        (((n = Object.assign({ depth: -1, path: "" }, n)).depth += 1), S(o))
      ) {
        for (i = 0, a = o.length; i < a; i++) {
          const e = `${n.path}.${i}`;
          void 0 !== o[i]
            ? ((n.parent = y(o)),
              (n.parentType = "array"),
              (c = t(
                r(o[i], void 0, Object.assign({}, n, { path: A(e) })),
                r,
                Object.assign({}, n, { path: A(e) })
              )),
              Number.isNaN(c) && i < o.length
                ? (o.splice(i, 1), (i -= 1))
                : (o[i] = c))
            : o.splice(i, 1);
        }
      } else if ($(o)) {
        for (i = 0, a = (u = Object.keys(o)).length; i < a; i++) {
          s = u[i];
          const e = `${n.path}.${s}`;
          n.depth === 0 && s != null && (n.topmostKey = s),
            (n.parent = y(o)),
            (n.parentType = "object"),
            (c = t(
              r(s, o[s], Object.assign({}, n, { path: A(e) })),
              r,
              Object.assign({}, n, { path: A(e) })
            )),
            Number.isNaN(c) ? delete o[s] : (o[s] = c);
        }
      }
      return o;
    })(t, e, {});
  }
  const E = "__lodash_hash_undefined__";
  const N = 9007199254740991;
  const I = "[object Function]";
  const k = "[object GeneratorFunction]";
  const M = /^\[object .+?Constructor\]$/;
  const x = typeof n == "object" && n && n.Object === Object && n;
  const P = typeof self == "object" && self && self.Object === Object && self;
  const W = x || P || Function("return this")();
  function C(t, e) {
    return (
      !!(t ? t.length : 0) &&
      (function(t, e, r) {
        if (e != e) {
          return (function(t, e, r, n) {
            const o = t.length;
            let i = r + (n ? 1 : -1);
            for (; n ? i-- : ++i < o; ) {
              if (e(t[i], i, t)) {
                return i;
              }
            }
            return -1;
          })(t, L, r);
        }
        let n = r - 1;
        const o = t.length;
        for (; ++n < o; ) {
          if (t[n] === e) {
            return n;
          }
        }
        return -1;
      })(t, e, 0) > -1
    );
  }
  function D(t, e, r) {
    for (let n = -1, o = t ? t.length : 0; ++n < o; ) {
      if (r(e, t[n])) {
        return !0;
      }
    }
    return !1;
  }
  function H(t, e) {
    for (var r = -1, n = t ? t.length : 0, o = Array(n); ++r < n; ) {
      o[r] = e(t[r], r, t);
    }
    return o;
  }
  function L(t) {
    return t != t;
  }
  function R(t) {
    return function(e) {
      return t(e);
    };
  }
  function Z(t, e) {
    return t.has(e);
  }
  let J;
  const K = Array.prototype;
  const F = Function.prototype;
  const V = Object.prototype;
  const q = W["__core-js_shared__"];
  const B = (J = /[^.]+$/.exec((q && q.keys && q.keys.IE_PROTO) || ""))
    ? `Symbol(src)_1.${J}`
    : "";
  const U = F.toString;
  const z = V.hasOwnProperty;
  const G = V.toString;
  const Q = RegExp(
    `^${U.call(z)
      .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
      .replace(
        /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
        "$1.*?"
      )}$`
  );
  const X = K.splice;
  const Y = Math.max;
  const tt = Math.min;
  const et = lt(W, "Map");
  const rt = lt(Object, "create");
  function nt(t) {
    let e = -1;
    const r = t ? t.length : 0;
    for (this.clear(); ++e < r; ) {
      const n = t[e];
      this.set(n[0], n[1]);
    }
  }
  function ot(t) {
    let e = -1;
    const r = t ? t.length : 0;
    for (this.clear(); ++e < r; ) {
      const n = t[e];
      this.set(n[0], n[1]);
    }
  }
  function it(t) {
    let e = -1;
    const r = t ? t.length : 0;
    for (this.clear(); ++e < r; ) {
      const n = t[e];
      this.set(n[0], n[1]);
    }
  }
  function at(t) {
    let e = -1;
    const r = t ? t.length : 0;
    for (this.__data__ = new it(); ++e < r; ) {
      this.add(t[e]);
    }
  }
  function ct(t, e) {
    for (var r, n, o = t.length; o--; ) {
      if ((r = t[o][0]) === (n = e) || (r != r && n != n)) {
        return o;
      }
    }
    return -1;
  }
  function ut(t) {
    return (
      !(!yt(t) || ((e = t), B && B in e)) &&
      (pt(t) ||
      (function(t) {
        let e = !1;
        if (t != null && typeof t.toString != "function") {
          try {
            e = !!`${t}`;
          } catch (t) {}
        }
        return e;
      })(t)
        ? Q
        : M
      ).test(
        (function(t) {
          if (t != null) {
            try {
              return U.call(t);
            } catch (t) {}
            try {
              return `${t}`;
            } catch (t) {}
          }
          return "";
        })(t)
      )
    );
    let e;
  }
  function st(t) {
    return (function(t) {
      return (
        (function(t) {
          return !!t && typeof t == "object";
        })(t) &&
        (function(t) {
          return (
            t != null &&
            (function(t) {
              return typeof t == "number" && t > -1 && t % 1 == 0 && t <= N;
            })(t.length) &&
            !pt(t)
          );
        })(t)
      );
    })(t)
      ? t
      : [];
  }
  function ft(t, e) {
    let r;
    let n;
    const o = t.__data__;
    return ((n = typeof (r = e)) == "string" ||
    n == "number" ||
    n == "symbol" ||
    n == "boolean"
    ? r !== "__proto__"
    : r === null)
      ? o[typeof e == "string" ? "string" : "hash"]
      : o.map;
  }
  function lt(t, e) {
    const r = (function(t, e) {
      return t == null ? void 0 : t[e];
    })(t, e);
    return ut(r) ? r : void 0;
  }
  function pt(t) {
    const e = yt(t) ? G.call(t) : "";
    return e == I || e == k;
  }
  function yt(t) {
    const e = typeof t;
    return !!t && (e == "object" || e == "function");
  }
  (nt.prototype.clear = function() {
    this.__data__ = rt ? rt(null) : {};
  }),
    (nt.prototype.delete = function(t) {
      return this.has(t) && delete this.__data__[t];
    }),
    (nt.prototype.get = function(t) {
      const e = this.__data__;
      if (rt) {
        const r = e[t];
        return r === E ? void 0 : r;
      }
      return z.call(e, t) ? e[t] : void 0;
    }),
    (nt.prototype.has = function(t) {
      const e = this.__data__;
      return rt ? void 0 !== e[t] : z.call(e, t);
    }),
    (nt.prototype.set = function(t, e) {
      return (this.__data__[t] = rt && void 0 === e ? E : e), this;
    }),
    (ot.prototype.clear = function() {
      this.__data__ = [];
    }),
    (ot.prototype.delete = function(t) {
      const e = this.__data__;
      const r = ct(e, t);
      return !(r < 0 || (r == e.length - 1 ? e.pop() : X.call(e, r, 1), 0));
    }),
    (ot.prototype.get = function(t) {
      const e = this.__data__;
      const r = ct(e, t);
      return r < 0 ? void 0 : e[r][1];
    }),
    (ot.prototype.has = function(t) {
      return ct(this.__data__, t) > -1;
    }),
    (ot.prototype.set = function(t, e) {
      const r = this.__data__;
      const n = ct(r, t);
      return n < 0 ? r.push([t, e]) : (r[n][1] = e), this;
    }),
    (it.prototype.clear = function() {
      this.__data__ = {
        hash: new nt(),
        map: new (et || ot)(),
        string: new nt()
      };
    }),
    (it.prototype.delete = function(t) {
      return ft(this, t).delete(t);
    }),
    (it.prototype.get = function(t) {
      return ft(this, t).get(t);
    }),
    (it.prototype.has = function(t) {
      return ft(this, t).has(t);
    }),
    (it.prototype.set = function(t, e) {
      return ft(this, t).set(t, e), this;
    }),
    (at.prototype.add = at.prototype.push = function(t) {
      return this.__data__.set(t, E), this;
    }),
    (at.prototype.has = function(t) {
      return this.__data__.has(t);
    });
  const ht = (function(t, e) {
    return (
      (e = Y(void 0 === e ? t.length - 1 : e, 0)),
      function() {
        for (
          var r = arguments, n = -1, o = Y(r.length - e, 0), i = Array(o);
          ++n < o;

        ) {
          i[n] = r[e + n];
        }
        n = -1;
        for (var a = Array(e + 1); ++n < e; ) {
          a[n] = r[n];
        }
        return (
          (a[e] = i),
          (function(t, e, r) {
            switch (r.length) {
              case 0:
                return t.call(e);
              case 1:
                return t.call(e, r[0]);
              case 2:
                return t.call(e, r[0], r[1]);
              case 3:
                return t.call(e, r[0], r[1], r[2]);
            }
            return t.apply(e, r);
          })(t, this, a)
        );
      }
    );
  })(t => {
    const e = H(t, st);
    return e.length && e[0] === t[0]
      ? (function(t, e, r) {
          for (
            var n = r ? D : C,
              o = t[0].length,
              i = t.length,
              a = i,
              c = Array(i),
              u = 1 / 0,
              s = [];
            a--;

          ) {
            var f = t[a];
            a && e && (f = H(f, R(e))),
              (u = tt(f.length, u)),
              (c[a] =
                !r && (e || (o >= 120 && f.length >= 120))
                  ? new at(a && f)
                  : void 0);
          }
          f = t[0];
          let l = -1;
          const p = c[0];
          t: for (; ++l < o && s.length < u; ) {
            let y = f[l];
            const h = e ? e(y) : y;
            if (((y = r || y !== 0 ? y : 0), !(p ? Z(p, h) : n(s, h, r)))) {
              for (a = i; --a; ) {
                const g = c[a];
                if (!(g ? Z(g, h) : n(t[a], h, r))) {
                  continue t;
                }
              }
              p && p.push(h), s.push(y);
            }
          }
          return s;
        })(e)
      : [];
  });
  function gt(t) {
    return typeof t == "string" ? (t.length > 0 ? [t] : []) : t;
  }
  const dt = o(t => {
    t.exports = (function() {
      const t = Object.prototype.toString;
      function e(t, e) {
        return t != null && Object.prototype.hasOwnProperty.call(t, e);
      }
      function r(t) {
        if (!t) {
          return !0;
        }
        if (o(t) && t.length === 0) {
          return !0;
        }
        if (typeof t != "string") {
          for (const r in t) {
            if (e(t, r)) {
              return !1;
            }
          }
          return !0;
        }
        return !1;
      }
      function n(e) {
        return t.call(e);
      }
      var o =
        Array.isArray ||
        function(e) {
          return t.call(e) === "[object Array]";
        };
      function i(t) {
        const e = parseInt(t);
        return e.toString() === t ? e : t;
      }
      function a(t) {
        t = t || {};
        var a = function(t) {
          return Object.keys(a).reduce((e, r) => {
            return r === "create"
              ? e
              : (typeof a[r] == "function" && (e[r] = a[r].bind(a, t)), e);
          }, {});
        };
        function c(r, n) {
          return (
            t.includeInheritedProps ||
            (typeof n == "number" && Array.isArray(r)) ||
            e(r, n)
          );
        }
        function u(t, e) {
          if (c(t, e)) {
            return t[e];
          }
        }
        function s(t, e, r, n) {
          if ((typeof e == "number" && (e = [e]), !e || e.length === 0)) {
            return t;
          }
          if (typeof e == "string") {
            return s(t, e.split(".").map(i), r, n);
          }
          const o = e[0];
          const a = u(t, o);
          return e.length === 1
            ? ((void 0 !== a && n) || (t[o] = r), a)
            : (void 0 === a &&
                (typeof e[1] == "number" ? (t[o] = []) : (t[o] = {})),
              s(t[o], e.slice(1), r, n));
        }
        return (
          (a.has = function(r, n) {
            if (
              (typeof n == "number"
                ? (n = [n])
                : typeof n == "string" && (n = n.split(".")),
              !n || n.length === 0)
            ) {
              return !!r;
            }
            for (let a = 0; a < n.length; a++) {
              const c = i(n[a]);
              if (
                !(
                  (typeof c == "number" && o(r) && c < r.length) ||
                  (t.includeInheritedProps ? c in Object(r) : e(r, c))
                )
              ) {
                return !1;
              }
              r = r[c];
            }
            return !0;
          }),
          (a.ensureExists = function(t, e, r) {
            return s(t, e, r, !0);
          }),
          (a.set = function(t, e, r, n) {
            return s(t, e, r, n);
          }),
          (a.insert = function(t, e, r, n) {
            let i = a.get(t, e);
            (n = ~~n), o(i) || ((i = []), a.set(t, e, i)), i.splice(n, 0, r);
          }),
          (a.empty = function(t, e) {
            let i;
            let u;
            if (!r(e) && t != null && (i = a.get(t, e))) {
              if (typeof i == "string") {
                return a.set(t, e, "");
              }
              if (
                (function(t) {
                  return typeof t == "boolean" || n(t) === "[object Boolean]";
                })(i)
              ) {
                return a.set(t, e, !1);
              }
              if (typeof i == "number") {
                return a.set(t, e, 0);
              }
              if (o(i)) {
                i.length = 0;
              } else {
                if (
                  !(function(t) {
                    return typeof t == "object" && n(t) === "[object Object]";
                  })(i)
                ) {
                  return a.set(t, e, null);
                }
                for (u in i) {
                  c(i, u) && delete i[u];
                }
              }
            }
          }),
          (a.push = function(t, e) {
            let r = a.get(t, e);
            o(r) || ((r = []), a.set(t, e, r)),
              r.push.apply(r, Array.prototype.slice.call(arguments, 2));
          }),
          (a.coalesce = function(t, e, r) {
            for (var n, o = 0, i = e.length; o < i; o++) {
              if (void 0 !== (n = a.get(t, e[o]))) {
                return n;
              }
            }
            return r;
          }),
          (a.get = function(t, e, r) {
            if ((typeof e == "number" && (e = [e]), !e || e.length === 0)) {
              return t;
            }
            if (t == null) {
              return r;
            }
            if (typeof e == "string") {
              return a.get(t, e.split("."), r);
            }
            const n = i(e[0]);
            const o = u(t, n);
            return void 0 === o
              ? r
              : e.length === 1
              ? o
              : a.get(t[n], e.slice(1), r);
          }),
          (a.del = function(t, e) {
            if ((typeof e == "number" && (e = [e]), t == null)) {
              return t;
            }
            if (r(e)) {
              return t;
            }
            if (typeof e == "string") {
              return a.del(t, e.split("."));
            }
            const n = i(e[0]);
            return c(t, n)
              ? e.length !== 1
                ? a.del(t[n], e.slice(1))
                : (o(t) ? t.splice(n, 1) : delete t[n], t)
              : t;
          }),
          a
        );
      }
      const c = a();
      return (
        (c.create = a),
        (c.withInheritedProps = a({ includeInheritedProps: !0 })),
        c
      );
    })();
  });
  const bt = function(t) {
    const e = t % 100;
    if (e >= 10 && e <= 20) {
      return "th";
    }
    const r = t % 10;
    return r === 1 ? "st" : r === 2 ? "nd" : r === 3 ? "rd" : "th";
  };
  function vt(t) {
    if (typeof t != "number") {
      throw new TypeError(`Expected Number, got ${typeof t} ${t}`);
    }
    return t + bt(t);
  }
  vt.indicator = bt;
  const mt = vt;
  const _t = /[|\\{}()[\]^$+*?.]/g;
  const wt = function(t) {
    if (typeof t != "string") {
      throw new TypeError("Expected a string");
    }
    return t.replace(_t, "\\$&");
  };
  const jt = new Map();
  function Ot(t, e) {
    const r = Object.assign({ caseSensitive: !1 }, e);
    const n = t + JSON.stringify(r);
    if (jt.has(n)) {
      return jt.get(n);
    }
    const o = t[0] === "!";
    o && (t = t.slice(1)), (t = wt(t).replace(/\\\*/g, ".*"));
    const i = new RegExp(`^${t}$`, r.caseSensitive ? "" : "i");
    return (i.negated = o), jt.set(n, i), i;
  }
  const $t = (t, e, r) => {
    if (!Array.isArray(t) || !Array.isArray(e)) {
      throw new TypeError(`Expected two arrays, got ${typeof t} ${typeof e}`);
    }
    if (e.length === 0) {
      return t;
    }
    const n = e[0][0] === "!";
    e = e.map(t => Ot(t, r));
    const o = [];
    for (const r of t) {
      let t = n;
      for (const n of e) {
        n.test(r) && (t = !n.negated);
      }
      t && o.push(r);
    }
    return o;
  };
  function St(t, e, r) {
    return (function t(e, r, n, o = !0) {
      const i = Object.prototype.hasOwnProperty;
      function c(t) {
        return t != null;
      }
      function u(t) {
        return a(t) === "Object";
      }
      function s(t, e) {
        return (
          (e = gt(e)),
          Array.from(t).filter(
            t => !e.some(e => $t.isMatch(t, e, { caseSensitive: !0 }))
          )
        );
      }
      const f = [
        "any",
        "anything",
        "every",
        "everything",
        "all",
        "whatever",
        "whatevs"
      ];
      const l = Array.isArray;
      if (!c(e)) {
        throw new Error(
          "check-types-mini: [THROW_ID_01] First argument is missing!"
        );
      }
      const y = {
        ignoreKeys: [],
        ignorePaths: [],
        acceptArrays: !1,
        acceptArraysIgnore: [],
        enforceStrictKeyset: !0,
        schema: {},
        msg: "check-types-mini",
        optsVarName: "opts"
      };
      let h;
      if (
        ((h = c(n) && u(n) ? Object.assign({}, y, n) : Object.assign({}, y)),
        c(h.ignoreKeys) && h.ignoreKeys
          ? (h.ignoreKeys = gt(h.ignoreKeys))
          : (h.ignoreKeys = []),
        c(h.ignorePaths) && h.ignorePaths
          ? (h.ignorePaths = gt(h.ignorePaths))
          : (h.ignorePaths = []),
        c(h.acceptArraysIgnore) && h.acceptArraysIgnore
          ? (h.acceptArraysIgnore = gt(h.acceptArraysIgnore))
          : (h.acceptArraysIgnore = []),
        (h.msg = typeof h.msg == "string" ? h.msg.trim() : h.msg),
        h.msg[h.msg.length - 1] === ":" &&
          (h.msg = h.msg.slice(0, h.msg.length - 1).trim()),
        h.schema &&
          (Object.keys(h.schema).forEach(t => {
            if (u(h.schema[t])) {
              const e = {};
              T(h.schema[t], (r, n, o) => {
                const i = void 0 !== n ? n : r;
                return l(i) || u(i) || (e[`${t}.${o.path}`] = i), i;
              }),
                delete h.schema[t],
                (h.schema = Object.assign(h.schema, e));
            }
          }),
          Object.keys(h.schema).forEach(t => {
            l(h.schema[t]) || (h.schema[t] = [h.schema[t]]),
              (h.schema[t] = h.schema[t]
                .map(String)
                .map(t => t.toLowerCase())
                .map(t => t.trim()));
          })),
        c(r) || (r = {}),
        o && t(h, y, { enforceStrictKeyset: !1 }, !1),
        h.enforceStrictKeyset)
      ) {
        if (c(h.schema) && Object.keys(h.schema).length > 0) {
          if (
            s(
              p(Object.keys(e), Object.keys(r).concat(Object.keys(h.schema))),
              h.ignoreKeys
            ).length !== 0
          ) {
            const t = p(
              Object.keys(e),
              Object.keys(r).concat(Object.keys(h.schema))
            );
            throw new TypeError(
              `${h.msg}: ${
                h.optsVarName
              }.enforceStrictKeyset is on and the following key${
                t.length > 1 ? "s" : ""
              } ${
                t.length > 1 ? "are" : "is"
              } not covered by schema and/or reference objects: ${t.join(", ")}`
            );
          }
        } else {
          if (!(c(r) && Object.keys(r).length > 0)) {
            throw new TypeError(
              `${h.msg}: Both ${h.optsVarName}.schema and reference objects are missing! We don't have anything to match the keys as you requested via opts.enforceStrictKeyset!`
            );
          }
          if (s(p(Object.keys(e), Object.keys(r)), h.ignoreKeys).length !== 0) {
            const t = p(Object.keys(e), Object.keys(r));
            throw new TypeError(
              `${h.msg}: The input object has key${
                t.length > 1 ? "s" : ""
              } which ${
                t.length > 1 ? "are" : "is"
              } not covered by the reference object: ${t.join(", ")}`
            );
          }
          if (s(p(Object.keys(r), Object.keys(e)), h.ignoreKeys).length !== 0) {
            const t = p(Object.keys(r), Object.keys(e));
            throw new TypeError(
              `${h.msg}: The reference object has key${
                t.length > 1 ? "s" : ""
              } which ${
                t.length > 1 ? "are" : "is"
              } not present in the input object: ${t.join(", ")}`
            );
          }
        }
      }
      const g = [];
      T(e, (t, n, o) => {
        let c = n;
        let s = t;
        if (
          (o.parentType === "array" && ((s = void 0), (c = t)),
          l(g) && g.length && g.some(t => o.path.startsWith(t)))
        ) {
          return c;
        }
        if (s && h.ignoreKeys.some(t => $t.isMatch(s, t))) {
          return c;
        }
        if (h.ignorePaths.some(t => $t.isMatch(o.path, t))) {
          return c;
        }
        const p = !(!u(c) && !l(c) && l(o.parent));
        let y = !1;
        u(h.schema) && i.call(h.schema, dt.get(o.path)) && (y = !0);
        let d = !1;
        if (
          (u(r) && dt.has(r, dt.get(o.path)) && (d = !0),
          h.enforceStrictKeyset && p && !y && !d)
        ) {
          throw new TypeError(
            `${h.msg}: ${h.optsVarName}.${
              o.path
            } is neither covered by reference object (second input argument), nor ${
              h.optsVarName
            }.schema! To stop this error, turn off ${
              h.optsVarName
            }.enforceStrictKeyset or provide some type reference (2nd argument or ${
              h.optsVarName
            }.schema).\n\nDebug info:\n\nobj = ${JSON.stringify(
              e,
              null,
              4
            )}\n\nref = ${JSON.stringify(
              r,
              null,
              4
            )}\n\ninnerObj = ${JSON.stringify(
              o,
              null,
              4
            )}\n\nopts = ${JSON.stringify(
              h,
              null,
              4
            )}\n\ncurrent = ${JSON.stringify(c, null, 4)}\n\n`
          );
        }
        if (y) {
          const t = gt(h.schema[o.path])
            .map(String)
            .map(t => t.toLowerCase());
          if ((dt.set(h.schema, o.path, t), ht(t, f).length)) {
            g.push(o.path);
          } else if (
            (!0 !== c && !1 !== c && !t.includes(a(c).toLowerCase())) ||
            ((!0 === c || !1 === c) &&
              !t.includes(String(c)) &&
              !t.includes("boolean"))
          ) {
            if (!l(c) || !h.acceptArrays) {
              throw new TypeError(
                `${h.msg}: ${h.optsVarName}.${o.path} was customised to ${
                  a(c) !== "string" ? '"' : ""
                }${JSON.stringify(c, null, 0)}${
                  a(c) !== "string" ? '"' : ""
                } (type: ${a(
                  c
                ).toLowerCase()}) which is not among the allowed types in schema (which is equal to ${JSON.stringify(
                  t,
                  null,
                  0
                )})`
              );
            }
            for (let e = 0, r = c.length; e < r; e++) {
              if (!t.includes(a(c[e]).toLowerCase())) {
                throw new TypeError(
                  `${h.msg}: ${h.optsVarName}.${o.path}.${e}, the ${mt(
                    e + 1
                  )} element (equal to ${JSON.stringify(
                    c[e],
                    null,
                    0
                  )}) is of a type ${a(
                    c[e]
                  ).toLowerCase()}, but only the following are allowed by the ${
                    h.optsVarName
                  }.schema: ${t.join(", ")}`
                );
              }
            }
          }
        } else if (d) {
          const e = dt.get(r, o.path);
          if (h.acceptArrays && l(c) && !h.acceptArraysIgnore.includes(t)) {
            if (!c.every(e => a(e).toLowerCase() === a(r[t]).toLowerCase())) {
              throw new TypeError(
                `${h.msg}: ${h.optsVarName}.${
                  o.path
                } was customised to be array, but not all of its elements are ${a(
                  r[t]
                ).toLowerCase()}-type`
              );
            }
          } else if (a(c) !== a(e)) {
            throw new TypeError(
              `${h.msg}: ${h.optsVarName}.${o.path} was customised to ${
                a(c).toLowerCase() === "string" ? "" : '"'
              }${JSON.stringify(c, null, 0)}${
                a(c).toLowerCase() === "string" ? "" : '"'
              } which is not ${a(e).toLowerCase()} but ${a(c).toLowerCase()}`
            );
          }
        }
        return c;
      });
    })(t, e, r);
  }
  $t.isMatch = (t, e, r) => {
    const n = Ot(e, r);
    const o = n.test(t);
    return n.negated ? !o : o;
  };
  const At = Array.isArray;
  function Tt(t, r) {
    if (!At(t)) {
      throw new TypeError(
        `ranges-sort: [THROW_ID_01] Input must be an array, consisting of range arrays! Currently its type is: ${typeof t}, equal to: ${JSON.stringify(
          t,
          null,
          4
        )}`
      );
    }
    if (t.length === 0) {
      return t;
    }
    const n = { strictlyTwoElementsInRangeArrays: !1, progressFn: null };
    const o = Object.assign({}, n, r);
    let a;
    let c;
    if (
      (St(o, n, {
        msg: "ranges-sort: [THROW_ID_02*]",
        schema: { progressFn: ["function", "false", "null"] }
      }),
      o.strictlyTwoElementsInRangeArrays &&
        !t.every((t, e) => t.length === 2 || ((a = e), (c = t.length), !1)))
    ) {
      throw new TypeError(
        `ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ${i(
          a
        )} range (${JSON.stringify(
          t[a],
          null,
          4
        )}) has not two but ${c} elements!`
      );
    }
    if (
      !t.every(
        (t, r) =>
          !(!e(t[0], { includeZero: !0 }) || !e(t[1], { includeZero: !0 })) ||
          ((a = r), !1)
      )
    ) {
      throw new TypeError(
        `ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ${i(
          a
        )} range (${JSON.stringify(
          t[a],
          null,
          4
        )}) does not consist of only natural numbers!`
      );
    }
    const u = t.length * t.length;
    let s = 0;
    return Array.from(t).sort(
      (t, e) => (
        o.progressFn && (s++, o.progressFn(Math.floor((100 * s) / u))),
        t[0] === e[0]
          ? t[1] < e[1]
            ? -1
            : t[1] > e[1]
            ? 1
            : 0
          : t[0] < e[0]
          ? -1
          : 1
      )
    );
  }
  const Et = Array.isArray;
  return function(n, o, a) {
    let c = 0;
    let u = 0;
    if (arguments.length === 0) {
      throw new Error("ranges-apply: [THROW_ID_01] inputs missing!");
    }
    if (typeof n != "string") {
      throw new TypeError(
        "ranges-apply: [THROW_ID_02] first input argument must be a string! Currently it's: "
          .concat(t(n), ", equal to: ")
          .concat(JSON.stringify(n, null, 4))
      );
    }
    if (o === null) {
      return n;
    }
    if (!Et(o)) {
      throw new TypeError(
        "ranges-apply: [THROW_ID_03] second input argument must be an array (or null)! Currently it's: "
          .concat(t(o), ", equal to: ")
          .concat(JSON.stringify(o, null, 4))
      );
    }
    if (a && typeof a != "function") {
      throw new TypeError(
        "ranges-apply: [THROW_ID_04] the third input argument must be a function (or falsey)! Currently it's: "
          .concat(t(a), ", equal to: ")
          .concat(JSON.stringify(a, null, 4))
      );
    }
    Et(o) &&
      (e(o[0], { includeZero: !0 }) || r(o[0], { includeZero: !0 })) &&
      (e(o[1], { includeZero: !0 }) || r(o[1], { includeZero: !0 })) &&
      (o = [o]);
    const s = o.length;
    let f = 0;
    o.forEach((n, l) => {
      if (
        (a && (c = Math.floor((f / s) * 10)) !== u && ((u = c), a(c)), !Et(n))
      ) {
        throw new TypeError(
          "ranges-apply: [THROW_ID_05] ranges array, second input arg., has "
            .concat(i(l), " element not an array: ")
            .concat(JSON.stringify(n, null, 4), ", which is ")
            .concat(t(n))
        );
      }
      if (!e(n[0], { includeZero: !0 })) {
        if (!r(n[0], { includeZero: !0 })) {
          throw new TypeError(
            "ranges-apply: [THROW_ID_06] ranges array, second input arg. has "
              .concat(i(l), " element, array [")
              .concat(n[0], ",")
              .concat(
                n[1],
                "]. That array has first element not an integer, but "
              )
              .concat(t(n[0]), ", equal to: ")
              .concat(
                JSON.stringify(n[0], null, 4),
                ". Computer doesn't like this."
              )
          );
        }
        o[l][0] = Number.parseInt(o[l][0], 10);
      }
      if (!e(n[1], { includeZero: !0 })) {
        if (!r(n[1], { includeZero: !0 })) {
          throw new TypeError(
            "ranges-apply: [THROW_ID_07] ranges array, second input arg. has "
              .concat(i(l), " element, array [")
              .concat(n[0], ",")
              .concat(
                n[1],
                "]. That array has second element not an integer, but "
              )
              .concat(t(n[1]), ", equal to: ")
              .concat(
                JSON.stringify(n[1], null, 4),
                ". Computer doesn't like this."
              )
          );
        }
        o[l][1] = Number.parseInt(o[l][1], 10);
      }
      f++;
    });
    const l = (function(t, e) {
      if (!Array.isArray(t)) {
        return t;
      }
      if (e && typeof e != "function") {
        throw new Error(
          `ranges-merge: [THROW_ID_01] the second input argument must be a function! It was given of a type: "${typeof e}", equal to ${JSON.stringify(
            e,
            null,
            4
          )}`
        );
      }
      const r = y(t).filter(t => void 0 !== t[2] || t[0] !== t[1]);
      let n;
      let o;
      let i;
      const a =
        (n = e
          ? Tt(r, {
              progressFn: t => {
                (i = Math.floor(t / 5)) !== o && ((o = i), e(i));
              }
            })
          : Tt(r)).length - 1;
      for (let t = a; t > 0; t--) {
        e &&
          (i = Math.floor(78 * (1 - t / a)) + 21) !== o &&
          i > o &&
          ((o = i), e(i)),
          (n[t][0] <= n[t - 1][0] || n[t][0] <= n[t - 1][1]) &&
            ((n[t - 1][0] = Math.min(n[t][0], n[t - 1][0])),
            (n[t - 1][1] = Math.max(n[t][1], n[t - 1][1])),
            void 0 !== n[t][2] &&
              (n[t - 1][0] >= n[t][0] || n[t - 1][1] <= n[t][1]) &&
              n[t - 1][2] !== null &&
              (n[t][2] === null && n[t - 1][2] !== null
                ? (n[t - 1][2] = null)
                : void 0 !== n[t - 1][2]
                ? (n[t - 1][2] += n[t][2])
                : (n[t - 1][2] = n[t][2])),
            n.splice(t, 1),
            (t = n.length));
      }
      return n;
    })(o, t => {
      a && (c = 10 + Math.floor(t / 10)) !== u && ((u = c), a(c));
    });
    const p = l.length;
    if (p > 0) {
      const h = n.slice(l[p - 1][1]);
      (n = l.reduce((t, e, r, o) => {
        a && (c = 20 + Math.floor((r / p) * 80)) !== u && ((u = c), a(c));
        const i = r === 0 ? 0 : o[r - 1][1];
        const s = o[r][0];
        return t + n.slice(i, s) + (o[r][2] != null ? o[r][2] : "");
      }, "")),
        (n += h);
    }
    return n;
  };
});
