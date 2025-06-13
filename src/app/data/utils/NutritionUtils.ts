export class NutritionUtils {

    static calculateBMI(height: number, weight: number): number {
        const heightInM = height / 100;
        const bmi = weight / (heightInM * heightInM);
        return parseFloat(bmi.toFixed(2)); // Round to 2 decimal places
    }
}