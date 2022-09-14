//**data type */
export type UnitOfMeasure = MinMax | Min | Max | string;
export interface MinMax {
  min: string;
  max: string;
}
export interface Min extends Pick<MinMax, 'min'> {}
export interface Max extends Pick<MinMax, 'max'> {}
export interface PositionLine {
  startLine: number;
  endLine: number;
}
export interface PositionGridItem {
  rowLine: PositionLine;
  columnLine: PositionLine;
}
interface ControlLayoutGridForm {
  labels: Label[];
  input: ControlFormType[];
}
type ControlFormType = Input | Select | Textarea;
type CategoryTag = 'input' | 'select' | 'textarea';
type InputType = 'text' | 'checkbox' | 'radio';
interface Input {
  categoryTag: CategoryTag;
  type: InputType;
  attribute: Attribute;
}
interface Select {
  categoryTag: CategoryTag;
  title: string;
  option: {
    title: string;
    value: any;
  };
}
interface Textarea {
  categoryTag: CategoryTag;
  attribute: Attribute;
}
interface Label {
  title: string;
  id?: string;
  class?: string;
  for: string;
  position: PositionGridItem;
}

interface Attribute {
  id: string;
  class?: string;
  name?: string;
  placeholder?: string;
  position: PositionGridItem;
  formControlName: string;
}

function doSomething() {
  let controls: ControlLayoutGridForm = {
    labels: [
      {
        title: 'Mã Vật Tư',
        for: 'product_id',
        class: 'form__title',
        position: {
          rowLine: { startLine: 0, endLine: 2 },
          columnLine: { startLine: 0, endLine: 2 },
        },
      },
    ],
    input: [
      {
        categoryTag: 'input',
        type: 'text',
        attribute: {
          id: 'product_id',
          position: {
            rowLine: { startLine: 0, endLine: 2 },
            columnLine: { startLine: 0, endLine: 2 },
          },
          formControlName: 'idProduct',
        },
      },
    ],
  };
}
