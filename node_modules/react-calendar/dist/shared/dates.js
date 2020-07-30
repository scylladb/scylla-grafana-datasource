"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getYear = getYear;
exports.getMonth = getMonth;
exports.getMonthIndex = getMonthIndex;
exports.getDay = getDay;
exports.getDayOfWeek = getDayOfWeek;
exports.getBeginOfCenturyYear = getBeginOfCenturyYear;
exports.getBeginOfCentury = getBeginOfCentury;
exports.getEndOfCentury = getEndOfCentury;
exports.getCenturyRange = getCenturyRange;
exports.getBeginOfPreviousCentury = getBeginOfPreviousCentury;
exports.getEndOfPreviousCentury = getEndOfPreviousCentury;
exports.getBeginOfNextCentury = getBeginOfNextCentury;
exports.getBeginOfDecadeYear = getBeginOfDecadeYear;
exports.getBeginOfDecade = getBeginOfDecade;
exports.getEndOfDecade = getEndOfDecade;
exports.getDecadeRange = getDecadeRange;
exports.getBeginOfPreviousDecade = getBeginOfPreviousDecade;
exports.getEndOfPreviousDecade = getEndOfPreviousDecade;
exports.getBeginOfNextDecade = getBeginOfNextDecade;
exports.getBeginOfYear = getBeginOfYear;
exports.getEndOfYear = getEndOfYear;
exports.getYearRange = getYearRange;
exports.getBeginOfPreviousYear = getBeginOfPreviousYear;
exports.getEndOfPreviousYear = getEndOfPreviousYear;
exports.getBeginOfNextYear = getBeginOfNextYear;
exports.getBeginOfMonth = getBeginOfMonth;
exports.getEndOfMonth = getEndOfMonth;
exports.getBeginOfWeek = getBeginOfWeek;
exports.getMonthRange = getMonthRange;
exports.getBeginOfPreviousMonth = getBeginOfPreviousMonth;
exports.getEndOfPreviousMonth = getEndOfPreviousMonth;
exports.getBeginOfNextMonth = getBeginOfNextMonth;
exports.getBeginOfDay = getBeginOfDay;
exports.getEndOfDay = getEndOfDay;
exports.getDayRange = getDayRange;
exports.getWeekNumber = getWeekNumber;
exports.getBegin = getBegin;
exports.getBeginPrevious = getBeginPrevious;
exports.getBeginNext = getBeginNext;
exports.getEnd = getEnd;
exports.getEndPrevious = getEndPrevious;
exports.getRange = getRange;
exports.getValueRange = getValueRange;
exports.getDaysInMonth = getDaysInMonth;
exports.getCenturyLabel = getCenturyLabel;
exports.getDecadeLabel = getDecadeLabel;
exports.isWeekend = isWeekend;
exports.getISOLocalMonth = getISOLocalMonth;
exports.getISOLocalDate = getISOLocalDate;
exports.getEndPrevious2 = exports.getBeginNext2 = exports.getBeginPrevious2 = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _map = _toConsumableArray(Array(7)).map(function (el, index) {
  return index;
}),
    _map2 = _slicedToArray(_map, 7),
    // eslint-disable-next-line no-unused-vars
SUNDAY = _map2[0],
    MONDAY = _map2[1],
    TUESDAY = _map2[2],
    WEDNESDAY = _map2[3],
    THURSDAY = _map2[4],
    FRIDAY = _map2[5],
    SATURDAY = _map2[6];
/* Simple getters - getting a property of a given point in time */


function getYear(date) {
  if (date instanceof Date) {
    return date.getFullYear();
  }

  if (typeof date === 'number') {
    return date;
  }

  var year = parseInt(date, 10);

  if (typeof date === 'string' && !isNaN(year)) {
    return year;
  }

  throw new Error("Failed to get year from date: ".concat(date, "."));
}

function getMonth(date) {
  return date.getMonth() + 1;
}

function getMonthIndex(date) {
  return date.getMonth();
}

function getDay(date) {
  return date.getDate();
}

function getDayOfWeek(date) {
  var calendarType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ISO 8601';
  var weekday = date.getDay();

  switch (calendarType) {
    case 'ISO 8601':
      // Shifts days of the week so that Monday is 0, Sunday is 6
      return (weekday + 6) % 7;

    case 'Arabic':
      return (weekday + 1) % 7;

    case 'Hebrew':
    case 'US':
      return weekday;

    default:
      throw new Error('Unsupported calendar type.');
  }
}
/* Complex getters - getting a property somehow related to a given point in time */


function getBeginOfCenturyYear(date) {
  var year = getYear(date) - 1;
  return year + -year % 100 + 1;
}

