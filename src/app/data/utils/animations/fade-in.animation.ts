import { animate, style, transition, trigger } from "@angular/animations";

export const FADE_IN_ANIMATION = trigger('fadeIn', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('600ms ease-in', style({ opacity: 1 }))
    ])
  ]);