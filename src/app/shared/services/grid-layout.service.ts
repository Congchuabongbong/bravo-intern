import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { GridLayoutData } from '../data-type';
@Injectable({
  providedIn: 'root'
})

export class GridLayoutService {
  private renderer!: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  public setPositionGirdItem(elRef: ElementRef, position: GridLayoutData.IPositionGridItem) {
    this.renderer.setStyle(elRef.nativeElement, 'grid-row', `${position.rowLine.startLine} / ${position.rowLine.endLine}`)
    this.renderer.setStyle(elRef.nativeElement, 'grid-column', `${position.columnLine.startLine} / ${position.columnLine.endLine}`)
  }
  //**set width and height grid container */
  public setWidthGridContainer(elRef: ElementRef, width: string): void {
    this.renderer.setStyle(elRef.nativeElement, 'width', width)
  }
  public setHeightGridContainer(elRef: ElementRef, height: string): void {
    this.renderer.setStyle(elRef.nativeElement, 'height', height)
  }
  //**set min width and height  grid container
  public setMinWidthGridContainer(elRef: ElementRef, minWidth: string): void {
    this.renderer.setStyle(elRef.nativeElement, 'min-width', minWidth)
  }
  public setMinHeightGridContainer(elRef: ElementRef, minHeight: string): void {
    this.renderer.setStyle(elRef.nativeElement, 'min-height', minHeight)
  }
  //**set max height and width  grid container
  public setMaxWidthGridContainer(elRef: ElementRef, maxWidth: string): void {
    this.renderer.setStyle(elRef.nativeElement, 'max-width', maxWidth)
  }
  public setMaxHeightGridContainer(elRef: ElementRef, maxHeight: string): void {
    this.renderer.setStyle(elRef.nativeElement, 'max-height', maxHeight)
  }
  //**Set gap column and row */
  public setRowGap(elRef: ElementRef, rowGapUnit: string): void {
    this.renderer.setStyle(
      elRef.nativeElement,
      'row-gap',
      `${rowGapUnit}`
    );
  }
  public setColumnGap(elRef: ElementRef, columnGapUnit: string): void {
    this.renderer.setStyle(
      elRef.nativeElement,
      'column-gap',
      `${columnGapUnit}`
    );
  }
  public setGap(elRef: ElementRef, rowGapUnit: string, columnGapUnit: string) {
    this.renderer.setStyle(
      elRef.nativeElement,
      'gap',
      `${rowGapUnit} ${columnGapUnit}`
    );
  }
  //** Set class */
  public setClass(elRef: ElementRef, className: string): void {
    this.renderer.addClass(elRef.nativeElement, className)
  }
  //** Set id */
  public setId(elRef: ElementRef, idName: string): void {
    this.renderer.setAttribute(elRef.nativeElement, 'id', idName)
  }
}
