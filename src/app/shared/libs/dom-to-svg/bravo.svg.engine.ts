import * as wjChart from '@grapecity/wijmo.chart';
import {
  Point
} from '@grapecity/wijmo';
import { Subscription, BehaviorSubject } from 'rxjs';
import { textAttributes } from './core/text';
import { hasUniformBorder } from './core/css';
type Align = 'LeftTop' |
  'LeftCenter' |
  'LeftBottom' |
  'CenterTop' |
  'CenterCenter' |
  'CenterBottom' |
  'RightCenter' |
  'RightBottom'
  | 'Other';

export function roundNumber(num: number) {
  return Math.round(num);
}
export class BravoSvgEngine extends wjChart._SvgRenderEngine {
  //? anchor element
  public anchorElement!: Element;
  public anchorElementCoordinates!: Point;
  public anchorElementBoundingRect!: DOMRect;
  //? captureElement
  public captureElement?: Element;
  public captureElementCoordinates?: Point;
  public captureElementBoundingRect?: DOMRect;
  private static reSizeViewPortSubject = new BehaviorSubject<{ width: number, height: number; }>({ width: 0, height: 0 });
  public reSizeViewPortAction$ = BravoSvgEngine.reSizeViewPortSubject.asObservable();
  private reSizeViewPortSubscription = new Subscription();
  constructor(_anchorElement: HTMLElement, _captureElement?: Element) {
    super(_anchorElement);
    //Todo: lazy initialize
    //anchor
    const { x: anchorX, y: anchorY, ...anchorRest } = _anchorElement.getBoundingClientRect();
    this.anchorElement = _anchorElement;
    this.anchorElementCoordinates = new Point(anchorX, anchorY);
    this.anchorElementBoundingRect = { x: anchorX, y: anchorY, ...anchorRest };
    //capture
    if (_captureElement) {
      const { x: captureX, y: captureY, ...captureRest } = _captureElement.getBoundingClientRect();
      this.captureElement = _captureElement;
      this.captureElementCoordinates = new Point(captureX, captureY);
      this.captureElementBoundingRect = { x: captureX, y: captureY, ...captureRest };
      this.reSizeViewPortSubscription = this.reSizeViewPortAction$.subscribe(size => {
        this.setViewportSize(size.width, size.height);
      });
    }
  }
  override endRender(): void {
    super.endRender();
    this.reSizeViewPortSubscription.unsubscribe();
  }
  public static onResizeViewPortAction(size: { width: number, height: number; }) {
    BravoSvgEngine.reSizeViewPortSubject.next(size);
  }


  public calculatePositionInsideRect(pnWidth: number, pnHeight: number, pzAlign: Align) {
    let _nX1 = 0, _nX2 = 0, _nY1 = 0, _nY2 = 0;
    let _rectParent = this.element.getBoundingClientRect();
    if (_rectParent.width < pnWidth) pnWidth = _rectParent.width;
    if (_rectParent.height < pnHeight) pnHeight = _rectParent.height;
    switch (pzAlign) {
      case 'LeftTop':
        _nX2 = pnWidth;
        _nY2 = pnHeight;
        break;
      case 'LeftCenter':
        _nX2 = roundNumber(pnWidth);
        _nY1 = (roundNumber(_rectParent.height) / 2) - (roundNumber(pnHeight / 2));
        _nY2 = (roundNumber(_rectParent.height) / 2) + (roundNumber(pnHeight) / 2);
        break;
      case 'LeftBottom':
        _nX2 = roundNumber(pnWidth);
        _nY1 = roundNumber(_rectParent.height) - roundNumber(pnHeight);
        _nY2 = roundNumber(_rectParent.height);
        break;
      case 'CenterTop':
        _nX1 = (roundNumber(_rectParent.width) / 2) - (roundNumber(pnWidth) / 2);
        _nX2 = _nX1 + roundNumber(pnWidth);
        _nY2 = roundNumber(pnHeight);
        break;
      case 'CenterCenter':
        _nX1 = (roundNumber(_rectParent.width) / 2) - (roundNumber(pnWidth) / 2);
        _nX2 = _nX1 + roundNumber(pnWidth);
        _nY1 = (roundNumber(_rectParent.height) / 2) - (roundNumber(pnHeight) / 2);
        _nY2 = (roundNumber(_rectParent.height) / 2) + (roundNumber(pnHeight) / 2);
        break;
      case 'CenterBottom':
        _nX1 = (roundNumber(_rectParent.width) / 2) - (roundNumber(pnWidth) / 2);
        _nX2 = _nX1 + roundNumber(pnWidth);
        _nY1 = roundNumber(_rectParent.height) - roundNumber(pnHeight);
        _nY2 = roundNumber(_rectParent.height);
        break;
      case 'RightCenter':
        _nX1 = roundNumber(_rectParent.width) - roundNumber(pnWidth);
        _nX2 = _nX1 + roundNumber(pnWidth);
        _nY1 = (roundNumber(_rectParent.height) - (roundNumber(pnHeight) / 2));
        _nY2 = (roundNumber(_rectParent.height) / 2) + (roundNumber(pnHeight) / 2);
        break;
      case 'RightBottom':
        _nX1 = roundNumber(_rectParent.width) - roundNumber(pnWidth);
        _nX2 = _nX1 + roundNumber(pnWidth);
        _nY1 = roundNumber(_rectParent.height) - roundNumber(pnHeight);
        _nY2 = roundNumber(_rectParent.height);
        break;
      // case StyleTextImageAlign.GeneralTop:
      // case StyleTextImageAlign.GeneralCenter:
      // case StyleTextImageAlign.GeneralBottom:
      default:
        _nX1 = roundNumber(_rectParent.width) - roundNumber(pnWidth);
        _nX2 = _nX1 + pnWidth;
        _nY2 = pnHeight;
    }
    return { x1: roundNumber(_nX1), x2: roundNumber(_nX2), y1: roundNumber(_nY1), y2: roundNumber(_nY2) };
  }

