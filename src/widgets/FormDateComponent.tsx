import { DatePicker, DatePickerProps } from 'antd';
import dayjs from 'dayjs';
import * as React from 'react';
import { IFormControlProps } from '../models';
import { getHelperText, getValidationState, toValidHtmlId } from './helpers';
import { AutoFormFormGroup } from 'src/components';

export const FormDateComponent: React.FunctionComponent<IFormControlProps> = props => {
  const { value, onChange, ...field } = props.field;
  const id = toValidHtmlId(field.name);

  const { helperText, helperTextInvalid } = getHelperText(
    props.field.name,
    props.property.description,
    props.form.errors
  );

  const handleChange = (dateValue: DatePickerProps['value']) => {
    props.onChangeCustom!(field.name, dateValue ? dateValue.valueOf() : '');
  };

  const isValid = getValidationState(props);

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
    >
      <DatePicker
        {...props.property.fieldAttributes}
        {...field}
        className="AutoForm_field--fullWidth"
        placeholder={props.property.placeholder}
        value={(value ? dayjs(value) : '') as any}
        data-testid={id}
        id={id}
        aria-label={props.property.displayName || field.name}
        disabled={props.form.isSubmitting || props.property.disabled}
        onChange={handleChange}
        status={isValid === false ? 'error' : undefined}
      />
    </AutoFormFormGroup>
  );
};
