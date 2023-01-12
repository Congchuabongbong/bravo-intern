import * as wjChart from '@grapecity/wijmo.chart';
import { isFlexDirectionRow, isFloatLeft, isFloatRight, isInFlow, isInline } from './core/css.util';

import { ISiblings, textAttributes } from './core/type.util';
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
    Object.keys(pAttribute).forEach(key => {
      pElement.setAttribute(key, pAttribute[key]);
    });
  }

  public applyTextStyles(pSvgElement: SVGElement, pStyles: CSSStyleDeclaration): void {
    for (const textProperty of textAttributes) {
      const value = pStyles.getPropertyValue(textProperty);
      if (value) {
        pSvgElement.setAttribute(textProperty, value);
      }
    }
    pSvgElement.setAttribute('fill', pStyles.color);
  }

  //*scan sibling node nếu nó là inline hoặc flex direction rows hoặc float
  public scanSiblingsNode(pNode: Node, pbIsCheckBelong = false): ISiblings {
    const _leftSideCurrentNode: ChildNode[] = [];
    const _rightSideCurrentNode: ChildNode[] = [];
    const _parenNode = <Element>pNode.parentNode;
    if (!_parenNode) return { leftSideCurrentNode: _leftSideCurrentNode, rightSideCurrentNode: _rightSideCurrentNode };
    const parentStyles = getComputedStyle(pNode.parentNode as Element);
    let _nextSibling = pNode.nextSibling;
    let _previousSibling = pNode.previousSibling;
    let _parentRect = _parenNode.getBoundingClientRect();
    let _nPaddingLeft = +parentStyles.paddingLeft.replace('px', '');
    let _nPaddingRight = +parentStyles.paddingRight.replace('px', '');
    //case next sibling pNode
    if (_parenNode.lastChild !== pNode) {
      while (_nextSibling) {
        switch (_nextSibling.nodeType) {
          case Node.COMMENT_NODE:
            break;
          case Node.TEXT_NODE:
            _rightSideCurrentNode.push(_nextSibling);
            break;
          case Node.ELEMENT_NODE:
            const _nextSiblingRect = (_nextSibling as Element).getBoundingClientRect();
            /* Nếu  node có tọa độ nằm ngoài phần tử cha thì bỏ qua*/
            if (pbIsCheckBelong && (((_parentRect.left + _parentRect.width) < (_nextSiblingRect.left + _nPaddingRight)) || ((_parentRect.top + _parentRect.height) < _nextSiblingRect.top) || (_parentRect.left > (_nextSiblingRect.left - _nPaddingLeft)) || (_parentRect.top > _nextSiblingRect.top))) break;
            const computedNode = getComputedStyle(_nextSibling as Element);
            if (isInFlow(computedNode) || isFlexDirectionRow(parentStyles) || isInline(computedNode)) {
              isFloatLeft(computedNode) ? _leftSideCurrentNode.push(_nextSibling) : _rightSideCurrentNode.push(_nextSibling);
            }
            break;
          default:
            break;
        }
        _nextSibling = _nextSibling.nextSibling;
      }
    }
    //case previous sibling node
    if (_parenNode.firstChild !== pNode) {
      while (_previousSibling) {
        switch (_previousSibling.nodeType) {
          case Node.COMMENT_NODE:
            break;
          case Node.TEXT_NODE:
            _leftSideCurrentNode.push(_previousSibling);
            break;
          case Node.ELEMENT_NODE:
            const _previousSiblingRect = (_previousSibling as Element).getBoundingClientRect();
            /* Nếu  node có tọa độ nằm ngoài phần tử cha thì bỏ qua*/
            if (pbIsCheckBelong && (((_parentRect.left + _parentRect.width) < (_previousSiblingRect.left + _nPaddingRight)) || ((_parentRect.top + _parentRect.height) < _previousSiblingRect.top) || (_parentRect.left > (_previousSiblingRect.left - _nPaddingLeft)) || (_parentRect.top > _previousSiblingRect.top))) break;
            const computedNode = getComputedStyle(_previousSibling as Element);
            if (isInFlow(computedNode) || isFlexDirectionRow(parentStyles) || isInline(computedNode)) {
              isFloatRight(computedNode) ? _rightSideCurrentNode.push(_previousSibling) : _leftSideCurrentNode.push(_previousSibling);
            }
            break;
          default:
            break;
        }
        _previousSibling = _previousSibling.previousSibling;
      }
    }
    return { leftSideCurrentNode: _leftSideCurrentNode, rightSideCurrentNode: _rightSideCurrentNode };
  }

  public isFirstNode(pNode: Node, pnType: number): boolean {
    const _parentNode = pNode.parentNode;
    if (!_parentNode) return false;
    let _firstChild = _parentNode.firstChild || pNode;
    while (_firstChild.nodeType !== pnType) {
      if (!_firstChild.nextSibling) return false;
      _firstChild = _firstChild.nextSibling;
    }
    return _firstChild === pNode;
  };

  public isLastNode(pNode: Node, pnType: number): boolean {
    const _parentNode = pNode.parentNode;
    if (!_parentNode) return false;
    let lastChild = _parentNode.lastChild || pNode;
    while (lastChild.nodeType !== pnType) {
      if (!lastChild.previousSibling) return false;
      lastChild = lastChild.previousSibling;
    }
    return lastChild === pNode;
  };

  public isOnlyNode(pNode: Node, pnType: number): boolean {
    return this.isFirstNode(pNode, pnType) && this.isLastNode(pNode, pnType);
  }
}
