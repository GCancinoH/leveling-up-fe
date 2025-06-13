import { ChangeDetectionStrategy, Component, DestroyRef, inject, output } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
// Material
import { MatCard, MatCardTitle, MatCardHeader, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIconButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
// Models
import { Improvements } from '@models/signup-steps';
// components
import { SpacerComponent } from '@libs/compose-ui/spacer/spacer.component';
// animations
import { FADE_IN_ANIMATION } from '@utils/animations/fade-in.animation';


@Component({
  selector: 'improvements-screen',
  imports: [
    ReactiveFormsModule, TitleCasePipe,
    MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions,
    MatCheckbox, MatInputModule, MatFormFieldModule, MatDatepickerModule,
    MatSelectModule, MatIconButton, MatIcon,
    SpacerComponent
  ],
  templateUrl: './improvements-screen.component.html',
  styleUrl: './improvements-screen.component.scss',
  animations: [FADE_IN_ANIMATION],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImprovementsScreenComponent {
  // injects
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _fb = inject(FormBuilder);
  private readonly _snackBar = inject(MatSnackBar);
  // variables
  improvementForm = this._fb.group({
    improvements: this._fb.array([]),
  });
  improvements = Object.values(Improvements);
  // input, output
  improvementData = output<string[] | undefined>();

  onCheckboxChange(improvement: Improvements, isChecked: boolean) {
    const improvementsValue = this.improvementForm.get('improvements') as FormArray;

    if (isChecked) {
      improvementsValue.push(this._fb.control(improvement));
    } else {
      const index = improvementsValue.controls.findIndex(x => x.value === improvement);
      if (index !== -1) {
        improvementsValue.removeAt(index);
      }
    }
  }

  emitValue() : void {
    this.improvementData.emit(this.improvementForm.get('improvements')?.value as string[]);
  }
}
