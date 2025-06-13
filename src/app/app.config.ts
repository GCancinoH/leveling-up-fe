import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideIndexedDb } from 'ngx-indexed-db';
import { dbConfig } from './domain/localDB/db.config';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), 
    provideHttpClient(),
    // Firebase
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyATst4fG_kLMwtCr8tNhnF7X8aJ040rrwg",
      authDomain: "leveling-up-2e8c2.firebaseapp.com",
      projectId: "leveling-up-2e8c2",
      storageBucket: "leveling-up-2e8c2.firebasestorage.app",
      messagingSenderId: "737171817179",
      appId: "1:737171817179:web:7b3160829d1bfcfcca42fe",
      measurementId: "G-RF9PJ9G9DS"
      
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideMessaging(() => getMessaging()),
    provideStorage(() => getStorage()),
    provideFunctions(() => getFunctions()),
    provideIndexedDb(dbConfig),
    importProvidersFrom([TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    })])
  ]
};
