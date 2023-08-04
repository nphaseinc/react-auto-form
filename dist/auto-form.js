var formik = require('formik');
var React = require('react');
var classNames = require('classnames');
var antd = require('antd');
var icons = require('@ant-design/icons');
var dayjs = require('dayjs');
var lodash = require('lodash');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return n;
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);
var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var classNames__default = /*#__PURE__*/_interopDefaultLegacy(classNames);
var dayjs__default = /*#__PURE__*/_interopDefaultLegacy(dayjs);

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

/**
 * Ensure that the input values match the property definitions
 */
function sanitizeValues(definition, initialValue) {
  if (initialValue === void 0) {
    initialValue = {};
  }
  return Object.keys(definition).reduce(function (result, key) {
    var _extends2;
    var prop = definition[key];
    if (prop.type === 'legend') {
      return result;
    }
    var value = massageValue(prop, initialValue[key], prop.defaultValue);
    return _extends({}, result, (_extends2 = {}, _extends2[key] = value, _extends2));
  }, {});
}
/**
 * Add the 'name' field from the property ID and sort them by the 'order' property
 */
function enrichAndOrderProperties(definition) {
  return Object.keys(definition).filter(function (key) {
    return check(definition[key]);
  }).map(function (key) {
    return _extends({}, definition[key], {
      name: key,
      required: massageRequired(definition[key]),
      type: massageType(definition[key])
    });
  }).sort(function (a, b) {
    var aOrder = a.order || 0;
    var bOrder = b.order || 0;
    return aOrder - bOrder;
  });
}
/**
 * Converts various values passed into the property type to known input types
 *
 * @param property
 */
function massageType(property) {
  var type = property.type || 'text';
  switch (type) {
    case 'hidden':
      return type;
    case 'int':
    case 'integer':
    case 'long':
      type = 'number';
      break;
    case 'string':
      type = 'text';
      break;
    case 'STRING':
      type = 'text';
      break;
    case 'boolean':
      type = 'checkbox';
  }
  if (typeof property["enum"] !== 'undefined' && property["enum"].length && type !== 'typeahead' && type !== 'list') {
    /**
     * Default to `select` unless property.type === 'typeahead'
     */
    type = 'select';
  }
  if (typeof property.secret === 'boolean' && property.secret) {
    type = 'password';
  }
  return type;
}
/**
 * Ensure that the 'required' property is false for checkboxes and hidden fields
 *
 * This is a candidate for removal in the future, as it's a workaround
 *
 * @param property
 */
function massageRequired(property) {
  switch (property.type) {
    case 'boolean':
    case 'checkbox':
    case 'switch':
    case 'hidden':
      return false;
    default:
      return property.required;
  }
}
function check(property) {
  return property.type !== 'notfield';
}
function getNewArrayRow(definition) {
  return sanitizeValues(definition, {});
}
function getNewArrayRows(missing, definition) {
  var answer = [];
  for (var i = 0; i < missing; i++) {
    answer.push(getNewArrayRow(definition));
  }
  return answer;
}
function sanitizeInitialArrayValue(definition, value, minimum) {
  var sanitizedValue = (value || []).map(function (v) {
    return sanitizeValues(definition, v);
  });
  var available = sanitizedValue.length;
  var missing = (minimum || 0) - available;
  if (missing < 0) {
    return sanitizedValue;
  }
  return [].concat(sanitizedValue, getNewArrayRows(missing, definition));
}
/**
 * Converts the given value from a string to the type defined in the property definition
 *
 * This is a candidate for removal as it's a workaround
 *
 * @param property
 * @param value
 * @param defaultValue
 */
function massageValue(property, value, defaultValue) {
  switch (property.type) {
    case 'number':
      return parseInt(value || defaultValue || 0, 10);
    case 'boolean':
    case 'switch':
    case 'checkbox':
      return String(value || defaultValue || 'false').toLocaleLowerCase() === 'true';
    case 'array':
      var minElements = typeof property.arrayDefinitionOptions !== 'undefined' ? property.arrayDefinitionOptions.minElements : 0;
      return sanitizeInitialArrayValue(property.arrayDefinition || {}, value || defaultValue, minElements);
    case 'mapset':
      {
        var answer = value;
        var defaultValueObject = typeof defaultValue === 'string' ? JSON.parse(defaultValue) : defaultValue;
        if (typeof answer === 'undefined') {
          return defaultValueObject;
        }
        if (typeof answer === 'string') {
          var answerObject = JSON.parse(answer);
          if (Object.keys(answerObject).length === 0) {
            return defaultValueObject;
          } else {
            return answerObject;
          }
        }
        return answer;
      }
    case 'select':
      {
        var _property$fieldAttrib;
        if (property.fieldAttributes && property.fieldAttributes.multiple) {
          return value || defaultValue || [];
        }
        if (property != null && (_property$fieldAttrib = property.fieldAttributes) != null && _property$fieldAttrib.allowEmptyValue) {
          return value || defaultValue;
        }
        // select controls in syndesis need to default
        // to the first available value if no value
        // is set
        var theFirstElement = property["enum"] && property["enum"].length > 0 ? property["enum"][0].value : '';
        return value || defaultValue || theFirstElement;
      }
    case 'multi':
      {
        return value || defaultValue || [];
      }
    default:
      {
        return value || defaultValue || '';
      }
  }
}
function renderFileName(inputText) {
  if (typeof inputText === 'string') {
    var match = inputText.match(/:(.*)/);
    if (match) {
      return match[1];
    }
  }
  return '';
}

function useFormBuilder() {
  var autoFormContext = React__namespace.useContext(AutoFormContext);
  /**
   * Converts a property configuration to some kind of input field
   *
   * @param props
   */
  var getField = function getField(props) {
    // Massage the value in the definition to an input type
    var type = massageType(props.property);
    var componentTypemaps = autoFormContext.typemaps;
    switch (type) {
      case 'array':
        return React__namespace.createElement(formik.FieldArray, _extends({}, props, {
          key: props.property.name,
          name: props.property.name
        }), function (helpers) {
          return React__namespace.createElement(FormArrayComponent, _extends({}, props, helpers));
        });
      default:
        return React__namespace.createElement(formik.Field, _extends({
          key: props.property.name
        }, props, {
          name: props.property.name,
          disabled: props.property.disabled,
          type: type,
          component: componentTypemaps[type] || FormInputComponent
        }));
    }
  };
  var getPropertiesArray = function getPropertiesArray(definition) {
    return enrichAndOrderProperties(definition);
  };
  var getInitialValues = function getInitialValues(definition, initialValues) {
    return sanitizeValues(definition, initialValues);
  };
  return {
    getField: getField,
    getInitialValues: getInitialValues,
    getPropertiesArray: getPropertiesArray
  };
}

function getValidationState(_ref) {
  var form = _ref.form,
    field = _ref.field;
  var error = getErrorText(form.errors, field.name);
  var touched = formik.getIn(form.touched, field.name);
  return touched && error ? false : touched ? undefined : undefined;
}
function getErrorText(errors, fieldName) {
  return formik.getIn(errors, fieldName) || errors[fieldName];
}
function getHelperText(fieldName, description, errors) {
  var helperText = description || '';
  var errorText = getErrorText(errors, fieldName);
  var helperTextInvalid = helperText !== '' ? helperText + " - " + errorText : errorText;
  return {
    helperText: helperText,
    helperTextInvalid: helperTextInvalid
  };
}
/**
 * Returns a valid DOM id from the given string
 *
 * @param value
 */
function toValidHtmlId(value) {
  return value ? value.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase() : value || '';
}

