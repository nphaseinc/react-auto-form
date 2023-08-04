import * as React from 'react';
import { Input } from 'antd';
import { AutoFormFormGroup } from 'src/components';
import { IFormControlProps } from '../models';
import { getHelperText, getValidationState, toValidHtmlId } from './helpers';

export const FormTextAreaComponent: React.FunctionComponent<IFormControlProps> = props => {
  const { value, onChange, ...field } = props.field;
  const id = toValidHtmlId(field.name);
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (props.onChangeCustom) {
      props.onChangeCustom(field.name, event.target.value);
    } else {
      onChange(event);
    }
  };
  const { helperText, helperTextInvalid } = getHelperText(
    props.field.name,
    props.property.description,
    props.form.errors
  );
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
      <Input.TextArea
        {...props.property.fieldAttributes}
        {...props.field}
        value={value}
        data-testid={id}
        id={id}
        aria-label={props.property.displayName || field.name}
        disabled={props.form.isSubmitting || props.property.disabled}
        onChange={handleChange}
        status={isValid === false ? 'error' : undefined}
        title={props.property.controlHint}
      />
    </AutoFormFormGroup>
  );
};
