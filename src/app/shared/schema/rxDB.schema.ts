import { RxCollection, RxDatabase, RxDocument } from "rxdb";
import { RxGridLayoutFormDocType } from "./grid-layout-form.schema";

//**RX Document Methods
type RxGridLayoutFormDocMethods = {
};
//**RxDocument
export type RxGridLayoutFormDocument = RxDocument<RxGridLayoutFormDocType, RxGridLayoutFormDocMethods>;

type RxGridLayoutFormCollection = RxCollection<RxGridLayoutFormDocType, RxGridLayoutFormDocMethods, {}>;
//** 
export type RxGridLayoutFormCollections = {
    gridLayoutForm: RxGridLayoutFormCollection;
};

export type RxDb = RxDatabase<RxGridLayoutFormCollections>;