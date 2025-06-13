import {
  Component,
  input,
  output,
  signal,
  computed,
  AfterViewInit
} from '@angular/core';
import { NgStyle } from '@angular/common';
import { TimePickerFormat } from '@models/time-picker-format';

@Component({
  selector: 'clock-face',
  templateUrl: './clock-face.component.html',
  styleUrls: ['./clock-face.component.scss'],
  imports: [ NgStyle ]
})
export class ClockFaceComponent {
  // Inputs as signals
  format = input<TimePickerFormat>('24hrs');
  view = input<'hour' | 'minute'>('hour');
  selectedHour = input<number>(0);
  selectedMinute = input<number>(0);

  // Output as signal-based EventEmitter
  timeChanged = output<{ hour: number|null; minute: number|null }>();

  // Internal signals
  isAM = signal(true);
  hoveredValue = signal<number | null>(null);

  // Computed selected value depending on view
  selectedValue = computed(() => {
    return this.view() === 'hour' ? this.selectedHour() : this.selectedMinute();
  });

  displayHour = computed(() => {
    const hour = this.selectedHour();
    if (this.format() === '24hrs') return hour;
    const h = hour % 12 || 12;
    return h;
  });

  select(value: number | null) {
    if (this.view() === 'hour') {
      let hour: number|null = value;
      if (this.format() === '12hrs') {
        const isAM = this.isAM();
        if (!isAM && hour! < 12) hour! += 12;
        if (isAM && hour === 12) hour! = 0;
      }
      this.timeChanged.emit({ hour, minute: this.selectedMinute() });
    } else {
      this.timeChanged.emit({ hour: this.selectedHour(), minute: value });
    }
  }

  formatNumber(n: number): string {
    if (this.view() === 'minute') {
      return n < 10 ? `0${n}` : `${n}`;
    }
    if (this.format() === '12hrs') {
      const h = n % 12 || 12;
      return `${h}`;
    }
    return `${n}`;
  }

  numbers(): number[] {
    if (this.view() === 'hour') {
      return this.format() === '12hrs'
        ? Array.from({ length: 12 }, (_, i) => i + 1)
        : Array.from({ length: 24 }, (_, i) => i);
    }
    // Only show every 5 minutes
    return Array.from({ length: 12 }, (_, i) => i * 5);
  }

  getNumberTransform(index: number): string {
    const count = this.view() === 'hour' ? 
      (this.format() === '12hrs' ? 12 : 24) : 12;
    
    // Calculate angle based on the actual index position
    const angle = (360 / count) * index;
    
    // Use a smaller radius to ensure numbers stay within the circle
    const radius = this.view() === 'hour' && this.format() === '24hrs' ? 125 : 120;
    
    const x = radius * Math.sin((angle * Math.PI) / 180);
    const y = -radius * Math.cos((angle * Math.PI) / 180);
    
    return `translate(${x}px, ${y}px)`;
  }

  getHandStyle(): { [key: string]: string } {
    // Use hovered value if available, otherwise use selected value
    const displayValue = this.hoveredValue() !== null ? 
      this.hoveredValue() : 
      (this.view() === 'hour' ? this.selectedHour() : this.selectedMinute());
      
    let angle = 0;
    
    if (this.view() === 'hour') {
      // For hours
      const hourValue = displayValue as number;
      if (this.format() === '24hrs') {
        if (hourValue < 12) {
          angle = hourValue * 30; // 0-11 hours
        } else {
          angle = (hourValue - 12) * 30; // 12-23 hours
        }
      } else {
        angle = (hourValue % 12) * 30; // 12-hour format
      }
    } else {
      // For minutes - 360 / 60 = 6 degrees per minute
      angle = (displayValue as number) * 6;
    }
    
    return {
      transform: `rotate(${angle}deg)`,
      height: '40%'
    };
  }
  
  isSelected(number: number): boolean {
    if (this.view() === 'hour') {
      if (this.format() === '12hrs') {
        return (this.selectedHour() % 12 || 12) === number;
      }
      return this.selectedHour() === number;
    } else {
      return this.selectedMinute() === number;
    }
  }
  
  // Handle mouse movement over clock
  handleMouseMove(event: MouseEvent) {
    const clockFace = event.currentTarget as HTMLElement;
    const rect = clockFace.getBoundingClientRect();
    
    // Calculate center of clock
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate mouse position relative to center
    const x = event.clientX - rect.left - centerX;
    const y = event.clientY - rect.top - centerY;
    
    // Calculate angle
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    // Convert to positive degrees (0-360)
    angle = (angle + 450) % 360;
    
    // Convert angle to value
    let value: number;
    if (this.view() === 'hour') {
      const segment = 30; // 360 / 12
      value = Math.round(angle / segment);
      if (value === 12) value = 0;
      
      // Adjust for 24-hour format
      if (this.format() === '24hrs') {
        // Check if we're in the inner circle (closer to center)
        const distance = Math.sqrt(x * x + y * y);
        const innerThreshold = rect.width * 0.25; // 25% of clock radius
        
        if (distance < innerThreshold) {
          value += 12;
        }
      }
    } else {
      // Minutes: 360 / 60 = 6 degrees per minute
      value = Math.round(angle / 6);
      if (value === 60) value = 0;
    }
    
    this.hoveredValue.set(value);
  }
  
  handleMouseLeave() {
    this.hoveredValue.set(null);
  }
  
  // Handle click on the clock face (not just on the numbers)
  handleClockFaceClick(event: MouseEvent) {
    if (this.hoveredValue() !== null) {
      this.select(this.hoveredValue());
    }
  }

  // Display the actual value that would be selected when the user hovers
  // between numbers on the clock face
  get displayedValue(): string {
    if (this.hoveredValue() === null) {
      return '';
    }
    
    if (this.view() === 'hour') {
      let hour = this.hoveredValue() as number;
      if (this.format() === '12hrs') {
        hour = hour % 12 || 12;
      }
      return hour.toString().padStart(2, '0');
    } else {
      return (this.hoveredValue() as number).toString().padStart(2, '0');
    }
  }
}