import test from "ava";
import {
  withinTagInnerspace,
  attributeOnTheRight,
  findClosingQuote,
  tagOnTheRight,
  onlyTheseLeadToThat,
  encodeChar
} from "../dist/util.esm";

test(`99.01 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - no offset`, t => {
  // R1 - xhtml tag ending that follows straight away
  t.true(withinTagInnerspace(`/  >`));
  t.true(withinTagInnerspace(`/>`));
  t.true(withinTagInnerspace(`/> `));
  t.true(withinTagInnerspace(`/> \t`));

  t.true(withinTagInnerspace(` /  >`));
  t.true(withinTagInnerspace(` />`));
  t.true(withinTagInnerspace(` /> `));
  t.true(withinTagInnerspace(` /> \t`));

  t.true(withinTagInnerspace(` \n /  >`));
  t.true(withinTagInnerspace(` \n />`));
  t.true(withinTagInnerspace(` \n /> `));
  t.true(withinTagInnerspace(` \n /> \t`));
  //
  // R2 - pt1. HTML ending and there's at least one atribute with equal+quotes
  t.true(withinTagInnerspace(` z="">`));
  t.true(withinTagInnerspace(` z="'>`));
  t.true(withinTagInnerspace(` z='">`));
  t.true(withinTagInnerspace(` z=''>`));

  t.true(withinTagInnerspace(` z="  ">`));
  t.true(withinTagInnerspace(` z='  ">`));
  t.true(withinTagInnerspace(` z="  '>`));
  t.true(withinTagInnerspace(` z='  '>`));

  t.true(withinTagInnerspace(` z=" /> ">`));
  t.true(withinTagInnerspace(` z=' /> ">`));
  t.true(withinTagInnerspace(` z=" /> '>`));
  t.true(withinTagInnerspace(` z=' /> '>`));

  t.true(withinTagInnerspace(` z=""/>`));
  t.true(withinTagInnerspace(` z='"/>`));
  t.true(withinTagInnerspace(` z="'/>`));
  t.true(withinTagInnerspace(` z=''/>`));

  t.true(withinTagInnerspace(` z="  "/>`));
  t.true(withinTagInnerspace(` z='  "/>`));
  t.true(withinTagInnerspace(` z="  '/>`));
  t.true(withinTagInnerspace(` z='  '/>`));

  t.true(withinTagInnerspace(` z=" /> "/>`));
  t.true(withinTagInnerspace(` z=' /> "/>`));
  t.true(withinTagInnerspace(` z=" /> '/>`));
  t.true(withinTagInnerspace(` z=' /> '/>`));

  t.true(withinTagInnerspace(` z=""/>`));
  t.true(withinTagInnerspace(` z='"/>`));
  t.true(withinTagInnerspace(` z="'/>`));
  t.true(withinTagInnerspace(` z=''/>`));

  t.true(withinTagInnerspace(` alt=""/>`));
  t.true(withinTagInnerspace(` alt='"/>`));
  t.true(withinTagInnerspace(` alt="'/>`));
  t.true(withinTagInnerspace(` alt=''/>`));
  //
  // R2 - pt2. there can be boolean attributes, no worries:
  t.true(withinTagInnerspace(` alt="" yoyo>`));
  t.true(withinTagInnerspace(` alt='" yoyo>`));
  t.true(withinTagInnerspace(` alt="' yoyo>`));
  t.true(withinTagInnerspace(` alt='' yoyo>`));

  t.true(withinTagInnerspace(` alt="" yoyo/>`));
  t.true(withinTagInnerspace(` alt='" yoyo/>`));
  t.true(withinTagInnerspace(` alt="' yoyo/>`));
  t.true(withinTagInnerspace(` alt='' yoyo/>`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop>`));
  t.true(withinTagInnerspace(` abc='def" ghi="jkl" mnop>`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl" mnop>`));
  t.true(withinTagInnerspace(` abc='def' ghi="jkl" mnop>`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop>`));
  t.true(withinTagInnerspace(` abc='def" ghi='jkl" mnop>`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl' mnop>`));
  t.true(withinTagInnerspace(` abc='def' ghi='jkl' mnop>`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop/>`));
  t.true(withinTagInnerspace(` abc='def" ghi="jkl" mnop/>`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl" mnop/>`));
  t.true(withinTagInnerspace(` abc='def' ghi="jkl" mnop/>`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop/>`));
  t.true(withinTagInnerspace(` abc='def" ghi='jkl" mnop/>`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl' mnop/>`));
  t.true(withinTagInnerspace(` abc='def' ghi='jkl' mnop/>`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop />`));
  t.true(withinTagInnerspace(` abc='def" ghi="jkl" mnop />`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl" mnop />`));
  t.true(withinTagInnerspace(` abc='def' ghi="jkl" mnop />`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop />`));
  t.true(withinTagInnerspace(` abc='def" ghi='jkl" mnop />`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl' mnop />`));
  t.true(withinTagInnerspace(` abc='def' ghi='jkl' mnop />`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop / >`));
  t.true(withinTagInnerspace(` abc='def" ghi="jkl" mnop / >`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl" mnop / >`));
  t.true(withinTagInnerspace(` abc='def' ghi="jkl" mnop / >`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop / >`));
  t.true(withinTagInnerspace(` abc='def" ghi='jkl" mnop / >`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl' mnop / >`));
  t.true(withinTagInnerspace(` abc='def' ghi='jkl' mnop / >`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop/ >`));
  t.true(withinTagInnerspace(` abc='def" ghi="jkl" mnop/ >`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl" mnop/ >`));
  t.true(withinTagInnerspace(` abc='def' ghi="jkl" mnop/ >`));

  t.true(withinTagInnerspace(` abc="def" ghi="jkl" mnop/ >`));
  t.true(withinTagInnerspace(` abc='def" ghi='jkl" mnop/ >`));
  t.true(withinTagInnerspace(` abc="def' ghi="jkl' mnop/ >`));
  t.true(withinTagInnerspace(` abc='def' ghi='jkl' mnop/ >`));

  // R3 - pt.1 html tag ending that follows straight away, with a tag that follows
  t.true(withinTagInnerspace(` ><a>`));
  t.true(withinTagInnerspace(` ><a/>`));
  t.true(withinTagInnerspace(` ></a>`));

  t.true(withinTagInnerspace(` ><a bcd="ef">`));
  t.true(withinTagInnerspace(` ><a bcd='ef">`));
  t.true(withinTagInnerspace(` ><a bcd="ef'>`));
  t.true(withinTagInnerspace(` ><a bcd='ef'>`));

  t.true(withinTagInnerspace(` ><a bcd="ef"/>`));
  t.true(withinTagInnerspace(` ><a bcd='ef"/>`));
  t.true(withinTagInnerspace(` ><a bcd="ef'/>`));
  t.true(withinTagInnerspace(` ><a bcd='ef'/>`));

  t.true(withinTagInnerspace(` ><a bcd="ef" gh/>`));
  t.true(withinTagInnerspace(` ><a bcd='ef" gh/>`));
  t.true(withinTagInnerspace(` ><a bcd="ef' gh/>`));
  t.true(withinTagInnerspace(` ><a bcd='ef' gh/>`));

  t.true(withinTagInnerspace(` ><a bcd="ef" ghi="jkl">`));
  t.true(withinTagInnerspace(` ><a bcd="ef" ghi="jkl"/>`));
  t.true(withinTagInnerspace(` ><a bcd='ef' ghi='jkl'/>`));
  //
  // R3 - pt2. text in between
  t.true(withinTagInnerspace(` >xyz<a>`));

  t.true(withinTagInnerspace(` >img<img alt=""`));
  t.true(withinTagInnerspace(` >img<img alt='"`));
  t.true(withinTagInnerspace(` >img<img alt="'`));
  t.true(withinTagInnerspace(` >img<img alt=''`));

  t.true(withinTagInnerspace(` >xyz<a<`)); // unclosed tag "<a"
  t.true(withinTagInnerspace(` > xyz<a/>`));
  t.true(withinTagInnerspace(` >\nxyz</a>`));

  t.true(withinTagInnerspace(` >\txyz<a bcd="ef">`));
  t.true(withinTagInnerspace(` >\txyz<a bcd='ef">`));
  t.true(withinTagInnerspace(` >\txyz<a bcd="ef'>`));
  t.true(withinTagInnerspace(` >\txyz<a bcd='ef'>`));

  t.true(withinTagInnerspace(` >\n\nxyz\n<a bcd="ef"/>`));
  t.true(withinTagInnerspace(` >\n\nxyz\n<a bcd='ef"/>`));
  t.true(withinTagInnerspace(` >\n\nxyz\n<a bcd="ef'/>`));
  t.true(withinTagInnerspace(` >\n\nxyz\n<a bcd='ef'/>`));

  t.true(withinTagInnerspace(` >\nxyz\n<a bcd="ef" gh/>`));
  t.true(withinTagInnerspace(` >\nxyz\n<a bcd='ef" gh/>`));
  t.true(withinTagInnerspace(` >\nxyz\n<a bcd="ef' gh/>`));
  t.true(withinTagInnerspace(` >\nxyz\n<a bcd='ef' gh/>`));

  t.true(withinTagInnerspace(` > xyz\t<a bcd="ef" ghi="jkl">`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd='ef" ghi="jkl">`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd="ef' ghi="jkl">`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd='ef' ghi="jkl">`));

  t.true(withinTagInnerspace(` > xyz\t<a bcd="ef" ghi='jkl'/>`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd='ef" ghi="jkl'/>`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd="ef' ghi='jkl"/>`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd='ef' ghi="jkl"/>`));

  t.true(withinTagInnerspace(` > xyz\t<a bcd='ef' ghi="jkl"/>`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd="ef' ghi='jkl"/>`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd='ef" ghi="jkl'/>`));
  t.true(withinTagInnerspace(` > xyz\t<a bcd="ef" ghi='jkl'/>`));
  //
  // R3 - pt3. various
  t.true(withinTagInnerspace(` /><a>`));

  t.true(withinTagInnerspace(` z=""><a>`));
  t.true(withinTagInnerspace(` z='"><a>`));
  t.true(withinTagInnerspace(` z="'><a>`));
  t.true(withinTagInnerspace(` z=''><a>`));
  t.true(withinTagInnerspace(` z=""/><a>`));
  t.true(withinTagInnerspace(` z='"/><a>`));
  t.true(withinTagInnerspace(` z="'/><a>`));
  t.true(withinTagInnerspace(` z=''/><a>`));

  t.true(withinTagInnerspace(` z=""><a/>`));
  t.true(withinTagInnerspace(` z='"><a/>`));
  t.true(withinTagInnerspace(` z="'><a/>`));
  t.true(withinTagInnerspace(` z=''><a/>`));
  t.true(withinTagInnerspace(` z=""/><a/>`));
  t.true(withinTagInnerspace(` z='"/><a/>`));
  t.true(withinTagInnerspace(` z="'/><a/>`));
  t.true(withinTagInnerspace(` z=''/><a/>`));

  t.true(withinTagInnerspace(` z=""><a />`));
  t.true(withinTagInnerspace(` z='"><a />`));
  t.true(withinTagInnerspace(` z="'><a />`));
  t.true(withinTagInnerspace(` z=''><a />`));
  t.true(withinTagInnerspace(` z=""/><a />`));
  t.true(withinTagInnerspace(` z='"/><a />`));
  t.true(withinTagInnerspace(` z="'/><a />`));
  t.true(withinTagInnerspace(` z=''/><a />`));

  t.true(withinTagInnerspace(` z=""><a/ >`));
  t.true(withinTagInnerspace(` z='"><a/ >`));
  t.true(withinTagInnerspace(` z="'><a/ >`));
  t.true(withinTagInnerspace(` z=''><a/ >`));
  t.true(withinTagInnerspace(` z=""/><a/ >`));
  t.true(withinTagInnerspace(` z='"/><a/ >`));
  t.true(withinTagInnerspace(` z="'/><a/ >`));
  t.true(withinTagInnerspace(` z=''/><a/ >`));

  t.true(withinTagInnerspace(` z=""><a / >`));
  t.true(withinTagInnerspace(` z='"><a / >`));
  t.true(withinTagInnerspace(` z="'><a / >`));
  t.true(withinTagInnerspace(` z=''><a / >`));
  t.true(withinTagInnerspace(` z=""/><a / >`));
  t.true(withinTagInnerspace(` z='"/><a / >`));
  t.true(withinTagInnerspace(` z="'/><a / >`));
  t.true(withinTagInnerspace(` z=''/><a / >`));

  t.true(withinTagInnerspace(` alt=""/><a>`));
  t.true(withinTagInnerspace(` alt="'/><a>`));
  t.true(withinTagInnerspace(` alt='"/><a>`));
  t.true(withinTagInnerspace(` alt=''/><a>`));

  t.true(withinTagInnerspace(` >\n   <b>`));
  t.true(withinTagInnerspace(` />\n   <b>`));

  t.true(withinTagInnerspace(` z="">\n   <b>`));
  t.true(withinTagInnerspace(` z='">\n   <b>`));
  t.true(withinTagInnerspace(` z="'>\n   <b>`));
  t.true(withinTagInnerspace(` z=''>\n   <b>`));
  t.true(withinTagInnerspace(` z=""/>\n   <b>`));
  t.true(withinTagInnerspace(` z='"/>\n   <b>`));
  t.true(withinTagInnerspace(` z="'/>\n   <b>`));
  t.true(withinTagInnerspace(` z=''/>\n   <b>`));

  t.true(withinTagInnerspace(` z="" >\n   <b>`));
  t.true(withinTagInnerspace(` z='" >\n   <b>`));
  t.true(withinTagInnerspace(` z="' >\n   <b>`));
  t.true(withinTagInnerspace(` z='' >\n   <b>`));
  t.true(withinTagInnerspace(` z="" />\n   <b>`));
  t.true(withinTagInnerspace(` z='" />\n   <b>`));
  t.true(withinTagInnerspace(` z="' />\n   <b>`));
  t.true(withinTagInnerspace(` z='' />\n   <b>`));

  t.true(withinTagInnerspace(` z="" / >\n   <b>`));
  t.true(withinTagInnerspace(` z='" / >\n   <b>`));
  t.true(withinTagInnerspace(` z="' / >\n   <b>`));
  t.true(withinTagInnerspace(` z='' / >\n   <b>`));
  t.true(withinTagInnerspace(` z="" /  >\n   <b>`));
  t.true(withinTagInnerspace(` z='" /  >\n   <b>`));
  t.true(withinTagInnerspace(` z="' /  >\n   <b>`));
  t.true(withinTagInnerspace(` z='' /  >\n   <b>`));

  t.true(withinTagInnerspace(` alt=""/>\n   <b>`));
  t.true(withinTagInnerspace(` alt='"/>\n   <b>`));
  t.true(withinTagInnerspace(` alt="'/>\n   <b>`));
  t.true(withinTagInnerspace(` alt=''/>\n   <b>`));

  t.true(withinTagInnerspace(` alt="" xyz \n/>\n   <b>`));
  t.true(withinTagInnerspace(` alt='" xyz \n/>\n   <b>`));
  t.true(withinTagInnerspace(` alt="' xyz \n/>\n   <b>`));
  t.true(withinTagInnerspace(` alt='' xyz \n/>\n   <b>`));

  t.true(withinTagInnerspace(` alt="" xyz \n/ >\n   <b>`));
  t.true(withinTagInnerspace(` alt='" xyz \n/ >\n   <b>`));
  t.true(withinTagInnerspace(` alt="' xyz \n/ >\n   <b>`));
  t.true(withinTagInnerspace(` alt='' xyz \n/ >\n   <b>`));

  t.true(withinTagInnerspace(` alt="" xyz \n >\n   <b>`));
  t.true(withinTagInnerspace(` alt='" xyz \n >\n   <b>`));
  t.true(withinTagInnerspace(` alt="' xyz \n >\n   <b>`));
  t.true(withinTagInnerspace(` alt='' xyz \n >\n   <b>`));

  t.true(withinTagInnerspace(` alt="" klm xyz \n >\n   <b>`));
  t.true(withinTagInnerspace(` alt='" klm xyz \n >\n   <b>`));
  t.true(withinTagInnerspace(` alt="' klm xyz \n >\n   <b>`));
  t.true(withinTagInnerspace(` alt='' klm xyz \n >\n   <b>`));

  t.true(withinTagInnerspace(` alt="" klm xyz \n >\n nop  <b>`));
  t.true(withinTagInnerspace(` alt='" klm xyz \n >\n nop  <b>`));
  t.true(withinTagInnerspace(` alt="' klm xyz \n >\n nop  <b>`));
  t.true(withinTagInnerspace(` alt='' klm xyz \n >\n nop  <b>`));
  //
  // R4 - boolean attribute followed by slash followed by closing bracket
  t.true(withinTagInnerspace(` abc/>`));
  // R5 - full attribute with matching quotes:
  t.true(withinTagInnerspace(` abc="" def="">`));
  t.true(withinTagInnerspace(` abc='" def="">`));
  t.true(withinTagInnerspace(` abc="' def="">`));
  t.true(withinTagInnerspace(` abc='' def="">`));

  t.true(withinTagInnerspace(` abc="" def=""/>`));
  t.true(withinTagInnerspace(` abc='" def=""/>`));
  t.true(withinTagInnerspace(` abc="' def=""/>`));
  t.true(withinTagInnerspace(` abc='' def=""/>`));

  t.true(withinTagInnerspace(` abc="" def="" />`));
  t.true(withinTagInnerspace(` abc='" def="" />`));
  t.true(withinTagInnerspace(` abc="' def="" />`));
  t.true(withinTagInnerspace(` abc='' def="" />`));

  t.true(withinTagInnerspace(` abc="" def=""/ >`));
  t.true(withinTagInnerspace(` abc='" def=""/ >`));
  t.true(withinTagInnerspace(` abc="' def=""/ >`));
  t.true(withinTagInnerspace(` abc='' def=""/ >`));

  t.true(withinTagInnerspace(` abc="" def="" / >`));
  t.true(withinTagInnerspace(` abc='" def="" / >`));
  t.true(withinTagInnerspace(` abc="' def="" / >`));
  t.true(withinTagInnerspace(` abc='' def="" / >`));

  t.true(withinTagInnerspace(` abc="de" fgh="ij">`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij">`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij">`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij">`));

  t.true(withinTagInnerspace(` abc="de" fgh='ij'>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij">`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij'>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij">`));

  t.true(withinTagInnerspace(` abc="de" fgh="ij"/>`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij"/>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij"/>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij"/>`));

  t.true(withinTagInnerspace(` abc="de" fgh='ij'/>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij"/>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij'/>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij"/>`));

  t.true(withinTagInnerspace(` abc="de" fgh="ij" />`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij" />`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij" />`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij" />`));

  t.true(withinTagInnerspace(` abc="de" fgh='ij' />`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij" />`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij' />`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij" />`));

  t.true(withinTagInnerspace(` abc=' def='>`));
  t.true(withinTagInnerspace(` abc=" def='>`));
  t.true(withinTagInnerspace(` abc=' def=">`));
  t.true(withinTagInnerspace(` abc=" def=">`));

  t.true(withinTagInnerspace(` abc=' def='/>`));
  t.true(withinTagInnerspace(` abc=" def='/>`));
  t.true(withinTagInnerspace(` abc=' def="/>`));
  t.true(withinTagInnerspace(` abc=" def="/>`));

  t.true(withinTagInnerspace(` abc=' def=' />`));
  t.true(withinTagInnerspace(` abc=" def=' />`));
  t.true(withinTagInnerspace(` abc=' def=" />`));
  t.true(withinTagInnerspace(` abc=" def=" />`));

  t.true(withinTagInnerspace(` abc=' def='/ >`));
  t.true(withinTagInnerspace(` abc=" def='/ >`));
  t.true(withinTagInnerspace(` abc=' def="/ >`));
  t.true(withinTagInnerspace(` abc=" def="/ >`));

  t.true(withinTagInnerspace(` abc=' def=' / >`));
  t.true(withinTagInnerspace(` abc=" def=' / >`));
  t.true(withinTagInnerspace(` abc=' def=" / >`));
  t.true(withinTagInnerspace(` abc=" def=" / >`));

  t.true(withinTagInnerspace(` abc='de' fgh='ij'>`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij'>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij'>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij'>`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij">`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij">`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij">`));
  t.true(withinTagInnerspace(` abc="de" fgh="ij">`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij">`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij">`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij'>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij'>`));

  t.true(withinTagInnerspace(` abc='de' fgh='ij'/>`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij'/>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij'/>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij'/>`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij"/>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij"/>`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij"/>`));
  t.true(withinTagInnerspace(` abc="de" fgh="ij"/>`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij"/>`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij"/>`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij'/>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij'/>`));

  t.true(withinTagInnerspace(` abc='de' fgh='ij' />`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij' />`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij' />`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' />`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij" />`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij" />`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij" />`));
  t.true(withinTagInnerspace(` abc="de" fgh="ij" />`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij" />`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij" />`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij' />`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' />`));

  t.true(withinTagInnerspace(` abc='de' fgh='ij'/ >`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij'/ >`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij'/ >`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij'/ >`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij"/ >`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij"/ >`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij"/ >`));
  t.true(withinTagInnerspace(` abc="de" fgh="ij"/ >`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij" / >`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij" / >`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij' / >`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' / >`));

  t.true(withinTagInnerspace(` abc='de' fgh='ij' / >`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij' / >`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij' / >`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' / >`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij" /\n>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij" /\n>`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij" /\n>`));
  t.true(withinTagInnerspace(` abc="de" fgh="ij" /\n>`));

  t.true(withinTagInnerspace(` abc='de' fgh="ij" /\n>`));
  t.true(withinTagInnerspace(` abc="de' fgh='ij" /\n>`));
  t.true(withinTagInnerspace(` abc='de" fgh="ij' /\n>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' /\n>`));

  // various
  t.true(withinTagInnerspace(` abc="de" fgh="ij" klm= >nop<r>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' klm= >nop<r>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij" klm= >nop<r>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij' klm= >nop<r>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij" klm= >nop<r>`));
  t.true(withinTagInnerspace(` abc='de' fgh='ij' klm= >nop<r>`));

  t.true(withinTagInnerspace(` abc="de" fgh="ij" klm= />nop<r>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' klm= />nop<r>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij" klm= />nop<r>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij' klm= />nop<r>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij" klm= />nop<r>`));
  t.true(withinTagInnerspace(` abc='de' fgh='ij' klm= />nop<r>`));

  t.true(withinTagInnerspace(` abc="de" fgh="ij" klm= / >nop<r>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' klm= / >nop<r>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij" klm= / >nop<r>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij' klm= / >nop<r>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij" klm= / >nop<r>`));
  t.true(withinTagInnerspace(` abc='de' fgh='ij' klm= / >nop<r>`));

  t.true(withinTagInnerspace(` abc="de" fgh="ij" klm= / >nop</r>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' klm= / >nop</r>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij" klm= / >nop</r>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij' klm= / >nop</r>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij" klm= / >nop</r>`));
  t.true(withinTagInnerspace(` abc='de' fgh='ij' klm= / >nop</r>`));

  t.true(withinTagInnerspace(` abc="de" fgh="ij" klm= / >nop<r/>`));
  t.true(withinTagInnerspace(` abc="de" fgh='ij' klm= / >nop<r/>`));
  t.true(withinTagInnerspace(` abc='de" fgh='ij" klm= / >nop<r/>`));
  t.true(withinTagInnerspace(` abc="de' fgh="ij' klm= / >nop<r/>`));
  t.true(withinTagInnerspace(` abc='de' fgh="ij" klm= / >nop<r/>`));
  t.true(withinTagInnerspace(` abc='de' fgh='ij' klm= / >nop<r/>`));
  // false:
  t.false(withinTagInnerspace(`tralala"/>\n   <b>`));
  t.false(withinTagInnerspace(`tralala'/>\n   <b>`));

  t.true(withinTagInnerspace(`tralala/>\n   <b>`));
  t.false(withinTagInnerspace(`= ef>`));
  t.false(withinTagInnerspace(`= ef>\n   <b>`));
  t.false(withinTagInnerspace(`= ef/>\n   <b>`));
  t.false(withinTagInnerspace(` = ef>`));
  t.false(withinTagInnerspace(` = ef>\n   <b>`));
  t.false(withinTagInnerspace(` = ef/>\n   <b>`));
  t.false(withinTagInnerspace(`=ef>`));
  t.false(withinTagInnerspace(`=ef>\n   <b>`));
  t.false(withinTagInnerspace(`=ef/>\n   <b>`));
});

test(`99.02 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - with offset`, t => {
  const source1 = `<img src="zzz.jpg" alt=" height="100" border="0" style="display:block;"/>`;
  t.true(withinTagInnerspace(source1, 24), "99.02.01");
  t.true(withinTagInnerspace(source1, 25), "99.02.02");

  const source2 = `<img src="zzz.jpg" alt=" zzz" border="0" style="display:block;" alt=""/>`;
  t.false(withinTagInnerspace(source2, 24), "99.02.03");
  t.false(withinTagInnerspace(source2, 25), "99.02.04");

  const source3 = `<img src="zzz.jpg" alt=" <--- zzz" border="0" style="display:block;" alt=""/>`;
  t.false(withinTagInnerspace(source3, 24), "99.02.05");
  t.false(withinTagInnerspace(source3, 25), "99.02.06");

  // but this is within inner tag space:
  t.true(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt="border="0" style="display:block;" alt=""/>`,
      24
    ),
    "99.02.07 - missing space and closing quote"
  );
  t.true(withinTagInnerspace(`<img src="zzz.jpg" alt=">`, 24), "99.02.08");
  t.true(withinTagInnerspace(`<img src="zzz.jpg" alt="/>`, 24), "99.02.09");
  t.true(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt=">\n`,
      //                       ^
      24
    ),
    "99.02.05-2"
  );
  t.true(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt=">a`,
      //                       ^
      24
    ),
    "99.02.05-3"
  );
  t.true(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt="><`,
      //                       ^
      24
    ),
    "99.02.05-4"
  );
  t.false(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt=">a"`,
      //                       ^
      24
    ),
    "99.02.05-3"
  );

  // nobody puts /> at the beginning of a comment! It's a positive case.
  t.true(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt="/>`,
      //                       ^
      24
    ),
    "99.02.06"
  );
  t.true(
    withinTagInnerspace(
      `<img src="zzz.jpg" alt="><aaa`,
      //                       ^
      24
    ),
    "99.02.07"
  );
});

test(`99.03 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - broken code case #1`, t => {
  t.true(withinTagInnerspace(` alt= >aaa<b>`), "99.03.01");
  t.true(withinTagInnerspace(` alt= ><b>`), "99.03.02");
});

test(`99.04 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - broken code case #2`, t => {
  const code = `<td abc='d e" fgh ijk="klm'/>`;
  //  -->                    ^
  t.true(withinTagInnerspace(code, 13), "99.04");
});

test(`99.05 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - attributes without quotes follow`, t => {
  const code = `<a bcd= ef=gh>zyx<i jkl= mn=op>`;
  //  -->              ^^
  t.true(withinTagInnerspace(code, 7), "99.05.01");
  t.true(withinTagInnerspace(code, 8), "99.05.02");
});

test(`99.06 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - attributes without quotes follow`, t => {
  const code = `<a bcd = ef ghi = jk lmn / >`;
  t.true(withinTagInnerspace(code, 2), "99.06.01");
  t.false(withinTagInnerspace(code, 6), "99.06.02");
  t.false(withinTagInnerspace(code, 8), "99.06.03");
  t.true(withinTagInnerspace(code, 11), "99.06.04");
  t.false(withinTagInnerspace(code, 15), "99.06.05");
  t.false(withinTagInnerspace(code, 17), "99.06.06");
  t.true(withinTagInnerspace(code, 20), "99.06.07");
  t.true(withinTagInnerspace(code, 24), "99.06.08");
});

test(`99.07 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`withinTagInnerspace()`}\u001b[${39}m`} - attributes without quotes follow`, t => {
  const code = `<a bcd=ef ghi='jk' lmn>`;
  t.false(withinTagInnerspace(code, 6), "99.07.01");
  t.false(withinTagInnerspace(code, 7), "99.07.02");
  t.true(withinTagInnerspace(code, 9), "99.07.03");
  t.true(withinTagInnerspace(code, 10), "99.07.04");
  t.false(withinTagInnerspace(code, 13), "99.07.05");
  t.false(withinTagInnerspace(code, 14), "99.07.06");
  t.false(withinTagInnerspace(code, 15), "99.07.07");
  t.false(withinTagInnerspace(code, 17), "99.07.09");
  t.true(withinTagInnerspace(code, 18), "99.07.10");
  t.true(withinTagInnerspace(code, 19), "99.07.11");
});

test(`99.11 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`attributeOnTheRight()`}\u001b[${39}m`} - positive cases`, t => {
  t.true(!!attributeOnTheRight(`"">`), "99.11.01");
  t.true(!!attributeOnTheRight(`"" >`), "99.11.02");
  t.true(!!attributeOnTheRight(`""/>`), "99.11.03");
  t.true(!!attributeOnTheRight(`"" />`), "99.11.04");
  t.true(!!attributeOnTheRight(`"" / >`), "99.11.05");
  t.true(!!attributeOnTheRight(`""/ >`), "99.11.06");

  // ends with EOF
  t.true(!!attributeOnTheRight(`""`), "99.11.07");
  t.true(!!attributeOnTheRight(`"" `), "99.11.08");
  t.true(!!attributeOnTheRight(`"" \n`), "99.11.09");

  // attr without value follows
  t.true(!!attributeOnTheRight(`"" nowrap>`), "99.11.10");
  t.true(!!attributeOnTheRight(`"" nowrap/>`), "99.11.11");

  const s1 = `<img alt="sometext < more text = other/text" anotherTag="zzz"/><img alt="sometext < more text = other text"/>`;
  t.true(!!attributeOnTheRight(s1, 9), "99.11.12");
});

test(`99.12 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`attributeOnTheRight()`}\u001b[${39}m`} - negative cases`, t => {
  t.false(attributeOnTheRight(`" attr1 atr2><img>`), "99.12.01");
  t.false(attributeOnTheRight(`">`), "99.12.02");
  t.false(attributeOnTheRight(`"/>`), "99.12.03");
  t.false(attributeOnTheRight(`" attr=""/>`), "99.12.04");
  t.false(attributeOnTheRight(`" attr1 attr2=""/>`), "99.12.05");
  t.false(attributeOnTheRight(`" attr1 attr/>`), "99.12.06");
  t.false(attributeOnTheRight(`" attr1 attr />`), "99.12.07");

  // single quote
  t.false(attributeOnTheRight(`' attr1 atr2><img>`), "99.12.08");
  t.false(attributeOnTheRight(`'>`), "99.12.09");
  t.false(attributeOnTheRight(`'/>`), "99.12.10");
  t.false(attributeOnTheRight(`' attr=""/>`), "99.12.11");
  t.false(attributeOnTheRight(`' attr=''/>`), "99.12.12");
  t.false(attributeOnTheRight(`' attr1 attr2=""/>`), "99.12.13");
  t.false(attributeOnTheRight(`' attr1 attr2=''/>`), "99.12.14");
  t.false(attributeOnTheRight(`' attr1 attr/>`), "99.12.15");
  t.false(attributeOnTheRight(`' attr1 attr />`), "99.12.16");
});

test(`99.13 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`attributeOnTheRight()`}\u001b[${39}m`} - negative cases`, t => {
  const s1 = `<img alt="sometext < more text = other/text" anotherTag="zzz"/><img alt="sometext < more text = other text"/>`;
  t.true(!!attributeOnTheRight(s1, 9), "99.13.01");
  t.false(attributeOnTheRight(s1, 43), "99.13.02");
  t.true(!!attributeOnTheRight(s1, 56), "99.13.03");
  t.false(attributeOnTheRight(s1, 60), "99.13.04");
});

test(`99.14 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`attributeOnTheRight()`}\u001b[${39}m`} - mismatching quotes`, t => {
  // mismatching quotes, minimal example:
  const s1 = `<a b="c' d="e"/><f g="h"/>`;
  t.true(!!attributeOnTheRight(s1, 5), "99.14.01");
  t.false(attributeOnTheRight(s1, 7), "99.14.02");
  t.true(!!attributeOnTheRight(s1, 11), "99.14.03");
  t.false(attributeOnTheRight(s1, 13), "99.14.04");
  t.true(!!attributeOnTheRight(s1, 21), "99.14.05");
  t.false(attributeOnTheRight(s1, 23), "99.14.06");

  const s2 = `<img alt="sometext < more text = other/text' anotherTag="zzz"/><img alt="sometext < more text = other text"/>`;
  t.true(!!attributeOnTheRight(s2, 9), "99.14.07");
  t.false(attributeOnTheRight(s2, 43), "99.14.08");
  t.true(!!attributeOnTheRight(s2, 56), "99.14.09");
  t.false(attributeOnTheRight(s2, 60), "99.14.10");
});

test(`99.15 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`findClosingQuote()`}\u001b[${39}m`} - finds closing quote`, t => {
  const code1 = `<zzz alt=So, "a" > "b"'>\ntext <img>`;
  t.is(findClosingQuote(code1, 9), 22, "99.15.01");

  const code2 = `<zzz alt=">`;
  t.is(findClosingQuote(code2, 9), 10, "99.15.02");

  const code3 = `<zzz alt="/>`;
  t.is(findClosingQuote(code3, 9), 10, "99.15.03");

  const code4 = `<zzz alt=" />`;
  t.is(findClosingQuote(code4, 9), 10, "99.15.04");

  const code5 = `<zzz alt="><img alt="">`;
  t.is(findClosingQuote(code5, 9), 10, "99.15.05");

  const code6 = `<zzz alt="/><img alt="">`;
  t.is(findClosingQuote(code6, 9), 10, "99.15.06");

  const code7 = `<zzz alt=" /><img alt="">`;
  t.is(findClosingQuote(code7, 9), 10, "99.15.07");
});

test(`99.16 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`findClosingQuote()`}\u001b[${39}m`} - mismatching quotes in attributes`, t => {
  const code1 = `<aaa bbb="ccc' ddd="eee"/>`;
  t.is(findClosingQuote(code1, 9), 13, "99.16.01");

  const code2 = `<aaa bbb='ccc" ddd="eee"/>`;
  t.is(findClosingQuote(code2, 9), 13, "99.16.02");

  const code3 = `<aaa bbb='ccc" ddd='eee'/>`;
  t.is(findClosingQuote(code3, 9), 13, "99.16.03");
});

test(`99.17 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`findClosingQuote()`}\u001b[${39}m`} - mismatching quotes in attributes`, t => {
  const code1 = `<aaa bbb="ccc" ddd= eee="fff"/>`;
  t.is(findClosingQuote(code1, 9), 13, "99.17.01");
  t.is(findClosingQuote(code1, 25), 28, "99.17.02");
});

test(`99.18 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`findClosingQuote()`}\u001b[${39}m`} - unclosed quote`, t => {
  const code = `<zzz alt="nnn="mmm">`;
  t.is(findClosingQuote(code, 9), 10, "99.18.01");
});

test(`99.19 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`findClosingQuote()`}\u001b[${39}m`} - quotes missing`, t => {
  const code = `<a bcd=ef ghi='jk' lmn>`;
  t.is(findClosingQuote(code, 7), 9, "99.19.01");
  t.is(findClosingQuote(code, 14), 17, "99.19.02");
});

// test(`99.20 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`findClosingQuote()`}\u001b[${39}m`} - three quote-less attributes`, t => {
//   const code = `<a bcd=ef ghj=kl mno=pqrs>`;
//   t.is(findClosingQuote(code, 7), 9, "99.20.01");
//   t.is(findClosingQuote(code, 14), 16, "99.20.02");
//   t.is(findClosingQuote(code, 21), 25, "99.20.03");
// });

test(`99.40 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`tagOnTheRight()`}\u001b[${39}m`} - normal tag`, t => {
  const s1 = `<a>`;
  t.true(tagOnTheRight(s1), "99.40.01");
  t.true(tagOnTheRight(s1, 0), "99.40.02");

  const s2 = `<img>`;
  t.true(tagOnTheRight(s2), "99.40.03");
  t.true(tagOnTheRight(s2, 0), "99.40.04");

  const s3 = `<img alt="">`;
  t.true(tagOnTheRight(s3), "99.40.05");
  t.true(tagOnTheRight(s3, 0), "99.40.06");

  const s4 = `<img alt="zzz">`;
  t.true(tagOnTheRight(s4), "99.40.07");
  t.true(tagOnTheRight(s4, 0), "99.40.08");

  const s5 = `<td nowrap>`;
  t.false(tagOnTheRight(s5), "99.40.09"); // <---- false because no attributes with equal-quote found
  t.false(tagOnTheRight(s5, 0), "99.40.10");

  const s6 = `<td class="klm" nowrap>`;
  t.true(tagOnTheRight(s6), "99.40.11");
  t.true(tagOnTheRight(s6, 0), "99.40.12");

  const s7 = `<td nowrap class="klm">`;
  t.true(tagOnTheRight(s7), "99.40.13");

  const s8 = `<td nowrap nowrap nowrap nowrap nowrap nowrap nowrap nowrap nowrap nowrap class="klm"`;
  t.true(tagOnTheRight(s8), "99.40.14");
});

test(`99.41 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`tagOnTheRight()`}\u001b[${39}m`} - closing tag`, t => {
  // closing tag
  const s1 = `</td>`;
  t.true(tagOnTheRight(s1), "99.41.01");
  t.true(tagOnTheRight(s1, 0), "99.41.02");

  const s2 = `</ td>`;
  t.true(tagOnTheRight(s2), "99.41.03");
  t.true(tagOnTheRight(s2, 0), "99.41.04");

  const s3 = `< / td>`;
  t.true(tagOnTheRight(s3), "99.41.05");
  t.true(tagOnTheRight(s3, 0), "99.41.06");

  const s4 = `</ td >`;
  t.true(tagOnTheRight(s4), "99.41.07");
  t.true(tagOnTheRight(s4, 0), "99.41.08");

  const s5 = `< / td >`;
  t.true(tagOnTheRight(s5), "99.41.09");
  t.true(tagOnTheRight(s5, 0), "99.41.10");
});

test(`99.42 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`tagOnTheRight()`}\u001b[${39}m`} - self-closing tag`, t => {
  const s1 = `<br/>`;
  t.true(tagOnTheRight(s1), "99.42.01");
  t.true(tagOnTheRight(s1, 0), "99.42.02");

  const s2 = `< br/>`;
  t.true(tagOnTheRight(s2), "99.42.03");
  t.true(tagOnTheRight(s2, 0), "99.42.04");

  const s3 = `<br />`;
  t.true(tagOnTheRight(s3), "99.42.05");
  t.true(tagOnTheRight(s3, 0), "99.42.06");

  const s4 = `<br/ >`;
  t.true(tagOnTheRight(s4), "99.42.07");
  t.true(tagOnTheRight(s4, 0), "99.42.08");

  const s5 = `<br / >`;
  t.true(tagOnTheRight(s5), "99.42.09");
  t.true(tagOnTheRight(s5, 0), "99.42.10");

  const s6 = `< br / >`;
  t.true(tagOnTheRight(s6), "99.42.11");
  t.true(tagOnTheRight(s6, 0), "99.42.12");
});

test(`99.43 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`tagOnTheRight()`}\u001b[${39}m`} - self-closing tag with attributes`, t => {
  const s1 = `<br class="a"/>`;
  t.true(tagOnTheRight(s1), "99.43.01");
  t.true(tagOnTheRight(s1, 0), "99.43.02");

  const s2 = `< br class="a"/>`;
  t.true(tagOnTheRight(s2), "99.43.03");
  t.true(tagOnTheRight(s2, 0), "99.43.04");

  const s3 = `<br class="a" />`;
  t.true(tagOnTheRight(s3), "99.43.05");
  t.true(tagOnTheRight(s3, 0), "99.43.06");

  const s4 = `<br class="a"/ >`;
  t.true(tagOnTheRight(s4), "99.43.07");
  t.true(tagOnTheRight(s4, 0), "99.43.08");

  const s5 = `<br class="a" / >`;
  t.true(tagOnTheRight(s5), "99.43.09");
  t.true(tagOnTheRight(s5, 0), "99.43.10");

  const s6 = `< br class="a" / >`;
  t.true(tagOnTheRight(s6), "99.43.11");
  t.true(tagOnTheRight(s6, 0), "99.43.12");

  const s7 = `< br class = "a"  id ='z' / >`;
  t.true(tagOnTheRight(s7), "99.43.13");
  t.true(tagOnTheRight(s7, 0), "99.43.14");

  const s8 = `< br class = "a'  id = "z' / >`;
  t.true(tagOnTheRight(s8), "99.43.15");
  t.true(tagOnTheRight(s8, 0), "99.43.16");
});

test(`99.44 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`tagOnTheRight()`}\u001b[${39}m`} - ad-hoc #1`, t => {
  const s1 = `<a b="ccc"<d>`;
  t.false(tagOnTheRight(s1, 6), "99.44.02");
  t.true(tagOnTheRight(s1, 10), "99.44.02");
});

test(`99.51 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`onlyTheseLeadToThat()`}\u001b[${39}m`} - not greedy - default start idx - various validators`, t => {
  function notBracket(char) {
    return char !== ">";
  }

  const s1 = `<abc alt=here're various "characters" here>`;
  t.is(
    onlyTheseLeadToThat(
      s1,
      9,
      notBracket,
      char => {
        return char === ">";
      },
      null
    ),
    42,
    "99.51.01"
  );
});

test(`99.52 - ${`\u001b[${33}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${32}m${`onlyTheseLeadToThat()`}\u001b[${39}m`} - not greedy - default start idx - greedy selection`, t => {
  // we'll skip to last bracket followed by equal
  function notBracket(char) {
    return char !== ">";
  }

  const s1 = `<abc alt=a > b>blablabla<img alt="zzz">`;
  t.is(
    onlyTheseLeadToThat(
      s1,
      null,
      notBracket,
      char => {
        return char === ">";
      },
      char => {
        return char === "=";
      }
    ),
    14,
    "99.52.01"
  );
});

test(`99.61 - ${`\u001b[${32}m${`U T I L`}\u001b[${39}m`} - ${`\u001b[${33}m${`encodeChar()`}\u001b[${39}m`} - bad-character-unencoded-ampersand`, t => {
  const testsToRun = [
    ["&", "&amp;", "bad-character-unencoded-ampersand"],
    ["<", "&lt;", "bad-character-unencoded-opening-bracket"],
    [">", "&gt;", "bad-character-unencoded-closing-bracket"],
    [`"`, "&quot;", "bad-character-unencoded-double-quotes"],
    ["`", "&#x60;", "bad-character-grave-accent"],
    ["\xA3", "&pound;", "bad-character-unencoded-pound"],
    ["\u20AC", "&euro;", "bad-character-unencoded-euro"],
    ["\xA2", "&cent;", "bad-character-unencoded-cent"]
  ];
  testsToRun.forEach(test => {
    t.deepEqual(
      encodeChar(`a${test[0]}b`, 1),
      {
        name: test[2],
        position: [[1, 2, test[1]]]
      },
      "99.61 - 1. character to encode"
    );
    t.is(encodeChar(`a&b`, 0), null, "99.61 - 2. nothing to encode");
    t.is(encodeChar(`a&b`, 2), null, "99.61 - 3. nothing to encode");
  });
});
