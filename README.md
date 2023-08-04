# AutoForm

AutoForm is client-rendered forms driven by JSON

## AutoForm interface
AutoForm uses an IFormDefinition object, which is simply a map of IFormDefinitionProperty objects.  These interfaces are defined [in this file](./src/models.ts).

In Syndesis [this code](../utils/src/autoformHelpers.ts) is used to map the Syndesis map of ConfigurationProperty objects to an IFormDefinitionObject.

## Writing JSON for the Syndesis map of ConfigurationProperty interface

The `propertyDefinitionSteps` field in a `descriptor` can contain one or more elements of objects that contain a `properties` attribute. 

The `properties` attribute is a map that describes each property of the configuration object that the user's extension would require. 

The key for a given element in the `properties` map corresponds to a key in the resulting `configuredProperties` object that will be stored on the step when the user configures the extension in the editor.

Each value of the properties object must at the very least contain a `type` field, which tells the UI what kind of form control to use. Other fields are optional. The fields that can be set on a given value are:

* __type__ - Controls the kind of form control that should be displayed in the UI. The corresponding table shows how the field is mapped:

| Type Value | HTML Form Control |
| ---------- | ----------------- |
| boolean, checkbox | input of type "checkbox" |
| int, integer, long, number |	input of type "number" |
| hidden     |	input of type "hidden" | 
| select     |	input of type "select" |
| duration   |	a custom duration control is used |
| textarea   |	a textarea element is used | 
| text, string, any unknown value |	an input of type "text" is used. |
| array | A special array component is used |

* __required__ - _boolean_: controls whether or not the `required` attribute is set on the control, if true then the user will need to supply a value for the form to successfully validate.
* __secret__ - _boolean_: If specified the form control will be overridden to be an input of type `password`.
* __displayName__ - _string_: sets the label text for the form control, if not set then the raw property name is shown
* __labelHint__ or __labelTooltip__ - _string_: if set, a `?` icon will be displayed next to the label and the value will be shown in a popover when the user clicks on the`?` icon
* __controlHint__ or __controlTooltip__ - _string_: If set the value will be used to set the "title" property of the form control, resulting in a tooltip that will appear when the user hovers the mouse over the control.
* __description__ - _string_: If set, the value will be shown underneath the control, generally used to display a short useful message about the field to the user.
* __placeholder__ - _string_: if set, the value will be used in the form control's `placeholder` property.
* __enum__ - _array_: if set, the "type" will be overridden to be a "select" control. The array should contain a list of objects that contain a "label" and "value" attributes. The "label" attribute is used for each select item's label, and the "value" will be set for each select items' value.
* __dataList__ - _array_: Used for "text" fields, will be used to add a "datalist" element to the form control that provides typeahead support for the user. The array should contain just strings values.
* __multiple__ - _boolean_: If set to "true" for a "select" field (or a field with "enum" set) a multi-select control will be used instead of a select drop-down.
* __max__ - _number_: If set for a "number" field, controls the highest value accepted by the form control.
* __min__ - _number_: if set for a "number" field, controls the lowest value accepted by the form control.
* __rows__ - _number_: if set for a "textarea" field, controls the number of rows initially displayed for the textarea control.
* __cols__ - _number_: if set for a "textarea" field, controls the number of columns initially displayed for the textarea control.
* __order__ - _number_: influences order of controls in the resulting form. The arrangement of controls will be lower values first.

