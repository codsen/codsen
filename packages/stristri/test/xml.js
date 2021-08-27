import tap from "tap";
// import { stri as stri2 } from "../dist/stristri.esm.js";
import { stri, mixer } from "./util/util.js";

tap.test(`01 - xml only`, (t) => {
  const input = `<xml><z></xml>
<![endif]-->`;
  mixer({
    html: true,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, input, opt).result, ``, JSON.stringify(opt, null, 4));
  });
  mixer({
    html: false,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, input, opt).result, input, JSON.stringify(opt, null, 4));
  });
  t.end();
});

tap.test(`02 - typical email template's dpi setting tag`, (t) => {
  const input = `<!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
<![endif]-->`;
  mixer({
    html: true,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, input, opt).result, ``, JSON.stringify(opt, null, 4));
  });
  mixer({
    html: false,
  }).forEach((opt, n) => {
    t.equal(stri(t, n, input, opt).result, input, JSON.stringify(opt, null, 4));
  });
  t.end();
});
