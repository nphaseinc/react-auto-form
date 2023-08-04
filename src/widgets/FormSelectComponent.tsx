import { Select } from 'antd';
import * as React from 'react';
import { IFormControlProps } from '../models';
import { getHelperText, getValidationState, toValidHtmlId } from './helpers';
import { AutoFormFormGroup } from 'src/components';

export const FormSelectComponent: React.FunctionComponent<IFormControlProps> = props => {
  const isMultiple =
    props.property.fieldAttributes && props.property.fieldAttributes.multiple;
  const { onChange, onBlur, value, ...field } = props.field;
  const id = toValidHtmlId(field.name);

  const adjustValue = () => {
    if (isMultiple) {
      let arrayValue = value;
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
        return value?.toString();
      }
      return value;
    }
  };

  const updatedValue = adjustValue();
  const handleChange = (currentValue: string | string[]) => {
    if (props.onChangeCustom) {
      return props.onChangeCustom(field.name, currentValue);
    }
    props.form.setFieldValue(props.field.name, currentValue);
  };

  const { helperText, helperTextInvalid } = getHelperText(
    props.field.name,
    props.property.description || props.property.controlHint,
    props.form.errors
  );
  const isValid = getValidationState(props);
  const {
    allowEmptyValue,
    ...fieldAttributes
  } = props.property.fieldAttributes!;

  return (
    <AutoFormFormGroup
      label={props.property.displayName}
      labelHint={props.property.labelHint}
      {...props.property.formGroupAttributes}
      fieldId={id}
      isRequired={props.property.required}
      isValid={isValid}
      helperText={helperText}
      helperTextInvalid={helperTextInvalid}
      fieldProps={props}
      renderAfterField={props.renderAfterField}
    >
      <Select
        {...fieldAttributes}
        {...field}
        className="AutoForm_field--fullWidth"
        onChange={handleChange}
        data-testid={id}
        id={id}
        aria-label={props.property.displayName || props.field.name}
        placeholder={props.property.placeholder}
        disabled={props.form.isSubmitting || props.property.disabled}
        status={isValid === false ? 'error' : undefined}
        value={updatedValue === undefined ? undefined : updatedValue}
        mode={isMultiple ? 'multiple' : undefined}
        options={(props.property.enum || []).map((opt: any) => ({
          ...opt,
          value: opt.value,
          label: opt.label,
        }))}
      />
    </AutoFormFormGroup>
  );
};
