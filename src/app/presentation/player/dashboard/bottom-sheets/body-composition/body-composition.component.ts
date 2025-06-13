import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// Material
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatError, MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
// Directives
import { FullWidthDirective } from '@directives/full-width.directive';
// Others
import { TranslateModule } from '@ngx-translate/core';
import { BodyCompositionService } from '@services/body-composition.service';
import { BodyComposition } from '@models/body-composition';
import { PlayerService } from '@services/player.service';


@Component({
  selector: 'app-body-composition',
  imports: [
    DatePipe, ReactiveFormsModule,
    FullWidthDirective,
    MatButton, MatIcon, MatInputModule, MatFormField, MatLabel, MatPrefix, MatError, MatProgressSpinnerModule,
    TranslateModule
  ],
  templateUrl: './body-composition.component.html',
  styleUrl: './body-composition.component.scss'
})
export class BodyCompositionComponent {
  // injectors
  private readonly _bodyCompositionService = inject(BodyCompositionService);
  private readonly _bottomSheet = inject(MatBottomSheetRef);
  private readonly fb = inject(FormBuilder);
  private readonly _playerService = inject(PlayerService);
  private readonly _snackBar = inject(MatSnackBar);
  // signals
  errorMessage = signal('');
  isLoading = signal(false);
  // variables
  today = new Date();
  bodyCompForm: FormGroup

  constructor() {
    this.bodyCompForm = this.fb.group({
      weight: ['', [Validators.required]],
      bodyFat: ['', [Validators.required]],
      muscleMass: ['', [Validators.required]],
      visceralFat: ['', Validators.required],
      bodyAge: ['', Validators.required]
    });
  }

  async onSubmit() {
    console.log("onSubmit() called");
    if(this.bodyCompForm.invalid) {
      this._snackBar.open('The form is invalid.', '', {
        duration: 4000
      });      
      this.bodyCompForm.markAllAsTouched();
      return;
    }
    console.log("Form is valid, proceeding...");
    const {weight, bodyFat, muscleMass, visceralFat, bodyAge } = this.bodyCompForm.value;
    this.isLoading.update(() => true);

    const data: BodyComposition = {
      uid: this._playerService.getPlayerUID(),
      date: this.today,
      weight: weight,
      bodyFat: bodyFat,
      muscleMass: muscleMass,
      visceralFat: visceralFat,
      bodyAge: bodyAge
    }

    const result = this._bodyCompositionService.saveData(data);

    result.then((res) => {
      if(res) {
        this._snackBar.open('Data saved successfully', '', {
          duration: 4000
        });
        this._bottomSheet.dismiss();
      }
    }).catch((err) => {
      this._snackBar.open('Data saved successfully', '', {
        duration: 4000
      });
    }).finally(() => {
      this.isLoading.update(() => false);
    });
  }
}
