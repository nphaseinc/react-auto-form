import * as React from 'react';
import { AutoFormFormGroup } from 'src/components';
import { IFormControlProps } from '../models';
import { getHelperText, getValidationState, toValidHtmlId } from './helpers';

export const FormCustomComponent: React.FunctionComponent<IFormControlProps> = props => {
  const { value, onChange, ...field } = props.field;
  const id = toValidHtmlId(field.name);
  const { helperText, helperTextInvalid } = getHelperText(
    props.field.name,
    props.property.description,
    props.form.errors
  );

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
      {props.renderCustomField && props.renderCustomField(props)}
    </AutoFormFormGroup>
  );
};
