import { DataType, Event as wjEven, Point, Rect } from '@grapecity/wijmo';
import { CellRange, CellType, FlexGrid, GridPanel, GroupRow, Row } from '@grapecity/wijmo.grid';
import { CellStyleEnum } from '../../data-type/enum';
import { BravoGraphicsRenderer } from './bravo-graphics/bravo.graphics.renderer';
import { Font } from './bravo-graphics/font';
import { BravoTextMetrics } from './bravo-graphics/measure-text-canvas/bravo.canvas.measure.text';
import { BravoSvgEngine } from './bravo.svg.engine';
import { hasBorderBottom, hasBorderLeft, hasBorderRight, hasBorderTop, isInline, isTransparent, isCenterCenter, isCenterTop, isCenterBottom, isLeftTop, isRightTop, isRightCenter, isRightBottom, isLeftCenter, isLeftBottom } from './core/css.util';
import { isElement, isHTMLButtonElement, isHTMLImageElement, isHTMLInputElement, isHTMLSpanElement, isTextNode } from './core/dom.util';
import { arrowDown, arrowUp, collapse, expand, inputChecked, inputUnchecked, pinned, unpinned } from './core/icons.svg';
import { creatorSVG, declareNamespaceSvg, drawImage, drawText, getAcceptStylesBorderSvg, getAcceptStylesTextSvg, getBgRectFromStylesSetup, setAttrSvgIcon } from './core/svg.engine.util';
import { BehaviorText, CellPadding, IPayloadEvent, ISiblings, Payload, StylesCache, TextAlign } from './core/type.util';
class _NewRowTemplate extends Row {
}
/**
 * @desc: dùng kiết xuất ra flex grid svg thô hoặc chụp lại phần nhìn thấy của flex grid
 * @extends: BravoSvgEngine
*/
export default class FlexGridSvgEngine extends BravoSvgEngine {
  //*Declaration here...
  public anchorElement!: Element;
  public captureElement!: Element;
  public captureElementCoordinates!: Point;
  public flexGrid!: FlexGrid;
  private stylesCache!: StylesCache;
  private _parser!: DOMParser;
  private _stylesSetup!: Map<CellStyleEnum, Record<string, string>>;
  set stylesSetup(styles: Map<CellStyleEnum, Record<string, string>>) {
    this._stylesSetup = styles;
  }
  get stylesSetup() {
    return this._stylesSetup;
  }
  //*constructor
  constructor(_anchorElement: HTMLElement, _flex: FlexGrid) {
    super(_anchorElement);
    //? lazy initialize
    // anchorElement
    this.anchorElement = _anchorElement;
    this.flexGrid = _flex;
    //capture
    this.captureElement = _flex.hostElement;
    const { x: _xCaptureElement, y: _yCaptureElement } = this.captureElement.getBoundingClientRect();
    this.captureElementCoordinates = new Point(_xCaptureElement, _yCaptureElement);
    this._stylesBase = getComputedStyle(this.flexGrid.hostElement);
    this._parser = new DOMParser();
  }
  /**
  * @desc: thay đổi gốc trục tọa độ của phần tử theo Dom  về gốc tọa độ của Svg
  * @pram pElDOMRect : DOMRect (tọa độ của phần tử được vẽ)
  * @return: Rect
  */
  private _changeOriginCoordinates(pElDOMRect: DOMRect): Rect {
    const _boundingRect = Rect.fromBoundingRect(pElDOMRect);
    _boundingRect.left -= this.captureElementCoordinates.x;
    _boundingRect.top -= this.captureElementCoordinates.y;
    return _boundingRect;
  }
  /**
   * @desc: Hàm này dùng để export ra svg nhìn thấy được trong flex grid
   * @return : SvgElement
  */
  public renderFlexSvgVisible(): SVGElement {
    try {
      this.beginRender();
      //?draw cells panel and cells frozen
      this._drawCellPanel(this.flexGrid.cells);
      this._drawCellPanelFrozen(this.flexGrid.cells);
      //?draw cells columns header and cells columns header frozen
      this._drawCellPanel(this.flexGrid.columnHeaders);
      this._drawCellPanelFrozen(this.flexGrid.columnHeaders);
      //?draw cells columns footer and cells columns footer frozen
      this._drawCellPanel(this.flexGrid.columnFooters);
      this._drawCellPanelFrozen(this.flexGrid.columnFooters);
      //?draw cells rows header and cells row header frozen
      this._drawCellPanel(this.flexGrid.rowHeaders);
      this._drawCellPanelFrozen(this.flexGrid.rowHeaders);
      this._drawCellPanel(this.flexGrid.topLeftCells);
      //?set viewport
      this.setViewportSize(this.flexGrid.hostElement.offsetWidth, this.flexGrid.hostElement.offsetHeight);
      const _svgEl = declareNamespaceSvg(this.element as SVGElement);
      return _svgEl;
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when render visible flex grid SVG!');
    } finally {
      this.endRender();
    }
  }
  /**
  * @desc: dùng để vẽ theo cell Panel : cells, columnsHeader,columnsFooter,...
  * @pram pPanel: GridPanel, pViewRange(optional): CellRange
  */
  private _drawCellPanel(pPanel: GridPanel, pViewRange?: CellRange) {
    const { row: _nRowStart, row2: _nRowEnd, col: _nColStart, col2: _nColEnd } = pViewRange || pPanel.viewRange;
    const _payload: Payload = {} as Payload;
    _payload.panel = pPanel;
    for (let _nColIndex = _nColStart; _nColIndex <= _nColEnd; _nColIndex++) {
      for (let _nRowIndex = _nRowStart; _nRowIndex <= _nRowEnd; _nRowIndex++) {
        const _cellEl = pPanel.getCellElement(_nRowIndex, _nColIndex);
        if (!_cellEl) continue;
        if ((_cellEl.className.includes('wj-group') || _cellEl.className.includes('wj-header') || _cellEl.className.includes('wj-footer')) && (pPanel.cellType === CellType.Cell || pPanel.cellType === CellType.ColumnHeader || pPanel.cellType === CellType.ColumnFooter)) {
          const cellRange = this.flexGrid.getMergedRange(pPanel, _nRowIndex, _nColIndex);
          if (cellRange && !cellRange.isSingleCell) {
            const columnStartGroup = cellRange.col;
            const rowStartGroup = cellRange.row;
            //column ignore when drew first time
            if (_nColStart <= columnStartGroup && _nColIndex > columnStartGroup) {
              continue;
            } else if (_nColStart > columnStartGroup && _nColIndex > _nColStart) {
              continue;
            }
            //row ignore when drew first time
            if (_nRowStart <= rowStartGroup && _nRowIndex > rowStartGroup) {
              continue;
            } else if (_nRowStart > rowStartGroup && _nRowIndex > _nRowStart) {
              continue;
            }
          }
        }
        const _groupSvgEl = this.startGroup(_cellEl.className);
        /*
        ?Save lại các dữ liệu trong một quy trình vẽ theo cell panel;
        */
        _payload.cellElement = _cellEl;
        _payload.cellStyles = getComputedStyle(_cellEl);
        _payload.cellBoundingRect = this._changeOriginCoordinates(_cellEl.getBoundingClientRect());
        _payload.row = _nRowIndex;
        _payload.col = _nColIndex;
        _payload.group = _groupSvgEl;
        this._drawRectCell(_payload);
        this.endGroup();
      }
    }
  }

  private _drawCellPanelFrozen(pPanel: GridPanel) {
    /*
    ?Trường hợp cột bị pin hay đóng băng thì thay đổi lại view range của các cột nhìn thấy sang các cột bị đóng băng!
    */
    if (!this.flexGrid.frozenColumns) return;
    const { row2: _nRow2, row: _nRow } = pPanel.viewRange;
    const _viewRange = new CellRange(_nRow, 0, _nRow2, this.flexGrid.columns.frozen - 1);
    this._drawCellPanel(pPanel, _viewRange);
  }

  private _drawRectCell(payload: Payload): void {
    const _cellBoundingRect = payload.cellBoundingRect;
    const _cellStyles = payload.cellStyles;
    const _rectSvgEl = this.drawRect(_cellBoundingRect.left, _cellBoundingRect.top, _cellBoundingRect.width, _cellBoundingRect.height);
    _cellStyles.backgroundColor && !isTransparent(_cellStyles.backgroundColor) && _rectSvgEl.setAttribute('fill', _cellStyles.backgroundColor || 'rgba(0, 0, 0, 0)');
    this._drawBorderCell(payload);
    /*
    ?Sau khi vẽ xong rectangle bắt đầu quét các phần tử bên trong cell và draw theo các trường hợp image,button,text node,...
    */
    this._scanCell(payload.cellElement, payload);
  }

  private _drawBorderCell(payload: Payload) {
    const { left: _nLeft, top: _nTop, bottom: _nBottom, right: _nRight } = payload.cellBoundingRect;
    const _borders = getAcceptStylesBorderSvg(payload.cellStyles);
    if (hasBorderBottom(payload.cellStyles)) {
      const _lineSvgEl = this.drawLine(_nLeft, _nBottom, _nRight, _nBottom);
      _lineSvgEl.setAttribute('stroke-width', _borders['borderBottomWidth']);
      _lineSvgEl.setAttribute('stroke', _borders['borderBottomColor']);
    }
    if (hasBorderTop(payload.cellStyles)) {
      const _lineSvgEl = this.drawLine(_nLeft, _nTop, _nRight, _nTop);
      _lineSvgEl.setAttribute('stroke-width', _borders['borderTopWidth']);
      _lineSvgEl.setAttribute('stroke', _borders['borderTopColor']);
    }
    if (hasBorderRight(payload.cellStyles)) {
      const _lineSvgEl = this.drawLine(_nRight, _nTop, _nRight, _nBottom);
      _lineSvgEl.setAttribute('stroke-width', _borders['borderRightWidth']);
      _lineSvgEl.setAttribute('stroke', _borders['borderRightColor']);
    }
    if (hasBorderLeft(payload.cellStyles)) {
      const _lineSvgEl = this.drawLine(_nLeft, _nTop, _nLeft, _nBottom);
      _lineSvgEl.setAttribute('stroke-width', _borders['borderLeftWidth']);
      _lineSvgEl.setAttribute('stroke', _borders['borderLeftColor']);
    }
  }

