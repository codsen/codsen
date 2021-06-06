import tap from "tap";
import { crush } from "../dist/html-crush.esm";
import { m, mixer } from "./util/util";

// https://github.com/codsen/codsen/issues/16
// https://github.com/hteumeuleu/email-bugs/issues/92

tap.test(`01 - sampler`, (t) => {
  t.equal(
    crush(
      `<style>
	@media screen {
		div {
			color: white;
		}}

	.foo {
		background: green;
	}
</style>`,
      {
        removeLineBreaks: true,
      }
    ).result,
    `<style>
@media screen{div{color:white;} }.foo{background:green;}
</style>`,
    "01"
  );
  t.end();
});

tap.test(`02 - spaced`, (t) => {
  mixer({
    removeLineBreaks: true,
  }).forEach((opt) => {
    t.equal(
      m(
        t,
        `<style>
	@media screen {
		div {
			color: white;
		}
  }
	.foo {
		background: green;
	}
</style>`,
        opt
      ).result,
      `<style>
@media screen{div{color:white;} }.foo{background:green;}
</style>`,
      `${JSON.stringify(opt, null, 0)}`
    );
  });
  t.end();
});

tap.test(`03 - already come tight`, (t) => {
  mixer({
    removeLineBreaks: true,
  }).forEach((opt) => {
    t.equal(
      m(
        t,
        `<style>
	@media screen {
		div {
			color: white;
		}}

	.foo {
		background: green;
	}
</style>`,
        opt
      ).result,
      `<style>
@media screen{div{color:white;} }.foo{background:green;}
</style>`,
      `${JSON.stringify(opt, null, 0)}`
    );
  });
  t.end();
});

tap.test(`04 - already come tight, vs. Nunjucks`, (t) => {
  mixer({
    removeLineBreaks: true,
  }).forEach((opt) => {
    t.equal(
      m(
        t,
        `<style>
@media screen{div{color:{{brandWhite}}}}.foo{background:green;}
</style>`,
        opt
      ).result,
      `<style>
@media screen{div{color:{{brandWhite}}} }.foo{background:green;}
</style>`,
      `${JSON.stringify(opt, null, 0)}`
    );
  });
  t.end();
});
