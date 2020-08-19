import {
  Directive,
  EventEmitter,
  Output,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { buffer, debounceTime, filter, map } from 'rxjs/operators';

@Directive({
  selector: '[reconDoubleClick]',
})
export class DoubleClickDirective implements OnInit, OnDestroy {
  private click$ = new Subject<MouseEvent>();

  @Output('reconDoubleClick')
  doubleClick = new EventEmitter<MouseEvent>();

  @HostListener('click', ['$event'])
  onClick(event) {
    this.click$.next(event);
  }

  ngOnInit() {
    this.click$
      .pipe(
        buffer(this.click$.pipe(debounceTime(250))),
        filter((list) => list.length === 2),
        map((list) => list[1])
      )
      .subscribe(this.doubleClick);
  }

  ngOnDestroy() {
    this.click$.complete();
  }
}