function getBeginOfCentury(date) {
  var beginOfCenturyYear = getBeginOfCenturyYear(date);
  return new Date(beginOfCenturyYear, 0, 1);
}

function getEndOfCentury(date) {
  var beginOfCenturyYear = getBeginOfCenturyYear(date);
  return new Date(beginOfCenturyYear + 100, 0, 1, 0, 0, 0, -1);
}

function getCenturyRange(date) {
  return [getBeginOfCentury(date), getEndOfCentury(date)];
}

function getBeginOfPreviousCentury(date) {
  var previousCenturyYear = getYear(date) - 100;
  return getBeginOfCentury(previousCenturyYear);
}

function getEndOfPreviousCentury(date) {
  var previousCenturyYear = getYear(date) - 100;
  return getEndOfCentury(previousCenturyYear);
}

function getBeginOfNextCentury(date) {
  var nextCenturyYear = getYear(date) + 100;
  return getBeginOfCentury(nextCenturyYear);
}

function getBeginOfDecadeYear(date) {
  var year = getYear(date) - 1;
  return year + -year % 10 + 1;
}

function getBeginOfDecade(date) {
  var beginOfDecadeYear = getBeginOfDecadeYear(date);
  return new Date(beginOfDecadeYear, 0, 1);
}

function getEndOfDecade(date) {
  var beginOfDecadeYear = getBeginOfDecadeYear(date);
  return new Date(beginOfDecadeYear + 10, 0, 1, 0, 0, 0, -1);
}

function getDecadeRange(date) {
  return [getBeginOfDecade(date), getEndOfDecade(date)];
}

function getBeginOfPreviousDecade(date) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  var previousDecadeYear = getBeginOfDecadeYear(date) - offset;
  return getBeginOfDecade(previousDecadeYear);
}

function getEndOfPreviousDecade(date) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  var previousDecadeYear = getBeginOfDecadeYear(date) - offset;
  return getEndOfDecade(previousDecadeYear);
}

function getBeginOfNextDecade(date) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  var nextDecadeYear = getBeginOfDecadeYear(date) + offset;
  return getBeginOfDecade(nextDecadeYear);
}
/**
 * Returns the beginning of a given year.
 *
 * @param {Date} date Date.
 */


function getBeginOfYear(date) {
  var year = getYear(date);
  return new Date(year, 0, 1);
}
/**
 * Returns the end of a given year.
 *
 * @param {Date} date Date.
 */


function getEndOfYear(date) {
  var year = getYear(date);
  return new Date(year + 1, 0, 1, 0, 0, 0, -1);
}
/**
 * Returns an array with the beginning and the end of a given year.
 *
 * @param {Date} date Date.
 */


function getYearRange(date) {
  return [getBeginOfYear(date), getEndOfYear(date)];
}

function getBeginOfPreviousYear(date) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var previousYear = getYear(date) - offset;
  return getBeginOfYear(previousYear);
}

function getEndOfPreviousYear(date) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var previousYear = getYear(date) - offset;
  return getEndOfYear(previousYear);
}

function getBeginOfNextYear(date) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var nextYear = getYear(date) + offset;
  return getBeginOfYear(nextYear);
}
/**
 * Returns the beginning of a given month.
 *
 * @param {Date} date Date.
 */


function getBeginOfMonth(date) {
  var year = getYear(date);
  var monthIndex = getMonthIndex(date);
  return new Date(year, monthIndex, 1);
}
/**
 * Returns the end of a given month.
 *
 * @param {Date} date Date.
 */


function getEndOfMonth(date) {
  var year = getYear(date);
  var monthIndex = getMonthIndex(date);
  return new Date(year, monthIndex + 1, 1, 0, 0, 0, -1);
}
/**
 * Returns the beginning of a given week.
 *
 * @param {Date} date Date.
 * @param {String} calendarType Calendar type. Can be ISO 8601 or US.
 */


function getBeginOfWeek(date) {
  var calendarType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ISO 8601';
  var year = getYear(date);
  var monthIndex = getMonthIndex(date);
  var day = date.getDate() - getDayOfWeek(date, calendarType);
  return new Date(year, monthIndex, day);
}
/**
 * Returns an array with the beginning and the end of a given month.
 *
 * @param {Date} date Date.
 */


function getMonthRange(date) {
  return [getBeginOfMonth(date), getEndOfMonth(date)];
}

function getDifferentMonth(date, offset) {
  var year = getYear(date);
  var previousMonthIndex = getMonthIndex(date) + offset;
  return new Date(year, previousMonthIndex, 1);
}

function getBeginOfPreviousMonth(date) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var previousMonth = getDifferentMonth(date, -offset);
  return getBeginOfMonth(previousMonth);
}

