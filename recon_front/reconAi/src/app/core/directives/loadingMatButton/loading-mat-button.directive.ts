import { NgControl } from '@angular/forms';
import {
  Directive,
  Input,
  ElementRef,
  OnInit,
  Component,
  SimpleChanges,
  OnChanges,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  Renderer2,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSpinner } from '@angular/material/progress-spinner';

// @Component({ template: `home` })
// export class SpinnerComponent {}

@Directive({
  selector: '[reconLoadingMatButton]',
})
export class LoadingMatButtonDirective {
  // @Input() reconLoadingMatButton = false;
  // spinner: MatSpinner;
  // text: string;

  // constructor(
  //   private el: ElementRef,
  //   private renderer: Renderer2,
  //   private viewContainerRef: ViewContainerRef,
  //   private componentFactoryResolver: ComponentFactoryResolver
  // ) {}

  // ngOnInit() {
  //   this.text = this.el.nativeElement.innerText;

  //   // Set the button to maintain the same dimensions, even once we put the spinner inside.
  //   this.el.nativeElement.style.width = `${
  //     (this.el.nativeElement as HTMLElement).offsetWidth
  //   }px`;
  //   this.el.nativeElement.style.height = `${
  //     (this.el.nativeElement as HTMLElement).offsetHeight
  //   }px`;

  //   // Create the spinner
  //   const factory = this.componentFactoryResolver.resolveComponentFactory(
  //     MatSpinner
  //   );
  //   const componentRef = this.viewContainerRef.createComponent(factory);
  //   this.spinner = componentRef.instance;

  //   // Configure the spinner
  //   this.spinner.strokeWidth = 3;
  //   this.spinner.diameter = 24;

  //   // Hide the spinner
  //   this.renderer.setStyle(
  //     this.spinner._elementRef.nativeElement,
  //     'display',
  //     'none'
  //   );

  //   // Apply new styles to the button content's container
  //   const span = this.el.nativeElement.querySelector(
  //     '.mat-button-wrapper'
  //   ) as HTMLSpanElement;
  //   this.renderer.setStyle(span, 'display', 'flex');
  //   this.renderer.setStyle(span, 'align-items', 'center');
  //   this.renderer.setStyle(span, 'justify-content', 'center');
  // }

  // ngOnInit(): void {
  //   console.log(
  //     this.el,
  //     'FROM DIRECTiVE'
  //   );
  // }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (
  //     changes.reconLoadingMatButton.currentValue !==
  //     changes.reconLoadingMatButton.previousValue
  //   ) {
  //     if (changes.reconLoadingMatButton.currentValue) {
  //       // this.el.nativeElement.innerText = 'pizda';
  //     }
  //   }
  // }
  // setLoadingStatus()
}
