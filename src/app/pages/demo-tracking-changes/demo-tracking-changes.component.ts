import { FlexGrid } from '@grapecity/wijmo.grid';
import { CollectionView } from '@grapecity/wijmo';
import { tap } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { HttpProductService } from 'src/app/shared/services/http-product.service';

@Component({
  selector: 'app-demo-tracking-changes',
  templateUrl: './demo-tracking-changes.component.html',
  styleUrls: ['./demo-tracking-changes.component.scss']
})
export class DemoTrackingChangesComponent implements OnInit {
  public view!: CollectionView;
  public products$ = this.httpProductService.products$.pipe(tap(data => {
    this.view = new CollectionView(data, { trackChanges: true });
  }));
  constructor(private httpProductService: HttpProductService) { }

  ngOnInit(): void {
  }
  public initializedPrimary(flex: FlexGrid) {
    flex.allowAddNew = true;
    flex.allowDelete = true;
    flex.collectionView.collectionChanged.addHandler(() => {

    })
  }


}
