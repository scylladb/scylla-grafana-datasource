"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = WeekNumbers;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _WeekNumber = _interopRequireDefault(require("./WeekNumber"));

var _Flex = _interopRequireDefault(require("../Flex"));

var _dates = require("../shared/dates");

var _propTypes2 = require("../shared/propTypes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function WeekNumbers(props) {
  var activeStartDate = props.activeStartDate,
      calendarType = props.calendarType,
      onClickWeekNumber = props.onClickWeekNumber,
      onMouseLeave = props.onMouseLeave,
      showFixedNumberOfWeeks = props.showFixedNumberOfWeeks;

  var numberOfWeeks = function () {
    if (showFixedNumberOfWeeks) {
      return 6;
    }

    var numberOfDays = (0, _dates.getDaysInMonth)(activeStartDate);
    var startWeekday = (0, _dates.getDayOfWeek)(activeStartDate, calendarType);
    var days = numberOfDays - (7 - startWeekday);
    return 1 + Math.ceil(days / 7);
  }();

  var dates = function () {
    var year = (0, _dates.getYear)(activeStartDate);
    var monthIndex = (0, _dates.getMonthIndex)(activeStartDate);
    var day = (0, _dates.getDay)(activeStartDate);
    var result = [];

    for (var index = 0; index < numberOfWeeks; index += 1) {
      result.push((0, _dates.getBeginOfWeek)(new Date(year, monthIndex, day + index * 7), calendarType));
    }

    return result;
  }();

  var weekNumbers = dates.map(function (date) {
    return (0, _dates.getWeekNumber)(date, calendarType);
  });
  return _react["default"].createElement(_Flex["default"], {
    className: "react-calendar__month-view__weekNumbers",
    count: numberOfWeeks,
    direction: "column",
    onFocus: onMouseLeave,
    onMouseOver: onMouseLeave,
    style: {
      flexBasis: 'calc(100% * (1 / 8)',
      flexShrink: 0
    }
  }, weekNumbers.map(function (weekNumber, weekIndex) {
    return _react["default"].createElement(_WeekNumber["default"], {
      key: weekNumber,
      date: dates[weekIndex],
      onClickWeekNumber: onClickWeekNumber,
      weekNumber: weekNumber
    });
  }));
}

WeekNumbers.propTypes = {
  activeStartDate: _propTypes["default"].instanceOf(Date).isRequired,
  calendarType: _propTypes2.isCalendarType.isRequired,
  onClickWeekNumber: _propTypes["default"].func,
  onMouseLeave: _propTypes["default"].func,
  showFixedNumberOfWeeks: _propTypes["default"].bool
};