function getEndOfPreviousMonth(date) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var previousMonth = getDifferentMonth(date, -offset);
  return getEndOfMonth(previousMonth);
}

function getBeginOfNextMonth(date) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var nextMonth = getDifferentMonth(date, offset);
  return getBeginOfMonth(nextMonth);
}

function getBeginOfDay(date) {
  var year = getYear(date);
  var monthIndex = getMonthIndex(date);
  var day = getDay(date);
  return new Date(year, monthIndex, day);
}

function getEndOfDay(date) {
  var year = getYear(date);
  var monthIndex = getMonthIndex(date);
  var day = getDay(date);
  return new Date(year, monthIndex, day + 1, 0, 0, 0, -1);
}
/**
 * Returns an array with the beginning and the end of a given day.
 *
 * @param {Date} date Date.
 */


function getDayRange(date) {
  return [getBeginOfDay(date), getEndOfDay(date)];
}
/**
 * Gets week number according to ISO 8601 or US standard.
 * In ISO 8601, Arabic and Hebrew week 1 is the one with January 4.
 * In US calendar week 1 is the one with January 1.
 *
 * @param {Date} date Date.
 * @param {String} calendarType Calendar type. Can be ISO 8601 or US.
 */


function getWeekNumber(date) {
  var calendarType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ISO 8601';
  var calendarTypeForWeekNumber = calendarType === 'US' ? 'US' : 'ISO 8601';
  var beginOfWeek = getBeginOfWeek(date, calendarTypeForWeekNumber);
  var year = getYear(date) + 1;
  var dayInWeekOne;
  var beginOfFirstWeek; // Look for the first week one that does not come after a given date

  do {
    dayInWeekOne = new Date(year, 0, calendarTypeForWeekNumber === 'ISO 8601' ? 4 : 1);
    beginOfFirstWeek = getBeginOfWeek(dayInWeekOne, calendarTypeForWeekNumber);
    year -= 1;
  } while (date - beginOfFirstWeek < 0);

  return Math.round((beginOfWeek - beginOfFirstWeek) / (8.64e7 * 7)) + 1;
}
/**
 * Returns the beginning of a given range.
 *
 * @param {String} rangeType Range type (e.g. 'day')
 * @param {Date} date Date.
 */


function getBegin(rangeType, date) {
  switch (rangeType) {
    case 'century':
      return getBeginOfCentury(date);

    case 'decade':
      return getBeginOfDecade(date);

    case 'year':
      return getBeginOfYear(date);

    case 'month':
      return getBeginOfMonth(date);

    case 'day':
      return getBeginOfDay(date);

    default:
      throw new Error("Invalid rangeType: ".concat(rangeType));
  }
}

function getBeginPrevious(rangeType, date) {
  switch (rangeType) {
    case 'century':
      return getBeginOfPreviousCentury(date);

    case 'decade':
      return getBeginOfPreviousDecade(date);

    case 'year':
      return getBeginOfPreviousYear(date);

    case 'month':
      return getBeginOfPreviousMonth(date);

    default:
      throw new Error("Invalid rangeType: ".concat(rangeType));
  }
}

function getBeginNext(rangeType, date) {
  switch (rangeType) {
    case 'century':
      return getBeginOfNextCentury(date);

    case 'decade':
      return getBeginOfNextDecade(date);

    case 'year':
      return getBeginOfNextYear(date);

    case 'month':
      return getBeginOfNextMonth(date);

    default:
      throw new Error("Invalid rangeType: ".concat(rangeType));
  }
}

var getBeginPrevious2 = function getBeginPrevious2(rangeType, date) {
  switch (rangeType) {
    case 'decade':
      return getBeginOfPreviousDecade(date, 100);

    case 'year':
      return getBeginOfPreviousYear(date, 10);

    case 'month':
      return getBeginOfPreviousMonth(date, 12);

    default:
      throw new Error("Invalid rangeType: ".concat(rangeType));
  }
};

exports.getBeginPrevious2 = getBeginPrevious2;

var getBeginNext2 = function getBeginNext2(rangeType, date) {
  switch (rangeType) {
    case 'decade':
      return getBeginOfNextDecade(date, 100);

    case 'year':
      return getBeginOfNextYear(date, 10);

    case 'month':
      return getBeginOfNextMonth(date, 12);

    default:
      throw new Error("Invalid rangeType: ".concat(rangeType));
  }
};
/**
 * Returns the end of a given range.
 *
 * @param {String} rangeType Range type (e.g. 'day')
 * @param {Date} date Date.
 */


exports.getBeginNext2 = getBeginNext2;

