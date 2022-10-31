import { Aggregate, ICollectionView, DataType, Control } from '@grapecity/wijmo';
import { ICellTemplateFunction, DataMap, DataMapEditor, FlexGrid } from '@grapecity/wijmo.grid';
import { IGridLayout, IPositionGridItem } from './grid-layout.data.type';
export interface IWjFlexColumn {
    aggregate?: Aggregate;
    align?: string | null;
    allowDragging?: boolean;
    allowMerging?: boolean;
    allowResizing?: boolean;
    binding: string | null; // required
    cellTemplate?: string | ICellTemplateFunction | null;
    collectionView?: ICollectionView;
    cssClass?: string | null;
    cssClassAll?: string | null;
    currentSort?: string;
    currentSortIndex?: number;
    dataMap?: DataMap | null;
    dataMapEditor?: DataMapEditor;
    dataType?: DataType | null;
    describedById?: string | null;
    dropDownCssClass?: string | null;
    editor?: Control | null;
    format?: string | null;
    grid?: FlexGrid;
    header?: string | null;
    index?: number;
    inputType?: string | null;
    isContentHtml?: boolean;
    isReadOnly?: boolean;
    isRequired?: boolean | null;
    isSelected?: boolean;
    isVisible?: boolean;
    mask?: string | null;
    maxLength?: number | null;
    maxWidth?: number | null;
    minWidth?: number | null;
    multiLine?: boolean;
    name?: string | null;
    pos?: number;
    quickAutoSize?: boolean | null;
    renderSize?: number;
    renderWidth?: number;
    size?: number | null;
    sortMemberPath?: string | null;
    visible?: boolean;
    visibleIndex?: number;
    width?: any | null;
    wordWrap?: boolean;
}

export interface IWjFlexColumnConfig {
    flexColumns: IWjFlexColumn[],
}

export interface IWjFlexLayoutConfig {
    container: IGridLayout;
    mainGridData: IPositionGridItem;
    tabGridData?: IPositionGridItem;
}

export interface IWjFlexLayoutConfigs {
    layouts: IWjFlexLayoutConfig[];
}

