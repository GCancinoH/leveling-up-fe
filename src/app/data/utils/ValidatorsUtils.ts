import { AbstractControl, ValidationErrors } from "@angular/forms";

export class ValidatorsUtils {
    static cmMeasurementValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (value === null || value === undefined || value === '') {
            return null; // Don't validate empty values
        }
        if (typeof value !== 'number' || !/^\d+(\.\d{1,2})?$/.test(value.toString())) {
            return { invalidCmMeasurement: true };
        }
        return null;
    }
}