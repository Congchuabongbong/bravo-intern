import * as wjChart from '@grapecity/wijmo.chart';
import { isFlexDirectionRow, isFloatLeft, isFloatRight, isInFlow, isInline } from './core/css.util';
import { textAttributes } from './core/text.type';
import { ISiblings } from './bravo.flexGrid.svg.engine';
import { creatorSVG } from './core/svg.engine.util';
type Align = 'LeftTop' |
  'LeftCenter' |
  'LeftBottom' |
  'CenterTop' |
  'CenterCenter' |
  'CenterBottom' |
  'RightCenter' |
  'RightBottom'
  | 'Other';

interface IDimensionOfPadding {
  paddingLeft: number;
  paddingRight: number;
  paddingBottom: number;
  paddingTop: number;
}
export function roundNumber(num: number) {
  return Math.round(num);
}
export class BravoSvgEngine extends wjChart._SvgRenderEngine {
  //**TODO */




  constructor(_anchorElement: HTMLElement) {
    super(_anchorElement);
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

  //TODO: Add By Me
  public static applyAttribute(pElement: Element, pAttribute: Record<string, any>) {
    console.log(pAttribute);
    Object.keys(pAttribute).forEach(key => {
      pElement.setAttribute(key, pAttribute[key]);
    });
  }

  public applyTextStyles(svgElement: SVGElement, styles: CSSStyleDeclaration): void {
    for (const textProperty of textAttributes) {
      const value = styles.getPropertyValue(textProperty);
      if (value) {
        svgElement.setAttribute(textProperty, value);
      }
    }
    svgElement.setAttribute('fill', styles.color);
  }

  //*scan sibling node nếu nó là inline hoặc flex direction rows hoặc float
  public scanSiblingsNode(node: Node): ISiblings {
    const leftSideCurrentNode: ChildNode[] = [];
    const rightSideCurrentNode: ChildNode[] = [];
    if (!node.parentNode) return { leftSideCurrentNode, rightSideCurrentNode };
    const parentStyles = getComputedStyle(node.parentNode as Element);
    let nextSibling = node.nextSibling;
    let previousSibling = node.previousSibling;
    //case next sibling node
    if (node.parentNode.lastChild !== node) {
      while (nextSibling) {
        switch (nextSibling.nodeType) {
          case Node.COMMENT_NODE:
            break;
          case Node.TEXT_NODE:
            rightSideCurrentNode.push(nextSibling);
            break;
          case Node.ELEMENT_NODE:
            const computedNode = getComputedStyle(nextSibling as Element);
            if (isInFlow(computedNode) || isFlexDirectionRow(parentStyles) || isInline(computedNode)) {
              isFloatLeft(computedNode) ? leftSideCurrentNode.push(nextSibling) : rightSideCurrentNode.push(nextSibling);
            }
            break;
          default:
            break;
        }
        nextSibling = nextSibling.nextSibling;
      }
    }
    //case previous sibling node
    if (node.parentNode.firstChild !== node) {
      while (previousSibling) {
        switch (previousSibling.nodeType) {
          case Node.COMMENT_NODE:
            break;
          case Node.TEXT_NODE:
            leftSideCurrentNode.push(previousSibling);
            break;
          case Node.ELEMENT_NODE:
            const computedNode = getComputedStyle(previousSibling as Element);
            if (isInFlow(computedNode) || isFlexDirectionRow(parentStyles) || isInline(computedNode)) {
              isFloatRight(computedNode) ? rightSideCurrentNode.push(previousSibling) : leftSideCurrentNode.push(previousSibling);
            }
            break;
          default:
            break;
        }
        previousSibling = previousSibling.previousSibling;
      }
    }
    return { leftSideCurrentNode, rightSideCurrentNode };
  }

  public isFirstNode(node: Node, type: number): boolean {
    const parentNode = node.parentNode;
    if (!parentNode) return false;
    let firstChild = parentNode.firstChild || node;
    while (firstChild.nodeType !== type) {
      if (!firstChild.nextSibling) return false;
      firstChild = firstChild.nextSibling;
    }
    return firstChild === node;
  };
  public isLastNode(node: Node, type: number): boolean {
    const parentNode = node.parentNode;
    if (!parentNode) return false;
    let lastChild = parentNode.lastChild || node;
    while (lastChild.nodeType !== type) {
      if (!lastChild.previousSibling) return false;
      lastChild = lastChild.previousSibling;
    }
    return lastChild === node;
  };

  public isOnlyNode(node: Node, type: number): boolean {
    return this.isFirstNode(node, type) && this.isLastNode(node, type);
  }




}
