import tap from "tap";
import { stri as stri2 } from "../dist/stristri.esm";
import { stri, mixer } from "./util/util";

// Templating tags only
// -----------------------------------------------------------------------------

tap.test(`01 - nunjucks only, one token`, (t) => {
  const input = `{% set x = 1 %}`;
  mixer({
    templatingTags: true,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, input, opt).result, ``, JSON.stringify(opt, null, 4));
    t.equal(
      stri(t, n, input, opt).templatingLang.name,
      `Nunjucks`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    templatingTags: false,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, input, opt).result, input, JSON.stringify(opt, null, 4));
    t.equal(
      stri(t, n, input, opt).templatingLang.name,
      `Nunjucks`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`02 - nunjucks only, multiple tokens`, (t) => {
  const input = `{% if something %}{% set z = 0 %}{% endif %}`;
  mixer({
    templatingTags: true,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, input, opt).result, ``, JSON.stringify(opt, null, 4));
  });
  mixer({
    templatingTags: false,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, input, opt).result, input, JSON.stringify(opt, null, 4));
  });
  t.end();
});

// Templating tags mixed with html
// -----------------------------------------------------------------------------

tap.test(`03 - nunjucks only, one token`, (t) => {
  const input = `{% set x = 1 %}`;
  mixer({
    templatingTags: true,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, input, opt).result, ``, JSON.stringify(opt, null, 4));
  });
  mixer({
    templatingTags: false,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, input, opt).result, input, JSON.stringify(opt, null, 4));
  });
  t.end();
});

// Templating tags mixed with text
// -----------------------------------------------------------------------------

tap.test(
  `04 - imaginary templating language, tag includes line breaks`,
  (t) => {
    const input = `abc
\${ klm
nop }$
def`;
    mixer({
      templatingTags: true,
      text: true,
    }).forEach((opt, n) => {
      t.equal(stri(t, n, input, opt).result, ``, JSON.stringify(opt, null, 4));
    });
    mixer({
      templatingTags: true,
      text: false,
    }).forEach((opt, n) => {
      t.equal(
        stri(t, n, input, opt).result,
        `abc\n\ndef`,
        JSON.stringify(opt, null, 4)
      );
    });
    mixer({
      templatingTags: false,
      text: true,
    }).forEach((opt, n) => {
      t.equal(
        stri(t, n, input, opt).result,
        `\${ klm
nop }$`,
        JSON.stringify(opt, null, 4)
      );
    });
    mixer({
      templatingTags: false,
      text: false,
    }).forEach((opt, n) => {
      t.equal(
        stri(t, n, input, opt).result,
        input,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(`05 - ERB embedded expressions`, (t) => {
  const input = `<a href="https://example.com/test?param1=<%= @param1 %>&param2=<%= @param2 %>">click me</a>`;
  mixer({
    html: true,
    text: true,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, input, opt).result, ``, JSON.stringify(opt, null, 4));
  });
  mixer({
    html: false,
    text: true,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, input, opt).result,
      `<a href="https://example.com/test?param1=<%= @param1 %>&param2=<%= @param2 %>"> </a>`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: true,
    text: false,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, input, opt).result,
      `click me`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    text: false,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, input, opt).result, input, JSON.stringify(opt, null, 4));
  });
  t.end();
});
