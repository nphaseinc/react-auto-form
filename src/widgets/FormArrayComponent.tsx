import * as React from 'react';
import {
  IFormArrayControlProps,
  IFormArrayDefinitionOptions,
  IFormControlProps,
} from '../models';
import { useFormBuilder } from '../useFormBuilder';
import { getNewArrayRow } from '../utils';
import { toValidHtmlId } from './helpers';
import { AutoFormFormGroupBody } from 'src/components/FormGroup';
import { Button, Divider, List, Space, Typography } from 'antd';
import {
  DeleteOutlined,
  DownOutlined,
  PlusOutlined,
  UpOutlined,
} from '@ant-design/icons';
import './FormArrayComponent.css';
import classNames from 'classnames';

export const FormArrayComponent: React.FunctionComponent<IFormArrayControlProps &
  IFormControlProps> = props => {
  if (typeof props.property.arrayDefinition === 'undefined') {
    return (
      <div className="alert alert-warning">
        <span>No Array definition supplied for array type</span>
      </div>
    );
  }
  const { getField, getPropertiesArray, getInitialValues } = useFormBuilder();
  const definition = props.property.arrayDefinition;
  const options =
    props.property.arrayDefinitionOptions ||
    ({} as IFormArrayDefinitionOptions);
  const formGroupAttributes = options.formGroupAttributes || {};
  const fieldAttributes = options.fieldAttributes || {};
  const controlLabelAttributes = options.controlLabelAttributes || {};
  const arrayControlAttributes = options.arrayControlAttributes || {};
  const arrayRowTitleAttributes = options.arrayRowTitleAttributes || {};
  const minElements = options.minElements || 0;
  const values =
    props.form.values[props.name] || props.property.defaultValue || [];
  const myId = toValidHtmlId(props.name);

  return (
    <AutoFormFormGroupBody direction="vertical" id={myId} data-testid={myId}>
      <List
        className="AutoForm_FormArray"
        dataSource={values}
        rowKey={(item: any) => item.name}
        renderItem={(value, index) => {
          const fieldName = `${props.name}[${index}]`;
          const rowValue = getInitialValues(definition, value);
          const propertiesArray = getPropertiesArray(definition);
          const controlGroupName = `${fieldName}-array-controls`;
          const controlGroupId = toValidHtmlId(`${controlGroupName}-control`);
          return (
            <List.Item className="AutoForm_FormArray-listItem">
              {(!!options.showSortControls || !!options.rowTitle) && (
                <Space
                  direction="horizontal"
                  className="AutoForm_FormArray-listItem-header"
                >
                  <Typography.Text
                    strong
                    {...arrayRowTitleAttributes}
                    children={
                      options.rowTitle
                        ? `${index + 1}. ${options.rowTitle}`
                        : ''
                    }
                  />
                  {options.showSortControls && (
                    <Space
                      {...arrayControlAttributes}
                      key={controlGroupName}
                      direction="horizontal"
                      id={controlGroupId}
                    >
                      {options.showSortControls && (
                        <>
                          <Button
                            shape="circle"
                            size="small"
                            data-testid="condition-move-up"
                            onClick={() => {
                              props.move(index, index - 1);
                            }}
                            disabled={!(index > 0)}
                          >
                            <UpOutlined />
                          </Button>
                          <Button
                            shape="circle"
                            size="small"
                            data-testid="condition-move-down"
                            onClick={() => {
                              props.move(index, index + 1);
                            }}
                            disabled={!(index < values.length - 1)}
                          >
                            <DownOutlined />
                          </Button>
                        </>
                      )}
                      <Button
                        danger
                        shape="circle"
                        size="small"
                        data-testid="condition-delete"
                        onClick={() => props.remove(index)}
                        disabled={!(values.length > minElements)}
                      >
                        <DeleteOutlined />
                      </Button>
                    </Space>
                  )}
                </Space>
              )}
              <Divider className="AutoForm_FormArray-divider" />
              <div
                {...formGroupAttributes}
                className={classNames(
                  'AutoForm_FormArray-fields',
                  formGroupAttributes.className
                )}
              >
                {propertiesArray.map(property => {
                  const propertyFieldName = `${fieldName}.${property.name}`;

                  return getField({
                    allFieldsRequired: props.allFieldsRequired || false,
                    property: {
                      controlLabelAttributes,
                      fieldAttributes,
                      formGroupAttributes,
                      ...property,
                      key: propertyFieldName,
                      name: propertyFieldName,
                    },
                    uploadFile: props.uploadFile,
                    renderFileName: props.renderFileName,
                    renderCustomField: props.renderCustomField,
                    onChangeCustom: props.onChangeCustom,
                    value: rowValue[property.name],
                  });
                })}
              </div>
            </List.Item>
          );
        }}
      />
      <Button
        data-testid="form-array-control-add-another-item-button"
        onClick={() => props.push(getNewArrayRow(definition))}
        type="dashed"
      >
        <PlusOutlined />
        &nbsp;
        {options.i18nAddElementText || 'Add Another'}
      </Button>
    </AutoFormFormGroupBody>
  );
};
