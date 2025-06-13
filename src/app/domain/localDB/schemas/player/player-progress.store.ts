import { ObjectStoreMeta } from 'ngx-indexed-db';

export const playerProgressStore : ObjectStoreMeta = {
    store: 'playerProgress',
    storeConfig: { keyPath: 'uid', autoIncrement: false },
    storeSchema: [
        { name: 'coins', keypath: 'coins', options: { unique: false } },
        { name: 'currentCategory', keypath: 'currentCategory', options: { unique: false } },
        { name: 'exp', keypath: 'exp', options: { unique: false } },
        { name: 'lastCategoryUpdate', keypath: 'lastCategoryUpdate', options: { unique: false } },
        { name: 'lastLevelUpdate', keypath: 'lastLevelUpdate', options: { unique: false } },
        { name: 'level', keypath: 'level', options: { unique: false } }
    ]
}