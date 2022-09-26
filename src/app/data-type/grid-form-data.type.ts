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
export interface IGridItemForm2 extends GridLayoutData.IGridLayout {
    fields: FormFieldData.IField[];
}
function demo() {
    let something = {
        row: {
            rowOfNumber: 8,
            arrayUnitRow: []
        },
        column: {
            columnOfNumber: 8,
            arrayUnitColumn: []
        },
        fields: [
            {
                filed: {
                    type: 'text',
                    label: {
                        title: '',
                        position: {
                            columnLine: { startLine: 1, endLine: 12 },
                            rowLine: { startLine: 1, endLine: 12 }
                        },
                    },
                    attribute: {
                        categoryTag: 'input',
                        formControlName: 'nameControl',
                        id: 'name',
                        position: {
                            columnLine: { startLine: 1, endLine: 12 },
                            rowLine: { startLine: 1, endLine: 12 }
                        }
                    }
                },
            }
        ],
    }
}

