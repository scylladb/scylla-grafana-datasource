"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = MonthView;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Days = _interopRequireDefault(require("./MonthView/Days"));

var _Weekdays = _interopRequireDefault(require("./MonthView/Weekdays"));

var _WeekNumbers = _interopRequireDefault(require("./MonthView/WeekNumbers"));

var _propTypes2 = require("./shared/propTypes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function MonthView(props) {
  var activeStartDate = props.activeStartDate,
      locale = props.locale,
      onMouseLeave = props.onMouseLeave,
      showFixedNumberOfWeeks = props.showFixedNumberOfWeeks;

  var calendarTypeProps = props.calendarType,
      formatShortWeekday = props.formatShortWeekday,
      onClickWeekNumber = props.onClickWeekNumber,
      showWeekNumbers = props.showWeekNumbers,
      childProps = _objectWithoutProperties(props, ["calendarType", "formatShortWeekday", "onClickWeekNumber", "showWeekNumbers"]);

  var calendarType = function () {
    if (calendarTypeProps) {
      return calendarTypeProps;
    }

    switch (locale) {
      case 'en-CA':
      case 'en-US':
      case 'es-AR':
      case 'es-BO':
      case 'es-CL':
      case 'es-CO':
      case 'es-CR':
      case 'es-DO':
      case 'es-EC':
      case 'es-GT':
      case 'es-HN':
      case 'es-MX':
      case 'es-NI':
      case 'es-PA':
      case 'es-PE':
      case 'es-PR':
      case 'es-SV':
      case 'es-VE':
      case 'pt-BR':
        return 'US';
      // ar-LB, ar-MA intentionally missing

      case 'ar':
      case 'ar-AE':
      case 'ar-BH':
      case 'ar-DZ':
      case 'ar-EG':
      case 'ar-IQ':
      case 'ar-JO':
      case 'ar-KW':
      case 'ar-LY':
      case 'ar-OM':
      case 'ar-QA':
      case 'ar-SA':
      case 'ar-SD':
      case 'ar-SY':
      case 'ar-YE':
      case 'dv':
      case 'dv-MV':
      case 'ps':
      case 'ps-AR':
        return 'Arabic';

      case 'he':
      case 'he-IL':
        return 'Hebrew';

      default:
        return 'ISO 8601';
    }
  }();

  function renderWeekdays() {
    return _react["default"].createElement(_Weekdays["default"], {
      calendarType: calendarType,
      formatShortWeekday: formatShortWeekday,
      locale: locale,
      onMouseLeave: onMouseLeave
    });
  }

  function renderWeekNumbers() {
    if (!showWeekNumbers) {
      return null;
    }

    return _react["default"].createElement(_WeekNumbers["default"], {
      activeStartDate: activeStartDate,
      calendarType: calendarType,
      onClickWeekNumber: onClickWeekNumber,
      onMouseLeave: onMouseLeave,
      showFixedNumberOfWeeks: showFixedNumberOfWeeks
    });
  }

  function renderDays() {
    return _react["default"].createElement(_Days["default"], _extends({
      calendarType: calendarType
    }, childProps));
  }

  var className = 'react-calendar__month-view';
  return _react["default"].createElement("div", {
    className: [className, showWeekNumbers ? "".concat(className, "--weekNumbers") : ''].join(' ')
  }, _react["default"].createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end'
    }
  }, renderWeekNumbers(), _react["default"].createElement("div", {
    style: {
      flexGrow: 1,
      width: '100%'
    }
  }, renderWeekdays(), renderDays())));
}

MonthView.propTypes = {
  activeStartDate: _propTypes["default"].instanceOf(Date).isRequired,
  calendarType: _propTypes2.isCalendarType,
  formatShortWeekday: _propTypes["default"].func,
  locale: _propTypes["default"].string,
  maxDate: _propTypes2.isMaxDate,
  minDate: _propTypes2.isMinDate,
  onChange: _propTypes["default"].func,
  onClickWeekNumber: _propTypes["default"].func,
  onMouseLeave: _propTypes["default"].func,
  setActiveRange: _propTypes["default"].func,
  showFixedNumberOfWeeks: _propTypes["default"].bool,
  showNeighboringMonth: _propTypes["default"].bool,
  showWeekNumbers: _propTypes["default"].bool,
  value: _propTypes2.isValue,
  valueType: _propTypes["default"].string
};