export enum CellStyleEnum {
  Normal = 0, // cells //x
  Alternate = 1,
  Fixed = 2, // ColumnsHeader
  Highlight = 3,
  Focus = 4,
  Editor = 5,
  Search = 6,
  Frozen = 7, //x
  FrozenAlternate = 8,
  NewRow = 9,
  EmptyArea = 10,
  SelectedColumnHeader = 11,
  SelectedRowHeader = 12,
  GrandTotal = 13,
  Subtotal0 = 14,
  Subtotal1 = 15,
  Subtotal2 = 16,
  Subtotal3 = 17,
  Subtotal4 = 18,
  Subtotal5 = 19,
  FilterEditor = 20,
  FirstCustomStyle = 21,
  RowHeader = 22,
  ColumnsFooter = 25, //add by me
  NullStyle = 23,
  NoCaptionColumn = 24
}
export enum StyleElementFlags {
  None = 0,
  Font = 1,
  BackColor = 2,
  Margins = 8,
  Border = 16,
  TextAlign = 32,
  ImageAlign = 128,
  ImageSpacing = 256,
  WordWrap = 1024,
  Display = 2048,
  TextDirection = 262144,
  BackgroundImage = 2097152,
  LineHeight = 8388608,
}


