"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = DecadeView;

var _react = _interopRequireDefault(require("react"));

var _Years = _interopRequireDefault(require("./DecadeView/Years"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function DecadeView(props) {
  function renderYears() {
    return _react["default"].createElement(_Years["default"], props);
  }

  return _react["default"].createElement("div", {
    className: "react-calendar__decade-view"
  }, renderYears());
}