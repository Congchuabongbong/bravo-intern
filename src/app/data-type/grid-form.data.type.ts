import { FormFieldData, GridLayoutData } from '.';
//**Form Grid layout*/

export interface IControlGridLayoutForm extends GridLayoutData.IGridLayout {
    formField: FormFieldData.ControlFormType[];
    subControlGridLayoutForm?: {
        subGridItemForm: IControlGridLayoutForm
        position: GridLayoutData.IPositionGridItem
    };
}
