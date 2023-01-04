import { DataType, Event as wjEven, Point, Rect } from '@grapecity/wijmo';
import { CellRange, CellType, FlexGrid, GridPanel, GroupRow, Row } from '@grapecity/wijmo.grid';
import { CellStyleEnum } from '../../data-type/enum';
import { BravoGraphicsRenderer } from './bravo-graphics/bravo.graphics.renderer';
import { Font } from './bravo-graphics/font';
import { BravoTextMetrics } from './bravo-graphics/measure-text-canvas/bravo.canvas.measure.text';
import { BravoSvgEngine } from './bravo.svg.engine';
import { hasBorderBottom, hasBorderLeft, hasBorderRight, hasBorderTop, isInline, isTransparent } from './core/css.util';
import { isElement, isHTMLButtonElement, isHTMLImageElement, isHTMLInputElement, isHTMLSpanElement, isTextNode } from './core/dom.util';
import { arrowDown, arrowUp, collapse, expand, inputChecked, inputUnchecked, pinned, unpinned } from './core/icons.svg';
import { creatorSVG, declareNamespaceSvg, drawImage, drawText, getAcceptStylesBorderSvg, getAcceptStylesTextSvg, getBgRectFromStylesSetup, setAttrSvgIcon } from './core/svg.engine.util';
import { BehaviorText, CellPadding, IPayloadEvent, ISiblings, PayloadCache, TextAlign } from './core/type.util';
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
  public stylesSetup: Map<CellStyleEnum, Record<string, string>> = new Map<CellStyleEnum, Record<string, string>>();
  private _payloadCache!: PayloadCache;
  private _parser!: DOMParser;
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
      //!clean cache and complete render
      this.endRender();
      this._payloadCache = {} as PayloadCache;
    }
  }
  /**
     * @desc: vẽ các cột bị pin hoặc đóng băng (frozen)
     * @pram pPanel: GridPanel
     * @return : SvgElement
  */
  private _drawCellPanelFrozen(pPanel: GridPanel) {
    /*
    ?Trường hợp cột bị pin hay đóng băng thì thay đổi lại view range của các cột nhìn thấy sang các cột bị đóng băng!
    */
    if (!this.flexGrid.frozenColumns) return;
    const { row2: _nRow2, row: _nRow } = pPanel.viewRange;
    const _viewRange = new CellRange(_nRow, 0, _nRow2, this.flexGrid.columns.frozen - 1);
    this._drawCellPanel(pPanel, _viewRange);
  }
  /**
    * @desc: vẽ border theo styles của cell trong flex
 */
  private _drawBorderCell() {
    const { left: _nLeft, top: _nTop, bottom: _nBottom, right: _nRight } = this._payloadCache.cellBoundingRect;
    const _borders = getAcceptStylesBorderSvg(this._payloadCache.cellStyles);
    if (hasBorderBottom(this._payloadCache.cellStyles)) {
      const _lineSvgEl = this.drawLine(_nLeft, _nBottom, _nRight, _nBottom);
      _lineSvgEl.setAttribute('stroke-width', _borders['borderBottomWidth']);
      _lineSvgEl.setAttribute('stroke', _borders['borderBottomColor']);
    }
    if (hasBorderTop(this._payloadCache.cellStyles)) {
      const _lineSvgEl = this.drawLine(_nLeft, _nTop, _nRight, _nTop);
      _lineSvgEl.setAttribute('stroke-width', _borders['borderTopWidth']);
      _lineSvgEl.setAttribute('stroke', _borders['borderTopColor']);
    }
    if (hasBorderRight(this._payloadCache.cellStyles)) {
      const _lineSvgEl = this.drawLine(_nRight, _nTop, _nRight, _nBottom);
      _lineSvgEl.setAttribute('stroke-width', _borders['borderRightWidth']);
      _lineSvgEl.setAttribute('stroke', _borders['borderRightColor']);
    }
    if (hasBorderLeft(this._payloadCache.cellStyles)) {
      const _lineSvgEl = this.drawLine(_nLeft, _nTop, _nLeft, _nBottom);
      _lineSvgEl.setAttribute('stroke-width', _borders['borderLeftWidth']);
      _lineSvgEl.setAttribute('stroke', _borders['borderLeftColor']);
    }
  }
  /**
  * @desc: dùng để vẽ theo cell Panel : cells, columnsHeader,columnsFooter,...
  * @pram pPanel: GridPanel, pViewRange(optional): CellRange
  */
  private _drawCellPanel(pPanel: GridPanel, pViewRange?: CellRange) {
    const { row: _nRowStart, row2: _nRowEnd, col: _nColStart, col2: _nColEnd } = pViewRange || pPanel.viewRange;
    //!initial Cache data
    this._payloadCache = {} as PayloadCache;
    this._payloadCache.panel = pPanel;
    for (let _nColIndex = _nColStart; _nColIndex <= _nColEnd; _nColIndex++) {
      for (let _nRowIndex = _nRowStart; _nRowIndex <= _nRowEnd; _nRowIndex++) {
        let _cellEl = pPanel.getCellElement(_nRowIndex, _nColIndex);
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
        !Cache data here
        ?Lưu lại các dữ liệu trong một quy trình vẽ theo cell panel;
        */
        this._payloadCache.cellElement = _cellEl;
        this._payloadCache.cellStyles = getComputedStyle(_cellEl);
        this._payloadCache.cellBoundingRect = this._changeOriginCoordinates(_cellEl.getBoundingClientRect());
        this._payloadCache.row = _nRowIndex;
        this._payloadCache.col = _nColIndex;
        this._payloadCache.group = _groupSvgEl;
        this._drawRectCell();
        this.endGroup();
      }
    }
  }
  /**
     * @desc: dùng để vẽ rectangle svg theo kích thước và tọa độ của cell
  */
  private _drawRectCell(): void {
    const _cellBoundingRect = this._payloadCache.cellBoundingRect;
    const _cellStyles = this._payloadCache.cellStyles;
    const _rectSvgEl = this.drawRect(_cellBoundingRect.left, _cellBoundingRect.top, _cellBoundingRect.width, _cellBoundingRect.height);
    _cellStyles.backgroundColor && !isTransparent(_cellStyles.backgroundColor) && _rectSvgEl.setAttribute('fill', _cellStyles.backgroundColor || 'rgba(0, 0, 0, 0)');
    this._drawBorderCell();
    /*
    ?Sau khi vẽ xong rectangle bắt đầu quét các phần tử bên trong cell và draw theo các trường hợp image,button,text node,...
    */
    this._scanCell(this._payloadCache.cellElement);
  }
  /**
     * @desc: dùng để quét và vẽ các phần tử con theo các trường hợp tương ứng như image,button,text node,etc...
     * @param pElScanned: Element (phần tử được quét)
  */
  private _scanCell(pElScanned: Element,) {
    if (pElScanned.hasChildNodes()) {
      pElScanned.childNodes.forEach((pNode: Node) => {
        //?case text node;
        if (isTextNode(pNode)) {
          const _svgEl = this._drawTextNodeInCell(pNode);
          _svgEl && this._payloadCache.group.appendChild(_svgEl as Node);
        }
        //?case image;
        if (isHTMLImageElement(pNode as HTMLElement)) {
          const _svgEl = this._drawImageInCell(pNode as HTMLImageElement);
          _svgEl && this._payloadCache.group.appendChild(_svgEl as Node);
        }
        //?case input checkbox
        if (isHTMLInputElement(pNode as Element)) { // case input checkbox
          this._drawCheckBox(pNode);
        };
        //?case button pin
        if (this.flexGrid.allowPinning && isHTMLButtonElement(pNode as Element) && (pNode as Element).className.includes('wj-elem-pin')) {
          this._drawPin(pNode);
        }
        //?case collapse/expand
        if (isHTMLButtonElement(pNode as Element) && (pNode as Element).className.includes('wj-elem-collapse')) {
          this._drawGroupBtn(pNode);
        }
        //?case btn sort
        if (this.flexGrid.allowSorting && isHTMLSpanElement(pNode as Element) && ((pNode as Element).className.includes('wj-glyph-up') || (pNode as Element).className.includes('wj-glyph-down'))) {
          this._drawSortBtn(pNode);
        }
        this._scanCell(pNode as Element);
      });
    }
  }
  //*Handle and draw Text Here:
  /**
    * @desc: expensive function dùng để tính toán hành vi (tọa độ, điểm vẽ, hướng vẽ,...) của text node dựa trên tọa độ, kích thước của phần tử cha
    * @param pTextNode: Text
    * @returns: BehaviorText
  */
  private _calculateBehaviorTextNode(pTextNode: Text): BehaviorText {
    try {
      const { parentBoundingRect: _parentBoundingRect, parentStyles: _parentStyles } = this._getInformationParentNode(pTextNode);
      let _nDeviationHeight = 0;
      /*
      !catch dimensionText
      ?lưu lại giá trị đối với các expensive function
      */
      this._payloadCache.dimensionText = this._measureTextNode(pTextNode);
      //?kiểm tra trường hợp nếu là inline element tính độ chênh lệch chiều cao nội dung bên trong và thẻ chứa nội dung
      if (isInline(_parentStyles)) {
        let _heightOfText = this._payloadCache.dimensionText?.lineHeight || 0;
        _nDeviationHeight = (_parentBoundingRect.height - _heightOfText) / 2;
      }
      const _zAlginText = _parentStyles.textAlign;
      const { leftTotalSiblingsWidth: _nLeftTotalSiblingsWidth, rightTotalSiblingsWidth: _nRightTotalSiblingsWidth } = this._getTotalWidthSiblingNode(pTextNode);
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
      let _bIsFitContent: boolean = this._isTextNodeFitWidthCell(pTextNode);
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
   * @param: pTextNode: Text, pbBreakWords: boolean
   * @return: boolean
  */
  private _isTextNodeFitWidthCell(pTextNode: Text): boolean {
    try {
      const { parentBoundingRect: _parentBoundingRect, parentStyles: _parentStyles } = this._getInformationParentNode(pTextNode);
      const _nPaddingLeft = +_parentStyles.paddingLeft.replace('px', '');
      const _nPaddingRight = +_parentStyles.paddingRight.replace('px', '');
      const { leftTotalSiblingsWidth: _nLeftTotalSiblingsWidth, rightTotalSiblingsWidth: _nRightTotalSiblingsWidth } = this._getTotalWidthSiblingNode(pTextNode);
      const _nTextWidth = this._payloadCache.dimensionText?.width || 0;
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
  private _measureTextNode(pTextNode: Text, pbBreakWords: boolean = false): BravoTextMetrics | undefined {
    try {
      const { parentNode: _parentNode, parentStyles: _parentStyles, parentBoundingRect: _parentBoundingRect } = this._getInformationParentNode(pTextNode);
      if (!_parentNode) return undefined;
      const _font = new Font(_parentStyles.fontFamily, _parentStyles.fontSize, _parentStyles.fontWeight);
      const _dimensionOfText = BravoGraphicsRenderer.measureString(pTextNode.textContent as string, _font, _parentBoundingRect.width, pbBreakWords);
      return _dimensionOfText;
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when calculate  width of the text content!');
    }
  }
  /**
   * @description: Dùng để vẽ text node trong cell dựa trên behavior của text node
   * @param: pTextNode: Text
   * @return: SVGElement | null
  */
  private _drawTextNodeInCell(pTextNode: Text): SVGElement | null {
    try {
      const { parentStyles: _parentStyles } = this._getInformationParentNode(pTextNode);
      const _behaviorText: BehaviorText = this._calculateBehaviorTextNode(pTextNode) as BehaviorText;
      //!catch behaviorText (expensive function)
      this._payloadCache.behaviorText = _behaviorText;
      let _nWidthTextNode = this._payloadCache.dimensionText?.width || 0;
      /*
      ? Trường hợp không phải text node duy nhất hoặc là thẻ inline wrap text node
      ?Nếu width của cell nhỏ hơn tọa độ x của text return null ko draw
      ?Nếu width của cell nằm trong tọa độ x đến right thì thay đổi isTextFitWidthCell = false và switch case wrap svg
      */
      if (!this.isOnlyNode(pTextNode, Node.TEXT_NODE) || isInline(_parentStyles)) {
        if (this._payloadCache.cellBoundingRect.width < this._payloadCache.behaviorText.point.x) {
          return null;
        } else if (this._payloadCache.cellBoundingRect.width > this._payloadCache.behaviorText.point.x && this._payloadCache.cellElement.offsetWidth < this._payloadCache.behaviorText.point.x + _nWidthTextNode) {
          this._payloadCache.behaviorText.isTextFitWidthCell = false;
        }
      }
      //?case swap text by svg
      if (!this._payloadCache.behaviorText.isTextFitWidthCell) {
        const _svgWrap = this._wrapTextNodeIntoSvg(pTextNode);
        return _svgWrap;
      }
      let _zTextContent = pTextNode.textContent || '';
      if (_zTextContent === 'Parent Id ') debugger;
      if (!this.isFirstNode(pTextNode, Node.TEXT_NODE)) {
        _zTextContent = ' '.concat(_zTextContent);
      }
      const _textSvgEl = drawText((_zTextContent as string), this._payloadCache.behaviorText, _parentStyles, 'preserve');
      return _textSvgEl;
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when draw text in cell!!');
    }
  }
  /**
  * @description: Dùng để bọc svg bên ngoài text svg trong trường hợp width cửa text dài hơn chiều rộng của phần tử chứa
  * @param: pTextNode: Text
  * @return: SVGElement | null
 */
  private _wrapTextNodeIntoSvg(pTextNode: Text): SVGElement | null {
    try {
      const { parentStyles: _parentStyles, parentNode: _parentNode } = this._getInformationParentNode(pTextNode);
      const _rectSvg: Partial<DOMRect> = {};
      const { leftTotalSiblingsWidth: _leftTotalSiblingsWidth, rightTotalSiblingsWidth: _rightTotalSiblingsWidth } = this._getTotalWidthSiblingNode(pTextNode);
      const _nPaddingLeft = +this._payloadCache.cellStyles.paddingLeft.replace('px', '') || 0;
      const _nPaddingRight = +this._payloadCache.cellStyles.paddingRight.replace('px', '') || 0;
      /*
      ?case 1 inline wrap text: width svg = phần còn lại của width trừ đi tổng chiều rộng các phần tử anh em nằm bên trái và padding left và phải
      ?case 2 nếu là text node duy nhất thì trừ đi cả chiều rộng của các phần tử nằm bên phải!.
      ?case 3 nếu là ko là text node duy nhất thì không trừ chiều rộng của các phần tử bên phải(trừ sẽ bị âm)
      */
      if (isInline(_parentStyles)) {
        let { leftTotalSiblingsWidth: _leftTotalSiblingsWidth } = this._getTotalWidthSiblingNode(_parentNode);
        _rectSvg.width = this._payloadCache.cellBoundingRect.width - _leftTotalSiblingsWidth - _nPaddingLeft - _nPaddingRight;
      } else {
        _rectSvg.width = this._payloadCache.cellBoundingRect.width - _leftTotalSiblingsWidth - _nPaddingLeft - _nPaddingRight;
        if (this.isOnlyNode(pTextNode, Node.TEXT_NODE)) {
          _rectSvg.width -= _rightTotalSiblingsWidth;
        }
      }
      _rectSvg.height = this._payloadCache.cellElement.clientHeight || 0;
      if (_rectSvg.width <= 0 || _rectSvg.height <= 0) {
        return null;
      }
      _rectSvg.x = this._payloadCache.behaviorText.point.x;
      _rectSvg.y = this._payloadCache.behaviorText.point.y;
      const _svgWrapText = creatorSVG(_rectSvg, true);
      //draw text
      let _ztextContent = pTextNode.textContent || '';
      if (!this.isFirstNode(pTextNode, Node.TEXT_NODE)) {
        _ztextContent = ' '.concat(_ztextContent);
      }
      const _textSvgEl = drawText(_ztextContent, this._payloadCache.behaviorText as BehaviorText, _parentStyles, 'preserve');
      _textSvgEl.setAttribute('x', '0');
      _textSvgEl.setAttribute('y', '0');
      _svgWrapText.appendChild(_textSvgEl);
      this._payloadCache.group.appendChild(_svgWrapText);
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
  private _calculateTotalWidthSiblings(pSiblings: ChildNode[]): number {
    let _nTotalWidth: number = pSiblings.reduce((pnAcc, pNode) => {
      if (isTextNode(pNode)) {
        const _dimensionOfText = this._measureTextNode(pNode, false);
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

  /**
  * @description: Lấy tổng chiều rộng của các phần tử anh em nằm bên trái và phải của node
  * @param: node: Node
  * @return: {  rightTotalSiblingsWidth,leftTotalSiblingsWidth}
  */
  private _getTotalWidthSiblingNode(pNode: Node) {
    let _nRightTotalSiblingsWidth = 0;
    let _nLeftTotalSiblingsWidth = 0;
    const _siblings: ISiblings = this.scanSiblingsNode(pNode);
    if (_siblings.leftSideCurrentNode.length === 0 && _siblings.rightSideCurrentNode.length === 0) return { rightTotalSiblingsWidth: _nRightTotalSiblingsWidth, leftTotalSiblingsWidth: _nLeftTotalSiblingsWidth };
    _nLeftTotalSiblingsWidth = this._calculateTotalWidthSiblings(_siblings.leftSideCurrentNode);
    _nRightTotalSiblingsWidth = this._calculateTotalWidthSiblings(_siblings.rightSideCurrentNode);
    return {
      rightTotalSiblingsWidth: _nRightTotalSiblingsWidth,
      leftTotalSiblingsWidth: _nLeftTotalSiblingsWidth
    };
  }

  /**
  * @description: Dùng để lấy thông tin của node cha (rect, styles, element)
  * @param: node: Node
  * @return:{parentNode,parentBoundingRect,parentStyles};
  */
  private _getInformationParentNode(pNode: Node) {
    let _parentNode: Element;
    let _parentBoundingRect: Rect;
    let _parentStyles: CSSStyleDeclaration;
    if (pNode.parentElement === this._payloadCache.cellElement) {
      _parentNode = this._payloadCache.cellElement;
      _parentStyles = this._payloadCache.cellStyles;
      _parentBoundingRect = this._payloadCache.cellBoundingRect;
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
  /**
  * @description: Dùng để vẽ Image trong trường hợp nếu node có typle là HTMLImageElement
  * @param: imageNode: HTMLImageElement, parentNode: Element
  * @return:SVGElement
  */
  private _drawImageInCell(pImageNode: HTMLImageElement): SVGElement {
    const _imageBoundingRect = this._changeOriginCoordinates(pImageNode.getBoundingClientRect());
    let parentBoundingRect = this._payloadCache.cellBoundingRect;
    if ((parentBoundingRect.height < _imageBoundingRect.height) || (parentBoundingRect.width < _imageBoundingRect.width)) {
      const _svgWrap = this._wrapImageIntoSvg(pImageNode);
      return _svgWrap;
    }
    const _imageSvgEl = this.drawImage(pImageNode.src, _imageBoundingRect.left, _imageBoundingRect.top, _imageBoundingRect.width, _imageBoundingRect.height);
    return _imageSvgEl;
  }

  /**
  * @description: Dùng để bọc svg bên ngoài của image svg trong trường hợp kích thước của image to hơn phần tử chứa
  * @param: imageNode: HTMLImageElement, parentNode: Element
  * @return:SVGElement
  */
  private _wrapImageIntoSvg(pImageEl: HTMLImageElement): SVGElement {
    const _rectSvgEl: Partial<Rect> = {};
    const _parentBoundingRect = this._payloadCache.cellBoundingRect;
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

  /**
    * @description: Dùng để vẽ trường hợp node là input check box
    * @param:node: Node
    * @return:SVGElement
    */
  private _drawCheckBox(pNode: Node) {
    const _inputNode = pNode as HTMLInputElement;
    const _inputRect = this._changeOriginCoordinates(_inputNode.getBoundingClientRect());
    if (_inputNode.checked) {
      const svgChecked = this._parser.parseFromString(inputChecked, 'image/svg+xml').childNodes[0] as SVGElement;
      setAttrSvgIcon(svgChecked, _inputRect.left, _inputRect.top, _inputRect.width, _inputRect.height);
      this._payloadCache.group.appendChild(svgChecked);
    } else {
      const svgUnChecked = this._parser.parseFromString(inputUnchecked, 'image/svg+xml').childNodes[0] as SVGElement;
      setAttrSvgIcon(svgUnChecked, _inputRect.left, _inputRect.top, _inputRect.width, _inputRect.height);
      this._payloadCache.group.appendChild(svgUnChecked);
    }
  }

  private _drawPin(pNode: Node) {
    const _pinNode = pNode as HTMLElement;
    const _pinRect = this._changeOriginCoordinates(_pinNode.getBoundingClientRect());
    if (this._payloadCache.cellBoundingRect.width < _pinRect.width || this._payloadCache.cellBoundingRect.height < _pinRect.height) return;
    if (_pinNode.className.includes('wj-state-pinned')) {
      const _svgPinned = this._parser.parseFromString(pinned, 'image/svg+xml').childNodes[0] as SVGElement;
      _svgPinned.setAttribute('fill', '#333');
      setAttrSvgIcon(_svgPinned, _pinRect.left, _pinRect.top, _pinRect.width, _pinRect.height);
      this._payloadCache.group.appendChild(_svgPinned);
    } else {
      const _svgUnpinned = this._parser.parseFromString(unpinned, 'image/svg+xml').childNodes[0] as SVGElement;
      _svgUnpinned.setAttribute('fill', '#3333');
      setAttrSvgIcon(_svgUnpinned, _pinRect.left, _pinRect.top, _pinRect.width, _pinRect.height);
      this._payloadCache.group.appendChild(_svgUnpinned);
    }
  }

  private _drawGroupBtn(pNode: Node) {
    const _groupBtnNode = pNode as HTMLElement;
    const _groupBtnRect = this._changeOriginCoordinates(_groupBtnNode.getBoundingClientRect());
    const _panel = this._payloadCache.panel;
    const _nCurrentRow = this._payloadCache.row;
    if (!(_panel.rows[_nCurrentRow] instanceof GroupRow) || (this._payloadCache.cellBoundingRect.width < _groupBtnRect.width || this._payloadCache.cellBoundingRect.height < _groupBtnRect.height)) return;
    if ((_panel.rows[_nCurrentRow] as GroupRow).isCollapsed) {
      const _svgCollapse = this._parser.parseFromString(collapse, 'image/svg+xml').childNodes[0] as SVGElement;
      setAttrSvgIcon(_svgCollapse, _groupBtnRect.left, _groupBtnRect.top, _groupBtnRect.width, _groupBtnRect.height);
      this._payloadCache.group.appendChild(_svgCollapse);
    } else {
      const _svgexpand = this._parser.parseFromString(expand, 'image/svg+xml').childNodes[0] as SVGElement;
      setAttrSvgIcon(_svgexpand, _groupBtnRect.left, _groupBtnRect.top, _groupBtnRect.width, _groupBtnRect.height);
      this._payloadCache.group.appendChild(_svgexpand);
    }
  }
  private _drawSortBtn(pNode: Node) {
    const _sortBtnNode = pNode as HTMLElement;
    const _sortBtnRect = this._changeOriginCoordinates(_sortBtnNode.getBoundingClientRect());
    const _panel = this._payloadCache.panel;
    if (_panel.cellType !== CellType.ColumnHeader || (this._payloadCache.cellBoundingRect.width < _sortBtnRect.width || this._payloadCache.cellBoundingRect.height < _sortBtnRect.height)) return;
    if (_sortBtnNode.className.includes('wj-glyph-up')) {
      const _svgArrowUp = this._parser.parseFromString(arrowUp, 'image/svg+xml').childNodes[0] as SVGElement;
      setAttrSvgIcon(_svgArrowUp, _sortBtnRect.left, _sortBtnRect.top, _sortBtnRect.width, _sortBtnRect.height);
      declareNamespaceSvg(_svgArrowUp);
      this._payloadCache.group.appendChild(_svgArrowUp);
    } else {
      const _svgArrowDown = this._parser.parseFromString(arrowDown, 'image/svg+xml').childNodes[0] as SVGElement;
      setAttrSvgIcon(_svgArrowDown, _sortBtnRect.left, _sortBtnRect.top, _sortBtnRect.width, _sortBtnRect.height);
      this._payloadCache.group.appendChild(_svgArrowDown);
    }
  }
  //==========================================================================================================
  //**Draw raw svg start here:
  //**declared property here */
  private _stylesBase!: CSSStyleDeclaration;
  private _stylesTextSetup!: Record<string, string>;
  private _stylesBorderSetup!: Record<string, string>;
  private _zBgColorSetup!: string;
  public cellPadding: CellPadding = { paddingBottom: 8, paddingLeft: 8, paddingTop: 8, paddingRight: 8 };
  public isRawValue: boolean = false;
  //**events declared here
  public drewRectHandler = new wjEven<FlexGridSvgEngine, IPayloadEvent>();
  public drewBorderRightHandler = new wjEven<FlexGridSvgEngine, IPayloadEvent>();
  public drewBorderBottomHandler = new wjEven<FlexGridSvgEngine, IPayloadEvent>();
  public drawingTextHandler = new wjEven<FlexGridSvgEngine, IPayloadEvent>();
  public drewTextHandler = new wjEven<FlexGridSvgEngine, IPayloadEvent>();
  //*method raise event here:

  /**
  * @description: raise ra event drew rectangle (sau khi vẽ)
  * @param:pPayloadEvent: IPayloadEvent
  */
  public onDrewRect(pPayloadEvent: IPayloadEvent) {
    this.drewRectHandler.raise(this, pPayloadEvent);
  }

  /**
  * @description: raise ra event drawing text (trước khi vẽ)
  * @param:pPayloadEvent: IPayloadEvent
  */
  public onDrawingText(pPayloadEvent: IPayloadEvent) {
    this.drawingTextHandler.raise(this, pPayloadEvent);
  }

  /**
  * @description: raise ra event drew text (sau khi vẽ)
  * @param:pPayloadEvent: IPayloadEvent
  */
  public onDrewText(pPayloadEvent: IPayloadEvent) {
    this.drewTextHandler.raise(this, pPayloadEvent);
  }

  /**
  * @description: raise ra event drew border right (sau khi vẽ)
  * @param:pPayloadEvent: IPayloadEvent
  */
  public onDrewBorderRight(pPayloadEvent: IPayloadEvent) {
    this.drewBorderRightHandler.raise(this, pPayloadEvent);
  }
  /**
  * @description: raise ra event drew border bottom (sau khi vẽ)
  * @param:pPayloadEvent: IPayloadEvent
  */
  public onDrewBorderBottom(pPayloadEvent: IPayloadEvent) {
    this.drewBorderBottomHandler.raise(this, pPayloadEvent);
  }

  /**
  * @description: lấy ra data cần trong _payloadCache để gửi đi cùng với event
  * @return: IPayloadEvent
  */
  private _getPayloadEvent(): IPayloadEvent {
    const _payloadEvent: IPayloadEvent = {} as IPayloadEvent;
    _payloadEvent.col = this._payloadCache.col;
    _payloadEvent.row = this._payloadCache.row;
    _payloadEvent.panel = this._payloadCache.panel;
    _payloadEvent.cellValue = this._payloadCache.cellValue;
    return _payloadEvent as IPayloadEvent;
  }

  /**
  * @desc: Hàm này dùng để export svg (tất cả data trong flex grid) vẽ theo panel (cells,columnsHeader,etc...)
  * @return : SvgElement
  */
  public renderFlexSvgRaw(): SVGElement {
    try {
      this.beginRender();
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
      this._payloadCache = {} as PayloadCache;
      this.cleanEvents();
    }
  }

  /**
 * @desc: Hàm này dùng để export svg (tất cả data trong flex grid) vẽ theo panel (cells,columnsHeader,etc...)
 * @return : SvgElement
 */
  private _drawRawCellPanel(pPanel: GridPanel) {
    //!initialize cache data here
    this._payloadCache = {} as PayloadCache;
    this._payloadCache.panel = pPanel;
    for (let _nColIndex = 0; _nColIndex < pPanel.columns.length; _nColIndex++) {
      for (let _nRowIndex = 0; _nRowIndex < pPanel.rows.length; _nRowIndex++) {
        const _cellRange = this.flexGrid.getMergedRange(pPanel, _nRowIndex, _nColIndex, false);
        const _cellBoundingRect = pPanel.getCellBoundingRect(_nRowIndex, _nColIndex, true);
        let _cellValue = pPanel.getCellData(_nRowIndex, _nColIndex, this.isRawValue);
        //!cache data
        this._payloadCache.col = _nColIndex;
        this._payloadCache.row = _nRowIndex;
        this._payloadCache.cellBoundingRect = _cellBoundingRect;
        this._payloadCache.cellRange = _cellRange;
        this._payloadCache.cellValue = _cellValue;
        this._payloadCache.isRowGroup = pPanel.rows[_nRowIndex] instanceof GroupRow;
        /*
          ?apply style setup cho text, border, bg color...
          !apply style khi sau khi cache data.
        */
        this._applyStyleSetup();
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
        //?Case Pin
        if (_nColIndex < pPanel.columns.frozen) {
          _cellBoundingRect.left += this.flexGrid.scrollPosition.x * (this.flexGrid.rightToLeft ? -1 : +1);
        }
        //kiểm tra xem liệu cell có phải là cell group hay không?
        if (!_cellRange || (_cellRange && _cellRange.isSingleCell)) {
          if (pPanel.rows[_nRowIndex].visibleIndex !== -1) {
            const _groupEl = this.startGroup();
            //!cache group
            this._payloadCache.group = _groupEl;
            this._drawRawRectCell();
            this.endGroup();
          }
        } else {
          //trường hợp cell group hoặc merge chỉ vẻ lần đầu tiên! tránh trường hợp draw nhiều lần!
          if ((_nRowIndex == _cellRange.row && _nColIndex === _cellRange.col && pPanel.rows[_nRowIndex].visibleIndex !== -1)) {
            const _groupEl = this.startGroup();
            this._payloadCache.group = _groupEl;
            this._drawRawRectCell();
            this.endGroup();
          }
        }
      }
    }
  }
  /**
  * @desc: vẽ rectangle svg theo thông số của cell.
  */
  private _drawRawRectCell(): void {
    const _panel = this._payloadCache.panel;
    const _rect = this._payloadCache.cellBoundingRect;
    const _cellRange = this._payloadCache.cellRange;
    //trường hợp cell được merge hoặc gr thì kích thước của rectangle bằng tổng các cell
    if (_cellRange && !_cellRange.isSingleCell) {
      for (let _nIndex = _cellRange.col + 1; _nIndex <= _cellRange.col2; _nIndex++) {
        _rect.width += _panel.columns[_nIndex].renderWidth; // total width of rectangle
      }
      for (let _nIndex = _cellRange.row + 1; _nIndex <= _cellRange.row2; _nIndex++) {
        _rect.height += _panel.rows[_nIndex].renderHeight; // total height of rectangle
      }
    }
    const _rectSvgEl = this.drawRect(_rect.left, _rect.top, _rect.width, _rect.height);
    const _payloadEvent = this._getPayloadEvent();
    _payloadEvent.svgDrew = _rectSvgEl;
    _rectSvgEl.setAttribute('fill', this._zBgColorSetup);
    this.onDrewRect(_payloadEvent);
    //?Draw border and content in cell here!
    this._drawRawBorderCell();
    this._drawContentInCell();
  }

  /**
  * @desc: vẽ border bằng line svg theo thông số của styles setup .
  */
  private _drawRawBorderCell() {
    const _rect = this._payloadCache.cellBoundingRect;
    const _payloadEvent = this._getPayloadEvent();
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

  /**
  * @desc: Vẽ nội dung trong cell theo cell type(cells,columnsHeader,...) và value cell bao gồm string,boolean,....
  */
  private _drawContentInCell() {
    const _cellValue = this._payloadCache.cellValue;
    if (this._payloadCache.panel.cellType === CellType.Cell && this._payloadCache.panel.columns[this._payloadCache.col].dataType === DataType.Boolean && !this._payloadCache.isRowGroup) {
      this._drawCheckboxRaw();
    } else if (_cellValue) {
      const _payloadEvent = this._getPayloadEvent();
      this.onDrawingText(_payloadEvent);//raise event drawing text
      if (this._payloadCache.cellValue !== _payloadEvent.cellValue) {
        this._payloadCache.cellValue = _payloadEvent.cellValue;
      }
      this._drawTextRawInCell();
    }
  }

  /**
  * @desc: expensive function dùng để tính toán hành vi (tọa độ, điểm vẽ, hướng vẽ,...) của text node dựa trên tọa độ, kích thước của rect cell raw
  * @returns: BehaviorText
 */
  private _calculateBehaviorTextRaw(): BehaviorText {
    try {
      const _panel = this._payloadCache.panel;
      const _nCurrentCol = this._payloadCache.col;
      const _nCurrentRow = this._payloadCache.row;
      const _cellValue = this._payloadCache.cellValue;
      const _cellBoundingRect = this._payloadCache.cellBoundingRect;
      let _nPaddingLeft = this.cellPadding.paddingLeft;
      let _nPaddingRight = this.cellPadding.paddingRight;
      let _paddingTop = this.cellPadding.paddingTop;
      let _nXTextDefault = _cellBoundingRect.left + _nPaddingLeft;
      const _yTextDefault = _cellBoundingRect.top + _paddingTop;
      let _zAlginText = _panel.columns[_nCurrentCol].align || 'left'; //default left
      if (_panel.columns[_nCurrentCol].dataType === DataType.Boolean) {
        _zAlginText = _panel.columns[_nCurrentCol].align || 'center'; //default center for data type is boolean
      }
      //Case indent for row group
      if (this._payloadCache.isRowGroup) {
        _nXTextDefault += (_panel.rows[_nCurrentRow] as GroupRow).level * this.flexGrid.treeIndent;
        _nPaddingLeft += (_panel.rows[_nCurrentRow] as GroupRow).level * this.flexGrid.treeIndent;
        _zAlginText = _panel.rows[_nCurrentRow].align || 'left';//default left
      }
      const _behaviorTextBase: Partial<BehaviorText> = { dominantBaseline: 'hanging', point: new Point(_nXTextDefault, _yTextDefault), textAnchor: 'start' };
      const _font = new Font(this._stylesTextSetup['fontFamily'], this._stylesTextSetup['fontSize'], this._stylesTextSetup['fontWeight']);
      const _dimensionOfText = BravoGraphicsRenderer.measureString(_cellValue, _font, _cellBoundingRect.width, false);
      let _bIsFitContent: boolean = (_dimensionOfText?.width || 0) <= (_cellBoundingRect.width - _nPaddingLeft - _nPaddingRight);
      switch (_zAlginText) {
        case TextAlign.Left:
        case TextAlign.Start:
          _behaviorTextBase.textAnchor = 'start';
          _behaviorTextBase.isTextFitWidthCell = _bIsFitContent;
          return (_behaviorTextBase as BehaviorText);
        case TextAlign.Center:
          if (_bIsFitContent) {
            _behaviorTextBase.point!.x += (_cellBoundingRect.width) / 2 - _nPaddingLeft;
            _behaviorTextBase.textAnchor = 'middle';
            _behaviorTextBase.isTextFitWidthCell = true;
            return (_behaviorTextBase as BehaviorText);
          }
          _behaviorTextBase.isTextFitWidthCell = false;
          return (_behaviorTextBase as BehaviorText);
        case TextAlign.Right:
        case TextAlign.End:
          if (_bIsFitContent) {
            _behaviorTextBase.point!.x += (_cellBoundingRect.width - _nPaddingRight - _nPaddingLeft);
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
  }
  /**
   * @description: Dùng để vẽ text node trong cell dựa trên behavior
   * @return: SVGElement | null
  */
  private _drawTextRawInCell(): SVGElement | null {
    const _textBehavior = this._calculateBehaviorTextRaw();
    //!cache text behavior
    this._payloadCache.behaviorText = _textBehavior;
    if (!_textBehavior.isTextFitWidthCell) {
      const _svgEl = this._wrapTextRawIntoSvg();
      return _svgEl;
    }
    const _textSvgEl = drawText(this._payloadCache.cellValue, _textBehavior as BehaviorText, this._stylesTextSetup);
    const _payloadEvent = this._getPayloadEvent();
    _payloadEvent.svgDrew = _textSvgEl;
    this.onDrewText(_payloadEvent);
    this._payloadCache.group.appendChild(_textSvgEl);
    return _textSvgEl as SVGElement;
  }
  /**
  * @description: Dùng để bọc svg bên ngoài text svg trong trường hợp width cửa text dài hơn chiều rộng của cell
  * @return: SVGElement | null
  */
  private _wrapTextRawIntoSvg(): SVGElement | null {
    try {
      const _rectSvg: Partial<DOMRect> = {};
      let _nPaddingLeft = this.cellPadding.paddingLeft;
      let _nPaddingRight = this.cellPadding.paddingRight;
      //Case indent for row group
      if (this._payloadCache.isRowGroup) {
        _nPaddingLeft += (this._payloadCache.panel.rows[this._payloadCache.row] as GroupRow).level * this.flexGrid.treeIndent;
      }
      _rectSvg.width = this._payloadCache.cellBoundingRect.width - _nPaddingLeft - _nPaddingRight;
      _rectSvg.height = (this._payloadCache.cellBoundingRect.height - this.cellPadding.paddingTop - this.cellPadding.paddingBottom) || 0;
      if (_rectSvg.width <= 0 || _rectSvg.height <= 0) {
        return null;
      }
      _rectSvg.x = this._payloadCache.behaviorText.point.x;
      _rectSvg.y = this._payloadCache.behaviorText.point.y;
      const _svgWrapText = creatorSVG(_rectSvg, true);
      const _textSvgEl = drawText(this._payloadCache.cellValue, this._payloadCache.behaviorText as BehaviorText, this._stylesTextSetup, 'preserve');
      _textSvgEl.setAttribute('x', '0');
      _textSvgEl.setAttribute('y', '0');
      const _payloadEvent = this._getPayloadEvent();
      _payloadEvent.svgDrew = _textSvgEl;
      this.onDrewText(_payloadEvent);
      _svgWrapText.appendChild(_textSvgEl);
      this._payloadCache.group.appendChild(_svgWrapText);
      return _svgWrapText;
    } catch (error) {
      console.error(error);
      throw new Error('Something wrong when wrap text raw in svg');
    }
  }
  /**
 * @description: Dùng để vẽ check box với những giá trị là boolean
 */
  private _drawCheckboxRaw(): void {
    const _rect = this._payloadCache.cellBoundingRect;
    let _nWidthCheckbox = 13;
    let _nHeightCheckbox = 13;
    let _nXCheckbox = _rect.left + _rect.width / 2 - _nWidthCheckbox / 2;
    let _nYCheckBox = _rect.top + _rect.height / 2 - _nHeightCheckbox / 2;
    if (_rect.width < _nWidthCheckbox || _rect.height < _nHeightCheckbox) return;
    if (this._payloadCache.cellValue === 'true' || this._payloadCache.cellValue === true) {
      const svgChecked = this._parser.parseFromString(inputChecked, 'image/svg+xml').childNodes[0] as SVGElement;
      setAttrSvgIcon(svgChecked, _nXCheckbox, _nYCheckBox, _nWidthCheckbox, _nHeightCheckbox);
      this._payloadCache.group.appendChild(svgChecked);
    } else {
      const svgUnChecked = this._parser.parseFromString(inputUnchecked, 'image/svg+xml').childNodes[0] as SVGElement;
      setAttrSvgIcon(svgUnChecked, _nXCheckbox, _nYCheckBox, _nWidthCheckbox, _nHeightCheckbox);
      this._payloadCache.group.appendChild(svgUnChecked);
    }
  }
  /**
  * @description: Apply styles setup cho text, border, background rectangle
  */
  private _applyStyleSetup(): void {
    const _panel = this._payloadCache.panel;
    const _currentRow = this._payloadCache.row;
    const _currentCol = this._payloadCache.col;
    const _cellRange = this._payloadCache.cellRange;
    let _rowAlternate = this.flexGrid.alternatingRowStep;
    //cache styles seytup
    let _stylesNormal, _stylesAlternate, _stylesColsHeader, _stylesColsFooter, _stylesRowsHeader, _stylesFrozen, _stylesNewRow, _stylesGroupLv0, _stylesGroupLv1, _stylesGroupLv2, _stylesGroupLv3, _stylesGroupLv4, _stylesGroupLv5;
    //styles normal
    if (!this._payloadCache.stylesNormal) {
      _stylesNormal = (this.stylesSetup.has(CellStyleEnum.Normal) && this.stylesSetup.get(CellStyleEnum.Normal)) ? { ...this._stylesBase, ...this.stylesSetup.get(CellStyleEnum.Normal) } : this._stylesBase;
      this._payloadCache.stylesNormal = _stylesNormal; //cache styles normal
    } else {
      _stylesNormal = this._payloadCache.stylesNormal;
    }
    //styles alternate
    if (!this._payloadCache.stylesAlternate) {
      _stylesAlternate = (this.stylesSetup.has(CellStyleEnum.Alternate) && this.stylesSetup.get(CellStyleEnum.Alternate)) ? { ..._stylesNormal, ...this.stylesSetup.get(CellStyleEnum.Alternate) } : _stylesNormal;
      this._payloadCache.stylesAlternate = _stylesAlternate; //cache styles alternate
    } else {
      _stylesAlternate = this._payloadCache.stylesAlternate;
    }
    //styles col header
    if (!this._payloadCache.stylesColsHeader) {
      _stylesColsHeader = (this.stylesSetup.has(CellStyleEnum.Fixed) && this.stylesSetup.get(CellStyleEnum.Fixed)) ? { ..._stylesNormal, ...this.stylesSetup.get(CellStyleEnum.Fixed) } : _stylesNormal;
      this._payloadCache.stylesColsHeader = _stylesColsHeader; //cache styles cols header
    } else {
      _stylesColsHeader = this._payloadCache.stylesColsHeader;
    }
    //styles cols footer
    if (!this._payloadCache.stylesColsFooter) {
      _stylesColsFooter = (this.stylesSetup.has(CellStyleEnum.ColumnsFooter) && this.stylesSetup.get(CellStyleEnum.ColumnsFooter)) ? { ..._stylesColsHeader, ...this.stylesSetup.get(CellStyleEnum.ColumnsFooter) } : _stylesColsHeader;
      this._payloadCache.stylesColsFooter = _stylesColsFooter; //cache styles cols footer
    } else {
      _stylesColsFooter = this._payloadCache.stylesColsFooter;
    }
    //styles row header
    if (!this._payloadCache.stylesRowsHeader) {
      _stylesRowsHeader = (this.stylesSetup.has(CellStyleEnum.RowHeader) && this.stylesSetup.get(CellStyleEnum.RowHeader)) ? { ..._stylesNormal, ... this.stylesSetup.get(CellStyleEnum.RowHeader) } : _stylesNormal;
      this._payloadCache.stylesRowsHeader = _stylesRowsHeader; //cache styles rowsHeader
    } else {
      _stylesRowsHeader = this._payloadCache.stylesRowsHeader;
    }
    //frozen styles
    if (!this._payloadCache.stylesFrozen) {
      _stylesFrozen = (this.stylesSetup.has(CellStyleEnum.Frozen) && this.stylesSetup.get(CellStyleEnum.Frozen)) ? { ..._stylesAlternate, ...this.stylesSetup.get(CellStyleEnum.Frozen) } : _stylesAlternate;
      this._payloadCache.stylesFrozen = _stylesFrozen; //cache styles frozen
    } else {
      _stylesFrozen = this._payloadCache.stylesFrozen;
    }
    //new row style
    if (!this._payloadCache.stylesNewRow) {
      _stylesNewRow = (this.stylesSetup.has(CellStyleEnum.NewRow) && this.stylesSetup.get(CellStyleEnum.NewRow)) ? { ..._stylesNormal, ...this.stylesSetup.get(CellStyleEnum.NewRow) } : _stylesNormal;
      this._payloadCache.stylesNewRow = _stylesNewRow; //cache styles new row
    } else {
      _stylesNewRow = this._payloadCache.stylesNewRow;
    }
    //styles group (level)
    if (!this._payloadCache.stylesGroupLv0) {
      _stylesGroupLv0 = (this.stylesSetup.has(CellStyleEnum.Subtotal0) && this.stylesSetup.get(CellStyleEnum.Subtotal0)) ? { ..._stylesFrozen, ...this.stylesSetup.get(CellStyleEnum.Subtotal0) } : _stylesFrozen;
      this._payloadCache.stylesGroupLv0 = _stylesGroupLv0;  //cache styles group level 0
    } else {
      _stylesGroupLv0 = this._payloadCache.stylesGroupLv0;
    }

    if (!this._payloadCache.stylesGroupLv1) {
      _stylesGroupLv1 = (this.stylesSetup.has(CellStyleEnum.Subtotal1) && this.stylesSetup.get(CellStyleEnum.Subtotal1)) ? { ..._stylesFrozen, ...this.stylesSetup.get(CellStyleEnum.Subtotal1) } : _stylesFrozen;
      this._payloadCache.stylesGroupLv1 = _stylesGroupLv1;  //cache styles group level 1
    } else {
      _stylesGroupLv1 = this._payloadCache.stylesGroupLv1;
    }

    if (!this._payloadCache.stylesGroupLv2) {
      _stylesGroupLv2 = (this.stylesSetup.has(CellStyleEnum.Subtotal2) && this.stylesSetup.get(CellStyleEnum.Subtotal2)) ? { ..._stylesFrozen, ...this.stylesSetup.get(CellStyleEnum.Subtotal2) } : _stylesFrozen;
      this._payloadCache.stylesGroupLv2 = _stylesGroupLv2;  //cache styles group level 2
    } else {
      _stylesGroupLv2 = this._payloadCache.stylesGroupLv2;
    }

    if (!this._payloadCache.stylesGroupLv3) {
      _stylesGroupLv3 = (this.stylesSetup.has(CellStyleEnum.Subtotal3) && this.stylesSetup.get(CellStyleEnum.Subtotal3)) ? { ..._stylesFrozen, ...this.stylesSetup.get(CellStyleEnum.Subtotal3) } : _stylesFrozen;
      this._payloadCache.stylesGroupLv3 = _stylesGroupLv3; //cache styles group level 3
    } else {
      _stylesGroupLv3 = this._payloadCache.stylesGroupLv3;
    }

    if (!this._payloadCache.stylesGroupLv4) {
      _stylesGroupLv4 = (this.stylesSetup.has(CellStyleEnum.Subtotal4) && this.stylesSetup.get(CellStyleEnum.Subtotal4)) ? { ..._stylesFrozen, ...this.stylesSetup.get(CellStyleEnum.Subtotal4) } : _stylesFrozen;
      this._payloadCache.stylesGroupLv4 = _stylesGroupLv4; //cache styles group level 4
    } else {
      _stylesGroupLv4 = this._payloadCache.stylesGroupLv4;
    }

    if (!this._payloadCache.stylesGroupLv5) {
      _stylesGroupLv5 = (this.stylesSetup.has(CellStyleEnum.Subtotal5) && this.stylesSetup.get(CellStyleEnum.Subtotal5)) ? { ..._stylesFrozen, ...this.stylesSetup.get(CellStyleEnum.Subtotal5) } : _stylesFrozen;
      this._payloadCache.stylesGroupLv5 = _stylesGroupLv5;  //cache styles group level 5
    } else {
      _stylesGroupLv5 = this._payloadCache.stylesGroupLv5;
    }
    switch (_panel.cellType) {
      case CellType.Cell:
        this._zBgColorSetup = getBgRectFromStylesSetup(_stylesNormal);
        this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesNormal);
        this._stylesTextSetup = getAcceptStylesTextSvg(_stylesNormal);
        //case alternating row
        if (this.flexGrid.showAlternatingRows) {
          let _isAlternate = false;
          if (_rowAlternate && (!_cellRange || _cellRange.row == _cellRange.row2)) {
            _isAlternate = _panel.rows[_currentRow].visibleIndex % (_rowAlternate + 1) === 0;
            _rowAlternate == 1 && (_isAlternate = !_isAlternate);
          }
          if (_isAlternate) {
            this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesAlternate);
            this._stylesTextSetup = getAcceptStylesTextSvg(_stylesAlternate);
            this._zBgColorSetup = getBgRectFromStylesSetup(_stylesAlternate);;
          }
        }
        //case frozen
        if (_currentRow < _panel.rows.frozen || _currentCol < _panel.columns.frozen) {
          this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesFrozen);
          this._zBgColorSetup = getBgRectFromStylesSetup(_stylesFrozen);
          this._stylesTextSetup = getAcceptStylesTextSvg(_stylesFrozen);
        }
        //case new row
        if (_panel.rows[_currentRow] instanceof _NewRowTemplate) {
          this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesNewRow);
          this._zBgColorSetup = getBgRectFromStylesSetup(_stylesNewRow);
          this._stylesTextSetup = getAcceptStylesTextSvg(_stylesNewRow);
        }
        //case row group by level
        if (this._payloadCache.isRowGroup) {
          switch ((_panel.rows[_currentRow] as GroupRow).level) {
            case 0:
              this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesGroupLv0);
              this._zBgColorSetup = getBgRectFromStylesSetup(_stylesGroupLv0);
              this._stylesTextSetup = getAcceptStylesTextSvg(_stylesGroupLv0);
              break;
            case 1:
              this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesGroupLv1);
              this._zBgColorSetup = getBgRectFromStylesSetup(_stylesGroupLv1);
              this._stylesTextSetup = getAcceptStylesTextSvg(_stylesGroupLv1);
              break;
            case 2:
              this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesGroupLv2);
              this._zBgColorSetup = getBgRectFromStylesSetup(_stylesGroupLv2);
              this._stylesTextSetup = getAcceptStylesTextSvg(_stylesGroupLv2);
              break;
            case 3:
              this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesGroupLv3);
              this._zBgColorSetup = getBgRectFromStylesSetup(_stylesGroupLv3);
              this._stylesTextSetup = getAcceptStylesTextSvg(_stylesGroupLv3);
              break;
            case 4:
              this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesGroupLv4);
              this._zBgColorSetup = getBgRectFromStylesSetup(_stylesGroupLv4);
              this._stylesTextSetup = getAcceptStylesTextSvg(_stylesGroupLv4);
              break;
            case 5:
              this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesGroupLv5);
              this._zBgColorSetup = getBgRectFromStylesSetup(_stylesGroupLv5);
              this._stylesTextSetup = getAcceptStylesTextSvg(_stylesGroupLv5);
              break;
            default:
              this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesFrozen);
              this._zBgColorSetup = getBgRectFromStylesSetup(_stylesFrozen);
              this._stylesTextSetup = getAcceptStylesTextSvg(_stylesFrozen);
          }
        }
        break;
      case CellType.ColumnHeader:
        this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesColsHeader);
        this._zBgColorSetup = getBgRectFromStylesSetup(_stylesColsHeader);
        this._stylesTextSetup = getAcceptStylesTextSvg(_stylesColsHeader);
        break;
      case CellType.ColumnFooter:
        this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesColsFooter);
        this._zBgColorSetup = getBgRectFromStylesSetup(_stylesColsFooter);
        this._stylesTextSetup = getAcceptStylesTextSvg(_stylesColsFooter);
        break;
      case CellType.RowHeader:
      case CellType.TopLeft:
        this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesRowsHeader);
        this._zBgColorSetup = getBgRectFromStylesSetup(_stylesRowsHeader);
        this._stylesTextSetup = getAcceptStylesTextSvg(_stylesRowsHeader);
        break;
      default:
        this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesNormal);
        this._zBgColorSetup = getBgRectFromStylesSetup(_stylesNormal);
        this._stylesTextSetup = getAcceptStylesTextSvg(_stylesNormal);
        break;
    }
  }

  /**
 * @description: Xóa tất các event handler sau khi render xong flex svg raw
 */
  public cleanEvents() {
    this.drewRectHandler.hasHandlers && this.drewRectHandler.removeAllHandlers();
    this.drewBorderRightHandler.hasHandlers && this.drewBorderRightHandler.removeAllHandlers();
    this.drewBorderBottomHandler.hasHandlers && this.drewBorderBottomHandler.removeAllHandlers();
    this.drawingTextHandler.hasHandlers && this.drawingTextHandler.removeAllHandlers();
    this.drewTextHandler.hasHandlers && this.drewTextHandler.removeAllHandlers();
  }
}
