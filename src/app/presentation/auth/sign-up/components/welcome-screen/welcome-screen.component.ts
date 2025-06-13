import { ChangeDetectionStrategy, Component, DestroyRef, inject, output, OutputEmitterRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FADE_IN_ANIMATION } from '@utils/animations/fade-in.animation';
import { map, Observable, startWith, takeWhile, tap, timer } from 'rxjs';

@Component({
  selector: 'welcome-screen',
  imports: [],
  templateUrl: './welcome-screen.component.html',
  styleUrl: './welcome-screen.component.scss',
  animations: [FADE_IN_ANIMATION],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeScreenComponent {
  // injects
    private readonly _destroyRef = inject(DestroyRef);
  // variables
  initialCountdownValue = 6;
  // signals
  // input, output
  timerGone = output<boolean>();
  // observables
  countdown$: Observable<number> = timer(0, 1000).pipe(
    map(elapsedSeconds => this.initialCountdownValue - elapsedSeconds),
    takeWhile(val => val >= 0),
    startWith(this.initialCountdownValue)
  );
  // subscriptions

  ngOnInit(): void {
    this.countdown$.pipe(
    tap((seconds) => {
      if (seconds === 0) {
        this.timerGone.emit(true);
      }
    }),
      takeUntilDestroyed(this._destroyRef)
    ).subscribe((res) => { console.log(res) });
  }
}
