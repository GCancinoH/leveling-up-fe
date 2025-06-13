import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
// material
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';  
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
// services
import { AuthService } from '@services/auth.service';
// models
import { AccountDetails } from '@models/signup-steps';
// components, directives
import { SpacerComponent } from '@libs/compose-ui/spacer/spacer.component';
import { FADE_IN_ANIMATION } from '@utils/animations/fade-in.animation';
import { AutoFocusNextDirective } from '@directives/auto-focus-next.directive';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'account-screen',
  imports: [
    ReactiveFormsModule,
    MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions,
    MatIconButton, MatFormFieldModule, MatIcon, MatInputModule,
    SpacerComponent,
    AutoFocusNextDirective
  ],
  templateUrl: './account-screen.component.html',
  styleUrl: './account-screen.component.scss',
  animations: [FADE_IN_ANIMATION],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountScreenComponent {
  // injects
  private readonly _authService = inject(AuthService);
  private readonly _fb = inject(FormBuilder);
  private readonly _snackbar = inject(MatSnackBar);
  // variables
  accountForm = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  // signals
  // input, output
  accountData = output<AccountDetails>();

  // methods
  constructor() {}

  emitValue() : void {
    const { email, password } = this.accountForm.value;

    if (!this.accountForm.valid) return;
    
    this._authService.signUpWithEmailAndPassword(email!, password!).then((user) => {
      if(user) this.accountData.emit(user.player!); 
    }).catch((error) => {
      this._snackbar.open(error, '', { duration: 5000 });
    });
  }
}
