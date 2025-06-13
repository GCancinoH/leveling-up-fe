import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'spacer',
  imports: [ NgStyle ],
  templateUrl: './spacer.component.html',
  styleUrl: './spacer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpacerComponent {
  // inputs
  position = input.required<string>();
  size = input.required<string>();
  // computed
  sizeWithUnit = computed(() => this.size());
}
