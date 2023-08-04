import classNames from 'classnames';
import React from 'react';
import './Form.css';

interface IFormContextProps {
  direction: AutoFormDirection;
}

interface IFormProps
  extends React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {
  direction?: AutoFormDirection;
  withoutFormTag?: boolean;
}

export type AutoFormDirection = 'horizontal' | 'vertical';

export const FormContext = React.createContext<IFormContextProps>({
  direction: 'horizontal',
});

export const Form: React.FC<IFormProps> = ({
  direction,
  withoutFormTag,
  children,
  className,
  ...props
}) => (
  <FormContext.Provider value={{ direction: direction || 'horizontal' }}>
    {withoutFormTag ? (
      <div className={classNames('AutoForm_Form', className)}>{children}</div>
    ) : (
      <form className={classNames('AutoForm_Form', className)} {...props}>
        {children}
      </form>
    )}
  </FormContext.Provider>
);
