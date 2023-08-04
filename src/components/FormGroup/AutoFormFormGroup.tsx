import React, { useContext } from 'react';
import classNames from 'classnames';
import { FormContext } from '../Form';
import './AutoFormFormGroup.css';
import { AutoFormDirection } from '../Form/Form';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { AutoFormRenderAfterField, IFormControlProps } from 'src/models';
import { FormikErrors } from 'formik';

export interface IAutoFormFormGroupProps
  extends Omit<React.HTMLProps<HTMLDivElement>, 'label'> {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
  labelHint?: React.ReactNode;
  isRequired?: boolean;
  isValid?: boolean;
  validated?: 'success' | 'error' | 'default';
  isInline?: boolean;
  helperText?: React.ReactNode;
  helperTextInvalid?: React.ReactNode | FormikErrors<any> | Array<FormikErrors<any>>;
  fieldId: string;
  fieldProps?: IFormControlProps;
  renderAfterField?: AutoFormRenderAfterField;
}

interface IAutoFormFormGroupBodyProps
  extends Omit<React.HTMLProps<HTMLDivElement>, 'label'> {
  className?: string;
  direction: AutoFormDirection;
}

export const FormGroupHelperText: React.FC<{
  children: React.ReactNode;
  className: string | false;
  fieldId: string;
}> = ({ fieldId, className, children }) => (
  <div
    className={classNames('AutoForm_FormGroup-helperText', className)}
    id={`${fieldId}-helper`}
    aria-live="polite"
  >
    {children}
  </div>
);

export const AutoFormFormGroupBody: React.FC<IAutoFormFormGroupBodyProps> = ({
  className,
  direction,
  ...props
}) => (
  <div
    {...props}
    className={classNames(
      'AutoForm_FormGroup',
      `AutoForm_FormGroup--${direction}`,
      className
    )}
  />
);

export const AutoFormFormGroup: React.FC<IAutoFormFormGroupProps> = ({
  validated,
  isValid,
  fieldId,
  helperText,
  helperTextInvalid,
  isInline,
  label,
  labelHint,
  isRequired,
  className,
  children,
  fieldProps,
  renderAfterField,
  ...props
}) => {
  const { direction } = useContext(FormContext);

  const renderHelperText = helperText && (
    <FormGroupHelperText
      fieldId={fieldId}
      className={
        validated === 'success' && 'AutoForm_FormGroup-helperText--success'
      }
      children={helperText}
    />
  );

  const renderHelperInvalid = helperTextInvalid &&
    (validated === 'error' || isValid === false) && (
      <FormGroupHelperText
        fieldId={fieldId}
        className="AutoForm_FormGroup-helperText--error"
      >
        <>{helperTextInvalid}</>
      </FormGroupHelperText>
    );

  return (
    <AutoFormFormGroupBody
      {...props}
      direction={direction || 'horizontal'}
      className={classNames(
        (renderHelperInvalid || renderHelperText) &&
          'AutoForm_FormGroup--disableMargin',
        className
      )}
    >
      {label && (
        <label className="AutoForm_FormGroup-formLabel" htmlFor={fieldId}>
          <span>
            <span className="AutoForm_FormGroup-formLabel__text">
              {label}{' '}
              {isRequired && (
                <span
                  className="AutoForm_FormGroup-formLabel__required"
                  aria-hidden="true"
                >
                  *
                </span>
              )}
              {labelHint && (
                <Tooltip aria-label={labelHint} title={labelHint}>
                  &nbsp;
                  <QuestionCircleOutlined data-testid="tooltip" />
                </Tooltip>
              )}
            </span>
          </span>
        </label>
      )}
      <div className="AutoForm_FormGroup-content">
        {children}
        {renderAfterField && renderAfterField(fieldProps!)}
      </div>
      {renderHelperInvalid || renderHelperText}
    </AutoFormFormGroupBody>
  );
};
