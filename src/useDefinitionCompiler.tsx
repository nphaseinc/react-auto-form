import * as React from 'react';
import { isEqual } from 'lodash';
import {
  IFormDefinition,
  IRelationFieldsObserver,
  ISyncDefinitionAndFieldsState,
  IWhen,
  WhenActionType,
} from './models';

const updateRelationObserverList = (
  relations: IRelationFieldsObserver,
  actionType: keyof typeof WhenActionType,
  condition: IWhen,
  fieldKey: string
) => {
  if (condition.id && condition.value) {
    if (
      relations[condition.id] &&
      relations[condition.id][fieldKey] &&
      relations[condition.id][fieldKey][actionType]
    ) {
      relations[condition.id] = {
        ...relations[condition.id],
        [fieldKey]: Object.assign(relations[condition.id][fieldKey], {
          [actionType]: relations[condition.id][fieldKey][actionType]!.concat(
            condition.value
          ),
        }),
      };
    } else {
      relations[condition.id] = {
        ...relations[condition.id],
        [fieldKey]: {
          [actionType]: [condition.value],
        },
      };
    }
  }
  return relations;
};

const syncDefinitionAndFieldsState = ({
  relations,
  mutableInitDefinition,
  initDefinition,
  fieldName,
  fieldValue,
  setFieldValue,
  initialValues,
}: ISyncDefinitionAndFieldsState) => {
  Object.keys(relations[fieldName]).forEach(linkedFieldName => {
    Object.keys(relations[fieldName][linkedFieldName]).forEach(
      whenActionKey => {
        if (relations[fieldName][linkedFieldName][whenActionKey]) {
          let whenExpression: boolean | Record<string, any> = false;

          relations[fieldName][linkedFieldName][
            whenActionKey as WhenActionType
          ]!.some(whenValue => {
            if (typeof whenValue === 'function') {
              whenExpression = whenValue(fieldValue, initDefinition);
            } else if (whenValue === fieldValue) {
              whenExpression = true;
            }
            return whenExpression;
          });

          if (
            whenActionKey === WhenActionType.ENABLE
              ? !whenExpression
              : whenExpression
          ) {
            if (setFieldValue !== undefined) {
              setFieldValue(
                linkedFieldName,
                initialValues
                  ? initialValues[linkedFieldName]
                  : initDefinition[linkedFieldName].defaultValue
              );
            }
            delete mutableInitDefinition[linkedFieldName];
          } else {
            if (!mutableInitDefinition[linkedFieldName]) {
              mutableInitDefinition[linkedFieldName] = {
                ...initDefinition[linkedFieldName],
              };
            }
            if (typeof whenExpression === 'object') {
              mutableInitDefinition[linkedFieldName] = {
                ...initDefinition[linkedFieldName],
                ...(whenExpression as Record<string, any>),
              };
              if (
                setFieldValue !== undefined &&
                mutableInitDefinition[linkedFieldName].enum
              ) {
                setFieldValue(linkedFieldName, '');
              }
            }
          }
        }
      }
    );
  });
  return mutableInitDefinition;
};

export function useDefinitionCompiler(
  initDefinition: IFormDefinition,
  initialValue: any
) {
  const [relationObserver, setRelationObserver] = React.useState<
    IRelationFieldsObserver
  >({});
  const [definition, setDefinition] = React.useState<IFormDefinition>({});
  const prev = React.useRef<any>({ initDefinition: null, initialValue: null });

  React.useEffect(() => {
    if (
      !isEqual(prev.current.initDefinition, initDefinition) ||
      !isEqual(prev.current.initialValue, initialValue)
    ) {
      prev.current.initDefinition = initDefinition;
      prev.current.initialValue = initialValue;

      const relations = {};

      Object.entries(initDefinition).forEach(([fieldKey, fieldValue]) => {
        if (Array.isArray(fieldValue.relation)) {
          fieldValue.relation.forEach(relation => {
            if (
              relation.action !== undefined &&
              Array.isArray(relation.when) &&
              relation.when.length
            ) {
              relation.when.forEach(condition => {
                updateRelationObserverList(
                  relations,
                  relation.action as WhenActionType,
                  condition,
                  fieldKey
                );
              });
            }
          });
        }
      });

      setRelationObserver(relations);

      const newDefinition = { ...initDefinition };

      Object.keys(relations).forEach(key => {
        syncDefinitionAndFieldsState({
          fieldName: key,
          fieldValue:
            (initialValue || {})[key] || initDefinition[key].defaultValue,
          initDefinition,
          mutableInitDefinition: newDefinition,
          relations,
        });
      });

      setDefinition(newDefinition);
    }
  }, [initDefinition, initialValue]);

  const checkRelationsOnChange = ({
    name,
    value,
    initialValues,
    setFieldValue,
  }: {
    name: string;
    value: any;
    initialValues: Record<string, any>;
    setFieldValue: (field: string, value: any) => void;
  }) => {
    if (relationObserver[name] !== undefined) {
      const newDefinition = definition
        ? { ...definition }
        : { ...initDefinition };

      syncDefinitionAndFieldsState({
        fieldName: name,
        fieldValue: value,
        initDefinition,
        mutableInitDefinition: newDefinition,
        relations: relationObserver,
        setFieldValue,
        initialValues,
      });

      setDefinition(newDefinition);
    }
  };

  return {
    checkRelationsOnChange,
    definition,
  };
}
