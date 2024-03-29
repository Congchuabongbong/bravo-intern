import { Point, Rect, Size as wjSize } from '@grapecity/wijmo';
import { CellRange, GridPanel } from '@grapecity/wijmo.grid';
import { BravoTextMetrics } from '../bravo-graphics/measure-text-canvas/bravo.canvas.measure.text';
export const textAttributes = new Set([
  'color',
  'font-family',
  'font-size',
  'font-size-adjust',
  'font-stretch',
  'font-style',
  'font-variant',
  'font-weight',
  'direction',
  'letter-spacing',
  'text-decoration',
  'text-decoration',
  'text-rendering',
  'unicode-bidi',
  'word-spacing',
  'writing-mode',
  'user-select', 'white-space',
  'text-align'
] as const);

export const borderAttributes = new Set([
  'border-right-width',
  'border-right-color',
  'border-bottom-width',
  'border-bottom-color'
] as const);

export enum TextAlign {
  //#text-align
  Left = 'left',
  Center = 'center',
  Right = 'right',
  Start = 'start',
  End = 'end',
  //#Flex
  //#Center
  CenterTop = 'center-top',
  CenterCenter = 'center-center',
  CenterBottom = 'center-bottom',
  //Left
  LeftTop = 'left-top',
  LeftCenter = 'left-center',
  LeftBottom = 'left-bottom',
  //Right
  RightTop = 'right-top',
  RightCenter = 'right-center',
  RightBottom = 'right-bottom',
  //General
  GeneralTop = 'general-top',
  GeneralCenter = 'general-center',
  GeneralBottom = 'general-bottom',
}

export type DominantBaseline = 'auto' | 'middle' | 'hanging';

export type TextAnchor = 'start' | 'middle' | 'end';

export type BehaviorText = {
  point: Point;
  dominantBaseline: DominantBaseline,
  textAnchor: TextAnchor;
  isTextFitWidthCell: boolean;
};

export type Payload = {
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
  isRowGroup: boolean;
};

export type StylesCache = {
  stylesNormal: Record<string, string> | CSSStyleDeclaration | undefined;
  stylesAlternate: Record<string, string> | CSSStyleDeclaration | undefined;
  stylesColsHeader: Record<string, string> | CSSStyleDeclaration | undefined;
  stylesColsFooter: Record<string, string> | CSSStyleDeclaration | undefined;
  stylesRowsHeader: Record<string, string> | CSSStyleDeclaration | undefined;
  stylesFrozen: Record<string, string> | CSSStyleDeclaration | undefined;
  stylesNewRow: Record<string, string> | CSSStyleDeclaration | undefined;
  stylesGroupLv0: Record<string, string> | CSSStyleDeclaration | undefined;
  stylesGroupLv1: Record<string, string> | CSSStyleDeclaration | undefined;
  stylesGroupLv2: Record<string, string> | CSSStyleDeclaration | undefined;
  stylesGroupLv3: Record<string, string> | CSSStyleDeclaration | undefined;
  stylesGroupLv4: Record<string, string> | CSSStyleDeclaration | undefined;
  stylesGroupLv5: Record<string, string> | CSSStyleDeclaration | undefined;
};

export type CellPadding = {
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
};

export interface ISize extends Pick<wjSize, 'height' | 'width'> { };

export interface ISiblings {
  leftSideCurrentNode: ChildNode[], rightSideCurrentNode: ChildNode[];
}
export interface IFont {
  fontFamily: string;
  fontSize: number | string;
  fontStyle: string;
};

export interface IPayloadEvent extends Pick<Payload, 'panel' | 'row' | 'col' | 'cellValue'> {
  svgDrew?: Element;
}
