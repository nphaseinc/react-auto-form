import { Switch } from 'antd';
import * as React from 'react';
import { IFormControlProps } from '../models';
import { getHelperText, getValidationState, toValidHtmlId } from './helpers';
import { AutoFormFormGroup } from 'src/components';

export const FormSwitchComponent: React.FunctionComponent<IFormControlProps> = props => {
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
      isValid={isValid}
      helperText={helperText}
      helperTextInvalid={helperTextInvalid}
    >
      <Switch
        {...props.property.fieldAttributes}
        {...field}
        disabled={props.form.isSubmitting || props.property.disabled}
        checked={value}
        data-testid={id}
        id={id}
        aria-label={props.property.displayName || field.name}
        onChange={handleChange}
      />
    </AutoFormFormGroup>
  );
};
