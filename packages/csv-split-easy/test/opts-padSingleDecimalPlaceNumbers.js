import tap from "tap";
import { splitEasy } from "../dist/csv-split-easy.esm";

tap.test("01 - to pad or not to pad", (t) => {
  t.strictSame(
    splitEasy(
      'Product Name,Main Price,Discounted Price\n\rPencil HB,"2.2","2.1"\nPencil 2H,"2.32","2.3"'
    ),
    [
      ["Product Name", "Main Price", "Discounted Price"],
      ["Pencil HB", "2.20", "2.10"],
      ["Pencil 2H", "2.32", "2.30"],
    ],
    "01.01 - default behaviour, padds"
  );
  t.strictSame(
    splitEasy(
      'Product Name,Main Price,Discounted Price\n\rPencil HB,"2.2","2.1"\nPencil 2H,"2.32","2.3"',
      {
        padSingleDecimalPlaceNumbers: false,
      }
    ),
    [
      ["Product Name", "Main Price", "Discounted Price"],
      ["Pencil HB", "2.2", "2.1"],
      ["Pencil 2H", "2.32", "2.3"],
    ],
    "01.02 - padding off"
  );
  t.end();
});
