I. RxDB là gì?

- RxDB viết tắt của (Reactive Database) là một cơ dỡ diệu liệu NoSQL dùng cho mô hình offline-first cho javascript application như website, hybrid Apps, Electron-Apps, Progressive Web Apps và NodeJs v.v. Reactive ở đây có nghĩa là chúng ta sẽ không chỉ query được state hiện tại mà chúng ta còn có thể subscribe cho tất cả các thay đổi từ kết quả của một truy vấn, đến single field của một document, vì vậy với RxDB chúng ta có thể observable mọi thứ. Điều này cho phép chúng ta xây dựng các realtime applications fast và reliable. Bất cứ khi nào dữ liệu của chúng ta thay đổi, UI của chúng ta sẽ phản hồi state mới nhất. Điều này là vô cùng tuyệt với cho UI-based realtime applications vì có thể dễ dàng phát triển và giúp có một cải thiện về performance rất tốt. Ngoài ra nó cũng có thể xây dựng backend với NodeJs một cách nhanh chóng.
- RxDB cung cấp protocol để dễ dàng implement cho việc sao chép hay đồng bộ theo thời gian thực với infrastructure hiện có hay với CouchDB endpoint ,REST, Websocket hoặc p2p.
- RxDB tuân theo mô hình offline-fist giúp cho ứng dụng có thể work ngay cả khi offline cũng như online. Điều này được thực hiện bằng cách duy trì data ở phía client và sao chép - nhân bản nó trong background (RxDB thậm chí có thể chỉ được sử dụng ở phía client mà không có đến backend) hay sẽ cần ít resources từ backend hơn và dễ dàng mở rộng hơn.
- RxDB bản thân nó không phải là một database độc lập thay vào đó data được stored từ một implementation của RxStorage interface. Điều này giúp chúng ta có thể thay đổi được các store engine sao cho phù hợp với JavaScript environment và performance requirements. Ví dụ chúng ta có thể sử dụng PouchDB storage với SQLite adapter (bộ chuyển SQLite) hay sử dụng LokiJS RxStorage cùng với the IndexedDB adapter dựa trên browser v.v.... từ đó làm tăng khả năng reusable code vì có cùng một database code có thể được sử dụng trong bất kỳ JavaScript runtime nào bằng cách chuyển đổi storage engine.
  => Tạo ra một realtime application một cách dễ dàng.
  => Dễ dàng đồng bộ và tương thích với nhiều infrastructure (cơ sở hạ tầng ).
  => Có thể xây dựng mô hình offline-first giúp app có thể work như online.
  => Hỗ trợ nhiều cơ chế store engine dễ dàng chuyển đổi sao cho phù hợp với dự án (IndexDb, PouchDb, LokiJs, DexieJs, ...)
  II. Các tính năng :

1. Subscribe đến các event, query results, documents và event single fields của một document.
   - RxDB implement từ thư viện RxJs tạo ra data reactive => Từ đó giúp ta có thể dễ dàng show ra real-time database-state trong Dom mà không cần phải re-query lại một cách thủ công

```
db.heroes
  .find()
  .sort('name')
  .$ // <-trả về observable của một query
  .subscribe( docs => {
    myDomElement.innerHTML = docs
      .map(doc => '<li>' + doc.name + '</li>')
      .join();
  });
```

2. MultiWindow/Tab.
   - Khi data thay đổi trên một window/tab của trình duyệt, RxDB supports cập nhật trạng thái mới nhất lên UI của tất cả window/tab trình duyệt với state mới nhất được update lên toàn bộ window/tab.
3. EventReduce.
   - Một lợi ích lớn của realtime database là việc tối ưu hóa hiệu suất tốt có thể được thực hiện khi database biết một query được coi là một observable từ đó có thể updated data một cách nhanh chóng (realtime). Bên trong RxDB sử dụng thuật toán Event Reduce algorithm. Điều này đảm bảo rằng khi update / insert / delete document, query không phải re-run lại trên toàn bộ database nhưng kết quả mới sẽ được tính toán từ các event => Giúp tạo ra một hiệu suất vô cùng lớn mà không tốn kém nhiều thời gian...
4. Schema.
   - Schemas xác định thông qua json-schema và được sử dụng để mô tả một document

```
const mySchema = {
    title: "hero schema",
    version: 0, // <- incremental version-number
    description: "describes a simple hero",
    primaryKey: 'name', // <- 'name' is the primary key for the coollection, it must be unique, required and of the type string
    type: "object",
    properties: {
        name: {
            type: "string",
            maxLength: 30
        },
        secret: {
            type: "string",
        },
        skills: {
            type: "array",
            maxItems: 5,
            uniqueItems: true,
            item: {
                type: "object",
                properties: {
                    name: {
                        type: "string"
                    },
                    damage: {
                        type: "number"
                    }
                }
            }
        }
    },
    required: ["color"],
    encrypted: ["secret"] // <- this means that the value of this field is stored encrypted
};
```

5. Mango / Chained queries.
   - RxDB có thể query bằng mango NoSql tiêu chuẩn ví dụ như mongoDB hay các hệ NoSql khác.
   - Ngoài ra RxDB hỗ trợ query-builder plugin để tạo ra một chuỗi mango-queries.

```
// normal query
myCollection.find({
  selector: {
    name: {
      $ne: 'Alice'
    },
    age: {
      $gt: 67
    }
  },
  sort: [{ age: 'desc' }],
  limit: 10
})

// chained query
myCollection
  .find()
  .where('name').ne('Alice')
  .where('age').gt(18).lt(67)
  .limit(10)
  .sort('-age')
  .exec().then( docs => {
    console.dir(docs);
  });
```

6. Encryption (Mã Hoá).
   - Mã hoá một schema-field bằng cách setting => value của field sẽ được lưu giữ trong chế độ mã hoá và không thể đọc nếu không có password. Và có thể mã hoá object lồng nhau như ví dụ:

```
{
  "title": "my schema",
  "properties": {
    "secret": {
      "type": "string",
      "encrypted": true
    }
  },
  "encrypted": [
    "secret"
  ]
}
```

7. Import / Export
   - RxDB cho phép chúng ta import hoặc export tất cả database hoặc các collection riêng lẻ thành json-object => Hữu ích trong quá trình trace bugs và testing trong app.

```
// export a single collection
const jsonCol = await myCollection.dump();

// export the whole database
const jsonDB = await myDatabase.dump();

// import the dump to the collection
await emptyCollection.importDump(json);


// import the dump to the database
await emptyDatabase.importDump(json);
```

8. Key-Compression
   - Phụ thuộc vào adapter( bộ chuyển đổi) và môi trường sử dụng RxDB, client-side storage sẽ bị giới hạn theo nhiều cách khác nhau. Để tiết kiệm dung lượng của disc (ổ đĩa), RxDB sử dụng phương pháp key compression dựa trên schema để giảm thiểu kích thước của các document đã lưu. Điều này giúp tiết kiệm khoảng 40% dung lượng lưu trữ đã sử dụng.

```
// when you save an object with big keys
await myCollection.insert({
  firstName: 'foo'
  lastName:  'bar'
  stupidLongKey: 5
});

// key compression will internally transform it to
{
  '|a': 'foo'
  '|b':  'bar'
  '|c': 5
}

// so instead of 46 chars, the compressed-version has only 28
// the compression works internally, so you can of course still access values via the original key.names and run normal queries.
console.log(myDoc.firstName);
// 'foo'
```

III. Install

1. npm
   - Để cài đặt phiên bản mới nhất của RxDB và các dependencies của nó và lưu nó vào package.json

```
npm i rxdb --save
```

2. Polyfills

   - RxDB sử dụng syntax es8 và chuyển sang es5. Điều này có nghĩa là chúng ta phải cài đặt polyfills để hỗ trợ các trình duyệt cũ hơn. Ví dụ, bạn có thể sử dụng babel-polyfills với:

```
npm i @babel/polyfill --save
```

    - Nếu bạn cần polyfills, bạn phải import chúng vào code của mình.

```
import '@babel/polyfill';
```

3. Polyfill the global variable

   - Khi sử dụng RxDB với Angular hoặc các frameworks khác dựa trên webpack, ta có thể nhận được một error Uncaught ReferenceError: global is not defined. Nguyên nhân là do pouchdb cố gắng dùng biến global của nodejs không có trên môi trường browser. Chúng ta phải thêm nó tuỳ vào framework hiện tại đang dùng, còn đối với angular thì chúng ta sẽ thêm vào file polyfills.ts trong src:

```
(window as any).global = window;
(window as any).process = {
    env: { DEBUG: undefined },
};
/*
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js';  // Included with Angular CLI.
```

4. Dev Mod
   - Dev-mode plugin sẽ add thêm nhiều checks và validations cho RxDB. Điều này sẽ giúp đảm bảo rằng chúng ta sử dụng API RxDB đúng cách vì vậy plugin dev mod phải luôn được sử dụng khi sử dụng RxDB ở trong môi trường phát triển
     - Giúp cho dễ dàng đọc được các error message
     - Luôn đảm bảo readonly javascript object không được mutated
     - Add validation check cho schemas, queries, ORM methods và document fields

```
import { isDevMode } from '@angular/core';
import { addRxPlugin } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
addRxPlugin(RxDBDevModePlugin);

async function createDb() {
    if (isDevMode()){
        await import('rxdb/plugins/dev-mode').then(
            module => addRxPlugin(module as any)
        );
    }
    const db = createRxDatabase( /* ... */ );
    // ...
}
```

    - IMPORTANT:  Dev-mode plugin sẽ làm tăng kích thước và giảm hiệu năng của app vì vậy nó chỉ nên được sử dụng trong môi trường phát triển và chúng ta không bao giờ sử dụng nó trong môi trường production.

IV. RxDatabase

- RxDB object chứa các collection và sử lý việc đồng bộ hoá các change-event.
- Creation
  - Database được create bằng function createRxDatabase() một asynchronous function nằm trong core RxDb module. Tham số nhận vào là một object và có các property sau:

