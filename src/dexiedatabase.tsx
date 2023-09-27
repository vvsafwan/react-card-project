// import Dexie from 'dexie';
import { UserData, UserDataWithImage } from './models/dataModel';

import Dexie, { Table } from 'dexie';

export class MySubClassedDexie extends Dexie {
  users!: Table<UserDataWithImage>; 

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      users: '++id, name, image, email' 
    });
  }
}

export const db = new MySubClassedDexie();