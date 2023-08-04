import { IFormDefinition, IRenderFieldProps } from './models';
export declare function useFormBuilder(): {
    getField: (props: IRenderFieldProps) => any;
    getInitialValues: (definition: IFormDefinition, initialValues: any) => any;
    getPropertiesArray: (definition: IFormDefinition) => {
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
        mapsetValueDefinition?: import("./models").IFormDefinitionProperty | undefined;
        mapsetOptions?: import("./models").IMapsetOptions | undefined;
        order?: number | undefined;
        placeholder?: string | undefined;
        relation?: import("./models").IFormPropertyRelation[] | undefined;
        secret?: boolean | undefined;
    }[];
};
