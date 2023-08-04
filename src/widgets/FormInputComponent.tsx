import { Input } from 'antd';
import * as React from 'react';
import { IFormControlProps } from '../models';
import { getHelperText, getValidationState, toValidHtmlId } from './helpers';
import { AutoFormFormGroup } from 'src/components';

export const FormInputComponent: React.FunctionComponent<IFormControlProps> = props => {
  const { value, onChange, ...field } = props.field;
  const id = toValidHtmlId(field.name);
  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (props.onChangeCustom) {
      props.onChangeCustom(field.name, event.currentTarget.value);
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
  let CurrentInput: typeof Input | typeof Input.Password = Input;
  if (props.property.secret) {
    CurrentInput = Input.Password;
  }

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
      <CurrentInput
        {...props.property.fieldAttributes}
        {...field}
        value={value}
        data-testid={id}
        id={id}
        aria-label={props.property.displayName || field.name}
        disabled={props.form.isSubmitting || props.property.disabled}
        placeholder={props.property.placeholder}
        type={props.type}
        onChange={handleChange}
        title={props.property.controlHint}
        list={`${id}-list`}
        status={isValid === false ? 'error' : undefined}
      />
      {props.property.dataList && props.property.dataList.length > 0 && (
        <datalist id={`${id}-list`}>
          {props.property.dataList.map((opt, index) => (
            <option key={index} value={opt}>
              {opt}
            </option>
          ))}
        </datalist>
      )}
    </AutoFormFormGroup>
  );
};