  private _scanCell(pElScanned: Element, payload: Payload) {
    if (pElScanned.hasChildNodes()) {
      pElScanned.childNodes.forEach((pNode: Node) => {
        //?case text node;
        if (isTextNode(pNode)) {
          const _svgEl = this._drawTextNodeInCell(pNode, payload);
          _svgEl && payload.group.appendChild(_svgEl as Node);
        }
        //?case image;
        if (isHTMLImageElement(pNode as HTMLElement)) {
          const _svgEl = this._drawImageInCell(pNode as HTMLImageElement, payload);
          _svgEl && payload.group.appendChild(_svgEl as Node);
        }
        //?case input checkbox
        if (isHTMLInputElement(pNode as Element)) { // case input checkbox
          this._drawCheckBox(pNode, payload);
        };
        //?case button pin
        if (this.flexGrid.allowPinning && isHTMLButtonElement(pNode as Element) && (pNode as Element).className.includes('wj-elem-pin')) {
          this._drawPin(pNode, payload);
        }
        //?case collapse/expand
        if (isHTMLButtonElement(pNode as Element) && (pNode as Element).className.includes('wj-elem-collapse')) {
          this._drawGroupBtn(pNode, payload);
        }
        //?case btn sort
        if (this.flexGrid.allowSorting && isHTMLSpanElement(pNode as Element) && ((pNode as Element).className.includes('wj-glyph-up') || (pNode as Element).className.includes('wj-glyph-down'))) {
          this._drawSortBtn(pNode, payload);
        }

        this._scanCell(pNode as Element, payload);
      });
    }
  }
  //*Handle and draw Text Here:
  private _calculateBehaviorTextNode(pTextNode: Text, payload: Payload): BehaviorText {
    try {
      const { parentBoundingRect: _parentBoundingRect, parentStyles: _parentStyles } = this._getInformationParentNode(pTextNode, payload);
      let _nDeviationHeight = 0;
      payload.dimensionText = this._measureTextNode(pTextNode, payload);
      //?kiểm tra trường hợp nếu là inline element tính độ chênh lệch chiều cao nội dung bên trong và thẻ chứa nội dung
      if (isInline(_parentStyles)) {
        let _heightOfText = payload.dimensionText?.lineHeight || 0;
        _nDeviationHeight = (_parentBoundingRect.height - _heightOfText) / 2;
      }
      const _zAlginText = _parentStyles.textAlign;
      const { leftTotalSiblingsWidth: _nLeftTotalSiblingsWidth, rightTotalSiblingsWidth: _nRightTotalSiblingsWidth } = this._getTotalWidthSiblingNode(pTextNode, payload);
      const _nPaddingLeft = +_parentStyles.paddingLeft.replace('px', '');
      const _nPaddingTop = +_parentStyles.paddingTop.replace('px', '');
      const _nPaddingRight = +_parentStyles.paddingRight.replace('px', '');
      const _nXTextDefault = _parentBoundingRect.left + _nPaddingLeft;
      const _nYTextDefault = _parentBoundingRect.top + _nPaddingTop + _nDeviationHeight;
      /*
      ?tạo default behavior text base.
      ?default text alignment left and dominant baseline 'hanging', textAnchor: 'start'
      */
      let _behaviorTextBase: Partial<BehaviorText> = { dominantBaseline: 'hanging', point: new Point(_nXTextDefault, _nYTextDefault), textAnchor: 'start' };
      let _bIsFitContent: boolean = this._isTextNodeFitWidthCell(pTextNode, payload);
      switch (_zAlginText) {
        case TextAlign.Left:
        case TextAlign.Start:
          _behaviorTextBase.point!.x += _nLeftTotalSiblingsWidth;
          _behaviorTextBase.textAnchor = 'start';
          _behaviorTextBase.isTextFitWidthCell = _bIsFitContent;
          return (_behaviorTextBase as BehaviorText);
        case TextAlign.Center:
          if (_bIsFitContent) {
            _behaviorTextBase.point!.x += (_parentBoundingRect.width - _nLeftTotalSiblingsWidth - _nRightTotalSiblingsWidth) / 2 - _nPaddingLeft;
            _behaviorTextBase.textAnchor = 'middle';
            _behaviorTextBase.isTextFitWidthCell = true;
            return (_behaviorTextBase as BehaviorText);
          }
          _behaviorTextBase.isTextFitWidthCell = false;
          return (_behaviorTextBase as BehaviorText);
        case TextAlign.Right:
        case TextAlign.End:
          if (_bIsFitContent) {
            _behaviorTextBase.point!.x += (_parentBoundingRect.width - _nPaddingRight - _nPaddingLeft) - _nRightTotalSiblingsWidth;
            _behaviorTextBase.textAnchor = 'end';
            _behaviorTextBase.isTextFitWidthCell = true;
            return (_behaviorTextBase as BehaviorText);
          }
          _behaviorTextBase.isTextFitWidthCell = false;
          return (_behaviorTextBase as BehaviorText);
        default:
          _behaviorTextBase.isTextFitWidthCell = true;
          return (_behaviorTextBase as BehaviorText);
      }
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when trying to calculate position text node!');
    }
  };
  /**
   * @description: Kiểm tra xem liệu chiều rộng của text node có vừa với chiều rộng của node chứa nó hay không
   * @param: pTextNode: Text, payload: Payload
   * @return: boolean
  */
  private _isTextNodeFitWidthCell(pTextNode: Text, payload: Payload): boolean {
    try {
      const { parentBoundingRect: _parentBoundingRect, parentStyles: _parentStyles } = this._getInformationParentNode(pTextNode, payload);
      const _nPaddingLeft = +_parentStyles.paddingLeft.replace('px', '');
      const _nPaddingRight = +_parentStyles.paddingRight.replace('px', '');
      const { leftTotalSiblingsWidth: _nLeftTotalSiblingsWidth, rightTotalSiblingsWidth: _nRightTotalSiblingsWidth } = this._getTotalWidthSiblingNode(pTextNode, payload);
      const _nTextWidth = payload.dimensionText?.width || 0;
      return _nTextWidth <= (_parentBoundingRect.width - _nLeftTotalSiblingsWidth - _nRightTotalSiblingsWidth - _nPaddingLeft - _nPaddingRight);
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when check the width of the text content to see if it fits the width of the parent!');
    }
  }
  /**
    * @description: một expensive function, dùng để tính toán kích thước của text node dựa trến content của text node và font và kích thước của phần tử chá
    * @param: pTextNode: Text, pbBreakWords: boolean
    * @return: BravoTextMetrics | undefined
   */
  private _measureTextNode(pTextNode: Text, payload: Payload, pbBreakWords: boolean = false): BravoTextMetrics | undefined {
    try {
      const { parentNode: _parentNode, parentStyles: _parentStyles, parentBoundingRect: _parentBoundingRect } = this._getInformationParentNode(pTextNode, payload);
      if (!_parentNode) return undefined;
      const _font = new Font(_parentStyles.fontFamily, _parentStyles.fontSize, _parentStyles.fontWeight);
      const _dimensionOfText = BravoGraphicsRenderer.measureString(pTextNode.textContent as string, _font, _parentBoundingRect.width, pbBreakWords);
      return _dimensionOfText;
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when calculate  width of the text content!');
    }
  }

