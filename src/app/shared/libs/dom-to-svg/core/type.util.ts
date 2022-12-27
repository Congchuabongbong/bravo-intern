import { FontStyle } from './../bravo-graphics/font';
import { Point, Rect } from '@grapecity/wijmo';
import { GridPanel, CellRange } from '@grapecity/wijmo.grid';
import { BravoTextMetrics } from '../bravo-graphics/measure-text-canvas/bravo.canvas.measure.text';
import { Font } from '../bravo-graphics/font';

export enum TextAlign {
  Left = 'left',
  Center = 'center',
  Right = 'right',
  Start = 'start',
  End = 'end',
}

export type DominantBaseline = 'auto' | 'middle' | 'hanging';
export type TextAnchor = 'start' | 'middle' | 'end';
export type BehaviorText = {
  point: Point;
  dominantBaseline: DominantBaseline,
  textAnchor: TextAnchor;
  isTextFitWidthCell: boolean;
};

export interface ISiblings {
  leftSideCurrentNode: ChildNode[], rightSideCurrentNode: ChildNode[];
}
export interface IFont {
  fontFamily: string;
  fontSize: number | string;
  fontStyle: string;
};
export type PayloadCache = {
  panel: GridPanel;
  row: number;
  col: number;
  cellElement: HTMLElement;
  cellStyles: CSSStyleDeclaration;
  cellBoundingRect: Rect;
  group: Element;
  dimensionText: BravoTextMetrics | undefined,
  behaviorText: BehaviorText;
  cellRange: CellRange;
  cellValue: any;
};

export interface IPayloadEvent extends Pick<PayloadCache, 'panel' | 'row' | 'col' | 'cellValue'> {
  svgDrew?: Element;
}