```
const roles = [
  { name: 'Admin', id: 0 },
  { name: 'User', id: 1 },
  { name: 'Guest', id: 2 },
];

const definition: IFormDefinition = {
  LIST: {
    displayName: 'List',
    type: 'list',
    enum: [
      { label: 'Basic', value: 'Basic' },
      { label: 'SSLCert', value: 'SSLCert' },
    ],
  },
  TYPHEAD: {
    displayName: 'Typehead',
    type: 'typeahead',
    enum: [
      { label: 'Basic', value: 'Basic' },
      { label: 'SSLCert', value: 'SSLCert' },
    ],
  },
  REDCAPCLOUD_API_URL: {
    displayName: 'REDCap Cloud URL',
    order: 1,
    secret: false,
    deprecated: false,
    kind: 'parameter',
    type: 'STRING',
    group: 'common',
    javaType: 'java.lang.String',
    required: true,
  },
  FHIR_VERSION: {
    displayName: 'FHIR Version',
    defaultValue: 'DSTU2_HL7ORG',
    order: 2,
    secret: false,
    deprecated: false,
    kind: 'parameter',
    type: 'string',
    group: 'common',
    javaType: 'java.lang.String',
    enum: [
      { label: 'DSTU2', value: 'DSTU2_HL7ORG' },
      { label: 'DSTU3', value: 'DSTU3' },
      { label: 'R4', value: 'R4' },
    ],
  },
  FHIR_AUTH: {
    displayName: 'FHIR Authorization',
    defaultValue: 'Basic',
    order: 4,
    secret: false,
    deprecated: false,
    kind: 'parameter',
    type: 'string',
    group: 'common',
    javaType: 'java.lang.String',
    enum: [
      { label: 'Basic Auth', value: 'Basic' },
      { label: 'SSL Certificate', value: 'SSLCert' },
    ],
  },
  FHIR_USERNAME: {
    displayName: 'FHIR Username',
    order: 5,
    secret: false,
    deprecated: false,
    kind: 'parameter',
    type: 'STRING',
    group: 'common',
    javaType: 'java.lang.String',
    relation: [
      { action: 'ENABLE', when: [{ id: 'FHIR_AUTH', value: 'Basic' }] },
    ],
  },
  FHIR_PASSWORD: {
    displayName: 'FHIR Password',
    order: 6,
    secret: true,
    deprecated: false,
    kind: 'parameter',
    type: 'STRING',
    group: 'common',
    javaType: 'java.lang.String',
    relation: [
      { action: 'ENABLE', when: [{ id: 'FHIR_AUTH', value: 'Basic' }] },
    ],
  },
  FHIR_SSL_FILE: {
    displayName: 'SSL Certificate',
    order: 11,
    secret: false,
    deprecated: false,
    kind: 'parameter',
    type: 'files',
    group: 'common',
    javaType: 'java.lang.String',
    relation: [
      {
        action: 'ENABLE',
        when: [{ id: 'FHIR_AUTH', value: 'SSLCert' }],
      },
    ],
  },
  FHIR_SSL_PASSWORD: {
    displayName: 'SSL Password',
    order: 12,
    required: false,
    secret: true,
    deprecated: false,
    kind: 'parameter',
    type: 'STRING',
    group: 'common',
    javaType: 'java.lang.String',
    relation: [
      {
        action: 'ENABLE',
        when: [{ id: 'FHIR_AUTH', value: 'SSLCert' }],
      },
    ],
  },
  FHIR_EPIC_CLIENT_ID: {
    displayName: 'Epic client id',
    order: 13,
    secret: false,
    deprecated: false,
    kind: 'parameter',
    type: 'STRING',
    group: 'common',
    javaType: 'java.lang.String',
    relation: [
      {
        action: 'ENABLE',
        when: [{ id: 'FHIR_AUTH', value: 'SSLCert' }],
      },
    ],
  },
  DATE_TIME: {
    type: 'date',
    fieldAttributes: {
      showTime: true,
      format: 'DD MM YYYY hh:mm:ss',
    },
    displayName: 'DATE_TIME',
  },
  IS_ENABLED: {
    type: 'switch',
    displayName: 'Start by default',
    defaultValue: false,
  },
  roleIds: {
    displayName: 'ROLES',
    defaultValue: [(roles?.find(role => role.name === 'User') || {}).id],
    type: 'multi',
    fieldAttributes: {
      options:
        roles?.map(role => ({
          value: role.id,
          label: role.name,
          disabled: role.name === 'User',
        })) || [],
    },
  },
  IS_ALLOWED: {
    displayName: 'This module is allowed for Guests',
    defaulValue: false,
    type: 'checkbox',
  },
  MAPSET: {
    displayName: 'This mapset field',
    type: 'mapset',
    mapsetOptions: {
      i18nKeyColumnTitle: 'i18nKeyColumnTitle',
      i18nValueColumnTitle: 'i18nValueColumnTitle',
    },
    mapsetKeys: [
      {
        name: 'Name1',
        displayName: 'DisplayName1',
      },
      {
        name: 'Name2',
        displayName: 'DisplayName2',
      },
    ],
    mapsetValueDefinition: {
      required: true,
      order: 1,
      secret: true,
      type: 'STRING',
    },
  },
  LEGEND: {
    displayName: 'This legend field',
    type: 'legend',
  },
  DURATION: {
    type: 'duration',
    displayName: 'This duration field',
    labelHint: 'This is label hint!!!',
    defaultValue: 18000000,
  },
  ARRAY: {
    type: 'array',
    displayName: 'This array field',
    arrayDefinition: {
      ARRAY_1: {
        type: 'string',
        required: true,
        displayName: 'Intire field string',
        placeholder: 'Placeholder',
      },
      ARRAY_2: {
        type: 'switch',
        displayName: 'Start by checkbox',
        defaultValue: false,
      },
      ARRAY_3: {
        type: 'string',
        displayName: 'Intire field 2 string',
      },
    },
    arrayDefinitionOptions: {
      rowTitle: 'Row title',
      i18nAddElementText: 'Add new',
      minElements: 1,
      showSortControls: true,
    },
  },
};

<AutoForm<IFormValue>
  i18nRequiredProperty={t('requiredFieldMessage')}
  definition={definition}
  initialValue={{}}
  enableReinitialize
  onSave={onSave}
  validate={validateTemplateIntegrationForm}
  uploadFile={handleUploadFile}
  renderFileName={renderFileName}
>
  {({ fields, handleSubmit, submitForm, isSubmitting }) => (
    <FormSkeleton withFooterPanel>
      <Formlayout
        // validationResults={validationError}
        onSubmit={handleSubmit}
        title={'Development form'}
      >
        <>
          {Object.keys(definition).length > 0 ? (
            fields
          ) : (
            <Alert
              type="info"
              showIcon
              message={t('NoPropertiesToConfigured')}
            />
          )}
        </>
      </Formlayout>
      <StepsFooterPanel
        cancelAction={onCancel}
        nextAction={submitForm}
        loading={isSubmitting}
      />
    </FormSkeleton>
  )}
</AutoForm>
```