```
import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/dexie';

const db = await createRxDatabase({
  name: 'heroesdb',                   // <- name
  storage: getRxStorageDexie(),       // <- RxStorage
  password: 'myPassword',             // <- password (optional)
  multiInstance: true,                // <- multiInstance (optional, default: true)
  eventReduce: true                   // <- eventReduce (optional, default: true)
  cleanupPolicy: {}                   // <- custom cleanup policy (optional)
});
```

    - name
    	- Name của Database là một unique string. Nếu hai RxDb có cùng tên và sử dụng cùng một RxStorage thì data của chúng có thể giống nhau và cùng share event với nhau. Tuỳ thuộc vào storage engine và adapter điều này có thể được sử dụng để xác định filesystem folder data của bạn.
    - storage
    	- Như đã đề cập ở trên, RxDB hoạt động dựa trên việc đó là implementation của RxStorage interface. Interface này là một abstraction cho phép bạn sử dụng các underlaying database khác nhau để handle các document trong database. Vì vậy tuỳ thuộc vào trường hợp sử dụng, bạn có thể sử dụng storage khác nhau sao cho phù hợp với project.
    	- Đây là ví dụ một vài implementation trong list của RxStorage :

```
// use the PouchDB storage with indexeddb adapter...
import { getRxStoragePouch, addPouchPlugin } from 'rxdb/plugins/pouchdb';
addPouchPlugin(require('pouchdb-adapter-idb'));

const dbPouch = await createRxDatabase({
  name: 'mydatabase',
  storage: getRxStoragePouch('idb')
});


// ...or use the Dexie.js RxStorage that stores data in IndexedDB.
import { getRxStorageDexie } from 'rxdb/plugins/dexie';

const dbDexie = await createRxDatabase({
  name: 'mydatabase',
  storage: getRxStorageDexie()
});


// ...or use the LokiJS RxStorage with the indexeddb adapter.
import { getRxStorageLoki } from 'rxdb/plugins/lokijs';
const LokiIncrementalIndexedDBAdapter = require('lokijs/src/incremental-indexeddb-adapter');

const dbLoki = await createRxDatabase({
  name: 'mydatabase',
  storage: getRxStorageLoki({
    adapter: new LokiIncrementalIndexedDBAdapter()
  })
});
```

    - password (optional)
    	- Đây là optional tức bạn có thể có hoặc không. Nếu bạn muốn mã hoá các field trong collection của database bạn phải đặt password cho nó. Password phải là string và dài ít nhất 12 kí tự
    - multiInstance (optional - default = true)
    	- Khi bạn tạo nhiều hơn một instance của database trong một single javascript-runtime, bạn nên set multiInstance là true. Điều này sẽ cho phép share event giữa hai instance. Ví dụ khi user bật hai hoặc nhiều window/tab trên cùng browser đồng nghĩa chúng ta sẽ phải tạo ra nhiều instance của database và khi có thay đổi ( vd như một record được save/ update /delete  v.v...) thì các event giữa các instance có thể share lẫn nhau vì thế các window/tab trên cùng browser sẽ phản hồi với những thay đổi giống nhau.
    	- multiInstance phải được đặt thành false khi bạn chỉ có một instance của database ví dụ như một single NodeJs-process hoặc react native app hoặc Cordova app hoặc single-window electron app v.v... nó có thể làm giảm thời gian startup vì không có một instance coordination nào được thực hiện cả.
    - eventReduce (optional - default = true)
    	- Như đã đề cập ở trên, một lợi ích lớn của realtime database là việc tối ưu hóa hiệu suất tốt có thể được thực hiện khi database biết một query được coi là một observable từ đó có thể updated data một cách liên tục và nhanh chóng (realtime). RxDB sử dụng EventReduce để  tối ưu hoá observe hoặc recurring query.
    - ignoreDuplicate (optional - default = false)
    	- Nếu bạn tạo nhiều instance của RxDatabase có cùng name và adapter điều này có thể dẫn đến error. Để tránh lỗi phổ biến này, RxDB sẽ throw ra error khi điều này xảy ra. Trong một số trường hợp như unit-tests, bạn muốn thực hiện điều này một cách có chủ đích thì đặt ignoreDuplicate = true.

```
const db1 = await createRxDatabase({
  name: 'heroesdb',
  storage: getRxStoragePouch('idb'),
  ignoreDuplicate: true
});
const db2 = await createRxDatabase({
  name: 'heroesdb',
  storage: getRxStoragePouch('idb'),
  ignoreDuplicate: true // this create-call will not throw because you explicitly allow it
});
```

- Method

  1.  Observe with $

      - Trả về một RxJs Observable => stream all events của RxDatabase

```
myDb.$.subscribe(changeEvent => console.dir(changeEvent));
```

    2. exportJSON()

    	- Export tất cả các data trong database ra thành json. Bạn có thể  truyền thêm true làm parameter để decrypt (giải mã) các field mà bạn encrypted (mã hoá) trong các data-field của document.

```
import { addRxPlugin } from 'rxdb';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
addRxPlugin(RxDBJsonDumpPlugin);

myDatabase.exportJSON()
  .then(json => console.dir(json));
```

    3. importJSON()
    	- Để nhập json-dumps vào database của bạn

```
// import the dump to the database
emptyDatabase.importJSON(json)
  .then(() => console.log('done'));
```

    4. Backup()
    	- RxDB hỗ trợ backup (sao lưu) data hiện tại ( hoặc đang diễn ra) từ database vào trong filesystem. Với backup plugin, bạn có thể ghi database state hiện tại và các thay đổi đang diễn ra vào folders trong filesystem. Các file sẽ được ghi bằng json cùng với các tệp đính kèm của chúng. Điều này là hữu ích cho việc có thể sử dụng dữ liệu của database với software khác mà không thể replicate với RxDB. Ngoài ra nó còn giúp cho việc backup database vào các remote server bằng cách gắn backup folder lên server khác.
    		1. import
    			- Backup plugin chỉ work trên node.js còn browser thì không. Điều này có nghĩa là chúng ta phải import nó vào RxDB trước khi nó có thể được sử dụng

```
import { addRxPlugin } from 'rxdb';
import { RxDBBackupPlugin } from 'rxdb/plugins/backup';
addRxPlugin(RxDBBackupPlugin);
```

    		2. one-time backup
    			- Ghi toàn bộ database vào filesystem một lần, khi được gọi nhiều lần nó sẽ tiếp tục từ điểm kiểm tra trả cuối cùng và không bắt đầu lại từ đầu.

```
const backupOptions = {
    // if false, a one-time backup will be written
    live: false,
    // the folder where the backup will be stored
    directory: '/my-backup-folder/,
    // if true, attachments will also be saved
    attachments: true
}
const backupState = myDatabase.backup(backupOptions);
await backupState.awaitInitialBackup();

// call again to run from the last checkpoint
const backupState2 = myDatabase.backup(backupOptions);
await backupState2.awaitInitialBackup();
```

    		3. live backup
    			- Khi set live: true, thì bản sao sẽ ghi tất cả các thay đổi đang diễn ra vào thư mục sao lưu.

```
const backupOptions = {
    // set live: true to have an ongoing backup
    live: true,
    directory: '/my-backup-folder/,
    attachments: true
}
const backupState = myDatabase.backup(backupOptions);

// you can still await the initial backup write, but further changes will still be processed.
await backupState.awaitInitialBackup();
```

    		4. writeEvent$
    			- Bạn có thể listen đến writeEvent$ Observable để nhận notified về các file đã backup

```
const backupOptions = {
    live: false,
    directory: '/my-backup-folder/,
    attachments: true
}
const backupState = myDatabase.backup(backupOptions);

const subscription = backupState.writeEvents$.subscribe(writeEvent => console.dir(writeEvent));
/*
> {
    collectionName: 'humans',
    documentId: 'foobar',
    files: [
        '/my-backup-folder/foobar/document.json'
    ],
    deleted: false
}
*/

```

    5. server()
    	- Create ra một server tương thích với Couchdb từ database.
    6. waitForLeadership()
    	- Return một promise sẽ resolve khi RxDB trở thành elected leader
    7. requestldlePromise()
    	- Return một promise sẽ resolve khi database không hoạt động. Điều này hoạt động tương tự như requestIdleCallback nhưng theo dõi hoạt động nhàn rỗi của database thay vì CPU. Sử dụng điều này cho các nhiệm vụ bán quan trọng như cleanups không ảnh hưởng đến tốc độ của các tác vụ quan trọng.

```
myDatabase.requestIdlePromise().then(() => {
    // this will run at the moment the database has nothing else to do
    myCollection.customCleanupFunction();
});

// with timeout
myDatabase.requestIdlePromise(1000 /* time in ms */).then(() => {
    // this will run at the moment the database has nothing else to do
    // or the timeout has passed
    myCollection.customCleanupFunction();
});
```

    8. destroy()
    	- Giúp giải phóng bộ nhớ và ngừng tất cả các observable và replications. Return một promise sẽ resolve khi database bị destroy.

```
await myDatabase.destroy();
```

    9. remove()
    	- Xoá  database và xóa tất cả data của nó khỏi storage.

```
await myDatabase.remove();
// database is now gone

// NOTICE: You can also remove a database without its instance
import { removeRxDatabase } from 'rxdb';
removeRxDatabase('mydatabasename', 'localstorage');
```

    10. checkAdapter()
    	- Check xem adapter của PouchDB đã cho có thể được sử dụng với RxDB trong môi trường hiện tại hay không.

```
// must be imported from the pouchdb plugin
import {
    checkAdapter
} from 'rxdb/plugins/pouchdb';

const ok = await checkAdapter('idb');
console.dir(ok); // true on most browsers, false on nodejs
```

    11. isRxDatabase
    	- Trả về true nếu object đã cho là instance của RxDatabase. Trả về false nếu không.

```
import { isRxDatabase } from 'rxdb';
const is = isRxDatabase(myObj);
```

V. RxSchema

