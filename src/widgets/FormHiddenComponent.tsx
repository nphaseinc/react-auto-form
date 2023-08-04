import * as React from 'react';
import { IFormControlProps } from '../models';
import { toValidHtmlId } from './helpers';
import { ErrorMessage } from 'formik';

export const FormHiddenComponent: React.FunctionComponent<IFormControlProps> = props => (
  <div {...props.property.formGroupAttributes} style={{ display: 'none' }}>
    <input
      {...props.property.fieldAttributes}
      {...props.field}
      type={props.type}
      id={toValidHtmlId(props.field.name)}
      data-testid={toValidHtmlId(props.field.name)}
    />
    <ErrorMessage className="error" name={props.field.name} />
  </div>
);
