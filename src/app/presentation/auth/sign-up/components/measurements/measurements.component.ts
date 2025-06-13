import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, OnInit, ViewChild, effect, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// material
import { MatIconButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTooltip } from '@angular/material/tooltip';
// components
import { InitialDataMeasurements } from '@models/player/initialData/measurements';
import { MeasurementDialogComponent } from './dialog/dialog.component';
import { SpacerComponent } from '@libs/compose-ui/spacer/spacer.component';
// rxjs
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// utils
import { ValidatorsUtils } from '../../../../../data/utils/ValidatorsUtils';
import { FADE_IN_ANIMATION } from '@utils/animations/fade-in.animation';
import { BodyMeasurements } from '@models/signup-steps';

interface MeasurementPoint {
  id: string;
  name: string;
  cx: number;
  cy: number;
  value: string;
  formControlName: string;
  isFilled: boolean;
}

@Component({
  selector: 'body-measurements-screen',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCard, MatCardActions, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent,
    MatIconButton, MatIcon, MatProgressBar, MatTooltip,
    SpacerComponent
  ],
  templateUrl: 'measurements.component.html',
  styleUrls: ['measurements.component.scss'],
  animations: [FADE_IN_ANIMATION],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeasurementsComponent implements OnInit {
  @ViewChild('bodyCanvas') bodyCanvas!: ElementRef<HTMLDivElement>;
  // injectors
  private _fb = inject(FormBuilder);
  private readonly _destroyRef = inject(DestroyRef);
  private _dialog = inject(MatDialog);
  //input, outputs
  measurementsSaved = output<BodyMeasurements>();
  isFormValid = output<boolean>();
  // variables
  initialMeasurements: FormGroup;
  // signals
  measurementPoints = signal<MeasurementPoint[]>([
    { id: 'neck', name: 'Neck', cx: 385, cy: 179, value: '', formControlName: 'neck', isFilled: false },
    { id: 'shoulders', name: 'Shoulders', cx: 385, cy: 215, value: '', formControlName: 'shoulders', isFilled: false },
    { id: 'chest', name: 'Chest', cx: 385, cy: 265, value: '', formControlName: 'chest', isFilled: false },
    { id: 'waist', name: 'Waist', cx: 385, cy: 365, value: '', formControlName: 'waist', isFilled: false },
    { id: 'umbilical', name: 'Umbilical', cx: 385, cy: 425, value: '', formControlName: 'umbilical', isFilled: false },
    { id: 'rightArm', name: 'Right Arm (Relaxed)', cx: 520, cy: 320, value: '', formControlName: 'rightArm', isFilled: false },
    { id: 'leftArm', name: 'Left Arm (Relaxed)', cx: 248, cy: 320, value: '', formControlName: 'leftArm', isFilled: false },
    { id: 'rightArmContracted', name: 'Right Arm (Contracted)', cx: 522, cy: 340, value: '', formControlName: 'rightArmContracted', isFilled: false },
    { id: 'leftArmContracted', name: 'Left Arm (Contracted)', cx: 245, cy: 340, value: '', formControlName: 'leftArmContracted', isFilled: false },
    { id: 'rightForearms', name: 'Right Forearm', cx: 542, cy: 410, value: '', formControlName: 'rightForearms', isFilled: false },
    { id: 'leftForearms', name: 'Left Forearm', cx: 225, cy: 410, value: '', formControlName: 'leftForearms', isFilled: false },
    { id: 'hips', name: 'Hips', cx: 385, cy: 485, value: '', formControlName: 'hips', isFilled: false  },
    { id: 'rightLeg', name: 'Right Leg', cx: 455, cy: 620, value: '', formControlName: 'rightLeg', isFilled: false },
    { id: 'leftLeg', name: 'Left Leg', cx: 315, cy: 620, value: '', formControlName: 'leftLeg', isFilled: false },
    { id: 'rightCalf', name: 'Right Calf', cx: 455, cy: 845, value: '', formControlName: 'rightCalf', isFilled: false },
    { id: 'leftCalf', name: 'Left Calf', cx: 315, cy: 845, value: '', formControlName: 'leftCalf', isFilled: false }
  ]);
  selectedPoint = signal<MeasurementPoint | null>(null);
  progress = signal<number>(0);
  
  constructor() {
    this.initialMeasurements = this._fb.group({
      neck: ['', [Validators.required]],
      chest: ['', [Validators.required]],
      shoulders: ['', [Validators.required]],
      waist: ['', [Validators.required]],
      umbilical: ['', [Validators.required]],
      rightArm: ['', [Validators.required]],
      leftArm: ['', [Validators.required]],
      rightArmContracted: ['', [Validators.required]],
      leftArmContracted: ['', [Validators.required]],
      rightForearms: ['', [Validators.required]],
      leftForearms: ['', [Validators.required]],
      hips: ['', [Validators.required]],
      rightLeg: ['', [Validators.required]],
      leftLeg: ['', [Validators.required]],
      rightCalf: ['', [Validators.required]],
      leftCalf: ['', [Validators.required]]
    });

  }

  ngOnInit(): void {    
    // Initialize measurement points from form values
    this.initialMeasurements.valueChanges.subscribe(values => {
      this.updateProgressCount();
      
      // Update measurement points values from form
      const updatedPoints = this.measurementPoints().map(point => {
        const value = values[point.formControlName] || '';
        return {
          ...point,
          value,
          isFilled: value !== null && value !== ''
        };
      });
      
      this.measurementPoints.set(updatedPoints);
    });
  }

  openMeasurementDialog(pointName: string) {
    // Find the selected measurement point
    const selectedPoint = this.measurementPoints().find(point => point.name === pointName);

    if (selectedPoint) {
      const dialogRef = this._dialog.open(MeasurementDialogComponent, {
        data: {
          pointId: selectedPoint.id,
          label: selectedPoint.name,
          value: selectedPoint.value, // Pass the current value
          hasError: this.initialMeasurements.get(selectedPoint.formControlName)?.invalid // Pass validation status
        },
        width: '450px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) { // Check if a value was returned (dialog wasn't cancelled)
          // Find the index of the updated point
          const index = this.measurementPoints().findIndex(point => point.id === selectedPoint.id);

          if (index !== -1) {
            // Create a copy of the array and update the specific point
            const updatedPoints = [...this.measurementPoints()];
            updatedPoints[index] = { ...updatedPoints[index], value: result };

            // Update the signal
            this.measurementPoints.set(updatedPoints);

            // Update the form control value in the initialMeasurements form group
            this.initialMeasurements.get(selectedPoint.formControlName)?.setValue(result);
            this.initialMeasurements.get(selectedPoint.formControlName)?.markAsDirty(); // Mark as dirty to trigger valueChanges
          }
        }
      });
    }
  }
  
  savePointMeasurement(value: string): void {
    if (this.selectedPoint()) {
      const point = this.selectedPoint()!;
      
      // Update the form control value
      this.initialMeasurements.get(point.formControlName)?.setValue(value);
      this.initialMeasurements.get(point.formControlName)?.markAsDirty();
      
      // Close dialog
      this.closeDialog();
    }
  }
  
  closeDialog(): void {
    this.selectedPoint.set(null);
  }
  
  updateProgressCount(): void {
    const filledFields = Object.values(this.initialMeasurements.value)
      .filter(val => val !== null && val !== '')
      .length;
      
    this.progress.set(filledFields);
  }
  
  saveAllMeasurements(): void {
    const values = this.initialMeasurements.value;
    let isValid = false;
    // Mark all form controls as touched to trigger validation
    Object.keys(this.initialMeasurements.controls).forEach(key => {
      const control = this.initialMeasurements.get(key);
      control?.markAsTouched();
    });
    
    if (this.initialMeasurements.valid) {
      console.log('All measurements saved:', this.initialMeasurements.value);
      const measurements: BodyMeasurements = {
        neck: values.neck,
        chest: values.chest,
        shoulders: values.shoulders,
        waist: values.waist,
        umbilical: values.umbilical,
        rightArm: values.rightArm,
        leftArm: values.leftArm,
        rightArmContracted: values.rightArmContracted,
        leftArmContracted: values.leftArmContracted,
        rightForearm: values.rightForearms,
        leftForearm: values.leftForearms,
        hips: values.hips,
        rightLeg: values.rightLeg,
        leftLeg: values.leftLeg,
        rightCalf: values.rightCalf,
        leftCalf: values.leftCalf
      }
      this.measurementsSaved.emit(measurements);
    }
  }
  
  getProgressPercentage(): number {
    return (this.progress() / this.measurementPoints().length) * 100;
  }
}

