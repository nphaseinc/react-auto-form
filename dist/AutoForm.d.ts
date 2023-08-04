import { FormikErrors, FormikProps, FormikValues } from 'formik';
import * as React from 'react';
import { AutoFormRenderAfterField, IAutoFormActions, IAutoFormLocalization, IFormControlProps, IFormDefinition, IFormErrors, IUploadFileProps } from './models';
import './AutoForm.css';
export interface IAutoFormProps<Values> {
    /**
     * A map of configuration properties as returned by the Syndesis API
     */
    definition: IFormDefinition;
    /**
     * The initial value that should be set on the form
     */
    initialValue?: Values;
    /**
     * If the passed in value is valid or not
     */
    isInitialValid?: boolean;
    /**
     * If all fields in the form are required or not
     */
    allFieldsRequired?: boolean;
    /**
     * Map of custom components, each key maps to the 'type'
     * property of an IFormDefinitionProperty
     */
    customComponents?: {
        [type: string]: any;
    };
    /**
     * String to be displayed when a required field isn't set
     */
    i18nRequiredProperty: string;
    /**
     * String to be displayed when some or all properties are required
     */
    i18nFieldsStatusText?: string;
    isEditable?: boolean;
    /**
     * Callback function that will be called when the form is submitted
     */
    onSave?: (value: Values, autoFormBag: IAutoFormActions<Values>) => void;
    /**
     * Validation function called whenever a change or blur event occurs on the form
     */
    validate?: (value: Values, currentDefinition: IFormDefinition) => IFormErrors<Values> | Promise<IFormErrors<Values>> | undefined;
    /**
     * Validation function called to determine if the initial values are valid
     */
    validateInitial?: (value: Values) => IFormErrors<Values>;
    /**
     * Child component that will receive the form fields and submit handler
     */
    children: (props: IAutoFormChildrenProps<Values> & FormikProps<Values>) => any;
    enableReinitialize?: boolean;
    validateOnBlur?: boolean;
    validateOnChange?: boolean;
    uploadFile?: (field: IUploadFileProps) => Promise<string | undefined | void>;
    renderFileName?: (value: string) => string;
    renderCustomField?: IFormControlProps['renderCustomField'];
    renderAfterField?: AutoFormRenderAfterField;
    localization?: IAutoFormLocalization;
}
export interface IAutoFormChildrenProps<Values> {
    /**
     * Fragment containing all of the form fields
     */
    fields: JSX.Element;
    /**
     * The same fields as an array of separate elements
     */
    fieldsAsArray: JSX.Element[];
    /**
     * Function to trigger a form submit which will then trigger onSave
     */
    validateForm: () => Promise<IFormErrors<Values> | FormikErrors<Values>>;
}
export declare const AutoForm: <Values extends FormikValues>(props: IAutoFormProps<Values>) => React.ReactElement;
