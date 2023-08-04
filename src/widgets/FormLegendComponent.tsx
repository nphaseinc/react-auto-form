import { Typography } from 'antd';
import * as React from 'react';
import { AutoFormFormGroupBody } from 'src/components/FormGroup';
import { IFormControlProps } from '../models';

export const FormLegendComponent: React.FunctionComponent<IFormControlProps> = props => (
  <AutoFormFormGroupBody direction="vertical">
    <Typography.Title
      level={4}
      children={props.property.displayName}
      ellipsis
    />
  </AutoFormFormGroupBody>
);
