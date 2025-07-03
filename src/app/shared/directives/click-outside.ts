import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
@Output() appClickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  public onClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement | null;

    if (targetElement && !this.elementRef.nativeElement.contains(targetElement)) {
      this.appClickOutside.emit();
    }
  }
}
