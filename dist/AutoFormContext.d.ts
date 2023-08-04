import * as React from 'react';
export interface IComponentTypemap {
    [name: string]: Record<string, any>;
}
export interface IAutoFormContext {
    typemaps: IComponentTypemap;
}
export declare const AutoFormContextDefaultValue: IAutoFormContext;
export declare const AutoFormContext: React.Context<IAutoFormContext>;
