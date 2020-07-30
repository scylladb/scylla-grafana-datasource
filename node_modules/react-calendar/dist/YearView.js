"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = YearView;

var _react = _interopRequireDefault(require("react"));

var _Months = _interopRequireDefault(require("./YearView/Months"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function YearView(props) {
  function renderMonths() {
    return _react["default"].createElement(_Months["default"], props);
  }

  return _react["default"].createElement("div", {
    className: "react-calendar__year-view"
  }, renderMonths());
}