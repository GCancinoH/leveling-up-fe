import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// Material
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatError, MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
// Directives
import { FullWidthDirective } from '@directives/full-width.directive';
// Others
import { TranslateModule } from '@ngx-translate/core';
import { TimePickerComponent } from '@libs/compose-ui/timepicker/timepicker.component';
import { TimePickerFormat } from '@models/time-picker-format';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sleep',
  imports: [
    DatePipe, ReactiveFormsModule,
    FullWidthDirective,
    MatButton, MatInputModule, MatFormField, MatLabel, MatSuffix, MatError, MatProgressSpinnerModule,
    TimePickerComponent,
    TranslateModule
  ],
  templateUrl: './sleep.component.html',
  styleUrl: './sleep.component.scss'
})
export class SleepComponent implements OnInit {
  // inject
  private readonly _dialog = inject(MatDialog);
  private readonly _fb = inject(FormBuilder);
  private readonly _destroyRef = inject(DestroyRef);
  // signals
  isLoading = signal(false);
  timeFormat = signal<TimePickerFormat>('24hrs');
  isDisabled = signal<boolean>(false);
  totalSleepValue = signal<string>('');
  // variables
  today = new Date();
  sleepForm: FormGroup;
  // observables
  private _formChangesSubscription! : Subscription

  constructor() {
    this.sleepForm = this._fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      deepSleep: ['', Validators.required],
      lightSleep: ['', Validators.required],
      remSleep: ['', Validators.required],
      totalSleep: [{value: '', disabled: true}, Validators.required],
      heartRate: ['', Validators.required],
      bloodOxygen: ['', Validators.required],
      breathingScore: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this._formChangesSubscription = this.sleepForm.valueChanges.pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(() => {
      this.calculateSleepDuration();
    });
  }

  // methods
  onSubmit() {}

  calculateHoursTranscurred(startTime: string, endTime: string): string {
    // Helper to parse time strings (handles "HH:mm" or "HH:mm AM/PM")
    const parseTime = (timeString: string): Date => {
      const parts = timeString.split(/[\s:]/);
      let hour = parseInt(parts[0], 10);
      const minute = parseInt(parts[1], 10);
  
      if (parts.length > 2 && parts[2]) {
        const period = parts[2].toUpperCase();
        if (period === 'PM' && hour < 12) {
          hour += 12;
        } else if (period === 'AM' && hour === 12) {
          hour = 0;
        }
      }
  
      const date = new Date();
      date.setHours(hour, minute, 0, 0);
      return date;
    };
  
    const startDate = parseTime(startTime);
    let endDate = parseTime(endTime);
  
    // If end time is before start time, assume it's on the next day
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }
  
    const diffInMilliseconds = endDate.getTime() - startDate.getTime();
    const diffInMinutes = Math.round(diffInMilliseconds / (1000 * 60)); // Calculate difference in total minutes
  
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
  
    // Format the output string
    let result = '';
    if (hours > 0) {
      result += `${hours} hr${hours > 1 ? 's' : ''}`;
      if (minutes > 0) {
        result += ' '; // Add a space if both hours and minutes are present
      }
    }
    if (minutes > 0) {
      result += `${minutes} min${minutes > 1 ? 's' : ''}`;
    }
  
    // Handle the case where the duration is exactly 0 minutes
    if (result === '') {
      result = '0 mins';
    }
  
  
    return result;
  }

  calculateSleepDuration() {
    const sleepForm = this.sleepForm; // Assuming you have this defined and initialized
  
    if (sleepForm) {
      const startTime = sleepForm.get('from')?.value;
      const endTime = sleepForm.get('to')?.value;
      const totalSleep = sleepForm.get('totalSleep');
  
      if (startTime && endTime) {
        console.log(startTime, endTime);
        const duration = this.calculateHoursTranscurred(startTime, endTime);
        //totalSleep?.setValue(duration);
        this.totalSleepValue.update(() => duration);
      } else {
        console.warn('Sleep start or end time is missing.');
      }
    } else {
      console.warn('Sleep form is not valid.');
    }
  }
  
}
