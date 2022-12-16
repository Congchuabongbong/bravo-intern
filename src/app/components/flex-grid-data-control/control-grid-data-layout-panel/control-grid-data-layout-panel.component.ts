import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  FlexGrid,
  FormatItemEventArgs,
  CellType,
  CellRangeEventArgs,
  CellEditEndingEventArgs,
  GridPanel
} from '@grapecity/wijmo.grid';
import {
  showPopup, PropertyGroupDescription,
  hidePopup,
  hasClass,
  PopupPosition,
  EventArgs,
  CancelEventArgs,
  addClass,
  CollectionView, Point
} from '@grapecity/wijmo';
import { ListBox } from '@grapecity/wijmo.input';
import {
  IWjFlexColumnConfig,
  IWjFlexLayoutConfig,
} from 'src/app/shared/data-type/wijmo-data.type';
import { WijFlexGridService } from 'src/app/shared/services/wij-flex-grid.service';
import { HttpProductService } from 'src/app/shared/services/http-product.service';
import { Observable } from 'rxjs';
import { HttpLayoutService } from 'src/app/shared/services/http-layout.service';
import * as Excel from 'exceljs';
import {
  getStyleExcelFromStyleElement,
} from 'src/app/shared/libs/flexgrid-to-excel/core/excel.method';
import { ExcelFlexUtil, ExcelUtil } from 'src/app/shared/libs/flexgrid-to-excel/index';
import { CellMaker } from '@grapecity/wijmo.grid.cellmaker';
import { Worksheet } from 'exceljs';
// import { documentToSVG, elementToSVG, inlineResources } from 'dom-to-svg';
import { EditHighlighter } from 'src/app/shared/utils/index.util';
import { BravoSvgEngine } from 'src/app/shared/libs/dom-to-svg/bravo.svg.engine';
import { isTextNode, isHTMLImageElement, isElement, isHTMLInputElement } from '../../../shared/libs/dom-to-svg/core/dom';
import { DominantBaseline, TextAlign, TextAnchor, BehaviorText } from '../../../shared/libs/dom-to-svg/core/text';
import { hasBorderBottom, hasBorderTop, hasUniformBorder, isInline } from 'src/app/shared/libs/dom-to-svg/core/css';
import { NgIf } from '@angular/common';
import { creatorSVG, declareNamespaceSvg, drawImage, drawText } from 'src/app/shared/libs/dom-to-svg/core/svg.engine.util';
import { BravoGraphicsRenderer } from 'src/app/shared/libs/dom-to-svg/bravo-graphics/bravo.graphics.renderer';
import { Font } from '../../../shared/libs/dom-to-svg/bravo-graphics/font';
import { isFloatRight, hasBorderLeft } from '../../../shared/libs/dom-to-svg/core/css';
import FlexGridSvgEngine from 'src/app/shared/libs/dom-to-svg/bravo.flexGrid.svg.engine';
@Component({
  selector: 'app-control-grid-data-layout-panel',
  templateUrl: './control-grid-data-layout-panel.component.html',
  styleUrls: ['./control-grid-data-layout-panel.component.scss'],
})
export class ControlGridDataLayoutPanelComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('columnPicker', { static: true }) columnPicker!: ListBox;
  @ViewChild('wjFlexMain', { static: true }) wjFlexMain!: FlexGrid;
  @Input() set dataSource(value: any[]) {
    this.viewCollection = new CollectionView(value, {
      trackChanges: true,
    });
  }
  @Input() dataTabSource!: any[];
  @Input() wjFlexColumnConfig!: IWjFlexColumnConfig;
  @Input() isDrawIdOddAndEven: boolean = false;

  @Input() isColumPicker: boolean = false;
  @Output() wijFlexMainInitialized = new EventEmitter<FlexGrid>();
  @Output() wijFlexTabInitialized = new EventEmitter<FlexGrid>();
  @Output() setLoading = new EventEmitter<boolean>();
  //**Declare properties here **
  public flex!: FlexGrid;
  public selectedItems!: any[];
  public selectedItem!: any;
  public wijFlexLayout$: Observable<IWjFlexLayoutConfig> =
    this._httpLayoutService.wijFlexLayout$;
  public viewCollection!: CollectionView<any>;
  public isLoading: boolean = false;

  //**constructor
  constructor(
    private _wijFlexGridService: WijFlexGridService,
    private _httpProductService: HttpProductService,
    private _httpLayoutService: HttpLayoutService,
    private _el: ElementRef
  ) { }

  //**lifecycle hooks
  ngOnInit(): void { }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.wijFlexMainInitialized.unsubscribe();
    this.wijFlexTabInitialized.unsubscribe();
  }
  //**Initialized */
  public flexMainInitialized(flexGrid: FlexGrid) {
    this.flex = flexGrid;
    // this.flex.columnFooters;
    // this.flex.allowPinning = true;
    this.flex.collectionView.groupDescriptions.push(new PropertyGroupDescription('ItemTypeName'));
    this.flex.collectionView.groupDescriptions.push(new PropertyGroupDescription('Unit'));
    flexGrid.getColumn('Image').cellTemplate = CellMaker.makeImage({
      label: 'image for ${item.Image}',
    });
    flexGrid.getColumn('Image').cssClass = 'cell-img';

    this.wijFlexMainInitialized.emit(flexGrid);
    //generate specify columns */
    if (this.wjFlexColumnConfig) {
      this._wijFlexGridService.generateWijColumn(
        flexGrid,
        this.wjFlexColumnConfig
      );
    }

    this.flex.updatedLayout.addHandler(() => {
      FlexGridSvgEngine.onResizeViewPortAction({ width: this.flex.hostElement.offsetWidth, height: this.flex.hostElement.offsetHeight });
    });
    //event formatItem
    flexGrid.formatItem.addHandler(this.onHandelFormatItem, this);
    //autoSizedColumn
    flexGrid.autoSizedColumn.addHandler(this.onHandleAutoSizedColumn, this);
    //autoSizedRow
    flexGrid.autoSizedRow.addHandler(this.onHandleAutoSizedRow, this);
    //onScrollPositionChanged
    flexGrid.scrollPositionChanged.addHandler(
      this.onHandleScrollPositionChanged,
      this
    );
    //onSelectionChanged
    flexGrid.selectionChanged.addHandler(this.onHandleSelectionChanged, this);
    //collectionView currentChanged
    flexGrid.collectionView.currentChanged.addHandler(
      this.onHandleCollectionViewCurrentChanged,
      this
    );
    //onSelectionChanging
    flexGrid.selectionChanging.addHandler(this.onHandleSelectionChanging, this);
    //onHandleSortedColumn
    flexGrid.sortedColumn.addHandler(this.onHandleSortedColumn, this);
    //onHandleSortingColumn
    flexGrid.sortingColumn.addHandler(this.onHandleSortingColumn, this);
    //starSizedColumns
    flexGrid.starSizedColumns.addHandler(this.onHandleStarSizedColumns, this);
    //onHandleUpdatedLayout
    flexGrid.updatedLayout.addHandler(this.onHandleUpdatedLayout, this);
    //onHandleUpdatingLayout
    flexGrid.updatingLayout.addHandler(this.onHandleUpdatingLayout, this);
    //onHandleUpdatedView
    flexGrid.updatedView.addHandler(this.onHandleUpdatedView, this);
    //onHandleUpdatingView
    flexGrid.updatingView.addHandler(this.onHandleUpdatingView, this);
    //beginningEdit
    flexGrid.beginningEdit.addHandler(this.onHandleBeginningEdit, this);
    //onCellEditEnding
    flexGrid.cellEditEnding.addHandler(this.onHandleCellEditEnding, this);
    //onHandleCellEditEnded
    flexGrid.cellEditEnded.addHandler(this.onHandleCellEditEnded, this);
    //onHandleColumnGroupCollapsedChanged
    flexGrid.columnGroupCollapsedChanged.addHandler(
      this.onHandleColumnGroupCollapsedChanged
    );
    //onHandleCopied
    flexGrid.copied.addHandler(this.onHandleCopied, this);
    //onHandleCopying
    flexGrid.copying.addHandler(this.onHandleCopying, this);
    flexGrid.refreshed.addHandler(() => { }, this);
    flexGrid.refreshing.addHandler(() => { });
    this.selectedItem = this.flex.collectionView.currentItem; //-> get selected item
    this._httpProductService.selectedProductChange(
      this.flex.collectionView.currentItem.Id as number
    ); //next signal selected
    //**add event listeners mouse move *
    //**add event listener key press */
    flexGrid.addEventListener(
      flexGrid.hostElement,
      'keydown',
      (e: KeyboardEvent) => {
        if (e.altKey) {
          e.preventDefault();
          flexGrid.editableCollectionView.remove(
            flexGrid.collectionView.currentItem
          );
        }
      }
    );
    flexGrid.collectionView.collectionChanged.addHandler((sender, e) => {
      this.viewCollection.itemsAdded.forEach((item) => console.log(item));
    });
  }

  //**flex Tab Initialized*/
  public flexTabInitialized(flexGrid: FlexGrid) {
    this.wijFlexTabInitialized.emit(flexGrid);
  }
  //**Box list initialized
  listBoxInitialized(listBox: ListBox) {
    if (this.wjFlexMain && this.isColumPicker) {
      this.columnPicker.itemsSource = this.wjFlexMain.columns;
      this.columnPicker.checkedMemberPath = 'visible';
      this.columnPicker.displayMemberPath = 'header';
      this.columnPicker.lostFocus.addHandler(() => {
        //-> trigger when blur out listBox
        hidePopup(this.columnPicker.hostElement); //-> hidden listBox
      });

      let ref = this.wjFlexMain.hostElement.querySelector('.wj-topleft');
      ref?.addEventListener('mousedown', (e) => {
        if (hasClass(<Element>e.target, 'column-picker')) {
          let host = this.columnPicker.hostElement;
          if (!host.offsetHeight) {
            showPopup(host, ref, PopupPosition.BelowLeft, true); // -> show the column picker when the user clicks the top-left cell
            this.columnPicker.focus();
          } else {
            hidePopup(host, true, true);
            this.wjFlexMain.focus();
          }
          e.preventDefault();
        }
      });
    }
  }

  //?Handling Event for main flex data here
  //**event format item */
  private onHandelFormatItem(flex: FlexGrid, event: FormatItemEventArgs): void {
    //add icon setting on top-left cell
    if (event.panel == flex.topLeftCells && this.isColumPicker) {
      event.cell.innerHTML = '<i class="column-picker fa-solid fa-gear"></i>';
    }
    //draw background for odd id and even id
    if (this.isDrawIdOddAndEven) {
      if (event.panel.cellType == CellType.Cell) {
        let nameBindingColumn = event.getColumn().binding; // -> get name binding column
        if (nameBindingColumn === 'Id') {
          let valueCell = +flex.getCellData(event.row, event.col, false);
          valueCell % 2 === 0
            ? addClass(event.cell, 'even')
            : addClass(event.cell, 'odd');
        }
      }
    }
  }
  //**Auto Sized Column and Row*/
  private onHandleAutoSizedColumn(
    flex: FlexGrid,
    event: CellRangeEventArgs
  ): void {
    // console.log('trigger when column auto size changed!');
    /**
      @cellRangeEventArgs
      @method : getColumn(), getRow()
      @property : cancel, col, data, panel, range, row, empty,...
    */
  }
  private onHandleAutoSizedRow(
    flex: FlexGrid,
    event: CellRangeEventArgs
  ): void {
    // console.log('trigger when row auto size changed!');
    // console.log(cellRangeEventArgs.getRow().dataItem);
  }
  //**scroll position Changed*/
  private onHandleScrollPositionChanged(
    flex: FlexGrid,
    event: EventArgs
  ): void {
    // console.log('trigger after the control has scrolled.');
  }
  //**selection Changed and selection changing
  private onHandleSelectionChanged(
    flex: FlexGrid,
    event: CellRangeEventArgs
  ): void {
    /**
    @trigger : Occurs after selection changes.
    */
  }
  private onHandleCollectionViewCurrentChanged(): void {
    this.flex.collectionView.currentItem?.Id &&
      this._httpProductService.selectedProductChange(
        this.flex.collectionView.currentItem.Id
      );
    // this.selectedItems = this.flex.selectedItems;  get selected items
    this.selectedItem = this.flex.collectionView.currentItem; //-> get selected item
  }
  public onDeleteRowSelected(): void {
    this.flex &&
      this.flex.deferUpdate(() => {
        // this.selectedItems.length && this.selectedItems.forEach(item => this.flex.editableCollectionView.remove(item)) //-> delete selected rows
        this.flex.editableCollectionView.remove(this.selectedItem); //-> delete selected row
      });
  }

  private onHandleSelectionChanging(
    flex: FlexGrid,
    event: CellRangeEventArgs
  ): void {
    /**
    @trigger : Occurs before selection changes.
    */
    // console.log('trigger when selecting!');
  }
  //**sorted Column and sorting Column*/
  private onHandleSortedColumn(
    flex: FlexGrid,
    event: CellRangeEventArgs
  ): void {
    /**
    @trigger : Occurs after the user applies a sort by clicking on a column header.
     */
    // console.log(event.getColumn());
    // console.log('trigger when column sorted!');
  }
  private onHandleSortingColumn(
    flex: FlexGrid,
    event: CellRangeEventArgs
  ): void {
    /**
    @trigger : Occurs before the user applies a sort by clicking on a column header.
     */
    // console.log(event.getColumn());
    // console.log('trigger when column sorting!');
    if (event.getColumn().binding == 'Id') event.cancel = true;
  }
  //**onStarSizedColumns
  private onHandleStarSizedColumns(flex: FlexGrid, event: EventArgs): void {
    /**
    @trigger : When one or more columns have been resized due to star-sizing.
    */
  }
  //**updated and updating Layout */
  private onHandleUpdatedLayout(flex: FlexGrid, event: EventArgs): void {
    /**
    @trigger :Occurs after the grid has updated its internal layout.
    */
    // console.log("trigger when updated layout");
  }
  private onHandleUpdatingLayout(flex: FlexGrid, event: CancelEventArgs): void {
    /**
  @trigger :Occurs before the grid updates its internal layout.
  */
    // console.log("trigger when updating layout");
  }
  //**updated and updatingView View
  private onHandleUpdatedView(flex: FlexGrid, event: EventArgs): void {
    /**
    @trigger : Occurs when the grid finishes creating/updating the elements that make up the current view.
    @actions
    Refreshing the grid or its data source,
    Adding, removing, or changing rows or columns,
    Resizing or scrolling the grid,
    Changing the selection.
   */
    // console.log("trigger when view is updated");
  }
  private onHandleUpdatingView(flex: FlexGrid, event: CancelEventArgs): void {
    /**
    @trigger : Occurs when the grid starts creating/updating the elements that make up the current view.
    @actions
    Refreshing the grid or its data source,
    Adding, removing, or changing rows or columns,
    Resizing or scrolling the grid,
    Changing the selection.
   */
  }
  //**Beginning Edit
  private onHandleBeginningEdit(
    flex: FlexGrid,
    event: CellRangeEventArgs
  ): void {
    /**
    @trigger : Occurs before a cell enters edit mode; The event handler may cancel the edit operation.

   */
  }
  //**cell Edit Ending and ended:
  private onHandleCellEditEnding(
    flex: FlexGrid,
    event: CellEditEndingEventArgs
  ): boolean {
    /**
      @trigger : Occurs when a cell edit is ending.
      @Usage : Perform validation and prevent invalid edits
     */
    const currentValue = flex.getCellData(event.row, event.col, false);
    const newVal = flex.activeEditor.value;
    if (event.getColumn().binding === 'ItemTypeName') {
      //-> apply code for column is ItemTypeName
      event.cancel = !['Dịch vụ', 'Thành phẩm', 'Vật tư hàng hoá'].includes(
        newVal
      );
      event.stayInEditMode = event.cancel; //-> remain in edit mode
      return event.cancel;
    }
    // console.log('Trigger when Edit ending!');
    return true;
  }
  private onHandleCellEditEnded(flex: FlexGrid, event: CellRangeEventArgs) {
    /**
    @trigger : Occurs when a cell edit has been committed or canceled.
   */
    // console.log('Trigger when Edit ended!');
  }
  // **column Group Collapsed Changed
  private onHandleColumnGroupCollapsedChanged(
    flex: FlexGrid,
    event: CellRangeEventArgs
  ): void { }
  //** copied and copying */
  private onHandleCopied(flex: FlexGrid, event: CellRangeEventArgs): void {
    /**
    @trigger : Occurs after the user has copied the selection content.
    */
    // console.log('trigger when copied!');
  }
  private onHandleCopying(flex: FlexGrid, event: CellRangeEventArgs): void {
    /**
    @trigger : Occurs after the user has copied the selection content.
    */
    event.cancel = true; // cancel event
    // console.log('trigger when copying!');
  }
  //**Handle action here
  public styleHeaderSetup: Partial<CSSStyleDeclaration> = {
    fontWeight: 'bold',
    backgroundColor: '#dfe3e8',
    fontFamily: 'time new roman',
    fontSize: '11px',
  };
  public styleCellAlternatingRowStep: Partial<CSSStyleDeclaration> = {
    backgroundColor: '#b7c4cf',
    fontFamily: 'time new roman',
    fontSize: '11px',
  };
  public styleBaseSetup: Partial<CSSStyleDeclaration> = {
    backgroundColor: '#ffffff',
    fontFamily: 'time new roman',
    fontSize: '11px'
  };

  public styleOddSetup: Partial<CSSStyleDeclaration> = {
    backgroundColor: '#82cd47',
    fontFamily: 'time new roman',
    fontSize: '11px'
  };
  public styleEvenSetup: Partial<CSSStyleDeclaration> = {
    backgroundColor: '#ffddd2',
    fontFamily: 'time new roman',
    fontSize: '11px',
  };
  public styleRowGroupSetup: Partial<CSSStyleDeclaration> = {
    fontFamily: 'time new roman',
    fontSize: '11px',
    fontWeight: 'bold',
  };
  public async onExportExcelAction(): Promise<void> {
    const excelFlexUtil = new ExcelFlexUtil(this.flex);
    this.isLoading = true;
    this.setLoading.emit(this.isLoading);
    const idTimeout = setTimeout(async () => {
      const id = await excelFlexUtil.addImageIntoWorkBookByUrl('https://img.meta.com.vn/Data/image/2021/09/30/background-la-gi-anh-background-dep-5.jpg', 'jpeg');
      excelFlexUtil.worksheet.addBackgroundImage(id);
      excelFlexUtil.columnsHeaderInserted.addHandler((ws: Worksheet) => {
        ws.eachRow((row: Excel.Row) => {
          row.height = this.flex.columnHeaders.height;
          row.eachCell((cell: Excel.Cell) => {
            cell.style = getStyleExcelFromStyleElement(this.styleHeaderSetup, excelFlexUtil.cellBaseElement as HTMLElement);
          });
        });
      }, this);
      excelFlexUtil.rowGroupInserted.addHandler((ws: Excel.Worksheet, payload: ExcelUtil.DataPayload<Excel.Row>) => {
        payload.data.eachCell(cell => {
          switch (payload.level) {
            case 0:
              excelFlexUtil.addStyleForCell(cell, this.styleRowGroupSetup, {
                styleOps: {
                  alignment: { horizontal: 'center', vertical: 'middle' }, fill: {
                    pattern: 'solid', type: 'pattern',
                    fgColor: { argb: 'C147E9' }
                  } as Excel.FillPattern
                }
              });
              break;
            case 1:
              excelFlexUtil.addStyleForCell(cell, this.styleRowGroupSetup, {
                styleOps: {
                  alignment: { horizontal: 'center', vertical: 'middle' }, fill: {
                    pattern: 'solid', type: 'pattern', fgColor: {
                      argb: 'BA94D1'
                    }
                  } as Excel.FillPattern
                }
              });
              break;
            case 2:
              break;
            default:
              break;
          }
        });
      }, this);
      let step = 0;
      excelFlexUtil.rowInserted.addHandler((ws: Excel.Worksheet, payload: ExcelUtil.DataPayload<Excel.Row>) => {
        if (payload.index === step) {
          step += excelFlexUtil.alternatingRowStep + 1;
          payload.data.eachCell({ includeEmpty: true }, async (cell: Excel.Cell) => {
            if (cell.fullAddress.col === ws.getColumnKey('Id').number) {
              if ((cell.value) as number % 2 == 0) {
                excelFlexUtil.addStyleForCell(cell, this.styleEvenSetup);
              } else {
                excelFlexUtil.addStyleForCell(cell, this.styleOddSetup);
              }
            } else {
              excelFlexUtil.addStyleForCell(cell, this.styleCellAlternatingRowStep);
            }
            if (cell.fullAddress.col === ws.getColumnKey('Image').number) {
              const idImg = await excelFlexUtil.addImageIntoWorkBookByUrl(payload.item.Image, "png");
              ws.addImage(idImg, {
                tl: { col: cell.fullAddress.col, row: cell.fullAddress.row },
                ext: { width: ws.getColumnKey('Image').width as number, height: payload.data.height }
              });
            }
          });
        } else {
          payload.data.eachCell({ includeEmpty: true }, async (cell: Excel.Cell) => {
            if (cell.fullAddress.col === ws.getColumnKey('Id').number) {
              if ((cell.value) as number % 2 == 0) {
                excelFlexUtil.addStyleForCell(cell, this.styleEvenSetup);
              } else {
                excelFlexUtil.addStyleForCell(cell, this.styleOddSetup);
              }
            } else {
              excelFlexUtil.addStyleForCell(cell, this.styleBaseSetup);
            }
          });
        }
      }, this);
      excelFlexUtil.exportExcelAction();
      this.setLoading.emit(this.isLoading = false);
      excelFlexUtil.saveFileAction();
      clearTimeout(idTimeout);
    }, 50);
  }


  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef;
  public svgEngine!: FlexGridSvgEngine;
  public onExportSvgAction() {
    this.svgEngine = new FlexGridSvgEngine(this.svgContainer.nativeElement, this.flex);
    this.svgEngine.beginRender();
    const colHeaderPanel = this.flex.columnHeaders;
    const cellPanel = this.flex.cells;
    //!case pin columns
    cellPanel.viewRange.row !== -1 && cellPanel.viewRange.col !== -1 && this.drawCellPanel(cellPanel);
    colHeaderPanel.viewRange.row !== -1 && colHeaderPanel.viewRange.col !== -1 && this.drawCellPanel(colHeaderPanel);
    this.svgEngine.endRender();
    // declareNamespaceSvg(this.svgEngine.element as SVGElement);
    this.svgContainer.nativeElement.style.display = 'block';
  }

  public drawCellPanel(panel: GridPanel) {
    const { row: rowStart, row2: rowEnd, col: colStart, col2: colEnd } = panel.viewRange;
    for (let colIndex = colStart; colIndex <= colEnd; colIndex++) {
      for (let rowIndex = rowStart; rowIndex <= rowEnd; rowIndex++) {
        let cellEl = panel.getCellElement(rowIndex, colIndex);
        let cellBoundingRect = this.svgEngine.changeOriginCoordinates(cellEl.getBoundingClientRect());
        let cellStyles = window.getComputedStyle(cellEl);
        const groupSvgEl = this.svgEngine.startGroup(cellEl.className);
        const svg = this.svgEngine.drawRect(cellBoundingRect.x, cellBoundingRect.y, cellBoundingRect.width, cellBoundingRect.height);
        FlexGridSvgEngine.setAttributeFromCssForSvgEl(svg, cellStyles);
        this.svgEngine._drawBorderCell(cellBoundingRect, cellStyles);
        this.scanCell(cellEl, groupSvgEl);
        this.svgEngine.endGroup();
      }
    }
  }

  public scanCell(el: Element, group: SVGElement) {
    if (el.hasChildNodes()) {
      el.childNodes.forEach((node: Node) => {
        // text node;
        if (isTextNode(node)) {
          const svgEl = this.svgEngine.drawTextInCell(node, el);
          svgEl && group.appendChild(svgEl as Node);
        }
        // case image;
        if (isHTMLImageElement(node as HTMLElement)) {
          const svgEl = this.svgEngine.drawImageInCell(node as HTMLImageElement, el);
          svgEl && group.appendChild(svgEl as Node);
        }
        //case input
        if (isHTMLInputElement(node as Element)) { // case input checkbox
          const inputNode = node as HTMLInputElement;
          const { x, y, width, height } = inputNode.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(node as Element);
          const svgInput = this.svgEngine.drawRect(x - this.svgEngine.captureElementCoordinates.x, y - this.svgEngine.captureElementCoordinates.y, width, height);
          svgInput.setAttribute('rx', '2');
          svgInput.setAttribute('fill', '#fff');
          svgInput.setAttribute('stroke', '#767676');
          svgInput.setAttribute('stroke-width', '1.2');
          if (inputNode.checked) {
            svgInput.setAttribute('fill', '#1da1f2');
          }
        };
        this.scanCell(node as Element, group);
      });
    }

  }

}