function getEnd(rangeType, date) {
  switch (rangeType) {
    case 'century':
      return getEndOfCentury(date);

    case 'decade':
      return getEndOfDecade(date);

    case 'year':
      return getEndOfYear(date);

    case 'month':
      return getEndOfMonth(date);

    case 'day':
      return getEndOfDay(date);

    default:
      throw new Error("Invalid rangeType: ".concat(rangeType));
  }
}

function getEndPrevious(rangeType, date) {
  switch (rangeType) {
    case 'century':
      return getEndOfPreviousCentury(date);

    case 'decade':
      return getEndOfPreviousDecade(date);

    case 'year':
      return getEndOfPreviousYear(date);

    case 'month':
      return getEndOfPreviousMonth(date);

    default:
      throw new Error("Invalid rangeType: ".concat(rangeType));
  }
}

var getEndPrevious2 = function getEndPrevious2(rangeType, date) {
  switch (rangeType) {
    case 'decade':
      return getEndOfPreviousDecade(date, 100);

    case 'year':
      return getEndOfPreviousYear(date, 10);

    case 'month':
      return getEndOfPreviousMonth(date, 12);

    default:
      throw new Error("Invalid rangeType: ".concat(rangeType));
  }
};
/**
 * Returns an array with the beginning and the end of a given range.
 *
 * @param {String} rangeType Range type (e.g. 'day')
 * @param {Date} date Date.
 */


exports.getEndPrevious2 = getEndPrevious2;

function getRange(rangeType, date) {
  switch (rangeType) {
    case 'century':
      return getCenturyRange(date);

    case 'decade':
      return getDecadeRange(date);

    case 'year':
      return getYearRange(date);

    case 'month':
      return getMonthRange(date);

    case 'day':
      return getDayRange(date);

    default:
      throw new Error("Invalid rangeType: ".concat(rangeType));
  }
}
/**
 * Creates a range out of two values, ensuring they are in order and covering entire period ranges.
 *
 * @param {String} rangeType Range type (e.g. 'day')
 * @param {Date} date1 First date.
 * @param {Date} date2 Second date.
 */


function getValueRange(rangeType, date1, date2) {
  var rawNextValue = [date1, date2].sort(function (a, b) {
    return a - b;
  });
  return [getBegin(rangeType, rawNextValue[0]), getEnd(rangeType, rawNextValue[1])];
}
/**
 * Returns a number of days in a month of a given date.
 *
 * @param {Date} date Date.
 */


function getDaysInMonth(date) {
  var year = getYear(date);
  var monthIndex = getMonthIndex(date);
  return new Date(year, monthIndex + 1, 0).getDate();
}

function toYearLabel(_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      start = _ref2[0],
      end = _ref2[1];

  return "".concat(getYear(start), " \u2013 ").concat(getYear(end));
}
/**
 * Returns a string labelling a century of a given date.
 * For example, for 2017 it will return 2001-2100.
 *
 * @param {Date|String|Number} date Date or a year as a string or as a number.
 */


function getCenturyLabel(date) {
  return toYearLabel(getCenturyRange(date));
}
/**
 * Returns a string labelling a century of a given date.
 * For example, for 2017 it will return 2011-2020.
 *
 * @param {Date|String|Number} date Date or a year as a string or as a number.
 */


function getDecadeLabel(date) {
  return toYearLabel(getDecadeRange(date));
}
/**
 * Returns a boolean determining whether a given date is on Saturday or Sunday.
 *
 * @param {Date} date Date.
 */


function isWeekend(date) {
  var calendarType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ISO 8601';
  var weekday = date.getDay();

  switch (calendarType) {
    case 'Arabic':
    case 'Hebrew':
      return weekday === FRIDAY || weekday === SATURDAY;

    case 'ISO 8601':
    case 'US':
      return weekday === SATURDAY || weekday === SUNDAY;

    default:
      throw new Error('Unsupported calendar type.');
  }
}
/**
 * Returns local month in ISO-like format (YYYY-MM).
 */


function getISOLocalMonth(value) {
  if (!value) {
    return value;
  }

  var date = new Date(value);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date: ".concat(value));
  }

  var year = getYear(date);
  var month = "0".concat(getMonth(date)).slice(-2);
  return "".concat(year, "-").concat(month);
}
/**
 * Returns local date in ISO-like format (YYYY-MM-DD).
 */


function getISOLocalDate(value) {
  if (!value) {
    return value;
  }

  var date = new Date(value);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date: ".concat(value));
  }

  var year = getYear(date);
  var month = "0".concat(getMonth(date)).slice(-2);
  var day = "0".concat(getDay(date)).slice(-2);
  return "".concat(year, "-").concat(month, "-").concat(day);
}