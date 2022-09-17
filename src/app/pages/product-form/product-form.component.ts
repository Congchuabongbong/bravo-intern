
//*Import form core angular */
import {
  Component,
  OnInit,
  ElementRef,
  AfterViewInit,
  Renderer2,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//**Import from library */
import { v4 as uuidV4 } from 'uuid';
//**import from source */
import { DataService } from 'src/app/services/data.service';
import { maxMonth } from 'src/app/shared/custom-validator/maxMonth.validator';
import { GridLayoutForm } from 'src/app/data-type';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit, AfterViewInit {
  //**Declaration */
  public tabLinks!: ElementRef[];
  public tabContents!: ElementRef[];
  public productForm!: FormGroup;
  public formInfo: GridLayoutForm.IControlGridLayoutForm = {
    row: {
      rowOfNumber: 8,
    },
    column: {
      columnOfNumber: 8,
      arrayUnitColumn: [
        { min: '10rem', max: '15rem' },
        { min: '1rem', max: '1.5rem' },
        { min: '10rem', max: '10rem' },
        { min: '10rem', max: '15rem' },
        { min: '10rem', max: '20rem' },
        { min: '10rem', max: '1fr' },
        { min: '10rem', max: '1fr' },
        { min: '5rem', max: '15%' },
      ]
    },
    gridItemForm: {
      labels: [
        {
          title: 'Mã Vật Tư',
          for: 'product_id',
          class: 'form__title',
          position: {
            rowLine: { startLine: 1, endLine: 2 },
            columnLine: { startLine: 1, endLine: 2 },
          },
          order: 1
        },
        {
          title: 'Tên Vật Tư',
          for: 'product_name',
          class: 'form__title',
          position: {
            rowLine: { startLine: 2, endLine: 3 },
            columnLine: { startLine: 1, endLine: 2 },
          },
          order: 2
        },
        {
          title: 'Tên Thứ 2',
          for: 'product_name--second',
          class: 'form__title',
          position: {
            rowLine: { startLine: 3, endLine: 4 },
            columnLine: { startLine: 1, endLine: 2 },
          },
          order: 3
        },
        {
          title: 'Đơn Vị Tính',
          for: 'product_unit',
          class: 'form__title',
          position: {
            rowLine: { startLine: 4, endLine: 5 },
            columnLine: { startLine: 1, endLine: 2 },
          },
          order: 4
        },
        {
          title: 'Loại Vật Tư',
          for: 'product_type',
          class: 'form__title',
          position: {
            rowLine: { startLine: 5, endLine: 6 },
            columnLine: { startLine: 1, endLine: 2 },
          },
          order: 5
        },
        {
          title: 'Nhóm Hàng',
          for: 'product_group',
          class: 'form__title',
          position: {
            rowLine: { startLine: 6, endLine: 7 },
            columnLine: { startLine: 1, endLine: 2 },
          },
          order: 6
        },
        {
          title: 'Tự Tạo Mã SP',
          for: 'item_id--auto',
          class: 'form__title',
          position: {
            rowLine: { startLine: 7, endLine: 8 },
            columnLine: { startLine: 1, endLine: 2 },
          },
          order: 7
        },
        {
          title: 'Mã sản phẩm',
          for: 'item_id--create',
          class: 'form__title',
          position: {
            rowLine: { startLine: 7, endLine: 8 },
            columnLine: { startLine: 3, endLine: 4 },
          },
        },
        {
          title: 'Ghi chú',
          for: 'product_note',
          class: 'form__title',
          position: {
            rowLine: { startLine: 8, endLine: 9 },
            columnLine: { startLine: 1, endLine: 2 },
          },
          order: 8
        },
        {
          title: 'Ảnh đại diện',
          for: 'product_image',
          class: 'form__title',
          position: {
            rowLine: { startLine: 2, endLine: 3 },
            columnLine: { startLine: 8, endLine: 9 },
          },
        },
      ],
      fields: [
        {
          type: 'text',
          attribute: {
            categoryTag: 'input',
            id: 'product_id',
            position: {
              rowLine: { startLine: 1, endLine: 2 },
              columnLine: { startLine: 2, endLine: 5 },
            },
            formControlName: 'idProduct',
          },
        },
        {
          type: 'text',
          attribute: {
            categoryTag: 'input',
            id: 'product_name',
            position: {
              rowLine: { startLine: 2, endLine: 3 },
              columnLine: { startLine: 2, endLine: 8 },
            },
            formControlName: 'nameProduct',
          },
        },
        {
          type: 'text',
          attribute: {
            categoryTag: 'input',
            id: 'product_name--second',
            position: {
              rowLine: { startLine: 3, endLine: 4 },
              columnLine: { startLine: 2, endLine: 8 },
            },
            formControlName: 'secondNameProduct',
          },
        },
        {
          type: 'text',
          attribute: {
            categoryTag: 'input',
            id: 'product_unit',
            position: {
              rowLine: { startLine: 4, endLine: 5 },
              columnLine: { startLine: 2, endLine: 5 },
            },
            formControlName: 'unitProduct',
          },
        },
        {
          options: [
            { title: 'Type 1', value: 1 },
            { title: 'Type 2', value: 2 },
            { title: 'Type 3', value: 3 },
          ],
          attribute: {
            categoryTag: 'select',
            id: 'product_type',
            position: {
              rowLine: { startLine: 5, endLine: 6 },
              columnLine: { startLine: 2, endLine: 6 },
            },
            formControlName: 'typeProduct',
          },
        },
        {
          options: [
            { title: 'Group 1', value: 1 },
            { title: 'Group 2', value: 2 },
            { title: 'Group 3', value: 3 },
          ],
          attribute: {
            categoryTag: 'select',
            id: 'product_group',
            position: {
              rowLine: { startLine: 6, endLine: 7 },
              columnLine: { startLine: 2, endLine: 6 },
            },
            formControlName: 'groupProduct',
          },
        },
        {
          type: 'checkbox',
          attribute: {
            categoryTag: 'input',
            id: 'item_id--auto',
            position: {
              rowLine: { startLine: 7, endLine: 8 },
              columnLine: { startLine: 2, endLine: 3 },
            },
            formControlName: 'isAutoItemCodeProduct',
          },
        },
        {
          type: 'text',
          attribute: {
            categoryTag: 'input',
            id: 'item_id--create',
            position: {
              rowLine: { startLine: 7, endLine: 8 },
              columnLine: { startLine: 4, endLine: 8 },
            },
            formControlName: 'itemCodeProduct',
          },
        },
        {
          type: 'text',
          attribute: {
            categoryTag: 'input',
            id: 'product_note',
            position: {
              rowLine: { startLine: 8, endLine: 9 },
              columnLine: { startLine: 2, endLine: 8 },
            },
            formControlName: 'noteProduct',
          },
        },
        {
          attribute: {
            categoryTag: 'textarea',
            id: 'thumbnailProduct',
            position: {
              rowLine: { startLine: 3, endLine: 9 },
              columnLine: { startLine: 8, endLine: 9 },
            },
            formControlName: 'thumbnailProduct',
          },
        },
      ],
    },
  };
  public formAttributeInfo: GridLayoutForm.IControlGridLayoutForm = {
    row: {
      rowOfNumber: 9,
    },
    column: {
      columnOfNumber: 3,
      arrayUnitColumn: [
        '15rem',
        { min: '10rem', max: '30%' },
        '1fr',
      ]
    },
    gridItemForm: {
      labels: [
        {
          title: 'Dài',
          for: 'product_length',
          class: 'form__title',
          position: {
            rowLine: { startLine: 1, endLine: 2 },
            columnLine: { startLine: 1, endLine: 2 },
          },
          order: 1
        },
        {
          title: 'Rộng',
          for: 'product_width',
          class: 'form__title',
          position: {
            rowLine: { startLine: 2, endLine: 3 },
            columnLine: { startLine: 1, endLine: 2 },
          },
          order: 2
        },
        {
          title: 'Cao',
          for: 'product_height',
          class: 'form__title',
          position: {
            rowLine: { startLine: 3, endLine: 4 },
            columnLine: { startLine: 1, endLine: 2 },
          },
          order: 3
        },
        {
          title: 'Trọng lượng',
          for: 'product_weight',
          class: 'form__title',
          position: {
            rowLine: { startLine: 4, endLine: 5 },
            columnLine: { startLine: 1, endLine: 2 },
          },
          order: 4
        },
        {
          title: 'Nhóm tiêu chuẩn QC',
          for: 'product_standard',
          class: 'form__title',
          position: {
            rowLine: { startLine: 5, endLine: 6 },
            columnLine: { startLine: 1, endLine: 2 },
          },
          order: 5
        },
        {
          title: 'Loại duyệt giá mua',
          for: 'product_type-of-purchase',
          class: 'form__title',
          position: {
            rowLine: { startLine: 6, endLine: 7 },
            columnLine: { startLine: 1, endLine: 2 },
          },
          order: 6
        },
        {
          title: 'Mã ngắn',
          for: 'product_short-code',
          class: 'form__title',
          position: {
            rowLine: { startLine: 7, endLine: 8 },
            columnLine: { startLine: 1, endLine: 2 },
          },
          order: 7
        },
      ],
      fields: [
        {
          type: 'number',
          attribute: {
            categoryTag: 'input',
            id: 'product_length',
            position: {
              rowLine: { startLine: 1, endLine: 2 },
              columnLine: { startLine: 2, endLine: 3 },
            },
            formControlName: 'lengthProduct',
          },
        },
        {
          type: 'number',
          attribute: {
            categoryTag: 'input',
            id: 'product_width',
            position: {
              rowLine: { startLine: 2, endLine: 3 },
              columnLine: { startLine: 2, endLine: 3 },
            },
            formControlName: 'widthProduct',
          },
        },
        {
          type: 'number',
          attribute: {
            categoryTag: 'input',
            id: 'product_height',
            position: {
              rowLine: { startLine: 3, endLine: 4 },
              columnLine: { startLine: 2, endLine: 3 },
            },
            formControlName: 'heightProduct',
          },
        },
        {
          type: 'number',
          attribute: {
            categoryTag: 'input',
            id: 'product_weight',
            position: {
              rowLine: { startLine: 4, endLine: 5 },
              columnLine: { startLine: 2, endLine: 3 },
            },
            formControlName: 'weightProduct',
          },
        },
        {
          options: [
            { title: 'Quy chuẩn 1', value: 1 },
            { title: 'Quy chuẩn 2', value: 2 },
            { title: 'Quy chuẩn 3', value: 3 },
          ],
          attribute: {
            categoryTag: 'select',
            id: 'product_standard',
            position: {
              rowLine: { startLine: 5, endLine: 6 },
              columnLine: { startLine: 2, endLine: 3 },
            },
            formControlName: 'standardGroupQc',
          },
        },
        {
          options: [
            { title: 'Không cần lập đơn', value: 1 },
            { title: 'Lập đơn', value: 2 },
          ],
          attribute: {
            categoryTag: 'select',
            id: 'product_type-of-purchase',
            position: {
              rowLine: { startLine: 6, endLine: 7 },
              columnLine: { startLine: 2, endLine: 3 },
            },
            formControlName: 'typeOfPurchase',
          },
        },
        {
          type: 'number',
          attribute: {
            categoryTag: 'input',
            id: 'product_short-code',
            position: {
              rowLine: { startLine: 7, endLine: 8 },
              columnLine: { startLine: 2, endLine: 3 },
            },
            formControlName: 'shortCode',
          },
        },
      ],
      subControlGridLayoutForm: {
        position: { rowLine: { startLine: 8, endLine: 10 }, columnLine: { startLine: 1, endLine: 4 } },
        subGridItemForm: {
          row: {
            rowOfNumber: 2,
          },
          column: {
            columnOfNumber: 7,
            arrayUnitColumn: [{ min: '15rem', max: '25rem' }, { min: '1rem', max: '1.5rem' }, { min: '15rem', max: '20rem' }, { min: '1rem', max: '1.5rem' }, { min: '15rem', max: '15rem' }, { min: '10rem', max: '15rem' }, '1fr']
          },
          gridItemForm: {
            labels: [{
              title: 'Mặt hàng theo dõi số serial',
              for: 'item_serial',
              class: 'form__title',
              position: {
                rowLine: { startLine: 1, endLine: 2 },
                columnLine: { startLine: 1, endLine: 2 },
              },
              order: 8
            },
            {
              title: 'Theo dõi tồn kho theo vị trí',
              for: 'item_inventory',
              class: 'form__title',
              position: {
                rowLine: { startLine: 1, endLine: 2 },
                columnLine: { startLine: 3, endLine: 4 },
              },

            },
            {
              title: 'Là Đồng phục',
              for: 'uniform_ironing',
              class: 'form__title',
              position: {
                rowLine: { startLine: 1, endLine: 2 },
                columnLine: { startLine: 5, endLine: 6 },
              },

            },
            {
              title: 'Có tem in từ cân điện tử',
              for: 'stamp_scale',
              class: 'form__title',
              position: {
                rowLine: { startLine: 2, endLine: 3 },
                columnLine: { startLine: 1, endLine: 2 },
              },
              order: 9
            },
            {
              title: 'Sử dụng lô hàng',
              for: 'item_using',
              class: 'form__title',
              position: {
                rowLine: { startLine: 2, endLine: 3 },
                columnLine: { startLine: 3, endLine: 4 },
              },
            },
            {
              title: 'Hạn dùng/bảo hành',
              for: 'due-date',
              class: 'form__title',
              position: {
                rowLine: { startLine: 2, endLine: 3 },
                columnLine: { startLine: 5, endLine: 6 },
              },
            },
            {
              title: 'tháng',
              for: 'due-date',
              class: 'form__title',
              position: {
                rowLine: { startLine: 2, endLine: 3 },
                columnLine: { startLine: 7, endLine: 8 },
              },
            }],
            fields: [
              {
                type: 'checkbox',
                attribute: {
                  categoryTag: 'input',
                  id: 'item_serial',
                  position: {
                    rowLine: { startLine: 1, endLine: 2 },
                    columnLine: { startLine: 2, endLine: 3 },
                  },
                  formControlName: 'isSerial',
                },
              },
              {
                type: 'checkbox',
                attribute: {
                  categoryTag: 'input',
                  id: 'item_inventory',
                  position: {
                    rowLine: { startLine: 1, endLine: 2 },
                    columnLine: { startLine: 4, endLine: 5 },
                  },
                  formControlName: 'isInventoryByLocation',
                },
              },
              {
                type: 'checkbox',
                attribute: {
                  categoryTag: 'input',
                  id: 'uniform_ironing',
                  position: {
                    rowLine: { startLine: 1, endLine: 2 },
                    columnLine: { startLine: 6, endLine: 7 },
                  },
                  formControlName: 'isIroningUniform',
                },
              },
              {
                type: 'checkbox',
                attribute: {
                  categoryTag: 'input',
                  id: 'stamp_scale',
                  position: {
                    rowLine: { startLine: 2, endLine: 3 },
                    columnLine: { startLine: 2, endLine: 3 },
                  },
                  formControlName: 'isIroningUniform',
                },
              },
              {
                type: 'checkbox',
                attribute: {
                  categoryTag: 'input',
                  id: 'item_using',
                  position: {
                    rowLine: { startLine: 2, endLine: 3 },
                    columnLine: { startLine: 4, endLine: 5 },
                  },
                  formControlName: 'isUsingItem',
                },
              },
              {
                type: 'number',
                attribute: {
                  categoryTag: 'input',
                  id: 'due-date',
                  position: {
                    rowLine: { startLine: 2, endLine: 3 },
                    columnLine: { startLine: 6, endLine: 7 },
                  },
                  formControlName: 'dueDateProduct',
                },
              },
            ]
          }
        }
      }
    },
  };

  //**constructor */
  constructor(
    private dataService: DataService,
    private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder
  ) { }
  // **life cycle hooks
  ngOnInit(): void {
    this.productForm = this.fb.group({
      info: this.fb.group({
        idProduct: ['', [Validators.required]],
        nameProduct: ['', [Validators.required]],
        secondNameProduct: [''],
        unitProduct: ['', [Validators.required]],
        typeProduct: [null, [Validators.required]],
        groupProduct: [null, [Validators.required]],
        isAutoItemCodeProduct: [true],
        itemCodeProduct: [
          { value: uuidV4(), disabled: true },
          [Validators.required],
        ],
        noteProduct: [''],
        thumbnailProduct: [''],
      }),
      attribute: this.fb.group({
        lengthProduct: ['', [Validators.required]],
        widthProduct: ['', [Validators.required]],
        heightProduct: ['', [Validators.required]],
        weightProduct: ['', [Validators.required]],
        standardGroupQc: [null, [Validators.required]],
        typeOfPurchase: [null, [Validators.required]],
        shortCode: ['', [Validators.required]],
        isSerial: [false],
        isInventoryByLocation: [false],
        isIroningUniform: [false],
        isStampScale: [false],
        isUsingItem: [false],
        dueDateProduct: ['', [Validators.required, maxMonth(36)]],
      }),
    });
    setTimeout(() => {
      this.dataService.sendData(this.productForm);
    });

  }

  ngAfterViewInit(): void {
    //select element when after view init*/
    this.tabLinks = this.el.nativeElement.querySelectorAll('.tab__link');
    this.tabContents = this.el.nativeElement.querySelectorAll('.tabContent');
    this.el.nativeElement.querySelector('#defaultOpen').click();
  }
  //**Getter Form */
  //**get information of product */
  get info() {
    return this.productForm.get('info');
  }
  get itemCodeProduct() {
    return this.info?.get('itemCodeProduct');
  }
  //**get information attribute of product */

  //**open tab  */
  public openTab(elRef: any, tabName: string): void {
    let currentTab = this.el.nativeElement.querySelector(`#${tabName}`);
    this.tabContents.forEach((tabContent) => {
      this.renderer.setStyle(tabContent, 'display', 'none');
    });
    this.tabLinks.forEach((tabLink) => {
      this.renderer.removeClass(tabLink, 'active');
    });
    elRef.classList.add('active');
    this.renderer.setStyle(currentTab, 'display', 'grid');
  }
  //**isAutoItemCodeProduct changed
  // public onChangeAutoItemCodeProduct(event: any): void {
  //   if (event.target.checked) {
  //     this.itemCodeProduct?.disable();
  //     this.itemCodeProduct?.setValue(uuidV4());
  //   } else {
  //     this.itemCodeProduct?.enable();
  //     this.itemCodeProduct?.setValue('');
  //   }
  // }
}
