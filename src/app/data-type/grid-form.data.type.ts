import { FormFieldData, GridLayoutData } from '.';
//**Form Grid layout*/

export interface IControlGridLayoutForm extends GridLayoutData.IGridLayout {
    FormField: FormFieldData.ControlFormType[];
    subControlGridLayoutForm?: {
        subGridItemForm: IControlGridLayoutForm
        position: GridLayoutData.IPositionGridItem
    };
}
function demo() {

}



