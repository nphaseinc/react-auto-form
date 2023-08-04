/**
 * Returns a new configuredProperties object with any default values set from
 * the given definition if they aren't set already
 *
 * @param properties
 * @param initial
 */
import { IFormDefinition, IFormDefinitionProperty } from './models';
/**
 * Ensure that the input values match the property definitions
 */
export declare function sanitizeValues<T>(definition: IFormDefinition, initialValue?: any): T;
/**
 * Add the 'name' field from the property ID and sort them by the 'order' property
 */
export declare function enrichAndOrderProperties(definition: IFormDefinition): {
    name: string;
    required: any;
    type: string;
    arrayDefinition?: IFormDefinition<string> | undefined;
    arrayDefinitionOptions?: import("./models").IFormArrayDefinitionOptions | undefined;
    controlHint?: string | undefined;
    dataList?: string[] | undefined;
    defaultValue?: any;
    description?: string | undefined;
    disabled?: boolean | undefined;
    displayName?: string | undefined;
    displayNameCheckbox?: string | undefined;
    enum?: import("./models").IFormPropertyValue[] | undefined;
    extendedOptions?: {
        [name: string]: any;
    } | undefined;
    fieldAttributes?: import("./models").IFormFieldAttributes | undefined;
    formGroupAttributes?: import("./models").IFormFieldAttributes | undefined;
    labelHint?: string | undefined;
    mapsetKeys?: import("./models").IMapsetKey[] | undefined;
    mapsetValueDefinition?: IFormDefinitionProperty | undefined;
    mapsetOptions?: import("./models").IMapsetOptions | undefined;
    order?: number | undefined;
    placeholder?: string | undefined;
    relation?: import("./models").IFormPropertyRelation[] | undefined;
    secret?: boolean | undefined;
}[];
/**
 * Converts various values passed into the property type to known input types
 *
 * @param property
 */
export declare function massageType(property: IFormDefinitionProperty): string;
/**
 * Ensure that the 'required' property is false for checkboxes and hidden fields
 *
 * This is a candidate for removal in the future, as it's a workaround
 *
 * @param property
 */
export declare function massageRequired(property: IFormDefinitionProperty): any;
export declare function check(property: IFormDefinitionProperty): boolean;
export declare function getNewArrayRow(definition: IFormDefinition): unknown;
export declare function getNewArrayRows(missing: number, definition: IFormDefinition): any[];
export declare function sanitizeInitialArrayValue(definition: IFormDefinition, value?: any[], minimum?: number): unknown[];
/**
 * Converts the given value from a string to the type defined in the property definition
 *
 * This is a candidate for removal as it's a workaround
 *
 * @param property
 * @param value
 * @param defaultValue
 */
export declare function massageValue(property: IFormDefinitionProperty, value?: any, defaultValue?: any): any;
export declare function renderFileName(inputText: string): string;