  private _drawTextNodeInCell(pTextNode: Text, payload: Payload): SVGElement | null {
    try {
      const { parentStyles: _parentStyles } = this._getInformationParentNode(pTextNode, payload);
      payload.behaviorText = this._calculateBehaviorTextNode(pTextNode, payload) as BehaviorText;
      let _nWidthTextNode = payload.dimensionText?.width || 0;
      /*
      ? Trường hợp không phải text node duy nhất hoặc là thẻ inline wrap text node
      ?Nếu width của cell nhỏ hơn tọa độ x của text return null ko draw
      ?Nếu width của cell nằm trong tọa độ x đến right thì thay đổi isTextFitWidthCell = false và switch case wrap svg
      */
      if (!this.isOnlyNode(pTextNode, Node.TEXT_NODE) || isInline(_parentStyles)) {
        if (payload.cellBoundingRect.width < payload.behaviorText.point.x) {
          return null;
        } else if (payload.cellBoundingRect.width > payload.behaviorText.point.x && payload.cellElement.offsetWidth < payload.behaviorText.point.x + _nWidthTextNode) {
          payload.behaviorText.isTextFitWidthCell = false;
        }
      }
      //?case swap text by svg
      if (!payload.behaviorText.isTextFitWidthCell) {
        const _svgWrap = this._wrapTextNodeIntoSvg(pTextNode, payload);
        return _svgWrap;
      }
      let _zTextContent = pTextNode.textContent || '';
      if (_zTextContent === 'Parent Id ') debugger;
      if (!this.isFirstNode(pTextNode, Node.TEXT_NODE)) {
        _zTextContent = ' '.concat(_zTextContent);
      }
      //fix case special character : &nbsp;
      payload.panel.cellType === CellType.ColumnHeader && (_zTextContent = _zTextContent.trimEnd().concat(' '));
      const _textSvgEl = drawText(_zTextContent, payload.behaviorText, _parentStyles, 'preserve');
      return _textSvgEl;
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when draw text in cell!!');
    }
  }
  /**
  * @description: Dùng để bọc svg bên ngoài text svg trong trường hợp width cửa text dài hơn chiều rộng của phần tử chứa
  * @param: pTextNode: Text, payload: Payload
  * @return: SVGElement | null
 */
  private _wrapTextNodeIntoSvg(pTextNode: Text, payload: Payload): SVGElement | null {
    try {
      const { parentStyles: _parentStyles, parentNode: _parentNode } = this._getInformationParentNode(pTextNode, payload);
      const _rectSvg: Partial<DOMRect> = {};
      const { leftTotalSiblingsWidth: _leftTotalSiblingsWidth, rightTotalSiblingsWidth: _rightTotalSiblingsWidth } = this._getTotalWidthSiblingNode(pTextNode, payload);
      const _nPaddingLeft = +payload.cellStyles.paddingLeft.replace('px', '') || 0;
      const _nPaddingRight = +payload.cellStyles.paddingRight.replace('px', '') || 0;
      /*
      ?case 1 inline wrap text: width svg = phần còn lại của width trừ đi tổng chiều rộng các phần tử anh em nằm bên trái và padding left và phải
      ?case 2 nếu là text node duy nhất thì trừ đi cả chiều rộng của các phần tử nằm bên phải!.
      ?case 3 nếu là ko là text node duy nhất thì không trừ chiều rộng của các phần tử bên phải(trừ sẽ bị âm)
      */
      if (isInline(_parentStyles)) {
        let { leftTotalSiblingsWidth: _leftTotalSiblingsWidth } = this._getTotalWidthSiblingNode(_parentNode, payload);
        _rectSvg.width = payload.cellBoundingRect.width - _leftTotalSiblingsWidth - _nPaddingLeft - _nPaddingRight;
      } else {
        _rectSvg.width = payload.cellBoundingRect.width - _leftTotalSiblingsWidth - _nPaddingLeft - _nPaddingRight;
        if (this.isOnlyNode(pTextNode, Node.TEXT_NODE)) {
          _rectSvg.width -= _rightTotalSiblingsWidth;
        }
      }
      _rectSvg.height = payload.cellElement.clientHeight || 0;
      if (_rectSvg.width <= 0 || _rectSvg.height <= 0) {
        return null;
      }
      _rectSvg.x = payload.behaviorText.point.x;
      _rectSvg.y = payload.behaviorText.point.y;
      const _svgWrapText = creatorSVG(_rectSvg, true);
      //draw text
      let _zTextContent = pTextNode.textContent || '';
      if (!this.isFirstNode(pTextNode, Node.TEXT_NODE)) {
        _zTextContent = ' '.concat(_zTextContent);
      }
      //fix case special character : &nbsp;
      _zTextContent = _zTextContent.trimEnd().concat(' ');
      const _textSvgEl = drawText(_zTextContent, payload.behaviorText as BehaviorText, _parentStyles, 'preserve');
      _textSvgEl.setAttribute('x', '0');
      _textSvgEl.setAttribute('y', '0');
      _svgWrapText.appendChild(_textSvgEl);
      payload.group.appendChild(_svgWrapText);
      return _svgWrapText;
    } catch (error) {
      console.error(error);
      throw new Error('Something wrong when wrap text in svg');
    }
  }
  //*util methods
  /**
    * @description:(expensive funtion) dùng để tính toán tổng chiều rộng của các phần tử anh chị em bên trái hoặc bên phải
    * @param: pSiblings: ChildNode[]
    * @return:number
   */
  private _calculateTotalWidthSiblings(pSiblings: ChildNode[], payload: Payload): number {
    let _nTotalWidth: number = pSiblings.reduce((pnAcc, pNode) => {
      if (isTextNode(pNode)) {
        const _dimensionOfText = this._measureTextNode(pNode, payload, false);
        if (_dimensionOfText) {
          pnAcc += _dimensionOfText.width;
        }
      }
      if (isElement(pNode)) {
        pnAcc += (pNode as HTMLElement).offsetWidth;
      }
      return pnAcc;
    }, 0);
    return _nTotalWidth;
  }

  private _getTotalWidthSiblingNode(pNode: Node, payload: Payload) {
    let _nRightTotalSiblingsWidth = 0;
    let _nLeftTotalSiblingsWidth = 0;
    const _siblings: ISiblings = this.scanSiblingsNode(pNode);
    if (_siblings.leftSideCurrentNode.length === 0 && _siblings.rightSideCurrentNode.length === 0) return { rightTotalSiblingsWidth: _nRightTotalSiblingsWidth, leftTotalSiblingsWidth: _nLeftTotalSiblingsWidth };
    _nLeftTotalSiblingsWidth = this._calculateTotalWidthSiblings(_siblings.leftSideCurrentNode, payload);
    _nRightTotalSiblingsWidth = this._calculateTotalWidthSiblings(_siblings.rightSideCurrentNode, payload);
    return {
      rightTotalSiblingsWidth: _nRightTotalSiblingsWidth,
      leftTotalSiblingsWidth: _nLeftTotalSiblingsWidth
    };
  }

  /**
  * @description: Dùng để lấy thông tin của node cha (rect, styles, element)
  * @param: node: Node, payload: Payload
  * @return:{parentNode,parentBoundingRect,parentStyles};
  */
  private _getInformationParentNode(pNode: Node, payload: Payload) {
    let _parentNode: Element;
    let _parentBoundingRect: Rect;
    let _parentStyles: CSSStyleDeclaration;
    if (pNode.parentElement === payload.cellElement) {
      _parentNode = payload.cellElement;
      _parentStyles = payload.cellStyles;
      _parentBoundingRect = payload.cellBoundingRect;
    } else {
      _parentNode = pNode.parentElement as Element;
      _parentStyles = getComputedStyle(_parentNode);
      _parentBoundingRect = this._changeOriginCoordinates(_parentNode.getBoundingClientRect());
    }
    return {
      parentNode: _parentNode,
      parentBoundingRect: _parentBoundingRect,
      parentStyles: _parentStyles
    };
  }

  //*Handle and draw image
  private _drawImageInCell(pImageNode: HTMLImageElement, payload: Payload): SVGElement {
    const _imageBoundingRect = this._changeOriginCoordinates(pImageNode.getBoundingClientRect());
    let parentBoundingRect = payload.cellBoundingRect;
    if ((parentBoundingRect.height < _imageBoundingRect.height) || (parentBoundingRect.width < _imageBoundingRect.width)) {
      const _svgWrap = this._wrapImageIntoSvg(pImageNode, payload);
      return _svgWrap;
    }
    const _imageSvgEl = this.drawImage(pImageNode.src, _imageBoundingRect.left, _imageBoundingRect.top, _imageBoundingRect.width, _imageBoundingRect.height);
    return _imageSvgEl;
  }

  /**
  * @description: Dùng để bọc svg bên ngoài của image svg trong trường hợp kích thước của image to hơn phần tử chứa
  * @param: imageNode: HTMLImageElement, payload: Payload
  * @return:SVGElement
  */
  private _wrapImageIntoSvg(pImageEl: HTMLImageElement, payload: Payload): SVGElement {
    const _rectSvgEl: Partial<Rect> = {};
    const _parentBoundingRect = payload.cellBoundingRect;
    _rectSvgEl.width = _parentBoundingRect.width;
    _rectSvgEl.height = _parentBoundingRect.height;
    _rectSvgEl.left = _parentBoundingRect.left;
    _rectSvgEl.top = _parentBoundingRect.top;
    const _svgWrapImage = creatorSVG(_rectSvgEl, true);
    const _imageSvgEl = drawImage(pImageEl.src, 0, 0, pImageEl.width, pImageEl.height);
    _svgWrapImage.appendChild(_imageSvgEl);
    this.element.appendChild(_svgWrapImage);
    return _svgWrapImage;
  }

  private _drawCheckBox(pNode: Node, payload: Payload) {
    const _inputNode = pNode as HTMLInputElement;
    const _inputRect = this._changeOriginCoordinates(_inputNode.getBoundingClientRect());
    if (_inputNode.checked) {
      const svgChecked = this._parser.parseFromString(inputChecked, 'image/svg+xml').childNodes[0] as SVGElement;
      setAttrSvgIcon(svgChecked, _inputRect.left, _inputRect.top, _inputRect.width, _inputRect.height);
      payload.group.appendChild(svgChecked);
    } else {
      const svgUnChecked = this._parser.parseFromString(inputUnchecked, 'image/svg+xml').childNodes[0] as SVGElement;
      setAttrSvgIcon(svgUnChecked, _inputRect.left, _inputRect.top, _inputRect.width, _inputRect.height);
      payload.group.appendChild(svgUnChecked);
    }
  }

  private _drawPin(pNode: Node, payload: Payload) {
    const _pinNode = pNode as HTMLElement;
    const _pinRect = this._changeOriginCoordinates(_pinNode.getBoundingClientRect());
    if (payload.cellBoundingRect.width < _pinRect.width || payload.cellBoundingRect.height < _pinRect.height) return;
    if (_pinNode.className.includes('wj-state-pinned')) {
      const _svgPinned = this._parser.parseFromString(pinned, 'image/svg+xml').childNodes[0] as SVGElement;
      _svgPinned.setAttribute('fill', '#333');
      setAttrSvgIcon(_svgPinned, _pinRect.left, _pinRect.top, _pinRect.width, _pinRect.height);
      payload.group.appendChild(_svgPinned);
    } else {
      const _svgUnpinned = this._parser.parseFromString(unpinned, 'image/svg+xml').childNodes[0] as SVGElement;
      _svgUnpinned.setAttribute('fill', '#3333');
      setAttrSvgIcon(_svgUnpinned, _pinRect.left, _pinRect.top, _pinRect.width, _pinRect.height);
      payload.group.appendChild(_svgUnpinned);
    }
  }

