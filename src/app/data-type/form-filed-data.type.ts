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
        title: string; //key
        value: any;
    }[];
}

export interface ITextarea {
    attribute: IAttribute;
}

export interface ILabel extends Pick<IAttribute, 'class' | 'position'> {
    title: string;
    id?: string; //remove
    for: string; //remove
    order?: number | string,
    formControlName?: string; //remove
}

export interface IAttribute {
    categoryTag: CategoryTag;
    id: string;
    class?: string;
    name?: string;
    max?: number;
    min?: number;
    placeholder?: string;
    position: GridLayoutData.IPositionGridItem;
    formControlName: string;
}

//**Edit here */
export interface IField {
    filed: ControlFormType;
    label: ILabel;
}
export interface IAttribute2<P> {
    categoryTag: CategoryTag;
    id: string;
    class?: string;
    name?: string;
    max?: number;
    min?: number;
    placeholder?: string;
    position: P;
    formControlName: string;
}