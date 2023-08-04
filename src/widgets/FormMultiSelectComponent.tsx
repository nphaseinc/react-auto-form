import { Select } from 'antd';
import * as React from 'react';
import { IFormControlProps } from '../models';
import { getHelperText, getValidationState, toValidHtmlId } from './helpers';
import { AutoFormFormGroup } from 'src/components';

export const FormMultiSelectComponent: React.FunctionComponent<IFormControlProps> = props => {
  const { value, onChange, ...field } = props.field;
  const id = toValidHtmlId(field.name);

  const { helperText, helperTextInvalid } = getHelperText(
    props.field.name,
    props.property.description,
    props.form.errors
  );

  const isValid = getValidationState(props);

  const handleChange = (checked: boolean) => {
    props.onChangeCustom!(field.name, checked);
  };

  return (
    <AutoFormFormGroup
      label={props.property.displayName}
      labelHint={props.property.labelHint}
      {...props.property.formGroupAttributes}
      fieldId={id}
      isRequired={props.property.required}
      isValid={getValidationState(props)}
      helperText={helperText}
      helperTextInvalid={helperTextInvalid}
    >
      <Select
        {...props.property.fieldAttributes}
        {...field}
        className="AutoForm_field--fullWidth"
        value={value}
        mode="multiple"
        disabled={props.form.isSubmitting || props.property.disabled}
        status={isValid === false ? 'error' : undefined}
        data-testid={id}
        id={id}
        aria-label={props.property.displayName || field.name}
        onChange={handleChange}
      />
    </AutoFormFormGroup>
  );
};
