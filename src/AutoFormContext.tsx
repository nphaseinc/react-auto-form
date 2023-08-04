import * as React from 'react';
import {
  FormCheckboxComponent,
  FormDurationComponent,
  FormHiddenComponent,
  FormLegendComponent,
  FormMapsetComponent,
  FormSelectComponent,
  FormTextAreaComponent,
  FormTypeaheadComponent,
  FormFilesComponent,
  FormInputComponent,
  FormDateComponent,
  FormSwitchComponent,
  FormMultiSelectComponent,
  FormCustomComponent,
  FormListComponent,
} from './widgets';

export interface IComponentTypemap {
  [name: string]: Record<string, any>;
}

export interface IAutoFormContext {
  typemaps: IComponentTypemap;
}

export const AutoFormContextDefaultValue = {
  typemaps: {
    checkbox: FormCheckboxComponent,
    duration: FormDurationComponent,
    files: FormFilesComponent,
    hidden: FormHiddenComponent,
    legend: FormLegendComponent,
    mapset: FormMapsetComponent,
    select: FormSelectComponent,
    textarea: FormTextAreaComponent,
    text: FormInputComponent,
    typeahead: FormTypeaheadComponent,
    date: FormDateComponent,
    switch: FormSwitchComponent,
    multi: FormMultiSelectComponent,
    custom: FormCustomComponent,
    list: FormListComponent,
  },
} as IAutoFormContext;

export const AutoFormContext = React.createContext<IAutoFormContext>(
  AutoFormContextDefaultValue
);
