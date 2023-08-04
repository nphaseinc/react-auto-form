import {
  Formik,
  FormikHelpers as FormikActions,
  FormikErrors,
  FormikProps,
  FormikValues,
} from 'formik';
import * as React from 'react';
import {
  AutoFormContext,
  AutoFormContextDefaultValue,
} from './AutoFormContext';
import {
  AutoFormRenderAfterField,
  IAutoFormActions,
  IAutoFormLocalization,
  IFormControlProps,
  IFormDefinition,
  IFormErrors,
  IUploadFileProps,
} from './models';
import { useDefinitionCompiler } from './useDefinitionCompiler';
import { useFormBuilder } from './useFormBuilder';
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
  customComponents?: { [type: string]: any };
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
  validate?: (
    value: Values,
    currentDefinition: IFormDefinition
  ) => IFormErrors<Values> | Promise<IFormErrors<Values>> | undefined;

  /**
   * Validation function called to determine if the initial values are valid
   */
  validateInitial?: (value: Values) => IFormErrors<Values>;
  /**
   * Child component that will receive the form fields and submit handler
   */
  children: (
    props: IAutoFormChildrenProps<Values> & FormikProps<Values>
  ) => any;
  enableReinitialize?: boolean;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  uploadFile?: (field: IUploadFileProps) => Promise<string | undefined | void>;
  renderFileName?: (value: string) => string;
  renderCustomField?: IFormControlProps['renderCustomField'];
  renderAfterField?: AutoFormRenderAfterField;
  localization?: IAutoFormLocalization;
  innerRef?: React.RefObject<any>;
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

export const AutoForm = <Values extends FormikValues>(
  props: IAutoFormProps<Values>
): React.ReactElement => {
  const { getField, getPropertiesArray, getInitialValues } = useFormBuilder();

  const {
    definition: currentDefinition,
    checkRelationsOnChange,
  } = useDefinitionCompiler(props.definition, props.initialValue);
  const localization = React.useMemo(
    () => ({
      listAddText: 'Add',
      fileUploadText: 'Drag a file here or browse to upload',
      ...props.localization,
    }),
    [props.localization]
  );

  const propertiesArray = getPropertiesArray(currentDefinition);
  const initialValues = getInitialValues(props.definition, props.initialValue);

  const isInitialValid =
    typeof props.validateInitial === 'function'
      ? Object.keys(props.validateInitial(initialValues) || {}).length === 0
      : props.isInitialValid || false;

  const handleSave = async (
    value: Values,
    formikBag: FormikActions<Values>
  ) => {
    if (typeof props.onSave === 'function') {
      await props.onSave(value, formikBag as IAutoFormActions<Values>);
    }
  };

  const validate: (
    values: Values
  ) => void | Record<string, any> | Promise<FormikErrors<Values>> = values => {
    if (props.validate) {
      return props.validate(values, currentDefinition);
    }
    return undefined;
  };

  return (
    <AutoFormContext.Provider
      value={{
        typemaps: {
          ...AutoFormContextDefaultValue.typemaps,
          ...props.customComponents,
        },
      }}
    >
      <Formik<Values>
        initialValues={initialValues}
        onSubmit={handleSave}
        validateOnMount={isInitialValid}
        validate={validate}
        enableReinitialize={props.enableReinitialize}
        validateOnBlur={props.validateOnBlur}
        validateOnChange={props.validateOnChange}
        innerRef={props.innerRef}
      >
        {({ values, touched, dirty, errors, ...rest }) => {
          const propertyComponents = propertiesArray.map(property => {
            const err =
              typeof errors === 'object' ? errors : { [property.name]: errors };
            property.disabled = props.isEditable || property.disabled;
            return getField({
              allFieldsRequired: props.allFieldsRequired || false,
              errors: err as IFormErrors<Values>,
              uploadFile: props.uploadFile,
              renderFileName: props.renderFileName,
              renderCustomField: props.renderCustomField,
              renderAfterField: props.renderAfterField,
              onChangeCustom: (name, value) => {
                if (values[name] !== value) {
                  checkRelationsOnChange({
                    name,
                    setFieldValue: rest.setFieldValue,
                    value,
                    initialValues,
                  });
                }
                rest.setFieldValue(name, value);
              },
              localization,
              property,
              value: (values || {})[property.name],
              ...rest,
            });
          });
          return props.children({
            ...(rest as FormikProps<Values>),
            dirty,
            errors,
            fields: (
              <React.Fragment>
                {props.i18nFieldsStatusText && (
                  <p
                    className="fields-status-pf"
                    dangerouslySetInnerHTML={{
                      __html: props.i18nFieldsStatusText,
                    }}
                  />
                )}
                {propertyComponents}
              </React.Fragment>
            ),
            fieldsAsArray: propertyComponents,
            values,
          });
        }}
      </Formik>
    </AutoFormContext.Provider>
  );
};
