import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { AccountDetails } from '@models/signup-steps';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // injectors
  private readonly auth = inject(Auth);
  private readonly db = inject(Firestore);

  constructor() { }

  async signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<{ player?: User, error?: string }> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return { player: result.user };
    } catch (error: any) {
      console.log(error.code);
  
      let message = 'Unexpected error occurred.';
      switch (error.code) {
        case 'auth/user-not-found':
          message = 'No player found with this email.';
          break;
        case 'auth/wrong-password':
          message = 'Incorrect password.';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email address.';
          break;
        case 'auth/invalid-credential':
          message = 'Invalid credentials.';
          break;
        default:
          message = 'Login failed.';
      }
  
      return { error: message };
    }
  }

  async signUpWithEmailAndPassword(
    email: string,
    password: string
  ) : Promise<{ player?: AccountDetails, error?: string }>
  {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      const data: AccountDetails = {
        email: result.user.email!,
        uid: result.user.uid
      }
      return { player: data };
    } catch (error: any) {
      console.log(error.code);
      return { error: error.code }
    }
  }
  
}
