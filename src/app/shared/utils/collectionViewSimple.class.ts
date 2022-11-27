import { Event, EventArgs, GroupDescription, ICollectionView, IEditableCollectionView, INotifyCollectionChanged, IPagedCollectionView, IPredicate, NotifyCollectionChangedEventArgs, ObservableArray, PageChangingEventArgs, SortDescription } from '@grapecity/wijmo';
class CollectionViewSimple implements ICollectionView, IEditableCollectionView, IPagedCollectionView {
    public canChangePage!: boolean;
    public isPageChanging!: boolean;
    public itemCount!: number;
    public pageIndex!: number;
    public pageSize!: number;
    public totalItemCount!: number;
    public pageChanged!: Event<IPagedCollectionView, EventArgs>;
    public pageChanging!: Event<IPagedCollectionView, PageChangingEventArgs>;
    public canAddNew!: boolean;
    public canCancelEdit!: boolean;
    public canRemove!: boolean;
    public currentAddItem!: any;
    public currentEditItem!: any;
    public isAddingNew!: boolean;
    public isEditingItem!: boolean;
    public canFilter!: boolean;
    public canGroup!: boolean;
    public canSort!: boolean;
    public currentItem!: any;
    public currentPosition!: number;
    public filter!: IPredicate<any> | null;
    public groupDescriptions!: ObservableArray<GroupDescription>;
    public groups!: any[];
    public isEmpty!: boolean;
    public sortDescriptions!: ObservableArray<SortDescription>;
    public sourceCollection!: any;
    public currentChanged!: Event<ICollectionView<any>, EventArgs>;
    public currentChanging!: Event<ICollectionView<any>, EventArgs>;
    public items!: any[];
    public collectionChanged!: Event<INotifyCollectionChanged, NotifyCollectionChangedEventArgs<any>>;
    moveToFirstPage(): boolean {
        throw new Error('Method not implemented.');
    }
    moveToLastPage(): boolean {
        throw new Error('Method not implemented.');
    }
    moveToNextPage(): boolean {
        throw new Error('Method not implemented.');
    }
    moveToPage(index: number): boolean {
        throw new Error('Method not implemented.');
    }
    moveToPreviousPage(): boolean {
        throw new Error('Method not implemented.');
    }

    addNew() {
        throw new Error('Method not implemented.');
    }
    cancelEdit(): void {
        throw new Error('Method not implemented.');
    }
    cancelNew(): void {
        throw new Error('Method not implemented.');
    }
    commitEdit(): void {
        throw new Error('Method not implemented.');
    }
    commitNew(): void {
        throw new Error('Method not implemented.');
    }
    editItem(item: any): void {
        throw new Error('Method not implemented.');
    }
    remove(item: any): void {
        throw new Error('Method not implemented.');
    }
    removeAt(index: number): void {
        throw new Error('Method not implemented.');
    }

    contains(item: any): boolean {
        throw new Error('Method not implemented.');
    }
    moveCurrentTo(item: any): boolean {
        throw new Error('Method not implemented.');
    }
    moveCurrentToFirst(): boolean {
        throw new Error('Method not implemented.');
    }
    moveCurrentToLast(): boolean {
        throw new Error('Method not implemented.');
    }
    moveCurrentToNext(): boolean {
        throw new Error('Method not implemented.');
    }
    moveCurrentToPosition(index: number): boolean {
        throw new Error('Method not implemented.');
    }
    moveCurrentToPrevious(): boolean {
        throw new Error('Method not implemented.');
    }
    refresh(): void {
        throw new Error('Method not implemented.');
    }

    beginUpdate(): void {
        throw new Error('Method not implemented.');
    }
    endUpdate(force?: boolean | undefined): void {
        throw new Error('Method not implemented.');
    }
    deferUpdate(fn: Function, force?: boolean | undefined): void {
        throw new Error('Method not implemented.');
    }

    implementsInterface(interfaceName: string): boolean {
        throw new Error('Method not implemented.');
    }

}