- Schema để định nghĩa ra structure của một document trong một collection sẽ trông như thế nào, nó giúp cho việc như xác định xem field nào là primary key hay field nào được sử dụng làm index hay field nào nên được encrypted (được mã hoá), v.v... Mỗi collection sẽ có một schema riêng biệt và với RxDB schema sẽ được định nghĩa dựa trên json-schema tiêu chuẩn.
- Example : trong ví dụ này chúng ta sẽ định nghĩa ra schema cho hero-collection với các setting sau:
  - Version-number của schema là 0.
  - Property name field là primaryKey => name : unique, indexed, required string => có thể dùng để find một document.
  - Property color field là required cho mỗi document.
  - Property healthpoints field là một number nằm trong khoảng từ 0 -> 100.
  - Property secret field sẽ được encrypted (được mã hoá).
  - Property birthyear field với keyword final nghĩa là sẽ không thể thay đổi và field này là required với number tối thiểu là 1900 không quá 2050.
  - Property skill field là một mảng các object có property là name và damage mảng này chỉ có tối đa 5 item.
  - attachments là cho phép thêm một tệp đính kèm và store chúng dưới dạng encrypted (được mã hoá).

```
{
    "title": "hero schema",
    "version": 0,
    "description": "describes a simple hero",
    "primaryKey": "name",
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "maxLength": 100 // <- the primary key must have set maxLength
        },
        "color": {
            "type": "string"
        },
        "healthpoints": {
            "type": "number",
            "minimum": 0,
            "maximum": 100
        },
        "secret": {
            "type": "string"
        },
        "birthyear": {
            "type": "number",
            "final": true,
            "minimum": 1900,
            "maximum": 2050
        },
        "skills": {
            "type": "array",
            "maxItems": 5,
            "uniqueItems": true,
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "damage": {
                        "type": "number"
                    }
                }
            }
        }
    },
    "required": [
        "name",
        "color"
    ],
    "encrypted": ["secret"],
    "attachments": {
        "encrypted": true
    }
  }

```

- Tạo một collection với schema đã được định nghĩa :

```
await myDatabase.addCollections({
    heroes: {
        schema: myHeroSchema
    }
});
console.dir(myDatabase.heroes.name);
// heroes
```

- version
  - Version field là number, bắt đầu từ 0. Khi version lớn hơn 0, bạn phải cung cấp migrationStrategies để tạo một collection với schema này.
- primaryKey
  - PrimaryKey field chứa fieldname của property sẽ được sử dụng làm primary key cho toàn bộ document trong một collection. Value của primary key của một document phải là một string , unique, final and is required.
- composite primary key
  - Bạn có thể xác định một composite primary key (khóa chính tổng hợp) được tạo từ nhiều property của document data.

```
const mySchema = {
  keyCompression: true, // set this to true, to enable the keyCompression
  version: 0,
  title: 'human schema with composite primary',
  primaryKey: {
      // where should the composed string be stored
      key: 'id',
      // fields that will be used to create the composed key
      fields: [
          'firstName',
          'lastName'
      ],
      // separator which is used to concat the fields values.
      separator: '|'
  }
  type: 'object',
  properties: {
      id: {
          type: 'string',
          maxLength: 100 // <- the primary key must have set maxLength
      },
      firstName: {
          type: 'string'
      },
      lastName: {
          type: 'string'
      }
  },
  required: [
    'id',
    'firstName',
    'lastName'
  ]
};
```

    - Và bạn có thể tìm được một document bằng cách sử dụng các field liên quan đến nhau để tạo ra composite primaryKey (khoá chính tổng hợp).

```
// inserting with composite primary
await myRxCollection.insert({
    // id, <- do not set the id, it will be filled by RxDB
    firstName: 'foo',
    lastName: 'bar'
});

// find by composite primary
const id = myRxCollection.schema.getPrimaryOfDocumentData({
    firstName: 'foo',
    lastName: 'bar'
});
const myRxDocument = myRxCollection.findOne(id).exec();
```

- Indexes
  - RxDB có support secondary indexes (chỉ mục phụ) được xác định ở schema-level của collection. Index chỉ chấp nhận các type field sau : string, integer, và number nhưng cũng có một vài RxStorage cho phép sử dụng type là boolean. Tùy thuộc vào field type, bạn phải đặt một số attribute meta như maxLength hoặc minimum, điều này là bắt buộc để RxDB có thể biết độ dài chuỗi tối đa của một field là bao nhiêu. Độ dài này cần thiết để tạo các custom index trên một vài RxStorage implementation.
  - NOTICE: RxDB sẽ luôn add PrimaryKey vào tất cả các index để đảm bảo thứ tự sắp xếp của các query results. Bạn không phải thêm primaryKey vào bất kỳ index nào.

```
const schemaWithIndexes = {
  version: 0,
  title: 'human schema with indexes',
  keyCompression: true,
  primaryKey: 'id',
  type: 'object',
  properties: {
      id: {
          type: 'string',
          maxLength: 100 // <- the primary key must have set maxLength
      },
      firstName: {
          type: 'string',
          maxLength: 100 // <- string-fields that are used as an index, must have set maxLength.
      },
      lastName: {
          type: 'string'
      },
      active: {
          type: 'boolean'
      }
      familyName: {
          type: 'string'
      },
      balance: {
          type: 'number',

          // number fields that are used in an index, must have set minium, maximum and multipleOf
          minimum: 0,
          maximum: 100000,
          multipleOf: '0.01'
      }
      creditCards: {
          type: 'array',
          items: {
              type: 'object',
              properties: {
                    cvc: {
                        type: 'number'
                    }
              }
          }
      }
  },
  required: [
      'id',
      'active' // <- boolean fields that are used in an index, must be required.
  ],
  indexes: [
    'firstName', // <- this will create a simple index for the `firstName` field
    ['active', 'firstName'], // <- this will create a compound-index for these two fields
    'active'
  ]
};
```

- attachments
  - Để sử dụng attachment trong collection, bạn phải add attachments-attribute vào schema.
- default
  - Giá trị mặc định chỉ có thể được xác định cho các first-level (cấp một) field. Bất cứ khi nào bạn insert một document các field chưa set sẽ được set bằng các giá trị mặc định.

```
const schemaWithDefaultAge = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
      id: {
          type: 'string',
          maxLength: 100 // <- the primary key must have set maxLength
      },
      firstName: {
          type: 'string'
      },
      lastName: {
          type: 'string'
      },
      age: {
          type: 'integer',
          default: 20       // <- default will be used
      }
  },
  required: ['id']
};
```

- final
  - Khi bạn setting cho một field với keyword là final thì field đó sẽ không được sửa hay thay đổi. Final field sẽ luôn required và final field sẽ không thể observable vì nó không thể thay đổi. Lợi ích của điều này sẽ giúp cho việc đảm bảo không ai có thể (vô tình hay cố ý) thay đổi field data của document đã set là final.

```
const schemaWithFinalAge = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
      id: {
          type: 'string',
          maxLength: 100 // <- the primary key must have set maxLength
      },
      firstName: {
          type: 'string'
      },
      lastName: {
          type: 'string'
      },
      age: {
          type: 'integer',
          final: true
      }
  },
  required: ['id']
};
```

- NOTICE: Không phải mọi thứ trong thông số của json-schema đều được phép

  - Schema không chỉ được sử dụng để validate các object trước khi chúng được ghi vào database, mà còn được sử dụng để map các getters để observe (quan sát) và populate single fieldnames, key compression and một số thứ khác. Vì thế bạn không thể sử hết tất cả các schema để valid cho thông số (spec) của json-schema.org. Ví dụ: tên trường phải khớp với regex ^ [a-zA-Z] [[a-zA-Z0-9 _] \*]? [A-zA-Z0-9] $ và additionalProperties luôn được đặt thành false. Điều này RxDB sẽ ngay lập tức throw ra một lỗi khi bạn pass một schema invalid vào đó.

- Schema Validation

  - RxDB có nhiều validation implementations có thể được sử dụng để đảm bảo rằng data của document luôn phải khớp với schema JSON được cung cấp cho RxCollection. Schema validation không phải là một plugin mà nó sẽ wrapper xung quanh RxStorage và sau đó nó sẽ validate tất cả data được ghi vào storage đó. Điều này là bắt buộc vì lý do sau:
    - Nó cho phép chúng ta chạy validation bên trong Worker RxStorage thay vì chạy nó trong main JavaScript process.
    - Nó cho phép chúng ta configure (cấu hình) cho RxDatabase instance nào phải sử dụng validation và instance nào không. Trong môi trường production, việc validate data của user thường phải cần thiết, nhưng bạn có thể không cần validate cho data khi lấy từ backend.
  - Lưu ý : Việc validation cho Schema có thể tốn kém CPU và làm tăng size của app. Vì thế bạn nên sử dụng validation cho schema trong môi trường development thôi không nên sử dụng nó trong môi trường production để có performance tốt nhất.
  - Khi không sử dụng validation, mọi data của document có thể được bảo mật an toàn nhưng có thể có hành vi không xác định (undefined behavior) khi lưu data không tuân theo schema của RxCollection.
  - RxDB có nhiều cách implementation khác nhau để validate data, mỗi cách trong số chúng dựa trên một Json Schema library khác nhau. Trong schema, chúng ta sẽ sử dụng Dexie.js RxStorage, nhưng bạn có thể wrap validation xung quanh bất kỳ RxStorage nào khác.
  - validate-ajv

    - validation-module đang sử dụng là ajv để validation nó nhanh hơn và sẽ tương thích tốt hơn với jsonschema-standart nhưng sẽ làm cho build-size lớn hơn.

```
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { getRxStorageDexie } from 'rxdb/plugins/dexie';

// wrap the validation around the main RxStorage
const storage = wrappedValidateAjvStorage({
    storage: getRxStorageDexie()
});

const db = await createRxDatabase({
    name: randomCouchString(10),
    storage
});
```

    - validate-z-schema

    	- Cả is-my-json-valid và validate-ajv đều sử dụng eval () để thực hiện để validation mà có thể bạn không muốn khi 'unsafe-eval' không được phép trong Content Security Policies (Chính sách bảo mật nội dung)  => validate-z-schema sử dụng z-schema làm trình xác thực không sử dụng eval.

```
import { wrappedValidateZSchemaStorage } from 'rxdb/plugins/validate-z-schema';
import { getRxStorageDexie } from 'rxdb/plugins/dexie';

// wrap the validation around the main RxStorage
const storage = wrappedValidateZSchemaStorage({
    storage: getRxStorageDexie()
});

const db = await createRxDatabase({
    name: randomCouchString(10),
    storage
});
```

