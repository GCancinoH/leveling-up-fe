import { ObjectStoreMeta } from 'ngx-indexed-db';

export const playerAttributesStore : ObjectStoreMeta = {
    store: 'playerAttributes',
    storeConfig: { keyPath: 'uid', autoIncrement: false },
    storeSchema: [
        { name: 'endurance', keypath: 'endurance', options: { unique: false } },
        { name: 'health', keypath: 'health', options: { unique: false } },
        { name: 'intelligence', keypath: 'intelligence', options: { unique: false } },
        { name: 'mobility', keypath: 'mobility', options: { unique: false } },
        { name: 'strength', keypath: 'strength', options: { unique: false } }
    ]
}