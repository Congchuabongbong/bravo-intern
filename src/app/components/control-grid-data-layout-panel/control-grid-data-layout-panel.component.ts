import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FlexGrid, FormatItemEventArgs, CellType, CellRangeEventArgs, CellEditEndingEventArgs, Column, ICellTemplateContext } from '@grapecity/wijmo.grid';
import { showPopup, hidePopup, hasClass, PopupPosition, EventArgs, CancelEventArgs, addClass, toggleClass, Control, CollectionView } from '@grapecity/wijmo';
import { ListBox } from '@grapecity/wijmo.input';
import { IWjFlexColumnConfig, IWjFlexLayoutConfig } from 'src/app/shared/data-type/wijmo-data.type';
import { WijFlexGridService } from 'src/app/shared/services/wij-flex-grid.service';
import { EditHighlighter } from 'src/app/shared/utils/edit-highlighter';
import { CellMaker } from '@grapecity/wijmo.grid.cellmaker';
import { HttpProductService } from 'src/app/shared/services/http-product.service';
import { Observable } from 'rxjs';
import { HttpLayoutService } from 'src/app/shared/services/http-layout.service';

@Component({
  selector: 'app-control-grid-data-layout-panel',
  templateUrl: './control-grid-data-layout-panel.component.html',
  styleUrls: ['./control-grid-data-layout-panel.component.scss']
})
export class ControlGridDataLayoutPanelComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('columnPicker', { static: true }) columnPicker!: ListBox;
  @ViewChild('wjFlexMain', { static: true }) wjFlexMain!: FlexGrid;
  @Input() dataSource!: any[];
  @Input() dataTabSource!: any[];
  @Input() wjFlexColumnConfig!: IWjFlexColumnConfig;
  @Input() isDrawIdOddAndEven: boolean = false;
  @Input() isColumPicker: boolean = false;
  @Output() wijFlexMainInitialized = new EventEmitter<FlexGrid>();
  @Output() wijFlexTabInitialized = new EventEmitter<FlexGrid>();

  //**Declare properties here **
  public flex!: FlexGrid;
  public selectedItems!: any[];
  public selectedItem!: any;
  public wijFlexLayout$: Observable<IWjFlexLayoutConfig> = this._httpLayoutService.wijFlexLayout$;
  //**constructor
  constructor(private _wijFlexGridService: WijFlexGridService, private _renderer: Renderer2, private _el: ElementRef, private _httpProductService: HttpProductService, private _httpLayoutService: HttpLayoutService) {
    this.wijFlexLayout$.subscribe(data => console.log(JSON.stringify(data)));

  }

  //**lifecycle hooks
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.wijFlexMainInitialized.unsubscribe();
    this.wijFlexTabInitialized.unsubscribe();
    this.wjFlexMain.dispose();
  }
  //**Initialized */
  public flexMainInitialized(flexGrid: FlexGrid) {
    this.flex = flexGrid;
    new EditHighlighter(flexGrid, 'cell-changed');
    this.wijFlexMainInitialized.emit(flexGrid);
    //generate specify columns */
    if (this.wjFlexColumnConfig) {
      this._wijFlexGridService.generateWijColumn(flexGrid, this.wjFlexColumnConfig)
    }
    //event formatItem
    flexGrid.formatItem.addHandler(this.onHandelFormatItem.bind(this));
    //autoSizedColumn
    flexGrid.autoSizedColumn.addHandler(this.onHandleAutoSizedColumn.bind(this));
    //autoSizedRow
    flexGrid.autoSizedRow.addHandler(this.onHandleAutoSizedRow.bind(this));
    //onScrollPositionChanged
    flexGrid.scrollPositionChanged.addHandler(this.onHandleScrollPositionChanged.bind(this));
    //onSelectionChanged
    flexGrid.selectionChanged.addHandler(this.onHandleSelectionChanged.bind(this));
    //collectionView currentChanged
    flexGrid.collectionView.currentChanged.addHandler(this.onHandleCollectionViewCurrentChanged.bind(this))
    //onSelectionChanging
    flexGrid.selectionChanging.addHandler(this.onHandleSelectionChanging.bind(this));
    //onHandleSortedColumn
    flexGrid.sortedColumn.addHandler(this.onHandleSortedColumn.bind(this));
    //onHandleSortingColumn
    flexGrid.sortingColumn.addHandler(this.onHandleSortingColumn.bind(this));
    //starSizedColumns
    flexGrid.starSizedColumns.addHandler(this.onHandleStarSizedColumns.bind(this));
    //onHandleUpdatedLayout
    flexGrid.updatedLayout.addHandler(this.onHandleUpdatedLayout.bind(this));
    //onHandleUpdatingLayout
    flexGrid.updatingLayout.addHandler(this.onHandleUpdatingLayout.bind(this));
    //onHandleUpdatedView
    flexGrid.updatedView.addHandler(this.onHandleUpdatedView.bind(this));
    //onHandleUpdatingView
    flexGrid.updatingView.addHandler(this.onHandleUpdatingView.bind(this));
    //beginningEdit
    flexGrid.beginningEdit.addHandler(this.onHandleBeginningEdit.bind(this))
    //onCellEditEnding
    flexGrid.cellEditEnding.addHandler(this.onHandleCellEditEnding.bind(this));
    //onHandleCellEditEnded
    flexGrid.cellEditEnded.addHandler(this.onHandleCellEditEnded.bind(this));
    //onHandleColumnGroupCollapsedChanged
    flexGrid.columnGroupCollapsedChanged.addHandler(this.onHandleColumnGroupCollapsedChanged);
    //onHandleCopied
    flexGrid.copied.addHandler(this.onHandleCopied);
    //onHandleCopying
    flexGrid.copying.addHandler(this.onHandleCopying);
    this.selectedItem = this.flex.collectionView.currentItem; //-> get selected item
    /*add delete column*/
    // flexGrid.deferUpdate(() => {
    //   this.flex.columns.unshift(new Column({
    //     header: "Delete Action",
    //     width: 150,
    //     align: "center",
    //     cellTemplate: CellMaker.makeButton({
    //       text: '<i class="fa-solid fa-trash"></i>', // override bound text
    //       click: (e: MouseEvent, ctx: ICellTemplateContext) => {
    //         this.onDeleteRowSelected();
    //       }
    //     })
    //   }))
    // })

    //add column group
    // flexGrid.columnGroups = [

    // ]
    this._httpProductService.selectedProductChange(this.flex.collectionView.currentItem.Id as number)

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
      // this.columnPicker.itemChecked.addHandler((s, e) => {
      //   console.log(s.checkedItems);
      // })
      this.columnPicker.lostFocus.addHandler(() => { //-> trigger when blur out listBox
        hidePopup(this.columnPicker.hostElement); //-> hidden listBox
      });

      let ref = this.wjFlexMain.hostElement.querySelector('.wj-topleft');
      ref?.addEventListener('mousedown', (e) => {
        if (hasClass(<Element>e.target, 'column-picker')) {
          let host = this.columnPicker.hostElement;
          if (!host.offsetHeight) {
            showPopup(host, ref, PopupPosition.BelowLeft, true);// -> show the column picker when the user clicks the top-left cell
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
          valueCell % 2 === 0 ? addClass(event.cell, 'even') : addClass(event.cell, 'odd');
        }
      }
    }
  }
  //**Auto Sized Column and Row*/
  private onHandleAutoSizedColumn(flex: FlexGrid, event: CellRangeEventArgs): void {
    console.log('trigger when column auto size changed!');
    /**
      @cellRangeEventArgs 
      @method : getColumn(), getRow()
      @property : cancel, col, data, panel, range, row, empty,... 
    */
  }
  private onHandleAutoSizedRow(flex: FlexGrid, event: CellRangeEventArgs): void {
    console.log('trigger when row auto size changed!');
    // console.log(cellRangeEventArgs.getRow().dataItem);
  }
  //**scroll position Changed*/
  private onHandleScrollPositionChanged(flex: FlexGrid, event: EventArgs): void {
    // console.log('trigger after the control has scrolled.');
  }
  //**selection Changed and selection changing
  private onHandleSelectionChanged(flex: FlexGrid, event: CellRangeEventArgs): void {
    /** 
    @trigger : Occurs after selection changes.
    */
    // console.log(flex.collectionView.currentItem);
  }
  private onHandleCollectionViewCurrentChanged(): void {
    this._httpProductService.selectedProductChange(this.flex.collectionView.currentItem.Id);
    // this.selectedItems = this.flex.selectedItems;  get selected items
    this.selectedItem = this.flex.collectionView.currentItem; //-> get selected item
  }
  public onDeleteRowSelected(): void {
    this.flex && this.flex.deferUpdate(() => {
      // this.selectedItems.length && this.selectedItems.forEach(item => this.flex.editableCollectionView.remove(item)) //-> delete selected rows
      this.flex.editableCollectionView.remove(this.selectedItem) //-> delete selected row
    })
  }

  private onHandleSelectionChanging(flex: FlexGrid, event: CellRangeEventArgs): void {
    /** 
    @trigger : Occurs before selection changes.
    */
    // console.log('trigger when selecting!');    
  }
  //**sorted Column and sorting Column*/
  private onHandleSortedColumn(flex: FlexGrid, event: CellRangeEventArgs): void {
    /**
    @trigger : Occurs after the user applies a sort by clicking on a column header.
     */
    // console.log(event.getColumn());
    console.log('trigger when column sorted!');
  }
  private onHandleSortingColumn(flex: FlexGrid, event: CellRangeEventArgs): void {
    /**
    @trigger : Occurs before the user applies a sort by clicking on a column header.
     */
    // console.log(event.getColumn());
    console.log('trigger when column sorting!');
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
  private onHandleBeginningEdit(flex: FlexGrid, event: CellRangeEventArgs): void {
    /**
    @trigger : Occurs before a cell enters edit mode; The event handler may cancel the edit operation.
   */
  }
  //**cell Edit Ending and ended:
  private onHandleCellEditEnding(flex: FlexGrid, event: CellEditEndingEventArgs): boolean {
    /**
      @trigger : Occurs when a cell edit is ending.
      @Usage : Perform validation and prevent invalid edits
     */
    const currentValue = flex.getCellData(event.row, event.col, false);
    const newVal = flex.activeEditor.value;
    if (event.getColumn().binding === 'ItemTypeName') { //-> apply code for column is ItemTypeName
      event.cancel = !["Dịch vụ", "Thành phẩm", "Vật tư hàng hoá"].includes(newVal);
      event.stayInEditMode = event.cancel; //-> remain in edit mode 
      return event.cancel;
    }
    console.log('Trigger when Edit ending!');
    return true;
  }
  private onHandleCellEditEnded(flex: FlexGrid, event: CellRangeEventArgs) {
    /**
    @trigger : Occurs when a cell edit has been committed or canceled.
   */
    console.log('Trigger when Edit ended!');
  }
  // **column Group Collapsed Changed
  private onHandleColumnGroupCollapsedChanged(flex: FlexGrid, event: CellRangeEventArgs): void {

  }
  //** copied and copying */
  private onHandleCopied(flex: FlexGrid, event: CellRangeEventArgs): void {
    /**
    @trigger : Occurs after the user has copied the selection content.
    */
    console.log('trigger when copied!');
  }
  private onHandleCopying(flex: FlexGrid, event: CellRangeEventArgs): void {
    /**
    @trigger : Occurs after the user has copied the selection content.
    */
    event.cancel = true; // cancel event
    console.log('trigger when copying!');
  }
  //**Handle action here
  public onAddNewColumn(): void {

  }
}