VII. RxCollection

- Một collection sẽ lưu trư các document có cùng type.
- Tạo một collection
  - Để tạo ra một hoặc nhiều collection bạn cần phải có một RxDB object cùng với phương thức .addCollections () tất cả các collection cần có name và một valid RxJsonSchema. Các attributes khác là optional (tùy chọn).

```
const myCollections = await myDatabase.addCollections({
  // key = collectionName
  humans: {
    schema: mySchema,
    statics: {},                          // (optional) ORM-functions for this collection
    methods: {},                          // (optional) ORM-functions for documents
    attachments: {},                      // (optional) ORM-functions for attachments
    options: {},                          // (optional) Custom parameters that might be used in plugins
    migrationStrategies: {},              // (optional)
    autoMigrate: true,                    // (optional) [default=true]
    cacheReplacementPolicy: function(){}, // (optional) custom cache replacement policy
  },
  // Bạn có thể tạo nhiều hơn một collection ở đây
  animals: {
    // ...
  }
});
```

- name
  - Name là một unique string và là identify của một collection, hai collection khác nhau trong cùng một database không được phép có name trùng nhau, name collection phải khớp với regex sau: ^ [a-z] [a-z0-9] \* $.
- schema
  - Schema sẽ define ra structure của document trong collection. RxDB sử dụng schema format, tương tự như Json schema.
- ORM function
  - Với các tham số static, methods và attachments , bạn có thể xác định ORM-function được áp dụng cho từng object thuộc collection này.
- Migration
  - Với các tham số migrationStrategies và autoMigrate, bạn có thể chỉ định cách thực hiện việc di chuyển giữa schema version với nhau.
- Lấy một collection từ Database
  - Để lấy một collection đang có trong database:

```
// newly created collection
const collections = await db.addCollections({
  heroes: {
    schema: mySchema
  }
});
const collection2 = db.heroes;
console.log(collections.heroes === collection2); //> true
```

- Functions
  - Observe $
    - Sẽ return RxJs observable => streams cho tất cả mỗi thay đổi data của collection.

```
myCollection.$.subscribe(changeEvent => console.dir(changeEvent));

// you can also observe single event-types with insert$ update$ remove$
myCollection.insert$.subscribe(changeEvent => console.dir(changeEvent));
myCollection.update$.subscribe(changeEvent => console.dir(changeEvent));
myCollection.remove$.subscribe(changeEvent => console.dir(changeEvent));
```

    - Inser()
    	- Sử dụng function này để insert một document mới vào database. Collection sẽ validate schema và tự động encrypt (mã hoá) các field-encrypt và return một RxDocument mới sau khi thành công.

```
const doc = await myCollection.insert({
  name: 'foo',
  lastname: 'bar'
});
```

    - bulkInsert()
    	- Khi bạn phải insert nhiều document cùng một lúc, hãy sử dụng function này. Điều này nhanh hơn nhiều so với việc gọi .insert () nhiều lần. Sau khi thành công sẽ return về một object có hai field là hai mảng success và error
    	- Lưu ý:  bulInsert() sẽ không fail khi update conflicts và ta không thể biết tại sao nó fail, chỉ biết khi các document không được insert vào database.

```
const result = await myCollection.bulkInsert([{
  name: 'foo1',
  lastname: 'bar1'
},
{
  name: 'foo2',
  lastname: 'bar2'
}]);

// > {
//   success: [RxDocument, RxDocument],
//   error: []
// }
```

    - bulkRemove()
    	- Khi bạn muốn remove nhiều document cùng một lúc, hãy sử dụng function bulkRemove sau khi thành công sẽ return về một object có hai field là hai array success và error

```
const result = await myCollection.bulkRemove([
  'primary1',
  'primary2'
]);

// > {
//   success: [RxDocument, RxDocument],
//   error: []
// }
```

    - upsert()
    	- Function này sẽ insert một document vào trong collection nếu nó không tồn tại và sẽ overwrite nếu nó đã tồn tại trong collection. Return về một RxDocument nếu insert thành công hoặc overwrite thành công.

```
const doc = await myCollection.upsert({
  name: 'foo',
  lastname: 'bar2'
});
```

    - bulkUpsert()
    	- Tương tự như upsert() nhưng có thể insert/overwrite một lúc nhiều document => function này giúp sẽ cải thiện performance hơn so với chạy nhiều upsert(). Return về một array RxDocument.

```
const docs = await myCollection.bulkUpsert([
  {
    name: 'foo',
    lastname: 'bar2'
  },
  {
    name: 'bar',
    lastname: 'foo2'
  }
]);
// > [RxDocument, RxDocument]
```

    - atomicUpset()
    	- Khi bạn run nhiều upsert operation trên cùng một RxDocument trong một khoảng thời gian rất ngắn, bạn có thể gặp một error là 409 Conflict. Điều này xảy ra vì bạn đang cố gắng chạy upsert() trên cùng một document, trong khi thao tác upert() trước đó vẫn đang chạy. Để tránh error này, bạn có thể run atomic upsert operation. Behavior của nó sẽ tương tự như RxDocument.atomicUpdate.

```
const docData = {
    name: 'Bob', // primary
    lastName: 'Kelso'
};

myCollection.upsert(docData);
myCollection.upsert(docData);
// -> throws because of parrallel update to the same document

myCollection.atomicUpsert(docData);
myCollection.atomicUpsert(docData);
myCollection.atomicUpsert(docData);

// wait until last upsert finished
await myCollection.atomicUpsert(docData);
// -> works
```

    - find()
    	- Dùng để find một document trong collection.

```
// find all that are older than 18
const olderDocuments = await myCollection
    .find()
    .where('age')
    .gt(18)
    .exec(); // execute
```

    - findOne()
    	- Method này sẽ thương tự như find() nhưng nó sẽ chỉ return về duy nhất một document, bạn có thể pass một value là primary key để tìm một document nó sẽ dễ dàng hơn.

```
// get document with name:foobar
myCollection.findOne({
  selector: {
    name: 'foo'
  }
}).exec().then(doc => console.dir(doc));

// get document by primary, functionally identical to above query
myCollection.findOne('foo')
  .exec().then(doc => console.dir(doc));
```

    - findByIds()
    		- Tìm nhiều document theo id (primary key). Cách này có performance tốt hơn so với việc chạy nhiều findOne () hoặc find () với một big $order selector. Return về một Map trong đó primary key của document được map tới document. Các document không exist hoặc deleted không nằm trong Map được return.
    		- Lưu ý:  Map do findByIds return sẽ không được đảm bảo sẽ return các phần tử theo thứ tự như danh sách id được chuyền.

```
const ids = [
  'alice',
  'bob',
  /* ... */
];
const docsMap = await myCollection.findByIds(ids);

console.dir(docsMap); // Map(2)
```

    - findByIds$()
    	- Tương tự như findByIds() nhưng trả về một Observable emit ra Map mỗi khi một value của nó changed do database ghi.
    - exportJSON()
    	- Sử dụng method này để export  tất cả data trong collection thành json.Trước khi sử dụng exportJSON () và importJSON (), bạn phải thêm plugin json-dump.

```
import { addRxPlugin } from 'rxdb';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
addRxPlugin(RxDBJsonDumpPlugin);

myCollection.exportJSON()
  .then(json => console.dir(json));
```

    - importJSON()
    	- Để import json dump (kết xuất json) vào collection của bạn, làm như sau:
    	- Lưu ý: Khi import cũng sẽ kích hoạt các event cho document khi được insert.

```
// import the dump to the database
myCollection.importJSON(json)
  .then(() => console.log('done'));
```

    - syncCouchDB()
    	- Method này giúp bạn replicate (sao chép ) data giữa các RxCollections, các instance của pouchdb hoặc các remote server hỗ trợ các giao thức đồng bộ (sync-protocol).
    - syncGraphQL()
    	- Method này giúp bạn replicate (sao chép ) data giữa các RxCollections và GraphQL endpoint.
    - remove()
    	- Remove tất cả data của collection và các version trước của collection, method này sẽ remove các document, schema và các schemaVersions cũ.

```
await myCollection.remove();
// collection hiện đã bị xóa và có thể được tạo lại
```

    - destroy()
    	- Method này giúp giải phóng bộ nhớ ( free up memory ) và stop tất cả các observing và replications (sao chép)

```
await myCollection.destroy();
```

    - isRxCollection
    	- return true nếu object đã cho là một instance của RxCollection. Trả về false nếu không.

```
const is = isRxCollection(myObj);
```

VIII. RxDocument

- Document là một single object (đối tượng duy nhất) được store trong một collection. Nó tương đương với một single record (bản ghi duy nhất) trong một table trong relationship database.
- insert
  - Để insert một document vào một collection, bạn phải gọi function .insert () - của collection như sau:

```
myCollection.insert({
  name: 'foo',
  lastname: 'bar'
});
```

- find
  - Để tìm document trong một collection, bạn phải gọi hàm .find () - của collection như sau:

```
myCollection.find().exec() // <- find all documents
  .then(documents => console.dir(documents));
```

- Functions
  - get()
    - Method này sẽ nhận được một single field (trường duy nhất) của document. Nếu field được mã hóa (encrypted), nó sẽ được tự động giải mã (decrypted) trước khi return.

```
var name = myDocument.get('name'); // returns the name
```

    - get$()
    	- Method này trả về một observable của paths-value (giá trị-đường dẫn). Value hiện tại của path (đường dẫn) này sẽ được emit (phát) ra mỗi document thay đổi.

```
// get the live-updating value of 'name'
var isName;
myDocument.get$('name')
  .subscribe(newName => {
    isName = newName;
  });

await myDocument.atomicPatch({name: 'foobar2'});
console.dir(isName); // isName is now 'foobar2'
```

    - proxy-get
    	- Tất cả các property của RxDocument được gán dưới dạng getters nên bạn cũng có thể access trực tiếp vào các value thay vì sử dụng hàm get ().

