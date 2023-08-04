import React from 'react';
import './AutoFormFormGroup.css';
import { AutoFormDirection } from '../Form/Form';
import { AutoFormRenderAfterField, IFormControlProps } from 'src/models';
import { FormikErrors } from 'formik';
export interface IAutoFormFormGroupProps extends Omit<React.HTMLProps<HTMLDivElement>, 'label'> {
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
interface IAutoFormFormGroupBodyProps extends Omit<React.HTMLProps<HTMLDivElement>, 'label'> {
    className?: string;
    direction: AutoFormDirection;
}
export declare const FormGroupHelperText: React.FC<{
    children: React.ReactNode;
    className: string | false;
    fieldId: string;
}>;
export declare const AutoFormFormGroupBody: React.FC<IAutoFormFormGroupBodyProps>;
export declare const AutoFormFormGroup: React.FC<IAutoFormFormGroupProps>;
export {};
