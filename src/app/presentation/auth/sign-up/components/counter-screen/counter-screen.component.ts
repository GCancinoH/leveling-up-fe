import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, output } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// Components
import { SpacerComponent } from '@libs/compose-ui/spacer/spacer.component';
// Utils
import { FADE_IN_ANIMATION } from '@utils/animations/fade-in.animation';
import { BehaviorSubject, map, takeWhile, timer } from 'rxjs';


@Component({
  selector: 'counter-screen',
  imports: [
    AsyncPipe, NgClass,
    SpacerComponent
  ],
  templateUrl: './counter-screen.component.html',
  styleUrl: './counter-screen.component.scss',
  animations: [FADE_IN_ANIMATION],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterScreenComponent implements OnInit {
  // injects
  private readonly _destroyRef = inject(DestroyRef);
  // observables
  countDown$ = new BehaviorSubject(10);
  // signals
  // input, outputs
  accepted = output<boolean>();

  ngOnInit(): void {
    this.startCountdown();    
  }

  accept(): void {
    this.accepted.emit(true);
  }

  decline(): void {
    window.location.href = "https://google.com";
    this.accepted.emit(false);
  }

  private startCountdown(): void {
    timer(0, 1000).pipe(
      map(i => 10 - i),
      takeWhile(count => count >= 0),
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(count => {
      this.countDown$.next(count);
      if (count === 0) {
        this.decline();
      }
    });
  }



}
