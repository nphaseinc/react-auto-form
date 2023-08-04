import React from 'react';
import './Form.css';
interface IFormContextProps {
    direction: AutoFormDirection;
}
interface IFormProps extends React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
    direction?: AutoFormDirection;
    withoutFormTag?: boolean;
}
export type AutoFormDirection = 'horizontal' | 'vertical';
export declare const FormContext: React.Context<IFormContextProps>;
export declare const Form: React.FC<IFormProps>;
export {};