var _excluded$f = ["direction", "withoutFormTag", "children", "className"];
var FormContext = React__default["default"].createContext({
  direction: 'horizontal'
});
var Form = function Form(_ref) {
  var direction = _ref.direction,
    withoutFormTag = _ref.withoutFormTag,
    children = _ref.children,
    className = _ref.className,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$f);
  return React__default["default"].createElement(FormContext.Provider, {
    value: {
      direction: direction || 'horizontal'
    }
  }, withoutFormTag ? React__default["default"].createElement("div", {
    className: classNames__default["default"]('AutoForm_Form', className)
  }, children) : React__default["default"].createElement("form", _extends({
    className: classNames__default["default"]('AutoForm_Form', className)
  }, props), children));
};

var _excluded$e = ["className", "direction"],
  _excluded2$1 = ["validated", "isValid", "fieldId", "helperText", "helperTextInvalid", "isInline", "label", "labelHint", "isRequired", "className", "children", "fieldProps", "renderAfterField"];
var FormGroupHelperText = function FormGroupHelperText(_ref) {
  var fieldId = _ref.fieldId,
    className = _ref.className,
    children = _ref.children;
  return React__default["default"].createElement("div", {
    className: classNames__default["default"]('AutoForm_FormGroup-helperText', className),
    id: fieldId + "-helper",
    "aria-live": "polite"
  }, children);
};
var AutoFormFormGroupBody = function AutoFormFormGroupBody(_ref2) {
  var className = _ref2.className,
    direction = _ref2.direction,
    props = _objectWithoutPropertiesLoose(_ref2, _excluded$e);
  return React__default["default"].createElement("div", _extends({}, props, {
    className: classNames__default["default"]('AutoForm_FormGroup', "AutoForm_FormGroup--" + direction, className)
  }));
};
var AutoFormFormGroup = function AutoFormFormGroup(_ref3) {
  var validated = _ref3.validated,
    isValid = _ref3.isValid,
    fieldId = _ref3.fieldId,
    helperText = _ref3.helperText,
    helperTextInvalid = _ref3.helperTextInvalid,
    label = _ref3.label,
    labelHint = _ref3.labelHint,
    isRequired = _ref3.isRequired,
    className = _ref3.className,
    children = _ref3.children,
    fieldProps = _ref3.fieldProps,
    renderAfterField = _ref3.renderAfterField,
    props = _objectWithoutPropertiesLoose(_ref3, _excluded2$1);
  var _useContext = React.useContext(FormContext),
    direction = _useContext.direction;
  var renderHelperText = helperText && React__default["default"].createElement(FormGroupHelperText, {
    fieldId: fieldId,
    className: validated === 'success' && 'AutoForm_FormGroup-helperText--success',
    children: helperText
  });
  var renderHelperInvalid = helperTextInvalid && (validated === 'error' || isValid === false) && React__default["default"].createElement(FormGroupHelperText, {
    fieldId: fieldId,
    className: "AutoForm_FormGroup-helperText--error"
  }, React__default["default"].createElement(React__default["default"].Fragment, null, helperTextInvalid));
  return React__default["default"].createElement(AutoFormFormGroupBody, _extends({}, props, {
    direction: direction || 'horizontal',
    className: classNames__default["default"]((renderHelperInvalid || renderHelperText) && 'AutoForm_FormGroup--disableMargin', className)
  }), label && React__default["default"].createElement("label", {
    className: "AutoForm_FormGroup-formLabel",
    htmlFor: fieldId
  }, React__default["default"].createElement("span", null, React__default["default"].createElement("span", {
    className: "AutoForm_FormGroup-formLabel__text"
  }, label, ' ', isRequired && React__default["default"].createElement("span", {
    className: "AutoForm_FormGroup-formLabel__required",
    "aria-hidden": "true"
  }, "*"), labelHint && React__default["default"].createElement(antd.Tooltip, {
    "aria-label": labelHint,
    title: labelHint
  }, "\xA0", React__default["default"].createElement(icons.QuestionCircleOutlined, {
    "data-testid": "tooltip"
  }))))), React__default["default"].createElement("div", {
    className: "AutoForm_FormGroup-content"
  }, children, renderAfterField && renderAfterField(fieldProps)), renderHelperInvalid || renderHelperText);
};

var FormArrayComponent = function FormArrayComponent(props) {
  if (typeof props.property.arrayDefinition === 'undefined') {
    return React__namespace.createElement("div", {
      className: "alert alert-warning"
    }, React__namespace.createElement("span", null, "No Array definition supplied for array type"));
  }
  var _useFormBuilder = useFormBuilder(),
    getField = _useFormBuilder.getField,
    getPropertiesArray = _useFormBuilder.getPropertiesArray,
    getInitialValues = _useFormBuilder.getInitialValues;
  var definition = props.property.arrayDefinition;
  var options = props.property.arrayDefinitionOptions || {};
  var formGroupAttributes = options.formGroupAttributes || {};
  var fieldAttributes = options.fieldAttributes || {};
  var controlLabelAttributes = options.controlLabelAttributes || {};
  var arrayControlAttributes = options.arrayControlAttributes || {};
  var arrayRowTitleAttributes = options.arrayRowTitleAttributes || {};
  var minElements = options.minElements || 0;
  var values = props.form.values[props.name] || props.property.defaultValue || [];
  var myId = toValidHtmlId(props.name);
  return React__namespace.createElement(AutoFormFormGroupBody, {
    direction: "vertical",
    id: myId,
    "data-testid": myId
  }, React__namespace.createElement(antd.List, {
    className: "AutoForm_FormArray",
    dataSource: values,
    rowKey: function rowKey(item) {
      return item.name;
    },
    renderItem: function renderItem(value, index) {
      var fieldName = props.name + "[" + index + "]";
      var rowValue = getInitialValues(definition, value);
      var propertiesArray = getPropertiesArray(definition);
      var controlGroupName = fieldName + "-array-controls";
      var controlGroupId = toValidHtmlId(controlGroupName + "-control");
      return React__namespace.createElement(antd.List.Item, {
        className: "AutoForm_FormArray-listItem"
      }, (!!options.showSortControls || !!options.rowTitle) && React__namespace.createElement(antd.Space, {
        direction: "horizontal",
        className: "AutoForm_FormArray-listItem-header"
      }, React__namespace.createElement(antd.Typography.Text, _extends({
        strong: true
      }, arrayRowTitleAttributes, {
        children: options.rowTitle ? index + 1 + ". " + options.rowTitle : ''
      })), options.showSortControls && React__namespace.createElement(antd.Space, _extends({}, arrayControlAttributes, {
        key: controlGroupName,
        direction: "horizontal",
        id: controlGroupId
      }), options.showSortControls && React__namespace.createElement(React__namespace.Fragment, null, React__namespace.createElement(antd.Button, {
        shape: "circle",
        size: "small",
        "data-testid": "condition-move-up",
        onClick: function onClick() {
          props.move(index, index - 1);
        },
        disabled: !(index > 0)
      }, React__namespace.createElement(icons.UpOutlined, null)), React__namespace.createElement(antd.Button, {
        shape: "circle",
        size: "small",
        "data-testid": "condition-move-down",
        onClick: function onClick() {
          props.move(index, index + 1);
        },
        disabled: !(index < values.length - 1)
      }, React__namespace.createElement(icons.DownOutlined, null))), React__namespace.createElement(antd.Button, {
        danger: true,
        shape: "circle",
        size: "small",
        "data-testid": "condition-delete",
        onClick: function onClick() {
          return props.remove(index);
        },
        disabled: !(values.length > minElements)
      }, React__namespace.createElement(icons.DeleteOutlined, null)))), React__namespace.createElement(antd.Divider, {
        className: "AutoForm_FormArray-divider"
      }), React__namespace.createElement("div", _extends({}, formGroupAttributes, {
        className: classNames__default["default"]('AutoForm_FormArray-fields', formGroupAttributes.className)
      }), propertiesArray.map(function (property) {
        var propertyFieldName = fieldName + "." + property.name;
        return getField({
          allFieldsRequired: props.allFieldsRequired || false,
          property: _extends({
            controlLabelAttributes: controlLabelAttributes,
            fieldAttributes: fieldAttributes,
            formGroupAttributes: formGroupAttributes
          }, property, {
            key: propertyFieldName,
            name: propertyFieldName
          }),
          uploadFile: props.uploadFile,
          renderFileName: props.renderFileName,
          renderCustomField: props.renderCustomField,
          onChangeCustom: props.onChangeCustom,
          value: rowValue[property.name]
        });
      })));
    }
  }), React__namespace.createElement(antd.Button, {
    "data-testid": "form-array-control-add-another-item-button",
    onClick: function onClick() {
      return props.push(getNewArrayRow(definition));
    },
    type: "dashed"
  }, React__namespace.createElement(icons.PlusOutlined, null), "\xA0", options.i18nAddElementText || 'Add Another'));
};