  public static getPositionFillText(pElement: Element, pzAlign: Align) {
    let _attribute: Record<string, string> = {};
    let _rectSvg = pElement.getBoundingClientRect();
    let _pnBoxW = _rectSvg.width,
      _pnBoxH = _rectSvg.height;
    switch (pzAlign) {
      case 'LeftTop':
        _attribute['x'] = '0';
        _attribute['y'] = '0';
        _attribute['text-anchor'] = 'start';
        _attribute['dominant-baseline'] = 'text-before-edge';
        break;
      case 'LeftCenter':
        _attribute['x'] = '0';
        _attribute['y'] = (_pnBoxH / 2).toFixed(1);
        _attribute['text-anchor'] = 'start';
        _attribute['dominant-baseline'] = 'central';
        break;
      case 'LeftBottom':
        _attribute['x'] = '0';
        _attribute['y'] = _pnBoxH.toFixed();
        _attribute['text-anchor'] = 'start';
        _attribute['dominant-baseline'] = 'text-after-edge';
        break;
      case 'CenterTop':
        _attribute['x'] = (_pnBoxW / 2).toFixed(1);
        _attribute['y'] = '0';
        _attribute['text-anchor'] = 'middle';
        _attribute['dominant-baseline'] = 'text-before-edge';
        break;
      case 'CenterCenter':
        _attribute['x'] = (_pnBoxW / 2).toFixed(1);
        _attribute['y'] = (_pnBoxH / 2).toFixed(1);
        _attribute['text-anchor'] = 'middle';
        _attribute['dominant-baseline'] = 'central';
        break;
      case 'CenterBottom':
        _attribute['x'] = (_pnBoxW / 2).toFixed(1);
        _attribute['y'] = _pnBoxH.toFixed();
        _attribute['text-anchor'] = 'middle';
        _attribute['dominant-baseline'] = 'text-after-edge';
        break;
      case 'RightCenter':
        _attribute['x'] = _pnBoxW.toFixed();
        _attribute['y'] = (_pnBoxH / 2).toFixed(1);
        _attribute['text-anchor'] = 'end';
        _attribute['dominant-baseline'] = 'central';
        break;
      case 'RightBottom':
        _attribute['x'] = _pnBoxW.toFixed();
        _attribute['y'] = _pnBoxH.toFixed();
        _attribute['text-anchor'] = 'end';
        _attribute['dominant-baseline'] = 'text-after-edge';
        break;
      // case StyleTextImageAlign.GeneralTop:
      // case StyleTextImageAlign.GeneralCenter:
      // case StyleTextImageAlign.GeneralBottom:
      default:
        _attribute['x'] = _pnBoxW.toFixed();
        _attribute['y'] = '0';
        _attribute['text-anchor'] = 'end';
        _attribute['dominant-baseline'] = 'text-before-edge';
    }
    return _attribute;
  }

  public static setAttributeFromCssForSvgEl(pElement: SVGElement, styles: CSSStyleDeclaration) {
    styles.backgroundColor && pElement.setAttribute('fill', styles.backgroundColor || styles.background || '');
    !hasUniformBorder(styles) && pElement.setAttribute('stroke', styles.borderTopColor || styles.borderBottomColor || styles.borderLeftColor || styles.borderRightColor || 'rgb(0,0,0)');
    let strokeWidth = +styles.borderTopWidth.replace('px', '') || +styles.borderBottomWidth.replace('px', '') || +styles.borderLeftWidth.replace('px', '') || +styles.borderRightWidth.replace('px', '');
    strokeWidth ? pElement.setAttribute('stroke-width', `${strokeWidth}px`) : pElement.setAttribute('stroke-width', '1px');
  }


  public static applyAttribute(pElement: Element, pAttribute: Record<string, any>) {
    console.log(pAttribute);
    Object.keys(pAttribute).forEach(key => {
      pElement.setAttribute(key, pAttribute[key]);
    });
  }


  public static applyTextStyles(svgElement: SVGElement, styles: CSSStyleDeclaration): void {
    for (const textProperty of textAttributes) {
      const value = styles.getPropertyValue(textProperty);
      if (value) {
        svgElement.setAttribute(textProperty, value);
      }
    }
    svgElement.setAttribute('fill', styles.color);
  }



}
