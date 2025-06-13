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
import { BodyComposition, PersonalInformation } from '@models/signup-steps';
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
  selector: 'body-composition-screen',
  imports: [
    ReactiveFormsModule,
    MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions,
    MatInputModule, MatFormFieldModule, MatDatepickerModule, MatSelectModule,
    MatIconButton, MatIcon,
    SpacerComponent
  ],
  templateUrl: './body-composition-screen.component.html',
  styleUrl: './body-composition-screen.component.scss',
  animations: [FADE_IN_ANIMATION],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodyCompositionScreenComponent {
  // injects
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _fb = inject(FormBuilder);
  private readonly _snackBar = inject(MatSnackBar);
  // variables
  bodyCompositionForm = this._fb.group({
    bodyFat: ['', [Validators.required, ValidatorsUtils.cmMeasurementValidator]],
    muscleMass: ['', [Validators.required, ValidatorsUtils.cmMeasurementValidator]],
    visceralFat: ['', Validators.required],
    bodyAge: ['', [Validators.required]]
  });
  // input, output
  bodyCompData = output<BodyComposition>();

  emitValue() {}
}