  private _drawGroupBtn(pNode: Node, payload: Payload) {
    const _groupBtnNode = pNode as HTMLElement;
    const _groupBtnRect = this._changeOriginCoordinates(_groupBtnNode.getBoundingClientRect());
    const _panel = payload.panel;
    const _nCurrentRow = payload.row;
    if (!(_panel.rows[_nCurrentRow] instanceof GroupRow) || (payload.cellBoundingRect.width < _groupBtnRect.width || payload.cellBoundingRect.height < _groupBtnRect.height)) return;
    if ((_panel.rows[_nCurrentRow] as GroupRow).isCollapsed) {
      const _svgCollapse = this._parser.parseFromString(collapse, 'image/svg+xml').childNodes[0] as SVGElement;
      setAttrSvgIcon(_svgCollapse, _groupBtnRect.left, _groupBtnRect.top, _groupBtnRect.width, _groupBtnRect.height);
      payload.group.appendChild(_svgCollapse);
    } else {
      const _svgexpand = this._parser.parseFromString(expand, 'image/svg+xml').childNodes[0] as SVGElement;
      setAttrSvgIcon(_svgexpand, _groupBtnRect.left, _groupBtnRect.top, _groupBtnRect.width, _groupBtnRect.height);
      payload.group.appendChild(_svgexpand);
    }
  }
  private _drawSortBtn(pNode: Node, payload: Payload) {
    const _sortBtnNode = pNode as HTMLElement;
    const _sortBtnRect = this._changeOriginCoordinates(_sortBtnNode.getBoundingClientRect());
    const _panel = payload.panel;
    let _zColor = window.getComputedStyle(_sortBtnNode).color || '';
    if (_panel.cellType !== CellType.ColumnHeader || (payload.cellBoundingRect.width < _sortBtnRect.width || payload.cellBoundingRect.height < _sortBtnRect.height)) return;
    if (_sortBtnNode.className.includes('wj-glyph-up')) {
      const _svgArrowUp = this._parser.parseFromString(arrowUp, 'image/svg+xml').childNodes[0] as SVGElement;
      _svgArrowUp.setAttribute('fill', _zColor);
      setAttrSvgIcon(_svgArrowUp, _sortBtnRect.left, _sortBtnRect.top, _sortBtnRect.width, _sortBtnRect.height);
      payload.group.appendChild(_svgArrowUp);
    } else {
      const _svgArrowDown = this._parser.parseFromString(arrowDown, 'image/svg+xml').childNodes[0] as SVGElement;
      _svgArrowDown.setAttribute('fill', _zColor);
      setAttrSvgIcon(_svgArrowDown, _sortBtnRect.left, _sortBtnRect.top, _sortBtnRect.width, _sortBtnRect.height);
      payload.group.appendChild(_svgArrowDown);
    }
  }
  /*-----------------------------------------------*
   *                                               *
   *            Draw raw svg                       *
   *                                               *
   ------------------------------------------------*/
  //**Draw raw svg start here:
  //**declared property here */
  public cellPadding: CellPadding = { paddingBottom: 8, paddingLeft: 8, paddingTop: 8, paddingRight: 8 };
  public stylesSetupCache: Map<CellStyleEnum, string> = new Map();
  private _stylesBase!: CSSStyleDeclaration;
  private _stylesTextSetup!: Record<string, string>;
  private _stylesBorderSetup!: Record<string, string>;
  private _zTextAglin!: string;
  private _zBgColorSetup!: string;
  private _bIsRawValue: boolean = false;
  set isRawValue(value: boolean) {
    this._bIsRawValue = value;
  }
  get isRawValue() { return this._bIsRawValue; }
  //**events declared here
  public drewRectHandler = new wjEven<FlexGridSvgEngine, IPayloadEvent>();
  public drewBorderRightHandler = new wjEven<FlexGridSvgEngine, IPayloadEvent>();
  public drewBorderBottomHandler = new wjEven<FlexGridSvgEngine, IPayloadEvent>();
  public drawingTextHandler = new wjEven<FlexGridSvgEngine, IPayloadEvent>();
  public drewTextHandler = new wjEven<FlexGridSvgEngine, IPayloadEvent>();
  //*method raise event here:

  public onDrewRect(pPayloadEvent: IPayloadEvent) {
    this.drewRectHandler.raise(this, pPayloadEvent);
  }

  public onDrawingText(pPayloadEvent: IPayloadEvent) {
    this.drawingTextHandler.raise(this, pPayloadEvent);
  }

  public onDrewText(pPayloadEvent: IPayloadEvent) {
    this.drewTextHandler.raise(this, pPayloadEvent);
  }

  public onDrewBorderRight(pPayloadEvent: IPayloadEvent) {
    this.drewBorderRightHandler.raise(this, pPayloadEvent);
  }

  public onDrewBorderBottom(pPayloadEvent: IPayloadEvent) {
    this.drewBorderBottomHandler.raise(this, pPayloadEvent);
  }

  /**
  * @description: lấy ra data cần trong payload để gửi đi cùng với event
  * @param: payload: Payload
  * @return: IPayloadEvent
  */
  private _getPayloadEvent(payload: Payload): IPayloadEvent {
    const _payloadEvent: IPayloadEvent = {} as IPayloadEvent;
    _payloadEvent.col = payload.col;
    _payloadEvent.row = payload.row;
    _payloadEvent.panel = payload.panel;
    _payloadEvent.cellValue = payload.cellValue;
    return _payloadEvent as IPayloadEvent;
  }

  /**
  * @desc: Hàm này dùng để export svg (tất cả data trong flex grid) vẽ theo panel (cells,columnsHeader,etc...)
  * @return : SvgElement
  */
  public renderFlexSvgRaw(): SVGElement {
    try {
      this.beginRender();
      this.stylesCache = {} as StylesCache;
      const _colsHeaderPanel = this.flexGrid.columnHeaders;
      const _colsFooterPanel = this.flexGrid.columnFooters;
      const _cellsPanel = this.flexGrid.cells;
      const _rowsHeaderPanel = this.flexGrid.rowHeaders;
      const _topLeft = this.flexGrid.topLeftCells;
      //?draw cells panel
      this._drawRawCellPanel(_cellsPanel);
      //?draw cells columns header
      this._drawRawCellPanel(_colsHeaderPanel);
      //?draw cells columns footer
      this._drawRawCellPanel(_colsFooterPanel);
      //?draw cells rows header
      this._drawRawCellPanel(_rowsHeaderPanel);
      this._drawRawCellPanel(_topLeft);
      const _nWidthSvg = this.flexGrid.columns.getTotalSize() + this.flexGrid.rowHeaders.columns.getTotalSize();
      const _nHeightSvg = this.flexGrid.rows.getTotalSize() + this.flexGrid.columnHeaders.height;
      this.setViewportSize(_nWidthSvg, _nHeightSvg);
      const _svgEl = declareNamespaceSvg(this.element as SVGElement);
      return _svgEl;
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when render raw flex grid SVG!');
    } finally {
      //!clean cache,events and complete render;
      this.endRender();
      this.stylesCache = {} as StylesCache;
      this.cleanEvents();
    }
  }

  /**
 * @desc: Hàm này dùng để export svg (tất cả data trong flex grid) vẽ theo panel (cells,columnsHeader,etc...)
 * @return : SvgElement
 */
  private _drawRawCellPanel(pPanel: GridPanel) {
    //!initialize payload object
    const payload = {} as Payload;
    payload.panel = pPanel;
    for (let _nColIndex = 0; _nColIndex < pPanel.columns.length; _nColIndex++) {
      for (let _nRowIndex = 0; _nRowIndex < pPanel.rows.length; _nRowIndex++) {
        const _cellRange = this.flexGrid.getMergedRange(pPanel, _nRowIndex, _nColIndex, false);
        const _cellBoundingRect = pPanel.getCellBoundingRect(_nRowIndex, _nColIndex, true);
        let _cellValue = pPanel.getCellData(_nRowIndex, _nColIndex, this._bIsRawValue);
        payload.col = _nColIndex;
        payload.row = _nRowIndex;
        payload.cellBoundingRect = _cellBoundingRect;
        payload.cellRange = _cellRange;
        payload.cellValue = _cellValue;
        payload.isRowGroup = pPanel.rows[_nRowIndex] instanceof GroupRow;
        this._applyStyleSetup(payload);
        //?cộng tọa độ y và x của header và body and footer với chiều cao tương ứng
        if (pPanel.cellType === CellType.Cell) {
          _cellBoundingRect.top += this.flexGrid.columnHeaders.height;
        } else if (pPanel.cellType === CellType.ColumnFooter) {
          _cellBoundingRect.top += this.flexGrid.columnHeaders.height + this.flexGrid.cells.height;
        } else if (pPanel.cellType === CellType.RowHeader) {
          _cellBoundingRect.top += this.flexGrid.columnHeaders.height;
        }
        if (pPanel.cellType === CellType.Cell || pPanel.cellType === CellType.ColumnFooter || pPanel.cellType === CellType.ColumnHeader) {
          _cellBoundingRect.left += this.flexGrid.rowHeaders.width;
        }
        //?Trường hợp Pin
        if (_nColIndex < pPanel.columns.frozen) {
          _cellBoundingRect.left += this.flexGrid.scrollPosition.x * (this.flexGrid.rightToLeft ? -1 : +1);
        }
        //kiểm tra xem liệu cell có phải là cell group hay không?
        if (!_cellRange || (_cellRange && _cellRange.isSingleCell)) {
          if (pPanel.rows[_nRowIndex].visibleIndex !== -1) {
            const _groupEl = this.startGroup();
            payload.group = _groupEl;
            this._drawRawRectCell(payload);
            this.endGroup();
          }
        } else {
          //trường hợp cell group hoặc merge chỉ vẻ lần đầu tiên! tránh trường hợp draw nhiều lần!
          if ((_nRowIndex == _cellRange.row && _nColIndex === _cellRange.col && pPanel.rows[_nRowIndex].visibleIndex !== -1)) {
            const _groupEl = this.startGroup();
            payload.group = _groupEl;
            this._drawRawRectCell(payload);
            this.endGroup();
          }
        }
      }
    }
  }

