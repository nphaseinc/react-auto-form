/**
 * This is essentially SelectComponent.tsx except for the typeahead feature
 * of PF.
 * TODO: Allow customization of options, such as isCreatable.
 */

import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, InputRef, Select, Space } from 'antd';
import * as React from 'react';
import { useState } from 'react';
import { AutoFormFormGroup } from 'src/components';
import { IFormControlProps } from '../models';
import { getHelperText, getValidationState, toValidHtmlId } from './helpers';

export const FormTypeaheadComponent: React.FunctionComponent<IFormControlProps> = props => {
  const [name, setName] = useState('');
  const inputRef = React.useRef<InputRef>(null);

  const { onChange, onBlur, value, ...field } = props.field;
  const id = toValidHtmlId(field.name);

  const handleChange = (currentValue: string | string[]) => {
    if (props.onChangeCustom) {
      return props.onChangeCustom(field.name, currentValue);
    }
    props.form.setFieldValue(props.field.name, currentValue);
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (!(props.property.enum || []).some(v => v.value === name) && name) {
      handleChange(name);
      setName('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
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
      <Select
        {...props.property.fieldAttributes}
        {...field}
        className="AutoForm_field--fullWidth"
        onChange={handleChange}
        data-testid={id}
        value={value}
        id={id}
        aria-label={props.property.displayName || props.field.name}
        disabled={props.form.isSubmitting || props.property.disabled}
        status={isValid === false ? 'error' : undefined}
        options={(props.property.enum || []).map((opt: any) => ({
          ...opt,
          value: opt.value,
          label: opt.label,
        }))}
        allowClear
        dropdownRender={menu => (
          <>
            {menu}
            <Divider style={{ margin: '8px 0' }} />
            <Space style={{ padding: '0 8px 4px' }}>
              <Input
                placeholder="Please enter item"
                ref={inputRef}
                value={name}
                onChange={onNameChange}
              />
              <Button type="dashed" icon={<PlusOutlined />} onClick={addItem}>
                {props.localization.listAddText}
              </Button>
            </Space>
          </>
        )}
      />
    </AutoFormFormGroup>
  );
};
