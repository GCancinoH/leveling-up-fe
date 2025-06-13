import { ObjectStoreMeta } from 'ngx-indexed-db';

export const playerStore : ObjectStoreMeta = {
    store: 'players',
    storeConfig: { keyPath: 'uid', autoIncrement: false },
    storeSchema: [
        { name: 'displayName', keypath: 'displayName', options: { unique: false } },
        { name: 'email', keypath: 'email', options: { unique: true } },
        { name: 'photoURL', keypath: 'photoURL', options: { unique: false } },
        { name: 'age', keypath: 'age', options: { unique: false } },
        { name: 'height', keypath: 'height', options: { unique: false } },
        { name: 'birthday', keypath: 'birthday', options: { unique: false } },
        { name: 'gender', keypath: 'gender', options: { unique: false } },
        { name: 'improvements', keypath: 'improvements', options: { unique: false, multiEntry: true } }
    ]
}