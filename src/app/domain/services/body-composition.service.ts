import { inject, Injectable, signal } from '@angular/core';
import { collection, Firestore, onSnapshot, query, where, addDoc, DocumentReference } from '@angular/fire/firestore';
import { BodyComposition } from '@models/body-composition';

@Injectable({
  providedIn: 'root'
})
export class BodyCompositionService {
  // injectors
  private readonly _db = inject(Firestore);
  // signals
  todaysDataExists = signal(false);
  // variables
  bodyCompositionCollection = collection(this._db, 'bodyComposition');

  constructor() {
    this._listenToTodaysData();
  }

  async saveData(data: BodyComposition): Promise<DocumentReference>
  {
    try {
      return await addDoc(this.bodyCompositionCollection, data);
    } catch (error) {
        throw error;
    }
  }

  private _listenToTodaysData(): void
  {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const q = query(
      this.bodyCompositionCollection,
      where('date', '>=', startOfToday),
      where('date', '<=', endOfToday)
    );

    onSnapshot(q, (snapshot) => {
      this.todaysDataExists.set(snapshot.size > 0);
    });
  }
}
