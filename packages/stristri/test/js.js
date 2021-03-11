import tap from "tap";
import { stri as stri2 } from "../dist/stristri.esm";
import { stri, mixer } from "./util/util";

tap.test(`01 - testing api directly`, (t) => {
  t.equal(stri2("<script>console.log</script>").result, "", "01");
  t.end();
});

tap.test(`02`, (t) => {
  const source = `<script>{{</script>`;
  t.equal(
    stri2(source, {
      html: false,
      js: true,
    }).result,
    "<script></script>",
    "02"
  );
  t.end();
});

tap.test(`03`, (t) => {
  const source = `<script>{{</script>`;
  mixer({
    html: true,
    js: true,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, source, opt).result, ``, JSON.stringify(opt, null, 4));
  });
  mixer({
    html: false,
    js: true,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, source, opt).result,
      `<script></script>`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: true,
    js: false,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, source, opt).result, `{{`, JSON.stringify(opt, null, 4));
  });
  mixer({
    html: false,
    js: false,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, source, opt).result,
      source,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`04`, (t) => {
  const source = `<html>real text<script>!function(e){function z{}};return"></script></body></html>`;

  // 2^3=8 combinations

  mixer({
    html: true,
    text: true,
    js: true,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, source, opt).result, ``, JSON.stringify(opt, null, 4));
  });
  mixer({
    html: true,
    text: true,
    js: false,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, source, opt).result,
      `!function(e){function z{}};return">`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: true,
    text: false,
    js: true,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, source, opt).result,
      `real text`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    text: true,
    js: true,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, source, opt).result,
      `<html> <script></script></body></html>`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    text: false,
    js: true,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, source, opt).result,
      `<html>real text<script></script></body></html>`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: true,
    text: false,
    js: false,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, source, opt).result,
      `real text !function(e){function z{}};return">`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    text: true,
    js: false,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, source, opt).result,
      `<html> <script>!function(e){function z{}};return"></script></body></html>`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    text: false,
    js: false,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, source, opt).result,
      source,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`05`, (t) => {
  const source = `<html> <script>console.log("<html>")</script></html>`;

  // 2^2 = 4 variations

  mixer({
    html: true,
    js: true,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, source, opt).result, ``, JSON.stringify(opt, null, 4));
  });
  mixer({
    html: true,
    js: false,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, source, opt).result,
      `console.log("<html>")`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    js: true,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, source, opt).result,
      `<html> <script></script></html>`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    js: false,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, source, opt).result,
      source,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`06 - minimal <script> tags`, (t) => {
  const source = `abc<script>\nconst x = 0;\n</script>xyz`;
  mixer({
    html: true,
    js: true,
    text: false,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, source, opt).result,
      `abc xyz`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`07 - <script> tags`, (t) => {
  const source = `abc<script>
const x = [
  'a',
];
const y = [
  'b',
];
function c(d, e, f) {
  if ( d === c || !x(y) || f.g(d) || h.i(j) ) {
    return null;
  } else {
    return [d, e ? f : '', g].filter(el => el !== '').join('');
  }
};
</script>xyz`;

  mixer({
    html: true,
    js: false,
    text: true,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, source, opt).result,
      `const x = [
'a',
];
const y = [
'b',
];
function c(d, e, f) {
if ( d === c || !x(y) || f.g(d) || h.i(j) ) {
return null;
} else {
return [d, e ? f : '', g].filter(el => el !== '').join('');
}
};`,
      JSON.stringify(opt, null, 4)
    );
  });

  t.end();
});
