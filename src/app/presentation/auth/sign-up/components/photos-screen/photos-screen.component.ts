import { ChangeDetectionStrategy, Component, DestroyRef, inject, output, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
// Material
import { MatCard, MatCardTitle, MatCardHeader, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
// Models
import { Improvements } from '@models/signup-steps';
// components
import { SpacerComponent } from '@libs/compose-ui/spacer/spacer.component';
// animations
import { FADE_IN_ANIMATION } from '@utils/animations/fade-in.animation';

@Component({
  selector: 'photos-screen',
  imports: [
    ReactiveFormsModule,
    MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions,
    MatInputModule, MatFormFieldModule, MatDatepickerModule,
    MatSelectModule, MatIconButton, MatIcon,
    SpacerComponent
  ],
  templateUrl: './photos-screen.component.html',
  styleUrl: './photos-screen.component.scss',
  animations: [FADE_IN_ANIMATION],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotosScreenComponent {
  // signals
  imagePreviews = signal<string[]>([]);
  // input, output
  imageData = output<string[]>();
  
  // methods
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);
    const readers = files.map(file => this._readFileAsDataURL(file));

    // Read all files and set previews
    Promise.all(readers).then(base64s => this.imagePreviews.set(base64s));
  }

  removeImage(index: number) {
    const currentImages = this.imagePreviews();
    const updatedImages = currentImages.filter((_, i) => i !== index);
    this.imagePreviews.set(updatedImages);
  }

  emitValue() : void {
    if (!this.imagePreviews()) return;

    this.imageData.emit(this.imagePreviews());
    
  }

  private _readFileAsDataURL(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

}
