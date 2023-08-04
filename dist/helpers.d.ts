import { IFormDefinition, IFormDefinitionProperty, IFormErrors } from './models';
/**
 * Maps an API map of ConfigurationProperty objects to
 * an autoform IFormDefinition object.  Use on properties
 * objects from backend responses to ensure they're mapped
 * properly
 *
 * @param properties
 */
export declare function toFormDefinition(properties: IFormDefinition): IFormDefinition<string>;
/**
 * Maps an API ConfigurationProperty object to an autoform IFormDefinitionPropertyObject
 *
 * @param property
 */
export declare function toFormDefinitionProperty(property: IFormDefinitionProperty): IFormDefinitionProperty;
export declare function anyFieldsRequired(properties: IFormDefinition): boolean;
export declare function allFieldsRequired(properties: IFormDefinition): boolean;
export declare function getRequiredStatusText(properties: IFormDefinition, allRequired: string, someRequired: string, noneRequired: string): string;
/**
 * Evaluates the values according to the given property definition and returns
 * a boolean if the supplied values are valid or not.
 *
 * @param properties
 * @param values
 */
export declare function validateConfiguredProperties(properties: IFormDefinition, values?: {
    [name: string]: any;
}): boolean;
/**
 * Evaluates the given values against the supplied property definition
 * object and returns an IFormErrors map that can be returned to auto-form
 *
 * @param definition
 * @param getErrorString
 * @param values
 */
export declare function validateRequiredProperties<T>(definition: IFormDefinition | IFormDefinition, getErrorString: (name: string) => string, values?: T, prefix?: string): IFormErrors<T>;
/**
 * Stringifies non-complex types in a property map
 *
 * @param values
 */
export declare function coerceFormValues(values: any): {};
export declare const getAutocompleteAttr: ({ secret, }: {
    name: string;
    secret?: boolean | undefined;
}) => "new-password" | undefined;
