import tap from "tap";
// import { stri as stri2 } from "../dist/stristri.esm.js";
import { stri, mixer } from "./util/util.js";

tap.test(`01 - css rule`, (t) => {
  const input = `<style>.red{color:red;}</style>`;
  mixer({
    html: true,
    css: true,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, input, opt).result, ``, JSON.stringify(opt, null, 4));
  });
  mixer({
    html: true,
    css: false,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, input, opt).result,
      `.red{color:red;}`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    css: true,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, input, opt).result,
      `<style> </style>`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    css: false,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, input, opt).result, input, JSON.stringify(opt, null, 4));
  });
  t.end();
});

tap.test(`02 - at rule`, (t) => {
  const input = `<style>@media a {.b{c}}</style>`;
  mixer({
    html: true,
    css: true,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, input, opt).result, ``, JSON.stringify(opt, null, 4));
  });
  mixer({
    html: true,
    css: false,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, input, opt).result,
      `@media a {.b{c}}`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    css: true,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, input, opt).result,
      `<style> </style>`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    css: false,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, input, opt).result, input, JSON.stringify(opt, null, 4));
  });
  t.end();
});

tap.test(`03 - css comment`, (t) => {
  const input = `<style>/* tralala */</style>`;
  mixer({
    html: true,
    css: true,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, input, opt).result, ``, JSON.stringify(opt, null, 4));
  });
  mixer({
    html: true,
    css: false,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, input, opt).result,
      `/* tralala */`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    css: true,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, input, opt).result,
      `<style> </style>`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    css: false,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, input, opt).result, input, JSON.stringify(opt, null, 4));
  });
  t.end();
});

tap.test(`04 - css comment`, (t) => {
  const input = `<style>
  @media a {.b{c}}
  /* tralala */
</style>`;
  mixer({
    html: true,
    css: true,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, input, opt).result, ``, JSON.stringify(opt, null, 4));
  });
  mixer({
    html: true,
    css: false,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, input, opt).result,
      `@media a {.b{c}}
/* tralala */`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    css: true,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, input, opt).result,
      `<style>

</style>`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
    css: false,
  }).forEach((opt, n) => {
    t.equal(
      stri(t, n, input, opt).result,
      `<style>
@media a {.b{c}}
/* tralala */
</style>`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});
