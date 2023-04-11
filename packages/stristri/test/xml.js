import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import * as assert from "uvu/assert";

// import { stri as stri2 } from "../dist/stristri.esm.js";
import { stri, mixer } from "./util/util.js";

test("01 - xml only", () => {
  let input = `<xml><z></xml>
<![endif]-->`;
  mixer({
    html: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, input, opt).result,
      "",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, input, opt).result,
      input,
      JSON.stringify(opt, null, 4)
    );
  });
});

test("02 - typical email template's dpi setting tag", () => {
  let input = `<!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
<![endif]-->`;
  mixer({
    html: true,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, input, opt).result,
      "",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    html: false,
  }).forEach((opt, n) => {
    assert.equal(
      stri(assert, n, input, opt).result,
      input,
      JSON.stringify(opt, null, 4)
    );
  });
});

test.run();
