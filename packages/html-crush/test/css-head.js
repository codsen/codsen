import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { m } from "./util/util.js";

// minification within style tags
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - minimal`, () => {
  equal(
    m(equal, `<style>\n\ta {\ndisplay:block;\n}`, {
      removeLineBreaks: true,
    }).result,
    `<style>a{display:block;}`,
    "01.01"
  );
  equal(
    m(equal, `<style>\na{\ndisplay:block;\n}`, {
      removeLineBreaks: true,
    }).result,
    `<style>a{display:block;}`,
    "01.02"
  );
  equal(
    m(equal, `<style> \t\t\t      a    {     display:block;     }`, {
      removeLineBreaks: true,
    }).result,
    `<style>a{display:block;}`,
    "01.03"
  );
  equal(
    m(equal, `<style>a{display:block;}`, {
      removeLineBreaks: true,
    }).result,
    `<style>a{display:block;}`,
    "01.04"
  );
});

test(`02 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - spaces`, () => {
  equal(
    m(equal, `<style>\na something here {display:block;}`, {
      removeLineBreaks: true,
    }).result,
    `<style>a something here{display:block;}`,
    "02.01"
  );
  equal(
    m(equal, `<style>\na.something.here {display:block;}`, {
      removeLineBreaks: true,
    }).result,
    `<style>a.something.here{display:block;}`,
    "02.02"
  );
  equal(
    m(equal, `<style>\na something#here {display:block;}`, {
      removeLineBreaks: true,
    }).result,
    `<style>a something#here{display:block;}`,
    "02.03"
  );
  equal(
    m(equal, `<style>\na  something#here {display:block;}`, {
      removeLineBreaks: true,
    }).result,
    `<style>a something#here{display:block;}`,
    "02.04"
  );
});

test(`03 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - element > element`, () => {
  equal(
    m(equal, `<style>\na>something#here {display:block;}`, {
      removeLineBreaks: true,
    }).result,
    `<style>a>something#here{display:block;}`,
    "03.01"
  );
  equal(
    m(equal, `<style>\na > something#here {display:block;}`, {
      removeLineBreaks: true,
    }).result,
    `<style>a>something#here{display:block;}`,
    "03.02"
  );
  equal(
    m(equal, `<style>\na> something#here {display:block;}`, {
      removeLineBreaks: true,
    }).result,
    `<style>a>something#here{display:block;}`,
    "03.03"
  );
  equal(
    m(equal, `<style>\na> something #here {display:block;}`, {
      removeLineBreaks: true,
    }).result,
    `<style>a>something #here{display:block;}`,
    "03.04"
  );
  equal(
    m(equal, `<style>\na> something  #here {display:block;}`, {
      removeLineBreaks: true,
    }).result,
    `<style>a>something #here{display:block;}`,
    "03.05"
  );
});

test(`04 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - element + element`, () => {
  equal(
    m(equal, `<style>\na+something#here+there {display:block;}`, {
      removeLineBreaks: true,
    }).result,
    `<style>a+something#here+there{display:block;}`,
    "04.01"
  );
  equal(
    m(equal, `<style>\na + something#here + there {display:block;}`, {
      removeLineBreaks: true,
    }).result,
    `<style>a+something#here+there{display:block;}`,
    "04.02"
  );
  equal(
    m(equal, `<style>\na + something #here + there {display:block;}`, {
      removeLineBreaks: true,
    }).result,
    `<style>a+something #here+there{display:block;}`,
    "04.03"
  );
  equal(
    m(equal, `<style>\na  +  something#here  +  there  {\ndisplay:block;\n}`, {
      removeLineBreaks: true,
    }).result,
    `<style>a+something#here+there{display:block;}`,
    "04.04"
  );
  equal(
    m(
      equal,
      `<style>\n   a   +    something  #here   +   there   {\n   display: block;   \n}`,
      {
        removeLineBreaks: true,
      }
    ).result,
    `<style>a+something #here+there{display:block;}`,
    "04.05"
  );
});

test(`05 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - minifies around class names - element ~ element`, () => {
  equal(
    m(equal, `<style>\na~something#here~there {display:block;}`, {
      removeLineBreaks: true,
    }).result,
    `<style>a~something#here~there{display:block;}`,
    "05.01"
  );
  equal(
    m(equal, `<style>\na ~ something#here ~ there {display:block;}`, {
      removeLineBreaks: true,
    }).result,
    `<style>a~something#here~there{display:block;}`,
    "05.02"
  );
  equal(
    m(equal, `<style>\na ~ something #here ~ there {display:block;}`, {
      removeLineBreaks: true,
    }).result,
    `<style>a~something #here~there{display:block;}`,
    "05.03"
  );
  equal(
    m(equal, `<style>\na  ~  something#here  ~  there  {\ndisplay:block;\n}`, {
      removeLineBreaks: true,
    }).result,
    `<style>a~something#here~there{display:block;}`,
    "05.04"
  );
  equal(
    m(
      equal,
      `<style>\n   a   ~    something  #here   ~   there   {\n   display: block;   \n}`,
      {
        removeLineBreaks: true,
      }
    ).result,
    `<style>a~something #here~there{display:block;}`,
    "05.05"
  );
});

