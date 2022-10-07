import { FormFieldData, GridLayoutData } from '.';
//**Form Grid layout*/
export interface IControlGridLayoutFormData extends GridLayoutData.IGridLayout {
    formField: FormFieldData.ControlFormType[];
    subControlGridLayoutFormData?: {
        subGridItemForm: IControlGridLayoutFormData
        position: GridLayoutData.IPositionGridItem
    };
}
export interface IFormTab {
    key: string, name: string,
    formTab: IControlGridLayoutFormData;
}