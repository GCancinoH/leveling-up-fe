import { Component, input, signal, output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClockFaceComponent } from '@libs/compose-ui/timepicker/clock-face/clock-face.component';
import { TimePickerFormat } from '@models/time-picker-format';

@Component({
  selector: 'timepicker-dialog-content',
  imports: [
    CommonModule,
    ClockFaceComponent
  ],
  templateUrl: './dialog-content.component.html',
  styleUrl: './dialog-content.component.scss'
})
export class DialogContentComponent {
  // Inject dialog reference and data
  private dialogRef = inject(MatDialogRef<DialogContentComponent>);
  private dialogData = inject(MAT_DIALOG_DATA);

  // Format from dialog data
  format = signal<TimePickerFormat>(this.dialogData.format || '24hrs');
  
  // Internal signals
  selectedHour = signal<number>(0);
  selectedMinute = signal<number>(0);
  view = signal<'hour' | 'minute'>('hour');
  amPm = signal<'AM' | 'PM'>('AM');

  // Initialize from current time if available
  constructor() {
    const currentTime = this.dialogData.currentTime;
    if (currentTime) {
      this.initializeFromTimeString(currentTime);
    }
  }

  // Parse time string (e.g., "14:30" or "02:30 PM")
  private initializeFromTimeString(timeString: string): void {
    const parts = timeString.split(/[\s:]/);
    
    if (parts.length >= 2) {
      let hour = parseInt(parts[0], 10);
      const minute = parseInt(parts[1], 10);
      
      // Handle AM/PM if present
      if (parts.length > 2 && parts[2]) {
        const period = parts[2].toUpperCase();
        this.amPm.set(period === 'PM' ? 'PM' : 'AM');
        
        // Convert to 24-hour format internally
        if (period === 'PM' && hour < 12) {
          hour += 12;
        } else if (period === 'AM' && hour === 12) {
          hour = 0;
        }
      }
      
      this.selectedHour.set(hour);
      this.selectedMinute.set(minute);
    }
  }

  // Computed for display purposes
  displayHour = computed(() => {
    const hour = this.selectedHour();
    if (this.format() === '24hrs') return hour;
    return hour % 12 || 12;
  });

  // Get formatted time string
  get timeLabel(): string {
    const hour = this.displayHour().toString().padStart(2, '0');
    const minute = this.selectedMinute().toString().padStart(2, '0');
    return this.format() === '24hrs' ? `${hour}:${minute}` : `${hour}:${minute} ${this.amPm()}`;
  }

  // Update hour and switch to minute view
  setHour(hour: number): void {
    if (this.format() === '12hrs') {
      if (hour >= 12) {
        this.amPm.set('PM');
        if (hour > 12) hour = hour % 12;
      } else {
        this.amPm.set('AM');
        if (hour === 0) hour = 12;
      }
    }
    
    this.selectedHour.set(hour);
    this.view.set('minute');
  }

  // Update minute
  setMinute(minute: number): void {
    this.selectedMinute.set(minute);
  }

  // Toggle between AM and PM
  toggleAmPm(): void {
    const currentAmPm = this.amPm();
    const newAmPm = currentAmPm === 'AM' ? 'PM' : 'AM';
    this.amPm.set(newAmPm);

    // Adjust hour for 12-hour format
    if (this.format() === '12hrs') {
      const hour = this.selectedHour();
      if (newAmPm === 'PM' && hour < 12) {
        this.selectedHour.set(hour + 12);
      } else if (newAmPm === 'AM' && hour >= 12) {
        this.selectedHour.set(hour - 12);
      }
    }
  }

  // Handle time changed event from clock face
  onTimeChanged(event: { hour: number|null; minute: number|null }): void {
    if (this.view() === 'hour' && event.hour !== null) {
      this.setHour(event.hour);
    } else if (event.minute !== null) {
      this.setMinute(event.minute);
    }
  }

  // Close dialog without selection - returns null to indicate cancellation
  close(): void {
    this.dialogRef.close(null);
  }
  
  // Confirm selection and close dialog - returns the formatted time string
  confirm(): void {
    // Format the time for return value
    let hour = this.selectedHour();
    const minute = this.selectedMinute();
    
    let formattedTime;
    if (this.format() === '24hrs') {
      formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    } else {
      const displayHour = hour % 12 || 12;
      const period = hour >= 12 ? 'PM' : 'AM';
      formattedTime = `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
    }
    
    this.dialogRef.close(formattedTime);
  }
}