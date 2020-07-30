"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = CenturyView;

var _react = _interopRequireDefault(require("react"));

var _Decades = _interopRequireDefault(require("./CenturyView/Decades"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function CenturyView(props) {
  function renderDecades() {
    return _react["default"].createElement(_Decades["default"], props);
  }

  return _react["default"].createElement("div", {
    className: "react-calendar__century-view"
  }, renderDecades());
}