  private _drawRawRectCell(payload: Payload): void {
    const _panel = payload.panel;
    const _rect = payload.cellBoundingRect;
    const _cellRange = payload.cellRange;
    //trường hợp cell được merge hoặc gr thì kích thước của rectangle bằng tổng các cell cộng lại
    if (_cellRange && !_cellRange.isSingleCell) {
      for (let _nIndex = _cellRange.col + 1; _nIndex <= _cellRange.col2; _nIndex++) {
        _rect.width += _panel.columns[_nIndex].renderWidth; // total width of rectangle
      }
      for (let _nIndex = _cellRange.row + 1; _nIndex <= _cellRange.row2; _nIndex++) {
        _rect.height += _panel.rows[_nIndex].renderHeight; // total height of rectangle
      }
    }
    const _rectSvgEl = this.drawRect(_rect.left, _rect.top, _rect.width, _rect.height);
    const _payloadEvent = this._getPayloadEvent(payload);
    _payloadEvent.svgDrew = _rectSvgEl;
    _rectSvgEl.setAttribute('fill', this._zBgColorSetup);
    this.onDrewRect(_payloadEvent);
    //?Draw border and content in cell here!
    this._drawRawBorderCell(payload);
    this._drawContentInCell(payload);
  }

  private _drawRawBorderCell(payload: Payload) {
    const _rect = payload.cellBoundingRect;
    const _payloadEvent = this._getPayloadEvent(payload);
    //border bottom
    const _lineBottomSvgEl = this.drawLine(_rect.left, _rect.bottom, _rect.right, _rect.bottom);
    _lineBottomSvgEl.setAttribute('stroke-width', this._stylesBorderSetup['borderBottomWidth']);
    _lineBottomSvgEl.setAttribute('stroke', this._stylesBorderSetup['borderBottomColor']);
    _payloadEvent.svgDrew = _lineBottomSvgEl;
    this.onDrewBorderBottom(_payloadEvent); //raise event drew border bottom here
    //border right
    const _lineRightSvgEl = this.drawLine(_rect.right, _rect.top, _rect.right, _rect.bottom);
    _lineRightSvgEl.setAttribute('stroke-width', this._stylesBorderSetup['borderRightWidth']);
    _lineRightSvgEl.setAttribute('stroke', this._stylesBorderSetup['borderRightColor']);
    _payloadEvent.svgDrew = _lineRightSvgEl;
    this.onDrewBorderRight(_payloadEvent);//raise event drew border right here
  }

  private _drawContentInCell(payload: Payload) {
    const _cellValue = payload.cellValue;
    const _panel = payload.panel;
    const _nCol = payload.col;
    if (_panel.cellType === CellType.Cell && _panel.columns[_nCol].dataType === DataType.Boolean && !payload.isRowGroup) {
      this._drawCheckboxRaw(payload);
    } else if (_cellValue) {
      const _payloadEvent = this._getPayloadEvent(payload);
      this.onDrawingText(_payloadEvent);//raise event drawing text
      if (payload.cellValue !== payload.cellValue) {
        payload.cellValue = payload.cellValue;
      }
      this._drawTextRawInCell(payload);
    }
  }

  private _drawTextRawInCell(payload: Payload): SVGElement | null {
    const _textBehavior = this._calculateBehaviorTextRaw(payload);
    const _cellValue = payload.cellValue;
    payload.behaviorText = _textBehavior;
    if (!_textBehavior.isTextFitWidthCell) {
      const _svgEl = this._wrapTextRawIntoSvg(payload);
      return _svgEl;
    }
    const _textSvgEl = drawText(_cellValue, _textBehavior as BehaviorText, this._stylesTextSetup);
    const _payloadEvent = this._getPayloadEvent(payload);
    _payloadEvent.svgDrew = _textSvgEl;
    this.onDrewText(_payloadEvent);
    payload.group.appendChild(_textSvgEl);
    return _textSvgEl as SVGElement;
  }

  //?Tạm thời để đây!
  private _getAlignText(styles: CSSStyleDeclaration | Record<string, string>, pPayload: Payload): TextAlign {
    const _panel = pPayload.panel;
    let _nCurrentCol = pPayload.col;
    //#Center
    if (isCenterTop(styles)) {
      return TextAlign.CenterTop;
    } else if (isCenterCenter(styles)) {
      return TextAlign.CenterCenter;
    } else if (isCenterBottom(styles)) {
      return TextAlign.CenterBottom;
    }
    //#Left
    if (isLeftTop(styles)) {
      return TextAlign.LeftTop;
    } else if (isLeftCenter(styles)) {
      return TextAlign.LeftCenter;
    } else if (isLeftBottom(styles)) {
      return TextAlign.LeftBottom;
    }
    //#Right
    if (isRightTop(styles)) {
      return TextAlign.RightTop;
    } else if (isRightCenter(styles)) {
      return TextAlign.RightCenter;
    } else if (isRightBottom(styles)) {
      return TextAlign.RightBottom;
    }
    //Mặc định nằm left top! Với trường hợp cell type là boolean nằm center center
    if (_panel.columns[_nCurrentCol].dataType === DataType.Boolean) return TextAlign.CenterCenter;
    else return TextAlign.LeftTop;
  }
  /**
  * @desc: expensive function dùng để tính toán hành vi (tọa độ, điểm vẽ, hướng vẽ,...) của text node dựa trên tọa độ, kích thước của rect cell raw
  * @param payload: Payload
  * @returns: BehaviorText
 */
  private _calculateBehaviorTextRaw(pPayload: Payload): BehaviorText {
    try {
      const _panel = pPayload.panel;
      const _nCurrentCol = pPayload.col;
      const _nCurrentRow = pPayload.row;
      let _cellValue = pPayload.cellValue;
      const _cellBoundingRect = pPayload.cellBoundingRect;
      let _nPaddingLeft = this.cellPadding.paddingLeft;
      let _nPaddingRight = this.cellPadding.paddingRight;
      let _nPaddingTop = this.cellPadding.paddingTop;
      let _nPaddingBottom = this.cellPadding.paddingBottom;
      let _nXTextDefault = _cellBoundingRect.left;
      let _bIsRowGroup = pPayload.isRowGroup;
      let _yTextDefault = _cellBoundingRect.top;
      const _font = new Font(this._stylesTextSetup['fontFamily'], this._stylesTextSetup['fontSize'], this._stylesTextSetup['fontWeight']);
      pPayload.dimensionText = BravoGraphicsRenderer.measureString(_cellValue, _font, _cellBoundingRect.width, false);
      let _nWidthText = pPayload.dimensionText?.width || 0;
      let _nHeightText = pPayload.dimensionText?.height || 0;
      //Case indent for row group
      if (_bIsRowGroup) {
        switch (this._zTextAglin) {
          case TextAlign.LeftTop:
          case TextAlign.LeftBottom:
          case TextAlign.LeftCenter:
            _nPaddingLeft += (_panel.rows[_nCurrentRow] as GroupRow).level * this.flexGrid.treeIndent;
            break;
          case TextAlign.RightTop:
          case TextAlign.RightBottom:
          case TextAlign.RightCenter:
            _nPaddingRight += (_panel.rows[_nCurrentRow] as GroupRow).level * this.flexGrid.treeIndent;
            break;
        }
      }
      let _bIsFitWidth = _nWidthText < (_cellBoundingRect.width - _nPaddingLeft - _nPaddingRight);
      let _bIsFitHeight = _nHeightText < (_cellBoundingRect.height - _nPaddingBottom - _nPaddingTop);
      let _bIsFitContent = _bIsFitWidth && _bIsFitHeight;
      let _zAlginText = this._zTextAglin || 'left';
      if (_panel.columns[_nCurrentCol].dataType === DataType.Boolean) {
        _zAlginText = this._zTextAglin || 'center';
      }
      const _behaviorTextBase: Partial<BehaviorText> = { point: new Point(_nXTextDefault, _yTextDefault), textAnchor: 'start' };
      _behaviorTextBase.isTextFitWidthCell = _bIsFitContent;
      switch (_zAlginText) {
        case TextAlign.Left:
        case TextAlign.Start:
        case TextAlign.LeftTop:
          _behaviorTextBase.point!.x += _nPaddingLeft;
          _behaviorTextBase.point!.y += _nPaddingTop;
          _behaviorTextBase.textAnchor = 'start';
          _behaviorTextBase.dominantBaseline = 'hanging';
          return (_behaviorTextBase as BehaviorText);
        case TextAlign.Center:
        case TextAlign.CenterTop:
          if (_bIsFitContent) {
            _behaviorTextBase.point!.x += (_cellBoundingRect.width) / 2;
            _behaviorTextBase.point!.y += _nPaddingTop;
            _behaviorTextBase.textAnchor = 'middle';
            _behaviorTextBase.dominantBaseline = 'hanging';
          } else {
            _behaviorTextBase.point!.x += _nPaddingLeft;
            _behaviorTextBase.point!.y += _nPaddingTop;
            _behaviorTextBase.dominantBaseline = 'hanging';
          }
          return (_behaviorTextBase as BehaviorText);
        case TextAlign.Right:
        case TextAlign.RightTop:
        case TextAlign.End:
          _behaviorTextBase.dominantBaseline = 'hanging';
          _behaviorTextBase.point!.y += _nPaddingTop;
          if (_bIsFitContent) {
            _behaviorTextBase.point!.x += (_cellBoundingRect.width - _nPaddingRight);
            _behaviorTextBase.textAnchor = 'end';
            _behaviorTextBase.isTextFitWidthCell = true;
          } else {
            _behaviorTextBase.point!.x += _nPaddingLeft;
          }
          return (_behaviorTextBase as BehaviorText);
        //!Special case
        //?Center
        case TextAlign.CenterBottom:
          _behaviorTextBase.point!.y += (_cellBoundingRect.height) - _nPaddingBottom;
          if (_bIsFitContent) {
            _behaviorTextBase.point!.x += (_cellBoundingRect.width) / 2;
            _behaviorTextBase.textAnchor = 'middle';
            _behaviorTextBase.dominantBaseline = 'auto';
          } else {
            _behaviorTextBase.point!.x += _nPaddingLeft;
          }
          return (_behaviorTextBase as BehaviorText);
        case TextAlign.CenterCenter:
          _behaviorTextBase.point!.y += (_cellBoundingRect.height) / 2;
          if (_bIsFitContent) {
            _behaviorTextBase.point!.x += (_cellBoundingRect.width) / 2;
            _behaviorTextBase.textAnchor = 'middle';
            _behaviorTextBase.dominantBaseline = 'middle';
          } else {
            _behaviorTextBase.point!.x += _nPaddingLeft;
          }
          return (_behaviorTextBase as BehaviorText);
        //?#Left
        case TextAlign.LeftCenter:
          _behaviorTextBase.point!.x += _nPaddingLeft;
          _behaviorTextBase.point!.y += (_cellBoundingRect.height) / 2;
          if (_bIsFitContent) {
            _behaviorTextBase.textAnchor = 'start';
            _behaviorTextBase.dominantBaseline = 'middle';
          }
          return (_behaviorTextBase as BehaviorText);
        case TextAlign.LeftBottom:
          _behaviorTextBase.point!.x += _nPaddingLeft;
          _behaviorTextBase.point!.y += (_cellBoundingRect.height) - _nPaddingBottom;
          if (_bIsFitContent) {
            _behaviorTextBase.textAnchor = 'start';
            _behaviorTextBase.dominantBaseline = 'auto';
          }
          return (_behaviorTextBase as BehaviorText);
        //?#Right
        case TextAlign.RightCenter:
          _behaviorTextBase.point!.y += (_cellBoundingRect.height) / 2;
          if (_bIsFitContent) {
            _behaviorTextBase.point!.x += (_cellBoundingRect.width) - _nPaddingRight;
            _behaviorTextBase.textAnchor = 'end';
            _behaviorTextBase.dominantBaseline = 'middle';
          } else {
            _behaviorTextBase.point!.x += _nPaddingLeft;
          }
          return (_behaviorTextBase as BehaviorText);
        case TextAlign.RightBottom:
          _behaviorTextBase.point!.y += (_cellBoundingRect.height) - _nPaddingBottom;
          if (_bIsFitContent) {
            _behaviorTextBase.point!.x += (_cellBoundingRect.width) - _nPaddingRight;
            _behaviorTextBase.textAnchor = 'end';
            _behaviorTextBase.dominantBaseline = 'auto';
          } else {
            _behaviorTextBase.point!.x += _nPaddingLeft;
          }
          return (_behaviorTextBase as BehaviorText);
        default:
          _behaviorTextBase.textAnchor = 'start';
          _behaviorTextBase.point!.x += _nPaddingLeft;
          _behaviorTextBase.point!.y += _nPaddingTop;
          _behaviorTextBase.isTextFitWidthCell = _bIsFitContent;
          return (_behaviorTextBase as BehaviorText);
      }
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when trying to calculate position text node!');
    }
  }