var FormLegendComponent = function FormLegendComponent(props) {
  return React__namespace.createElement(AutoFormFormGroupBody, {
    direction: "vertical"
  }, React__namespace.createElement(antd.Typography.Title, {
    level: 4,
    children: props.property.displayName,
    ellipsis: true
  }));
};

var _excluded$d = ["value", "onChange"];
var FormInputComponent = function FormInputComponent(props) {
  var _props$field = props.field,
    value = _props$field.value,
    onChange = _props$field.onChange,
    field = _objectWithoutPropertiesLoose(_props$field, _excluded$d);
  var id = toValidHtmlId(field.name);
  var handleChange = function handleChange(event) {
    if (props.onChangeCustom) {
      props.onChangeCustom(field.name, event.currentTarget.value);
    } else {
      onChange(event);
    }
  };
  var _getHelperText = getHelperText(props.field.name, props.property.description, props.form.errors),
    helperText = _getHelperText.helperText,
    helperTextInvalid = _getHelperText.helperTextInvalid;
  var isValid = getValidationState(props);
  var CurrentInput = antd.Input;
  if (props.property.secret) {
    CurrentInput = antd.Input.Password;
  }
  return React__namespace.createElement(AutoFormFormGroup, _extends({
    label: props.property.displayName,
    labelHint: props.property.labelHint
  }, props.property.formGroupAttributes, {
    fieldId: id,
    isRequired: props.property.required,
    isValid: isValid,
    helperText: helperText,
    helperTextInvalid: helperTextInvalid,
    fieldProps: props,
    renderAfterField: props.renderAfterField
  }), React__namespace.createElement(CurrentInput, _extends({}, props.property.fieldAttributes, field, {
    value: value,
    "data-testid": id,
    id: id,
    "aria-label": props.property.displayName || field.name,
    disabled: props.form.isSubmitting || props.property.disabled,
    placeholder: props.property.placeholder,
    type: props.type,
    onChange: handleChange,
    title: props.property.controlHint,
    list: id + "-list",
    status: isValid === false ? 'error' : undefined
  })), props.property.dataList && props.property.dataList.length > 0 && React__namespace.createElement("datalist", {
    id: id + "-list"
  }, props.property.dataList.map(function (opt, index) {
    return React__namespace.createElement("option", {
      key: index,
      value: opt
    }, opt);
  })));
};

