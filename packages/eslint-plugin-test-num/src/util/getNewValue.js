const getNewValue = (subTestCount, testOrderNumber, counter2) =>
  subTestCount === "single"
    ? testOrderNumber
    : `${testOrderNumber}.${`${counter2}`.padStart(2, "0")}`;

export default getNewValue;
