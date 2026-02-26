import { Directive, HostListener, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appDebounce]',
  standalone: true
})
export class DebounceDirective implements OnInit, OnDestroy {
  @Input() debounceTime = 300;
  @Output() debounceEvent = new EventEmitter<Event>();

  private subject = new Subject<Event>();
  private subscription: Subscription | null = null;

  ngOnInit() {
    this.subscription = this.subject
      .pipe(debounceTime(this.debounceTime))
      .subscribe(event => this.debounceEvent.emit(event));
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: Event) {
    this.subject.next(event);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.subject.complete();
  }
}