  /**
  * @description: Dùng để bọc svg bên ngoài text svg trong trường hợp width cửa text dài hơn chiều rộng của cell
  * @param payload: Payload
  * @return: SVGElement | null
  */
  private _wrapTextRawIntoSvg(pPayload: Payload): SVGElement | null {
    try {
      const _rectSvg: Partial<DOMRect> = {};
      const _panel = pPayload.panel;
      const _nRow = pPayload.row;
      const _cellRect = pPayload.cellBoundingRect;
      const _textBehavior = pPayload.behaviorText;
      let _nPaddingLeft = this.cellPadding.paddingLeft;
      let _nPaddingRight = this.cellPadding.paddingRight;
      let _nPaddingTop = this.cellPadding.paddingTop;
      let _nPaddingBottom = this.cellPadding.paddingBottom;
      let _bIsRowGroup = pPayload.isRowGroup;
      let _nWidthText = pPayload.dimensionText?.width || 0;
      let _nHeightText = pPayload.dimensionText?.height || 0;
      //thụt lề cho row group.Trường hợp padding right chưa check
      if (_bIsRowGroup) {
        switch (this._zTextAglin) {
          case TextAlign.LeftTop:
          case TextAlign.LeftBottom:
          case TextAlign.LeftCenter:
            _nPaddingLeft += (_panel.rows[_nRow] as GroupRow).level * this.flexGrid.treeIndent;
            break;
          case TextAlign.RightTop:
          case TextAlign.RightBottom:
          case TextAlign.RightCenter:
            _nPaddingRight += (_panel.rows[_nRow] as GroupRow).level * this.flexGrid.treeIndent;
            break;
        }
      }
      let _bIsFitWidth = _nWidthText < (_cellRect.width - _nPaddingLeft - _nPaddingRight);
      let _bIsFitHeight = _nHeightText < (_cellRect.height - _nPaddingBottom - _nPaddingTop);
      /*
      trong trường hợp warpper svg có thể do hành vi thay đổi kích thước do người dùng kéo thay đổi kích thước row và column.
      hành vi kéo thay đổi kích thước chỉ xảy ra từ phải kéo vào trái đối với width và từ dưới lên trên đối với height.
      Tính toán lại padding bottom thực tế và padding right thực tế để tính chính xác tọa độ của text nằm trong svg wrapper
      và chiều cao thực tế!
      */
      if (_bIsFitHeight) {
        _nPaddingBottom = this.cellPadding.paddingBottom;
      } else {
        let actualPaddingBottom = _cellRect.height - _nHeightText - _nPaddingTop - 1;
        _nPaddingBottom = actualPaddingBottom > 0 ? actualPaddingBottom : 0;
      }
      // if (_bIsFitWidth) {
      //   _nPaddingRight = this.cellPadding.paddingRight;
      // } else {
      //   let actualPaddingRight = _cellRect.width - _nWidthText - _nPaddingLeft - 1;
      //   _nPaddingRight = actualPaddingRight > 0 ? actualPaddingRight : 0;
      // }
      /*
      Tính toán width và height của rect svg wrapper dựa vào padding left và right,bottom,top thực tế.
      Nếu width hoặc height nhỏ hơn 0 thì return null ko vẽ!
      */
      _rectSvg.width = _cellRect.width - _nPaddingLeft - _nPaddingRight;
      _rectSvg.height = (_cellRect.height - _nPaddingTop - _nPaddingBottom) || 0;
      if (_rectSvg.width <= 0 || _rectSvg.height <= 0) {
        return null;
      }
      const _textSvgEl = drawText(pPayload.cellValue, _textBehavior, this._stylesTextSetup, 'preserve');
      /*
      Tính toán lại tọa độ của svg wrapper! tọa độ x luôn giữ nguyên! điểm vẽ luôn = padding left
      Tọa độ y của svg wrapper tính toán phụ thuộc vào alignment của text
      Tính toán lại behavior của text theo svg wrapper!
      */
      switch (this._zTextAglin) {
        case TextAlign.Left:
        case TextAlign.Start:
        case TextAlign.LeftTop:
        case TextAlign.Right:
        case TextAlign.RightTop:
        case TextAlign.End:
          _rectSvg.x = _textBehavior.point.x;
          _rectSvg.y = _textBehavior.point.y;
          _textSvgEl.setAttribute('x', '0');
          _textSvgEl.setAttribute('y', '0');
          _textSvgEl.setAttribute('dominant-baseline', 'hanging');
          _textSvgEl.setAttribute('text-anchor', 'start');
          break;
        case TextAlign.Center:
        case TextAlign.CenterTop:
          _rectSvg.x = _textBehavior.point.x;
          _rectSvg.y = _textBehavior.point.y;
          if (_bIsFitWidth) {
            _textSvgEl.setAttribute('x', (_rectSvg.width / 2).toString());
            _textSvgEl.setAttribute('text-anchor', 'middle');
          } else {
            _textSvgEl.setAttribute('x', '0');
            _textSvgEl.setAttribute('text-anchor', 'start');
          }
          _textSvgEl.setAttribute('y', '0');
          _textSvgEl.setAttribute('dominant-baseline', 'hanging');
          break;
        /* Trong trường hợp Center bottom,left bottom,right bottom nếu chiều dài của text vừa
        thì cộng height của svg thêm padding bottom để text ko bị lẹm đi do hành vi
          vẽ của text là dominant-baseline = auto
        */
        case TextAlign.CenterBottom:
          _rectSvg.x = _textBehavior.point.x;
          //case fit width?
          if (_bIsFitWidth) {
            _textSvgEl.setAttribute('x', (_rectSvg.width / 2).toString());
            _textSvgEl.setAttribute('text-anchor', 'middle');
          } else {
            _textSvgEl.setAttribute('x', '0');
            _textSvgEl.setAttribute('text-anchor', 'start');
          }
          //case fit height?
          if (_bIsFitHeight) {
            _rectSvg.height += _nPaddingBottom;
            _rectSvg.y = _textBehavior.point.y - (_rectSvg.height - _nPaddingBottom);
            _textSvgEl.setAttribute('y', (_rectSvg.height - _nPaddingBottom).toString());
            _textSvgEl.setAttribute('dominant-baseline', 'auto');
          } else {
            _rectSvg.y = _cellRect.top + _nPaddingTop;
            _textSvgEl.setAttribute('y', '0');
            _textSvgEl.setAttribute('dominant-baseline', 'hanging');
          }
          break;
        case TextAlign.CenterCenter:
          _rectSvg.x = _textBehavior.point.x;
          //case fit width?
          if (_bIsFitWidth) {
            _textSvgEl.setAttribute('x', (_rectSvg.width / 2).toString());
            _textSvgEl.setAttribute('text-anchor', 'middle');
          } else {
            _textSvgEl.setAttribute('x', '0');
            _textSvgEl.setAttribute('text-anchor', 'start');
          }
          //case fit height?
          if (_bIsFitHeight) {
            _rectSvg.y = _textBehavior.point.y - (_rectSvg.height / 2);
            _textSvgEl.setAttribute('y', (_rectSvg.height / 2).toString());
            _textSvgEl.setAttribute('dominant-baseline', 'middle');
          } else {
            _rectSvg.y = _cellRect.top + _nPaddingTop;
            _textSvgEl.setAttribute('y', '0');
            _textSvgEl.setAttribute('dominant-baseline', 'hanging');
          }
          break;
        case TextAlign.LeftCenter:
          _rectSvg.x = _textBehavior.point.x;
          _textSvgEl.setAttribute('x', '0');
          _textSvgEl.setAttribute('text-anchor', 'start');
          //case fit height?
          if (_bIsFitHeight) {
            _rectSvg.y = _textBehavior.point.y - (_rectSvg.height / 2);
            _textSvgEl.setAttribute('y', (_rectSvg.height / 2).toString());
            _textSvgEl.setAttribute('dominant-baseline', 'middle');
          } else {
            _rectSvg.y = _cellRect.top + _nPaddingTop;
            _textSvgEl.setAttribute('y', '0');
            _textSvgEl.setAttribute('dominant-baseline', 'hanging');
          }
          break;
        case TextAlign.LeftBottom:
          _rectSvg.x = _textBehavior.point.x;
          _textSvgEl.setAttribute('x', '0');
          _textSvgEl.setAttribute('text-anchor', 'start');
          //case fit height?
          if (_bIsFitHeight) {
            _rectSvg.height += _nPaddingBottom;
            _rectSvg.y = _textBehavior.point.y - (_rectSvg.height - _nPaddingBottom);
            _textSvgEl.setAttribute('y', (_rectSvg.height - _nPaddingBottom).toString());
            _textSvgEl.setAttribute('dominant-baseline', 'auto');
          } else {
            _rectSvg.y = _cellRect.top + _nPaddingTop;
            _textSvgEl.setAttribute('y', '0');
            _textSvgEl.setAttribute('dominant-baseline', 'hanging');
          }
          break;
        case TextAlign.RightCenter:
          _rectSvg.x = _textBehavior.point.x;
          //case fit width?
          if (_bIsFitWidth) {
            _textSvgEl.setAttribute('x', (_rectSvg.width - _nPaddingRight).toString());
            _textSvgEl.setAttribute('text-anchor', 'end');
          } else {
            _textSvgEl.setAttribute('x', '0');
            _textSvgEl.setAttribute('text-anchor', 'start');
          }
          //case fit height?
          if (_bIsFitHeight) {
            _rectSvg.y = _textBehavior.point.y - (_rectSvg.height / 2);
            _textSvgEl.setAttribute('y', (_rectSvg.height / 2).toString());
            _textSvgEl.setAttribute('dominant-baseline', 'middle');
          } else {
            _rectSvg.y = _cellRect.top + _nPaddingTop;
            _textSvgEl.setAttribute('y', '0');
            _textSvgEl.setAttribute('dominant-baseline', 'hanging');
          }
          break;
        case TextAlign.RightBottom:
          _rectSvg.x = _textBehavior.point.x;
          if (_bIsFitWidth) {
            _textSvgEl.setAttribute('x', (_rectSvg.width - _nPaddingRight).toString());
            _textSvgEl.setAttribute('text-anchor', 'end');
          } else {
            _textSvgEl.setAttribute('x', '0');
            _textSvgEl.setAttribute('text-anchor', 'start');
          }
          //case fit height?
          if (_bIsFitHeight) {
            _rectSvg.height += _nPaddingBottom;
            _rectSvg.y = _textBehavior.point.y - (_rectSvg.height - _nPaddingBottom);
            _textSvgEl.setAttribute('y', (_rectSvg.height - _nPaddingBottom).toString());
            _textSvgEl.setAttribute('dominant-baseline', 'auto');
          } else {
            _rectSvg.y = _cellRect.top + _nPaddingTop;
            _textSvgEl.setAttribute('y', '0');
            _textSvgEl.setAttribute('dominant-baseline', 'hanging');
          }
          break;
        default:
          _rectSvg.x = _textBehavior.point.x;
          _rectSvg.y = _textBehavior.point.y;
          _textSvgEl.setAttribute('x', '0');
          _textSvgEl.setAttribute('y', '0');
          break;
      }

      const _svgWrapText = creatorSVG(_rectSvg, true);
      const _payloadEvent = this._getPayloadEvent(pPayload);
      _payloadEvent.svgDrew = _textSvgEl;
      this.onDrewText(_payloadEvent);
      _svgWrapText.appendChild(_textSvgEl);
      pPayload.group.appendChild(_svgWrapText);
      return _svgWrapText;
    } catch (error) {
      console.error(error);
      throw new Error('Something wrong when wrap text raw in svg');
    }
  }

