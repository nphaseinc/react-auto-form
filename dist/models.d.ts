import { FieldArrayRenderProps, FieldProps, FormikHelpers as FormikActions } from 'formik';
import { ReactNode } from 'react';
/**
 * The top-level object that makes up a form definition, basically a map of properties
 */
export type IFormDefinition<TFields extends string = string> = Record<TFields, IFormDefinitionProperty>;
export interface IFormValue {
    [name: string]: any;
}
export interface IFormErrors<T> {
    [name: string]: string;
}
export interface IWhen {
    value?: string | ((value: string, currentDefinition: IFormDefinition) => boolean | Record<string, any>);
    id?: string;
}
export declare enum WhenActionType {
    ENABLE = "ENABLE",
    DISABLE = "DISABLE"
}
export interface IFormPropertyRelation {
    when?: IWhen[];
    action?: 'ENABLE' | 'DISABLE';
}
export interface IFormPropertyValue {
    value?: string;
    label?: string;
}
export interface IFormFieldAttributes {
    [name: string]: any;
}
export type IAutoFormActions<T> = FormikActions<T>;
export interface IFormArrayDefinitionOptions {
    fieldAttributes?: IFormFieldAttributes;
    formGroupAttributes?: IFormFieldAttributes;
    arrayControlAttributes?: IFormFieldAttributes;
    arrayRowTitleAttributes?: IFormFieldAttributes;
    controlLabelAttributes?: IFormFieldAttributes;
    minElements?: number;
    showSortControls?: boolean;
    rowTitle?: string;
    i18nAddElementText: string;
}
/**
 * Each item in a form definition is one of these
 */
export interface IFormDefinitionProperty {
    [name: string]: any;
    /**
     * If the 'type' property is set to 'array' then auto-form
     * will look at this field for a form definition object
     * for each row.
     */
    arrayDefinition?: IFormDefinition;
    /**
     * Options object for the generated array
     */
    arrayDefinitionOptions?: IFormArrayDefinitionOptions;
    /**
     * Value to be set on the tooltip shown when the user hovers the mouse over the form control
     */
    controlHint?: string;
    /**
     * When set for a control of type 'text' these values will be available for typeahead completions
     */
    dataList?: string[];
    /**
     * If no value is set in the properties object, then autoform will set the property to this value
     */
    defaultValue?: any;
    /**
     * Sets the help text on the form control, which is the text that typically is shown below the control.
     */
    description?: string;
    /**
     * Whether or not this form control should be rendered disabled
     */
    disabled?: boolean;
    /**
     * Sets the label used for the form control, used as the text for a checkbox
     */
    displayName?: string;
    /**
     * Sets the label on the form group for a checkbox
     */
    displayNameCheckbox?: string;
    /**
     * The available values to be used for either a control of type 'select' or 'text', in the latter case auto-form will present a select control
     */
    enum?: IFormPropertyValue[];
    /**
     * placeholder
     */
    extendedOptions?: {
        [name: string]: any;
    };
    /**
     * Extra attributes to set on the form field
     */
    fieldAttributes?: IFormFieldAttributes;
    /**
     * Extra attributes to set on the form group wrapper
     */
    formGroupAttributes?: IFormFieldAttributes;
    /**
     * When set a ? icon will be presented to the user, this content will be shown when the user clicks on the ? icon
     */
    labelHint?: string;
    mapsetKeys?: IMapsetKey[];
    mapsetValueDefinition?: IFormDefinitionProperty;
    mapsetOptions?: IMapsetOptions;
    /**
     * Controls the order in which controls are laid out by auto-form, lower numbers mean higher priority
     */
    order?: number;
    /**
     * Sets the "placeholder" property for the form control
     */
    placeholder?: string;
    /**
     * For future usage
     */
    relation?: IFormPropertyRelation[];
    /**
     * Whether or not this property is required to have a value
     */
    required?: boolean;
    /**
     * When true a password field is rendered by auto-form instead of a plain text input box
     */
    secret?: boolean;
    /**
     * Sets the type of this form control.
     */
    type: string;
}
export interface IMapsetKey {
    displayName: string;
    name: string;
}
export interface IMapsetOptions {
    i18nKeyColumnTitle: string;
    i18nValueColumnTitle: string;
}
export interface INamedConfigurationProperty extends IFormDefinitionProperty {
    name: string;
}
export interface IUploadFileProps {
    filename: string;
    file?: File;
    fieldName: string;
}
export interface IRenderFieldProps {
    [name: string]: any;
    allFieldsRequired: boolean;
    property: INamedConfigurationProperty;
    value: any;
    onChangeCustom?: (name: string, value: any) => void;
    uploadFile?: (field: IUploadFileProps) => Promise<string | undefined | void>;
    renderAfterField?: AutoFormRenderAfterField;
    renderFileName?: (value: string) => string;
    renderCustomField?: IFormControlProps['renderCustomField'];
}
export interface IFormControlProps<T = any> extends FieldProps {
    name: string;
    type: string;
    errors?: IFormErrors<T>;
    allFieldsRequired: boolean;
    property: INamedConfigurationProperty;
    value: T;
    localization: Required<IAutoFormLocalization>;
    uploadFile?: (field: IUploadFileProps) => Promise<string | undefined | void>;
    renderFileName?: (value: string) => string;
    onChangeCustom?: (name: string, value: any) => void;
    renderCustomField?: (props: Exclude<IFormControlProps, 'renderCustomField'>) => ReactNode;
    renderAfterField?: AutoFormRenderAfterField;
}
export interface IFormArrayControlProps<T = any> extends FieldArrayRenderProps {
    name: string;
    allFieldsRequired: boolean;
    property: INamedConfigurationProperty;
    value: T;
}
export interface IFormFilesControlProps<T = any> extends IFormControlProps {
    uploadFile?: (field: IUploadFileProps) => Promise<string | undefined | void>;
    renderFileName?: (value: string) => string;
    disabled?: boolean;
    value: any;
}
export interface IRelationFieldsObserver {
    [key: string]: {
        [key: string]: {
            [WhenActionType.ENABLE]?: Array<IWhen['value']>;
            [WhenActionType.DISABLE]?: Array<IWhen['value']>;
        };
    };
}
export interface ICheckRelationsOnChange {
    fieldName: string;
    fieldValue: string;
    setFieldValue?: (field: string, value: any) => void;
}
export interface ISyncDefinitionAndFieldsState extends ICheckRelationsOnChange {
    initDefinition: IFormDefinition;
    relations: IRelationFieldsObserver;
    mutableInitDefinition: IFormDefinition;
    initialValues?: Record<string, any>;
}
export interface IAutoFormLocalization {
    listAddText?: string;
    fileUploadText?: string;
}
export type AutoFormRenderAfterField = (fieldProps: IFormControlProps) => React.ReactNode | null | undefined;
