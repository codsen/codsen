import tap from "tap";
import { collapse } from "../dist/string-collapse-white-space.esm";
import { mixer } from "./util/util";

tap.test(`01  - one line, trimLines=false`, (t) => {
  const input = `  a  `;
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse(input, opt).result,
      ` a `,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`02  - one line, trimLines=false`, (t) => {
  const input = `  a  `;
  mixer({
    trimStart: true,
    trimEnd: false,
    trimLines: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse(input, opt).result,
      `a `,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`03  - one line, trimLines=false`, (t) => {
  const input = `  a  `;
  mixer({
    trimStart: false,
    trimEnd: true,
    trimLines: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse(input, opt).result,
      ` a`,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`04  - one line, trimLines=false`, (t) => {
  const input = `  a  `;
  mixer({
    trimStart: true,
    trimEnd: true,
    trimLines: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse(input, opt).result,
      `a`,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`05  - one line, trimLines=true`, (t) => {
  const input = `  a  `;
  mixer({
    trimLines: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(input, opt).result,
      `a`,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});
