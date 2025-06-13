import { Component, Inject, inject } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
// Material
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// Other
import { ValidatorsUtils } from '../../../../../../data/utils/ValidatorsUtils';

export interface MeasurementDialogData {
  pointId: string;
  label: string;
  value: string;
  hasError: boolean;
}

@Component({
  selector: 'measurement-dialog',
  imports: [
    ReactiveFormsModule,
    MatButton, MatFormFieldModule, MatInputModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class MeasurementDialogComponent {
  // injector
  dialogRef = inject(MatDialogRef<MeasurementDialogComponent>);
  measurementControl: FormControl<string | null>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MeasurementDialogData
  ) {
    this.measurementControl = new FormControl(
      data.value, 
      [Validators.required, ValidatorsUtils.cmMeasurementValidator]
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.measurementControl.valid) {
      this.dialogRef.close(this.measurementControl.value);
    }
  }
}
