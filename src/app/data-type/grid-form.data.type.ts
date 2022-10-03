import { FormFieldData, GridLayoutData } from '.';
//**Form Grid layout*/
export interface IControlGridLayoutFormData extends GridLayoutData.IGridLayout {
    formField: FormFieldData.ControlFormType[];
    subControlGridLayoutFormData?: {
        subGridItemForm: IControlGridLayoutFormData
        position: GridLayoutData.IPositionGridItem
    };
}
export interface IFormTabItem {
    nameTab: string;
    formTab: IControlGridLayoutFormData;
}