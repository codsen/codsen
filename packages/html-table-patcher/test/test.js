import test from "ava";
import patcher from "../dist/html-table-patcher.esm";
import tiny from "tinyhtml";

function processThis(str) {
  return tiny(patcher(str));
}

// 01. type #1 - code between two TR's or TR and TABLE
// this is an easier case than type #2.
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TABLE and TR`}\u001b[${39}m`} - the beginning`, t => {
  t.deepEqual(
    processThis(`<table width="100%">
  zzz
  <tr>
    <td>
      something
    </td>
  </tr>
</table>`),
    tiny(`<table width="100%">
  <tr>
    <td>
      zzz
    </td>
  </tr>
  <tr>
    <td>
      something
    </td>
  </tr>
</table>`),
    "01.01.01 - str before tr - 1 col"
  );
});

test(`01.02 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TABLE and TR`}\u001b[${39}m`} - the ending`, t => {
  t.deepEqual(
    processThis(`<table width="100%">
  <tr>
    <td>
      something
    </td>
  </tr>
  zzz
</table>`),
    tiny(`<table width="100%">
  <tr>
    <td>
      something
    </td>
  </tr>
  <tr>
    <td>
      zzz
    </td>
  </tr>
</table>`),
    "01.02.01 - string after the tr - 1 col"
  );
});

test(`01.03 - ${`\u001b[${31}m${`type 1`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TR`}\u001b[${39}m`} - code between two tr's`, t => {
  t.deepEqual(
    processThis(`<table width="100%">
  <tr>
    <td>
      something
    </td>
  </tr>
  zzz
  <tr>
    <td>
      else
    </td>
  </tr>
</table>`),
    tiny(`<table width="100%">
  <tr>
    <td>
      something
    </td>
  </tr>
  <tr>
    <td>
      zzz
    </td>
  </tr>
  <tr>
    <td>
      else
    </td>
  </tr>
</table>`),
    "01.03.01 - string between the tr's - 1 col"
  );
});

// 02. type #2 - code between TR and TD
// -----------------------------------------------------------------------------

test(`02.01 - ${`\u001b[${35}m${`type 2`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TR and TD`}\u001b[${39}m`} - first TD after TR`, t => {
  t.deepEqual(
    processThis(`<table>
  <tr>
    zzz
    <td>
      something
    </td>
  </tr>
</table>`),
    tiny(`<table>
  <tr>
    <td>
      zzz
    </td>
  </tr>
  <tr>
    <td>
      something
    </td>
  </tr>
</table>`),
    "02.01.01 - str before tr - 1 col"
  );
});

// 03. type #3 - code between TD and TD
// -----------------------------------------------------------------------------

test(`03.01 - ${`\u001b[${31}m${`type 3`}\u001b[${39}m`}${`\u001b[${33}m${` - code between TD and TD`}\u001b[${39}m`} - between two TD's`, t => {
  t.deepEqual(
    processThis(`<table>
  <tr>
    <td>
      aaa
    </td>
    zzz
    <td>
      bbb
    </td>
  </tr>
</table>`),
    tiny(`<table>
  <tr>
    <td>
      aaa
    </td>
  </tr>
  <tr>
    <td>
      zzz
    </td>
  </tr>
  <tr>
    <td>
      bbb
    </td>
  </tr>
</table>`),
    "03.01.01 - str before tr - 1 col"
  );
});

// 04. type #4 - code between closing TD and closing TR
// -----------------------------------------------------------------------------

test(`04.01 - ${`\u001b[${35}m${`type 4`}\u001b[${39}m`}${`\u001b[${33}m${` - code closing TD and closing TR`}\u001b[${39}m`} - two tags`, t => {
  t.deepEqual(
    processThis(`<table>
  <tr>
    <td>
      aaa
    </td>
    zzz
  </tr>
</table>`),
    tiny(`<table>
  <tr>
    <td>
      aaa
    </td>
  </tr>
  <tr>
    <td>
      zzz
    </td>
  </tr>
</table>`),
    "04.01.01 - 1 col"
  );
});
