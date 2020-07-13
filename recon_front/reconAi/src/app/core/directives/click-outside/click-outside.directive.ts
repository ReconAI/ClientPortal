import {
  Directive,
  EventEmitter,
  Output,
  ElementRef,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[reconClickOutside]',
})
export class ClickOutsideDirective {
  @Output() reconClickOutside = new EventEmitter<void>();
  constructor(private elementRef: ElementRef) {
    console.log(elementRef, 'ref');
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.reconClickOutside.emit();
    }
  }
}
