import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Material
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButton, MatIconButton, MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
// Other
import { TranslateModule } from '@ngx-translate/core';
import { BodyCompositionComponent } from './bottom-sheets/body-composition/body-composition.component';
import { BloodPressureComponent } from './bottom-sheets/blood-pressure/blood-pressure.component';
import { SleepComponent } from './bottom-sheets/sleep/sleep.component';
import { Firestore, collection, query, where, onSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BodyCompositionService } from '@services/body-composition.service';
import { PlayerService } from '@services/player.service';
// Other

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    RouterOutlet,
    MatBottomSheetModule, MatButton, MatIcon, MatIconButton, MatFabButton, MatMenuModule,
    MatSidenav, MatSidenavContainer, MatSidenavContent, MatToolbar,
    TranslateModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  // injectors
  private readonly _bodyCompositionService = inject(BodyCompositionService);
  private readonly _bottomSheet = inject(MatBottomSheet);
  private readonly _db = inject(Firestore);
  private readonly _snackbar = inject(MatSnackBar);
  private readonly _playerService = inject(PlayerService);
  // signals
  isDesktop = signal(false);
  todaysBodyCompositionExists = this._bodyCompositionService.todaysDataExists;
  selectedTime = signal('None');

  constructor() {
  }

  handleTimeChange(event: { hour: number; minute: number }) {
    const h = event.hour.toString().padStart(2, '0');
    const m = event.minute.toString().padStart(2, '0');
    this.selectedTime.set(`${h}:${m}`);
  }

  change(value: boolean) {
    this.isDesktop.update(value => !value);
  }

  openBodyCompositionBottomSheet()
  {
    if(!this.todaysBodyCompositionExists()) {
      this._bottomSheet.open(BodyCompositionComponent);
    } else {
      this._snackbar.open('Your data was saved for today', 'x', {
        'duration': 4000
      })
    }   
  }
  
  openSleepBottomSheet() { this._bottomSheet.open(SleepComponent); }
  
  openBloodPressureBottomSheet() { this._bottomSheet.open(BloodPressureComponent);  }

  
}
