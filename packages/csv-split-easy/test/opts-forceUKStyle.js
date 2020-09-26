import tap from "tap";
import splitEasy from "../dist/csv-split-easy.esm";

tap.test(
  "01 - Russian/Lithuanian/continental decimal notation style CSV that uses commas",
  (t) => {
    t.strictSame(
      splitEasy(
        'Product Name,Main Price (EUR),Discounted Price (EUR)\n\rCepelinai,"5,25","5,1"\nJautienos kepsnys,"14,5","14,2"'
      ),
      [
        ["Product Name", "Main Price (EUR)", "Discounted Price (EUR)"],
        ["Cepelinai", "5,25", "5,10"],
        ["Jautienos kepsnys", "14,50", "14,20"],
      ],
      "01.01 - does not convert the notation by default, but does pad"
    );
    t.strictSame(
      splitEasy(
        'Product Name,Main Price (EUR),Discounted Price (EUR)\n\rCepelinai,"5,25","5,1"\nJautienos kepsnys,"14,5","14,2"',
        { forceUKStyle: true }
      ),
      [
        ["Product Name", "Main Price (EUR)", "Discounted Price (EUR)"],
        ["Cepelinai", "5.25", "5.10"],
        ["Jautienos kepsnys", "14.50", "14.20"],
      ],
      "01.02 - converts the notation as requested, and does pad by default"
    );
    t.strictSame(
      splitEasy(
        'Product Name,Main Price (EUR),Discounted Price (EUR)\n\rCepelinai,"5,25","5,1"\nJautienos kepsnys,"14,5","14,2"',
        { padSingleDecimalPlaceNumbers: false }
      ),
      [
        ["Product Name", "Main Price (EUR)", "Discounted Price (EUR)"],
        ["Cepelinai", "5,25", "5,1"],
        ["Jautienos kepsnys", "14,5", "14,2"],
      ],
      "01.03 - does not convert the notation by default, and does not pad as requested"
    );
    t.strictSame(
      splitEasy(
        'Product Name,Main Price (EUR),Discounted Price (EUR)\n\rCepelinai,"5,25","5,1"\nJautienos kepsnys,"14,5","14,2"',
        { forceUKStyle: true, padSingleDecimalPlaceNumbers: false }
      ),
      [
        ["Product Name", "Main Price (EUR)", "Discounted Price (EUR)"],
        ["Cepelinai", "5.25", "5.1"],
        ["Jautienos kepsnys", "14.5", "14.2"],
      ],
      "01.04 - converts the notation as requested, but does not pad as requested"
    );
    t.end();
  }
);
