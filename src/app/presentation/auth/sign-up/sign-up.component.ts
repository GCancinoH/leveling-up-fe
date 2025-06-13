import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// Material
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
// RxJS
import { catchError, combineLatestWith, debounceTime, delay, distinctUntilChanged, filter, of, startWith, switchMap, tap } from 'rxjs';
// Services
import { AuthService } from '@services/auth.service';
// Components
import { MeasurementsComponent } from './components/measurements/measurements.component';
import { WelcomeScreenComponent } from './components/welcome-screen/welcome-screen.component';
import { CounterScreenComponent } from './components/counter-screen/counter-screen.component';
import { AccountScreenComponent } from './components/account-screen/account-screen.component';
import { PersonalInformationScreenComponent } from './components/personal-information-screen/personal-information-screen.component';
import { PhysicalAttributesScreenComponent } from './components/physical-attributes-screen/physical-attributes-screen.component';
import { BodyCompositionScreenComponent } from './components/body-composition-screen/body-composition-screen.component';
import { ImprovementsScreenComponent } from './components/improvements-screen/improvements-screen.component';
import { PhotosScreenComponent } from './components/photos-screen/photos-screen.component';
import { FinishScreenComponent } from './components/finish-screen/finish-screen.component';
// Models
import { BodyComposition, BodyMeasurements, PersonalInformation, PhysicalAttributes, SignupData } from '@models/signup-steps';
import { InitialDataMeasurements } from '@models/player/initialData/measurements';
import { AccountDetails } from '@models/signup-steps';
// Utils
import { DateUtils } from '../../../data/utils/DateUtils';
import { NutritionUtils } from '../../../data/utils/NutritionUtils';
import { ValidatorsUtils } from '../../../data/utils/ValidatorsUtils';
// animations
import { FADE_IN_ANIMATION } from '@utils/animations/fade-in.animation';


@Component({
  selector: 'app-sign-up',
  providers: [ provideNativeDateAdapter() ],
  imports: [
    ReactiveFormsModule, FormsModule, 
    WelcomeScreenComponent, CounterScreenComponent, 
    AccountScreenComponent, PersonalInformationScreenComponent, PhysicalAttributesScreenComponent,
    BodyCompositionScreenComponent, ImprovementsScreenComponent, PhotosScreenComponent,
    MeasurementsComponent, FinishScreenComponent
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  animations: [FADE_IN_ANIMATION],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpComponent {
  // injectors
  private readonly _authService = inject(AuthService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _snackBar = inject(MatSnackBar);
  // variables
  initialBodyMeasurementsValues!: InitialDataMeasurements;
  //signupForm: FormGroup;
  today = new Date();
  // signals
  currentStep = signal(2);
  isLoading = signal(false);
  accountDetails = signal<AccountDetails>({});
  signupData = signal<Partial<SignupData>>({});
  improvementData = signal<string[]>([]);
  photosData = signal<string[]>([]);


  welcomeEmittedValue(value: any) {
    if(value) this.currentStep.update(() => 1);
  }

  countDownEmitted(value: any) {
    if(value) this.currentStep.update(() => 2);
  }

  accountEmittedValue(value: AccountDetails) : void {
    if (value) this.accountDetails.set(value);
    if (this.accountDetails() != null) this.currentStep.update(() => 3);
  }

  personalDataEmittedValue(value: PersonalInformation) {
    if (value) {
      this.signupData.set({ personalInformation: value });
      this.currentStep.update(() => 4);
    }    
  }

  physicalDataEmittedValue(value: PhysicalAttributes) {
    if (value) {
      this.signupData.set({ physicalAttributes: value });
      this.currentStep.update(() => 5);
    }
  }

  bodyCompositionEmittedValue(value: BodyComposition) {
    if (value) {
      this.signupData.set({ bodyComposition: value });
      this.currentStep.update(() => 6);
    }
  }

  bodyMeasurementsEmittedValue(value: BodyMeasurements) {
    if (value) {
      this.signupData.set({ bodyMeasurements: value });
      this.currentStep.update(() => 7);
    }
  }

  improvementsEmittedValue(value: string[] | undefined) {
    if (value) {
      this.improvementData.set(value);
      this.currentStep.update(() => 8);
    }
  }

  photosEmittedValue(value: string[]) {
    if (value) {
      this.photosData.set(value);
      this.currentStep.update(() => 9);
    }
  }
  
  goToStep(step: number): void {
    this.currentStep.update(() => step);
  }
}