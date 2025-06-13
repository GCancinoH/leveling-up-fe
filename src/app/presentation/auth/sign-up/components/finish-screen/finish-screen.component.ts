import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SignupData } from '@models/signup-steps';
import { FADE_IN_ANIMATION } from '@utils/animations/fade-in.animation';

@Component({
  selector: 'finish-screen',
  imports: [],
  templateUrl: './finish-screen.component.html',
  styleUrl: './finish-screen.component.scss',
  animations: [FADE_IN_ANIMATION],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinishScreenComponent {
  // injects
  // input, output
  finishData = input.required<SignupData>;
}
