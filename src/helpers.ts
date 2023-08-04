import { IFormDefinition, IFormDefinitionProperty, IFormErrors } from './models';

/**
 * Maps an API map of ConfigurationProperty objects to
 * an autoform IFormDefinition object.  Use on properties
 * objects from backend responses to ensure they're mapped
 * properly
 *
 * @param properties
 */
export function toFormDefinition(properties: IFormDefinition) {
  if (!properties) {
    throw new Error('Undefined value passed to form definition converter');
  }
  const answer: IFormDefinition = {};
  Object.keys(properties).forEach(key => {
    answer[key] = toFormDefinitionProperty(properties[key]);
  });
  return answer;
}

/**
 * Maps an API ConfigurationProperty object to an autoform IFormDefinitionPropertyObject
 *
 * @param property
 */
export function toFormDefinitionProperty(property: IFormDefinitionProperty) {
  const {
    cols,
    extendedProperties,
    max,
    min,
    multiple,
    rows,
    controlHint,
    controlTooltip,
    labelHint,
    labelTooltip,
    autoComplete,
    ...formDefinitionProperty
  } = property as any; // needed, ConfigurationProperty is a lie
  return {
    ...formDefinitionProperty,
    ...((typeof extendedProperties === 'string'
      ? JSON.parse(extendedProperties)
      : extendedProperties) || {}),
    controlHint: controlHint || controlTooltip,
    fieldAttributes: {
      autoComplete,
      cols,
      max,
      min,
      multiple,
      rows,
    },
    labelHint: labelHint || labelTooltip,
    relation: property.relation,
  } as IFormDefinitionProperty;
}

export function anyFieldsRequired(properties: IFormDefinition) {
  return (
    Object.keys(properties)
      .filter(key => requiredTypeMask(properties[key].type))
      .filter(key => properties[key].required).length > 0
  );
}

function requiredTypeMask(type?: string) {
  switch (type) {
    case 'boolean':
    case 'checkbox':
    case 'hidden':
      return false;
    default:
      return true;
  }
}

export function allFieldsRequired(properties: IFormDefinition) {
  const keys = Object.keys(properties).filter(key =>
    requiredTypeMask(properties[key].type)
  );
  const allRequired = keys.filter(key => properties[key].required);
  if (allRequired.length === 0) {
    return false;
  }
  return keys.length === allRequired.length;
}

export function getRequiredStatusText(
  properties: IFormDefinition,
  allRequired: string,
  someRequired: string,
  noneRequired: string
) {
  if (allFieldsRequired(properties)) {
    return allRequired;
  }
  if (anyFieldsRequired(properties)) {
    return someRequired;
  }
  return noneRequired;
}

/**
 * Evaluates the values according to the given property definition and returns
 * a boolean if the supplied values are valid or not.
 *
 * @param properties
 * @param values
 */
export function validateConfiguredProperties(
  properties: IFormDefinition,
  values?: { [name: string]: any }
) {
  if (typeof values === 'undefined') {
    return false;
  }
  const allRequired = Object.keys(properties).filter(
    key => properties[key].required
  );
  if (allRequired.length === 0) {
    return true;
  }
  const allRequiredSet = allRequired
    .map(key => validateRequired(values[key]))
    .reduce((prev, curr) => curr, false);
  return allRequiredSet;
}

/**
 * Examine the given property and determine if it's set or not,
 * for string values this includes evaluating against ''
 *
 * @param value
 */
function validateRequired(value?: any) {
  if (typeof value === 'undefined') {
    return false;
  }
  if (typeof value === 'string') {
    return (value as string) !== '';
  }
  if (Array.isArray(value) && value.length === 0) {
    return false;
  }
  return true;
}

/**
 * Evaluates the given values against the supplied property definition
 * object and returns an IFormErrors map that can be returned to auto-form
 *
 * @param definition
 * @param getErrorString
 * @param values
 */
export function validateRequiredProperties<T>(
  definition: IFormDefinition | IFormDefinition,
  getErrorString: (name: string) => string,
  values?: T,
  prefix = ''
): IFormErrors<T> {
  const allRequired = Object.keys(definition)
    .filter(key => requiredTypeMask(definition[key].type))
    .filter(key => definition[key].required);
  if (allRequired.length === 0) {
    return {} as IFormErrors<T>;
  }
  const sanitizedValues = values || ({} as T);
  const validationResults = allRequired
    .map(key => ({ key, defined: validateRequired(sanitizedValues[key]) }))
    .reduce((acc, current) => {
      if (!current.defined) {
        acc[`${prefix}${current.key}`] = getErrorString(
          definition[current.key].displayName || current.key
        );
      }
      return acc;
    }, {} as IFormErrors<T>);
  const arrayValidationResults = allRequired
    .filter(key => definition[key].type === 'array')
    .reduce((acc, current) => {
      const arrayValue = sanitizedValues[current] || [];
      const arrayDefinition = definition[current].arrayDefinition!;
      const result = arrayValue
        .map((value: any, index: number) =>
          validateRequiredProperties<any>(
            arrayDefinition,
            getErrorString,
            value,
            `${current}[${index}].`
          )
        )
        .reduce(
          (accInner: any, currentInner: any) => ({
            ...accInner,
            ...currentInner,
          }),
          {}
        );
      return { ...acc, ...result };
    }, {});
  return { ...validationResults, ...arrayValidationResults };
}

/**
 * Stringifies non-complex types in a property map
 *
 * @param values
 */
export function coerceFormValues(values: any) {
  const updated = {};
  Object.keys(values).forEach(key => {
    updated[key] =
      typeof values[key] === 'object'
        ? JSON.stringify(values[key])
        : values[key];
  });
  return updated;
}

export const getAutocompleteAttr = ({
  secret,
}: {
  name: string;
  secret?: boolean;
}) => {
  if (secret === true) {
    return 'new-password';
  }
  return undefined;
};
