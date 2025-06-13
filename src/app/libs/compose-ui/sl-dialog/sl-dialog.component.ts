import { Component, computed, DestroyRef, effect, ElementRef, HostListener, inject, input, model, output, Renderer2, signal, ViewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { DialogConfig } from './dialog.config';
import { DIALOG_ANIMATIONS } from './dialog-animations';

@Component({
  selector: 'sl-dialog',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './sl-dialog.component.html',
  styleUrl: './sl-dialog.component.scss',
  animations: [
    DIALOG_ANIMATIONS.fadeIn,
    DIALOG_ANIMATIONS.slideUp,
    DIALOG_ANIMATIONS.zoomIn
  ]
})
export class SlDialogComponent {
  @ViewChild('dialogContainer') dialogContainer!: ElementRef;
  // injectors
  private readonly elementRef = inject(ElementRef);
  private readonly render = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  // signals
  private animationType = signal<string>('fadeIn');
  // models
  visible = model(false);
  // inputs
  animation = input<DialogConfig['animation']>('fadeIn');
  showActions = input<boolean>(true);
  title = input<string>('');
  cancelText = input<string>('Cancel');
  confirmText = input<string>('Confirm');
  width = input<string>('500px');
  height = input<string>('auto');
  zIndex = input<number>(1000);
  escapeClose = input<boolean>(true);
  backdropClose = input<boolean>(true);
  panelClass = input<string | string[]>('');
  // outputs
  closed = output<any>();
  confirmed = output<any>();
  cancelled = output<void>();
  // computed
  animationState = computed(() => {
    return this.visible() ? 'visible' : 'void';
  });

  constructor() {
    // Set up effect to update animation when animation input changes
    effect(() => {
      const animType = this.animation();
      if (animType && ['fadeIn', 'slideUp', 'zoomIn'].includes(animType)) {
        this.animationType.set(animType);
      }
    });
    
    // Focus trap management with effects
    effect(() => {
      if (this.visible()) {
        this.trapFocus();
        this.disableBodyScroll();
      } else {
        this.enableBodyScroll();
      }
    });
  }

  ngOnDestroy(): void {
    this.enableBodyScroll();
  }
  
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.escapeClose() && this.visible()) {
      this.close();
    }
  }
  
  onOverlayClick(event: MouseEvent): void {
    if (
      this.backdropClose() && 
      event.target === event.currentTarget && 
      this.visible()
    ) {
      this.close();
    }
  }
  
  open(): void {
    this.visible.set(true);
  }
  
  close(result?: any): void {
    this.visible.set(false);
    this.closed.emit(result);
  }
  
  cancel(): void {
    this.cancelled.emit();
    this.close();
  }
  
  confirm(): void {
    this.confirmed.emit("");
    this.close(true);
  }
  
  private trapFocus(): void {
    // Implement focus trap for accessibility
    if (this.dialogContainer?.nativeElement) {
      const focusableElements = this.dialogContainer.nativeElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        setTimeout(() => {
          (focusableElements[0] as HTMLElement).focus();
        }, 0);
      }
    }
  }
  
  private disableBodyScroll(): void {
    this.render.addClass(document.body, 'sl-dialog-open');
    this.render.setStyle(document.body, 'overflow', 'hidden');
  }
  
  private enableBodyScroll(): void {
    this.render.removeClass(document.body, 'sl-dialog-open');
    this.render.removeStyle(document.body, 'overflow');
  }

}
