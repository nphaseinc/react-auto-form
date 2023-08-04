import { IFormDefinition, IFormDefinitionProperty } from './models';
import { useDefinitionCompiler } from './useDefinitionCompiler';

type IFormDefinitionValues<TFields extends string = string> = Record<
  TFields,
  IFormDefinitionProperty & {
    labelValue?: any;
  }
>;

const getLabeledValues = (
  definition: IFormDefinition,
  initialValue: Record<string, any>
) =>
  Object.keys(definition).reduce((acc, key) => {
    acc[key] = definition[key];
    if (acc[key].enum) {
      acc[key].labelValue =
        (acc[key].enum!.find(e => initialValue[key] === e.value) || {}).label ||
        initialValue[key];
      return acc;
    }
    acc[key].labelValue = initialValue[key];
    return acc;
  }, {} as IFormDefinitionValues);

export const useDefinitionLabledValues = (
  definition: IFormDefinition,
  initialValue: Record<string, any>
): IFormDefinitionValues => {
  const { definition: currentDefinition } = useDefinitionCompiler(
    definition,
    initialValue
  );

  return getLabeledValues(currentDefinition, initialValue);
};
