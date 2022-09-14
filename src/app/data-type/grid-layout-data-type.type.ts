//**data type */
export type IUnitOfMeasure = IMinMax | IMin | IMax | string;
export interface IMinMax {
  min: string;
  max: string;
}
export interface IMin extends Pick<IMinMax, 'min'> {}
export interface IMax extends Pick<IMinMax, 'max'> {}
export interface IPositionLine {
  startLine: number;
  endLine: number;
}
export interface IPositionGridItem {
  rowLine: IPositionLine;
  columnLine: IPositionLine;
}
export interface IControlLayoutGridForm {
  labels: ILabel[];
  fields: IControlFormType[];
}
export type IControlFormType = IInput | ISelect | ITextarea;
type CategoryTag = 'input' | 'select' | 'textarea';
type InputType =
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
  categoryTag: CategoryTag;
  type: InputType;
  attribute: IAttribute;
}
interface ISelect {
  categoryTag: CategoryTag;
  options: {
    title: string;
    value: any;
  }[];
  attribute: IAttribute;
}
interface ITextarea {
  categoryTag: CategoryTag;
  attribute: IAttribute;
}
interface ILabel extends Pick<IAttribute, 'class' | 'position'> {
  title: string;
  id?: string;
  for: string;
}

interface IAttribute {
  id: string;
  class?: string;
  name?: string;
  placeholder?: string;
  position: IPositionGridItem;
  formControlName: string;
}

function doSomething() {
  let controlLayoutGridForm: IControlLayoutGridForm = {
    labels: [
      {
        title: 'Mã Vật Tư',
        for: 'product_id',
        class: 'form__title',
        position: {
          rowLine: { startLine: 1, endLine: 2 },
          columnLine: { startLine: 1, endLine: 2 },
        },
      },
      {
        title: 'Tên Vật Tư',
        for: 'product_name',
        class: 'form__title',
        position: {
          rowLine: { startLine: 2, endLine: 3 },
          columnLine: { startLine: 1, endLine: 2 },
        },
      },
      {
        title: 'Tên Thứ 2',
        for: 'product_name--second',
        class: 'form__title',
        position: {
          rowLine: { startLine: 3, endLine: 4 },
          columnLine: { startLine: 1, endLine: 2 },
        },
      },
      {
        title: 'Đơn Vị Tính',
        for: 'product_unit',
        class: 'form__title',
        position: {
          rowLine: { startLine: 4, endLine: 5 },
          columnLine: { startLine: 1, endLine: 2 },
        },
      },
      {
        title: 'Loại Vật Tư',
        for: 'product_type',
        class: 'form__title',
        position: {
          rowLine: { startLine: 5, endLine: 6 },
          columnLine: { startLine: 1, endLine: 2 },
        },
      },
      {
        title: 'Nhóm Hàng',
        for: 'product_group',
        class: 'form__title',
        position: {
          rowLine: { startLine: 6, endLine: 7 },
          columnLine: { startLine: 1, endLine: 2 },
        },
      },
      {
        title: 'Tự Tạo Mã SP',
        for: 'item_id--auto',
        class: 'form__title',
        position: {
          rowLine: { startLine: 7, endLine: 8 },
          columnLine: { startLine: 1, endLine: 2 },
        },
      },
      {
        title: 'Mã sản phẩm',
        for: 'item_id--create',
        class: 'form__title',
        position: {
          rowLine: { startLine: 7, endLine: 8 },
          columnLine: { startLine: 3, endLine: 4 },
        },
      },
      {
        title: 'Ghi chú',
        for: 'product_note',
        class: 'form__title',
        position: {
          rowLine: { startLine: 8, endLine: 9 },
          columnLine: { startLine: 1, endLine: 2 },
        },
      },
      {
        title: 'Ảnh đại diện',
        for: 'product_image',
        class: 'form__title',
        position: {
          rowLine: { startLine: 2, endLine: 3 },
          columnLine: { startLine: 6, endLine: 7 },
        },
      },
    ],
    fields: [
      {
        categoryTag: 'input',
        type: 'text',
        attribute: {
          id: 'product_id',
          position: {
            rowLine: { startLine: 1, endLine: 2 },
            columnLine: { startLine: 2, endLine: 4 },
          },
          formControlName: 'idProduct',
        },
      },
      {
        categoryTag: 'input',
        type: 'text',
        attribute: {
          id: 'product_name',
          position: {
            rowLine: { startLine: 2, endLine: 3 },
            columnLine: { startLine: 2, endLine: 6 },
          },
          formControlName: 'nameProduct',
        },
      },
      {
        categoryTag: 'input',
        type: 'text',
        attribute: {
          id: 'product_name--second',
          position: {
            rowLine: { startLine: 3, endLine: 4 },
            columnLine: { startLine: 2, endLine: 6 },
          },
          formControlName: 'nameProduct',
        },
      },
      {
        categoryTag: 'input',
        type: 'text',
        attribute: {
          id: 'product_unit',
          position: {
            rowLine: { startLine: 4, endLine: 5 },
            columnLine: { startLine: 2, endLine: 4 },
          },
          formControlName: 'nameProduct',
        },
      },
      {
        categoryTag: 'select',
        options: [
          { title: 'Type 1', value: 1 },
          { title: 'Type 2', value: 2 },
          { title: 'Type 3', value: 3 },
        ],
        attribute: {
          id: 'product_type',
          position: {
            rowLine: { startLine: 5, endLine: 6 },
            columnLine: { startLine: 2, endLine: 5 },
          },
          formControlName: 'nameProduct',
        },
      },
      {
        categoryTag: 'select',
        options: [
          { title: 'Group 1', value: 1 },
          { title: 'Group 2', value: 2 },
          { title: 'Group 3', value: 3 },
        ],
        attribute: {
          id: 'product_group',
          position: {
            rowLine: { startLine: 6, endLine: 7 },
            columnLine: { startLine: 2, endLine: 5 },
          },
          formControlName: 'nameProduct',
        },
      },
      {
        categoryTag: 'input',
        type: 'checkbox',
        attribute: {
          id: 'isAutoItemCodeProduct',
          position: {
            rowLine: { startLine: 7, endLine: 8 },
            columnLine: { startLine: 2, endLine: 3 },
          },
          formControlName: 'nameProduct',
        },
      },
    ],
  };
}
