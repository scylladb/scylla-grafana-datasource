"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = WeekNumber;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function WeekNumber(_ref) {
  var date = _ref.date,
      onClickWeekNumber = _ref.onClickWeekNumber,
      weekNumber = _ref.weekNumber;
  return onClickWeekNumber ? _react["default"].createElement("button", {
    className: "react-calendar__tile",
    onClick: function onClick() {
      return onClickWeekNumber(weekNumber, date);
    },
    style: {
      flexGrow: 1
    },
    type: "button"
  }, _react["default"].createElement("span", null, weekNumber)) : _react["default"].createElement("div", {
    className: "react-calendar__tile",
    style: {
      flexGrow: 1
    }
  }, _react["default"].createElement("span", null, weekNumber));
}

WeekNumber.propTypes = {
  date: _propTypes["default"].instanceOf(Date).isRequired,
  onClickWeekNumber: _propTypes["default"].func,
  weekNumber: _propTypes["default"].number.isRequired
};