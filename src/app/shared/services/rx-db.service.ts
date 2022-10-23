import { Injectable, isDevMode } from '@angular/core';
import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import { createRxDatabase, RxStorage } from 'rxdb';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { GRID_LAYOUT_FORM_SCHEMA, RxGridLayoutFormDocType } from '../schema/grid-layout-form.schema';
import { DATABASE_NAME, GRID_LAYOUT_FORM_COLLECTION_NAME, PASSWORD } from '../config/rxDb.config';
import { RxGridLayoutFormCollections, RxDb, RxGridLayoutFormDocument } from '../schema/rxDB.schema';

//**Collections */
let collectionSettings = {
  [GRID_LAYOUT_FORM_COLLECTION_NAME]: {
    schema: GRID_LAYOUT_FORM_SCHEMA,
    sync: true
  },

}

//**Create Db
async function createDb(): Promise<RxDb> {
  console.log('DatabaseService: creating database..');
  let storage: RxStorage<any, any> = getRxStorageDexie();
  if (isDevMode()) {
    // use the schema-validation only in dev-mode
    // this validates each document if it is matching the jsonschema
    storage = wrappedValidateAjvStorage({ storage });
  }
  console.log('DatabaseService: creating database..');
  const db = await createRxDatabase<RxGridLayoutFormCollections>({
    name: DATABASE_NAME,
    storage,
    password: PASSWORD,
    ignoreDuplicate: true
  });
  // **create collections
  console.log('DatabaseService: create collections');
  await db.addCollections(collectionSettings);
  // **Add hooks
  console.log('DatabaseService: add hooks');
  db.collections.gridLayoutForm.preInsert(function (docObj: RxGridLayoutFormDocType) {
    const name = docObj.name;
    return db.collections.gridLayoutForm
      .findOne({
        selector: {
          name
        }
      })
      .exec()
      .then((has: RxGridLayoutFormDocument | null) => {
        if (has != null) {
          throw new Error('Another grid layout form config already has the name' + name);
        }
        return db;
      });
  }, false)
  console.log('DatabaseService: created database');
  return db;
}

let DB_INSTANCE: RxDb;
/**
 * This is run via APP_INITIALIZER in app.module.ts
 * to ensure the database exists before the angular-app starts up
 */
//**Initial Db
export async function initDatabase() {
  console.log('initDatabase()');
  DB_INSTANCE = await createDb();
}
@Injectable({
  providedIn: 'root'
})
export class RxDbService {
  get db(): RxDb {
    return DB_INSTANCE;
  }
  constructor() { }
}
