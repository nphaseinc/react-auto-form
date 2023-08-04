import { IFormControlProps } from '../models';
export declare function getValidationState({ form, field }: IFormControlProps): false | undefined;
export declare function getErrorText(errors: any, fieldName: string): any;
export declare function getHelperText(fieldName: string, description: string | undefined, errors: any): {
    helperText: string;
    helperTextInvalid: any;
};
/**
 * Returns a valid DOM id from the given string
 *
 * @param value
 */
export declare function toValidHtmlId(value?: string): string;
