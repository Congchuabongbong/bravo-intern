import { ValidatorFn } from "@angular/forms";
import { GridLayoutData } from ".";
export type ControlFormType = IInput | ISelect | ITextarea;
export type CategoryTag = 'input' | 'select' | 'textarea' | 'label';
export type InputType =
    | 'text'
    | 'checkbox'
    | 'radio'
    | 'button'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'file'
    | 'hidden'
    | 'image'
    | 'month'
    | 'number'
    | 'password'
    | 'range'
    | 'reset'
    | 'search'
    | 'submit'
    | 'tel'
    | 'time'
    | 'url'
    | 'week';

export interface IInput {
    attribute: IAttribute;
    type: InputType;
}

export interface ISelect {
    attribute: IAttribute;
    options: {
        title: string;
        value: any;
    }[];
}

export interface ITextarea {
    attribute: IAttribute;
}

export interface ILabel extends Pick<IAttribute, 'class' | 'position'> {
    title: string;
    id?: string;
    for: string;
}

export interface IAttribute {
    categoryTag: CategoryTag;
    label: ILabel
    position: GridLayoutData.IPositionGridItem;
    formControlName: string;
    validators?: Array<ValidatorFn>;
    disabled?: boolean;
    required?: boolean;
    value?: any | undefined,
    id: string;
    class?: string;
    name?: string;
    max?: number;
    min?: number;
    order?: number | string,
    placeholder?: string;

}