var _excluded$c = ["value", "onChange"];
var FormFilesComponent = function FormFilesComponent(props) {
  var _props$field = props.field,
    value = _props$field.value,
    field = _objectWithoutPropertiesLoose(_props$field, _excluded$c);
  var id = toValidHtmlId(field.name);
  var triggerChange = function triggerChange(file, filename) {
    try {
      if (!props.uploadFile) {
        throw new Error('"uploadFile" function should be declared!');
      }
      if (!props.onChangeCustom) {
        throw new Error('"onChangeCustom" function should be declared!');
      }
      return Promise.resolve(props.uploadFile({
        filename: filename,
        file: file,
        fieldName: field.name
      })).then(function (currentValue) {
        props.onChangeCustom(field.name, currentValue);
        return false;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var handleChange = function handleChange(file) {
    return triggerChange(file, file.name);
  };
  var handleClear = function handleClear() {
    return triggerChange('', '');
  };
  var _getHelperText = getHelperText(props.field.name, props.property.description, props.form.errors),
    helperText = _getHelperText.helperText,
    helperTextInvalid = _getHelperText.helperTextInvalid;
  var isValid = getValidationState(props);
  return React__namespace.createElement(AutoFormFormGroup, _extends({
    label: props.property.displayName,
    labelHint: props.property.labelHint
  }, props.property.formGroupAttributes, {
    fieldId: id,
    isRequired: props.property.required,
    isValid: isValid,
    helperText: helperText,
    helperTextInvalid: helperTextInvalid
  }), React__namespace.createElement(antd.Input.Group, {
    className: classNames__default["default"]('AutoForm_FormFilesComponent', !!value && 'AutoForm_FormFilesComponent--withValue'),
    compact: true
  }, !!value && React__namespace.createElement(React__namespace.Fragment, null, React__namespace.createElement(antd.Input, {
    tabIndex: -1,
    disabled: true,
    value: value,
    className: "AutoForm_FormFilesComponent-input",
    status: isValid === false ? 'error' : undefined
  }), React__namespace.createElement(antd.Button, {
    disabled: props.form.isSubmitting || props.property.disabled,
    className: "AutoForm_FormFilesComponent-button",
    children: React__namespace.createElement(icons.DeleteOutlined, null),
    onClick: handleClear
  })), React__namespace.createElement(antd.Upload.Dragger, _extends({}, props.property.fieldAttributes, field, {
    "data-testid": id,
    id: id,
    maxCount: 1,
    fileList: [],
    beforeUpload: handleChange,
    "aria-label": props.property.displayName || field.name,
    disabled: props.form.isSubmitting || props.property.disabled,
    className: "AutoForm_FormFilesComponent-dragger"
  }), React__namespace.createElement(icons.UploadOutlined, null), " ", !value && props.localization.fileUploadText)));
};

var _excluded$b = ["value", "onChange", "onBlur"];
var FormMapsetComponent = function FormMapsetComponent(props) {
  var _useFormBuilder = useFormBuilder(),
    getField = _useFormBuilder.getField;
  var _props$field = props.field,
    value = _props$field.value,
    field = _objectWithoutPropertiesLoose(_props$field, _excluded$b);
  var mapsetValue = (typeof value === 'string' ? JSON.parse(value) : value) || {};
  var id = toValidHtmlId(field.name);
  var mapsetOptions = props.property.mapsetOptions || {};
  var mapsetValueDefinition = _extends({}, props.property.mapsetValueDefinition || {});
  var mapsetKeys = props.property.mapsetKeys || [];
  var isValid = getValidationState(props);
  var _getHelperText = getHelperText(props.field.name, props.property.description, props.form.errors),
    helperText = _getHelperText.helperText,
    helperTextInvalid = _getHelperText.helperTextInvalid;
  return React__namespace.createElement(React__namespace.Fragment, null, React__namespace.createElement(AutoFormFormGroup, _extends({}, props.property.formGroupAttributes, {
    label: props.property.displayName,
    labelHint: props.property.labelHint,
    fieldId: id,
    isValid: isValid,
    isRequired: props.property.required,
    helperText: helperText,
    helperTextInvalid: helperTextInvalid
  }), React__namespace.createElement(antd.Collapse, {
    className: isValid === false ? 'AutoForm_FormMapset-collapse--error' : ''
  }, React__namespace.createElement(antd.Collapse.Panel, {
    key: "1",
    header: React__namespace.createElement(AutoFormFormGroup, {
      fieldId: id + "-mapset-header",
      label: mapsetOptions.i18nKeyColumnTitle
    }, mapsetOptions.i18nValueColumnTitle)
  }, mapsetKeys.sort(function (a, b) {
    return a.displayName.localeCompare(b.displayName);
  }).map(function (mapsetKey) {
    return getField({
      allFieldsRequired: false,
      property: _extends({}, mapsetValueDefinition, {
        name: field.name + "." + mapsetKey.name,
        displayName: mapsetKey.displayName
      }),
      value: mapsetValue[mapsetKey.name]
    });
  })))));
};

var _excluded$a = ["onChange", "onBlur", "value"],
  _excluded2 = ["allowEmptyValue"];
var FormSelectComponent = function FormSelectComponent(props) {
  var isMultiple = props.property.fieldAttributes && props.property.fieldAttributes.multiple;
  var _props$field = props.field,
    value = _props$field.value,
    field = _objectWithoutPropertiesLoose(_props$field, _excluded$a);
  var id = toValidHtmlId(field.name);
  var adjustValue = function adjustValue() {
    if (isMultiple) {
      var arrayValue = value;
      if (!value) {
        arrayValue = [];
      } else if (typeof value === 'string') {
        if (value.startsWith('[')) {
          arrayValue = JSON.parse(value);
        } else {
          arrayValue = [value];
        }
      }
      return arrayValue;
    } else {
      if (typeof value !== 'string' && value) {
        return value == null ? void 0 : value.toString();
      }
      return value;
    }
  };
  var updatedValue = adjustValue();
  var handleChange = function handleChange(currentValue) {
    if (props.onChangeCustom) {
      return props.onChangeCustom(field.name, currentValue);
    }
    props.form.setFieldValue(props.field.name, currentValue);
  };
  var _getHelperText = getHelperText(props.field.name, props.property.description || props.property.controlHint, props.form.errors),
    helperText = _getHelperText.helperText,
    helperTextInvalid = _getHelperText.helperTextInvalid;
  var isValid = getValidationState(props);
  var _props$property$field = props.property.fieldAttributes,
    fieldAttributes = _objectWithoutPropertiesLoose(_props$property$field, _excluded2);
  return React__namespace.createElement(AutoFormFormGroup, _extends({
    label: props.property.displayName,
    labelHint: props.property.labelHint
  }, props.property.formGroupAttributes, {
    fieldId: id,
    isRequired: props.property.required,
    isValid: isValid,
    helperText: helperText,
    helperTextInvalid: helperTextInvalid,
    fieldProps: props,
    renderAfterField: props.renderAfterField
  }), React__namespace.createElement(antd.Select, _extends({}, fieldAttributes, field, {
    className: "AutoForm_field--fullWidth",
    onChange: handleChange,
    "data-testid": id,
    id: id,
    "aria-label": props.property.displayName || props.field.name,
    placeholder: props.property.placeholder,
    disabled: props.form.isSubmitting || props.property.disabled,
    status: isValid === false ? 'error' : undefined,
    value: updatedValue === undefined ? undefined : updatedValue,
    mode: isMultiple ? 'multiple' : undefined,
    options: (props.property["enum"] || []).map(function (opt) {
      return _extends({}, opt, {
        value: opt.value,
        label: opt.label
      });
    })
  })));
};

var _excluded$9 = ["value", "onChange"];
var FormTextAreaComponent = function FormTextAreaComponent(props) {
  var _props$field = props.field,
    value = _props$field.value,
    onChange = _props$field.onChange,
    field = _objectWithoutPropertiesLoose(_props$field, _excluded$9);
  var id = toValidHtmlId(field.name);
  var handleChange = function handleChange(event) {
    if (props.onChangeCustom) {
      props.onChangeCustom(field.name, event.target.value);
    } else {
      onChange(event);
    }
  };
  var _getHelperText = getHelperText(props.field.name, props.property.description, props.form.errors),
    helperText = _getHelperText.helperText,
    helperTextInvalid = _getHelperText.helperTextInvalid;
  var isValid = getValidationState(props);
  return React__namespace.createElement(AutoFormFormGroup, _extends({
    label: props.property.displayName,
    labelHint: props.property.labelHint
  }, props.property.formGroupAttributes, {
    fieldId: id,
    isRequired: props.property.required,
    isValid: isValid,
    helperText: helperText,
    helperTextInvalid: helperTextInvalid
  }), React__namespace.createElement(antd.Input.TextArea, _extends({}, props.property.fieldAttributes, props.field, {
    value: value,
    "data-testid": id,
    id: id,
    "aria-label": props.property.displayName || field.name,
    disabled: props.form.isSubmitting || props.property.disabled,
    onChange: handleChange,
    status: isValid === false ? 'error' : undefined,
    title: props.property.controlHint
  })));
};

var _excluded$8 = ["onChange", "onBlur", "value"];
var FormTypeaheadComponent = function FormTypeaheadComponent(props) {
  var _useState = React.useState(''),
    name = _useState[0],
    setName = _useState[1];
  var inputRef = React__namespace.useRef(null);
  var _props$field = props.field,
    value = _props$field.value,
    field = _objectWithoutPropertiesLoose(_props$field, _excluded$8);
  var id = toValidHtmlId(field.name);
  var handleChange = function handleChange(currentValue) {
    if (props.onChangeCustom) {
      return props.onChangeCustom(field.name, currentValue);
    }
    props.form.setFieldValue(props.field.name, currentValue);
  };
  var onNameChange = function onNameChange(event) {
    setName(event.target.value);
  };
  var addItem = function addItem(event) {
    event.preventDefault();
    if (!(props.property["enum"] || []).some(function (v) {
      return v.value === name;
    }) && name) {
      handleChange(name);
      setName('');
      setTimeout(function () {
        var _inputRef$current;
        (_inputRef$current = inputRef.current) == null ? void 0 : _inputRef$current.focus();
      }, 0);
    }
  };
  var _getHelperText = getHelperText(props.field.name, props.property.description, props.form.errors),
    helperText = _getHelperText.helperText,
    helperTextInvalid = _getHelperText.helperTextInvalid;
  var isValid = getValidationState(props);
  return React__namespace.createElement(AutoFormFormGroup, _extends({
    label: props.property.displayName,
    labelHint: props.property.labelHint
  }, props.property.formGroupAttributes, {
    fieldId: id,
    isRequired: props.property.required,
    isValid: isValid,
    helperText: helperText,
    helperTextInvalid: helperTextInvalid
  }), React__namespace.createElement(antd.Select, _extends({}, props.property.fieldAttributes, field, {
    className: "AutoForm_field--fullWidth",
    onChange: handleChange,
    "data-testid": id,
    value: value,
    id: id,
    "aria-label": props.property.displayName || props.field.name,
    disabled: props.form.isSubmitting || props.property.disabled,
    status: isValid === false ? 'error' : undefined,
    options: (props.property["enum"] || []).map(function (opt) {
      return _extends({}, opt, {
        value: opt.value,
        label: opt.label
      });
    }),
    allowClear: true,
    dropdownRender: function dropdownRender(menu) {
      return React__namespace.createElement(React__namespace.Fragment, null, menu, React__namespace.createElement(antd.Divider, {
        style: {
          margin: '8px 0'
        }
      }), React__namespace.createElement(antd.Space, {
        style: {
          padding: '0 8px 4px'
        }
      }, React__namespace.createElement(antd.Input, {
        placeholder: "Please enter item",
        ref: inputRef,
        value: name,
        onChange: onNameChange
      }), React__namespace.createElement(antd.Button, {
        type: "dashed",
        icon: React__namespace.createElement(icons.PlusOutlined, null),
        onClick: addItem
      }, props.localization.listAddText)));
    }
  })));
};

var _excluded$7 = ["value", "onChange"];
var FormCheckboxComponent = function FormCheckboxComponent(props) {
  var _props$field = props.field,
    value = _props$field.value,
    onChange = _props$field.onChange,
    field = _objectWithoutPropertiesLoose(_props$field, _excluded$7);
  var id = toValidHtmlId(field.name);
  var handleChange = function handleChange(event) {
    if (props.onChangeCustom) {
      props.onChangeCustom(field.name, event.target.checked);
    } else {
      onChange(event);
    }
  };
  return React__namespace.createElement(AutoFormFormGroup, _extends({
    label: props.property.displayNameCheckbox
  }, props.property.formGroupAttributes, {
    fieldId: id,
    isValid: getValidationState(props),
    helperText: props.property.description,
    helperTextInvalid: props.form.errors[props.field.name]
  }), React__namespace.createElement(antd.Checkbox, _extends({}, props.property.fieldAttributes, field, {
    onChange: handleChange,
    "aria-label": props.property.displayName || '',
    checked: value,
    id: id,
    "data-testid": id,
    disabled: props.form.isSubmitting || props.property.disabled
  }), props.property.displayName));
};

var FormHiddenComponent = function FormHiddenComponent(props) {
  return React__namespace.createElement("div", _extends({}, props.property.formGroupAttributes, {
    style: {
      display: 'none'
    }
  }), React__namespace.createElement("input", _extends({}, props.property.fieldAttributes, props.field, {
    type: props.type,
    id: toValidHtmlId(props.field.name),
    "data-testid": toValidHtmlId(props.field.name)
  })), React__namespace.createElement(formik.ErrorMessage, {
    className: "error",
    name: props.field.name
  }));
};

var _excluded$6 = ["value", "onChange"];
var durations = [{
  label: 'Milliseconds',
  value: 1
}, {
  label: 'Seconds',
  value: 1000
}, {
  label: 'Minutes',
  value: 60000
}, {
  label: 'Hours',
  value: 3600000
}, {
  label: 'Days',
  value: 86400000
}];
function calculateDuration(duration, initialValue) {
  return initialValue / duration.value;
}
function calculateValue(duration, value) {
  return value * duration.value;
}
var FormDurationComponent = function FormDurationComponent(props) {
  var _props$property;
  var _props$field = props.field,
    value = _props$field.value,
    field = _objectWithoutPropertiesLoose(_props$field, _excluded$6);
  // find the highest duration that keeps the duration above 1
  var index = durations.findIndex(function (d) {
    return !(value / d.value >= 1.0);
  }) - 1;
  // if the index is invalid than we use the highest available duration.
  var initialDuration = durations[index] || durations[durations.length - 1];
  var _React$useState = React__namespace.useState(initialDuration),
    duration = _React$useState[0],
    setDuration = _React$useState[1];
  var handleSelect = function handleSelect(selectedValue, selectedDuration) {
    var inputValue = calculateDuration(duration, props.field.value);
    setDuration(selectedDuration);
    props.form.setFieldValue(field.name, calculateValue(selectedDuration, inputValue), true);
  };
  var handleChange = function handleChange(event) {
    props.form.setFieldValue(field.name, calculateValue(duration, parseInt(event.target.value, 10)), true);
  };
  var id = toValidHtmlId(field.name);
  var _getHelperText = getHelperText(props.field.name, props.property.description, props.form.errors),
    helperText = _getHelperText.helperText,
    helperTextInvalid = _getHelperText.helperTextInvalid;
  var isValid = getValidationState(props);
  return React__namespace.createElement(AutoFormFormGroup, _extends({
    label: props.property.displayName,
    labelHint: props.property.labelHint
  }, props.property.formGroupAttributes, {
    fieldId: id,
    isRequired: props.property.required,
    isValid: isValid,
    helperText: helperText,
    helperTextInvalid: helperTextInvalid
  }), React__namespace.createElement(antd.Input.Group, {
    compact: true
  }, React__namespace.createElement(antd.Input, _extends({}, props.property.fieldAttributes, {
    "data-testid": id,
    id: id,
    defaultValue: "" + calculateDuration(duration, props.field.value),
    disabled: props.form.isSubmitting || props.property.disabled,
    onChange: handleChange,
    title: props.property.controlHint,
    type: "number",
    min: "0",
    style: _extends({}, (_props$property = props.property) == null || (_props$property = _props$property.fieldAttributes) == null ? void 0 : _props$property.style, {
      width: '70%'
    })
  })), React__namespace.createElement(antd.Select, {
    style: {
      width: '30%'
    },
    disabled: props.form.isSubmitting || props.property.disabled,
    value: duration.value,
    options: durations.map(function (d) {
      return {
        label: d.label,
        value: d.value
      };
    }),
    onSelect: handleSelect
  })));
};

var _excluded$5 = ["value", "onChange"];
var FormDateComponent = function FormDateComponent(props) {
  var _props$field = props.field,
    value = _props$field.value,
    field = _objectWithoutPropertiesLoose(_props$field, _excluded$5);
  var id = toValidHtmlId(field.name);
  var _getHelperText = getHelperText(props.field.name, props.property.description, props.form.errors),
    helperText = _getHelperText.helperText,
    helperTextInvalid = _getHelperText.helperTextInvalid;
  var handleChange = function handleChange(dateValue) {
    props.onChangeCustom(field.name, dateValue ? dateValue.valueOf() : '');
  };
  var isValid = getValidationState(props);
  return React__namespace.createElement(AutoFormFormGroup, _extends({
    label: props.property.displayName,
    labelHint: props.property.labelHint
  }, props.property.formGroupAttributes, {
    fieldId: id,
    isRequired: props.property.required,
    isValid: isValid,
    helperText: helperText,
    helperTextInvalid: helperTextInvalid
  }), React__namespace.createElement(antd.DatePicker, _extends({}, props.property.fieldAttributes, field, {
    className: "AutoForm_field--fullWidth",
    placeholder: props.property.placeholder,
    value: value ? dayjs__default["default"](value) : '',
    "data-testid": id,
    id: id,
    "aria-label": props.property.displayName || field.name,
    disabled: props.form.isSubmitting || props.property.disabled,
    onChange: handleChange,
    status: isValid === false ? 'error' : undefined
  })));
};

var _excluded$4 = ["value", "onChange"];
var FormSwitchComponent = function FormSwitchComponent(props) {
  var _props$field = props.field,
    value = _props$field.value,
    field = _objectWithoutPropertiesLoose(_props$field, _excluded$4);
  var id = toValidHtmlId(field.name);
  var _getHelperText = getHelperText(props.field.name, props.property.description, props.form.errors),
    helperText = _getHelperText.helperText,
    helperTextInvalid = _getHelperText.helperTextInvalid;
  var isValid = getValidationState(props);
  var handleChange = function handleChange(checked) {
    props.onChangeCustom(field.name, checked);
  };
  return React__namespace.createElement(AutoFormFormGroup, _extends({
    label: props.property.displayName,
    labelHint: props.property.labelHint
  }, props.property.formGroupAttributes, {
    fieldId: id,
    isRequired: props.property.required,
    isValid: isValid,
    helperText: helperText,
    helperTextInvalid: helperTextInvalid
  }), React__namespace.createElement(antd.Switch, _extends({}, props.property.fieldAttributes, field, {
    disabled: props.form.isSubmitting || props.property.disabled,
    checked: value,
    "data-testid": id,
    id: id,
    "aria-label": props.property.displayName || field.name,
    onChange: handleChange
  })));
};

var _excluded$3 = ["value", "onChange"];
var FormMultiSelectComponent = function FormMultiSelectComponent(props) {
  var _props$field = props.field,
    value = _props$field.value,
    field = _objectWithoutPropertiesLoose(_props$field, _excluded$3);
  var id = toValidHtmlId(field.name);
  var _getHelperText = getHelperText(props.field.name, props.property.description, props.form.errors),
    helperText = _getHelperText.helperText,
    helperTextInvalid = _getHelperText.helperTextInvalid;
  var isValid = getValidationState(props);
  var handleChange = function handleChange(checked) {
    props.onChangeCustom(field.name, checked);
  };
  return React__namespace.createElement(AutoFormFormGroup, _extends({
    label: props.property.displayName,
    labelHint: props.property.labelHint
  }, props.property.formGroupAttributes, {
    fieldId: id,
    isRequired: props.property.required,
    isValid: getValidationState(props),
    helperText: helperText,
    helperTextInvalid: helperTextInvalid
  }), React__namespace.createElement(antd.Select, _extends({}, props.property.fieldAttributes, field, {
    className: "AutoForm_field--fullWidth",
    value: value,
    mode: "multiple",
    disabled: props.form.isSubmitting || props.property.disabled,
    status: isValid === false ? 'error' : undefined,
    "data-testid": id,
    id: id,
    "aria-label": props.property.displayName || field.name,
    onChange: handleChange
  })));
};

var _excluded$2 = ["value", "onChange"];
var FormCustomComponent = function FormCustomComponent(props) {
  var _props$field = props.field,
    field = _objectWithoutPropertiesLoose(_props$field, _excluded$2);
  var id = toValidHtmlId(field.name);
  var _getHelperText = getHelperText(props.field.name, props.property.description, props.form.errors),
    helperText = _getHelperText.helperText,
    helperTextInvalid = _getHelperText.helperTextInvalid;
  return React__namespace.createElement(AutoFormFormGroup, _extends({
    label: props.property.displayName,
    labelHint: props.property.labelHint
  }, props.property.formGroupAttributes, {
    fieldId: id,
    isRequired: props.property.required,
    isValid: getValidationState(props),
    helperText: helperText,
    helperTextInvalid: helperTextInvalid
  }), props.renderCustomField && props.renderCustomField(props));
};

var FormListComponent = function FormListComponent(props) {
  var field = props.field;
  var value = field.value;
  var enumOptions = props.property["enum"];
  var id = toValidHtmlId(field.name);
  var _React$useState = React__namespace.useState(''),
    inputValue = _React$useState[0],
    setInputValue = _React$useState[1];
  var inputRef = React__namespace.useRef(null);
  var options = React__namespace.useMemo(function () {
    var currentValue = (value || []).filter(function (v) {
      return !(enumOptions || []).some(function (o) {
        if (typeof o === 'string') {
          return v === o;
        }
        return v === o.value;
      });
    });
    return (enumOptions || []).concat(currentValue).map(function (v) {
      return typeof v === 'string' ? {
        label: v,
        value: v
      } : {
        label: v.label || v.value,
        value: v.value
      };
    });
  }, [value, enumOptions]);
  var onChange = function onChange(newValue) {
    if (props.onChangeCustom) {
      props.onChangeCustom(field.name, newValue);
    }
  };
  var onAddItem = function onAddItem(e) {
    e.preventDefault();
    e.stopPropagation();
    if (props.onChangeCustom && inputValue) {
      if (!value.includes(inputValue)) {
        props.onChangeCustom(field.name, (value || []).concat(inputValue));
      }
    }
    setInputValue('');
    setTimeout(function () {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };
  var onInputChange = function onInputChange(event) {
    return setInputValue(event.target.value);
  };
  var _getHelperText = getHelperText(props.field.name, props.property.description, props.form.errors),
    helperText = _getHelperText.helperText,
    helperTextInvalid = _getHelperText.helperTextInvalid;
  var isValid = getValidationState(props);
  return React__namespace.createElement(AutoFormFormGroup, _extends({
    label: props.property.displayName,
    labelHint: props.property.labelHint
  }, props.property.formGroupAttributes, {
    fieldId: id,
    isRequired: props.property.required,
    isValid: isValid,
    helperText: helperText,
    helperTextInvalid: helperTextInvalid
  }), React__namespace.createElement(antd.Select, {
    showSearch: false,
    disabled: props.form.isSubmitting || props.property.disabled,
    value: value || undefined,
    "data-testid": id,
    id: id,
    "aria-label": props.property.displayName || field.name,
    mode: "multiple",
    placeholder: props.property.placeholder,
    className: "AutoForm_field--fullWidth",
    status: isValid === false ? 'error' : undefined,
    onChange: onChange,
    dropdownRender: function dropdownRender(menu) {
      return React__namespace.createElement(React__namespace.Fragment, null, options.length === 0 ? null : menu, React__namespace.createElement(antd.Divider, {
        style: {
          margin: '8px 0'
        }
      }), React__namespace.createElement(antd.Space, {
        style: {
          padding: '0 8px 4px',
          width: '100%'
        }
      }, React__namespace.createElement(antd.Input, {
        placeholder: "...",
        ref: inputRef,
        value: inputValue,
        onChange: onInputChange,
        onPressEnter: onAddItem
      }), React__namespace.createElement(antd.Button, {
        type: "dashed",
        icon: React__namespace.createElement(icons.PlusOutlined, null),
        onClick: onAddItem
      }, props.localization.listAddText)));
    },
    options: options
  }));
};

var AutoFormContextDefaultValue = {
  typemaps: {
    checkbox: FormCheckboxComponent,
    duration: FormDurationComponent,
    files: FormFilesComponent,
    hidden: FormHiddenComponent,
    legend: FormLegendComponent,
    mapset: FormMapsetComponent,
    select: FormSelectComponent,
    textarea: FormTextAreaComponent,
    text: FormInputComponent,
    typeahead: FormTypeaheadComponent,
    date: FormDateComponent,
    "switch": FormSwitchComponent,
    multi: FormMultiSelectComponent,
    custom: FormCustomComponent,
    list: FormListComponent
  }
};
var AutoFormContext = React__namespace.createContext(AutoFormContextDefaultValue);

exports.WhenActionType = void 0;
(function (WhenActionType) {
  WhenActionType["ENABLE"] = "ENABLE";
  WhenActionType["DISABLE"] = "DISABLE";
})(exports.WhenActionType || (exports.WhenActionType = {}));

var updateRelationObserverList = function updateRelationObserverList(relations, actionType, condition, fieldKey) {
  if (condition.id && condition.value) {
    if (relations[condition.id] && relations[condition.id][fieldKey] && relations[condition.id][fieldKey][actionType]) {
      var _Object$assign, _extends2;
      relations[condition.id] = _extends({}, relations[condition.id], (_extends2 = {}, _extends2[fieldKey] = Object.assign(relations[condition.id][fieldKey], (_Object$assign = {}, _Object$assign[actionType] = relations[condition.id][fieldKey][actionType].concat(condition.value), _Object$assign)), _extends2));
    } else {
      var _fieldKey, _extends3;
      relations[condition.id] = _extends({}, relations[condition.id], (_extends3 = {}, _extends3[fieldKey] = (_fieldKey = {}, _fieldKey[actionType] = [condition.value], _fieldKey), _extends3));
    }
  }
  return relations;
};
var syncDefinitionAndFieldsState = function syncDefinitionAndFieldsState(_ref) {
  var relations = _ref.relations,
    mutableInitDefinition = _ref.mutableInitDefinition,
    initDefinition = _ref.initDefinition,
    fieldName = _ref.fieldName,
    fieldValue = _ref.fieldValue,
    setFieldValue = _ref.setFieldValue,
    initialValues = _ref.initialValues;
  Object.keys(relations[fieldName]).forEach(function (linkedFieldName) {
    Object.keys(relations[fieldName][linkedFieldName]).forEach(function (whenActionKey) {
      if (relations[fieldName][linkedFieldName][whenActionKey]) {
        var whenExpression = false;
        relations[fieldName][linkedFieldName][whenActionKey].some(function (whenValue) {
          if (typeof whenValue === 'function') {
            whenExpression = whenValue(fieldValue, initDefinition);
          } else if (whenValue === fieldValue) {
            whenExpression = true;
          }
          return whenExpression;
        });
        if (whenActionKey === exports.WhenActionType.ENABLE ? !whenExpression : whenExpression) {
          if (setFieldValue !== undefined) {
            setFieldValue(linkedFieldName, initialValues ? initialValues[linkedFieldName] : initDefinition[linkedFieldName].defaultValue);
          }
          delete mutableInitDefinition[linkedFieldName];
        } else {
          if (!mutableInitDefinition[linkedFieldName]) {
            mutableInitDefinition[linkedFieldName] = _extends({}, initDefinition[linkedFieldName]);
          }
          if (typeof whenExpression === 'object') {
            mutableInitDefinition[linkedFieldName] = _extends({}, initDefinition[linkedFieldName], whenExpression);
            if (setFieldValue !== undefined && mutableInitDefinition[linkedFieldName]["enum"]) {
              setFieldValue(linkedFieldName, '');
            }
          }
        }
      }
    });
  });
  return mutableInitDefinition;
};
function useDefinitionCompiler(initDefinition, initialValue) {
  var _React$useState = React__namespace.useState({}),
    relationObserver = _React$useState[0],
    setRelationObserver = _React$useState[1];
  var _React$useState2 = React__namespace.useState({}),
    definition = _React$useState2[0],
    setDefinition = _React$useState2[1];
  var prev = React__namespace.useRef({
    initDefinition: null,
    initialValue: null
  });
  React__namespace.useEffect(function () {
    if (!lodash.isEqual(prev.current.initDefinition, initDefinition) || !lodash.isEqual(prev.current.initialValue, initialValue)) {
      prev.current.initDefinition = initDefinition;
      prev.current.initialValue = initialValue;
      var relations = {};
      Object.entries(initDefinition).forEach(function (_ref2) {
        var fieldKey = _ref2[0],
          fieldValue = _ref2[1];
        if (Array.isArray(fieldValue.relation)) {
          fieldValue.relation.forEach(function (relation) {
            if (relation.action !== undefined && Array.isArray(relation.when) && relation.when.length) {
              relation.when.forEach(function (condition) {
                updateRelationObserverList(relations, relation.action, condition, fieldKey);
              });
            }
          });
        }
      });
      setRelationObserver(relations);
      var newDefinition = _extends({}, initDefinition);
      Object.keys(relations).forEach(function (key) {
        syncDefinitionAndFieldsState({
          fieldName: key,
          fieldValue: (initialValue || {})[key] || initDefinition[key].defaultValue,
          initDefinition: initDefinition,
          mutableInitDefinition: newDefinition,
          relations: relations
        });
      });
      setDefinition(newDefinition);
    }
  }, [initDefinition, initialValue]);
  var checkRelationsOnChange = function checkRelationsOnChange(_ref3) {
    var name = _ref3.name,
      value = _ref3.value,
      initialValues = _ref3.initialValues,
      setFieldValue = _ref3.setFieldValue;
    if (relationObserver[name] !== undefined) {
      var newDefinition = definition ? _extends({}, definition) : _extends({}, initDefinition);
      syncDefinitionAndFieldsState({
        fieldName: name,
        fieldValue: value,
        initDefinition: initDefinition,
        mutableInitDefinition: newDefinition,
        relations: relationObserver,
        setFieldValue: setFieldValue,
        initialValues: initialValues
      });
      setDefinition(newDefinition);
    }
  };
  return {
    checkRelationsOnChange: checkRelationsOnChange,
    definition: definition
  };
}

var _excluded$1 = ["values", "touched", "dirty", "errors"];
var AutoForm = function AutoForm(props) {
  var _useFormBuilder = useFormBuilder(),
    getField = _useFormBuilder.getField,
    getPropertiesArray = _useFormBuilder.getPropertiesArray,
    getInitialValues = _useFormBuilder.getInitialValues;
  var _useDefinitionCompile = useDefinitionCompiler(props.definition, props.initialValue),
    currentDefinition = _useDefinitionCompile.definition,
    checkRelationsOnChange = _useDefinitionCompile.checkRelationsOnChange;
  var localization = React__namespace.useMemo(function () {
    return _extends({
      listAddText: 'Add',
      fileUploadText: 'Drag a file here or browse to upload'
    }, props.localization);
  }, [props.localization]);
  var propertiesArray = getPropertiesArray(currentDefinition);
  var initialValues = getInitialValues(props.definition, props.initialValue);
  var isInitialValid = typeof props.validateInitial === 'function' ? Object.keys(props.validateInitial(initialValues) || {}).length === 0 : props.isInitialValid || false;
  var handleSave = function handleSave(value, formikBag) {
    try {
      var _temp = function () {
        if (typeof props.onSave === 'function') {
          return Promise.resolve(props.onSave(value, formikBag)).then(function () {});
        }
      }();
      return Promise.resolve(_temp && _temp.then ? _temp.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  var validate = function validate(values) {
    if (props.validate) {
      return props.validate(values, currentDefinition);
    }
    return undefined;
  };
  return React__namespace.createElement(AutoFormContext.Provider, {
    value: {
      typemaps: _extends({}, AutoFormContextDefaultValue.typemaps, props.customComponents)
    }
  }, React__namespace.createElement(formik.Formik, {
    initialValues: initialValues,
    onSubmit: handleSave,
    validateOnMount: isInitialValid,
    validate: validate,
    enableReinitialize: props.enableReinitialize,
    validateOnBlur: props.validateOnBlur,
    validateOnChange: props.validateOnChange,
    innerRef: props.innerRef
  }, function (_ref) {
    var values = _ref.values,
      dirty = _ref.dirty,
      errors = _ref.errors,
      rest = _objectWithoutPropertiesLoose(_ref, _excluded$1);
    var propertyComponents = propertiesArray.map(function (property) {
      var _ref2;
      var err = typeof errors === 'object' ? errors : (_ref2 = {}, _ref2[property.name] = errors, _ref2);
      property.disabled = props.isEditable || property.disabled;
      return getField(_extends({
        allFieldsRequired: props.allFieldsRequired || false,
        errors: err,
        uploadFile: props.uploadFile,
        renderFileName: props.renderFileName,
        renderCustomField: props.renderCustomField,
        renderAfterField: props.renderAfterField,
        onChangeCustom: function onChangeCustom(name, value) {
          if (values[name] !== value) {
            checkRelationsOnChange({
              name: name,
              setFieldValue: rest.setFieldValue,
              value: value,
              initialValues: initialValues
            });
          }
          rest.setFieldValue(name, value);
        },
        localization: localization,
        property: property,
        value: (values || {})[property.name]
      }, rest));
    });
    return props.children(_extends({}, rest, {
      dirty: dirty,
      errors: errors,
      fields: React__namespace.createElement(React__namespace.Fragment, null, props.i18nFieldsStatusText && React__namespace.createElement("p", {
        className: "fields-status-pf",
        dangerouslySetInnerHTML: {
          __html: props.i18nFieldsStatusText
        }
      }), propertyComponents),
      fieldsAsArray: propertyComponents,
      values: values
    }));
  }));
};

var _excluded = ["cols", "extendedProperties", "max", "min", "multiple", "rows", "controlHint", "controlTooltip", "labelHint", "labelTooltip", "autoComplete"];
/**
 * Maps an API map of ConfigurationProperty objects to
 * an autoform IFormDefinition object.  Use on properties
 * objects from backend responses to ensure they're mapped
 * properly
 *
 * @param properties
 */
function toFormDefinition(properties) {
  if (!properties) {
    throw new Error('Undefined value passed to form definition converter');
  }
  var answer = {};
  Object.keys(properties).forEach(function (key) {
    answer[key] = toFormDefinitionProperty(properties[key]);
  });
  return answer;
}
/**
 * Maps an API ConfigurationProperty object to an autoform IFormDefinitionPropertyObject
 *
 * @param property
 */
function toFormDefinitionProperty(property) {
  var cols = property.cols,
    extendedProperties = property.extendedProperties,
    max = property.max,
    min = property.min,
    multiple = property.multiple,
    rows = property.rows,
    controlHint = property.controlHint,
    controlTooltip = property.controlTooltip,
    labelHint = property.labelHint,
    labelTooltip = property.labelTooltip,
    autoComplete = property.autoComplete,
    formDefinitionProperty = _objectWithoutPropertiesLoose(property, _excluded); // needed, ConfigurationProperty is a lie
  return _extends({}, formDefinitionProperty, (typeof extendedProperties === 'string' ? JSON.parse(extendedProperties) : extendedProperties) || {}, {
    controlHint: controlHint || controlTooltip,
    fieldAttributes: {
      autoComplete: autoComplete,
      cols: cols,
      max: max,
      min: min,
      multiple: multiple,
      rows: rows
    },
    labelHint: labelHint || labelTooltip,
    relation: property.relation
  });
}
function anyFieldsRequired(properties) {
  return Object.keys(properties).filter(function (key) {
    return requiredTypeMask(properties[key].type);
  }).filter(function (key) {
    return properties[key].required;
  }).length > 0;
}
function requiredTypeMask(type) {
  switch (type) {
    case 'boolean':
    case 'checkbox':
    case 'hidden':
      return false;
    default:
      return true;
  }
}
function allFieldsRequired(properties) {
  var keys = Object.keys(properties).filter(function (key) {
    return requiredTypeMask(properties[key].type);
  });
  var allRequired = keys.filter(function (key) {
    return properties[key].required;
  });
  if (allRequired.length === 0) {
    return false;
  }
  return keys.length === allRequired.length;
}
function getRequiredStatusText(properties, allRequired, someRequired, noneRequired) {
  if (allFieldsRequired(properties)) {
    return allRequired;
  }
  if (anyFieldsRequired(properties)) {
    return someRequired;
  }
  return noneRequired;
}
/**
 * Evaluates the values according to the given property definition and returns
 * a boolean if the supplied values are valid or not.
 *
 * @param properties
 * @param values
 */
function validateConfiguredProperties(properties, values) {
  if (typeof values === 'undefined') {
    return false;
  }
  var allRequired = Object.keys(properties).filter(function (key) {
    return properties[key].required;
  });
  if (allRequired.length === 0) {
    return true;
  }
  var allRequiredSet = allRequired.map(function (key) {
    return validateRequired(values[key]);
  }).reduce(function (prev, curr) {
    return curr;
  }, false);
  return allRequiredSet;
}
/**
 * Examine the given property and determine if it's set or not,
 * for string values this includes evaluating against ''
 *
 * @param value
 */
function validateRequired(value) {
  if (typeof value === 'undefined') {
    return false;
  }
  if (typeof value === 'string') {
    return value !== '';
  }
  if (Array.isArray(value) && value.length === 0) {
    return false;
  }
  return true;
}
/**
 * Evaluates the given values against the supplied property definition
 * object and returns an IFormErrors map that can be returned to auto-form
 *
 * @param definition
 * @param getErrorString
 * @param values
 */
function validateRequiredProperties(definition, getErrorString, values, prefix) {
  if (prefix === void 0) {
    prefix = '';
  }
  var allRequired = Object.keys(definition).filter(function (key) {
    return requiredTypeMask(definition[key].type);
  }).filter(function (key) {
    return definition[key].required;
  });
  if (allRequired.length === 0) {
    return {};
  }
  var sanitizedValues = values || {};
  var validationResults = allRequired.map(function (key) {
    return {
      key: key,
      defined: validateRequired(sanitizedValues[key])
    };
  }).reduce(function (acc, current) {
    if (!current.defined) {
      acc["" + prefix + current.key] = getErrorString(definition[current.key].displayName || current.key);
    }
    return acc;
  }, {});
  var arrayValidationResults = allRequired.filter(function (key) {
    return definition[key].type === 'array';
  }).reduce(function (acc, current) {
    var arrayValue = sanitizedValues[current] || [];
    var arrayDefinition = definition[current].arrayDefinition;
    var result = arrayValue.map(function (value, index) {
      return validateRequiredProperties(arrayDefinition, getErrorString, value, current + "[" + index + "].");
    }).reduce(function (accInner, currentInner) {
      return _extends({}, accInner, currentInner);
    }, {});
    return _extends({}, acc, result);
  }, {});
  return _extends({}, validationResults, arrayValidationResults);
}
/**
 * Stringifies non-complex types in a property map
 *
 * @param values
 */
function coerceFormValues(values) {
  var updated = {};
  Object.keys(values).forEach(function (key) {
    updated[key] = typeof values[key] === 'object' ? JSON.stringify(values[key]) : values[key];
  });
  return updated;
}
var getAutocompleteAttr = function getAutocompleteAttr(_ref) {
  var secret = _ref.secret;
  if (secret === true) {
    return 'new-password';
  }
  return undefined;
};

var getLabeledValues = function getLabeledValues(definition, initialValue) {
  return Object.keys(definition).reduce(function (acc, key) {
    acc[key] = definition[key];
    if (acc[key]["enum"]) {
      acc[key].labelValue = (acc[key]["enum"].find(function (e) {
        return initialValue[key] === e.value;
      }) || {}).label || initialValue[key];
      return acc;
    }
    acc[key].labelValue = initialValue[key];
    return acc;
  }, {});
};
var useDefinitionLabledValues = function useDefinitionLabledValues(definition, initialValue) {
  var _useDefinitionCompile = useDefinitionCompiler(definition, initialValue),
    currentDefinition = _useDefinitionCompile.definition;
  return getLabeledValues(currentDefinition, initialValue);
};

exports.AutoForm = AutoForm;
exports.Form = Form;
exports.FormArrayComponent = FormArrayComponent;
exports.FormCheckboxComponent = FormCheckboxComponent;
exports.FormCustomComponent = FormCustomComponent;
exports.FormDateComponent = FormDateComponent;
exports.FormDurationComponent = FormDurationComponent;
exports.FormFilesComponent = FormFilesComponent;
exports.FormHiddenComponent = FormHiddenComponent;
exports.FormInputComponent = FormInputComponent;
exports.FormLegendComponent = FormLegendComponent;
exports.FormListComponent = FormListComponent;
exports.FormMapsetComponent = FormMapsetComponent;
exports.FormMultiSelectComponent = FormMultiSelectComponent;
exports.FormSelectComponent = FormSelectComponent;
exports.FormSwitchComponent = FormSwitchComponent;
exports.FormTextAreaComponent = FormTextAreaComponent;
exports.FormTypeaheadComponent = FormTypeaheadComponent;
exports.allFieldsRequired = allFieldsRequired;
exports.anyFieldsRequired = anyFieldsRequired;
exports.check = check;
exports.coerceFormValues = coerceFormValues;
exports.enrichAndOrderProperties = enrichAndOrderProperties;
exports.getAutocompleteAttr = getAutocompleteAttr;
exports.getErrorText = getErrorText;
exports.getHelperText = getHelperText;
exports.getNewArrayRow = getNewArrayRow;
exports.getNewArrayRows = getNewArrayRows;
exports.getRequiredStatusText = getRequiredStatusText;
exports.getValidationState = getValidationState;
exports.massageRequired = massageRequired;
exports.massageType = massageType;
exports.massageValue = massageValue;
exports.renderFileName = renderFileName;
exports.sanitizeInitialArrayValue = sanitizeInitialArrayValue;
exports.sanitizeValues = sanitizeValues;
exports.toFormDefinition = toFormDefinition;
exports.toFormDefinitionProperty = toFormDefinitionProperty;
exports.toValidHtmlId = toValidHtmlId;
exports.useDefinitionLabledValues = useDefinitionLabledValues;
exports.validateConfiguredProperties = validateConfiguredProperties;
exports.validateRequiredProperties = validateRequiredProperties;
//# sourceMappingURL=auto-form.js.map