```
// tương tự như myDocument.get('name');
  var name = myDocument.name;
  // Có thể nhận các giá trị lồng nhau.
  var nestedValue = myDocument.whatever.nestedfield;

  // cũng có thể sử dụng được với observable
  myDocument.firstName$.subscribe(newName => console.log('name is: ' + newName));
  // > 'name is: Stefe'
  await myDocument.atomicPatch({firstName: 'Steve'});
  // > 'name is: Steve'
```

    - update()
    	- Update một document dựa trên syntax của mongodb-update dựa trên modifyjs

```
/**
 * Nếu chưa add plugin trước đó, bạn phải add thêm update plugin
 */
import { addRxPlugin } from 'rxdb';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
addRxPlugin(RxDBUpdatePlugin);

await myDocument.update({
    $inc: {
        age: 1 // tăng field age lên 1
    },
    $set: {
        firstName: 'foobar' // set firstName thành foobar.
    }
});
```

    - atomicUpdate()
    	- Khác với update (), atomicUpdate() sẽ đảm bảo không xảy ra error 409 conflicts ( điều này xảy ra khi method update() sẽ làm thay đổi value hiện tại của một document và trả về một value mới)

```
const changeFunction = (oldData) => {
    oldData.age = oldData.age + 1;
    oldData.name = 'foooobarNew';
    return oldData;
}
await myDocument.atomicUpdate(changeFunction);
console.log(myDocument.name); // 'foooobarNew'
```

    - atomicPatch()
    	- Hoạt động giống như atomUpdate nhưng ghi đè (overwrite) các attribute đã cho lên data của document.

```
await myDocument.atomicPatch({
  name: 'Steve',
  age: undefined // setting một attribute là undefined thì đồng nghĩa với việc xoá nó.
});
console.log(myDocument.name); // 'Steve'
```

    - Observer$
    	- Method này sẽ trả về một RxJs Observable và sẽ emit ra tất cả các change-Event của document này.

```
// get all changeEvents
myDocument.$
  .subscribe(changeEvent => console.dir(changeEvent));
```

    - remove()
    	- Method này sẽ remove một document khỏi collection.
    	- Lưu ý method này sẽ không xóa document hoàn toàn khỏi store thay vào đó nó sẽ set _deleted: true.

```
myDocument.remove();
```

    - delete$
    	- Emit ra boolean value bất cứ khi nào RxDocument bị delete hay chưa.

```
let lastState = null;
myDocument.deleted$.subscribe(state => lastState = state);

console.log(lastState);
// false

await myDocument.remove();

console.log(lastState);
// true
```

    - get deleted
    	- Getter để lấy value hiện tại của delete$.

```
console.log(myDocument.deleted);
// false

await myDocument.remove();

console.log(myDocument.deleted);
// true
```

    - toJSON()
    	- Trả về data của document dưới dạng json object (immutable object) . Nếu bạn muốn sửa đổi gì đó của object hãy sử dụng method toMutableJSON() thay thế.

```
const json = myDocument.toJSON();
console.dir(json);
/* { passportId: 'h1rg9ugdd30o',
  firstName: 'Carolina',
  lastName: 'Gibson',
  age: 33 ...
*/
```

    	- Bạn cũng có thể đặt withMetaFields: true để lấy ra các field meta như là reversion, attachments ( tệp đính kèm) hay deleted flag.

```
const json = myDocument.toJSON(true);
console.dir(json);
/* { passportId: 'h1rg9ugdd30o',
  firstName: 'Carolina',
  lastName: 'Gibson',
  _deleted: false,
  _attachments: { ... },
  _rev: '1-aklsdjfhaklsdjhf...'
*/
```

    - toMutableJSON()
    	- Tương tự như toJSON () nhưng trả về một object có thể mutable. Điều này sẽ ảnh hưởng nhiều đến performance nên hãy sử dụng nó khi cần thiết.

```
const json = myDocument.toMutableJSON();
json.firstName = 'Alice'; // The returned document can be mutated
```

    - isRxDocument

    	- Trả về true nếu object đã cho là instance của RxDocument. Trả về false nếu không.

```
const is = isRxDocument(myObj);
```

- LƯU Ý: Tất cả các METHOD của RxDocument đều bị ràng buộc với Instance
  IX. RxQuery
- Một query giúp ta tìm document trong collection, giống như hầu hết các database noSQL khác, RxDB sử dụng mango-query-syntax nên cũng có thể sử dụng các chained method (chuỗi) cùng với query-builder plugin
- find()
  - Để tạo một RxQuery cơ bản chúng ta dùng method find () của collection và insert các selector như sau.

```
// tìm tất cả người có tuổi lớn hơn 18
const query = myCollection
    .find({
      selector: {
        age: {
          $gt: 18
        }
      }
    });
```

- findOne()
  - Một findOne-query sẽ trả về một RxDocument hoặc null nếu không tìm thấy.

```
// tìm người có tên là alice
const query = myCollection
    .findOne({
      selector: {
        name: 'alice'
      }
    });

// tìm người trẻ nhất
const query = myCollection
    .findOne({
      selector: {},
      sort: [
        {age: 'asc'}
      ]
    });

// tìm một document sử dụng primary key
const query = myCollection.findOne('foobar');
```

- exec()
  - Trả về một Promise => resolves với result-set của truy vấn.

```
const query = myCollection.find();
const results = await query.exec();
console.dir(results); // > [RxDocument,RxDocument,RxDocument..]
```

- Query Builder
  - Để sử dụng các query method theo chuỗi, bạn có thể sử dụng query-builder plugin như sau:

```
// thêm query builder plugin
import { addRxPlugin } from 'rxdb';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
addRxPlugin(RxDBQueryBuilderPlugin);

// Bây giờ bạn có thể nối chuỗi query methods
const query = myCollection.find().where('age').gt(18);
```

- Observe $
  - Hoạt động tương tự như các Observer$ trên.

```
const query = myCollection.find();
const querySub = query.$.subscribe(results => {
    console.log('got results: ' + results.length);
});
// > 'got results: 5'   // -> BehaviorSubjects phát ra khi đăng ký
await myCollection.insert({/* ... */}); // -> insert one
// > 'got results: 6'   //-> $.subscribe() được gọi lại với kết quả mới

// -> stop watching this query
querySub.unsubscribe()
```

- update()
  - Cập nhật hết tất cả RxDocument của kết quả truy vấn.

```
//để sử dụng update() method, bạn cần add update plugin.
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
addRxPlugin(RxDBUpdatePlugin);

const query = myCollection.find({
  selector: {
    age: {
      $gt: 18
    }
  }
});
await query.update({
    $inc: {
        age: 1 //tăng tuổi của các document được tìm thấy lên 1
    }
});
```

- remove()
  - Xóa tất cả các document tìm thấy và trả về promise -> resolves cho các document đã xóa.

```
// tìm tất cả các documentcó độ tuổi dưới 18
const query = myCollection.find({
  selector: {
    age: {
      $lt: 18
    }
  }
});
// xoá các document này khỏi collection.
const removedDocs = await query.remove();
```

- doesDocumentDataMatch()
  - Trả về true nếu data của document đã cho khớp với truy vấn.

```
const documentData = {
  id: 'foobar',
  age: 19
};

myCollection.find({
  selector: {
    age: {
      $gt: 18
    }
  }
}).doesDocumentDataMatch(documentData); // > true

myCollection.find({
  selector: {
    age: {
      $gt: 20
    }
  }
}).doesDocumentDataMatch(documentData); // > false
```

- Setting a specific index
  - Trong quá trình lập planner cho query nếu dùng index mặc định chúng ta đã thiết lập trong schema điều này sẽ không phải lúc nào cũng được tối ưu vì vậy chúng ta có thể tối ưu performance bằng cách thiết lập index sao cho phù hợp với mỗi query.

```
const query = myCollection
    .findOne({
      selector: {
        age: {
          $gt: 18
        },
        gender: {
          $eq: 'm'
        }
      },
      /**
       * bởi vì chúng ta biết 50% document là male
       * chỉ 20% dưới 18 tuổi,
       * Nên khi sử dụng ['gender', 'age'] đễ làm index sẽ giúp cải thiện performance
       * This could not be known by the query planer which might have choosen ['age', 'gender'] instead.
       */
      index: ['gender', 'age']
    });
```

- Example
  - Dưới đây là một số ví dụ nhanh cách viết truy vấn các bạn có thể sử dụng nhiều, ngoài ra để có thể sử dụng nhiều hơn các bạn có thể vào :
  - Pouch-find-docs - học cách sử dụng mango-queries.
  - mquery-docs - tìm hiểu cách sử dụng chained-queries.

```
// directly pass search-object
myCollection.find({
  selector: {
    name: { $eq: 'foo' }
  }
})
.exec().then(documents => console.dir(documents));

// find by using sql equivalent '%like%' syntax
// This example will fe: match 'foo' but also 'fifoo' or 'foofa' or 'fifoofa'
myCollection.find({
  selector: {
    name: { $regex: '.*foo.*' }
  }
})
.exec().then(documents => console.dir(documents));

// find using a composite statement eg: $or
// This example checks where name is either foo or if name is not existant on the document
myCollection.find({
  selector: { $or: [ { name: { $eq: 'foo' } }, { name: { $exists: false } }] }
})
.exec().then(documents => console.dir(documents));

// do a case insensitive search
// This example will match 'foo' or 'FOO' or 'FoO' etc...
var regexp = new RegExp('^foo$', 'i');
myCollection.find({
  selector: { name: { $regex: regexp } }
})
.exec().then(documents => console.dir(documents));

// chained queries
myCollection.find().where('name').eq('foo')
.exec().then(documents => console.dir(documents));
```

- LƯU Ý: RxDB sẽ luôn thêm khóa chính vào các tham số sắp xếp
  - Bởi vì RxDB là một reactive database, chúng ta có thể thực hiện heavy performance-optimisation (tối ưu hóa hiệu suất cao) trên các kết quả truy vấn thay đổi theo thời gian. Để có thể làm được điều này, RxQuery phải là bất biến (immutable). Điều này có nghĩa là, khi có RxQuery và chạy .where () trên đó, thì RxQuery-Object ban đầu sẽ không bị thay đổi. Thay vào đó, hàm where trả về một RxQuery-Object mới với where-field đã thay đổi. Hãy lưu ý điều này nếu bạn tạo RxQuery và thay đổi chúng sau đó.
  - Bạn có thể theo dõi ví dụ sau:

```
const queryObject = myCollection.find().where('age').gt(18);
// Creates a new RxQuery object, does not modify previous one
queryObject.sort('name');
const results = await queryObject.exec();
console.dir(results); // result-documents are not sorted by name

const queryObjectSort = queryObject.sort('name');
const results = await queryObjectSort.exec();
console.dir(results); // result-documents are now sorted
```

- isRxQuery
  - Trả về true nếu đối tượng đã cho là một instance của RxQuery. Trả về false nếu không.

```
const is = isRxQuery(myObj);
```

X. RxAttachment

- Attachment (tệp đính kèm) là tệp dữ liệu nhị phân có thể được đính kèm vào RxDocument nó giống như tệp được đính kèm vào email, sử dụng tệp đính kèm thay vì thêm dữ liệu vào document thông thường sẽ đảm bảo rằng vẫn có hiệu suất tốt khi truy vấn và viết document thậm chí ngay cả khi phải lưu trữ một lượng lớn dữ liệu, chẳng hạn như tệp hình ảnh.
  1.  Bạn có thể lưu trữ chuỗi (string), tệp nhị phân (binary files), hình ảnh và bất cứ thứ gì bạn muốn song song với document.
  2.  Các document đã xóa sẽ tự động mất tất cả dữ liệu tệp đính kèm của chúng.
  3.  Không phải tất cả các replication plugin đều hỗ trợ sao chép các tệp đính kèm.
  4.  Các tệp đính kèm có thể được mã hóa (encrypted) khi lưu trữ.
- Add attachments plugin.
  - Để làm được bạn phải thêm attachments plugin tệp đính kèm như sau:

```
import { addRxPlugin } from 'rxdb';
import { RxDBAttachmentsPlugin } from 'rxdb/plugins/attachments';
addRxPlugin(RxDBAttachmentsPlugin);
```

- Enable attachments in the schema

  - Trước khi có thể sử dụng tệp đính kèm, bạn phải đảm bảo rằng đối tượng-tệp đính kèm được đặt trong schema của RxCollection của bạn. Ví dụ:

```

const mySchema = {
    version: 0,
    type: 'object',
    properties: {
        // .
        // .
        // .
    },
    attachments: {
        encrypted: true // if true, the attachment-data will be encrypted with the db-password
    }
};

const myCollection = await myDatabase.addCollections({
    humans: {
        schema: mySchema
    }
});
```

- putAttachment()
  - Thêm tệp đính kèm vào RxDocument và trả về promise với tệp đính kèm mới. Ví dụ

```
const attachment = await myDocument.putAttachment(
    {
        id,     // (string) name of the attachment like 'cat.jpg'
        data,   // (string|Blob|Buffer) data of the attachment
        type    // (string) type of the attachment-data like 'image/jpeg'
    },
    true // (boolean, optional, default=true) skipIfSame:If true and attachment already exists with same data, the write will be skipped
);
```

- getAttachment()
  - Trả về RxAttachment theo id của nó. Trả về null khi tệp đính kèm không tồn tại.

```
const attachment = myDocument.getAttachment('cat.jpg');
```

- allAttachments()
  - Trả về một mảng tất cả các tệp đính kèm của RxDocument.

```
const attachments = myDocument.allAttachments();
```

- allAttachments$
  - Nhận một Observable emit ra một steam tất cả các tệp đính kèm từ document. Re-emit mỗi khi tệp đính kèm được thêm vào hoặc xóa khỏi RxDocument.

```
const all = [];
myDocument.allAttachments$.subscribe(
    attachments => all = attachments
);
```

- RxAttachment
  - Các tệp đính kèm của RxDB là kiểu RxAttachment có các attribute / method sau:
    1. doc
       - RxDocument mà tệp đính kèm được chỉ định.
    2. id
       - Id dưới là chuỗi (string) của tệp đính kèm.
    3. type
       - Type là chuỗi (string) của tệp đính kèm.
    4. length
       - Length của data của tệp đính kèm là dạng số (number).
    5. digest
       - Md5-sum của data tệp đính kèm dưới là chuỗi (string).
    6. rev
       1. Revision-number của tệp đính kèm là số (number).
    7. remove()
       - Xóa tệp đính kèm. Trả về một Promise -> resolves khi hoàn tất. Ví dụ :

```
const attachment = myDocument.getAttachment('cat.jpg');
await attachment.remove();
```

    	1. getData()
    		- Trả về một Promise ->  resolves dữ liệu của tệp đính kèm dưới dạng Blob hoặc Buffer. (không đồng bộ - async). Ví dụ :

```
const attachment = myDocument.getAttachment('cat.jpg');
const blobBuffer = await attachment.getData();
```

    	1. getStringData()
    		- Trả về một Promise -> resolves dữ liệu của tệp đính kèm dưới dạng chuỗi. Ví dụ :

```
const attachment = await myDocument.getAttachment('cat.jpg');
const data = await attachment.getStringData();
```

XI. Middleware-hooks

- RxDB hỗ trợ middleware-hooks như mongoose. Middleware hook là các function dùng để control (kiểm soát) trong quá trình thực thi các function không đồng bộ và nó được xác định ở cấp RxCollection.
- Các hook này có thể được định nghĩa để chạy song song hoặc nối tiếp nhau và nó có thể dùng theo cách đồng bộ hoặc không đồng bộ -> chúng sẽ trả về một Promise ( để stop một hook, hãy throw ra error tại đó).
- RxDB sẽ hỗ trợ những hook sau:
  1.  preInsert ( trước khi insert )
  2.  postInsert ( sau khi insert)
  3.  preSave ( trước khi save )
  4.  postSave ( sau khi save )
  5.  preRemove ( trước khi remove )
  6.  postRemove ( sau khi remove )
  7.  postCreate ( sau khi create)
- Tại sao không có validate-hook?
  - Khác với mongoose, validation trên data của một document chỉ hoạt động trên các field khi có thay đổi đối với document đó. Tức là khi bạn đặt một giá trị cho lastName của RxDocument, thì validation sẽ chỉ chạy trên field đã thay đổi thôi chư không phải toàn bộ document do đó sẽ không cần thiết phải thêm các validate-hook khi một document được ghi vào database.
- Trường hợp sử dụng:
  - Middleware sẽ rất hữu ích để giảm thiểu hóa logic và tránh các block code không đồng bộ lồng nhau. Nó sẽ hữu ích trong các:
    1. complex validation ( validation phức tạp).
    2. removing dependent documents ( xoá bỏ phụ thuộc của các document ).
    3. asynchronous defaults ( các mặc định không đồng bộ ).
    4. asynchronous tasks that a certain action triggers ( các hành động kích hoạt để thực thiện nhiệm vụ không đồng bộ).
    5. triggering custom events (kích hoạt các custom event)
    6. notifications ( thông báo ).
- Cách sử dụng
  - Tất cả các hook đều nhận một plain data (dữ liệu thuần túy) làm tham số đầu tiên ngoại trừ preInsert nhận thêm RxDocument-instance làm tham số thứ hai. Nếu bạn muốn sửa đổi dữ liệu trong hook, hãy thay đổi các thuộc tính của tham số đầu tiên được truyền vào.
- Insert
  - lifecycle ( vòng đời của insert )
    - RxCollection.insert is called
    - preInsert series-hooks
    - preInsert parallel-hooks
    - schema validation runs
    - new document is written to database
    - postInsert series-hooks
    - postInsert parallel-hooks
    - event is emitted to RxDatabase and RxCollection
  - preInsert ( trước khi insert )

```
// series: liên tiếp nhau
myCollection.preInsert(function(plainData){
    // set age to 50 before saving
    plainData.age = 50;
}, false);

// parallel: song song
myCollection.preInsert(function(plainData){

}, true);

// async: bất đồng bộ
myCollection.preInsert(function(plainData){
  return new Promise(res => setTimeout(res, 100));
}, false);

// dừng thao tác insert
myCollection.preInsert(function(plainData){
  throw new Error('stop');
}, false);
```

    - postInsert ( sau khi insert )

```
// series: liên tiếp nhau
myCollection.postInsert(function(plainData, rxDocument){

}, false);

// parallel
myCollection.postInsert(function(plainData, rxDocument){

}, true);

// async: bất đồng bộ
myCollection.postInsert(function(plainData, rxDocument){
  return new Promise(res => setTimeout(res, 100));
}, false);
```

- Save

  - Hook-save nhận document đã được lưu.
  - lifecycle

    - RxDocument.save is called
    - preSave series-hooks
    - preSave parallel-hooks
    - updated document is written to database
    - postSave series-hooks
    - postSave parallel-hooks
    - event is emitted to RxDatabase and RxCollection

  - preSave ( trước khi save )

```
// series
myCollection.preSave(function(plainData, rxDocument){
    // modify anyField before saving
    plainData.anyField = 'anyValue';
}, false);

// parallel
myCollection.preSave(function(plainData, rxDocument){

}, true);

// async
myCollection.preSave(function(plainData, rxDocument){
  return new Promise(res => setTimeout(res, 100));
}, false);

// stop the save-operation
myCollection.preSave(function(plainData, rxDocument){
  throw new Error('stop');
}, false);
```

    - postSave ( sau khi save )

```
// series
myCollection.postSave(function(plainData, rxDocument){

}, false);

// parallel
myCollection.postSave(function(plainData, rxDocument){

}, true);

// async
myCollection.postSave(function(plainData, rxDocument){
  return new Promise(res => setTimeout(res, 100));
}, false);
```

- Remove

  - Remove-hook nhận document đã bị loại bỏ.
  - lifecycle

    - RxDocument.remove is called
    - preRemove series-hooks
    - preRemove parallel-hooks
    - deleted document is written to database
    - postRemove series-hooks
    - postRemove parallel-hooks
    - event is emitted to RxDatabase and RxCollection

  - preRemove ( trước khi remove )