  private _drawCheckboxRaw(payload: Payload): void {
    const _rect = payload.cellBoundingRect;
    const _cellValue = payload.cellValue;
    let _nWidthCheckbox = 13;
    let _nHeightCheckbox = 13;
    let _nXCheckbox = _rect.left + _rect.width / 2 - _nWidthCheckbox / 2;
    let _nYCheckBox = _rect.top + _rect.height / 2 - _nHeightCheckbox / 2;
    if (_rect.width < _nWidthCheckbox || _rect.height < _nHeightCheckbox) return;
    if (_cellValue === 'true' || _cellValue === true) {
      const _svgChecked = this._parser.parseFromString(inputChecked, 'image/svg+xml').childNodes[0] as SVGElement;
      setAttrSvgIcon(_svgChecked, _nXCheckbox, _nYCheckBox, _nWidthCheckbox, _nHeightCheckbox);
      payload.group.appendChild(_svgChecked);
    } else {
      const _svgUnChecked = this._parser.parseFromString(inputUnchecked, 'image/svg+xml').childNodes[0] as SVGElement;
      setAttrSvgIcon(_svgUnChecked, _nXCheckbox, _nYCheckBox, _nWidthCheckbox, _nHeightCheckbox);
      payload.group.appendChild(_svgUnChecked);
    }
  }
  /**
  * @description: Apply styles setup cho text, border, background rectangle
  * @param: payload : Payload
  */
  private _applyStyleSetup(pPayload: Payload): void {
    const _panel = pPayload.panel;
    const _currentRow = pPayload.row;
    const _currentCol = pPayload.col;
    const _cellRange = pPayload.cellRange;
    let _rowAlternate = this.flexGrid.alternatingRowStep;
    //cache styles seytup
    let _stylesNormal, _stylesAlternate, _stylesColsHeader, _stylesColsFooter, _stylesRowsHeader, _stylesFrozen, _stylesNewRow, _stylesGroupLv0, _stylesGroupLv1, _stylesGroupLv2, _stylesGroupLv3, _stylesGroupLv4, _stylesGroupLv5;
    //styles normal
    if (!this.stylesCache.stylesNormal) {
      _stylesNormal = (this.stylesSetup.has(CellStyleEnum.Normal) && this.stylesSetup.get(CellStyleEnum.Normal)) ? { ...this._stylesBase, ...this.stylesSetup.get(CellStyleEnum.Normal) } : this._stylesBase;
      this.stylesCache.stylesNormal = _stylesNormal;
    } else {
      _stylesNormal = this.stylesCache.stylesNormal;
    }
    //styles alternate
    if (!this.stylesCache.stylesAlternate) {
      _stylesAlternate = (this.stylesSetup.has(CellStyleEnum.Alternate) && this.stylesSetup.get(CellStyleEnum.Alternate)) ? { ..._stylesNormal, ...this.stylesSetup.get(CellStyleEnum.Alternate) } : _stylesNormal;
      this.stylesCache.stylesAlternate = _stylesAlternate;
    } else {
      _stylesAlternate = this.stylesCache.stylesAlternate;
    }
    //styles col header
    if (!this.stylesCache.stylesColsHeader) {
      _stylesColsHeader = (this.stylesSetup.has(CellStyleEnum.Fixed) && this.stylesSetup.get(CellStyleEnum.Fixed)) ? { ..._stylesNormal, ...this.stylesSetup.get(CellStyleEnum.Fixed) } : _stylesNormal;
      this.stylesCache.stylesColsHeader = _stylesColsHeader;
    } else {
      _stylesColsHeader = this.stylesCache.stylesColsHeader;
    }
    //styles cols footer
    if (!this.stylesCache.stylesColsFooter) {
      _stylesColsFooter = (this.stylesSetup.has(CellStyleEnum.ColumnsFooter) && this.stylesSetup.get(CellStyleEnum.ColumnsFooter)) ? { ..._stylesColsHeader, ...this.stylesSetup.get(CellStyleEnum.ColumnsFooter) } : _stylesColsHeader;
      this.stylesCache.stylesColsFooter = _stylesColsFooter;
    } else {
      _stylesColsFooter = this.stylesCache.stylesColsFooter;
    }
    //styles row header
    if (!this.stylesCache.stylesRowsHeader) {
      _stylesRowsHeader = (this.stylesSetup.has(CellStyleEnum.RowHeader) && this.stylesSetup.get(CellStyleEnum.RowHeader)) ? { ..._stylesNormal, ... this.stylesSetup.get(CellStyleEnum.RowHeader) } : _stylesNormal;
      this.stylesCache.stylesRowsHeader = _stylesRowsHeader;
    } else {
      _stylesRowsHeader = this.stylesCache.stylesRowsHeader;
    }
    //frozen styles
    if (!this.stylesCache.stylesFrozen) {
      _stylesFrozen = (this.stylesSetup.has(CellStyleEnum.Frozen) && this.stylesSetup.get(CellStyleEnum.Frozen)) ? { ..._stylesAlternate, ...this.stylesSetup.get(CellStyleEnum.Frozen) } : _stylesAlternate;
      this.stylesCache.stylesFrozen = _stylesFrozen;
    } else {
      _stylesFrozen = this.stylesCache.stylesFrozen;
    }
    //new row style
    if (!this.stylesCache.stylesNewRow) {
      _stylesNewRow = (this.stylesSetup.has(CellStyleEnum.NewRow) && this.stylesSetup.get(CellStyleEnum.NewRow)) ? { ..._stylesNormal, ...this.stylesSetup.get(CellStyleEnum.NewRow) } : _stylesNormal;
      this.stylesCache.stylesNewRow = _stylesNewRow;
    } else {
      _stylesNewRow = this.stylesCache.stylesNewRow;
    }
    //styles group (level)
    if (!this.stylesCache.stylesGroupLv0) {
      _stylesGroupLv0 = (this.stylesSetup.has(CellStyleEnum.Subtotal0) && this.stylesSetup.get(CellStyleEnum.Subtotal0)) ? { ..._stylesFrozen, ...this.stylesSetup.get(CellStyleEnum.Subtotal0) } : _stylesFrozen;
      this.stylesCache.stylesGroupLv0 = _stylesGroupLv0;
    } else {
      _stylesGroupLv0 = this.stylesCache.stylesGroupLv0;
    }

    if (!this.stylesCache.stylesGroupLv1) {
      _stylesGroupLv1 = (this.stylesSetup.has(CellStyleEnum.Subtotal1) && this.stylesSetup.get(CellStyleEnum.Subtotal1)) ? { ..._stylesFrozen, ...this.stylesSetup.get(CellStyleEnum.Subtotal1) } : _stylesFrozen;
      this.stylesCache.stylesGroupLv1 = _stylesGroupLv1;
    } else {
      _stylesGroupLv1 = this.stylesCache.stylesGroupLv1;
    }

    if (!this.stylesCache.stylesGroupLv2) {
      _stylesGroupLv2 = (this.stylesSetup.has(CellStyleEnum.Subtotal2) && this.stylesSetup.get(CellStyleEnum.Subtotal2)) ? { ..._stylesFrozen, ...this.stylesSetup.get(CellStyleEnum.Subtotal2) } : _stylesFrozen;
      this.stylesCache.stylesGroupLv2 = _stylesGroupLv2;
    } else {
      _stylesGroupLv2 = this.stylesCache.stylesGroupLv2;
    }
    if (!this.stylesCache.stylesGroupLv3) {
      _stylesGroupLv3 = (this.stylesSetup.has(CellStyleEnum.Subtotal3) && this.stylesSetup.get(CellStyleEnum.Subtotal3)) ? { ..._stylesFrozen, ...this.stylesSetup.get(CellStyleEnum.Subtotal3) } : _stylesFrozen;
      this.stylesCache.stylesGroupLv3 = _stylesGroupLv3;
    } else {
      _stylesGroupLv3 = this.stylesCache.stylesGroupLv3;
    }
    if (!this.stylesCache.stylesGroupLv4) {
      _stylesGroupLv4 = (this.stylesSetup.has(CellStyleEnum.Subtotal4) && this.stylesSetup.get(CellStyleEnum.Subtotal4)) ? { ..._stylesFrozen, ...this.stylesSetup.get(CellStyleEnum.Subtotal4) } : _stylesFrozen;
      this.stylesCache.stylesGroupLv4 = _stylesGroupLv4;
    } else {
      _stylesGroupLv4 = this.stylesCache.stylesGroupLv4;
    }

    if (!this.stylesCache.stylesGroupLv5) {
      _stylesGroupLv5 = (this.stylesSetup.has(CellStyleEnum.Subtotal5) && this.stylesSetup.get(CellStyleEnum.Subtotal5)) ? { ..._stylesFrozen, ...this.stylesSetup.get(CellStyleEnum.Subtotal5) } : _stylesFrozen;
      this.stylesCache.stylesGroupLv5 = _stylesGroupLv5;
    } else {
      _stylesGroupLv5 = this.stylesCache.stylesGroupLv5;
    }
    switch (_panel.cellType) {
      case CellType.Cell:
        this._zBgColorSetup = getBgRectFromStylesSetup(_stylesNormal);
        this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesNormal);
        this._stylesTextSetup = getAcceptStylesTextSvg(_stylesNormal);
        this._zTextAglin = this._getAlignText(_stylesNormal, pPayload);
        //case alternating row
        if (this.flexGrid.showAlternatingRows) {
          let _bIsAlternate = false;
          if (_rowAlternate && (!_cellRange || _cellRange.row == _cellRange.row2)) {
            _bIsAlternate = _panel.rows[_currentRow].visibleIndex % (_rowAlternate + 1) === 0;
            _rowAlternate == 1 && (_bIsAlternate = !_bIsAlternate);
          }
          if (_bIsAlternate) {
            this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesAlternate);
            this._stylesTextSetup = getAcceptStylesTextSvg(_stylesAlternate);
            this._zBgColorSetup = getBgRectFromStylesSetup(_stylesAlternate);
            this._zTextAglin = this._getAlignText(_stylesAlternate, pPayload);
          }
        }
        //case frozen
        if (_currentRow < _panel.rows.frozen || _currentCol < _panel.columns.frozen) {
          this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesFrozen);
          this._zBgColorSetup = getBgRectFromStylesSetup(_stylesFrozen);
          this._stylesTextSetup = getAcceptStylesTextSvg(_stylesFrozen);
          this._zTextAglin = this._getAlignText(_stylesFrozen, pPayload);
        }
        //case new row
        if (_panel.rows[_currentRow] instanceof _NewRowTemplate) {
          this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesNewRow);
          this._zBgColorSetup = getBgRectFromStylesSetup(_stylesNewRow);
          this._stylesTextSetup = getAcceptStylesTextSvg(_stylesNewRow);
          this._zTextAglin = this._getAlignText(_stylesNewRow, pPayload);
        }
        //case row group by level
        if (pPayload.isRowGroup) {
          switch ((_panel.rows[_currentRow] as GroupRow).level) {
            case 0:
              this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesGroupLv0);
              this._zBgColorSetup = getBgRectFromStylesSetup(_stylesGroupLv0);
              this._stylesTextSetup = getAcceptStylesTextSvg(_stylesGroupLv0);
              this._zTextAglin = this._getAlignText(_stylesGroupLv0, pPayload);
              break;
            case 1:
              this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesGroupLv1);
              this._zBgColorSetup = getBgRectFromStylesSetup(_stylesGroupLv1);
              this._stylesTextSetup = getAcceptStylesTextSvg(_stylesGroupLv1);
              this._zTextAglin = this._getAlignText(_stylesGroupLv1, pPayload);
              break;
            case 2:
              this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesGroupLv2);
              this._zBgColorSetup = getBgRectFromStylesSetup(_stylesGroupLv2);
              this._stylesTextSetup = getAcceptStylesTextSvg(_stylesGroupLv2);
              this._zTextAglin = this._getAlignText(_stylesGroupLv2, pPayload);
              break;
            case 3:
              this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesGroupLv3);
              this._zBgColorSetup = getBgRectFromStylesSetup(_stylesGroupLv3);
              this._stylesTextSetup = getAcceptStylesTextSvg(_stylesGroupLv3);
              this._zTextAglin = this._getAlignText(_stylesGroupLv3, pPayload);
              break;
            case 4:
              this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesGroupLv4);
              this._zBgColorSetup = getBgRectFromStylesSetup(_stylesGroupLv4);
              this._stylesTextSetup = getAcceptStylesTextSvg(_stylesGroupLv4);
              this._zTextAglin = this._getAlignText(_stylesGroupLv4, pPayload);
              break;
            case 5:
              this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesGroupLv5);
              this._zBgColorSetup = getBgRectFromStylesSetup(_stylesGroupLv5);
              this._stylesTextSetup = getAcceptStylesTextSvg(_stylesGroupLv5);
              this._zTextAglin = this._getAlignText(_stylesGroupLv5, pPayload);
              break;
            default:
              this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesFrozen);
              this._zBgColorSetup = getBgRectFromStylesSetup(_stylesFrozen);
              this._stylesTextSetup = getAcceptStylesTextSvg(_stylesFrozen);
              this._zTextAglin = this._getAlignText(_stylesFrozen, pPayload);
          }
        }
        break;
      case CellType.ColumnHeader:
        this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesColsHeader);
        this._zBgColorSetup = getBgRectFromStylesSetup(_stylesColsHeader);
        this._stylesTextSetup = getAcceptStylesTextSvg(_stylesColsHeader);
        this._zTextAglin = this._getAlignText(_stylesColsHeader, pPayload);
        break;
      case CellType.ColumnFooter:
        this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesColsFooter);
        this._zBgColorSetup = getBgRectFromStylesSetup(_stylesColsFooter);
        this._stylesTextSetup = getAcceptStylesTextSvg(_stylesColsFooter);
        this._zTextAglin = this._getAlignText(_stylesColsFooter, pPayload);
        break;
      case CellType.RowHeader:
      case CellType.TopLeft:
        this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesRowsHeader);
        this._zBgColorSetup = getBgRectFromStylesSetup(_stylesRowsHeader);
        this._stylesTextSetup = getAcceptStylesTextSvg(_stylesRowsHeader);
        this._zTextAglin = this._getAlignText(_stylesRowsHeader, pPayload);
        break;
      default:
        this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesNormal);
        this._zBgColorSetup = getBgRectFromStylesSetup(_stylesNormal);
        this._stylesTextSetup = getAcceptStylesTextSvg(_stylesNormal);
        this._zTextAglin = this._getAlignText(_stylesNormal, pPayload);
        break;
    }
  }

  public cleanEvents() {
    this.drewRectHandler.hasHandlers && this.drewRectHandler.removeAllHandlers();
    this.drewBorderRightHandler.hasHandlers && this.drewBorderRightHandler.removeAllHandlers();
    this.drewBorderBottomHandler.hasHandlers && this.drewBorderBottomHandler.removeAllHandlers();
    this.drawingTextHandler.hasHandlers && this.drawingTextHandler.removeAllHandlers();
    this.drewTextHandler.hasHandlers && this.drewTextHandler.removeAllHandlers();
  }

}
