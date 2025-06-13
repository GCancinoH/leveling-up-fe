import { ChangeDetectionStrategy, Component, DestroyRef, inject, output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
// Material
import { MatCard, MatCardTitle, MatCardHeader, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
// Models
import { PersonalInformation } from '@models/signup-steps';
// components
import { SpacerComponent } from '@libs/compose-ui/spacer/spacer.component';
// Utils
import { ValidatorsUtils } from '@utils/ValidatorsUtils';
import { Genders } from '@models/player/genders';
import { FADE_IN_ANIMATION } from '@utils/animations/fade-in.animation';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateUtils } from '@utils/DateUtils';

@Component({
  selector: 'personal-information-screen',
  imports: [
    ReactiveFormsModule,
    MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions,
    MatInputModule, MatFormFieldModule, MatDatepickerModule, MatSelectModule,
    MatIconButton, MatIcon,
    SpacerComponent
  ],
  templateUrl: './personal-information-screen.component.html',
  styleUrl: './personal-information-screen.component.scss',
  animations: [FADE_IN_ANIMATION],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalInformationScreenComponent {
  // injects
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _fb = inject(FormBuilder);
  private readonly _snackBar = inject(MatSnackBar);
  // variables
  personalInfoForm = this._fb.group({
    name: ['', [Validators.required]],
    birthdate: ['', Validators.required],
    age: [{value: '', disabled: true}, Validators.required],
    gender: ['', Validators.required]
  });
  genders = Object.values(Genders);
  // input, output
  personalData = output<PersonalInformation>();

  constructor() {
    this.personalInfoForm.get('birthdate')?.valueChanges.pipe(
      tap((value) => {
        if (value) {
          const birthDate = new Date(value);
          const age = DateUtils.calculateAge(birthDate);
          this.personalInfoForm.get('age')?.setValue(age.toString());
        }
      }),
      debounceTime(200),
      distinctUntilChanged(),
      takeUntilDestroyed(this._destroyRef)
    ).subscribe();
  }

  emitValue() : void {
    const { name, birthdate, age, gender } = this.personalInfoForm.value;

    if (!this.personalInfoForm.valid) return;

    const data: PersonalInformation = {
      name: name!,
      birthDate: new Date(birthdate!),
      age: parseInt(age!),
      gender: gender!
    }
    this.personalData.emit(data);
  }
}