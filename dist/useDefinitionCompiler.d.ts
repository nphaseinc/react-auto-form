import { IFormDefinition } from './models';
export declare function useDefinitionCompiler(initDefinition: IFormDefinition, initialValue: any): {
    checkRelationsOnChange: ({ name, value, initialValues, setFieldValue, }: {
        name: string;
        value: any;
        initialValues: Record<string, any>;
        setFieldValue: (field: string, value: any) => void;
    }) => void;
    definition: IFormDefinition<string>;
};
