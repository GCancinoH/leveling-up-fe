import { Component, computed, effect, input, model, output, signal, EventEmitter, inject, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { TimePickerFormat } from '@models/time-picker-format';

@Component({
  selector: 'time-picker',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './timepicker.component.html',
  styleUrl: './timepicker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true
    }
  ]
})
export class TimePickerComponent implements ControlValueAccessor {
  // Signal-based inputs
  format = input<TimePickerFormat>('24hrs');
  placeholder = input<string>('Select time');
  disabled = input<boolean>(false);

  // Model value for two-way binding
  timeValue = model<string | null>(null);

  // Signal outputs
  timeSelected = output<string>();

  // Internal signals
  private _value = signal<string | null>(null);
  private _onChange: (value: string | null) => void = () => {};
  private _onTouched: () => void = () => {};

  // Inject the MatDialog service
  private dialog = inject(MatDialog);

  // Computed values
  displayValue = computed(() => {
    return this._value() ?? '';
  });

  constructor() {
    // Effect to emit timeSelected when value changes
    effect(() => {
      const value = this._value();
      if (value) {
        this.timeSelected.emit(value);
      }
    });

    // Effect to sync model value to internal value
    effect(() => {
      const modelValue = this.timeValue();
      if (modelValue !== this._value()) {
        this._value.set(modelValue);
      }
    });
  }

  // ControlValueAccessor methods
  writeValue(value: string | null): void {
    this._value.set(value);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // No-op as we're using an input signal for disabled state
  }

  // Method to open the dialog
  openDialog(): void {
    if (this.disabled()) return;
    
    this._onTouched();
    
    const dialogRef = this.dialog.open(DialogContentComponent, {
      width: '340px',
      data: {
        format: this.format(),
        currentTime: this._value()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._value.set(result);
        this._onChange(result);
        this.timeValue.set(result);
      }
    });
  }
}