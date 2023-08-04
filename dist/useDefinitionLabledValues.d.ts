import { IFormDefinition, IFormDefinitionProperty } from './models';
type IFormDefinitionValues<TFields extends string = string> = Record<TFields, IFormDefinitionProperty & {
    labelValue?: any;
}>;
export declare const useDefinitionLabledValues: (definition: IFormDefinition, initialValue: Record<string, any>) => IFormDefinitionValues;
export {};