test(`06 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - removes CSS comments`, () => {
  equal(
    m(equal, `<style> a { display:block; } /* TAB STYLES */`, {
      removeLineBreaks: true,
    }).result,
    `<style>a{display:block;}`,
    "06.01"
  );
  equal(
    m(equal, `<style> a { display:block; } /* TAB STYLES */`, {
      removeLineBreaks: false,
    }).result,
    `<style> a { display:block; }`,
    "06.02"
  );
});

test(`07 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - removes whitespace in front of !important`, () => {
  equal(
    m(equal, `<style>\n  a { display:block!important; }`, {
      removeLineBreaks: true,
    }).result,
    `<style>a{display:block!important;}`,
    "07.01 - no space"
  );
  equal(
    m(equal, `<style>\n  a { display:block !important; }`, {
      removeLineBreaks: true,
    }).result,
    `<style>a{display:block!important;}`,
    "07.02 - one space"
  );
  equal(
    m(equal, `<style>\n  a { display:block  !important; }`, {
      removeLineBreaks: true,
    }).result,
    `<style>a{display:block!important;}`,
    "07.03 - two spaces"
  );
  equal(
    m(equal, `<style>/*  `, {
      removeLineBreaks: true,
    }).result,
    `<style>`,
    "07.04 - resembling real life"
  );
});

test(`08 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - removes whitespace in front of <script>`, () => {
  let source =
    'a\n    <script src="tralala.js">    \n    \t    a  a   \n  \t   </script>\n    b';

  equal(
    m(equal, source, {
      removeLineBreaks: false,
      removeIndentations: false,
    }).result,
    source,
    "08.01"
  );
  equal(
    m(equal, source, {
      removeLineBreaks: false,
      removeIndentations: true,
    }).result,
    'a\n<script src="tralala.js">    \n    \t    a  a   \n</script>\nb',
    "08.02"
  );
  equal(
    m(equal, source, {
      removeLineBreaks: true,
    }).result,
    'a\n<script src="tralala.js">    \n    \t    a  a   \n</script> b',
    "08.03"
  );
  equal(
    m(equal, source, {
      removeLineBreaks: true,
      lineLengthLimit: 10,
    }).result,
    'a\n<script src="tralala.js">    \n    \t    a  a   \n</script> b',
    "08.04"
  );
});

test(`09 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - does not remove the whitespace in front of !important within Outlook conditionals`, () => {
  equal(
    m(
      equal,
      `<!--[if lte mso 11]>
<style type="text/css">
.class { width:100% !important; }
</style>
<![endif]-->`,
      {
        removeLineBreaks: true,
      }
    ).result,
    `<!--[if lte mso 11]>
<style type="text/css">
.class{width:100% !important;}
</style>
<![endif]-->`,
    "09"
  );
});

test(`10 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - does not remove the whitespace in front of !important within Outlook conditionals, lineLengthLimit=off`, () => {
  equal(
    m(
      equal,
      `<!--[if lte mso 11]>
<style type="text/css">
.class { width:100% !important; }
</style>
<![endif]-->`,
      {
        removeLineBreaks: true,
        lineLengthLimit: 0,
      }
    ).result,
    `<!--[if lte mso 11]>
<style type="text/css">
.class{width:100% !important;}
</style>
<![endif]-->`,
    "10"
  );
});

test(`11 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - does not remove the whitespace in front of !important within Outlook conditionals, mix`, () => {
  equal(
    m(
      equal,
      `<!--[if lte mso 11]>
<style type="text/css">
.class { width:100% !important; }
</style>
<![endif]-->
<style type="text/css">
.class { width:100% !important; }
</style>
<!--[if lte mso 11]>
<style type="text/css">
.class { width:100% !important; }
</style>
<![endif]-->
<style type="text/css">
.class { width:100% !important; }
</style>`,
      {
        removeLineBreaks: true,
      }
    ).result,
    `<!--[if lte mso 11]>
<style type="text/css">
.class{width:100% !important;}
</style>
<![endif]-->
<style type="text/css">
.class{width:100%!important;}
</style>
<!--[if lte mso 11]>
<style type="text/css">
.class{width:100% !important;}
</style>
<![endif]-->
<style type="text/css">
.class{width:100%!important;}
</style>`,
    "11"
  );
});

test(`12 - ${`\u001b[${34}m${`CSS minification`}\u001b[${39}m`} - does not remove the whitespace in front of !important within Outlook conditionals, mix, lineLengthLimit=off`, () => {
  equal(
    m(
      equal,
      `<!--[if lte mso 11]>
<style type="text/css">
.class { width:100% !important; }
</style>
<![endif]-->
<style type="text/css">
.class { width:100% !important; }
</style>
<!--[if lte mso 11]>
<style type="text/css">
.class { width:100% !important; }
</style>
<![endif]-->
<style type="text/css">
.class { width:100% !important; }
</style>`,
      {
        removeLineBreaks: true,
        lineLengthLimit: 0,
      }
    ).result,
    `<!--[if lte mso 11]>
<style type="text/css">
.class{width:100% !important;}
</style>
<![endif]-->
<style type="text/css">
.class{width:100%!important;}
</style>
<!--[if lte mso 11]>
<style type="text/css">
.class{width:100% !important;}
</style>
<![endif]-->
<style type="text/css">
.class{width:100%!important;}
</style>`,
    "12"
  );
});

test.run();
