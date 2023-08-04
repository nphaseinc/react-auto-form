import * as React from 'react';
import {
  IFormControlProps,
  IFormDefinitionProperty,
  IMapsetKey,
  IMapsetOptions,
} from '../models';
import { useFormBuilder } from '../useFormBuilder';
import { getHelperText, getValidationState, toValidHtmlId } from './helpers';
import { AutoFormFormGroup } from 'src/components';
import { Collapse } from 'antd';
import './FormMapsetComponent.css';

export const FormMapsetComponent: React.FunctionComponent<IFormControlProps> = props => {
  const { getField } = useFormBuilder();
  const { value, onChange, onBlur, ...field } = props.field;
  const mapsetValue =
    (typeof value === 'string' ? JSON.parse(value) : value) || {};
  const id = toValidHtmlId(field.name);
  const mapsetOptions = props.property.mapsetOptions || ({} as IMapsetOptions);
  const mapsetValueDefinition = {
    ...(props.property.mapsetValueDefinition ||
      ({} as IFormDefinitionProperty)),
  };
  const mapsetKeys = props.property.mapsetKeys || ([] as IMapsetKey[]);

  const isValid = getValidationState(props);

  const { helperText, helperTextInvalid } = getHelperText(
    props.field.name,
    props.property.description,
    props.form.errors
  );

  return (
    <>
      <AutoFormFormGroup
        {...props.property.formGroupAttributes}
        label={props.property.displayName}
        labelHint={props.property.labelHint}
        fieldId={id}
        isValid={isValid}
        isRequired={props.property.required}
        helperText={helperText}
        helperTextInvalid={helperTextInvalid}
      >
        <Collapse
          className={
            isValid === false ? 'AutoForm_FormMapset-collapse--error' : ''
          }
        >
          <Collapse.Panel
            key="1"
            header={
              <AutoFormFormGroup
                fieldId={`${id}-mapset-header`}
                label={mapsetOptions.i18nKeyColumnTitle}
              >
                {mapsetOptions.i18nValueColumnTitle}
              </AutoFormFormGroup>
            }
          >
            {mapsetKeys
              .sort((a, b) => a.displayName.localeCompare(b.displayName))
              .map(mapsetKey =>
                getField({
                  allFieldsRequired: false,
                  property: {
                    ...mapsetValueDefinition,
                    name: `${field.name}.${mapsetKey.name}`,
                    displayName: mapsetKey.displayName,
                  },
                  value: mapsetValue[mapsetKey.name],
                })
              )}
          </Collapse.Panel>
        </Collapse>
      </AutoFormFormGroup>
    </>
  );
};
