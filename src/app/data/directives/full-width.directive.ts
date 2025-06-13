import { Directive, ElementRef, Renderer2, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[fullWidth]'
})
export class FullWidthDirective implements OnInit {
  // injectors
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  ngOnInit(): void {
    this.renderer.setStyle(this.el.nativeElement, 'width', '100%');
  }
}
