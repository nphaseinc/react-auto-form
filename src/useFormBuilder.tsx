import { Field, FieldArray } from 'formik';
import * as React from 'react';
import { AutoFormContext } from './AutoFormContext';
import {
  IFormArrayControlProps,
  IFormControlProps,
  IFormDefinition,
  IRenderFieldProps,
} from './models';
import { enrichAndOrderProperties, massageType, sanitizeValues } from './utils';
import { FormArrayComponent, FormInputComponent } from './widgets';

export function useFormBuilder() {
  const autoFormContext = React.useContext(AutoFormContext);
  /**
   * Converts a property configuration to some kind of input field
   *
   * @param props
   */
  const getField = (props: IRenderFieldProps): any => {
    // Massage the value in the definition to an input type
    const type = massageType(props.property);
    const componentTypemaps = autoFormContext.typemaps;
    switch (type) {
      case 'array':
        return (
          <FieldArray
            {...(props as IFormArrayControlProps)}
            key={props.property.name}
            name={props.property.name}
          >
            {(helpers: any) => (
              <FormArrayComponent
                {...(props as IFormControlProps)}
                {...helpers}
              />
            )}
          </FieldArray>
        );
      default:
        return (
          <Field
            key={props.property.name}
            {...(props as IFormControlProps)}
            name={props.property.name}
            disabled={props.property.disabled}
            type={type}
            component={componentTypemaps[type] || FormInputComponent}
          />
        );
    }
  };

  const getPropertiesArray = (definition: IFormDefinition) =>
    enrichAndOrderProperties(definition);

  const getInitialValues = (definition: IFormDefinition, initialValues: any) =>
    sanitizeValues<any>(definition, initialValues);

  return {
    getField,
    getInitialValues,
    getPropertiesArray,
  };
}
