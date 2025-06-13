import { ChangeDetectionStrategy, Component, DestroyRef, inject, output, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
// material
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
// rxjs
import { combineLatestWith, debounceTime, delay, distinctUntilChanged, filter, startWith, tap } from 'rxjs';
// components
import { SpacerComponent } from '@libs/compose-ui/spacer/spacer.component';
// models
import { PhysicalAttributes } from '@models/signup-steps';
// utils
import { NutritionUtils } from '@utils/NutritionUtils';
import { ValidatorsUtils } from '@utils/ValidatorsUtils';
// animations
import { FADE_IN_ANIMATION } from '@utils/animations/fade-in.animation';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'physical-attributes-screen',
  imports: [
    ReactiveFormsModule,
    MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions, MatIconButton, MatIcon,
    MatFormFieldModule, MatInputModule, MatIconButton, MatIcon,
    SpacerComponent
  ],
  templateUrl: './physical-attributes-screen.component.html',
  styleUrl: './physical-attributes-screen.component.scss',
  animations: [FADE_IN_ANIMATION],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhysicalAttributesScreenComponent {
  // injects
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _fb = inject(FormBuilder);
  private readonly _snackBar = inject(MatSnackBar);
  // input, output
  physicalData = output<PhysicalAttributes>();
  // signals
  bmiValue = signal<number>(0);
  // variables
  physicalAttributesForm = this._fb.group({
    weight: ['', [Validators.required, ValidatorsUtils.cmMeasurementValidator]],
    height: ['', [Validators.required, ValidatorsUtils.cmMeasurementValidator]],
    bmi: [{value: '', disabled: true}, [Validators.required]]
  });

  constructor() {
    this.physicalAttributesForm.get('height')?.valueChanges.pipe(
      startWith(this.physicalAttributesForm.get('height')?.value),
      combineLatestWith(
        this.physicalAttributesForm.get('weight')!.valueChanges.pipe(
          startWith(this.physicalAttributesForm.get('weight')!.value)
        )
      ),
      distinctUntilChanged(),
      debounceTime(100),
      filter(([height, weight]) => {
        const heightValid = this.physicalAttributesForm.get('height')!.valid;
        const weightValid = this.physicalAttributesForm.get('weight')!.valid;
        return heightValid && weightValid;
      }),
      tap(([height, weight]) => {
        // Calculate and set BMI
        const bmi = NutritionUtils.calculateBMI(parseFloat(height!), parseFloat(weight!));
        this.bmiValue.set(bmi);
        this.physicalAttributesForm.get('bmi')?.setValue(bmi.toString());
      }),
      takeUntilDestroyed(this._destroyRef)
    ).subscribe();
  }

  emitValue() : void {
    const { weight, height, bmi } = this.physicalAttributesForm.value;

    const data: PhysicalAttributes = {
      weight: parseFloat(weight!),
      height: parseFloat(height!),
      bmi: parseFloat(bmi!)
    }

    if (this.physicalAttributesForm.valid) this.physicalData.emit(data);
  }
}