```
// series
myCollection.preRemove(function(plainData, rxDocument){

}, false);

// parallel
myCollection.preRemove(function(plainData, rxDocument){

}, true);

// async
myCollection.preRemove(function(plainData, rxDocument){
  return new Promise(res => setTimeout(res, 100));
}, false);

// stop the remove-operation
myCollection.preRemove(function(plainData, rxDocument){
  throw new Error('stop');
}, false);
```

    - postRemove ( sau khi remove )

```
// series
myCollection.postRemove(function(plainData, rxDocument){

}, false);

// parallel
myCollection.postRemove(function(plainData, rxDocument){

}, true);

// async
myCollection.postRemove(function(plainData, rxDocument){
  return new Promise(res => setTimeout(res, 100));
}, false);
```

- postCreate

  - Hook này được gọi bất cứ khi nào một RxDocument được tạo ra. Bạn có thể sử dụng postCreate để sửa đổi tất cả các RxDocument-instance của collection. Điều này giúp bạn có thể linh hoạt để thêm hành vi (behavior) chỉ định vào tất cả các document. Bạn cũng có thể sử dụng nó để thêm custom getter / setter vào document
  - Lưu ý : PostCreate-hooks không thể sử dụng bất đồng bộ.

```
myCollection.postCreate(function(plainData, rxDocument){
    Object.defineProperty(rxDocument, 'myField', {
        get: () => 'foobar',
    });
});

const doc = await myCollection.findOne().exec();

console.log(doc.myField);
// 'foobar'
```

    - Lưu ý: hook này không chạy trên các document đã được tạo hoặc đã lưu trong bộ nhớ cache.

XII. ORM/DRM ( Object-Data-Relational-Mapping )

- Giống như mongoose, RxDB có ORM-capabilities có thể được sử dụng để thêm hành vi (behavior) cụ thể vào document và collection.
- statics

  - Static được xác định trên toàn bộ collection và có thể được gọi trực tiếp trên collection.

- Add statics to a collection

  - Để thêm các static function, bạn hãy truyền một static objection khi bạn tạo collection của mình. Object này sẽ chứa các function được map với tên của chúng. Ví dụ:

```
const heroes = await myDatabase.addCollections({
  heroes: {
    schema: mySchema,
    statics: {
      scream: function(){
          return 'AAAH!!';
      }
    }
  }
});

console.log(heroes.scream());
// 'AAAH!!'
```

    - Bạn cũng có thể sử dụng từ khóa this-keyword để resolve cho collection. Ví dụ:

```
const heroes = await myDatabase.addCollections({
  heroes: {
    schema: mySchema,
    statics: {
      whoAmI: function(){
          return this.name;
      }
    }
  }
});
console.log(heroes.whoAmI());
// 'heroes'
```

- instance-methods

  - Instance-method được xác định trên tất cả các collection. Chúng có thể gọi trên RxDocuments của collection.
  - Add instance-methods to a collection

```
const heroes = await myDatabase.addCollections({
  heroes: {
    schema: mySchema,
    methods: {
      scream: function(){
        return 'AAAH!!';
      }
    }
  }
});
const doc = await heroes.findOne().exec();
console.log(doc.scream());
// 'AAAH!!'
```

    - Ở đây bạn cũng có thể sử dụng this-keyword ví dụ:

```
const heroes = await myDatabase.addCollections({
  heroes: {
    schema: mySchema,
    methods: {
      whoAmI: function(){
          return 'I am ' + this.name + '!!';
      }
    }
  }
});
await heroes.insert({
  name: 'Skeletor'
});
const doc = await heroes.findOne().exec();
console.log(doc.whoAmI());
// 'I am Skeletor!!'
```

    - attachment-methods

    	- Attachment-methods được xác định trên toàn bộ collection. Chúng có thể được gọi trên RxAttachemnts của RxDocuments của collection ví dụ:

```
const heroes = await myDatabase.addCollections({
  heroes: {
    schema: mySchema,
    attachments: {
      scream: function(){
          return 'AAAH!!';
      }
    }
  }
});
const doc = await heroes.findOne().exec();
const attachment = await doc.putAttachment({
    id: 'cat.txt',
    data: 'meow I am a kitty',
    type: 'text/plain'
});
console.log(attachment.scream());
// 'AAAH!!'
```

XIII. Population

- Bạn có thể chỉ định một mối quan hệ từ một RxDocument đến một RxDocument khác trong cùng một RxCollection khác của cùng một database. Tiếp đó, bạn có thể nhận được document được tham chiếu với population-getter. ( Hoạt động tương tự như population trong mongoose ).
- Schema with ref

  - Từ khóa ref trong các properties mô tả collection mà field-value thuộc về (có quan hệ).

```
export const refHuman = {
    title: 'human related to other human',
    version: 0,
    primaryKey: 'name',
    properties: {
        name: {
            type: 'string'
        },
        bestFriend: {
            ref: 'human',     // refers to collection human
            type: 'string'    // ref-values must always be string or ['string','null'] (primary of foreign RxDocument)
        }
    }
};
```

    - Bạn cũng có thể có một-nhiều reference bằng cách sử dụng string-array ví dụ:

```
export const schemaWithOneToManyReference = {
  version: 0,
  primaryKey: 'name',
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    friends: {
      type: 'array',
      ref: 'human',
      items: {
        type: 'string'
      }
    }
  }
};
```

- populate()

  - via method ( thông qua method )

    - Để lấy referred RxDocument, bạn hãy dùng method populate () , nó nhận field-path như là một attribute và trả về một Promise sẽ resolve thành foreign document hoặc null nếu không tìm thấy. ví dụ :

```
await humansCollection.insert({
  name: 'Alice',
  bestFriend: 'Carol'
});
await humansCollection.insert({
  name: 'Bob',
  bestFriend: 'Alice'
});
const doc = await humansCollection.findOne('Bob').exec();
const bestFriend = await doc.populate('bestFriend');
console.dir(bestFriend); //> RxDocument[Alice]
```

    - via getter ( thông qua getter )

    	- Bạn cũng có thể nhận được populated RxDocument với getter một cách trực tiếp nhưng bạn phải thêm hậu tố gạch dưới _ vào tên fieldname ( nó cũng đúng trên cả các giá trị lồng nhau ). Ví dụ:

```
await humansCollection.insert({
  name: 'Alice',
  bestFriend: 'Carol'
});
await humansCollection.insert({
  name: 'Bob',
  bestFriend: 'Alice'
});
const doc = await humansCollection.findOne('Bob').exec();
const bestFriend = await doc.bestFriend_; // notice the underscore_
console.dir(bestFriend); //> RxDocument[Alice]
```

    - Example with nested reference

```
const myCollection = await myDatabase.addCollections({
  human: {
    schema: {
      version: 0,
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        family: {
          type: 'object',
          properties: {
            mother: {
              type: 'string',
              ref: 'human'
            }
          }
        }
      }
    }
  }
});

const mother = await myDocument.family.mother_;
console.dir(mother); //> RxDocument
```

    - Example with array

```
const myCollection = await myDatabase.addCollections({
  human: {
    schema: {
      version: 0,
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        friends: {
          type: 'array',
          ref: 'human',
          items: {
              type: 'string'
          }
        }
      }
    }
  }
});

//[insert other humans here]

await myCollection.insert({
  name: 'Alice',
  friends: [
    'Bob',
    'Carol',
    'Dave'
  ]
});

const doc = await humansCollection.findOne('Alice').exec();
const friends = await myDocument.friends_;
console.dir(friends); //> Array.<RxDocument>
```

XVI. Encryption ( Mã hoá )

- Với encryption plugin, bạn có thể xác định các thuộc tính của document được sẽ mã hóa khi lưu trữ. Điều này đảm bảo rằng khi thiết bị của người dùng bị đánh cắp, dữ liệu được mã hóa sẽ không thể được đọc ra khỏi ổ cứng. Việc mã hóa và giải mã sẽ diễn ra nội bộ, vì vậy khi làm việc với RxDocument bạn vẫn có thể access vào các property như bình thường ( nhưng các trường được mã hóa không thể được sử dụng bên trong một truy vấn ) . Encryption-module đang sử dụng thuật toán AES của thư viện crypto-js.
- Usage ( cách sử dụng )
  - Encryption plugin sẽ bọc xung quanh RxStorage ( bất kể RxStorage engine nào ). Hãy follow các bước sau:
    1. Trước tiên, bạn phải bọc RxStorage với encryption.
    2. Sau đó, sử dụng RxStorage khi gọi createRxDatabase ()
    3. Ngoài ra, bạn phải đặt password khi tạo database. Trong hầu hết các trường hợp, bạn sẽ yêu cầu user nhập password khi khởi động ứng dụng.
    4. Để xác định một field được mã hóa, bạn phải thêm nó vào trường được mã hóa trong schema.

```
import { wrappedKeyEncryptionStorage } from 'rxdb/plugins/encryption';
import { getRxStorageDexie } from 'rxdb/plugins/dexie';


const encryptedDexieStorage = wrappedKeyEncryptionStorage({
    storage: getRxStorageDexie()
});


const db = await createRxDatabase<RxStylechaseCollections>({
    name: 'mydatabase',
    storage: encryptedDexieStorage,
    password: 'foooooobaaaaar'
});


const schema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
      id: {
          type: 'string',
          maxLength: 100
      },
      secret: {
          type: 'string'
      },
  },
  required: ['id']
  encrypted: ['secret']
};

await db.addCollections({
    stuff: {
        schema
    }
})
```

- Encrypted attachments

  - Để lưu trữ dữ liệu tệp đính kèm được mã hóa, bạn phải đặt encrypted: true trong thuộc tính tệp đính kèm của schema.

```
const mySchema = {
    version: 0,
    type: 'object',
    properties: {
        /* ... */
    },
    attachments: {
        encrypted: true // if true, the attachment-data will be encrypted with the db-password
    }
};
```

XV. Key Compression

