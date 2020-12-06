import tap from "tap";
import { stri as stri2 } from "../dist/stristri.esm";
import { stri, mixer } from "./util/util";

tap.only(`01 - testing api directly`, (t) => {
  t.equal(stri2("<div>").result, "", "01");
  t.end();
});

// HTML only
// -----------------------------------------------------------------------------

tap.test(`02 - basic`, (t) => {
  const source = `<html><div>`;
  mixer({
    html: true,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, source, opt).result, ``, JSON.stringify(opt, null, 4));
  });
  mixer({
    html: false,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, source, opt).result,
      `<html><div>`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`03 - basic`, (t) => {
  const source = `abc<!--tralala-->def`;
  mixer({
    html: true,
    text: true,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, source, opt).result, ``, JSON.stringify(opt, null, 4));
  });
  mixer({
    html: true,
    text: false,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, source, opt).result,
      `abc def`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    text: true,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, source, opt).result,
      `<!--tralala-->`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    text: false,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, source, opt).result,
      source,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

// mixed
// -----------------------------------------------------------------------------

tap.test(`04 - ensure no accidental text concat`, (t) => {
  const source = `abc<html><div>def`;

  mixer({
    html: true,
    text: true,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, source, opt).result, ``, JSON.stringify(opt, null, 4));
  });

  mixer({
    html: true,
    text: false,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, source, opt).result,
      `abc def`,
      JSON.stringify(opt, null, 4)
    );
  });

  mixer({
    html: false,
    text: true,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, source, opt).result,
      `<html><div>`,
      JSON.stringify(opt, null, 4)
    );
  });

  mixer({
    html: false,
    text: false,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, source, opt).result,
      source,
      JSON.stringify(opt, null, 4)
    );
  });

  t.end();
});
