import { 
    trigger, 
    state, 
    style, 
    animate, 
    transition,
    AnimationTriggerMetadata 
  } from '@angular/animations';
  
export const DIALOG_ANIMATIONS = {
    fadeIn: trigger('fadeIn', [
        state('void', style({ opacity: 0 })),
        state('*', style({ opacity: 1 })),
        transition('void => *', animate('200ms ease-in')),
        transition('* => void', animate('200ms ease-out'))
    ]),
    
    slideUp: trigger('slideUp', [
        state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
        state('*', style({ opacity: 1, transform: 'translateY(0)' })),
        transition('void => *', animate('300ms ease-out')),
        transition('* => void', animate('200ms ease-in'))
    ]),
    
    zoomIn: trigger('zoomIn', [
        state('void', style({ opacity: 0, transform: 'scale(0.9)' })),
        state('*', style({ opacity: 1, transform: 'scale(1)' })),
        transition('void => *', animate('300ms ease-out')),
        transition('* => void', animate('200ms ease-in'))
    ])
};  