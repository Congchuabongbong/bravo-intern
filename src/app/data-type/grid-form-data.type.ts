
import { FormFieldData, GridLayoutData } from '.';

//**Form Grid layout*/
export interface IControlGridLayoutForm extends GridLayoutData.IGridLayout {
    gridItemForm: IGridItemForm,
}
export interface IGridItemForm {
    labels: FormFieldData.ILabel[];
    fields: FormFieldData.ControlFormType[];
    subControlGridLayoutForm?: {
        subGridItemForm: IControlGridLayoutForm
        position: GridLayoutData.IPositionGridItem
    };
}
