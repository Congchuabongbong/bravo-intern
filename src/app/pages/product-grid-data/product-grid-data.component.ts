import { ListBox } from '@grapecity/wijmo.input';
import { Component, OnInit } from '@angular/core';
import { HttpProductService } from 'src/app/shared/services/http-product.service';
import { IWjFlexColumnConfig, IWjFlexLayoutConfig } from 'src/app/shared/data-type/wijmo-data.type';
import { HttpLayoutService } from 'src/app/shared/services/http-layout.service';
import { Observable } from 'rxjs';
import * as wjcGrid from '@grapecity/wijmo.grid';
import { PropertyGroupDescription } from '@grapecity/wijmo';
@Component({
  selector: 'app-product-grid-data',
  templateUrl: './product-grid-data.component.html',
  styleUrls: ['./product-grid-data.component.scss']
})
export class ProductGridDataComponent implements OnInit {
  public products$ = this.httpProductService.products$;
  public wijFlexLayout$: Observable<IWjFlexLayoutConfig> = this.httpLayoutService.wijFlexLayout$
  public wijFlexColumnConfig$: Observable<IWjFlexColumnConfig> = this.httpLayoutService.wijFlexColumnConfig$;
  // public items = [{ name: 'Binh', age: 12 }, { name: 'somebody', age: 31 }]
  //**Constructor */
  constructor(private httpProductService: HttpProductService, private httpLayoutService: HttpLayoutService) { }
  //**Lifecycle hooks
  ngOnInit(): void {
  }
  // public listBoxInitialized(listBox: ListBox) {
  //   listBox.itemsSource = this.items;
  //   listBox.checkedMemberPath = 'visible';
  //   listBox.displayMemberPath = 'name'
  // }

  public flexMainInitialized(flexGrid: wjcGrid.FlexGrid) {
    flexGrid.allowDragging = wjcGrid.AllowDragging.Both; //-> allow dragging
    flexGrid.allowResizing = wjcGrid.AllowResizing.Both; // -> allow resizing
    // flexGrid.headersVisibility = wjcGrid.HeadersVisibility.Column; // -> headers visibility
    flexGrid.allowMerging = 1; // ->allow merging



    //**Property:
    /**
    @groupDescriptions property of collectionView: Add group descriptions using method push
    @Demo flexGrid.collectionView.groupDescriptions.push(new PropertyGroupDescription('ItemTypeName'))

    @allowResizing  //-> allow resizing
    @Demo flexGrid.allowResizing = 0;

    @autoSizeMode // -> allow auto resize fit content
    @Demo flexGrid.autoSizeMode = 0; 

    */

    //**event */
    /** 
    @currentChanged
    @Demo flexGrid.collectionView.currentChanged.addHandler((collectionView, even) => {
      console.log(flexGrid.collectionView.currentItem); // -> next signal here!
    });
    
    */

    //**Method */
    /** 
    @applyTemplate 
    @dispose :removing its association with the host element
    @Demo  flexGrid.dispose()

    @getCellData : Gets the value stored in a cell in the scrollable area of the grid.
    @Demo flexGrid.getCellData(1, 'Id', false)

    @getClipString : Gets the content of a CellRange as a string 
    @Demo flexGrid.getClipString(new wjcGrid.CellRange(0, 3, 5, 3), true)

    @getColumn
    @Demo 

    @getSelectedState : Gets a SelectedState value that indicates the selected state of a cell.
    @Demo flexGrid.getSelectedState(0, 0)

    @initialize : Initializes the control by copying the properties from a given object.
    @Demo : fleGrid.initialize({
              itemsSource: myList,
              autoGenerateColumns: false,
              columns: [
                { binding: 'id', header: 'Code', width: 130 },
                { binding: 'name', header: 'Name', width: 60 }
              ]
            })
    @
    */




  }

  public flexTabInitialized(flexGrid: wjcGrid.FlexGrid) {
    flexGrid.headersVisibility = wjcGrid.HeadersVisibility.Column; // -> headers visibility
  }
}
