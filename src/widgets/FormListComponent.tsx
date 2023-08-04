import * as React from 'react';
import { IFormControlProps, IFormPropertyValue } from '../models';
import { getHelperText, getValidationState, toValidHtmlId } from './helpers';
import { Button, Divider, Input, InputRef, Select, Space } from 'antd';
import { AutoFormFormGroup } from 'src/components';
import { PlusOutlined } from '@ant-design/icons';

export const FormListComponent: React.FunctionComponent<IFormControlProps> = props => {
  const field = props.field;
  const value: string[] = field.value;
  const enumOptions = props.property.enum;
  const id = toValidHtmlId(field.name);
  const [inputValue, setInputValue] = React.useState('');
  const inputRef = React.useRef<InputRef>(null);
  const options = React.useMemo(() => {
    const currentValue: string[] = (value || []).filter(
      v =>
        !(enumOptions || []).some((o: IFormPropertyValue) => {
          if (typeof o === 'string') {
            return v === o;
          }
          return v === o.value;
        })
    );

    return ((enumOptions as Array<IFormPropertyValue | string>) || [])
      .concat(currentValue)
      .map(v =>
        typeof v === 'string'
          ? { label: v, value: v }
          : { label: v.label || v.value, value: v.value }
      );
  }, [value, enumOptions]);

  const onChange = (newValue: string) => {
    if (props.onChangeCustom) {
      props.onChangeCustom(field.name, newValue);
    }
  };

  const onAddItem = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (props.onChangeCustom && inputValue) {
      if (!value.includes(inputValue)) {
        props.onChangeCustom(field.name, (value || []).concat(inputValue));
      }
    }
    setInputValue('');
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(event.target.value);

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
        showSearch={false}
        disabled={props.form.isSubmitting || props.property.disabled}
        value={(value as any) || undefined}
        data-testid={id}
        id={id}
        aria-label={props.property.displayName || field.name}
        mode="multiple"
        placeholder={props.property.placeholder}
        className="AutoForm_field--fullWidth"
        status={isValid === false ? 'error' : undefined}
        onChange={onChange}
        dropdownRender={menu => (
          <>
            {options.length === 0 ? null : menu}
            <Divider style={{ margin: '8px 0' }} />
            <Space style={{ padding: '0 8px 4px', width: '100%' }}>
              <Input
                placeholder="..."
                ref={inputRef}
                value={inputValue}
                onChange={onInputChange}
                onPressEnter={onAddItem}
              />
              <Button type="dashed" icon={<PlusOutlined />} onClick={onAddItem}>
                {props.localization.listAddText}
              </Button>
            </Space>
          </>
        )}
        options={options}
      />
    </AutoFormFormGroup>
  );
};
