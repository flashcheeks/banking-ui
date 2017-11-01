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

export const createSlugFromArray = (full, exclude) => {
  const dfault = full[0];
  // remove all excluded items
  for (let i in exclude) {
    const index = full.indexOf(exclude[i]);
    if (index > -1) full.splice(index, 1);
  }
  // return default or created slug
  return !full.length ? dfault : full.join('-');
};
