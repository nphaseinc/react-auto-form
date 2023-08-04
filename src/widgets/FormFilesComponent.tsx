import * as React from 'react';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { IFormFilesControlProps } from '../models';
import { getHelperText, getValidationState, toValidHtmlId } from './helpers';
import { AutoFormFormGroup } from 'src/components';
import { Button, Input, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import classNames from 'classnames';
import './FormFilesComponent.css';

export const FormFilesComponent: React.FunctionComponent<IFormFilesControlProps> = props => {
  const { value, onChange, ...field } = props.field;
  const id = toValidHtmlId(field.name);

  const triggerChange = async (file: RcFile | string, filename: string) => {
    if (!props.uploadFile) {
      throw new Error('"uploadFile" function should be declared!');
    }
    if (!props.onChangeCustom) {
      throw new Error('"onChangeCustom" function should be declared!');
    }

    const currentValue =
      (await props.uploadFile({
        filename,
        file: file as RcFile,
        fieldName: field.name,
      })) || '';
    props.onChangeCustom(field.name, currentValue);

    return false;
  };

  const handleChange = (file: RcFile) => triggerChange(file, file.name);
  const handleClear = () => triggerChange('', '');

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
      <Input.Group
        className={classNames(
          'AutoForm_FormFilesComponent',
          !!value && 'AutoForm_FormFilesComponent--withValue'
        )}
        compact
      >
        {!!value && (
          <>
            <Input
              tabIndex={-1}
              disabled
              value={value}
              className="AutoForm_FormFilesComponent-input"
              status={isValid === false ? 'error' : undefined}
            />
            <Button
              disabled={props.form.isSubmitting || props.property.disabled}
              className="AutoForm_FormFilesComponent-button"
              children={<DeleteOutlined />}
              onClick={handleClear}
            />
          </>
        )}
        <Upload.Dragger
          {...props.property.fieldAttributes}
          {...field}
          data-testid={id}
          id={id}
          maxCount={1}
          fileList={[]}
          beforeUpload={handleChange}
          aria-label={props.property.displayName || field.name}
          disabled={props.form.isSubmitting || props.property.disabled}
          className="AutoForm_FormFilesComponent-dragger"
        >
          <UploadOutlined /> {!value && props.localization.fileUploadText}
        </Upload.Dragger>
      </Input.Group>
    </AutoFormFormGroup>
  );
};
