/* returns a number with a fixed number of decimal places */

const formatToDecimal = (number, places) => {
  return number.toFixed(places);
};

/* returns a string repersentation of a number with thousands separators */

const formatWithCommas = number => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/* returns a string repersentation of a currency value */

export const formatToCurrency = (number, symbol) => {
  const value = formatToDecimal(Math.abs(number), 2);
  const string = symbol + formatWithCommas(value);
  return number > 0 ? string : '-' + string;
};

/* returns a string repersentation of a percentage */

export const formatPercentage = (number, places) => {
  return formatToDecimal(number * 100, places) + '%';
};

/* returns array after basic object key comparison sort */

export const sortByKey = (array, key) => {
  return array.sort(function(a, b) {
    return a[key] - b[key];
  });
};

/* returns string of concatenated array values */

const createSlugFromArray = (full, exclude) => {
  const dfault = full[0];
  // remove all excluded items
  for (let i in exclude) {
    const index = full.indexOf(exclude[i]);
    if (index > -1) full.splice(index, 1);
  }
  // return default or created slug
  return !full.length ? dfault : full.join('-');
};

/* return boolean condition based on matching any array value */

const anyTagCondition = (full, include) => {
  for (let i in include)
    if (full.includes(include[i])) return true;
};

/* create subset of transactions that only include specfic tags */

export const getSubsetTransactions = (transactions, tags, exclude) => {
  const subset = [];
  for (let i in transactions) {
    // clone transaction object
    const transaction = JSON.parse(JSON.stringify(transactions[i]));
    if (anyTagCondition(transaction.tags, tags)) {
      // create subset key for this transaction
      const key = createSlugFromArray(transaction.tags, exclude);
      // add key and initial object to subset array
      if (!(key in subset)) subset[key] = { count: 0, amount: 0 };
      // increment subset object
      subset[key].count += 1;
      subset[key].amount += parseFloat(transaction.amount);
    }
  }
  return subset;
};
