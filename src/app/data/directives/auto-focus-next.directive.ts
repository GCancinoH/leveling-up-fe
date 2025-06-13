import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[autoFocusNext]'
})
export class AutoFocusNextDirective {
  // injectors
  private readonly _elementRef = inject(ElementRef);

  constructor() { }

  @HostListener('keydown.enter', ['$event'])
  handleEnter(event: KeyboardEvent) {
    event.preventDefault();

    const form = this._elementRef.nativeElement.closest('form');
    const elements = Array.from(form.querySelectorAll('input, textarea, select, button'))
      .filter((el: any) => !el.disabled && el.tabIndex !== -1);

    const index = elements.indexOf(this._elementRef.nativeElement);
    if (index > -1 && index + 1 < elements.length) {
      const next = elements[index + 1] as HTMLElement;
      next.focus();
    }
  }

}
