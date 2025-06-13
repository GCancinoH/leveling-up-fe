import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '@services/auth.service';
@Component({
  selector: 'app-sign-in',
  imports: [
    ReactiveFormsModule,
    MatButton, MatFormFieldModule, MatInputModule, MatProgressSpinner,
    TranslateModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  // injectors
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly snackbar = inject(MatSnackBar);
  private readonly translator = inject(TranslateService);
  // signals
  isLoading = signal(false);
  hidePassword = signal(true);
  // variables
  signInForm: FormGroup;

  constructor() {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    // Setting loading status to true
    this.isLoading.update(() => true);

    // Check if form is valid
    if(!this.signInForm.valid) {
      this.snackbar.open("The form is invalid.", "x", {
        duration: 4000
      });
      return;
    }

    const {email, password} = this.signInForm.value;
    this.authService.signInWithEmailAndPassword(email, password).then(({ player, error }) => {
      if(player) {
        this.router.navigateByUrl('player/dashboard');
      } else if (error) {
        this.snackbar.open(error, "x", {
          duration: 4000
        });
      }
    }).finally(() => {
      this.isLoading.update(() => false);
    })

  }

  getEmailErrorMessage() {}

  getPasswordErrorMessage() {}

  signInWithGoogle() {}

  navigateToSignUp() { this.router.navigateByUrl('sign-up'); }

}
