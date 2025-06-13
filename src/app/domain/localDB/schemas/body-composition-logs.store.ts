import { ObjectStoreMeta } from 'ngx-indexed-db';

export const bodyCompositionStore : ObjectStoreMeta = {
    store: 'bodyCompositionLogs',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'uid', keypath: 'uid', options: { unique: false } },
        { name: 'weight', keypath: 'weight', options: { unique: false } },
        { name: 'bodyFat', keypath: 'bodyFat', options: { unique: false } },
        { name: 'muscleMass', keypath: 'muscleMass', options: { unique: false } },
        { name: 'visceralFat', keypath: 'visceralFat', options: { unique: false } },
        { name: 'bodyAge', keypath: 'bodyAge', options: { unique: false } },
        { name: 'date', keypath: 'date', options: { unique: false } },
        { name: 'isInitial', keypath: 'isInitial', options: { unique: false } }
      ]
}