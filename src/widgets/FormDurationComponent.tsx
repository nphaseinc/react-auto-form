import * as React from 'react';
import { IFormControlProps } from '../models';
import { getHelperText, getValidationState, toValidHtmlId } from './helpers';
import { AutoFormFormGroup } from 'src/components';
import { Input, Select } from 'antd';

interface IDuration {
  label: string;
  value: number;
}

const durations = [
  {
    label: 'Milliseconds',
    value: 1,
  },
  {
    label: 'Seconds',
    value: 1000,
  },
  {
    label: 'Minutes',
    value: 60000,
  },
  {
    label: 'Hours',
    value: 3600000,
  },
  {
    label: 'Days',
    value: 86400000,
  },
] as IDuration[];

function calculateDuration(duration: IDuration, initialValue: number) {
  return initialValue / duration.value;
}

function calculateValue(duration: IDuration, value: number) {
  return value * duration.value;
}

export const FormDurationComponent: React.FunctionComponent<IFormControlProps> = props => {
  const { value, onChange, ...field } = props.field;
  // find the highest duration that keeps the duration above 1
  const index = durations.findIndex(d => !(value / d.value >= 1.0)) - 1;
  // if the index is invalid than we use the highest available duration.
  const initialDuration = durations[index] || durations[durations.length - 1];
  const [duration, setDuration] = React.useState(initialDuration);

  const handleSelect = (
    selectedValue: IDuration['value'],
    selectedDuration: IDuration
  ) => {
    const inputValue = calculateDuration(duration, props.field.value);
    setDuration(selectedDuration);
    props.form.setFieldValue(
      field.name,
      calculateValue(selectedDuration, inputValue),
      true
    );
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.form.setFieldValue(
      field.name,
      calculateValue(duration, parseInt(event.target.value, 10)),
      true
    );
  };

  const id = toValidHtmlId(field.name);
  const { helperText, helperTextInvalid } = getHelperText(
    props.field.name,
    props.property.description,
    props.form.errors
  );
  const isValid = getValidationState(props);

  return (
    <AutoFormFormGroup
      label={props.property.displayName}
      labelHint={props.property.labelHint}
      {...props.property.formGroupAttributes}
      fieldId={id}
      isRequired={props.property.required}
      isValid={isValid}
      helperText={helperText}
      helperTextInvalid={helperTextInvalid}
    >
      <Input.Group compact>
        <Input
          {...props.property.fieldAttributes}
          data-testid={id}
          id={id}
          defaultValue={`${calculateDuration(duration, props.field.value)}`}
          disabled={props.form.isSubmitting || props.property.disabled}
          onChange={handleChange}
          title={props.property.controlHint}
          type="number"
          min="0"
          style={{ ...props.property?.fieldAttributes?.style, width: '70%' }}
        />
        <Select
          style={{ width: '30%' }}
          disabled={props.form.isSubmitting || props.property.disabled}
          value={duration.value}
          options={durations.map(d => ({
            label: d.label,
            value: d.value,
          }))}
          onSelect={handleSelect}
        />
      </Input.Group>
    </AutoFormFormGroup>
  );
};
