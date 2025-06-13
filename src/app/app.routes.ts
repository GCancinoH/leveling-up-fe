import { Routes } from '@angular/router';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo, hasCustomClaim } from '@angular/fire/auth-guard';

// Auth Guard Variables
const adminOnly = () => hasCustomClaim('admin');
const redirectToSignIn = () => redirectUnauthorizedTo('sign-in');
const redirectToDashboard = () => redirectLoggedInTo('player/dashboard');

export const routes: Routes = [
    { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
    {
        path: 'sign-in',
        loadComponent: () => import('./presentation/auth/sign-in/sign-in.component').then(m => m.SignInComponent),
        title: 'Sign In | Leveling Up',
        ...canActivate(redirectToDashboard)
    },
    {
        path: 'sign-up',
        loadComponent: () => import('./presentation/auth/sign-up/sign-up.component').then(m => m.SignUpComponent),
        title: 'Sign Up | Leveling Up',
        ...canActivate(redirectToDashboard)
    },
    {
        path: 'player/dashboard',
        loadComponent: () => import('./presentation/player/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard | Leveling Up',
        ...canActivate(redirectToSignIn)
    }
];
