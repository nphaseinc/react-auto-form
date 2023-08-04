import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import * as React from 'react';
import { AutoFormFormGroup } from 'src/components';
import { IFormControlProps } from '../models';
import { getValidationState, toValidHtmlId } from './helpers';

export const FormCheckboxComponent: React.FunctionComponent<IFormControlProps> = props => {
  const { value, onChange, ...field } = props.field;
  const id = toValidHtmlId(field.name);
  const handleChange = (event: CheckboxChangeEvent) => {
    if (props.onChangeCustom) {
      props.onChangeCustom(field.name, event.target.checked);
    } else {
      onChange(event);
    }
  };
  return (
    <AutoFormFormGroup
      label={props.property.displayNameCheckbox}
      {...props.property.formGroupAttributes}
      fieldId={id}
      isValid={getValidationState(props)}
      helperText={props.property.description}
      helperTextInvalid={props.form.errors[props.field.name]}
    >
      <Checkbox
        {...props.property.fieldAttributes}
        {...field}
        onChange={handleChange}
        aria-label={props.property.displayName || ''}
        checked={value}
        id={id}
        data-testid={id}
        disabled={props.form.isSubmitting || props.property.disabled}
      >
        {props.property.displayName}
      </Checkbox>
    </AutoFormFormGroup>
  );
};
