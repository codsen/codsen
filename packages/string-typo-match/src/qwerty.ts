// Frozen US-QWERTY letter adjacency. Rows have x offsets 0, 0.25 and 0.75,
// y coordinates 0, 1 and 2; centers at Euclidean distance <= 1.3 are neighbours.
// Edges are listed explicitly in both directions. Uppercase has the same
// adjacency within its own case; there are no cross-case edges. Digits,
// punctuation and other layouts are deliberately absent and use general costs.
const lower: Readonly<Record<string, readonly string[]>> = Object.freeze({
  q: Object.freeze(["w", "a"]),
  w: Object.freeze(["q", "e", "a", "s"]),
  e: Object.freeze(["w", "r", "s", "d"]),
  r: Object.freeze(["e", "t", "d", "f"]),
  t: Object.freeze(["r", "y", "f", "g"]),
  y: Object.freeze(["t", "u", "g", "h"]),
  u: Object.freeze(["y", "i", "h", "j"]),
  i: Object.freeze(["u", "o", "j", "k"]),
  o: Object.freeze(["i", "p", "k", "l"]),
  p: Object.freeze(["o", "l"]),
  a: Object.freeze(["q", "w", "s", "z"]),
  s: Object.freeze(["w", "e", "a", "d", "z", "x"]),
  d: Object.freeze(["e", "r", "s", "f", "x", "c"]),
  f: Object.freeze(["r", "t", "d", "g", "c", "v"]),
  g: Object.freeze(["t", "y", "f", "h", "v", "b"]),
  h: Object.freeze(["y", "u", "g", "j", "b", "n"]),
  j: Object.freeze(["u", "i", "h", "k", "n", "m"]),
  k: Object.freeze(["i", "o", "j", "l", "m"]),
  l: Object.freeze(["o", "p", "k"]),
  z: Object.freeze(["a", "s", "x"]),
  x: Object.freeze(["s", "d", "z", "c"]),
  c: Object.freeze(["d", "f", "x", "v"]),
  v: Object.freeze(["f", "g", "c", "b"]),
  b: Object.freeze(["g", "h", "v", "n"]),
  n: Object.freeze(["h", "j", "b", "m"]),
  m: Object.freeze(["j", "k", "n"]),
});

const qwerty: Record<string, readonly string[]> = Object.create(null);
for (const key of Object.keys(lower)) {
  qwerty[key] = lower[key];
  qwerty[key.toUpperCase()] = Object.freeze(
    lower[key].map((neighbour) => neighbour.toUpperCase()),
  );
}

export default Object.freeze(qwerty);
