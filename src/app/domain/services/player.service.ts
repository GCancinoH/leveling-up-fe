import { inject, Injectable, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  // injectors
  private readonly _auth = inject(Auth);
  readonly _localDB = inject(NgxIndexedDBService)
  // signals
  playerUID = signal<string>('');

  constructor() {
    this.playerUID.set(this._auth.currentUser?.uid ?? '');
  }

  getPlayerUID(): string {
    return this.playerUID();
  }

  getPlayerByIDFromLocalDB(): Observable<any> {
    return this._localDB.getByKey('players', this.playerUID());
  }


}
