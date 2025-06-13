import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Other
import { OneSignal } from 'onesignal-ngx';;
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // injectors
  private readonly translator = inject(TranslateService);
  private readonly _oneSignal = inject(OneSignal);

  constructor() {
    this.translator.addLangs(['en', 'es']);
    this.translator.setDefaultLang('en');
    this.translator.use('en');

    this._oneSignal.init({
      appId: ''
    });

  }
}