- Với key compression plugin, document sẽ được lưu trữ ở định dạng nén giúp tiết kiệm đến 40% dung lượng đĩa. Để làm được điều này RxDB dùng dùng npm module jsonschema-key-compression, nó sẽ nén dữ liệu json dựa trên json-schema của chính nó, nó hoạt động bằng cách nén các attribute-name dài thành những tên nhỏ hơn và ngược lại.Quá trình nén và giải nén cũng diễn ra bên trong như mã hoá mà giải mã, vì vậy khi bạn làm việc với RxDocument, bạn có thể truy cập như bình thường.
- Enable key compression

  - Key compression plugin sẽ bọc xung quanh RxStorage ( bất kể RxStorage engine nào ). Hãy follow các bước sau:
    - Trước tiên, bạn phải bọc RxStorage với key compression.
    - Sau đó, sử dụng RxStorage khi gọi createRxDatabase ()
    - Tiếp đến, bạn phải bật tính năng key compression bằng cách thêm keyCompression: true vào schema của collection.

```
import { wrappedKeyCompressionStorage } from 'rxdb/plugins/key-compression';
import { getRxStorageDexie } from 'rxdb/plugins/dexie';

const storageWithKeyCompression = wrappedKeyCompressionStorage({
    storage: getRxStorageDexie()
});

const db = await createRxDatabase<RxStylechaseCollections>({
    name: 'mydatabase',
    storage: storageWithKeyCompression
});

const mySchema = {
  keyCompression: true, // set this to true, to enable the keyCompression
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
      id: {
          type: 'string',
          maxLength: 100 // <- the primary key must have set maxLength
      }
      /* ... */
  }
};
/* ... */
```

XVI.RxStorage

1.  PouchDB

    -

2.  LokiJS

    -

3.  DexieJS

    -

4.  Memory

    -

5.  IndexedDB

    -

6.  SQLite

    -

7.  FoundationDB

    -

8.  Worker

    -

9.  Sharding

    -

10. Memory Synced 1.
    XVI. Cleanup ( Beta)

- Để làm cho việc replication (sao chép - đồng bộ) hoạt động và vì các lý do khác, RxDB phải giữ các document đã xóa trong bộ lưu trữ. Điều này đảm bảo rằng khi client offline, trạng thái xóa vẫn được biết và có thể được replication (sao chép - đồng bộ) với backend khi máy khách trực online trở lại. Nhưng nếu giữ quá nhiều document đã xóa trong bộ nhớ, có thể làm chậm các truy vấn hoặc chiếm quá nhiều dung lượng đĩa. Với cleanup plugin , RxDB sẽ chạy các chu kỳ dọn dẹp để dọn dẹp các document đã xóa (nếu nó có thể được thực hiện một cách an toàn).
- Add the cleanup plugin

```
import { addRxPlugin } from 'rxdb';
import { RxDBCleanupPlugin } from 'rxdb/plugins/cleanup';
addRxPlugin(RxDBCleanupPlugin);
```

- Create a database with cleanup options

  - Bạn có thể đặt cleanup policy khi một RxDatabase được tạo. Đối với hầu hết các trường hợp sử dụng, các giá trị mặc định vẫn sẽ hoạt động tốt.

```
import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/dexie';
const db = await createRxDatabase({
  name: 'heroesdb',
  storage: getRxStorageDexie(),
  cleanupPolicy: {
      /**
       * Thời gian tối thiểu,tính bằng mili giây trong bao lâu
       * thì một document phải được xóa trước khi nó được bị loại bỏ bởi cleanup.
       * [mặc định = 1 tháng]
       */
        minimumCollectionAge: 1000 * 60, // 60 seconds
      /**
       * Sau khi khởi tạo cleanup xong một cleanup mới được bắt đầu sau bao nhiêu mili giây
       * [mặc định =5 phút]
       */
      runEach: 1000 * 60 * 5, // 5 minutes
      /**
       * Nếu được đặt thành true,
       * RxDB sẽ chờ đợi tất cả các replicatio đang chạy
       * để đảm bảo sẽ không có replication cycle nào đang chạy.
       * Điều này đảm bảo chúng tôi không xóa các tài liệu đã xóa
       * khi chúng có thể chưa được sao chép.
       * [default=true]
       */
      awaitReplicationsInSync: true,
      /**
       * If true, it will only start the cleanup
       * when the current instance is also the leader.
       * This ensures that when RxDB is used in multiInstance mode,
       * only one instance will start the cleanup.
       * [default=true]
       */
      waitForLeadership: true
  }
});
```

- Cleanup sẽ không hoạt động trong PouchDB
  XVII. Use RXDB with typescript
- Trong hướng dẫn này, chúng ta sẽ học học cách sử dụng RxDB với TypeScript. Chúng ta sẽ tạo một database cơ bản với collection và một số method ORM. RxDB đã support các type cần thiết để sử dụng và chúng ta sẽ không phải install bất kỳ thứ gì khác, tuy nhiên từ phiên bản mới nhất của RxDB (v9 +) sẽ yêu cầu phải sử dụng và tương thích từ Typescript v3.8 hoặc cao hơn. Chúng ta sẽ :
  - Xác định Document trông như thế nào.
  - Xác định Collection trông như thế nào.
  - Xác định Database trông như thế nào.
- Declare the types
  - Chúng ta sẽ phải import từ RxDB

```
import {
    createRxDatabase,
    RxDatabase,
    RxCollection,
    RxJsonSchema,
    RxDocument,
} from 'rxdb';
```

- Tạo ra Document type
  - Đầu tiên chúng ta phải xác định kiểu TypeScript của các Document của một Collection và sẽ có vài option để làm được điều đó
  - Option A: Tạo Document type từ schema

```
import {
    toTypedRxJsonSchema,
    ExtractDocumentTypeFromTypedRxJsonSchema,
    RxJsonSchema
} from 'rxdb';
export const heroSchemaLiteral = {
    title: 'hero schema',
    description: 'describes a human being',
    version: 0,
    keyCompression: true,
    primaryKey: 'passportId',
    type: 'object',
    properties: {
        passportId: {
            type: 'string'
        },
        firstName: {
            type: 'string'
        },
        lastName: {
            type: 'string'
        },
        age: {
            type: 'integer'
        }
    },
    required: ['firstName', 'lastName', 'passportId'],
    indexes: ['firstName']
} as const; // <- It is important to set 'as const' to preserve the literal type
const schemaTyped = toTypedRxJsonSchema(heroSchemaLiteral);

// aggregate the document type from the schema
type HeroDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

// create the typed RxJsonSchema from the literal typed object.
const heroSchema: RxJsonSchema<HeroDocType> = heroSchemaLiteral;
```

    - Option B: Tạo Document bằng cách thủ công

```
type HeroDocType = {
    passportId: string;
    firstName: string;
    lastName: string;
    age?: number; // optional
};
```

    - Option C: Generate ra document type từ schema trong quá trình build time

    	- Nếu schema của bạn là nằm trong .json file hoặc generated từ đâu đó, bạn có thể generate type với json-schema-to-typescript module đây là một thư viện sẽ hỗ trợ điều này (npm i json-schema-to-typescript)

- Types for the ORM methods
  - Chúng ta có thể thêm một số method ORM cho document.

```
type HeroDocMethods = {
    scream: (v: string) => string;
};
```

    - Sau đó chúng ta sẽ merge ( hợp lại) thành HeroDocument.

```
type HeroDocument = RxDocument<HeroDocType, HeroDocMethods>;
```

    - Và bây giờ chúng ta có thể xác định type cho collection chứa các document.

```
// we declare one static ORM-method for the collection
type HeroCollectionMethods = {
    countAllDocuments: () => Promise<number>;
}

// and then merge all our types
type HeroCollection = RxCollection<HeroDocType, HeroDocMethods, HeroCollectionMethods>;
```

    - Trước khi chúng ta xác định database, chúng ta có thể tạo một help-type chứa tất cả các collection của nó như sau:

```
type MyDatabaseCollections = {
    heroes: HeroCollection
}
```

    - Giờ chúng ta sẽ xác định Database

```
type MyDatabase = RxDatabase<MyDatabaseCollections>;
```

- Using the types

  - Chúng ta hoàn thành xong việc khai báo tất cả các type cần thiết và bây giờ chúng ta sẽ sử dụng nó:

```
/**
 * create database và collections
 */
const myDatabase: MyDatabase = await createRxDatabase<MyDatabaseCollections>({
    name: 'mydb',
    storage: getRxStoragePouch('memory')
});

const heroSchema: RxJsonSchema<HeroDocType> = {
    title: 'human schema',
    description: 'describes a human being',
    version: 0,
    keyCompression: true,
    primaryKey: 'passportId',
    type: 'object',
    properties: {
        passportId: {
            type: 'string'
            maxLength: 100 // <- the primary key must have set maxLength
        },
        firstName: {
            type: 'string'
        },
        lastName: {
            type: 'string'
        },
        age: {
            description: 'age in years',
            type: 'integer',
            // number fields that are used in an index, must have set minium, maximum and multipleOf
            minimum: 0,
            maximum: 150,
            multipleOf: 1
        }
    },
    required: ['passportId', 'firstName', 'lastName'],
    indexes: ['age']
};

const heroDocMethods: HeroDocMethods = {
    scream: function(this: HeroDocument, what: string) {
        return this.firstName + ' screams: ' + what.toUpperCase();
    }
};

const heroCollectionMethods: HeroCollectionMethods = {
    countAllDocuments: async function(this: HeroCollection) {
        const allDocs = await this.find().exec();
        return allDocs.length;
    }
};

await myDatabase.addCollections({
    heroes: {
        schema: heroSchema,
        methods: heroDocMethods,
        statics: heroCollectionMethods
    }
});

// add a postInsert-hook
myDatabase.heroes.postInsert(
    function myPostInsertHook(
        this: HeroCollection, // own collection is bound to the scope
        docData: HeroDocType, // documents data
        doc: HeroDocument // RxDocument
    ) {
        console.log('insert to ' + this.name + '-collection: ' + doc.firstName);
    },
    false // not async
);

/**
 * use the database
 */

// insert a document
const hero: HeroDocument = await myDatabase.heroes.insert({
    passportId: 'myId',
    firstName: 'piotr',
    lastName: 'potter',
    age: 5
});

// access a property
console.log(hero.firstName);

// use a orm method
hero.scream('AAH!');

// use a static orm method from the collection
const amount: number = await myDatabase.heroes.countAllDocuments();
console.log(amount);


/**
 * clean up
 */
myDatabase.destroy();
```
