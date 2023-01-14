import { DataType, Event as wjEven, Point, Rect } from '@grapecity/wijmo';
import { CellRange, CellType, FlexGrid, GridPanel, GroupRow, Row } from '@grapecity/wijmo.grid';
import { CellStyleEnum } from '../../data-type/enum';
import { BravoGraphicsRenderer } from './bravo-graphics/bravo.graphics.renderer';
import { Font } from './bravo-graphics/font';
import { BravoTextMetrics } from './bravo-graphics/measure-text-canvas/bravo.canvas.measure.text';
import { BravoSvgEngine } from './bravo.svg.engine';
import { getAlignText, hasBorderBottom, hasBorderLeft, hasBorderRight, hasBorderTop, isInline, isTransparent } from './core/css.util';
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

  private _drawRectCell(pPayload: Payload): void {
    const _cellBoundingRect = pPayload.cellBoundingRect;
    const _cellStyles = pPayload.cellStyles;
    const _rectSvgEl = this.drawRect(_cellBoundingRect.left, _cellBoundingRect.top, _cellBoundingRect.width, _cellBoundingRect.height);
    _cellStyles.backgroundColor && !isTransparent(_cellStyles.backgroundColor) && _rectSvgEl.setAttribute('fill', _cellStyles.backgroundColor || 'rgba(0, 0, 0, 0)');
    this._drawBorderCell(pPayload);
    /*
    ?Sau khi vẽ xong rectangle bắt đầu quét các phần tử bên trong cell và draw theo các trường hợp image,button,text node,...
    */
    this._scanCell(pPayload.cellElement, pPayload);
  }

  private _drawBorderCell(pPayload: Payload) {
    const { left: _nLeft, top: _nTop, bottom: _nBottom, right: _nRight } = pPayload.cellBoundingRect;
    const _borders = getAcceptStylesBorderSvg(pPayload.cellStyles);
    if (hasBorderBottom(pPayload.cellStyles)) {
      const _lineSvgEl = this.drawLine(_nLeft, _nBottom, _nRight, _nBottom);
      _lineSvgEl.setAttribute('stroke-width', _borders['borderBottomWidth']);
      _lineSvgEl.setAttribute('stroke', _borders['borderBottomColor']);
    }
    if (hasBorderTop(pPayload.cellStyles)) {
      const _lineSvgEl = this.drawLine(_nLeft, _nTop, _nRight, _nTop);
      _lineSvgEl.setAttribute('stroke-width', _borders['borderTopWidth']);
      _lineSvgEl.setAttribute('stroke', _borders['borderTopColor']);
    }
    if (hasBorderRight(pPayload.cellStyles)) {
      const _lineSvgEl = this.drawLine(_nRight, _nTop, _nRight, _nBottom);
      _lineSvgEl.setAttribute('stroke-width', _borders['borderRightWidth']);
      _lineSvgEl.setAttribute('stroke', _borders['borderRightColor']);
    }
    if (hasBorderLeft(pPayload.cellStyles)) {
      const _lineSvgEl = this.drawLine(_nLeft, _nTop, _nLeft, _nBottom);
      _lineSvgEl.setAttribute('stroke-width', _borders['borderLeftWidth']);
      _lineSvgEl.setAttribute('stroke', _borders['borderLeftColor']);
    }
  }

  private _scanCell(pElScanned: Element, pPayload: Payload) {
    if (pElScanned.hasChildNodes()) {
      pElScanned.childNodes.forEach((pNode: Node) => {

        //?case image;
        if (isHTMLImageElement(pNode as HTMLElement)) {
          const _svgEl = this._drawImageInCell(pNode as HTMLImageElement, pPayload);
          _svgEl && pPayload.group.appendChild(_svgEl as Node);
        }
        //?case input checkbox
        if (isHTMLInputElement(pNode as Element)) { // case input checkbox
          this._drawCheckBox(pNode, pPayload);
        };
        //?case button pin
        if (this.flexGrid.allowPinning && isHTMLButtonElement(pNode as Element) && (pNode as Element).className.includes('wj-elem-pin')) {
          this._drawPin(pNode, pPayload);
        }
        //?case collapse/expand
        if (isHTMLButtonElement(pNode as Element) && (pNode as Element).className.includes('wj-elem-collapse')) {
          this._drawGroupBtn(pNode, pPayload);
        }
        //?case btn sort
        if (this.flexGrid.allowSorting && isHTMLSpanElement(pNode as Element) && ((pNode as Element).className.includes('wj-glyph-up') || (pNode as Element).className.includes('wj-glyph-down'))) {
          this._drawSortBtn(pNode, pPayload);
        }
        //?case text node;
        if (isTextNode(pNode)) {
          const _svgEl = this._drawTextNodeInCell(pNode, pPayload);
          _svgEl && pPayload.group.appendChild(_svgEl as Node);
        }
        this._scanCell(pNode as Element, pPayload);
      });
    }
  }
  //*Handle and draw Text Here:
  private _calculateBehaviorTextNode(pTextNode: Text, pPayload: Payload): BehaviorText {
    try {
      const { parentBoundingRect: _parentRect, parentStyles: _parentStyles, parentNode } = this._getInformationParentNode(pTextNode, pPayload);
      let _nDeviationHeight = 0;
      pPayload.dimensionText = this._measureTextNode(pTextNode, pPayload);

      let { leftTotalSiblingsWidth: _nLeftTotalSiblingsWidth, rightTotalSiblingsWidth: _nRightTotalSiblingsWidth } = this._getTotalWidthSiblingNode(pTextNode, pPayload);
      let _nPaddingLeft = +_parentStyles.paddingLeft.replace('px', '') || 0;
      let _nPaddingTop = +_parentStyles.paddingTop.replace('px', '') || 0;
      let _nPaddingRight = +_parentStyles.paddingRight.replace('px', '') || 0;
      let _nPaddingBottom = +_parentStyles.paddingBottom.replace('px', '') || 0;
      const _panel = pPayload.panel;
      let _nCol = pPayload.col;
      let _nRow = pPayload.row;
      let _nIndentGroup = 0;
      let _bIsGroup = _panel.rows[_nRow] instanceof GroupRow;
      const _nXTextDefault = _parentRect.left;
      const _nYTextDefault = _parentRect.top;
      this._zTextAlign = getAlignText(_parentStyles);
      //?kiểm tra trường hợp nếu là inline element tính độ chênh lệch chiều cao nội dung bên trong và thẻ chứa nội dung
      if (isInline(_parentStyles, parentNode)) {
        let _heightOfText = pPayload.dimensionText?.lineHeight || 0;
        _nDeviationHeight = (_parentRect.height - _heightOfText) / 2;
      }
      if (_bIsGroup) {
        _nIndentGroup = (_panel.rows[_nRow] as GroupRow).level * this.flexGrid.treeIndent;
      }
      let _behaviorTextBase: Partial<BehaviorText> = { point: new Point(_nXTextDefault, _nYTextDefault) };
      let _bIsFitWidthContent = this._isTextNodeFitWidthCell(pTextNode, pPayload);
      let _bIsFitHeightContent = this._isTextNodeFitHeightCell(pTextNode, pPayload);
      let _bIsFitContent: boolean = _bIsFitHeightContent && _bIsFitWidthContent;
      //switch
      switch (this._zTextAlign) {
        case TextAlign.Left:
        case TextAlign.Start:
        case TextAlign.LeftTop:
          _behaviorTextBase.point!.x += (_nLeftTotalSiblingsWidth + _nPaddingLeft);
          _behaviorTextBase.point!.y += (_nPaddingTop + _nDeviationHeight);
          _behaviorTextBase.textAnchor = 'start';
          _behaviorTextBase.dominantBaseline = 'hanging';
          break;
        case TextAlign.Center:
        case TextAlign.CenterTop:
          if (_bIsFitContent) {
            if (_nCol === 0 && _panel.cellType === CellType.Cell && !_bIsGroup) {
              _behaviorTextBase.point!.x += ((_parentRect.width - _nLeftTotalSiblingsWidth - _nRightTotalSiblingsWidth + _nPaddingLeft - _nPaddingRight) / 2);
            } else {
              _behaviorTextBase.point!.x += ((_parentRect.width + _nLeftTotalSiblingsWidth + _nIndentGroup - _nRightTotalSiblingsWidth) / 2);
            }
            _behaviorTextBase.textAnchor = 'middle';
            _behaviorTextBase.dominantBaseline = 'hanging';
          } else {
            _behaviorTextBase.point!.x += (_nLeftTotalSiblingsWidth + _nPaddingLeft);
          }
          _behaviorTextBase.point!.y += _nPaddingTop;
          break;
        case TextAlign.Right:
        case TextAlign.End:
        case TextAlign.RightTop:
          if (_bIsFitContent) {
            _behaviorTextBase.point!.x += (_parentRect.width - _nPaddingRight - _nRightTotalSiblingsWidth);
            _behaviorTextBase.textAnchor = 'end';
            _behaviorTextBase.dominantBaseline = 'hanging';
          } else {
            _behaviorTextBase.point!.x += (_nLeftTotalSiblingsWidth + _nPaddingLeft);
          }
          _behaviorTextBase.point!.y += _nPaddingTop;
          break;
        //!Special case
        //?#Center
        case TextAlign.CenterCenter:
          if (_bIsFitContent) {
            if (_nCol === 0 && _panel.cellType === CellType.Cell && !_bIsGroup) {
              _behaviorTextBase.point!.x += ((_parentRect.width - _nLeftTotalSiblingsWidth - _nRightTotalSiblingsWidth + _nPaddingLeft - _nPaddingRight) / 2);
            } else {
              _behaviorTextBase.point!.x += ((_parentRect.width + _nLeftTotalSiblingsWidth + _nIndentGroup - _nRightTotalSiblingsWidth) / 2);
            }
            _behaviorTextBase.textAnchor = 'middle';
            _behaviorTextBase.dominantBaseline = 'middle';
          } else {
            _behaviorTextBase.point!.x += (_nLeftTotalSiblingsWidth + _nPaddingLeft);
          }
          _behaviorTextBase.point!.y += ((_parentRect.height) / 2);
          break;
        case TextAlign.CenterBottom:
          if (_bIsFitContent) {
            if (_nCol === 0 && _panel.cellType === CellType.Cell && !_bIsGroup) {
              _behaviorTextBase.point!.x += ((_parentRect.width - _nLeftTotalSiblingsWidth - _nRightTotalSiblingsWidth + _nPaddingLeft - _nPaddingRight) / 2);
            } else {
              _behaviorTextBase.point!.x += ((_parentRect.width + _nLeftTotalSiblingsWidth + _nIndentGroup - _nRightTotalSiblingsWidth) / 2);
            }
            _behaviorTextBase.textAnchor = 'middle';
            _behaviorTextBase.dominantBaseline = 'auto';
          } else {
            _behaviorTextBase.point!.x += _nPaddingLeft;
          }
          _behaviorTextBase.point!.y += ((_parentRect.height) - _nPaddingBottom);
          break;
        //?#Left
        case TextAlign.LeftCenter:
          _behaviorTextBase.point!.x += (_nLeftTotalSiblingsWidth + _nPaddingLeft);
          _behaviorTextBase.point!.y += (_parentRect.height / 2);
          if (_bIsFitContent) {
            _behaviorTextBase.textAnchor = 'start';
            _behaviorTextBase.dominantBaseline = 'middle';
          }
          break;
        case TextAlign.LeftBottom:
          _behaviorTextBase.point!.x += (_nLeftTotalSiblingsWidth + _nPaddingLeft);
          _behaviorTextBase.point!.y += (_parentRect.height - _nPaddingBottom);
          if (_bIsFitContent) {
            _behaviorTextBase.textAnchor = 'start';
            _behaviorTextBase.dominantBaseline = 'auto';
          }
          break;
        //?#Right
        case TextAlign.RightCenter:
          if (_bIsFitContent) {
            _behaviorTextBase.point!.x += (_parentRect.width - _nPaddingRight - _nRightTotalSiblingsWidth);
            _behaviorTextBase.textAnchor = 'end';
            _behaviorTextBase.dominantBaseline = 'middle';
          } else {
            _behaviorTextBase.point!.x += _nPaddingLeft;
          }
          _behaviorTextBase.point!.y += (_parentRect.height / 2);
          break;
        case TextAlign.RightBottom:
          if (_bIsFitContent) {
            _behaviorTextBase.point!.x += (_parentRect.width - _nPaddingRight - _nRightTotalSiblingsWidth);
            _behaviorTextBase.textAnchor = 'end';
            _behaviorTextBase.dominantBaseline = 'auto';
          } else {
            _behaviorTextBase.point!.x += _nPaddingLeft;
          }
          _behaviorTextBase.point!.y += (_parentRect.height - _nPaddingBottom);
          break;
      }
      _behaviorTextBase.isTextFitWidthCell = _bIsFitContent;
      return (_behaviorTextBase as BehaviorText);
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when trying to calculate position text node!');
    }
  };
  /**
   * @description: Dùng để bọc svg bên ngoài text svg trong trường hợp width cửa text dài hơn chiều rộng của phần tử chứa
   * @param: pTextNode: Text, pPayload: Payload
   * @return: SVGElement | null
  */
  private _wrapTextNodeIntoSvg(pTextNode: Text, pPayload: Payload): SVGElement | null {
    try {
      const { parentStyles: _parentStyles, parentNode: _parentNode, parentBoundingRect: _parentRect } = this._getInformationParentNode(pTextNode, pPayload);
      const _rectSvg: Partial<DOMRect> = {};
      const _textBehavior = pPayload.behaviorText;
      const { leftTotalSiblingsWidth: _nLeftTotalSiblingsWidth, rightTotalSiblingsWidth: _nRightTotalSiblingsWidth } = this._getTotalWidthSiblingNode(pTextNode, pPayload);
      let _nPaddingLeft = +_parentStyles.paddingLeft.replace('px', '') || 0;
      let _nPaddingRight = +_parentStyles.paddingRight.replace('px', '') || 0;
      let _nPaddingTop = +_parentStyles.paddingTop.replace('px', '') || 0;
      let _nPaddingBottom = +_parentStyles.paddingBottom.replace('px', '') || 0;
      let _nWidthText = pPayload.dimensionText?.width || 0;
      let _nHeightText = pPayload.dimensionText?.height || 0;
      let _bIsFitWidth = _nWidthText < (_parentRect.width - _nPaddingLeft - _nPaddingRight - _nLeftTotalSiblingsWidth - _nRightTotalSiblingsWidth);
      let _bIsFitHeight = _nHeightText < (_parentRect.height - _nPaddingBottom - _nPaddingTop);
      /*
      trong trường hợp warpper svg có thể do hành vi thay đổi kích thước do người dùng kéo thay đổi kích thước row và column.
      hành vi kéo thay đổi kích thước chỉ xảy ra từ phải kéo vào trái đối với width và từ dưới lên trên đối với height.
      Tính toán lại padding bottom thực tế và padding right thực tế để tính chính xác tọa độ của text nằm trong svg wrapper
      và chiều cao thực tế!
      */
      if (!_bIsFitHeight) {
        let actualPaddingBottom = _parentRect.height - _nHeightText - _nPaddingTop;
        _nPaddingBottom = actualPaddingBottom > 0 ? actualPaddingBottom : 0;
        // let actualPaddingTop = _parentRect.height - _nHeightText;
        // _nPaddingTop = actualPaddingTop > 0 ? actualPaddingTop : 0;
      }

      if (isInline(_parentStyles, _parentNode)) {
        //get left and right width total siblings width if is inline
        let { leftTotalSiblingsWidth: _leftTotalSiblingsWidth } = this._getTotalWidthSiblingNode(_parentNode, pPayload);
        _rectSvg.width = (_parentRect.width - _leftTotalSiblingsWidth - _nPaddingLeft - _nPaddingRight);
      } else {
        /*
        -Trong trường hợp nếu là left-top/center/bottom thì chiều rộng của svg wrapper bằng chiều rộng của
        rect trừ đi padding left và tổng chiều rộng của các ae nằm bên trái.
        -Trong trường hợp còn lại thì trừ đi cả padding right và ae nằm bên phải do trong trường hợp không vừa
        tọa độ cả svg luôn bằng tọa dộ x của rect + với padding left.
        */
        if (_bIsFitWidth) {
          _rectSvg.width = (_parentRect.width - _nLeftTotalSiblingsWidth - _nPaddingLeft - _nRightTotalSiblingsWidth - _nPaddingRight);
        } else {
          _rectSvg.width = (_parentRect.width - _nLeftTotalSiblingsWidth - _nPaddingLeft);
          if (this._zTextAlign.startsWith('center')) {
            _rectSvg.width -= _nRightTotalSiblingsWidth;
          } else if (this._zTextAlign.startsWith('right')) {
            _nRightTotalSiblingsWidth > 0 ? (_rectSvg.width -= (_nRightTotalSiblingsWidth + _nPaddingRight)) : (_rectSvg.width -= (_nRightTotalSiblingsWidth + _nPaddingRight));
          }
        }
      }
      _rectSvg.height = (_parentRect.height - _nPaddingTop - _nPaddingBottom) || 0;

      if (_rectSvg.width <= 0 || _rectSvg.height <= 0) {
        return null;
      }
      //draw text
      let _zTextContent = pTextNode.textContent || '';
      if (!this.isFirstNode(pTextNode, Node.TEXT_NODE)) {
        /*-Trường hợp không phải là text node duy nhất tọa độ nằm vào vị trí phần tử sau nó cộng thêm khoảng trắng tránh bị đè vào phần tử sau*/
        _zTextContent = ' '.concat(_zTextContent);
      }
      _zTextContent = _zTextContent.trimEnd().concat(' '); //fix case special character : &nbsp;
      const _textSvgEl = drawText(_zTextContent, pPayload.behaviorText as BehaviorText, _parentStyles, 'default');
      /*
      Tính toán lại tọa độ của svg wrapper! tọa độ x luôn giữ nguyên! điểm vẽ luôn = padding left
      Tọa độ y của svg wrapper tính toán phụ thuộc vào alignment của text
      Tính toán lại behavior của text theo svg wrapper!
     */
      _rectSvg.x = _textBehavior.point.x;
      switch (this._zTextAlign) {
        case TextAlign.Left:
        case TextAlign.Start:
        case TextAlign.LeftTop:
          _rectSvg.y = _textBehavior.point.y;
          _textSvgEl.setAttribute('x', '0');
          _textSvgEl.setAttribute('y', '0');
          _textSvgEl.setAttribute('dominant-baseline', 'hanging');
          _textSvgEl.setAttribute('text-anchor', 'start');
          break;
        case TextAlign.Right:
        case TextAlign.RightTop:
        case TextAlign.End:
          _rectSvg.y = _textBehavior.point.y;
          if (_bIsFitWidth) {
            _textSvgEl.setAttribute('x', (_rectSvg.width).toString());
            _textSvgEl.setAttribute('text-anchor', 'end');
          } else {
            _textSvgEl.setAttribute('x', '0');
            _textSvgEl.setAttribute('text-anchor', 'start');
          }
          _textSvgEl.setAttribute('y', '0');
          _textSvgEl.setAttribute('dominant-baseline', 'hanging');
          break;
        case TextAlign.Center:
        case TextAlign.CenterTop:
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
            _rectSvg.y = _parentRect.top + _nPaddingTop;
            _textSvgEl.setAttribute('y', '0');
            _textSvgEl.setAttribute('dominant-baseline', 'hanging');
          }
          break;
        case TextAlign.CenterCenter:
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
            _rectSvg.y = _parentRect.top + _nPaddingTop;
            _textSvgEl.setAttribute('y', '0');
            _textSvgEl.setAttribute('dominant-baseline', 'hanging');
          }
          break;
        case TextAlign.LeftCenter:
          _textSvgEl.setAttribute('x', '0');
          _textSvgEl.setAttribute('text-anchor', 'start');
          //case fit height?
          if (_bIsFitHeight) {
            _rectSvg.y = _textBehavior.point.y - (_rectSvg.height / 2);
            _textSvgEl.setAttribute('y', (_rectSvg.height / 2).toString());
            _textSvgEl.setAttribute('dominant-baseline', 'middle');
          } else {
            _rectSvg.y = _parentRect.top + _nPaddingTop;
            _textSvgEl.setAttribute('y', '0');
            _textSvgEl.setAttribute('dominant-baseline', 'hanging');
          }
          break;
        case TextAlign.LeftBottom:
          _textSvgEl.setAttribute('x', '0');
          _textSvgEl.setAttribute('text-anchor', 'start');
          //case fit height?
          if (_bIsFitHeight) {
            _rectSvg.height += _nPaddingBottom;
            _rectSvg.y = _textBehavior.point.y - (_rectSvg.height - _nPaddingBottom);
            _textSvgEl.setAttribute('y', (_rectSvg.height - _nPaddingBottom).toString());
            _textSvgEl.setAttribute('dominant-baseline', 'auto');
          } else {
            _rectSvg.y = _parentRect.top + _nPaddingTop;
            _textSvgEl.setAttribute('y', '0');
            _textSvgEl.setAttribute('dominant-baseline', 'hanging');
          }
          break;
        case TextAlign.RightCenter:
          //case fit width?
          if (_bIsFitWidth) {

            _textSvgEl.setAttribute('x', (_rectSvg.width).toString());
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
            _rectSvg.y = _parentRect.top + _nPaddingTop;
            _textSvgEl.setAttribute('y', '0');
            _textSvgEl.setAttribute('dominant-baseline', 'hanging');
          }
          break;
        case TextAlign.RightBottom:
          if (_bIsFitWidth) {
            _textSvgEl.setAttribute('x', (_rectSvg.width).toString());
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
            _rectSvg.y = _parentRect.top + _nPaddingTop;
            _textSvgEl.setAttribute('y', '0');
            _textSvgEl.setAttribute('dominant-baseline', 'hanging');
          }
          break;
      }
      const _svgWrapText = creatorSVG(_rectSvg, true);
      _svgWrapText.appendChild(_textSvgEl);
      pPayload.group.appendChild(_svgWrapText);
      return _svgWrapText;
    } catch (error) {
      console.error(error);
      throw new Error('Something wrong when wrap text in svg');
    }
  }
  private _isTextNodeFitWidthCell(pTextNode: Text, pPayload: Payload): boolean {
    try {
      const { parentBoundingRect: _parentBoundingRect, parentStyles: _parentStyles } = this._getInformationParentNode(pTextNode, pPayload);
      const _nPaddingLeft = +_parentStyles.paddingLeft.replace('px', '');
      const _nPaddingRight = +_parentStyles.paddingRight.replace('px', '');
      const { leftTotalSiblingsWidth: _nLeftTotalSiblingsWidth, rightTotalSiblingsWidth: _nRightTotalSiblingsWidth } = this._getTotalWidthSiblingNode(pTextNode, pPayload);
      const _nTextWidth = pPayload.dimensionText?.width || 0;
      _nTextWidth <= (_parentBoundingRect.width - _nLeftTotalSiblingsWidth - _nRightTotalSiblingsWidth - _nPaddingLeft - _nPaddingRight);
      return _nTextWidth <= (_parentBoundingRect.width - _nLeftTotalSiblingsWidth - _nRightTotalSiblingsWidth - _nPaddingLeft - _nPaddingRight);

    } catch (error) {
      console.error(error);
      throw new Error('Occurs when check the width of the text content to see if it fits the width of the parent!');
    }
  }
  private _isTextNodeFitHeightCell(pTextNode: Text, pPayload: Payload): boolean {
    try {
      const { parentBoundingRect: _parentBoundingRect, parentStyles: _parentStyles } = this._getInformationParentNode(pTextNode, pPayload);
      const _nPaddingTop = +_parentStyles.paddingTop.replace('px', '');
      const _nPaddingBottom = +_parentStyles.paddingBottom.replace('px', '');
      const _nTextHeight = pPayload.dimensionText?.height || 0;
      return _nTextHeight <= (_parentBoundingRect.height - _nPaddingTop - _nPaddingBottom);
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when check the height of the text content to see if it fits the height of the parent!');
    }
  }

  private _measureTextNode(pTextNode: Text, pPayload: Payload, pbBreakWords: boolean = false): BravoTextMetrics | undefined {
    try {
      const { parentNode: _parentNode, parentStyles: _parentStyles, parentBoundingRect: _parentBoundingRect } = this._getInformationParentNode(pTextNode, pPayload);
      if (!_parentNode) return undefined;
      const _font = new Font(_parentStyles.fontFamily, _parentStyles.fontSize, _parentStyles.fontWeight);
      const _dimensionOfText = BravoGraphicsRenderer.measureString(pTextNode.textContent as string, _font, _parentBoundingRect.width, pbBreakWords);
      return _dimensionOfText;
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when calculate dimension of the text node!');
    }
  }

  private _drawTextNodeInCell(pTextNode: Text, pPayload: Payload): SVGElement | null {
    try {
      const { parentStyles: _parentStyles, parentNode: _parentNode } = this._getInformationParentNode(pTextNode, pPayload);
      pPayload.behaviorText = this._calculateBehaviorTextNode(pTextNode, pPayload) as BehaviorText;
      let _nWidthTextNode = pPayload.dimensionText?.width || 0;
      /*
      ?Trường hợp không phải text node duy nhất hoặc là thẻ inline wrap text node
      ?Nếu width của cell nhỏ hơn tọa độ x của text return null ko vẽ
      ?Nếu width của cell nằm trong tọa độ x đến right thì thay đổi isTextFitWidthCell = false và switch case wrap svg
      */
      if (!this.isOnlyNode(pTextNode, Node.TEXT_NODE) || isInline(_parentStyles, _parentNode)) {
        if (pPayload.cellBoundingRect.width < pPayload.behaviorText.point.x) {
          return null;
        } else if (pPayload.cellBoundingRect.width > pPayload.behaviorText.point.x && pPayload.cellElement.offsetWidth < pPayload.behaviorText.point.x + _nWidthTextNode) {
          pPayload.behaviorText.isTextFitWidthCell = false;
        }
      }
      //?case swap text by svg
      if (!pPayload.behaviorText.isTextFitWidthCell) {
        const _svgWrap = this._wrapTextNodeIntoSvg(pTextNode, pPayload);
        return _svgWrap;
      }
      let _zTextContent = pTextNode.textContent || '';
      /*-Trường hợp không phải là text node duy nhất tọa độ nằm vào vị trí phần tử sau nó cộng thêm khoảng trắng tránh bị đè vào phần tử sau
      Chỉ support cho trường hợp white-space: pre
      */
      let _bIsFirstNode = this.isFirstNode(pTextNode, Node.TEXT_NODE);
      if (!_bIsFirstNode) {
        _zTextContent = '  '.concat(_zTextContent);
      }
      //?fix case special character: &nbsp;
      pPayload.panel.cellType === CellType.ColumnHeader && (_zTextContent = _zTextContent.trimEnd().concat(' '));
      const _textSvgEl = drawText(_zTextContent, pPayload.behaviorText, _parentStyles, _bIsFirstNode ? 'preserve' : 'preserve');
      return _textSvgEl;
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when draw text in cell!!');
    }
  }

  //*util methods
  /**
    * @description:(expensive funtion) dùng để tính toán tổng chiều rộng của các phần tử anh chị em bên trái hoặc bên phải
    * @param: pSiblings: ChildNode[]
    * @return:number
   */
  private _calculateTotalWidthSiblings(pSiblings: ChildNode[], pPayload: Payload): number {
    let _nTotalWidth: number = pSiblings.reduce((pnAcc, pNode) => {
      if (isTextNode(pNode)) {
        const _dimensionOfText = this._measureTextNode(pNode, pPayload, false);
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

  private _getTotalWidthSiblingNode(pNode: Node, pPayload: Payload) {
    let _nRightTotalSiblingsWidth = 0;
    let _nLeftTotalSiblingsWidth = 0;
    const _siblings: ISiblings = this.scanSiblingsNode(pNode, true);
    if (_siblings.leftSideCurrentNode.length === 0 && _siblings.rightSideCurrentNode.length === 0) return { rightTotalSiblingsWidth: _nRightTotalSiblingsWidth, leftTotalSiblingsWidth: _nLeftTotalSiblingsWidth };
    _nLeftTotalSiblingsWidth = this._calculateTotalWidthSiblings(_siblings.leftSideCurrentNode, pPayload);
    _nRightTotalSiblingsWidth = this._calculateTotalWidthSiblings(_siblings.rightSideCurrentNode, pPayload);
    return {
      rightTotalSiblingsWidth: _nRightTotalSiblingsWidth,
      leftTotalSiblingsWidth: _nLeftTotalSiblingsWidth
    };
  }

  /**
  * @description: Dùng để lấy thông tin của node cha (rect, styles, element)
  * @param: node: Node, pPayload: Payload
  * @return:{parentNode,parentBoundingRect,parentStyles};
  */
  private _getInformationParentNode(pNode: Node, pPayload: Payload) {
    let _parentNode: Element;
    let _parentBoundingRect: Rect;
    let _parentStyles: CSSStyleDeclaration;
    if (pNode.parentElement === pPayload.cellElement) {
      _parentNode = pPayload.cellElement;
      _parentStyles = pPayload.cellStyles;
      _parentBoundingRect = pPayload.cellBoundingRect;
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
  private _drawImageInCell(pImageNode: HTMLImageElement, pPayload: Payload): SVGElement {
    const _imageBoundingRect = this._changeOriginCoordinates(pImageNode.getBoundingClientRect());
    let parentBoundingRect = pPayload.cellBoundingRect;
    if ((parentBoundingRect.height < _imageBoundingRect.height) || (parentBoundingRect.width < _imageBoundingRect.width)) {
      const _svgWrap = this._wrapImageIntoSvg(pImageNode, pPayload);
      return _svgWrap;
    }
    const _imageSvgEl = this.drawImage(pImageNode.src, _imageBoundingRect.left, _imageBoundingRect.top, _imageBoundingRect.width, _imageBoundingRect.height);
    return _imageSvgEl;
  }

  /**
  * @description: Dùng để bọc svg bên ngoài của image svg trong trường hợp kích thước của image to hơn phần tử chứa
  * @param: imageNode: HTMLImageElement, pPayload: Payload
  * @return:SVGElement
  */
  private _wrapImageIntoSvg(pImageEl: HTMLImageElement, pPayload: Payload): SVGElement {
    const _rectSvgEl: Partial<DOMRect> = {};
    const _parentBoundingRect = pPayload.cellBoundingRect;
    const _cellStyles = pPayload.cellStyles;
    _rectSvgEl.width = _parentBoundingRect.width;
    _rectSvgEl.height = _parentBoundingRect.height;
    _rectSvgEl.x = _parentBoundingRect.left;
    _rectSvgEl.y = _parentBoundingRect.top;
    const _svgWrapImage = creatorSVG(_rectSvgEl, true);
    let _nXImage = 0;
    let _nYImage = 0;
    let align = getAlignText(_cellStyles) || 'left-top';
    /* Trường hợp nếu ảnh nằm bên phải khi kéo height dài ra thì toa độ của ảnh so với svg wrapper bắt từ phải sang trái */
    if (align.startsWith('right')) {
      _nXImage = -(pImageEl.width - _rectSvgEl.width);
    }
    /* Trường hợp nếu ảnh nằm ở giữa khi kéo height dài ra thì toa độ của ảnh so với svg wrapper bắt từ giữa đẩy sang hai bến */
    if (align.startsWith('center')) {
      _nXImage = -((pImageEl.width - _rectSvgEl.width) / 2);
    }
    const _imageSvgEl = drawImage(pImageEl.src, _nXImage, _nYImage, pImageEl.width, pImageEl.height);
    _svgWrapImage.appendChild(_imageSvgEl);
    this.element.appendChild(_svgWrapImage);
    return _svgWrapImage;
  }

  private _drawCheckBox(pNode: Node, pPayload: Payload) {
    const _inputNode = pNode as HTMLInputElement;
    const _inputRect = this._changeOriginCoordinates(_inputNode.getBoundingClientRect());
    let cellPaddingTop = +pPayload.cellStyles.paddingTop.replace('px', '');
    const cellRect = pPayload.cellBoundingRect;
    let _bIsBelongCell = this._checkNodeBelongCell(_inputRect, cellRect);
    if (_bIsBelongCell || (cellRect.top + cellPaddingTop) > _inputRect.top) return;
    if (_inputNode.checked) {
      const svgChecked = this._parser.parseFromString(inputChecked, 'image/svg+xml').childNodes[0] as SVGElement;
      setAttrSvgIcon(svgChecked, _inputRect.left, _inputRect.top, _inputRect.width, _inputRect.height);
      pPayload.group.appendChild(svgChecked);
    } else {
      const svgUnChecked = this._parser.parseFromString(inputUnchecked, 'image/svg+xml').childNodes[0] as SVGElement;
      setAttrSvgIcon(svgUnChecked, _inputRect.left, _inputRect.top, _inputRect.width, _inputRect.height);
      pPayload.group.appendChild(svgUnChecked);
    }
  }

  private _drawPin(pNode: Node, pPayload: Payload) {
    const _pinNode = pNode as HTMLElement;
    const _pinRect = this._changeOriginCoordinates(_pinNode.getBoundingClientRect());
    const cellRect = pPayload.cellBoundingRect;
    let cellPaddingTop = +pPayload.cellStyles.paddingTop.replace('px', '');
    let _bIsBelongCell = this._checkNodeBelongCell(_pinRect, cellRect);
    /* Nếu  node có tọa độ nằm ngoài phần tử cha thì bỏ qua*/
    if (_bIsBelongCell || (cellRect.top + cellPaddingTop) > _pinRect.top) return;
    if (_pinNode.className.includes('wj-state-pinned')) {
      const _svgPinned = this._parser.parseFromString(pinned, 'image/svg+xml').childNodes[0] as SVGElement;
      _svgPinned.setAttribute('fill', '#333');
      setAttrSvgIcon(_svgPinned, _pinRect.left, _pinRect.top, _pinRect.width, _pinRect.height);
      pPayload.group.appendChild(_svgPinned);
    } else {
      const _svgUnpinned = this._parser.parseFromString(unpinned, 'image/svg+xml').childNodes[0] as SVGElement;
      _svgUnpinned.setAttribute('fill', '#3333');
      setAttrSvgIcon(_svgUnpinned, _pinRect.left, _pinRect.top, _pinRect.width, _pinRect.height);
      pPayload.group.appendChild(_svgUnpinned);
    }
  }

  private _drawGroupBtn(pNode: Node, pPayload: Payload) {
    const _groupBtnNode = pNode as Element;
    const _groupBtnRect = this._changeOriginCoordinates(_groupBtnNode.getBoundingClientRect());
    const _panel = pPayload.panel;
    const _nCurrentRow = pPayload.row;
    const cellRect = pPayload.cellBoundingRect;
    let cellPaddingTop = +pPayload.cellStyles.paddingTop.replace('px', '');
    let _bIsBelongCell = this._checkNodeBelongCell(_groupBtnRect, cellRect);
    /* Nếu  node có tọa độ nằm ngoài phần tử cha thì bỏ qua*/
    if (!(_panel.rows[_nCurrentRow] instanceof GroupRow) || _bIsBelongCell || (cellRect.top + cellPaddingTop) > _groupBtnRect.top) return;
    if ((_panel.rows[_nCurrentRow] as GroupRow).isCollapsed) {
      const _svgCollapse = this._parser.parseFromString(collapse, 'image/svg+xml').childNodes[0] as SVGElement;
      setAttrSvgIcon(_svgCollapse, _groupBtnRect.left, _groupBtnRect.top, _groupBtnRect.width, _groupBtnRect.height);
      pPayload.group.appendChild(_svgCollapse);
    } else {
      const _svgexpand = this._parser.parseFromString(expand, 'image/svg+xml').childNodes[0] as SVGElement;
      setAttrSvgIcon(_svgexpand, _groupBtnRect.left, _groupBtnRect.top, _groupBtnRect.width, _groupBtnRect.height);
      pPayload.group.appendChild(_svgexpand);
    }
  }

  private _drawSortBtn(pNode: Node, pPayload: Payload) {
    const _sortBtnNode = pNode as HTMLElement;
    const _sortBtnRect = this._changeOriginCoordinates(_sortBtnNode.getBoundingClientRect());
    const _panel = pPayload.panel;
    let _zColor = window.getComputedStyle(_sortBtnNode).color || '';
    let cellPaddingTop = +pPayload.cellStyles.paddingTop.replace('px', '');
    const cellRect = pPayload.cellBoundingRect;
    let _bIsBelongCell = this._checkNodeBelongCell(_sortBtnRect, cellRect);
    /* Nếu  node có tọa độ nằm ngoài phần tử cha thì bỏ qua*/
    if (_panel.cellType !== CellType.ColumnHeader || _bIsBelongCell || (cellRect.top + cellPaddingTop) > _sortBtnRect.top) return;
    if (_sortBtnNode.className.includes('wj-glyph-up')) {
      const _svgArrowUp = this._parser.parseFromString(arrowUp, 'image/svg+xml').childNodes[0] as SVGElement;
      _svgArrowUp.setAttribute('fill', _zColor);
      setAttrSvgIcon(_svgArrowUp, _sortBtnRect.left, _sortBtnRect.top, _sortBtnRect.width, _sortBtnRect.height);
      pPayload.group.appendChild(_svgArrowUp);
    } else {
      const _svgArrowDown = this._parser.parseFromString(arrowDown, 'image/svg+xml').childNodes[0] as SVGElement;
      _svgArrowDown.setAttribute('fill', _zColor);
      setAttrSvgIcon(_svgArrowDown, _sortBtnRect.left, _sortBtnRect.top, _sortBtnRect.width, _sortBtnRect.height);
      pPayload.group.appendChild(_svgArrowDown);
    }
  }

  private _checkNodeBelongCell(pNodeRect: Rect, cellRect: Rect): boolean {
    return (cellRect.width < pNodeRect.width || cellRect.height < pNodeRect.height || ((cellRect.left + cellRect.width) < pNodeRect.left) || ((cellRect.top + cellRect.height) < pNodeRect.top) || cellRect.left > pNodeRect.left || (cellRect.top) > pNodeRect.top);
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
  private _zTextAlign!: string;
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
  * @description: lấy ra data cần trong pPayload để gửi đi cùng với event
  * @param: pPayload: Payload
  * @return: IPayloadEvent
  */
  private _getPayloadEvent(pPayload: Payload): IPayloadEvent {
    const _payloadEvent: IPayloadEvent = {} as IPayloadEvent;
    _payloadEvent.col = pPayload.col;
    _payloadEvent.row = pPayload.row;
    _payloadEvent.panel = pPayload.panel;
    _payloadEvent.cellValue = pPayload.cellValue;
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
    //!initialize pPayload object
    const pPayload = {} as Payload;
    pPayload.panel = pPanel;
    for (let _nColIndex = 0; _nColIndex < pPanel.columns.length; _nColIndex++) {
      for (let _nRowIndex = 0; _nRowIndex < pPanel.rows.length; _nRowIndex++) {
        const _cellRange = this.flexGrid.getMergedRange(pPanel, _nRowIndex, _nColIndex, false);
        const _cellBoundingRect = pPanel.getCellBoundingRect(_nRowIndex, _nColIndex, true);
        let _cellValue = pPanel.getCellData(_nRowIndex, _nColIndex, this._bIsRawValue);
        pPayload.col = _nColIndex;
        pPayload.row = _nRowIndex;
        pPayload.cellBoundingRect = _cellBoundingRect;
        pPayload.cellRange = _cellRange;
        pPayload.cellValue = _cellValue;
        pPayload.isRowGroup = pPanel.rows[_nRowIndex] instanceof GroupRow;
        this._applyStyleSetup(pPayload);
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
            pPayload.group = _groupEl;
            this._drawRawRectCell(pPayload);
            this.endGroup();
          }
        } else {
          //trường hợp cell group hoặc merge chỉ vẻ lần đầu tiên! tránh trường hợp draw nhiều lần!
          if ((_nRowIndex == _cellRange.row && _nColIndex === _cellRange.col && pPanel.rows[_nRowIndex].visibleIndex !== -1)) {
            const _groupEl = this.startGroup();
            pPayload.group = _groupEl;
            this._drawRawRectCell(pPayload);
            this.endGroup();
          }
        }
      }
    }
  }

  private _drawRawRectCell(pPayload: Payload): void {
    const _panel = pPayload.panel;
    const _rect = pPayload.cellBoundingRect;
    const _cellRange = pPayload.cellRange;
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
    const _payloadEvent = this._getPayloadEvent(pPayload);
    _payloadEvent.svgDrew = _rectSvgEl;
    _rectSvgEl.setAttribute('fill', this._zBgColorSetup);
    this.onDrewRect(_payloadEvent);
    //?Draw border and content in cell here!
    this._drawRawBorderCell(pPayload);
    this._drawContentInCell(pPayload);
  }

  private _drawRawBorderCell(pPayload: Payload) {
    const _rect = pPayload.cellBoundingRect;
    const _payloadEvent = this._getPayloadEvent(pPayload);
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

  private _drawContentInCell(pPayload: Payload) {
    const _cellValue = pPayload.cellValue;
    const _panel = pPayload.panel;
    const _nCol = pPayload.col;
    if (_panel.cellType === CellType.Cell && _panel.columns[_nCol].dataType === DataType.Boolean && !pPayload.isRowGroup) {
      this._drawCheckboxRaw(pPayload);
    } else if (_cellValue) {
      const _payloadEvent = this._getPayloadEvent(pPayload);
      this.onDrawingText(_payloadEvent);//raise event drawing text
      if (pPayload.cellValue !== pPayload.cellValue) {
        pPayload.cellValue = pPayload.cellValue;
      }
      this._drawTextRawInCell(pPayload);
    }
  }

  private _drawTextRawInCell(pPayload: Payload): SVGElement | null {
    const _textBehavior = this._calculateBehaviorTextRaw(pPayload);
    const _cellValue = pPayload.cellValue;
    pPayload.behaviorText = _textBehavior;
    if (!_textBehavior.isTextFitWidthCell) {
      const _svgEl = this._wrapTextRawIntoSvg(pPayload);
      return _svgEl;
    }
    const _textSvgEl = drawText(_cellValue, _textBehavior as BehaviorText, this._stylesTextSetup);
    const _payloadEvent = this._getPayloadEvent(pPayload);
    _payloadEvent.svgDrew = _textSvgEl;
    this.onDrewText(_payloadEvent);
    pPayload.group.appendChild(_textSvgEl);
    return _textSvgEl as SVGElement;
  }
  /**
  * @desc: expensive function dùng để tính toán hành vi (tọa độ, điểm vẽ, hướng vẽ,...) của text node dựa trên tọa độ, kích thước của rect cell raw
  * @param pPayload: Payload
  * @returns: BehaviorText
 */
  private _calculateBehaviorTextRaw(pPayload: Payload): BehaviorText {
    try {
      const _panel = pPayload.panel;
      const _nCurrentCol = pPayload.col;
      const _nCurrentRow = pPayload.row;
      const _font = new Font(this._stylesTextSetup['fontFamily'], this._stylesTextSetup['fontSize'], this._stylesTextSetup['fontWeight']);
      const _cellBoundingRect = pPayload.cellBoundingRect;
      let _cellValue = pPayload.cellValue;
      let _nCol = pPayload.col;
      let _nPaddingLeft = this.cellPadding.paddingLeft;
      let _nPaddingRight = this.cellPadding.paddingRight;
      let _nPaddingTop = this.cellPadding.paddingTop;
      let _nPaddingBottom = this.cellPadding.paddingBottom;
      let _nXTextDefault = _cellBoundingRect.left;
      let _yTextDefault = _cellBoundingRect.top;
      let _bIsGroup = pPayload.isRowGroup;
      let _bIsCellNormalBelongFirstCol = _nCol === 0 && _panel.cellType === CellType.Cell && !_bIsGroup;
      pPayload.dimensionText = BravoGraphicsRenderer.measureString(_cellValue, _font, _cellBoundingRect.width, false);
      let _nWidthText = pPayload.dimensionText?.width || 0;
      let _nHeightText = pPayload.dimensionText?.height || 0;
      let _zAlginText = this._zTextAlign || 'left-top';
      if (_panel.columns[_nCurrentCol].dataType === DataType.Boolean) {
        _zAlginText = this._zTextAlign || 'center-center';
      }
      /*
      Case indent for row group
      Cộng thêm indent level trong trường hợp text nằm ở bên trái hoặc phải
       */
      _bIsGroup && this._zTextAlign.startsWith('left') && (_nPaddingLeft += (_panel.rows[_nCurrentRow] as GroupRow).level * this.flexGrid.treeIndent);
      //Case nếu là cột đầu tiên thì sẽ có padding bằng indent của gr có level lớn nhất!
      _bIsCellNormalBelongFirstCol && (_nPaddingLeft += (_panel.rows.maxGroupLevel * this.flexGrid.treeIndent));
      let _bIsFitWidth = _nWidthText < (_cellBoundingRect.width - _nPaddingLeft - _nPaddingRight);
      let _bIsFitHeight = _nHeightText < (_cellBoundingRect.height - _nPaddingBottom - _nPaddingTop);
      let _bIsFitContent = _bIsFitWidth && _bIsFitHeight;
      const _behaviorTextBase: Partial<BehaviorText> = { point: new Point(_nXTextDefault, _yTextDefault), textAnchor: 'start' };
      switch (_zAlginText) {
        case TextAlign.Left:
        case TextAlign.Start:
        case TextAlign.LeftTop:
        default:
          _behaviorTextBase.point!.x += _nPaddingLeft;
          _behaviorTextBase.point!.y += _nPaddingTop;
          _behaviorTextBase.textAnchor = 'start';
          _behaviorTextBase.dominantBaseline = 'hanging';
          break;
        case TextAlign.Center:
        case TextAlign.CenterTop:
          if (_bIsFitContent) {
            /* Trường hợp nếu là case center,center-top,center-bottom,center-cente tọa độ x tính theo công thức theo dom*/
            _behaviorTextBase.point!.x += (_cellBoundingRect.width) / 2;
            _behaviorTextBase.point!.y += _nPaddingTop;
            _behaviorTextBase.textAnchor = 'middle';
            _behaviorTextBase.dominantBaseline = 'hanging';
          } else {
            _behaviorTextBase.point!.x += _nPaddingLeft;
            _behaviorTextBase.point!.y += _nPaddingTop;
            _behaviorTextBase.dominantBaseline = 'hanging';
          }
          break;
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
          break;
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
          break;
        case TextAlign.CenterCenter:
          _behaviorTextBase.point!.y += (_cellBoundingRect.height) / 2;
          if (_bIsFitContent) {
            if (_bIsCellNormalBelongFirstCol) {
              _behaviorTextBase.point!.x += ((_cellBoundingRect.width + _nPaddingLeft - _nPaddingRight) / 2);
            } else {
              _behaviorTextBase.point!.x += (_cellBoundingRect.width) / 2;
            }
            _behaviorTextBase.textAnchor = 'middle';
            _behaviorTextBase.dominantBaseline = 'middle';
          } else {
            _behaviorTextBase.point!.x += _nPaddingLeft;
          }
          break;
        //?#Left
        case TextAlign.LeftCenter:
          _behaviorTextBase.point!.x += _nPaddingLeft;
          _behaviorTextBase.point!.y += (_cellBoundingRect.height) / 2;
          if (_bIsFitContent) {
            _behaviorTextBase.textAnchor = 'start';
            _behaviorTextBase.dominantBaseline = 'middle';
          }
          break;
        case TextAlign.LeftBottom:
          _behaviorTextBase.point!.x += _nPaddingLeft;
          _behaviorTextBase.point!.y += (_cellBoundingRect.height) - _nPaddingBottom;
          if (_bIsFitContent) {
            _behaviorTextBase.textAnchor = 'start';
            _behaviorTextBase.dominantBaseline = 'auto';
          }
          break;
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
          break;
        case TextAlign.RightBottom:
          _behaviorTextBase.point!.y += (_cellBoundingRect.height) - _nPaddingBottom;
          if (_bIsFitContent) {
            _behaviorTextBase.point!.x += (_cellBoundingRect.width) - _nPaddingRight;
            _behaviorTextBase.textAnchor = 'end';
            _behaviorTextBase.dominantBaseline = 'auto';
          } else {
            _behaviorTextBase.point!.x += _nPaddingLeft;
          }
          break;
      }
      _behaviorTextBase.isTextFitWidthCell = _bIsFitContent;
      return (_behaviorTextBase as BehaviorText);
    } catch (error) {
      console.error(error);
      throw new Error('Occurs when trying to calculate position text node!');
    }
  }

  /**
  * @description: Dùng để bọc svg bên ngoài text svg trong trường hợp width cửa text dài hơn chiều rộng của cell
  * @param pPayload: Payload
  * @return: SVGElement | null
  */
  private _wrapTextRawIntoSvg(pPayload: Payload): SVGElement | null {
    try {
      const _rectSvg: Partial<DOMRect> = {};
      const _panel = pPayload.panel;
      const _nRow = pPayload.row;
      const _nCol = pPayload.col;
      const _cellRect = pPayload.cellBoundingRect;
      const _textBehavior = pPayload.behaviorText;
      let _nPaddingLeft = this.cellPadding.paddingLeft;
      let _nPaddingRight = this.cellPadding.paddingRight;
      let _nPaddingTop = this.cellPadding.paddingTop;
      let _nPaddingBottom = this.cellPadding.paddingBottom;
      let _bIsRowGroup = pPayload.isRowGroup;
      let _bIsCellNormalBelongFirstCol = _nCol === 0 && _panel.cellType === CellType.Cell && !_bIsRowGroup;
      let _nWidthText = pPayload.dimensionText?.width || 0;
      let _nHeightText = pPayload.dimensionText?.height || 0;
      //thụt lề cho row group chỉ tính padding left (theo hành vi trên dom)
      if (_bIsRowGroup) {
        this._zTextAlign.startsWith('left') && (_nPaddingLeft += (_panel.rows[_nRow] as GroupRow).level * this.flexGrid.treeIndent);
      }
      _bIsCellNormalBelongFirstCol && (_nPaddingLeft += (_panel.rows.maxGroupLevel * this.flexGrid.treeIndent));
      let _bIsFitWidth = _nWidthText < (_cellRect.width - _nPaddingLeft - _nPaddingRight);
      let _bIsFitHeight = _nHeightText < (_cellRect.height - _nPaddingBottom - _nPaddingTop);
      /*
      trong trường hợp warpper svg có thể do hành vi thay đổi kích thước do người dùng kéo thay đổi kích thước row và column.
      hành vi kéo thay đổi kích thước chỉ xảy ra từ phải kéo vào trái đối với width và từ dưới lên trên đối với height.
      Tính toán lại padding bottom thực tế và padding right thực tế để tính chính xác tọa độ của text nằm trong svg wrapper
      và chiều cao thực tế!
      */
      if (!_bIsFitHeight) {
        let actualPaddingBottom = _cellRect.height - _nHeightText - _nPaddingTop;
        _nPaddingBottom = actualPaddingBottom > 0 ? actualPaddingBottom : 0;
      }
      if (!_bIsFitWidth) {
        let actualPaddingRight = _cellRect.width - _nWidthText - _nPaddingLeft;
        _nPaddingRight = actualPaddingRight > 0 ? actualPaddingRight : 0;
      }
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
      _rectSvg.x = _textBehavior.point.x;
      switch (this._zTextAlign) {
        case TextAlign.Left:
        case TextAlign.Start:
        case TextAlign.LeftTop:
        case TextAlign.Right:
        case TextAlign.RightTop:
        case TextAlign.End:
        default:
          _rectSvg.y = _textBehavior.point.y;
          _textSvgEl.setAttribute('x', '0');
          _textSvgEl.setAttribute('y', '0');
          _textSvgEl.setAttribute('dominant-baseline', 'hanging');
          _textSvgEl.setAttribute('text-anchor', 'start');
          break;
        case TextAlign.Center:
        case TextAlign.CenterTop:
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
          //case fit width?
          if (_bIsFitWidth) {
            _textSvgEl.setAttribute('x', (_rectSvg.width).toString());
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
  //vẽ checkbox theo alignt text
  private _drawCheckboxRaw(pPayload: Payload): void {
    const _rect = pPayload.cellBoundingRect;
    const _cellValue = pPayload.cellValue;
    let _nWidthCheckbox = 13;
    let _nHeightCheckbox = 13;
    let _nXCheckbox = 0;
    let _nYCheckBox = 0;
    let _nPaddingTop = this.cellPadding.paddingTop;
    let _nPaddingBottom = this.cellPadding.paddingBottom;
    let _nPaddingLeft = this.cellPadding.paddingLeft;
    let _nPaddingRight = this.cellPadding.paddingRight;
    switch (this._zTextAlign) {
      case TextAlign.Left:
      case TextAlign.Start:
      case TextAlign.LeftTop:
        _nXCheckbox = _rect.left + _nPaddingLeft;
        _nYCheckBox = _rect.top + _nPaddingTop;
        break;
      case TextAlign.Center:
      case TextAlign.CenterTop:
        _nXCheckbox = _rect.left + _rect.width / 2 - _nWidthCheckbox / 2;
        _nYCheckBox = _rect.top + _nPaddingTop;
        break;
      case TextAlign.Right:
      case TextAlign.RightTop:
      case TextAlign.End:
        _nXCheckbox = (_rect.left + _rect.width - _nPaddingRight - _nWidthCheckbox);
        _nYCheckBox = _rect.top + _nPaddingTop;
        break;
      //!Special case
      //?Center
      case TextAlign.CenterBottom:
        _nXCheckbox = _rect.left + _rect.width / 2 - _nWidthCheckbox / 2;
        _nYCheckBox = (_rect.top + _rect.height - _nPaddingBottom - _nHeightCheckbox);
        break;
      case TextAlign.CenterCenter:
        _nXCheckbox = _rect.left + _rect.width / 2 - _nWidthCheckbox / 2;
        _nYCheckBox = _rect.top + _rect.height / 2 - _nHeightCheckbox / 2;
        break;
      //?#Left
      case TextAlign.LeftCenter:
        _nXCheckbox = _rect.left + _nPaddingLeft;
        _nYCheckBox = _rect.top + _rect.height / 2 - _nHeightCheckbox / 2;
        break;
      case TextAlign.LeftBottom:
        _nXCheckbox = _rect.left + _nPaddingLeft;
        _nYCheckBox = (_rect.top + _rect.height - _nPaddingBottom - _nHeightCheckbox);
        break;
      //?#Right
      case TextAlign.RightCenter:
        _nXCheckbox = (_rect.left + _rect.width - _nPaddingRight - _nWidthCheckbox);
        _nYCheckBox = _rect.top + _rect.height / 2 - _nHeightCheckbox / 2;
        break;
      case TextAlign.RightBottom:
        _nXCheckbox = (_rect.left + _rect.width - _nPaddingRight - _nWidthCheckbox);
        _nYCheckBox = (_rect.top + _rect.height - _nPaddingBottom - _nHeightCheckbox);
        break;
    }
    /* Wrapp svg here */
    if ((_rect.width) < _nWidthCheckbox || (_rect.height) < _nHeightCheckbox) return;
    if (_cellValue === 'true' || _cellValue === true) {
      const _svgChecked = this._parser.parseFromString(inputChecked, 'image/svg+xml').childNodes[0] as SVGElement;
      setAttrSvgIcon(_svgChecked, _nXCheckbox, _nYCheckBox, _nWidthCheckbox, _nHeightCheckbox);
      pPayload.group.appendChild(_svgChecked);
    } else {
      const _svgUnChecked = this._parser.parseFromString(inputUnchecked, 'image/svg+xml').childNodes[0] as SVGElement;
      setAttrSvgIcon(_svgUnChecked, _nXCheckbox, _nYCheckBox, _nWidthCheckbox, _nHeightCheckbox);
      pPayload.group.appendChild(_svgUnChecked);
    }
  }
  /**
  * @description: Apply styles setup cho text, border, background rectangle
  * @param: pPayload : Payload
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
        this._zTextAlign = getAlignText(_stylesNormal);
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
            this._zTextAlign = getAlignText(_stylesAlternate);
          }
        }
        //case frozen
        if (_currentRow < _panel.rows.frozen || _currentCol < _panel.columns.frozen) {
          this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesFrozen);
          this._zBgColorSetup = getBgRectFromStylesSetup(_stylesFrozen);
          this._stylesTextSetup = getAcceptStylesTextSvg(_stylesFrozen);
          this._zTextAlign = getAlignText(_stylesFrozen);
        }
        //case new row
        if (_panel.rows[_currentRow] instanceof _NewRowTemplate) {
          this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesNewRow);
          this._zBgColorSetup = getBgRectFromStylesSetup(_stylesNewRow);
          this._stylesTextSetup = getAcceptStylesTextSvg(_stylesNewRow);
          this._zTextAlign = getAlignText(_stylesNewRow);
        }
        //case row group by level
        if (pPayload.isRowGroup) {
          switch ((_panel.rows[_currentRow] as GroupRow).level) {
            case 0:
              this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesGroupLv0);
              this._zBgColorSetup = getBgRectFromStylesSetup(_stylesGroupLv0);
              this._stylesTextSetup = getAcceptStylesTextSvg(_stylesGroupLv0);
              this._zTextAlign = getAlignText(_stylesGroupLv0);
              break;
            case 1:
              this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesGroupLv1);
              this._zBgColorSetup = getBgRectFromStylesSetup(_stylesGroupLv1);
              this._stylesTextSetup = getAcceptStylesTextSvg(_stylesGroupLv1);
              this._zTextAlign = getAlignText(_stylesGroupLv1);
              break;
            case 2:
              this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesGroupLv2);
              this._zBgColorSetup = getBgRectFromStylesSetup(_stylesGroupLv2);
              this._stylesTextSetup = getAcceptStylesTextSvg(_stylesGroupLv2);
              this._zTextAlign = getAlignText(_stylesGroupLv2);
              break;
            case 3:
              this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesGroupLv3);
              this._zBgColorSetup = getBgRectFromStylesSetup(_stylesGroupLv3);
              this._stylesTextSetup = getAcceptStylesTextSvg(_stylesGroupLv3);
              this._zTextAlign = getAlignText(_stylesGroupLv3);
              break;
            case 4:
              this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesGroupLv4);
              this._zBgColorSetup = getBgRectFromStylesSetup(_stylesGroupLv4);
              this._stylesTextSetup = getAcceptStylesTextSvg(_stylesGroupLv4);
              this._zTextAlign = getAlignText(_stylesGroupLv4);
              break;
            case 5:
              this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesGroupLv5);
              this._zBgColorSetup = getBgRectFromStylesSetup(_stylesGroupLv5);
              this._stylesTextSetup = getAcceptStylesTextSvg(_stylesGroupLv5);
              this._zTextAlign = getAlignText(_stylesGroupLv5);
              break;
            default:
              this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesFrozen);
              this._zBgColorSetup = getBgRectFromStylesSetup(_stylesFrozen);
              this._stylesTextSetup = getAcceptStylesTextSvg(_stylesFrozen);
              this._zTextAlign = getAlignText(_stylesFrozen);
          }
        }
        break;
      case CellType.ColumnHeader:
        this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesColsHeader);
        this._zBgColorSetup = getBgRectFromStylesSetup(_stylesColsHeader);
        this._stylesTextSetup = getAcceptStylesTextSvg(_stylesColsHeader);
        this._zTextAlign = getAlignText(_stylesColsHeader);
        break;
      case CellType.ColumnFooter:
        this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesColsFooter);
        this._zBgColorSetup = getBgRectFromStylesSetup(_stylesColsFooter);
        this._stylesTextSetup = getAcceptStylesTextSvg(_stylesColsFooter);
        this._zTextAlign = getAlignText(_stylesColsFooter);
        break;
      case CellType.RowHeader:
      case CellType.TopLeft:
        this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesRowsHeader);
        this._zBgColorSetup = getBgRectFromStylesSetup(_stylesRowsHeader);
        this._stylesTextSetup = getAcceptStylesTextSvg(_stylesRowsHeader);
        this._zTextAlign = getAlignText(_stylesRowsHeader);
        break;
      default:
        this._stylesBorderSetup = getAcceptStylesBorderSvg(_stylesNormal);
        this._zBgColorSetup = getBgRectFromStylesSetup(_stylesNormal);
        this._stylesTextSetup = getAcceptStylesTextSvg(_stylesNormal);
        this._zTextAlign = getAlignText(_stylesNormal);
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
