import { ObjectStoreMeta } from 'ngx-indexed-db';

export const measurementsStore : ObjectStoreMeta = {
    store: 'measurementsLogs',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
        { name: 'uid', keypath: 'uid', options: { unique: false } },
        { name: 'neck', keypath: 'neck', options: { unique: false } },
        { name: 'forearmRight', keypath: 'forearmRight', options: { unique: false } },
        { name: 'forearmLeft', keypath: 'forearmLeft', options: { unique: false } },
        { name: 'bicepsRight', keypath: 'bicepsRight', options: { unique: false } },
        { name: 'bicepsLeft', keypath: 'bicepsLeft', options: { unique: false } },
        { name: 'chest', keypath: 'chest', options: { unique: false } },
        { name: 'shoulders', keypath: 'shoulders', options: { unique: false } },
        { name: 'waist', keypath: 'waist', options: { unique: false } },
        { name: 'umbilical', keypath: 'umbilical', options: { unique: false } },
        { name: 'hips', keypath: 'hips', options: { unique: false } },
        { name: 'legRight', keypath: 'legRight', options: { unique: false } },
        { name: 'legLeft', keypath: 'legLeft', options: { unique: false } },
        { name: 'calfRight', keypath: 'calfRight', options: { unique: false } },
        { name: 'calfLeft', keypath: 'calfLeft', options: { unique: false } },
        { name: 'date', keypath: 'date', options: { unique: false } },
        { name: 'isInitial', keypath: 'isInitial', options: { unique: false } }
    ]
}