import { Component, HostListener, OnInit } from '@angular/core';
import { confirmableAlert } from 'src/app/shared/decorators/confirmable.decorator';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @confirmableAlert({
    title: 'Are you sure?',
    html: 'Do you want to perform this action?',
    showDenyButton: true,
    confirmButtonText: 'Yes',
    denyButtonText: 'No',
    icon: 'question',
  })
  deleteItem(): void {
    alert('Delete performed!!!');
  }
}
